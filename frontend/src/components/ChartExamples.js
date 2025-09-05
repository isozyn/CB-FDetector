import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { DarkLineChart, DarkAreaChart, DarkBarChart, DarkPieChart } from './DarkChart';

// Sample data for demonstration
const lineChartData = [
  { name: 'Jan', threats: 65, scans: 120 },
  { name: 'Feb', threats: 59, scans: 110 },
  { name: 'Mar', threats: 80, scans: 140 },
  { name: 'Apr', threats: 81, scans: 160 },
  { name: 'May', threats: 56, scans: 130 },
  { name: 'Jun', threats: 55, scans: 180 },
  { name: 'Jul', threats: 40, scans: 200 }
];

const areaChartData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 200 },
  { name: 'Sun', value: 100 }
];

const barChartData = [
  { name: 'Malware', count: 240 },
  { name: 'Phishing', count: 139 },
  { name: 'Spam', count: 980 },
  { name: 'Scam', count: 390 },
  { name: 'Safe', count: 4800 }
];

const pieChartData = [
  { name: 'Safe Files', value: 85 },
  { name: 'Suspicious', value: 10 },
  { name: 'Malware', value: 3 },
  { name: 'Quarantined', value: 2 }
];

const ChartExamples = () => {
  // Custom formatters
  const threatFormatter = (value, name) => {
    if (name === 'threats') return `${value} threats`;
    if (name === 'scans') return `${value} scans`;
    return value;
  };

  const percentFormatter = (value) => `${value}%`;
  
  const countFormatter = (value) => `${value} files`;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h4"
        sx={{
          color: '#00ffff',
          fontWeight: 700,
          marginBottom: 4,
          fontFamily: '"Orbitron", sans-serif',
          textAlign: 'center',
          textShadow: '0 0 20px rgba(0,255,255,0.5)',
        }}
      >
        Cyber Security Dashboard Charts
      </Typography>

      <Grid container spacing={3}>
        {/* Line Chart - Threat Trends */}
        <Grid item xs={12} lg={6}>
          <DarkLineChart
            data={lineChartData}
            title="Security Threat Trends"
            xDataKey="name"
            lines={[
              { dataKey: 'threats', color: '#ff0080', name: 'Threats Detected' },
              { dataKey: 'scans', color: '#00ffff', name: 'Total Scans' }
            ]}
            height={320}
            formatter={threatFormatter}
            labelFormatter={(label) => `Month: ${label}`}
          />
        </Grid>

        {/* Area Chart - Daily Activity */}
        <Grid item xs={12} lg={6}>
          <DarkAreaChart
            data={areaChartData}
            title="Daily Scan Activity"
            xDataKey="name"
            areas={[
              { dataKey: 'value', color: '#00ff41', name: 'Scans Performed' }
            ]}
            height={320}
            formatter={countFormatter}
            labelFormatter={(label) => `Day: ${label}`}
          />
        </Grid>

        {/* Bar Chart - Threat Types */}
        <Grid item xs={12} lg={6}>
          <DarkBarChart
            data={barChartData}
            title="Threat Detection by Type"
            xDataKey="name"
            bars={[
              { dataKey: 'count', color: '#ff00ff', name: 'Detections' }
            ]}
            height={320}
            formatter={countFormatter}
          />
        </Grid>

        {/* Pie Chart - File Status Distribution */}
        <Grid item xs={12} lg={6}>
          <DarkPieChart
            data={pieChartData}
            title="File Security Status"
            height={320}
            formatter={percentFormatter}
            labelFormatter={(label) => `Category: ${label}`}
          />
        </Grid>

        {/* Full-width chart example */}
        <Grid item xs={12}>
          <DarkLineChart
            data={[
              { time: '00:00', alerts: 12, scans: 45 },
              { time: '04:00', alerts: 8, scans: 38 },
              { time: '08:00', alerts: 25, scans: 120 },
              { time: '12:00', alerts: 35, scans: 180 },
              { time: '16:00', alerts: 28, scans: 150 },
              { time: '20:00', alerts: 15, scans: 90 },
              { time: '23:59', alerts: 10, scans: 55 }
            ]}
            title="Real-time Security Monitoring (24H)"
            xDataKey="time"
            lines={[
              { dataKey: 'alerts', color: '#ffff00', name: 'Security Alerts' },
              { dataKey: 'scans', color: '#00ffff', name: 'Automated Scans' }
            ]}
            height={280}
            formatter={(value, name) => {
              if (name === 'Security Alerts') return `${value} alerts`;
              if (name === 'Automated Scans') return `${value} scans`;
              return value;
            }}
            labelFormatter={(label) => `Time: ${label}`}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChartExamples;
