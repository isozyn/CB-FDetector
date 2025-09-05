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

// ===== STYLED COMPONENTS =====

// ===== STYLED COMPONENTS =====

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(15, 23, 42, 0.1)',
  border: '2px solid rgba(59, 130, 246, 0.6)',
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2)',
  borderRadius: '16px',
  backdropFilter: 'blur(16px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 12px 40px rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(59, 130, 246, 0.9)',
  },
}));

const UploadArea = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragOver',
})(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.4)'}`,
  borderRadius: '16px',
  padding: '48px 24px',
  textAlign: 'center',
  backgroundColor: isDragOver ? 'rgba(59, 130, 246, 0.1)' : 'rgba(15, 23, 42, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: isDragOver ? '0 0 30px rgba(59, 130, 246, 0.3)' : '0 0 10px rgba(59, 130, 246, 0.1)',
  '&:hover': {
    borderColor: 'rgba(59, 130, 246, 0.8)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  background: 'rgba(15, 23, 42, 0.1)',
  color: 'rgba(255, 255, 255, 0.9)',
  padding: '12px 32px',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '16px',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  transition: 'all 0.3s ease',
  border: '2px solid rgba(59, 130, 246, 0.6)',
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
  '&:hover': {
    background: 'rgba(15, 23, 42, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 8px 25px rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(59, 130, 246, 0.9)',
  },
  '&:disabled': {
    background: 'rgba(71, 85, 105, 0.3)',
    color: 'rgba(148, 163, 184, 0.7)',
    border: '2px solid rgba(71, 85, 105, 0.5)',
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
          bg: 'rgba(15, 23, 42, 0.1)',
          border: 'rgba(239, 68, 68, 0.8)',
          glow: 'rgba(239, 68, 68, 0.4)'
        };
      case 'medium': 
        return {
          bg: 'rgba(15, 23, 42, 0.1)',
          border: 'rgba(245, 158, 11, 0.8)',
          glow: 'rgba(245, 158, 11, 0.4)'
        };
      case 'low': 
        return {
          bg: 'rgba(15, 23, 42, 0.1)',
          border: 'rgba(251, 191, 36, 0.8)',
          glow: 'rgba(251, 191, 36, 0.4)'
        };
      case 'none': 
        return {
          bg: 'rgba(15, 23, 42, 0.1)',
          border: 'rgba(34, 197, 94, 0.8)',
          glow: 'rgba(34, 197, 94, 0.4)'
        };
      default: 
        return {
          bg: 'rgba(15, 23, 42, 0.1)',
          border: 'rgba(59, 130, 246, 0.8)',
          glow: 'rgba(59, 130, 246, 0.4)'
        };
    }
  };

  const colors = getColors();
  
  return {
    background: colors.bg,
    border: `2px solid ${colors.border}`,
    borderRadius: '16px',
    padding: '24px',
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: '24px',
    backdropFilter: 'blur(16px)',
    boxShadow: `0 0 20px ${colors.glow}, 0 8px 32px rgba(0, 0, 0, 0.2)`,
    animation: 'scaleIn 0.4s ease-out',
  };
});

// ===== UTILITY FUNCTIONS =====

// ===== UTILITY FUNCTIONS =====

