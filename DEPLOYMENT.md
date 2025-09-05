# CB-FDetector - Netlify Deployment

## 🚀 Deployment Instructions

### Frontend Deployment (Netlify)

1. **Connect Repository to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the CB-FDetector repository

2. **Build Settings** (Auto-configured via netlify.toml)
   - Base directory: `frontend/`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

3. **Environment Variables** (If needed for API endpoints)
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   REACT_APP_ENV=production
   ```

### Backend Deployment Options

Since Netlify only hosts static sites, you'll need to deploy your backend separately:

#### Option 1: Heroku
1. Install Heroku CLI
2. Create a new Heroku app
3. Deploy backend to Heroku
4. Update frontend API URLs

#### Option 2: Railway
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Deploy the backend folder
4. Update frontend API URLs

#### Option 3: Render
1. Go to [Render](https://render.com)
2. Create a new web service
3. Connect your repository
4. Set root directory to `backend/`

### Production API Configuration

Update your frontend API service to use the production backend URL:

```javascript
// In frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

### SSL and Security

- Netlify provides free SSL certificates
- Security headers are configured in netlify.toml
- CORS must be configured in your backend for the Netlify domain

### Custom Domain (Optional)

1. In Netlify dashboard, go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS records as instructed

## 📝 Deployment Checklist

- [ ] Repository connected to Netlify
- [ ] Build settings configured
- [ ] Environment variables set (if needed)
- [ ] Backend deployed to separate service
- [ ] API URLs updated in frontend
- [ ] CORS configured in backend
- [ ] SSL certificate active
- [ ] Custom domain configured (optional)

## 🔧 Troubleshooting

### Build Fails
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for any missing environment variables

### API Calls Fail
- Verify backend is deployed and accessible
- Check CORS configuration
- Verify API URLs in frontend code

### Routing Issues
- Ensure `_redirects` file is configured (handled by netlify.toml)
- Check that all routes are properly defined in React Router
