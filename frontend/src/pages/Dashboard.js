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
  minHeight: '320px',
  background: 'rgba(15, 23, 42, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.5)',
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(16px)',
  borderRadius: '16px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 12px 40px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(59, 130, 246, 0.8)',
  },
}));

const MetricCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'riskLevel',
})(({ theme, riskLevel }) => {
  const getBorderColor = () => {
    switch (riskLevel) {
      case 'high': return 'rgba(239, 68, 68, 0.8)'; // Red
      case 'medium': return 'rgba(245, 158, 11, 0.8)'; // Orange
      case 'low': return 'rgba(251, 191, 36, 0.8)'; // Yellow
      case 'none': return 'rgba(34, 197, 94, 0.8)'; // Green
      default: return 'rgba(59, 130, 246, 0.8)'; // Blue
    }
  };

  const getGlowColor = () => {
    switch (riskLevel) {
      case 'high': return 'rgba(239, 68, 68, 0.4)';
      case 'medium': return 'rgba(245, 158, 11, 0.4)';
      case 'low': return 'rgba(251, 191, 36, 0.4)';
      case 'none': return 'rgba(34, 197, 94, 0.4)';
      default: return 'rgba(59, 130, 246, 0.4)';
    }
  };

  return {
    background: 'rgba(15, 23, 42, 0.1)',
    color: 'white',
    height: '180px', // Fixed height for all cards - increased from 160px
    minHeight: '180px', // Ensure minimum height consistency
    maxHeight: '180px', // Prevent height expansion
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    border: `2px solid ${getBorderColor()}`,
    boxShadow: `0 0 20px ${getGlowColor()}, 0 8px 32px rgba(0, 0, 0, 0.2)`,
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 0 30px ${getGlowColor()}, 0 12px 40px rgba(0, 0, 0, 0.3)`,
      border: `2px solid ${getBorderColor().replace('0.8', '1')}`,
    },
    '& .MuiCardContent-root': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }
  };
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: 'transparent !important',
  '&.MuiCardContent-root': {
    backgroundColor: 'transparent',
  },
}));

const QuickActionSVGCard = styled(Box)(({ theme, actionColor }) => ({
  position: 'relative',
  height: '100px',
  width: '100%',
  maxWidth: '120px',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
  '&:hover': {
    transform: 'translateY(-6px) scale(1.05)',
    '& .svg-background': {
      filter: `drop-shadow(0 8px 20px ${actionColor}40)`,
    },
    '& .content-overlay': {
      background: `linear-gradient(135deg, ${actionColor}20, transparent)`,
    },
  },
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  background: 'rgba(15, 23, 42, 0.1)',
  color: 'rgba(255, 255, 255, 0.9)',
  padding: '20px',
  minHeight: '100px',
  borderRadius: '16px',
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  transition: 'all 0.3s ease',
  border: '2px solid rgba(59, 130, 246, 0.6)',
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(16px)',
  '&:hover': {
    background: 'rgba(15, 23, 42, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 12px 40px rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(59, 130, 246, 0.9)',
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
      icon: <TextIcon size={28} />,
      path: '/text-analysis',
      color: '#3b82f6',
      svgShape: 'hexagon',
      accent: '#60a5fa',
    },
    {
      title: 'Scan URL',
      description: 'Verify website safety',
      icon: <LinkIcon size={28} />,
      path: '/url-analysis',
      color: '#8b5cf6',
      svgShape: 'diamond',
      accent: '#a78bfa',
    },
    {
      title: 'Upload File',
      description: 'Scan files for malware',
      icon: <DocumentIcon size={28} />,
      path: '/file-analysis',
      color: '#10b981',
      svgShape: 'octagon',
      accent: '#34d399',
    },
    {
      title: 'View Analytics',
      description: 'Detailed threat statistics',
      icon: <AnalyticsIcon size={28} />,
      path: '/analytics',
      color: '#f59e0b',
      svgShape: 'pentagon',
      accent: '#fbbf24',
    },
  ];

  const getSVGShape = (shape, color, accent) => {
    const shapes = {
      hexagon: (
        <polygon
          points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="svg-background"
        />
      ),
      diamond: (
        <polygon
          points="50,10 85,50 50,90 15,50"
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="svg-background"
        />
      ),
      octagon: (
        <polygon
          points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30"
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="svg-background"
        />
      ),
      pentagon: (
        <polygon
          points="50,10 90,35 75,85 25,85 10,35"
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="svg-background"
        />
      ),
    };
    return shapes[shape] || shapes.hexagon;
  };

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
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 800,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 1) 0%, rgba(147, 197, 253, 1) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
            mb: 3,
            letterSpacing: '-0.02em',
          }}
        >
          CB Fraud Detector
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            lineHeight: 1.6,
          }}
        >
          Advanced threat detection and security monitoring platform. 
          Paste text, upload files, or enter URLs for comprehensive security analysis.
        </Typography>
      </Box>

      {/* Threat Status Overview */}
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.95)', 
          fontWeight: 600, 
          mb: 4,
          textAlign: 'center',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: { xs: '1.75rem', sm: '2.125rem' },
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <ShieldIcon size={28} style={{ color: 'rgba(59, 130, 246, 0.8)' }} />
        Threat Status Overview
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard riskLevel="high">
            <StyledCardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      color: 'rgba(255, 255, 255, 0.95)',
                      mb: 1,
                    }}
                  >
                    {analytics?.high?.percent || '0.0'}%
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.9,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 0.5,
                    }}
                  >
                    Harmful
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.7,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {analytics?.high?.count || 0} threats detected
                  </Typography>
                </Box>
                <AlertIcon size={32} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard riskLevel="medium">
            <StyledCardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      color: 'rgba(255, 255, 255, 0.95)',
                      mb: 1,
                    }}
                  >
                    {analytics?.medium?.percent || '0.0'}%
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.9,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 0.5,
                    }}
                  >
                    Suspicious
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.7,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {analytics?.medium?.count || 0} warnings issued
                  </Typography>
                </Box>
                <WarningIcon size={32} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard riskLevel="low">
            <StyledCardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      color: 'rgba(255, 255, 255, 0.95)',
                      mb: 1,
                    }}
                  >
                    {analytics?.low?.percent || '0.0'}%
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.9,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 0.5,
                    }}
                  >
                    Low Risk
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.7,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {analytics?.low?.count || 0} potential issues
                  </Typography>
                </Box>
                <WarningIcon size={32} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard riskLevel="none">
            <StyledCardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      color: 'rgba(255, 255, 255, 0.95)',
                      mb: 1,
                    }}
                  >
                    {analytics?.none?.percent || '0.0'}%
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.9,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 0.5,
                    }}
                  >
                    Safe
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.7,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {analytics?.none?.count || 0} verified clean
                  </Typography>
                </Box>
                <CheckCircleIcon size={32} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={2.4}>
          <MetricCard>
            <StyledCardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      color: 'rgba(255, 255, 255, 0.95)',
                      mb: 1,
                    }}
                  >
                    {analytics?.total || 0}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.9,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 0.5,
                    }}
                  >
                    Total Scans
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.7,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    All-time security checks
                  </Typography>
                </Box>
                <ShieldIcon size={32} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Quick Scan Actions */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <StyledCardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{
                  fontWeight: 600,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.95)',
                  mb: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <AnalyticsIcon size={24} style={{ color: 'rgba(59, 130, 246, 0.8)' }} />
                Quick Scan Actions
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  mb: 4,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}
              >
                Start analyzing threats with these common actions
              </Typography>
              
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { 
                    xs: 'repeat(2, 1fr)', 
                    sm: 'repeat(2, 1fr)', 
                    md: 'repeat(4, 1fr)' 
                  },
                  gap: 3,
                  py: 2,
                }}
              >
                {quickActions.map((action, index) => (
                  <QuickActionSVGCard
                    key={index}
                    actionColor={action.color}
                    component="a"
                    href={action.path}
                    sx={{
                      textDecoration: 'none',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: '1',
                      width: '100%',
                      maxWidth: '150px',
                      margin: '0 auto',
                      p: 3,
                      borderRadius: '16px',
                      border: `2px solid ${action.color}60`,
                      background: 'rgba(15, 23, 42, 0.1)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: `0 0 20px ${action.color}30`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: `2px solid ${action.color}`,
                        boxShadow: `0 0 30px ${action.color}50, 0 8px 25px rgba(0, 0, 0, 0.3)`,
                        transform: 'translateY(-4px)',
                        '& .action-icon': {
                          transform: 'scale(1.1)',
                        },
                        '& .svg-bg': {
                          opacity: 0.8,
                        }
                      }
                    }}
                  >
                    {/* SVG Background */}
                    <Box
                      className="svg-bg"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.4,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      >
                        <defs>
                          <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={action.color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={action.accent} stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                        <polygon
                          points={
                            action.svgShape === 'hexagon' ? "50,10 85,30 85,70 50,90 15,70 15,30" :
                            action.svgShape === 'diamond' ? "50,15 80,50 50,85 20,50" :
                            action.svgShape === 'octagon' ? "35,15 65,15 85,35 85,65 65,85 35,85 15,65 15,35" :
                            "50,15 85,35 75,80 25,80 15,35"
                          }
                          fill={`url(#gradient-${index})`}
                          stroke={action.color}
                          strokeWidth="1"
                          strokeOpacity="0.5"
                        />
                      </svg>
                    </Box>

                    {/* Content */}
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: 1.5,
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      {/* Icon */}
                      <Box
                        className="action-icon"
                        sx={{
                          color: action.color,
                          filter: `drop-shadow(0 2px 8px ${action.color}60)`,
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        {React.cloneElement(action.icon, { size: 28 })}
                      </Box>

                      {/* Title */}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          color: 'rgba(255, 255, 255, 0.95)',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          lineHeight: 1.2,
                          maxWidth: '100%',
                        }}
                      >
                        {action.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { xs: '0.625rem', sm: '0.75rem' },
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          lineHeight: 1.3,
                          maxWidth: '100%',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {action.description}
                      </Typography>
                    </Box>

                    {/* Corner Accent */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: action.accent,
                        boxShadow: `0 0 10px ${action.color}`,
                      }}
                    />
                  </QuickActionSVGCard>
                ))}
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <StyledCardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{
                  fontWeight: 600,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.95)',
                  mb: 2,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <AnalyticsIcon size={24} style={{ color: 'rgba(59, 130, 246, 0.8)' }} />
                Recent Activity
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  mb: 3,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}
              >
                Latest security scans and results
              </Typography>
              
              <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              {recentActivity.length === 0 ? (
                <Typography 
                  variant="body1" 
                  textAlign="center" 
                  sx={{ 
                    py: 4,
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  }}
                >
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
