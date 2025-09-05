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
  background: 'rgba(15, 23, 42, 0.1)',
  border: '2px solid rgba(59, 130, 246, 0.6)',
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2)',
  borderRadius: '16px',
  backdropFilter: 'blur(16px)',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 12px 40px rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(59, 130, 246, 0.9)',
    transform: 'translateY(-2px)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: 'transparent !important',
  color: 'rgba(255, 255, 255, 0.95)',
  '&.MuiCardContent-root': {
    backgroundColor: 'transparent',
  },
}));

const MetricCard = styled(Card)(({ theme, riskLevel }) => {
  const getColors = () => {
    switch (riskLevel) {
      case 'high': 
        return {
          bg: 'rgba(15, 23, 42, 0.1)',
          border: 'rgba(239, 68, 68, 0.8)',
          glow: 'rgba(239, 68, 68, 0.4)'
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
    color: 'rgba(255, 255, 255, 0.95)',
    height: '100%',
    backdropFilter: 'blur(16px)',
    boxShadow: `0 0 20px ${colors.glow}, 0 8px 32px rgba(0, 0, 0, 0.2)`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 0 30px ${colors.glow}, 0 12px 40px rgba(0, 0, 0, 0.3)`,
      border: `2px solid ${colors.border.replace('0.8', '1')}`,
    },
  };
});

const RefreshButton = styled(Button)(({ theme }) => ({
  background: 'rgba(15, 23, 42, 0.1)',
  color: 'rgba(255, 255, 255, 0.9)',
  padding: '12px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
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
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // High Risk - Bright red with transparency
          'rgba(251, 191, 36, 0.8)',  // Low Risk - Bright yellow/amber
          'rgba(34, 197, 94, 0.8)',   // Safe - Bright green
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',     // High Risk - Solid red border
          'rgba(251, 191, 36, 1)',    // Low Risk - Solid yellow border
          'rgba(34, 197, 94, 1)',     // Safe - Solid green border
        ],
        borderWidth: 3,
        hoverOffset: 8,
        hoverBorderWidth: 4,
        hoverBackgroundColor: [
          'rgba(239, 68, 68, 0.9)',
          'rgba(251, 191, 36, 0.9)',
          'rgba(34, 197, 94, 0.9)',
        ],
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
          pointStyle: 'circle',
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 14,
            weight: '600',
            family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.95)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(59, 130, 246, 0.6)',
        borderWidth: 2,
        cornerRadius: 12,
        bodyFont: {
          family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        titleFont: {
          family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
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
          'rgba(99, 102, 241, 0.8)',   // Text - Indigo/Purple
          'rgba(139, 92, 246, 0.8)',   // URL - Purple
          'rgba(59, 130, 246, 0.8)',   // File - Blue
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: [
          'rgba(99, 102, 241, 0.9)',
          'rgba(139, 92, 246, 0.9)',
          'rgba(59, 130, 246, 0.9)',
        ],
        hoverBorderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        hoverBorderWidth: 3,
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
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.95)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(59, 130, 246, 0.6)',
        borderWidth: 2,
        cornerRadius: 12,
        bodyFont: {
          family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        titleFont: {
          family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12,
            weight: '500',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderDash: [5, 5],
        },
        ticks: {
          stepSize: 1,
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12,
          },
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
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'linear-gradient(180deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.05) 100%)',
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderWidth: 4,
        shadowColor: 'rgba(59, 130, 246, 0.5)',
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.95)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(59, 130, 246, 0.6)',
        borderWidth: 2,
        cornerRadius: 12,
        bodyFont: {
          family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        titleFont: {
          family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `${context[0].label}`;
          },
          label: function(context) {
            return `Scans: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12,
            weight: '500',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderDash: [5, 5],
        },
        ticks: {
          stepSize: 1,
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12,
          },
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
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{
              fontWeight: 700,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            Security Analytics
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
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
              <Typography 
                variant="h6" 
                fontWeight={600} 
                gutterBottom
                sx={{
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.95)',
                }}
              >
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
              <Typography 
                variant="h6" 
                fontWeight={600} 
                gutterBottom
                sx={{
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.95)',
                }}
              >
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
              <Typography 
                variant="h6" 
                fontWeight={600} 
                gutterBottom
                sx={{
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.95)',
                }}
              >
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
              <Typography 
                variant="h6" 
                fontWeight={600} 
                gutterBottom
                sx={{
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                Security Insights
              </Typography>
              
              <Box 
                p={2} 
                borderRadius="12px" 
                sx={{
                  background: riskInsights.level === 'high' ? 'rgba(239, 68, 68, 0.1)' :
                             riskInsights.level === 'medium' ? 'rgba(251, 191, 36, 0.1)' :
                             riskInsights.level === 'low' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  border: riskInsights.level === 'high' ? '1px solid rgba(239, 68, 68, 0.3)' :
                         riskInsights.level === 'medium' ? '1px solid rgba(251, 191, 36, 0.3)' :
                         riskInsights.level === 'low' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
                  mb: 2
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  fontWeight={600} 
                  gutterBottom
                  sx={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {riskInsights.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  paragraph
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {riskInsights.message}
                </Typography>
              </Box>

              <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

              <Typography 
                variant="subtitle2" 
                fontWeight={600} 
                gutterBottom
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Recommendations:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {riskInsights.recommendations.map((rec, index) => (
                  <Typography 
                    key={index} 
                    component="li" 
                    variant="body2" 
                    sx={{ 
                      mb: 0.5,
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
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
