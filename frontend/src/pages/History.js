import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  MenuItem,
  Pagination,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  HistoryIcon, 
  AlertIcon,
  WarningIcon,
  CheckCircleIcon,
  RefreshIcon,
  CloseIcon,
} from '../assets/icons';
import { apiService } from '../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1f3a 0%, #2a2f5a 50%, #1a1f3a 100%)',
  border: '1px solid rgba(0, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1)',
  borderRadius: '16px',
  color: '#ffffff',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 31, 58, 0.8)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: 'rgba(26, 31, 58, 0.9)',
      border: '1px solid rgba(0, 255, 255, 0.5)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(26, 31, 58, 1)',
      border: '1px solid rgba(0, 255, 255, 0.8)',
      boxShadow: '0 0 0 3px rgba(0, 255, 255, 0.1)',
    },
    '& fieldset': {
      border: 'none',
    },
    '& .MuiInputBase-input': {
      color: '#ffffff',
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#00ffff',
    },
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Menu dropdown styling
  '& .MuiPaper-root': {
    backgroundColor: 'rgba(26, 31, 58, 0.95)',
    border: '1px solid rgba(0, 255, 255, 0.3)',
  },
  '& .MuiMenuItem-root': {
    color: '#ffffff',
    '&:hover': {
      backgroundColor: 'rgba(0, 255, 255, 0.1)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(0, 255, 255, 0.2)',
      '&:hover': {
        backgroundColor: 'rgba(0, 255, 255, 0.3)',
      },
    },
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  background: 'transparent',
  '&.MuiCardContent-root': {
    backgroundColor: 'transparent',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  backgroundColor: 'rgba(26, 31, 58, 0.6)',
  '& .MuiTable-root': {
    minWidth: 650,
  },
  '& .MuiTableHead-root': {
    backgroundColor: 'rgba(26, 31, 58, 0.8)',
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: '#ffffff',
    borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
  },
  '& .MuiTableCell-body': {
    color: '#ffffff',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    boxShadow: '0 2px 8px rgba(0, 255, 255, 0.15)',
    transform: 'translateY(-1px)',
    transition: 'all 0.2s ease-in-out',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'rgba(15, 23, 42, 0.1)',
  color: 'rgba(255, 255, 255, 0.9)',
  padding: '8px 20px',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  transition: 'all 0.3s ease',
  border: '2px solid rgba(59, 130, 246, 0.6)',
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
  backdropFilter: 'blur(16px)',
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

const ClearButton = styled(Button)(({ theme }) => ({
  background: 'rgba(15, 23, 42, 0.1)',
  color: 'rgba(255, 255, 255, 0.9)',
  padding: '8px 20px',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  transition: 'all 0.3s ease',
  border: '2px solid rgba(239, 68, 68, 0.6)',
  boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
  backdropFilter: 'blur(16px)',
  '&:hover': {
    background: 'rgba(15, 23, 42, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 0 30px rgba(239, 68, 68, 0.5), 0 8px 25px rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(239, 68, 68, 0.9)',
  },
  '&:disabled': {
    background: 'rgba(71, 85, 105, 0.3)',
    color: 'rgba(148, 163, 184, 0.7)',
    border: '2px solid rgba(71, 85, 105, 0.5)',
  },
}));

const DialogButton = styled(Button)(({ theme }) => ({
  background: 'rgba(15, 23, 42, 0.1)',
  color: 'rgba(255, 255, 255, 0.9)',
  padding: '8px 20px',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  transition: 'all 0.3s ease',
  border: '2px solid rgba(71, 85, 105, 0.6)',
  boxShadow: '0 0 20px rgba(71, 85, 105, 0.3)',
  backdropFilter: 'blur(16px)',
  '&:hover': {
    background: 'rgba(15, 23, 42, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 0 30px rgba(71, 85, 105, 0.5), 0 8px 25px rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(71, 85, 105, 0.9)',
  },
}));

const getRiskIcon = (risk) => {
  switch (risk) {
    case 'high': return <AlertIcon size={20} style={{ color: '#dc2626' }} />;
    case 'low': return <WarningIcon size={20} style={{ color: '#d97706' }} />;
    case 'none': return <CheckCircleIcon size={20} style={{ color: '#059669' }} />;
    default: return <HistoryIcon size={20} />;
  }
};

const getRiskChip = (risk) => {
  const colors = {
    high: { color: 'error', label: 'HIGH RISK' },
    low: { color: 'warning', label: 'LOW RISK' },
    none: { color: 'success', label: 'SAFE' },
  };
  
  const config = colors[risk] || { color: 'default', label: risk?.toUpperCase() || 'UNKNOWN' };
  
  return (
    <Chip
      label={config.label}
      color={config.color}
      variant="filled"
      size="small"
      sx={{ fontWeight: 600, fontSize: '11px' }}
    />
  );
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'text': return '📝';
    case 'url': return '🔗';
    case 'file': return '📄';
    default: return '❓';
  }
};

const formatInput = (input, type) => {
  if (type === 'text') {
    return input.length > 50 ? input.substring(0, 50) + '...' : input;
  }
  return input;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHistory();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    applyFilters();
  }, [history, filterType, filterRisk, searchTerm]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to fetch history data');
      console.error('History fetch error:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...history];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Filter by risk
    if (filterRisk !== 'all') {
      filtered = filtered.filter(item => item.risk === filterRisk);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.input.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
    setPage(1); // Reset to first page when filters change
  };

  const handleClearHistory = async () => {
    try {
      setClearing(true);
      await apiService.clearHistory();
      setHistory([]);
      setFilteredHistory([]);
      setClearDialogOpen(false);
    } catch (err) {
      setError('Failed to clear history');
      console.error('Clear history error:', err);
    } finally {
      setClearing(false);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getDetailedResults = (item) => {
    if (item.result?.fallback) {
      return {
        method: 'Pattern-based Analysis',
        details: item.result.reason || 'Fallback analysis performed',
        patterns: item.result.patterns || [],
        score: item.result.compositeScore,
      };
    } else if (item.result?.findings) {
      return {
        method: 'API-based Scan',
        details: `${item.result.findings.length} threats detected`,
        findings: item.result.findings,
        scanId: item.result.id,
      };
    } else if (item.result?.matches) {
      return {
        method: 'Google Safe Browsing',
        details: `${item.result.matches.length} matches found`,
        matches: item.result.matches,
      };
    } else {
      return {
        method: 'Standard Analysis',
        details: 'Analysis completed successfully',
      };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading history...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
            Analysis History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review past security scans and their results ({filteredHistory.length} items)
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <ActionButton
            onClick={fetchHistory}
            startIcon={<RefreshIcon size={20} />}
            disabled={loading}
          >
            Refresh
          </ActionButton>
          {history.length > 0 && (
            <ClearButton
              onClick={() => setClearDialogOpen(true)}
              variant="outlined"
            >
              Clear History
            </ClearButton>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <StyledCard>
        <StyledCardContent sx={{ p: 3 }}>
          {/* Filters */}
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{
              fontWeight: 600,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: 'rgba(255, 255, 255, 0.95)',
              mb: 2
            }}
          >
            Filter Results
          </Typography>
          
          <Box display="flex" gap={3} mb={3} flexWrap="wrap" alignItems="flex-end">
            <Box>
              <Typography 
                variant="body2" 
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 1
                }}
              >
                Filter by Type
              </Typography>
              <StyledTextField
                select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                size="small"
                sx={{ minWidth: 150 }}
                InputProps={{
                  style: {
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="text">📝 Text</MenuItem>
                <MenuItem value="url">🔗 URL</MenuItem>
                <MenuItem value="file">📄 File</MenuItem>
              </StyledTextField>
            </Box>

            <Box>
              <Typography 
                variant="body2" 
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 1
                }}
              >
                Filter by Risk
              </Typography>
              <StyledTextField
                select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                size="small"
                sx={{ minWidth: 150 }}
                InputProps={{
                  style: {
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }
                }}
              >
                <MenuItem value="all">All Risk Levels</MenuItem>
                <MenuItem value="high">🔴 High Risk</MenuItem>
                <MenuItem value="low">🟡 Low Risk</MenuItem>
                <MenuItem value="none">🟢 Safe</MenuItem>
              </StyledTextField>
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 200 }}>
              <Typography 
                variant="body2" 
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 1
                }}
              >
                Search Content
              </Typography>
              <StyledTextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                placeholder="Search in analyzed content..."
                sx={{ width: '100%' }}
                InputProps={{
                  style: {
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }
                }}
              />
            </Box>
          </Box>

          {/* History Table */}
          {filteredHistory.length === 0 ? (
            <Box textAlign="center" py={8}>
              <HistoryIcon size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {history.length === 0 ? 'No Analysis History' : 'No Matching Results'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {history.length === 0 
                  ? 'Start analyzing content to see history here'
                  : 'Try adjusting your filters or search terms'
                }
              </Typography>
            </Box>
          ) : (
            <>
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Risk Level</TableCell>
                      <TableCell>Confidence</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedHistory.map((item, index) => {
                      const dateTime = formatDate(item.date);
                      return (
                        <TableRow 
                          key={index} 
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleItemClick(item)}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <span>{getTypeIcon(item.type)}</span>
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {item.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={item.input} arrow>
                              <Typography variant="body2" sx={{ 
                                maxWidth: '300px', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {formatInput(item.input, item.type)}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              {getRiskIcon(item.risk)}
                              {getRiskChip(item.risk)}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {Math.round(item.confidence * 100)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {dateTime.date}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {dateTime.time}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </StyledTableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </StyledCardContent>
      </StyledCard>

      {/* Item Details Dialog */}
      <Dialog 
        open={!!selectedItem} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedItem && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                  <span style={{ fontSize: '24px' }}>{getTypeIcon(selectedItem.type)}</span>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)} Analysis Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(selectedItem.date).date} at {formatDate(selectedItem.date).time}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleCloseDetails}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Analyzed Content:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'transparent', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {selectedItem.input}
                  </Typography>
                </Paper>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Risk Assessment:
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {getRiskIcon(selectedItem.risk)}
                  {getRiskChip(selectedItem.risk)}
                  <Chip 
                    label={`${Math.round(selectedItem.confidence * 100)}% Confidence`}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>

              {(() => {
                const details = getDetailedResults(selectedItem);
                return (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Technical Details:
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'transparent', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        Analysis Method: {details.method}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {details.details}
                      </Typography>
                      
                      {details.patterns && details.patterns.length > 0 && (
                        <Box mt={2}>
                          <Typography variant="caption" fontWeight={600} display="block" gutterBottom>
                            Detected Patterns:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {details.patterns.map((pattern, idx) => (
                              <Chip key={idx} label={pattern} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {details.findings && details.findings.length > 0 && (
                        <Box mt={2}>
                          <Typography variant="caption" fontWeight={600} display="block" gutterBottom>
                            Threat Findings:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {details.findings.map((finding, idx) => (
                              <Chip key={idx} label={finding} size="small" color="error" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {details.score && (
                        <Typography variant="caption" display="block" mt={1}>
                          Composite Score: {details.score}
                        </Typography>
                      )}
                      
                      {details.scanId && (
                        <Typography variant="caption" display="block" mt={1}>
                          Scan ID: {details.scanId}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                );
              })()}
            </DialogContent>
            
            <DialogActions>
              <DialogButton onClick={handleCloseDetails}>
                Close
              </DialogButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Clear History Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear Analysis History</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all analysis history? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <DialogButton onClick={() => setClearDialogOpen(false)}>
            Cancel
          </DialogButton>
          <ClearButton
            onClick={handleClearHistory}
            disabled={clearing}
            startIcon={clearing ? <CircularProgress size={16} /> : null}
          >
            {clearing ? 'Clearing...' : 'Clear History'}
          </ClearButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default History;
