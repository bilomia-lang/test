# Deployment Guide for Render

## Prerequisites
- Node.js 16+ installed
- GitHub account
- Render.com account (free tier available)

## Local Setup

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deploying to Render

### Step 1: Create Backend Service on Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `manga-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.onrender.com
   MANGADEX_API=https://api.mangadex.org
   JIKAN_API=https://api.jikan.moe/v4
   ```
6. Deploy

### Step 2: Deploy Frontend to Netlify or Render

#### Option A: Netlify (Recommended for Frontend)
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Root Directory**: `frontend`
4. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```
5. Deploy

#### Option B: Render Static Site
1. Create a new Static Site on Render
2. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Root Directory**: `frontend`
3. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

## Environment Variables Reference

### Backend (.env)
- `PORT`: Server port (default: 5001)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Comma-separated list of allowed frontend URLs
- `MANGADEX_API`: MangaDex API endpoint
- `JIKAN_API`: Jikan API endpoint

### Frontend (.env)
- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_APP_NAME`: Application name
- `VITE_NODE_ENV`: Environment mode

## Features Deployed

✅ Infinite scroll toggle for chapters
✅ Infinite scroll mode for manga reader
✅ Modern icon-based UI (Lucide React icons)
✅ Search with debouncing
✅ Responsive design
✅ Error handling and toasts
✅ Production-ready CORS configuration

## Verification

After deployment:

1. Check backend health:
   ```
   curl https://your-backend.onrender.com/health
   ```

2. Check frontend loads correctly at your domain

3. Try searching for manga

4. Try reading a chapter with infinite scroll

## Troubleshooting

### CORS Issues
- Make sure `FRONTEND_URL` in backend includes your frontend domain
- Include protocol (http:// or https://)

### API Not Loading
- Verify `VITE_API_BASE_URL` is set correctly in frontend
- Check backend is running with `curl /health`

### Images Not Loading
- External image URLs should work (MangaDex/Jikan sources)
- Check browser console for any CORS errors

## Performance Tips

1. Frontend uses code splitting with Vite
2. Images are lazy loaded
3. Use browser devtools to check performance
4. Monitor Render logs for backend performance

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)
