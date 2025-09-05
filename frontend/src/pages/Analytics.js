import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { 
  AnalyticsIcon, 
  AlertIcon,
  WarningIcon,
  CheckCircleIcon,
  RefreshIcon,
} from '../assets/icons';
import { apiService } from '../services/api';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #1E293B 100%)',
  border: '1px solid rgba(0, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1)',
  borderRadius: '16px',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: 'transparent !important',
  '&.MuiCardContent-root': {
    backgroundColor: 'transparent',
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

const RefreshButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-1px)',
  },
}));

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const [analyticsData, historyData] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getHistory(),
      ]);
      
      setAnalytics(analyticsData);
      setHistory(historyData);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
      // Set default values
      setAnalytics({
        high: { count: 0, percent: '0.0' },
        low: { count: 0, percent: '0.0' },
        none: { count: 0, percent: '0.0' },
        total: 0,
      });
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Chart data preparation
  const doughnutData = {
    labels: ['High Risk', 'Low Risk', 'Safe'],
    datasets: [
      {
        data: analytics ? [
          parseFloat(analytics.high.percent),
          parseFloat(analytics.low.percent),
          parseFloat(analytics.none.percent),
        ] : [0, 0, 0],
        backgroundColor: ['#ff6b6b', '#feca57', '#48cab2'],
        borderColor: ['#ff5252', '#ff9800', '#26a69a'],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    },
  };

  // Analysis by type chart
  const getAnalysisByType = () => {
    const types = { text: 0, url: 0, file: 0 };
    history.forEach(item => {
      types[item.type] = (types[item.type] || 0) + 1;
    });
    return types;
  };

  const typeData = getAnalysisByType();
  const barData = {
    labels: ['Text Analysis', 'URL Analysis', 'File Analysis'],
    datasets: [
      {
        label: 'Number of Scans',
        data: [typeData.text, typeData.url, typeData.file],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)',
          'rgba(72, 202, 178, 0.8)',
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)',
          'rgba(72, 202, 178, 1)',
        ],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Timeline data for recent activity
  const getTimelineData = () => {
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyCounts = last7Days.map(date => {
      return history.filter(item => 
        new Date(item.date).toISOString().split('T')[0] === date
      ).length;
    });

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
      data: dailyCounts,
    };
  };

  const timelineData = getTimelineData();
  const lineData = {
    labels: timelineData.labels,
    datasets: [
      {
        label: 'Daily Scans',
        data: timelineData.data,
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Risk insights
  const getRiskInsights = () => {
    if (!analytics || analytics.total === 0) {
      return {
        level: 'info',
        title: 'No Data Available',
        message: 'Start analyzing content to see security insights.',
        recommendations: ['Begin with text analysis', 'Scan suspicious URLs', 'Upload files for malware detection'],
      };
    }

    const highRiskPercent = parseFloat(analytics.high.percent);
    const lowRiskPercent = parseFloat(analytics.low.percent);
    const totalRiskPercent = highRiskPercent + lowRiskPercent;

    if (highRiskPercent > 20) {
      return {
        level: 'high',
        title: 'High Security Risk Environment',
        message: `${highRiskPercent}% of analyzed content contains high-risk threats. Immediate attention required.`,
        recommendations: [
          'Review and quarantine all high-risk items',
          'Implement stricter security policies',
          'Conduct security awareness training',
          'Consider additional security measures',
        ],
      };
    } else if (totalRiskPercent > 30) {
      return {
        level: 'medium',
        title: 'Moderate Security Concerns',
        message: `${totalRiskPercent}% of content shows potential risks. Monitoring recommended.`,
        recommendations: [
          'Review flagged items regularly',
          'Maintain security best practices',
          'Continue monitoring patterns',
          'Update security protocols as needed',
        ],
      };
    } else {
      return {
        level: 'low',
        title: 'Good Security Posture',
        message: `Only ${totalRiskPercent}% of content shows risks. Security measures are effective.`,
        recommendations: [
          'Maintain current security practices',
          'Continue regular monitoring',
          'Stay updated on new threats',
          'Keep security tools updated',
        ],
      };
    }
  };

  const riskInsights = getRiskInsights();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading analytics data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
            Security Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive analysis of security threats and patterns
          </Typography>
        </Box>
        <RefreshButton
          onClick={fetchAnalytics}
          startIcon={<RefreshIcon size={20} />}
          disabled={loading}
        >
          Refresh Data
        </RefreshButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard riskLevel="high">
            <StyledCardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700}>
                    {analytics?.high?.percent || '0.0'}%
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    High Risk
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {analytics?.high?.count || 0} threats detected
                  </Typography>
                </Box>
                <AlertIcon size={36} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard riskLevel="low">
            <StyledCardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700}>
                    {analytics?.low?.percent || '0.0'}%
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Low Risk
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {analytics?.low?.count || 0} warnings issued
                  </Typography>
                </Box>
                <WarningIcon size={36} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard riskLevel="none">
            <StyledCardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700}>
                    {analytics?.none?.percent || '0.0'}%
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Safe Content
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {analytics?.none?.count || 0} items clean
                  </Typography>
                </Box>
                <CheckCircleIcon size={36} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard>
            <StyledCardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700}>
                    {analytics?.total || 0}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Total Scans
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    All time analysis
                  </Typography>
                </Box>
                <AnalyticsIcon size={36} />
              </Box>
            </StyledCardContent>
          </MetricCard>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Risk Distribution Chart */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <StyledCardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Risk Distribution
              </Typography>
              <Box height={300}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        {/* Analysis Types */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <StyledCardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Analysis by Type
              </Typography>
              <Box height={300}>
                <Bar data={barData} options={barOptions} />
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Activity Timeline */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <StyledCardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Activity Timeline (Last 7 Days)
              </Typography>
              <Box height={300}>
                <Line data={lineData} options={lineOptions} />
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        {/* Security Insights */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <StyledCardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Security Insights
              </Typography>
              
              <Box 
                p={2} 
                borderRadius="12px" 
                bgcolor={
                  riskInsights.level === 'high' ? '#fee2e2' :
                  riskInsights.level === 'medium' ? '#fef3c7' :
                  riskInsights.level === 'low' ? '#d1fae5' : '#e0e7ff'
                }
                mb={2}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {riskInsights.title}
                </Typography>
                <Typography variant="body2" paragraph>
                  {riskInsights.message}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Recommendations:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {riskInsights.recommendations.map((rec, index) => (
                  <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                    {rec}
                  </Typography>
                ))}
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
