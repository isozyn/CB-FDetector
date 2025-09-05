# Dark Cyber-Themed Chart Components

Professional dark-themed chart components designed for cybersecurity dashboards and dark UI applications. Features neon accent colors, glassmorphism effects, and responsive design.

## 🎨 Features

- **Transparent backgrounds** that blend with dark themes
- **Cyber neon colors**: Cyan (#00ffff), Lime Green (#00ff41), Purple (#ff00ff)
- **Glassmorphism effects** with backdrop blur and subtle borders
- **Responsive design** for desktop and mobile
- **Custom dark tooltips** with cyber styling
- **Three implementation options**: Recharts, Chart.js, and pure Tailwind CSS

## 📦 Installation

### For Recharts Version (Recommended)

```bash
npm install recharts @mui/material @emotion/react @emotion/styled
```

### For Chart.js Version

```bash
npm install react-chartjs-2 chart.js @mui/material @emotion/react @emotion/styled
```

### For Tailwind CSS Version

```bash
npm install recharts
# Make sure you have Tailwind CSS configured in your project
```

## 🚀 Quick Start

### Basic Usage with Recharts

```jsx
import React from 'react';
import { DarkLineChart, DarkBarChart, DarkPieChart } from './components/DarkChart';

const Dashboard = () => {
  const data = [
    { name: 'Jan', threats: 65, scans: 120 },
    { name: 'Feb', threats: 59, scans: 110 },
    { name: 'Mar', threats: 80, scans: 140 },
    { name: 'Apr', threats: 81, scans: 160 },
  ];

  return (
    <div style={{ padding: '20px', background: '#0a0e27' }}>
      <DarkLineChart
        data={data}
        title="Security Metrics"
        lines={[
          { dataKey: 'threats', color: '#ff0080', name: 'Threats' },
          { dataKey: 'scans', color: '#00ffff', name: 'Scans' }
        ]}
        height={300}
      />
    </div>
  );
};
```

### Chart.js Implementation

```jsx
import { ChartJSLineChart, ChartJSBarChart } from './components/DarkChartJS';

const ChartJSExample = () => {
  const data = [
    { name: 'Monday', value: 400 },
    { name: 'Tuesday', value: 300 },
    { name: 'Wednesday', value: 600 },
  ];

  return (
    <ChartJSLineChart
      data={data}
      title="Weekly Activity"
      height={350}
      datasets={[
        {
          label: 'Activity Level',
          data: data.map(item => item.value),
          borderColor: '#00ffff',
          backgroundColor: '#00ffff20',
          borderWidth: 2,
          tension: 0.4,
        }
      ]}
    />
  );
};
```

### Tailwind CSS Implementation

```jsx
import { TailwindLineChart, TailwindBarChart } from './components/TailwindCharts';

const TailwindExample = () => {
  const data = [
    { name: 'Q1', value: 400 },
    { name: 'Q2', value: 600 },
    { name: 'Q3', value: 800 },
  ];

  return (
    <div className="bg-slate-900 min-h-screen p-6">
      <TailwindLineChart
        data={data}
        title="Quarterly Report"
        lines={[
          { dataKey: 'value', color: '#00ff41', name: 'Performance' }
        ]}
        height={300}
      />
    </div>
  );
};
```

## 🎯 Component Props

### DarkLineChart / TailwindLineChart

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | Array | required | Chart data array |
| `title` | String | '' | Chart title |
| `xDataKey` | String | 'name' | X-axis data key |
| `lines` | Array | [] | Line configuration array |
| `height` | Number | 300 | Chart height in pixels |
| `showGrid` | Boolean | true | Show/hide grid lines |
| `formatter` | Function | null | Value formatter function |
| `labelFormatter` | Function | null | Label formatter function |

### Line Configuration Object

```jsx
{
  dataKey: 'threats',           // Data property to plot
  color: '#00ffff',            // Line color (cyber neon recommended)
  name: 'Threats Detected'     // Legend label
}
```

## 🎨 Color Palette

The components use a cybersecurity-inspired color palette:

```jsx
const CYBER_COLORS = {
  primary: '#00ffff',    // Cyan - main accent
  secondary: '#00ff41',  // Lime green - secondary accent  
  accent: '#ff00ff',     // Purple/Magenta - highlights
  warning: '#ffff00',    // Yellow - warnings
  danger: '#ff0080',     // Hot pink - critical alerts
  grid: '#2a2f5a',       // Dark blue-gray - grid lines
  text: '#b0b8c7',       // Light gray - primary text
  textDim: '#6b7280'     // Dimmed gray - secondary text
};
```

## 📊 Chart Types Available

### 1. Line Charts
- Perfect for trend analysis and time series data
- Supports multiple lines with different colors
- Animated hover effects with glowing dots

### 2. Area Charts  
- Great for showing volume and accumulation
- Gradient fills with transparency
- Smooth curve animations

### 3. Bar Charts
- Ideal for categorical data comparison
- Rounded corners and glow effects
- Responsive bar sizing

### 4. Pie/Doughnut Charts
- Excellent for showing proportions
- Animated transitions and hover states
- Auto-percentage labels

## 🔧 Advanced Customization

### Custom Tooltip Formatting

```jsx
const customFormatter = (value, name) => {
  if (name === 'threats') return `${value} threats detected`;
  if (name === 'scans') return `${value} files scanned`;
  return value;
};

const customLabelFormatter = (label) => `Date: ${label}`;

<DarkLineChart
  data={data}
  formatter={customFormatter}
  labelFormatter={customLabelFormatter}
/>
```

### Multiple Datasets

```jsx
<DarkLineChart
  data={securityData}
  title="Multi-Metric Security Dashboard"
  lines={[
    { dataKey: 'malware', color: '#ff0080', name: 'Malware Detected' },
    { dataKey: 'phishing', color: '#ffff00', name: 'Phishing Attempts' },
    { dataKey: 'safe', color: '#00ff41', name: 'Safe Files' },
    { dataKey: 'total', color: '#00ffff', name: 'Total Scans' }
  ]}
  height={400}
/>
```

## 📱 Responsive Design

All charts automatically adapt to different screen sizes:

- **Desktop**: Full-width charts with detailed tooltips
- **Tablet**: Optimized spacing and font sizes
- **Mobile**: Compact layout with touch-friendly interactions

## 🎭 Theme Integration

### With Material-UI Theme

```jsx
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00ffff' },
    secondary: { main: '#00ff41' },
    background: {
      default: '#0a0e27',
      paper: '#1a1f3a'
    }
  }
});

<ThemeProvider theme={darkTheme}>
  <DarkLineChart data={data} title="Themed Chart" />
</ThemeProvider>
```

### With Tailwind CSS

```jsx
// Add to your tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber-primary': '#00ffff',
        'cyber-secondary': '#00ff41',
        'cyber-accent': '#ff00ff',
        'cyber-bg': '#0a0e27',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
      }
    }
  }
}
```

## 🌟 Best Practices

1. **Color Consistency**: Use the provided cyber color palette for brand consistency
2. **Data Formatting**: Always format your data with meaningful labels
3. **Responsive Heights**: Set appropriate heights for different screen sizes
4. **Accessibility**: Ensure sufficient color contrast for readability
5. **Performance**: Limit data points for smooth animations (< 100 points recommended)

## 🔍 Troubleshooting

### Charts Not Rendering
- Ensure all required dependencies are installed
- Check that data is properly formatted with required keys
- Verify chart container has proper dimensions

### Styling Issues
- Make sure parent container has dark background
- Check z-index conflicts with other elements
- Verify CSS custom properties are supported

### Performance Issues
- Reduce data points for large datasets
- Disable animations for better performance: `options={{ animation: false }}`
- Use chart virtualization for extremely large datasets

## 📈 Usage Examples

Check out the example files for complete implementations:
- `ChartExamples.js` - Recharts implementation with Material-UI
- `DarkChartJS.js` - Chart.js implementation  
- `TailwindCharts.js` - Pure Tailwind CSS implementation

## 🤝 Contributing

Feel free to contribute improvements, bug fixes, or new chart types. The components are designed to be modular and extensible.

## 📄 License

MIT License - feel free to use in personal and commercial projects.

---

**Perfect for**: Security dashboards, monitoring applications, analytics platforms, and any dark-themed data visualization needs.
