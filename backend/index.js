// Entry point for Express backend
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for larger texts
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

const axios = require('axios');
const multer = require('multer');
const upload = multer();

// In-memory history (replace with DB for production)
let history = [];

// --- File Analysis (Scanii) ---
app.post('/analyze/file', upload.single('file'), async (req, res) => {
  console.log('Received file analysis request:', req.file && req.file.originalname);
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    
    let risk = 'low';
    let confidence = 0.85;
    let result = {};
    
    try {
      // Try Scanii API first
      const scaniiKey = 'f6a27196b75409fd7358e154da9a6a8a';
      const scaniiSecret = ''; // Note: Empty secret for demo
      const scaniiUrl = 'https://api-us1.scanii.com/v2.2/files';
      
      if (scaniiSecret) {
        const response = await axios.post(scaniiUrl, file.buffer, {
          auth: { username: scaniiKey, password: scaniiSecret },
          headers: { 'Content-Type': file.mimetype },
          params: { filename: file.originalname },
        });
        result = response.data;
        risk = result.findings && result.findings.length > 0 ? 'high' : 'low';
        confidence = result.findings && result.findings.length > 0 ? 0.95 : 0.90;
      } else {
        throw new Error('Scanii API not configured - using fallback analysis');
      }
    } catch (apiErr) {
      console.log('Scanii API error, using fallback analysis:', apiErr.message);
      
      // Fallback: Basic file analysis based on file properties
      const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.jar'];
      const riskExtensions = ['.zip', '.rar', '.7z', '.gz', '.tar'];
      const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
      
      if (suspiciousExtensions.includes(fileExt)) {
        risk = 'high';
        confidence = 0.85;
        result = {
          analysis: 'fallback',
          reason: `Potentially dangerous file type: ${fileExt}`,
          fileType: fileExt,
          size: file.size
        };
      } else if (riskExtensions.includes(fileExt)) {
        risk = 'medium';
        confidence = 0.70;
        result = {
          analysis: 'fallback',
          reason: `Archive file requiring caution: ${fileExt}`,
          fileType: fileExt,
          size: file.size
        };
      } else if (file.size > 50 * 1024 * 1024) { // Files larger than 50MB
        risk = 'medium';
        confidence = 0.65;
        result = {
          analysis: 'fallback',
          reason: 'Large file size may indicate risk',
          fileType: fileExt,
          size: file.size
        };
      } else {
        risk = 'low';
        confidence = 0.80;
        result = {
          analysis: 'fallback',
          reason: 'File appears safe based on basic analysis',
          fileType: fileExt,
          size: file.size
        };
      }
    }
    
    const entry = { type: 'file', input: file.originalname, risk, confidence, result, date: new Date() };
    history.push(entry);
    console.log('File analysis result:', { risk, confidence, fileType: result.fileType });
    res.json({ risk, confidence, result });
  } catch (err) {
    console.error('File analysis error:', err);
    res.status(500).json({ error: 'File analysis failed', details: err.message });
  }
});