const getRiskIcon = (risk) => {
  switch (risk) {
    case 'high': return <AlertIcon size={24} />;
    case 'medium': return <WarningIcon size={24} />;
    case 'low': return <WarningIcon size={24} />;
    case 'none': return <CheckCircleIcon size={24} />;
    default: return <DocumentIcon size={24} />;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    case 'medium':
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
    case 'low':
      return {
        title: 'Minor Risk Indicators',
        message: `This file shows minor risk indicators with ${confidencePercent}% confidence. Generally safe but exercise normal caution.`,
        recommendations: [
          'Exercise normal security practices',
          'Verify file source if from unknown origin',
          'Keep antivirus software updated',
          'Monitor for unusual system behavior',
          'Consider additional scanning if concerned',
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

// ===== ANALYSIS LOGIC =====

// ===== ANALYSIS LOGIC =====

const calculateOverallRisk = (individualResults) => {
  if (individualResults.length === 0) return null;
  
  const riskScores = { high: 3, medium: 2, low: 1, none: 0 };
  const totalScore = individualResults.reduce((sum, result) => sum + riskScores[result.risk], 0);
  const averageScore = totalScore / individualResults.length;
  const highRiskCount = individualResults.filter(r => r.risk === 'high').length;
  const mediumRiskCount = individualResults.filter(r => r.risk === 'medium').length;
  
  // Determine overall risk based on highest individual risks and averages
  let overallRisk = 'none';
  if (highRiskCount > 0) {
    overallRisk = 'high';
  } else if (mediumRiskCount > 0 || averageScore >= 1.5) {
    overallRisk = 'medium';
  } else if (averageScore >= 0.5) {
    overallRisk = 'low';
  }
  
  return {
    risk: overallRisk,
    confidence: Math.min(0.95, individualResults.reduce((sum, r) => sum + r.confidence, 0) / individualResults.length),
    totalFiles: individualResults.length,
    highRiskFiles: highRiskCount,
    mediumRiskFiles: mediumRiskCount,
    lowRiskFiles: individualResults.filter(r => r.risk === 'low').length,
    safeFiles: individualResults.filter(r => r.risk === 'none').length,
    recommendations: generateOverallRecommendations(overallRisk, highRiskCount, mediumRiskCount, individualResults.length)
  };
};

const generateOverallRecommendations = (overallRisk, highCount, mediumCount, totalCount) => {
  const base = [
    'Review individual file analysis results below',
    'Keep your antivirus software updated',
    'Maintain regular system backups',
  ];
  
  if (overallRisk === 'high') {
    return [
      `${highCount} high-risk file(s) detected - immediate action required`,
      'Quarantine or delete all high-risk files immediately',
      'Run a comprehensive system security scan',
      'Check the source of these files for potential compromise',
      ...base
    ];
  } else if (overallRisk === 'medium') {
    return [
      `${mediumCount > 0 ? mediumCount + ' medium-risk' : 'Some potentially suspicious'} file(s) detected`,
      'Exercise caution when handling flagged files',
      'Consider scanning with additional security tools',
      'Verify file sources and authenticity',
      ...base
    ];
  } else if (overallRisk === 'low') {
    return [
      'Some files show minor risk indicators',
      'Monitor system behavior after use',
      'Exercise normal security practices',
      ...base
    ];
  } else {
    return [
      `All ${totalCount} file(s) appear to be clean`,
      'Continue following security best practices',
      ...base
    ];
  }
};

const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

const analyzeFileByLines = async (file) => {
  try {
    // Read file content as text
    const fileContent = await readFileAsText(file);
    
    // Split content by line breaks and filter out empty lines
    const lines = fileContent
      .split(/\r?\n/)
      .map((line, index) => ({ lineNumber: index + 1, text: line.trim() }))
      .filter(line => line.text.length > 0);

    if (lines.length === 0) {
      return {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        totalLines: 0,
        analyzedLines: 0,
        lineResults: [],
        overallRisk: 'none',
        overallConfidence: 0,
        error: 'No content to analyze (file is empty or contains only whitespace)'
      };
    }

    // Analyze each line individually
    const lineResults = [];
    let totalRiskScore = 0;
    let totalConfidence = 0;
    let analyzedCount = 0;

    for (const line of lines) {
      try {
        const analysis = await apiService.analyzeText(line.text);
        const lineResult = {
          lineNumber: line.lineNumber,
          originalText: line.text,
          risk: analysis.risk,
          confidence: analysis.confidence,
          threats: analysis.threats || [],
          recommendations: analysis.recommendations || []
        };
        
        lineResults.push(lineResult);
        
        // Calculate risk scores for overall assessment
        const riskScores = { high: 3, medium: 2, low: 1, none: 0 };
        totalRiskScore += riskScores[analysis.risk] || 0;
        totalConfidence += analysis.confidence || 0;
        analyzedCount++;
        
      } catch (lineError) {
        // Handle individual line analysis errors
        lineResults.push({
          lineNumber: line.lineNumber,
          originalText: line.text,
          risk: 'error',
          confidence: 0,
          error: lineError.message || 'Line analysis failed'
        });
      }
    }

    // Calculate overall file risk based on line analyses
    const averageRiskScore = analyzedCount > 0 ? totalRiskScore / analyzedCount : 0;
    const averageConfidence = analyzedCount > 0 ? totalConfidence / analyzedCount : 0;
    
    let overallRisk = 'none';
    if (averageRiskScore >= 2.5) overallRisk = 'high';
    else if (averageRiskScore >= 1.5) overallRisk = 'medium';
    else if (averageRiskScore >= 0.5) overallRisk = 'low';

    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      totalLines: lines.length,
      analyzedLines: analyzedCount,
      lineResults: lineResults,
      overallRisk: overallRisk,
      overallConfidence: averageConfidence,
      risk: overallRisk, // For compatibility with existing result structure
      confidence: averageConfidence // For compatibility with existing result structure
    };

  } catch (error) {
    throw new Error(`Failed to process file: ${error.message}`);
  }
};

// ===== MAIN COMPONENT =====

const FileAnalysis = () => {
  // ===== STATE MANAGEMENT =====
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [overallResult, setOverallResult] = useState(null);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzingIndex, setAnalyzingIndex] = useState(-1);
  const fileInputRef = useRef(null);

  // ===== EVENT HANDLERS =====

  const handleFileSelect = (selectedFiles) => {
    const fileList = Array.from(selectedFiles);
    
    // Check total file count (limit to 10 files)
    if (files.length + fileList.length > 10) {
      setError('You can analyze up to 10 files at once');
      return;
    }
    
    // Check individual file sizes (limit to 10MB each)
    const oversizedFiles = fileList.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Files must be less than 10MB each. ${oversizedFiles.length} file(s) exceed this limit.`);
      return;
    }
    
    // Add unique files (avoid duplicates)
    const newFiles = fileList.filter(newFile => 
      !files.some(existingFile => 
        existingFile.name === newFile.name && existingFile.size === newFile.size
      )
    );
    
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
    if (results.length > 0) {
      setResults([]);
      setOverallResult(null);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResults(prev => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      setOverallResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
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
    if (files.length === 0) {
      setError('Please select at least one file to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setOverallResult(null);
    setUploadProgress(0);

    try {
      const analysisResults = [];
      
      for (let i = 0; i < files.length; i++) {
        setAnalyzingIndex(i);
        const file = files[i];
        
        // Update progress
        setUploadProgress(((i) / files.length) * 90);
        
        try {
          const result = await analyzeFileByLines(file);
          result.index = i;
          analysisResults.push(result);
          setResults(prev => [...prev, result]);
        } catch (fileError) {
          // Handle individual file errors but continue with others
          const errorResult = {
            risk: 'error',
            confidence: 0,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            error: fileError.message || 'Analysis failed',
            index: i
          };
          analysisResults.push(errorResult);
          setResults(prev => [...prev, errorResult]);
        }
      }
      
      // Calculate overall risk assessment
      const validResults = analysisResults.filter(r => r.risk !== 'error');
      if (validResults.length > 0) {
        const overall = calculateOverallRisk(validResults);
        setOverallResult(overall);
      }
      
      setUploadProgress(100);
      setAnalyzingIndex(-1);
      
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
      
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      setUploadProgress(0);
      setAnalyzingIndex(-1);
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (index) => {
    setShowDetails(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // ===== RENDER HELPERS =====

  const renderPageHeader = () => (
    <>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{
          fontWeight: 700,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        Multi-File Analysis
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          mb: 4,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        Scan multiple files simultaneously for malware, viruses, and security threats. Get individual risk scores and an overall assessment.
      </Typography>
    </>
  );

  const renderUploadSection = () => (
        <StyledCardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <UploadIcon size={28} style={{ color: 'rgba(59, 130, 246, 0.8)' }} />
            <Box>
              <Typography 
                variant="h6" 
                sx={{
                  fontWeight: 600,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                Upload Files for Security Scan
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Select or drag & drop up to 10 files to scan for threats (Max: 10MB each)
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
            <UploadIcon size={48} style={{ opacity: 0.5, marginBottom: '16px', color: 'rgba(59, 130, 246, 0.8)' }} />
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {files.length > 0 ? `${files.length} File(s) Selected` : 'Drop files here or click to browse'}
            </Typography>
            {files.length === 0 ? (
              <Typography 
                variant="body2" 
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Supported: Documents, executables, archives, images, and more
              </Typography>
            ) : (
              <Typography 
                variant="body2" 
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Click to add more files or drag & drop additional files
              </Typography>
            )}
          </UploadArea>

          {/* Selected Files List */}
          {files.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                Selected Files ({files.length}/10)
              </Typography>
              <List sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, p: 1 }}>
                {files.map((file, index) => (
                  <ListItem 
                    key={index}
                    sx={{
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: analyzingIndex === index ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                    }}
                  >
                    <ListItemIcon>
                      {analyzingIndex === index ? (
                        <LoadingIcon size={20} />
                      ) : (
                        <DocumentIcon size={20} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography 
                            variant="body2" 
                            sx={{
                              fontWeight: 600,
                              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              color: 'rgba(255, 255, 255, 0.9)',
                            }}
                          >
                            {file.name}
                          </Typography>
                          {analyzingIndex === index && (
                            <Chip size="small" label="Analyzing..." sx={{ bgcolor: 'rgba(59, 130, 246, 0.3)', color: 'white' }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography 
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          }}
                        >
                          {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                        </Typography>
                      }
                    />
                    <Button
                      size="small"
                      onClick={() => removeFile(index)}
                      disabled={loading}
                      sx={{
                        color: 'rgba(239, 68, 68, 0.8)',
                        '&:hover': {
                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          {loading && uploadProgress > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography 
                variant="body2" 
                gutterBottom
                sx={{
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {analyzingIndex >= 0 ? 
                  `Analyzing file ${analyzingIndex + 1} of ${files.length}: ${files[analyzingIndex]?.name}` :
                  'Preparing analysis...'
                }
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ 
                  borderRadius: '4px', 
                  height: '8px',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  }
                }}
              />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <UploadButton
              onClick={handleAnalyze}
              disabled={loading || files.length === 0}
              startIcon={loading ? <LoadingIcon size={20} /> : null}
            >
              {loading ? 'Analyzing...' : `Analyze ${files.length} File${files.length !== 1 ? 's' : ''}`}
            </UploadButton>
            
            {files.length > 0 && !loading && (
              <Button
                variant="outlined"
                onClick={() => {
                  setFiles([]);
                  setResults([]);
                  setOverallResult(null);
                  setError('');
                  setShowDetails({});
                }}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  borderColor: 'rgba(255,255,255,0.3)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                  }
                }}
              >
                Clear All
              </Button>
            )}
          </Box>
        </StyledCardContent>
      </StyledCard>

      {/* Overall Risk Assessment */}
      {overallResult && (
        <ResultCard riskLevel={overallResult.risk}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            {getRiskIcon(overallResult.risk)}
            <Typography 
              variant="h5" 
              sx={{
                fontWeight: 700,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              Overall Risk Assessment
            </Typography>
          </Box>
          
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {overallResult.risk === 'high' ? 'High Risk Detected' :
             overallResult.risk === 'medium' ? 'Medium Risk Level' :
             overallResult.risk === 'low' ? 'Low Risk Level' :
             'All Files Appear Clean'}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            Analysis of {overallResult.totalFiles} file(s) with {Math.round(overallResult.confidence * 100)}% confidence.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2, mb: 3 }}>
            <Box textAlign="center">
              <Typography 
                variant="h4" 
                sx={{
                  fontWeight: 700,
                  color: 'rgba(239, 68, 68, 0.9)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {overallResult.highRiskFiles}
              </Typography>
              <Typography 
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                High Risk
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography 
                variant="h4" 
                sx={{
                  fontWeight: 700,
                  color: 'rgba(245, 158, 11, 0.9)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {overallResult.mediumRiskFiles}
              </Typography>
              <Typography 
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Medium Risk
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography 
                variant="h4" 
                sx={{
                  fontWeight: 700,
                  color: 'rgba(251, 191, 36, 0.9)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {overallResult.lowRiskFiles}
              </Typography>
              <Typography 
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Low Risk
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography 
                variant="h4" 
                sx={{
                  fontWeight: 700,
                  color: 'rgba(34, 197, 94, 0.9)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {overallResult.safeFiles}
              </Typography>
              <Typography 
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Safe
              </Typography>
            </Box>
          </Box>

          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Recommendations:
          </Typography>
          <List dense>
            {overallResult.recommendations.map((rec, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemText 
                  primary={
                    <Typography
                      sx={{
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      • {rec}
                    </Typography>
                  } 
                />
              </ListItem>
            ))}
          </List>
        </ResultCard>
      )}

      {/* Individual File Results */}
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{
              fontWeight: 600,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            Individual File Analysis Results
          </Typography>
          
          {results.map((result, index) => {
            if (result.risk === 'error') {
              return (
                <Alert key={index} severity="error" sx={{ mt: 2, borderRadius: '12px' }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{
                      fontWeight: 600,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    {result.fileName}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    Analysis failed: {result.error}
                  </Typography>
                </Alert>
              );
            }

            const riskInfo = getRiskMessage(result.risk, result.confidence, result.fileName);
            
            return (
              <ResultCard key={index} riskLevel={result.risk}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {getRiskIcon(result.risk)}
                  <Box flex={1}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      {result.fileName}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {formatFileSize(result.fileSize)} • {result.fileType || 'Unknown type'}
                      {result.lineResults && (
                        <> • {result.analyzedLines}/{result.totalLines} lines analyzed</>
                      )}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${Math.round(result.confidence * 100)}% confidence`}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {riskInfo.title}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  {result.lineResults ? 
                    `Analyzed ${result.analyzedLines} lines of text. ${riskInfo.message}` : 
                    riskInfo.message
                  }
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => toggleDetails(index)}
                  sx={{ 
                    mb: 2,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  {showDetails[index] ? 'Hide' : 'Show'} {result.lineResults ? 'Line Analysis' : 'Recommendations'}
                </Button>

                <Collapse in={showDetails[index]}>
                  {result.lineResults ? (
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        gutterBottom 
                        sx={{
                          fontWeight: 600,
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        Line-by-Line Analysis Results:
                      </Typography>
                      
                      <Box sx={{ 
                        maxHeight: '400px', 
                        overflowY: 'auto',
                        bgcolor: 'rgba(0,0,0,0.2)',
                        borderRadius: 2,
                        p: 2,
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {result.lineResults.map((lineResult, lineIndex) => (
                          <Box 
                            key={lineIndex} 
                            sx={{ 
                              mb: 2, 
                              p: 2, 
                              borderRadius: 1,
                              bgcolor: lineResult.risk === 'error' ? 'rgba(239, 68, 68, 0.1)' :
                                      lineResult.risk === 'high' ? 'rgba(239, 68, 68, 0.1)' :
                                      lineResult.risk === 'medium' ? 'rgba(245, 158, 11, 0.1)' :
                                      lineResult.risk === 'low' ? 'rgba(251, 191, 36, 0.1)' :
                                      'rgba(34, 197, 94, 0.1)',
                              border: `1px solid ${
                                lineResult.risk === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                                lineResult.risk === 'high' ? 'rgba(239, 68, 68, 0.3)' :
                                lineResult.risk === 'medium' ? 'rgba(245, 158, 11, 0.3)' :
                                lineResult.risk === 'low' ? 'rgba(251, 191, 36, 0.3)' :
                                'rgba(34, 197, 94, 0.3)'
                              }`
                            }}
                          >
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                              <Chip 
                                size="small" 
                                label={`Line ${lineResult.lineNumber}`}
                                sx={{ 
                                  bgcolor: 'rgba(59, 130, 246, 0.3)',
                                  color: 'white',
                                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                }}
                              />
                              <Chip 
                                size="small" 
                                label={lineResult.risk === 'error' ? 'Error' : 
                                      lineResult.risk.charAt(0).toUpperCase() + lineResult.risk.slice(1) + ' Risk'}
                                sx={{ 
                                  bgcolor: lineResult.risk === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                                          lineResult.risk === 'high' ? 'rgba(239, 68, 68, 0.3)' :
                                          lineResult.risk === 'medium' ? 'rgba(245, 158, 11, 0.3)' :
                                          lineResult.risk === 'low' ? 'rgba(251, 191, 36, 0.3)' :
                                          'rgba(34, 197, 94, 0.3)',
                                  color: 'white',
                                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                }}
                              />
                              {lineResult.confidence > 0 && (
                                <Chip 
                                  size="small" 
                                  label={`${Math.round(lineResult.confidence * 100)}%`}
                                  variant="outlined"
                                  sx={{ 
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                  }}
                                />
                              )}
                            </Box>
                            
                            <Typography 
                              variant="body2" 
                              sx={{
                                fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                                color: 'rgba(255, 255, 255, 0.9)',
                                bgcolor: 'rgba(0,0,0,0.3)',
                                p: 1,
                                borderRadius: 1,
                                mb: 1,
                                wordBreak: 'break-all',
                                fontSize: '0.875rem'
                              }}
                            >
                              {lineResult.originalText}
                            </Typography>
                            
                            {lineResult.error && (
                              <Typography 
                                variant="caption" 
                                sx={{
                                  color: 'rgba(239, 68, 68, 0.9)',
                                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                }}
                              >
                                Error: {lineResult.error}
                              </Typography>
                            )}
                            
                            {lineResult.threats && lineResult.threats.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography 
                                  variant="caption" 
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    fontWeight: 600
                                  }}
                                >
                                  Threats detected: {lineResult.threats.join(', ')}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                      
                      <Typography 
                        variant="subtitle2" 
                        gutterBottom 
                        sx={{
                          fontWeight: 600,
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          color: 'rgba(255, 255, 255, 0.9)',
                          mt: 2
                        }}
                      >
                        Overall File Recommendations:
                      </Typography>
                      <List dense>
                        {riskInfo.recommendations.map((rec, recIndex) => (
                          <ListItem key={recIndex} sx={{ py: 0 }}>
                            <ListItemText 
                              primary={
                                <Typography
                                  sx={{
                                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                  }}
                                >
                                  • {rec}
                                </Typography>
                              } 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ) : (
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        gutterBottom 
                        sx={{
                          fontWeight: 600,
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        Security Recommendations:
                      </Typography>
                      <List dense>
                        {riskInfo.recommendations.map((rec, recIndex) => (
                          <ListItem key={recIndex} sx={{ py: 0 }}>
                            <ListItemText 
                              primary={
                                <Typography
                                  sx={{
                                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                  }}
                                >
                                  • {rec}
                                </Typography>
                              } 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Collapse>
              </ResultCard>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default FileAnalysis;
