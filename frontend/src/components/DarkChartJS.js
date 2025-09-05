import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Cyber theme colors
const CYBER_COLORS = {
  primary: '#00ffff',
  secondary: '#00ff41',
  accent: '#ff00ff',
  warning: '#ffff00',
  danger: '#ff0080',
  grid: '#2a2f5a',
  text: '#b0b8c7',
  textDim: '#6b7280'
};

// Chart container with cyber styling
const ChartContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(10, 14, 39, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 255, 255, 0.2)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(0, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #00ffff, #00ff41, #00ffff, transparent)',
    opacity: 0.6,
  },
  '&:hover': {
    borderColor: 'rgba(0, 255, 255, 0.4)',
    boxShadow: `
      0 8px 40px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(0, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
  },
  transition: 'all 0.3s ease'
}));

// Default chart options for dark theme
const getDefaultOptions = (type = 'line') => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: CYBER_COLORS.text,
          font: {
            family: '"Inter", sans-serif',
            size: 12,
            weight: '500'
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 39, 0.95)',
        titleColor: CYBER_COLORS.primary,
        bodyColor: CYBER_COLORS.text,
        borderColor: CYBER_COLORS.primary,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        titleFont: {
          family: '"Inter", sans-serif',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: '"Inter", sans-serif',
          size: 12,
          weight: '500'
        },
        displayColors: true,
        boxPadding: 4
      }
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      x: {
        grid: {
          display: true,
          color: CYBER_COLORS.grid,
          drawOnChartArea: true,
          drawTicks: false,
        },
        ticks: {
          color: CYBER_COLORS.textDim,
          font: {
            family: '"Inter", sans-serif',
            size: 11
          }
        },
        border: {
          display: false
        }
      },
      y: {
        grid: {
          display: true,
          color: CYBER_COLORS.grid,
          drawOnChartArea: true,
          drawTicks: false,
        },
        ticks: {
          color: CYBER_COLORS.textDim,
          font: {
            family: '"Inter", sans-serif',
            size: 11
          }
        },
        border: {
          display: false
        }
      }
    } : {}
  };

  return baseOptions;
};

// Line Chart Component
export const ChartJSLineChart = ({ 
  data, 
  title, 
  height = 300,
  options = {},
  datasets = []
}) => {
  const defaultDatasets = datasets.length > 0 ? datasets : [
    {
      label: 'Dataset 1',
      data: data?.map(item => item.value) || [],
      borderColor: CYBER_COLORS.primary,
      backgroundColor: CYBER_COLORS.primary + '20',
      borderWidth: 2,
      pointBackgroundColor: CYBER_COLORS.primary,
      pointBorderColor: CYBER_COLORS.primary,
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: false
    }
  ];

  const chartData = {
    labels: data?.map(item => item.label || item.name) || [],
    datasets: defaultDatasets
  };

  const chartOptions = {
    ...getDefaultOptions('line'),
    ...options
  };

  return (
    <ChartContainer>
      {title && (
        <Typography
          variant="h6"
          sx={{
            color: CYBER_COLORS.primary,
            fontWeight: 700,
            marginBottom: 2,
            fontFamily: '"Orbitron", sans-serif',
            textShadow: `0 0 10px ${CYBER_COLORS.primary}`,
          }}
        >
          {title}
        </Typography>
      )}
      <Box sx={{ height: height }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </ChartContainer>
  );
};

// Bar Chart Component
export const ChartJSBarChart = ({ 
  data, 
  title, 
  height = 300,
  options = {},
  datasets = []
}) => {
  const defaultDatasets = datasets.length > 0 ? datasets : [
    {
      label: 'Dataset 1',
      data: data?.map(item => item.value) || [],
      backgroundColor: CYBER_COLORS.accent + '80',
      borderColor: CYBER_COLORS.accent,
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    }
  ];

  const chartData = {
    labels: data?.map(item => item.label || item.name) || [],
    datasets: defaultDatasets
  };

  const chartOptions = {
    ...getDefaultOptions('bar'),
    ...options
  };

  return (
    <ChartContainer>
      {title && (
        <Typography
          variant="h6"
          sx={{
            color: CYBER_COLORS.accent,
            fontWeight: 700,
            marginBottom: 2,
            fontFamily: '"Orbitron", sans-serif',
            textShadow: `0 0 10px ${CYBER_COLORS.accent}`,
          }}
        >
          {title}
        </Typography>
      )}
      <Box sx={{ height: height }}>
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </ChartContainer>
  );
};

// Pie Chart Component
export const ChartJSPieChart = ({ 
  data, 
  title, 
  height = 300,
  options = {},
  type = 'pie' // 'pie' or 'doughnut'
}) => {
  const colors = [
    CYBER_COLORS.primary,
    CYBER_COLORS.secondary,
    CYBER_COLORS.accent,
    CYBER_COLORS.warning,
    CYBER_COLORS.danger
  ];

  const chartData = {
    labels: data?.map(item => item.label || item.name) || [],
    datasets: [
      {
        data: data?.map(item => item.value) || [],
        backgroundColor: colors.slice(0, data?.length || 0).map(color => color + '80'),
        borderColor: colors.slice(0, data?.length || 0),
        borderWidth: 2,
        hoverBackgroundColor: colors.slice(0, data?.length || 0).map(color => color + 'CC'),
        hoverBorderColor: colors.slice(0, data?.length || 0),
        hoverBorderWidth: 3
      }
    ]
  };

  const chartOptions = {
    ...getDefaultOptions(type),
    cutout: type === 'doughnut' ? '60%' : 0,
    ...options
  };

  const ChartComponent = type === 'doughnut' ? Doughnut : Pie;

  return (
    <ChartContainer>
      {title && (
        <Typography
          variant="h6"
          sx={{
            color: CYBER_COLORS.secondary,
            fontWeight: 700,
            marginBottom: 2,
            fontFamily: '"Orbitron", sans-serif',
            textShadow: `0 0 10px ${CYBER_COLORS.secondary}`,
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
      )}
      <Box sx={{ height: height }}>
        <ChartComponent data={chartData} options={chartOptions} />
      </Box>
    </ChartContainer>
  );
};

// Area Chart (using Line chart with fill)
export const ChartJSAreaChart = ({ 
  data, 
  title, 
  height = 300,
  options = {},
  datasets = []
}) => {
  const defaultDatasets = datasets.length > 0 ? datasets : [
    {
      label: 'Dataset 1',
      data: data?.map(item => item.value) || [],
      borderColor: CYBER_COLORS.secondary,
      backgroundColor: CYBER_COLORS.secondary + '30',
      borderWidth: 2,
      pointBackgroundColor: CYBER_COLORS.secondary,
      pointBorderColor: CYBER_COLORS.secondary,
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true
    }
  ];

  const chartData = {
    labels: data?.map(item => item.label || item.name) || [],
    datasets: defaultDatasets
  };

  const chartOptions = {
    ...getDefaultOptions('line'),
    ...options
  };

  return (
    <ChartContainer>
      {title && (
        <Typography
          variant="h6"
          sx={{
            color: CYBER_COLORS.secondary,
            fontWeight: 700,
            marginBottom: 2,
            fontFamily: '"Orbitron", sans-serif',
            textShadow: `0 0 10px ${CYBER_COLORS.secondary}`,
          }}
        >
          {title}
        </Typography>
      )}
      <Box sx={{ height: height }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </ChartContainer>
  );
};

// Export all components
export default {
  ChartJSLineChart,
  ChartJSBarChart,
  ChartJSPieChart,
  ChartJSAreaChart
};
