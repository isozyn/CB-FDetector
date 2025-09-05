# CB-FDetector Netlify Deployment - Quick Start

## 🚀 Deploy to Netlify in 5 Minutes

### Step 1: Prepare Repository
1. Commit all your changes to Git
2. Push to GitHub/GitLab

### Step 2: Deploy Frontend
1. Go to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your repository
4. Netlify will auto-detect settings from `netlify.toml`

### Step 3: Deploy Backend (Choose One)

#### Option A: Railway (Recommended)
1. Go to [Railway](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `backend/`
5. Copy the generated URL

#### Option B: Heroku
1. Install Heroku CLI
2. Run these commands:
```bash
cd backend
heroku create your-app-name
git subtree push --prefix backend heroku main
```

#### Option C: Render
1. Go to [Render](https://render.com)
2. Connect repository
3. Set root directory to `backend/`

### Step 4: Connect Frontend to Backend
1. Update the deployed backend URL in Netlify environment variables:
   - Go to Site settings > Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com`
2. Redeploy the site

### Step 5: Update CORS
Update your backend's CORS origins with your Netlify URL:
```javascript
// In backend/index.js, replace with your actual Netlify URL
origin: ['https://your-site-name.netlify.app']
```

## ✅ Deployment Complete!

Your CB-FDetector is now live and ready to use!

### 🔧 Troubleshooting
- **Build fails**: Check Node.js version in `netlify.toml`
- **API errors**: Verify backend URL and CORS settings
- **404 errors**: Ensure redirects are configured (handled automatically)

### 🌐 Next Steps
- Set up custom domain (optional)
- Configure environment variables for API keys
- Set up monitoring and analytics
