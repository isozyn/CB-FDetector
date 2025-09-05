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

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#9aa7f0',
      dark: '#4c63d2',
    },
    secondary: {
      main: '#764ba2',
      light: '#a574d3',
      dark: '#5d3a82',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Animations
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

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    animation: `${slideIn} 0.3s ease-out`,
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: '8px 16px',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: 'translateX(4px)',
  },
  '& .MuiListItemIcon-root': {
    color: 'white',
    minWidth: '40px',
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 400,
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  marginLeft: 0,
  transition: 'margin-left 0.3s ease',
  minHeight: '100vh',
  paddingTop: '80px',
  animation: `${fadeIn} 0.5s ease-out`,
  [theme.breakpoints.up('md')]: {
    marginLeft: 280,
  },
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '20px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  marginBottom: '20px',
});

// Navigation items
const navigationItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/' },
  { text: 'Text Analysis', icon: TextIcon, path: '/text-analysis' },
  { text: 'URL Analysis', icon: LinkIcon, path: '/url-analysis' },
  { text: 'File Analysis', icon: UploadIcon, path: '/file-analysis' },
  { text: 'Analytics', icon: AnalyticsIcon, path: '/analytics' },
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
          <Typography variant="h6" fontWeight={700}>
            CB-Threat-Detector
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Advanced Security Platform
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
  const muiTheme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          {/* App Bar */}
          <StyledAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <ShieldIcon size={28} />
              <Typography variant="h6" noWrap component="div" sx={{ ml: 2, fontWeight: 600 }}>
                CB-Threat-Detector
              </Typography>
            </Toolbar>
          </StyledAppBar>

          {/* Navigation Drawer */}
          <Box
            component="nav"
            sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}
          >
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
              variant="permanent"
              sx={{ display: { xs: 'none', md: 'block' } }}
              open
            >
              <Toolbar />
              <Navigation mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            </StyledDrawer>
          </Box>

          {/* Main Content */}
          <MainContent component="main" sx={{ flexGrow: 1 }}>
            <Container maxWidth="xl" sx={{ py: 3 }}>
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
