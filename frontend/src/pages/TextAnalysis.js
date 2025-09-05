import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  TextIcon, 
  CheckCircleIcon, 
  WarningIcon, 
  AlertIcon,
  LoadingIcon,
} from '../assets/icons';
import { apiService } from '../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(26,31,58,0.9) 0%, rgba(42,47,90,0.9) 100%)',
  border: '1px solid rgba(0,255,255,0.3)',
  boxShadow: '0 8px 32px rgba(0,255,255,0.1)',
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
}));

const AnalyzeButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #00ffff 0%, #00cc99 100%)',
  color: '#0a0e27',
  padding: '12px 32px',
  borderRadius: '12px',
  textTransform: 'uppercase',
  fontWeight: 700,
  fontSize: '16px',
  letterSpacing: '0.02em',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(0,255,255,0.3)',
  boxShadow: '0 0 20px rgba(0,255,255,0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #00ff41 0%, #00cc33 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,255,255, 0.4), 0 0 30px rgba(0,255,255,0.5)',
    border: '1px solid rgba(0,255,255,0.6)',
  },
  '&:disabled': {
    background: '#4a5568',
    color: '#a0aec0',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(26,31,58,0.8)',
    color: '#ffffff',
    border: '1px solid rgba(0,255,255,0.3)',
    '& fieldset': {
      borderColor: 'rgba(0,255,255,0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0,255,255,0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00ffff',
      boxShadow: '0 0 20px rgba(0,255,255,0.3)',
    },
    '& .MuiInputBase-input': {
      color: '#ffffff',
      '&::placeholder': {
        color: 'rgba(255,255,255,0.6)',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.7)',
    '&.Mui-focused': {
      color: '#00ffff',
    },
  },
}));

const ResultCard = styled(Paper)(({ theme, riskLevel }) => {
  const getColors = () => {
    switch (riskLevel) {
      case 'high': 
        return {
          bg: 'linear-gradient(135deg, rgba(255,0,64,0.1) 0%, rgba(204,0,51,0.1) 100%)',
          border: 'rgba(255,0,64,0.5)',
          text: '#ff0040',
          glow: '0 0 20px rgba(255,0,64,0.3)'
        };
      case 'medium': 
        return {
          bg: 'linear-gradient(135deg, rgba(255,149,0,0.1) 0%, rgba(204,119,0,0.1) 100%)',
          border: 'rgba(255,149,0,0.5)',
          text: '#ff9500',
          glow: '0 0 20px rgba(255,149,0,0.3)'
        };
      case 'low': 
        return {
          bg: 'linear-gradient(135deg, rgba(0,255,65,0.1) 0%, rgba(0,204,51,0.1) 100%)',
          border: 'rgba(0,255,65,0.5)',
          text: '#00ff41',
          glow: '0 0 20px rgba(0,255,65,0.3)'
        };
      case 'none': 
        return {
          bg: 'linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(0,204,204,0.1) 100%)',
          border: 'rgba(0,255,255,0.5)',
          text: '#00ffff',
          glow: '0 0 20px rgba(0,255,255,0.3)'
        };
      default: 
        return {
          bg: 'linear-gradient(135deg, rgba(26,31,58,0.8) 0%, rgba(42,47,90,0.8) 100%)',
          border: 'rgba(0,255,255,0.3)',
          text: '#00ffff',
          glow: '0 0 20px rgba(0,255,255,0.3)'
        };
    }
  };

  const colors = getColors();
  
  return {
    background: colors.bg,
    border: `2px solid ${colors.border}`,
    borderRadius: '16px',
    padding: '24px',
    color: colors.text,
    marginTop: '24px',
    boxShadow: colors.glow,
    backdropFilter: 'blur(10px)',
    animation: 'scaleIn 0.4s ease-out',
    '& .MuiTypography-root': {
      color: '#ffffff',
    },
    '& .MuiChip-root': {
      backgroundColor: colors.border,
      color: colors.text,
      fontWeight: 600,
    },
  };
});

const getRiskIcon = (risk) => {
  switch (risk) {
    case 'high': return <AlertIcon size={24} />;
    case 'low': return <WarningIcon size={24} />;
    case 'none': return <CheckCircleIcon size={24} />;
    default: return <TextIcon size={24} />;
  }
};

