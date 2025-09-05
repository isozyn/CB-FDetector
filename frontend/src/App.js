import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';

// Import pages
import Dashboard from './pages/Dashboard';
import TextAnalysis from './pages/TextAnalysis';
import UrlAnalysis from './pages/UrlAnalysis';
import FileAnalysis from './pages/FileAnalysis';
import Analytics from './pages/Analytics';
import History from './pages/History';

// Import icons
import { 
  DashboardIcon, 
  TextIcon, 
  LinkIcon, 
  UploadIcon, 
  AnalyticsIcon, 
  HistoryIcon,
  MenuIcon,
  ShieldIcon
} from './assets/icons';

// Cyber Shield Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff', // Cyan
      light: '#66ffff',
      dark: '#00cccc',
    },
    secondary: {
      main: '#00ff41', // Lime green
      light: '#66ff66',
      dark: '#00cc33',
    },
    error: {
      main: '#ff0040', // Neon red
      light: '#ff6666',
      dark: '#cc0033',
    },
    warning: {
      main: '#ff9500', // Neon orange
      light: '#ffb366',
      dark: '#cc7700',
    },
    background: {
      default: '#0a0e27', // Dark navy
      paper: '#1a1f3a', // Slightly lighter navy
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0aec0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", sans-serif',
    h1: {
      fontFamily: '"Orbitron", "Inter", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    h2: {
      fontFamily: '"Orbitron", "Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.03em',
    },
    h3: {
      fontFamily: '"Orbitron", "Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Cybersecurity themed animations
const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff;
  }
  50% {
    box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components with cyber theme
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2a2f5a 100%)',
  boxShadow: '0 4px 20px rgba(0,255,255,0.2)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(0,255,255,0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #00ffff 0%, #00ff41 50%, #00ffff 100%)',
    animation: `${glowPulse} 3s ease-in-out infinite`,
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '25%',
    minWidth: '250px',
    maxWidth: '350px',
    background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #2a2f5a 100%)',
    color: 'white',
    border: 'none',
    borderRight: '1px solid rgba(0,255,255,0.3)',
    animation: `${slideIn} 0.3s ease-out`,
    boxSizing: 'border-box',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '2px',
      height: '100%',
      background: 'linear-gradient(180deg, #00ffff 0%, #00ff41 50%, #00ffff 100%)',
      opacity: 0.6,
    },
  },
}));

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  margin: '8px 16px',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  backgroundColor: active ? 'rgba(0,255,255,0.2)' : 'transparent',
  border: active ? '1px solid rgba(0,255,255,0.5)' : '1px solid transparent',
  '&:hover': {
    backgroundColor: 'rgba(0,255,255,0.1)',
    transform: 'translateX(4px)',
    boxShadow: '0 0 10px rgba(0,255,255,0.3)',
  },
  '& .MuiListItemIcon-root': {
    color: active ? '#00ffff' : 'white',
    minWidth: '40px',
    transition: 'color 0.3s ease',
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 400,
    color: active ? '#00ffff' : 'white',
  },
}));

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sidebarOpen',
})(({ theme, sidebarOpen }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)',
  paddingTop: '80px',
  animation: `${fadeIn} 0.5s ease-out`,
  transition: 'margin-left 0.3s ease',
  overflow: 'auto',
  [theme.breakpoints.up('md')]: {
    marginLeft: sidebarOpen ? '25%' : 0,
    width: sidebarOpen ? '75%' : '100%',
  },
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '20px 16px',
  borderBottom: '1px solid rgba(0,255,255,0.3)',
  marginBottom: '20px',
  background: 'rgba(0,255,255,0.05)',
  '& .pulse': {
    animation: `${glowPulse} 2s ease-in-out infinite`,
    filter: 'drop-shadow(0 0 10px #00ffff)',
  },
});

// Navigation items with cyber theme labels
const navigationItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/' },
  { text: 'Text Scan', icon: TextIcon, path: '/text-analysis' },
  { text: 'URL Check', icon: LinkIcon, path: '/url-analysis' },
  { text: 'File Upload', icon: UploadIcon, path: '/file-analysis' },
  { text: 'Reports', icon: AnalyticsIcon, path: '/analytics' },
  { text: 'History', icon: HistoryIcon, path: '/history' },
];

// Navigation component
const Navigation = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  
  const drawer = (
    <Box>
      <LogoContainer>
        <ShieldIcon size={32} className="pulse" />
        <Box ml={2}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#00ffff', fontFamily: '"Orbitron", sans-serif' }}>
            CB Fraud Detector
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8, color: '#00ff41' }}>
            Advanced Threat Detection
          </Typography>
        </Box>
      </LogoContainer>
      
      <List>
        {navigationItems.map((item) => (
          <StyledListItem
            key={item.text}
            component={Link}
            to={item.path}
            active={location.pathname === item.path ? 1 : 0}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>
              <item.icon size={20} />
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItem>
        ))}
      </List>
    </Box>
  );

  return drawer;
};

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
          {/* App Bar */}
          <StyledAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <ShieldIcon size={28} style={{ filter: 'drop-shadow(0 0 10px #00ffff)' }} />
              <Typography 
                variant="h6" 
                noWrap 
                component="div" 
                sx={{ 
                  ml: 2, 
                  fontWeight: 700,
                  fontFamily: '"Orbitron", sans-serif',
                  color: '#00ffff',
                  textShadow: '0 0 10px rgba(0,255,255,0.5)',
                }}
              >
                CB Fraud Detector
              </Typography>
            </Toolbar>
          </StyledAppBar>

          {/* Navigation Drawer */}
          {/* Mobile drawer */}
          <StyledDrawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <Navigation mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </StyledDrawer>

          {/* Desktop drawer */}
          <StyledDrawer
            variant="persistent"
            sx={{ display: { xs: 'none', md: 'block' } }}
            open={desktopOpen}
          >
            <Toolbar />
            <Navigation mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </StyledDrawer>

          {/* Main Content */}
          <MainContent component="main" sidebarOpen={desktopOpen} sx={{ flexGrow: 1 }}>
            <Container maxWidth="xl" sx={{ py: 3, px: 3 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/text-analysis" element={<TextAnalysis />} />
                <Route path="/url-analysis" element={<UrlAnalysis />} />
                <Route path="/file-analysis" element={<FileAnalysis />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </Container>
          </MainContent>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