// --- Text Analysis (Hugging Face) ---
app.post('/analyze/text', async (req, res) => {
  console.log('=== TEXT ANALYSIS REQUEST ===');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Body type:', typeof req.body);
  console.log('Text value:', req.body?.text);
  
  try {
    // Validate request body exists
    if (!req.body) {
      console.error('ERROR: No request body found');
      return res.status(400).json({ 
        error: 'No request body provided',
        details: 'Request must include JSON body with text field'
      });
    }

    const { text } = req.body;
    
    // Validate text input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.error('ERROR: Invalid text input:', { text, type: typeof text });
      return res.status(400).json({ 
        error: 'No valid text provided',
        details: 'Text field must be a non-empty string'
      });
    }
    
    console.log(`Processing text analysis for: "${text.substring(0, 50)}..."`);
    
    let risk = 'none', confidence = 0.99, result = { safe: true };
    
    try {
      const hfToken = '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';
      const hfUrl = 'https://api-inference.huggingface.co/models/mrm8488/bert-tiny-finetuned-sms-spam-detection';
      
      console.log('Calling Hugging Face API...');
      const response = await axios.post(hfUrl, { inputs: text }, {
        headers: { Authorization: `Bearer ${hfToken}` },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('Hugging Face API response:', response.data);
      result = response.data;
      
      // Parse result for spam/fraud
      if (Array.isArray(result) && result[0] && result[0].label && typeof result[0].score === 'number') {
        const label = result[0].label.toLowerCase();
        confidence = result[0].score;
        console.log(`HF Analysis: label="${label}", score=${confidence}`);
        
        if (label.includes('spam') || label.includes('fraud')) {
          risk = confidence > 0.8 ? 'high' : 'low';
        }
      } else {
        console.log('Unexpected HF response format, using fallback');
        throw new Error('Unexpected API response format');
      }
    } catch (apiErr) {
      console.log('Hugging Face API error, using fallback analysis:');
      console.error('API Error details:', {
        message: apiErr.message,
        status: apiErr.response?.status,
        statusText: apiErr.response?.statusText,
        data: apiErr.response?.data
      });
      
      // Fallback: simple pattern-based fraud/spam detection
      const spamPatterns = [
        'free money', 'click here', 'congratulations', 'you have won', 'claim now',
        'urgent', 'limited time', 'act now', 'call immediately', 'guaranteed',
        'make money fast', 'no risk', '100% free', 'credit card', 'social security',
        'winner', 'prize', 'lottery', 'inheritance', 'verify account', 'suspended',
        'bank account', 'wire transfer', 'bitcoin', 'cryptocurrency', 'investment opportunity',
        'get rich quick', 'work from home', 'earn money online', 'cash prize',
        'tax refund', 'irs', 'government grant', 'loan approved', 'debt consolidation'
      ];
      
      const urgencyWords = ['urgent', 'immediate', 'expires', 'limited time', 'hurry', 'act now'];
      const moneyWords = ['money', 'cash', 'prize', 'reward', 'payment', 'refund', 'loan'];
      const actionWords = ['click', 'call', 'verify', 'confirm', 'update', 'download'];
      
      const textLower = text.toLowerCase();
      const matchedPatterns = spamPatterns.filter(pattern => textLower.includes(pattern));
      const urgencyMatches = urgencyWords.filter(word => textLower.includes(word));
      const moneyMatches = moneyWords.filter(word => textLower.includes(word));
      const actionMatches = actionWords.filter(word => textLower.includes(word));
      
      const spamScore = matchedPatterns.length;
      const compositeScore = spamScore + (urgencyMatches.length * 0.5) + (moneyMatches.length * 0.3) + (actionMatches.length * 0.2);
      
      console.log(`Fallback analysis: found ${spamScore} spam patterns, composite score: ${compositeScore}:`, matchedPatterns);
      
      if (compositeScore >= 3) {
        risk = 'high';
        confidence = Math.min(0.95, 0.80 + (compositeScore * 0.05));
        result = { 
          fallback: true, 
          reason: `High spam indicators detected`,
          patterns: matchedPatterns,
          urgencyWords: urgencyMatches,
          moneyWords: moneyMatches,
          actionWords: actionMatches,
          compositeScore: compositeScore.toFixed(2)
        };
      } else if (compositeScore >= 1.5) {
        risk = 'low';
        confidence = Math.min(0.85, 0.60 + (compositeScore * 0.1));
        result = { 
          fallback: true, 
          reason: `Some spam indicators detected`,
          patterns: matchedPatterns,
          urgencyWords: urgencyMatches,
          moneyWords: moneyMatches,
          actionWords: actionMatches,
          compositeScore: compositeScore.toFixed(2)
        };
      } else {
        confidence = Math.max(0.90, 0.95 - (compositeScore * 0.1));
        result = { 
          fallback: true, 
          reason: 'minimal spam indicators detected',
          patterns: [],
          compositeScore: compositeScore.toFixed(2)
        };
      }
    }
    
    const entry = { type: 'text', input: text, risk, confidence, result, date: new Date() };
    history.push(entry);
    
    console.log('Final analysis result:', { risk, confidence, resultType: typeof result });
    console.log('=== TEXT ANALYSIS COMPLETE ===');
    
    res.json({ risk, confidence, result });
    
  } catch (err) {
    console.error('=== TEXT ANALYSIS FATAL ERROR ===');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Request details:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    });
    
    res.status(500).json({ 
      error: 'Text analysis failed', 
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
});// --- URL Analysis (Google Safe Browsing) ---
app.post('/analyze/url', async (req, res) => {
  console.log('Received URL analysis request:', req.body && req.body.url);
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });
    
    let risk = 'none', confidence = 0.99, result = { safe: true };
    
    try {
      const apiKey = 'AIzaSyAQ3pBHRELTWYTlNe9wspLm7ZNhhyohdS4';
      const gsbUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
      const body = {
        client: { clientId: 'cb-project', clientVersion: '1.0' },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      };
      const response = await axios.post(gsbUrl, body);
      result = response.data;
      if (result && result.matches && result.matches.length > 0) {
        risk = 'high';
        confidence = 0.95;
      }
    } catch (apiErr) {
      console.log('Google Safe Browsing API error, using fallback analysis:', apiErr.message);
      // Fallback: simple pattern-based risk assessment
      const suspiciousPatterns = [
        'bit.ly', 'tinyurl.com', 'malware', 'phishing', 'scam', 'hack', 'free-money',
        'click-here', 'suspicious', 'malicious', 'virus', 'trojan'
      ];
      const urlLower = url.toLowerCase();
      const isSuspicious = suspiciousPatterns.some(pattern => urlLower.includes(pattern));
      if (isSuspicious) {
        risk = 'high';
        confidence = 0.85;
        result = { fallback: true, reason: 'suspicious pattern detected' };
      } else {
        result = { fallback: true, reason: 'no suspicious patterns' };
      }
    }
    
    const entry = { type: 'url', input: url, risk, confidence, result, date: new Date() };
    history.push(entry);
    console.log('URL analysis result:', { risk, confidence });
    res.json({ risk, confidence, result });
  } catch (err) {
    console.error('URL analysis error:', err);
    res.status(500).json({ error: 'URL analysis failed', details: err.message });
  }
});// --- History Endpoint ---
app.get('/history', (req, res) => {
  console.log('History requested');
  res.json(history.slice(-100).reverse()); // last 100 entries
});

// --- Delete History Endpoint ---
app.delete('/history', (req, res) => {
  console.log('History deletion requested');
  history.length = 0; // Clear the history array
  res.json({ message: 'History cleared successfully', timestamp: new Date().toISOString() });
});

// --- Analytics Endpoint ---
app.get('/analytics', (req, res) => {
  console.log('Analytics requested');
  const summary = { high: 0, low: 0, none: 0 };
  history.forEach(h => { summary[h.risk] = (summary[h.risk] || 0) + 1; });
  const total = history.length || 1;
  res.json({
    high: { count: summary.high, percent: (summary.high / total * 100).toFixed(1) },
    low: { count: summary.low, percent: (summary.low / total * 100).toFixed(1) },
    none: { count: summary.none, percent: (summary.none / total * 100).toFixed(1) },
    total,
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'CB-Project backend running',
    timestamp: new Date().toISOString(),
    endpoints: ['/analyze/text', '/analyze/url', '/analyze/file', '/history', '/analytics']
  });
});

// Test endpoint to verify JSON parsing
app.post('/test', (req, res) => {
  console.log('Test endpoint - body:', req.body);
  res.json({ 
    received: req.body,
    message: 'JSON parsing working correctly'
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
