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
  Link as MuiLink,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  LinkIcon, 
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

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: 'transparent !important',
  '&.MuiCardContent-root': {
    backgroundColor: 'transparent',
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
    default: return <LinkIcon size={24} />;
  }
};

const getRiskMessage = (risk, confidence, url) => {
  const confidencePercent = Math.round(confidence * 100);
  
  switch (risk) {
    case 'high':
      return {
        title: 'Dangerous URL Detected',
        message: `This URL has been flagged as malicious or harmful with ${confidencePercent}% confidence. It may contain malware, phishing attempts, or other security threats.`,
        recommendations: [
          'DO NOT visit this website',
          'Do not enter any personal information',
          'Do not download any files from this site',
          'Report this URL to your security team',
          'Warn others who may have received this link',
        ]
      };
    case 'low':
      return {
        title: 'Potentially Suspicious URL',
        message: `This URL shows some suspicious characteristics with ${confidencePercent}% confidence. Exercise caution when accessing.`,
        recommendations: [
          'Verify the URL source before visiting',
          'Use caution and avoid entering sensitive data',
          'Consider using a sandboxed browser',
          'Check with others if this link was expected',
          'Scan your device after visiting (if you must)',
        ]
      };
    case 'none':
      return {
        title: 'URL Appears Safe',
        message: `No significant threats detected for this URL with ${confidencePercent}% confidence. However, always exercise caution online.`,
        recommendations: [
          'URL appears to be legitimate',
          'Still verify the sender if unexpected',
          'Keep your browser and security software updated',
          'Be cautious with downloads and personal info',
          'Report if you notice anything suspicious after visiting',
        ]
      };
    default:
      return {
        title: 'URL Analysis Complete',
        message: 'URL has been scanned for potential security threats.',
        recommendations: []
      };
  }
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const formatUrl = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};

const UrlAnalysis = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    const formattedUrl = formatUrl(url.trim());
    
    if (!isValidUrl(formattedUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await apiService.analyzeUrl(formattedUrl);
      setResult({...response, analyzedUrl: formattedUrl});
    } catch (err) {
      setError(err.message || 'URL analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAnalyze();
    }
  };

  const riskInfo = result ? getRiskMessage(result.risk, result.confidence, result.analyzedUrl) : null;

  return (
    <Box className="fade-in">
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
        URL Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Scan URLs and websites for malicious content, phishing attempts, and security threats
      </Typography>

      <StyledCard>
        <StyledCardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <LinkIcon size={28} color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Enter URL for Security Scan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check websites, links, and domains for potential threats
              </Typography>
            </Box>
          </Box>

          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="https://example.com or example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 3 }}
            helperText="Enter any website URL. Protocol (https://) will be added automatically if missing."
          />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Press Enter to analyze quickly
            </Typography>
            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              startIcon={loading ? <LoadingIcon size={20} /> : <LinkIcon size={20} />}
            >
              {loading ? 'Scanning...' : 'Scan URL'}
            </AnalyzeButton>
          </Box>
        </StyledCardContent>
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
              
              <Box mb={2}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Analyzed URL:
                </Typography>
                <MuiLink 
                  href={result.analyzedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    wordBreak: 'break-all',
                    color: 'inherit',
                    textDecoration: result.risk === 'high' ? 'line-through' : 'underline'
                  }}
                >
                  {result.analyzedUrl}
                </MuiLink>
                {result.risk === 'high' && (
                  <Typography variant="caption" display="block" color="error" mt={0.5}>
                    ⚠️ Do not click this link - it has been crossed out for safety
                  </Typography>
                )}
              </Box>
              
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

          {result.result && result.result.fallback && (
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
                  
                  <Typography variant="caption" display="block">
                    Analysis reason: {result.result.reason}
                  </Typography>
                  
                  <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                    Analysis method: Pattern-based detection (Google Safe Browsing API fallback)
                  </Typography>
                </Box>
              </Collapse>
            </>
          )}
        </ResultCard>
      )}
    </Box>
  );
};

export default UrlAnalysis;
