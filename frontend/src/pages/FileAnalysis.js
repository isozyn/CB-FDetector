import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  UploadIcon, 
  DocumentIcon,
  CheckCircleIcon, 
  WarningIcon, 
  AlertIcon,
  LoadingIcon,
} from '../assets/icons';
import { apiService } from '../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  borderRadius: '16px',
}));

const UploadArea = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragOver',
})(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? '#48cab2' : '#e2e8f0'}`,
  borderRadius: '16px',
  padding: '48px 24px',
  textAlign: 'center',
  backgroundColor: isDragOver ? '#f0fdfa' : '#f8fafc',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#48cab2',
    backgroundColor: '#f0fdfa',
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #48cab2 0%, #2dd4bf 100%)',
  color: 'white',
  padding: '12px 32px',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #3ba29c 0%, #26c2a8 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(72, 202, 178, 0.3)',
  },
  '&:disabled': {
    background: '#e2e8f0',
    color: '#94a3b8',
  },
}));

const ResultCard = styled(Paper)(({ theme, riskLevel }) => {
  const getColors = () => {
    switch (riskLevel) {
      case 'high': 
        return {
          bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          border: '#fca5a5',
          text: '#dc2626'
        };
      case 'low': 
        return {
          bg: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
          border: '#fbbf24',
          text: '#d97706'
        };
      case 'none': 
        return {
          bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          border: '#34d399',
          text: '#059669'
        };
      default: 
        return {
          bg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          border: '#818cf8',
          text: '#4338ca'
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
    animation: 'scaleIn 0.4s ease-out',
  };
});

const getRiskIcon = (risk) => {
  switch (risk) {
    case 'high': return <AlertIcon size={24} />;
    case 'low': return <WarningIcon size={24} />;
    case 'none': return <CheckCircleIcon size={24} />;
    default: return <DocumentIcon size={24} />;
  }
};

const getRiskMessage = (risk, confidence, fileName) => {
  const confidencePercent = Math.round(confidence * 100);
  
  switch (risk) {
    case 'high':
      return {
        title: 'Malware Detected',
        message: `This file contains malicious content with ${confidencePercent}% confidence. It poses a significant security threat to your system.`,
        recommendations: [
          'DO NOT open or execute this file',
          'Quarantine or delete the file immediately',
          'Run a full system antivirus scan',
          'Report this file to your security team',
          'Check other files from the same source',
        ]
      };
    case 'low':
      return {
        title: 'Potentially Suspicious File',
        message: `This file shows some suspicious characteristics with ${confidencePercent}% confidence. Exercise caution when handling.`,
        recommendations: [
          'Scan with multiple antivirus engines',
          'Open in a sandboxed environment if needed',
          'Verify the file source and authenticity',
          'Back up important data before opening',
          'Monitor system behavior after opening',
        ]
      };
    case 'none':
      return {
        title: 'File Appears Clean',
        message: `No malware or threats detected in this file with ${confidencePercent}% confidence. The file appears to be safe.`,
        recommendations: [
          'File appears to be legitimate',
          'Still exercise normal security practices',
          'Keep antivirus software updated',
          'Be cautious with executable files',
          'Monitor for any unusual system behavior',
        ]
      };
    default:
      return {
        title: 'File Analysis Complete',
        message: 'File has been scanned for potential security threats.',
        recommendations: []
      };
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileAnalysis = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiService.analyzeFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setResult({...response, fileName: file.name, fileSize: file.size, fileType: file.type});
        setUploadProgress(0);
      }, 500);
      
    } catch (err) {
      setError(err.message || 'File analysis failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const riskInfo = result ? getRiskMessage(result.risk, result.confidence, result.fileName) : null;

  return (
    <Box className="fade-in">
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
        File Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Scan files for malware, viruses, and other security threats using advanced detection engines
      </Typography>

      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <UploadIcon size={28} color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Upload File for Security Scan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select or drag & drop files to scan for threats (Max: 10MB)
              </Typography>
            </Box>
          </Box>

          <UploadArea
            isDragOver={isDragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <Typography variant="h6" gutterBottom>
              {file ? 'File Selected' : 'Drop file here or click to browse'}
            </Typography>
            {file ? (
              <Box>
                <Typography variant="body1" fontWeight={600} gutterBottom>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Supported: Documents, executables, archives, images, and more
              </Typography>
            )}
          </UploadArea>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />

          {loading && uploadProgress > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Uploading and analyzing file...
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ borderRadius: '4px', height: '8px' }}
              />
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
            <Typography variant="caption" color="text.secondary">
              {file ? `Ready to analyze: ${file.name}` : 'Select a file to get started'}
            </Typography>
            <UploadButton
              onClick={handleAnalyze}
              disabled={loading || !file}
              startIcon={loading ? <LoadingIcon size={20} /> : <DocumentIcon size={20} />}
            >
              {loading ? 'Analyzing...' : 'Analyze File'}
            </UploadButton>
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
              
              <Box mb={2}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  File Details:
                </Typography>
                <Typography variant="body2">
                  📄 {result.fileName}
                </Typography>
                <Typography variant="body2">
                  📏 {formatFileSize(result.fileSize)}
                </Typography>
                {result.fileType && (
                  <Typography variant="body2">
                    🏷️ {result.fileType}
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

          {result.result && (result.result.findings || result.result.fallback) && (
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
                  
                  {result.result.findings && result.result.findings.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="caption" fontWeight={600}>
                        Detected Threats:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                        {result.result.findings.map((finding, index) => (
                          <Chip key={index} label={finding} size="small" variant="outlined" color="error" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {result.result.id && (
                    <Typography variant="caption" display="block">
                      Scan ID: {result.result.id}
                    </Typography>
                  )}
                  
                  {result.result.content_type && (
                    <Typography variant="caption" display="block">
                      Content Type: {result.result.content_type}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                    Analysis engine: Scanii API
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

export default FileAnalysis;
