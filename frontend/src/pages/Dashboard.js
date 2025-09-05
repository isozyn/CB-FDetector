import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  ShieldIcon, 
  DocumentIcon, 
  LinkIcon, 
  TextIcon,
  AnalyticsIcon,
  CheckCircleIcon,
  WarningIcon,
  AlertIcon
} from '../assets/icons';
import { apiService } from '../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(135deg, rgba(26,31,58,0.8) 0%, rgba(42,47,90,0.8) 100%)',
  border: '1px solid rgba(0,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(0,255,255,0.1)',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,255,255,0.2)',
    border: '1px solid rgba(0,255,255,0.4)',
  },
}));

const MetricCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'riskLevel',
})(({ theme, riskLevel }) => {
  const getGradient = () => {
    switch (riskLevel) {
      case 'high': return 'linear-gradient(135deg, #ff0040 0%, #cc0033 100%)';
      case 'medium': return 'linear-gradient(135deg, #ff9500 0%, #cc7700 100%)';
      case 'low': return 'linear-gradient(135deg, #00ff41 0%, #00cc33 100%)';
      case 'none': return 'linear-gradient(135deg, #00ffff 0%, #00cccc 100%)';
      default: return 'linear-gradient(135deg, #00ffff 0%, #00cc99 100%)';
    }
  };

  const getBorderGlow = () => {
    switch (riskLevel) {
      case 'high': return '0 0 20px rgba(255,0,64,0.6)';
      case 'medium': return '0 0 20px rgba(255,149,0,0.6)';
      case 'low': return '0 0 20px rgba(0,255,65,0.6)';
      case 'none': return '0 0 20px rgba(0,255,255,0.6)';
      default: return '0 0 20px rgba(0,255,255,0.6)';
    }
  };

  return {
    background: getGradient(),
    color: 'white',
    height: '100%',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: getBorderGlow(),
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px rgba(0,0,0,0.3), ${getBorderGlow()}`,
    },
  };
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: 'transparent !important',
  '&.MuiCardContent-root': {
    backgroundColor: 'transparent',
  },
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #00ffff 0%, #00cc99 100%)',
  color: '#0a0e27',
  padding: '16px',
  borderRadius: '16px',
  textTransform: 'uppercase',
  fontWeight: 700,
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
}));

const getRiskIcon = (risk) => {
  switch (risk) {
    case 'high': return <AlertIcon size={20} />;
    case 'low': return <WarningIcon size={20} />;
    case 'none': return <CheckCircleIcon size={20} />;
    default: return <ShieldIcon size={20} />;
  }
};

const getRiskColor = (risk) => {
  switch (risk) {
    case 'high': return '#ff6b6b';
    case 'low': return '#feca57';
    case 'none': return '#48cab2';
    default: return '#667eea';
  }
};

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsData, historyData] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getHistory(),
      ]);
      
      setAnalytics(analyticsData);
      setRecentActivity(historyData.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set default values if API fails
      setAnalytics({
        high: { count: 0, percent: '0.0' },
        low: { count: 0, percent: '0.0' },
        none: { count: 0, percent: '0.0' },
        total: 0,
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Analyze Text',
      description: 'Check text for threats and spam',
      icon: <TextIcon size={24} />,
      path: '/text-analysis',
      color: '#667eea',
    },
    {
      title: 'Scan URL',
      description: 'Verify website safety',
      icon: <LinkIcon size={24} />,
      path: '/url-analysis',
      color: '#764ba2',
    },
    {
      title: 'Upload File',
      description: 'Scan files for malware',
      icon: <DocumentIcon size={24} />,
      path: '/file-analysis',
      color: '#48cab2',
    },
    {
      title: 'View Analytics',
      description: 'Detailed threat statistics',
      icon: <AnalyticsIcon size={24} />,
      path: '/analytics',
      color: '#feca57',
    },
  ];

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <LinearProgress sx={{ mb: 3 }} />
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

  return (
    <Box className="fade-in" sx={{ 
      minHeight: '100vh',
      padding: 3,
    }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6, py: 4 }}>
        <Typography 
          variant="h2" 
          gutterBottom 
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #00ffff 0%, #00ff41 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(0,255,255,0.5)',
            mb: 2,
          }}
        >
          CB Fraud Detector
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,255,255,0.8)', 
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Advanced threat detection and security monitoring platform. 
          Paste text, upload files, or enter URLs for comprehensive security analysis.
        </Typography>
      </Box>

      {/* Threat Status Overview */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          color: '#00ffff', 
          fontWeight: 600, 
          mb: 3,
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <ShieldIcon size={24} style={{ filter: 'drop-shadow(0 0 10px #00ffff)' }} />
        Threat Status Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard riskLevel="high">
            <StyledCardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {analytics?.high?.percent || '0.0'}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'uppercase' }}>
                    Harmful
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {analytics?.high?.count || 0} threats detected
                  </Typography>
                </Box>
                <AlertIcon size={32} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard riskLevel="medium">
            <StyledCardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {analytics?.medium?.percent || '0.0'}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'uppercase' }}>
                    Suspicious
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {analytics?.medium?.count || 0} warnings issued
                  </Typography>
                </Box>
                <WarningIcon size={32} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard riskLevel="low">
            <StyledCardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {analytics?.low?.percent || '0.0'}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'uppercase' }}>
                    Low Risk
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {analytics?.low?.count || 0} potential issues
                  </Typography>
                </Box>
                <WarningIcon size={32} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard riskLevel="none">
            <StyledCardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {analytics?.none?.percent || '0.0'}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'uppercase' }}>
                    Safe
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {analytics?.none?.count || 0} verified clean
                  </Typography>
                </Box>
                <CheckCircleIcon size={32} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard>
            <StyledCardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {analytics?.total || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'uppercase' }}>
                    Total Scans
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    All-time security checks
                  </Typography>
                </Box>
                <ShieldIcon size={32} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Scan Actions */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <StyledCardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                fontWeight={600}
                sx={{ 
                  color: '#00ffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <AnalyticsIcon size={20} style={{ filter: 'drop-shadow(0 0 10px #00ffff)' }} />
                Quick Scan Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start analyzing threats with these common actions
              </Typography>
              
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <QuickActionButton
                      fullWidth
                      href={action.path}
                      sx={{
                        background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                        height: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      {action.icon}
                      <Typography variant="body2" fontWeight={600}>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {action.description}
                      </Typography>
                    </QuickActionButton>
                  </Grid>
                ))}
              </Grid>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <StyledCardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Latest security scans and results
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              {recentActivity.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No recent activity. Start by analyzing some content!
                </Typography>
              ) : (
                <List dense>
                  {recentActivity.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getRiskIcon(item.risk)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '120px'
                            }}>
                              {item.type === 'text' 
                                ? item.input.substring(0, 20) + '...'
                                : item.input
                              }
                            </Typography>
                            <Chip
                              label={item.risk}
                              size="small"
                              sx={{
                                backgroundColor: getRiskColor(item.risk),
                                color: 'white',
                                fontSize: '10px',
                                height: '20px',
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {new Date(item.date).toLocaleDateString()} • {item.type}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </StyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
