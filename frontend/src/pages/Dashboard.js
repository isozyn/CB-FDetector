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
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
}));

const MetricCard = styled(Card)(({ theme, riskLevel }) => {
  const getGradient = () => {
    switch (riskLevel) {
      case 'high': return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
      case 'low': return 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)';
      case 'none': return 'linear-gradient(135deg, #48cab2 0%, #2dd4bf 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return {
    background: getGradient(),
    color: 'white',
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    },
  };
});

const QuickActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '16px',
  borderRadius: '16px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
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
    <Box className="fade-in">
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
        Security Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor threats and analyze security metrics in real-time
      </Typography>

      {/* Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard riskLevel="high">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {analytics?.high?.percent || '0.0'}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    High Risk
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {analytics?.high?.count || 0} threats
                  </Typography>
                </Box>
                <AlertIcon size={32} />
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard riskLevel="low">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {analytics?.low?.percent || '0.0'}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Low Risk
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {analytics?.low?.count || 0} warnings
                  </Typography>
                </Box>
                <WarningIcon size={32} />
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard riskLevel="none">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {analytics?.none?.percent || '0.0'}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Safe
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {analytics?.none?.count || 0} clean
                  </Typography>
                </Box>
                <CheckCircleIcon size={32} />
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {analytics?.total || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Scans
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    All time
                  </Typography>
                </Box>
                <ShieldIcon size={32} />
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Quick Actions
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
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
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
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