const getRiskMessage = (risk, confidence) => {
  const confidencePercent = Math.round(confidence * 100);
  
  switch (risk) {
    case 'high':
      return {
        title: 'High Risk Detected',
        message: `This text shows strong indicators of spam, fraud, or malicious content with ${confidencePercent}% confidence.`,
        recommendations: [
          'Do not click any links or download attachments',
          'Do not provide personal or financial information',
          'Report this message to your security team',
          'Delete or mark as spam immediately',
        ]
      };
    case 'low':
      return {
        title: 'Potential Risk Detected',
        message: `This text contains some suspicious patterns with ${confidencePercent}% confidence.`,
        recommendations: [
          'Exercise caution with this content',
          'Verify the sender through alternative means',
          'Do not rush into any actions requested',
          'Double-check any links before clicking',
        ]
      };
    case 'none':
      return {
        title: 'Content Appears Safe',
        message: `No significant threat indicators detected with ${confidencePercent}% confidence.`,
        recommendations: [
          'Content appears legitimate',
          'Continue with normal security practices',
          'Still verify sender if unknown',
          'Report if you notice anything suspicious',
        ]
      };
    default:
      return {
        title: 'Analysis Complete',
        message: 'Text has been analyzed for potential threats.',
        recommendations: []
      };
  }
};

const TextAnalysis = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await apiService.analyzeText(text);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleAnalyze();
    }
  };

  const riskInfo = result ? getRiskMessage(result.risk, result.confidence) : null;

  return (
    <Box className="fade-in">
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
        Text Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Analyze text content for spam, fraud, and malicious patterns using AI-powered detection
      </Typography>

      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <TextIcon size={28} color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Enter Text for Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Paste suspicious messages, emails, or any text content
              </Typography>
            </Box>
          </Box>

          <StyledTextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            placeholder="Paste your text here for analysis... 

Examples:
• Email messages
• SMS/text messages  
• Social media posts
• Website content
• Chat messages"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 3 }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Press Ctrl+Enter to analyze quickly
            </Typography>
            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              startIcon={loading ? <LoadingIcon size={20} /> : <TextIcon size={20} />}
            >
              {loading ? 'Analyzing...' : 'Analyze Text'}
            </AnalyzeButton>
          </Box>
        </CardContent>
      </StyledCard>

      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {result && (
        <ResultCard riskLevel={result.risk}>
          <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
            {getRiskIcon(result.risk)}
            <Box flex={1}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {riskInfo.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {riskInfo.message}
              </Typography>
              
              <Box display="flex" gap={1} mt={2} mb={3}>
                <Chip 
                  label={`Risk: ${result.risk.toUpperCase()}`} 
                  color={result.risk === 'high' ? 'error' : result.risk === 'low' ? 'warning' : 'success'}
                  variant="filled"
                />
                <Chip 
                  label={`Confidence: ${Math.round(result.confidence * 100)}%`} 
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recommended Actions
          </Typography>
          <List dense>
            {riskInfo.recommendations.map((recommendation, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon size={16} />
                </ListItemIcon>
                <ListItemText 
                  primary={recommendation}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>

          {result.result && (result.result.fallback || result.result.patterns) && (
            <>
              <Divider sx={{ my: 3 }} />
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              >
                {showDetails ? 'Hide' : 'Show'} Analysis Details
              </Button>
              
              <Collapse in={showDetails}>
                <Box mt={2} p={2} bgcolor="rgba(0,0,0,0.05)" borderRadius="8px">
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    Technical Details:
                  </Typography>
                  
                  {result.result.patterns && result.result.patterns.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="caption" fontWeight={600}>
                        Detected Patterns:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                        {result.result.patterns.map((pattern, index) => (
                          <Chip key={index} label={pattern} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {result.result.compositeScore && (
                    <Typography variant="caption" display="block">
                      Composite Score: {result.result.compositeScore}
                    </Typography>
                  )}
                  
                  {result.result.fallback && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Analysis method: Pattern-based detection (API fallback)
                    </Typography>
                  )}
                </Box>
              </Collapse>
            </>
          )}
        </ResultCard>
      )}
    </Box>
  );
};

export default TextAnalysis;
