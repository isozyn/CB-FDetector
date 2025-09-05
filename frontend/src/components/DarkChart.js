import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Cyber theme colors
const CYBER_COLORS = {
  primary: '#00ffff',    // Cyan
  secondary: '#00ff41',  // Lime green
  accent: '#ff00ff',     // Purple/Magenta
  warning: '#ffff00',    // Yellow
  danger: '#ff0080',     // Hot pink
  grid: '#2a2f5a',       // Dark blue-gray
  text: '#b0b8c7',       // Light gray
  textDim: '#6b7280'     // Dimmed gray
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

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, labelFormatter, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: 'rgba(10, 14, 39, 0.95)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: CYBER_COLORS.text,
            fontWeight: 600,
            marginBottom: '8px',
            fontSize: '0.875rem'
          }}
        >
          {labelFormatter ? labelFormatter(label) : label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: entry.color,
                boxShadow: `0 0 8px ${entry.color}`,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: entry.color,
                fontWeight: 500,
                fontSize: '0.8rem'
              }}
            >
              {entry.name}: {formatter ? formatter(entry.value, entry.name) : entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

// Line Chart Component
export const DarkLineChart = ({ 
  data, 
  title, 
  xDataKey = 'name', 
  lines = [], 
  height = 300,
  showGrid = true,
  formatter,
  labelFormatter 
}) => {
  const defaultLines = lines.length > 0 ? lines : [
    { dataKey: 'value', color: CYBER_COLORS.primary, name: 'Value' }
  ];

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
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={CYBER_COLORS.grid} 
              opacity={0.3}
            />
          )}
          <XAxis 
            dataKey={xDataKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: CYBER_COLORS.textDim, fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: CYBER_COLORS.textDim, fontSize: 12 }}
          />
          <Tooltip 
            content={<CustomTooltip formatter={formatter} labelFormatter={labelFormatter} />}
            cursor={{ stroke: CYBER_COLORS.primary, strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          {defaultLines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
              activeDot={{ 
                r: 6, 
                fill: line.color,
                stroke: line.color,
                strokeWidth: 2,
                filter: `drop-shadow(0 0 8px ${line.color})`
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Area Chart Component
export const DarkAreaChart = ({ 
  data, 
  title, 
  xDataKey = 'name', 
  areas = [], 
  height = 300,
  showGrid = true,
  formatter,
  labelFormatter 
}) => {
  const defaultAreas = areas.length > 0 ? areas : [
    { dataKey: 'value', color: CYBER_COLORS.primary, name: 'Value' }
  ];

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
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {defaultAreas.map((area, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={area.color} stopOpacity={0.6}/>
                <stop offset="95%" stopColor={area.color} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={CYBER_COLORS.grid} 
              opacity={0.3}
            />
          )}
          <XAxis 
            dataKey={xDataKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: CYBER_COLORS.textDim, fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: CYBER_COLORS.textDim, fontSize: 12 }}
          />
          <Tooltip 
            content={<CustomTooltip formatter={formatter} labelFormatter={labelFormatter} />}
            cursor={{ stroke: CYBER_COLORS.secondary, strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          {defaultAreas.map((area, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey={area.dataKey}
              stroke={area.color}
              strokeWidth={2}
              fill={`url(#gradient-${index})`}
              dot={{ fill: area.color, strokeWidth: 2, r: 4 }}
              activeDot={{ 
                r: 6, 
                fill: area.color,
                stroke: area.color,
                strokeWidth: 2,
                filter: `drop-shadow(0 0 8px ${area.color})`
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Bar Chart Component
export const DarkBarChart = ({ 
  data, 
  title, 
  xDataKey = 'name', 
  bars = [], 
  height = 300,
  showGrid = true,
  formatter,
  labelFormatter 
}) => {
  const defaultBars = bars.length > 0 ? bars : [
    { dataKey: 'value', color: CYBER_COLORS.accent, name: 'Value' }
  ];

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
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={CYBER_COLORS.grid} 
              opacity={0.3}
            />
          )}
          <XAxis 
            dataKey={xDataKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: CYBER_COLORS.textDim, fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: CYBER_COLORS.textDim, fontSize: 12 }}
          />
          <Tooltip 
            content={<CustomTooltip formatter={formatter} labelFormatter={labelFormatter} />}
            cursor={{ fill: 'rgba(0, 255, 255, 0.1)' }}
          />
          {defaultBars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
              style={{
                filter: `drop-shadow(0 0 8px ${bar.color}40)`
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Pie Chart Component
export const DarkPieChart = ({ 
  data, 
  title, 
  height = 300,
  formatter,
  labelFormatter 
}) => {
  const colors = [
    CYBER_COLORS.primary,
    CYBER_COLORS.secondary,
    CYBER_COLORS.accent,
    CYBER_COLORS.warning,
    CYBER_COLORS.danger
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

    return (
      <text 
        x={x} 
        y={y} 
        fill={CYBER_COLORS.text} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
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
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={Math.min(height * 0.35, 120)}
            fill="#8884d8"
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                style={{
                  filter: `drop-shadow(0 0 8px ${colors[index % colors.length]}40)`
                }}
              />
            ))}
          </Pie>
          <Tooltip 
            content={<CustomTooltip formatter={formatter} labelFormatter={labelFormatter} />}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Export all components
export default {
  DarkLineChart,
  DarkAreaChart,
  DarkBarChart,
  DarkPieChart
};
