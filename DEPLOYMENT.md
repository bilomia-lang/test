# Deployment Guide

Complete instructions for deploying the Manga Reader to production.

## Prerequisites

- Git repository (GitHub, GitLab, etc.)
- Production hosting accounts
- Domain names (optional but recommended)

---

## Backend Deployment

### Option 1: Heroku (Recommended for Beginners)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Procfile** in backend folder:
   ```
   web: node server.js
   ```

3. **Deploy**
   ```bash
   cd backend
   heroku create your-app-name
   git push heroku main
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
   heroku logs --tail
   ```

Your backend will be at: `https://your-app-name.herokuapp.com`

### Option 2: Railway

1. **Connect GitHub repository**
   - Go to railway.app
   - Connect your GitHub account
   - Select your MANGA repository

2. **Add Backend Service**
   - Select the `backend` folder
   - Set start command: `npm start`
   - Railway auto-detects Node.js

3. **Environment Variables**
   - Set in Railway dashboard:
   - `CORS_ORIGIN=https://your-frontend-domain.com`

### Option 3: Render

1. **Create New Web Service**
   - Connect GitHub repository
   - Select `backend` folder
   - Build command: `npm install`
   - Start command: `npm start`

2. **Environment**
   - Set Node version: 18
   - Set environment variables in dashboard

### Option 4: DigitalOcean/AWS (Advanced)

1. **Create VM/EC2 instance**
2. **SSH into server**
3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone repository**
   ```bash
   git clone <your-repo>
   cd MANGA/backend
   npm install
   ```

5. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "manga-backend"
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx reverse proxy**
   ```nginx
   server {
     listen 80;
     server_name your-api-domain.com;

     location / {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
     }
   }
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d your-api-domain.com
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Configure:
     - Framework: React
     - Root Directory: `frontend`
     - Build command: `npm run build`
     - Output directory: `dist`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-api.com/api
   ```

4. **Deploy**
   - Vercel auto-deploys on push to main
   - Get URL: `https://your-project.vercel.app`

### Option 2: Netlify

1. **Connect GitHub**
   - Go to netlify.com
   - Click "New site from Git"
   - Select repository

2. **Configure**
   - Base Directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Add `VITE_API_URL` in build settings

4. **Deploy**
   - Netlify auto-deploys on git push

### Option 3: GitHub Pages (Free, Static Only)

Not recommended (requires API proxy to work)

### Option 4: AWS S3 + CloudFront

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

3. **Setup CloudFront**
   - Create distribution pointing to S3
   - Add CORS headers
   - Cache invalidation

4. **Custom Domain**
   - Add CNAME record pointing to CloudFront

---

## Environment Variables

### Backend Production

```env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
API_TIMEOUT=10000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Production

```env
VITE_API_URL=https://your-backend-api.com/api
```

---

## Database (Optional)

### MongoDB Atlas (Free Tier)

For future features like bookmarks/history:

1. **Create cluster at mongodb.com**
2. **Get connection string**
3. **Add to backend .env**
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/manga
   ```

### Redis (Caching)

For better performance:

1. **Use Redis Cloud (free tier)**
2. **Add connection string to backend**
   ```env
   REDIS_URL=redis://default:password@host:port
   ```

---

## Domain Setup

### CloudFlare DNS (Recommended)

1. **Add domain at cloudflare.com**
2. **Update nameservers at domain registrar**
3. **Add DNS records:**

```
API Records:
A       api.manga.com      → Backend IP/Domain
CNAME   api.manga.com      → your-backend.netlify.com

Frontend Records:
CNAME   www.manga.com      → your-frontend.vercel.app
CNAME   manga.com          → your-frontend.vercel.app
```

4. **Enable Cloudflare proxy** for security

---

## SSL/TLS Certificates

### LetsEncrypt (Free)

Automatically handled by:
- Vercel ✅
- Netlify ✅
- Heroku ✅
- Railway ✅

For self-hosted:
```bash
sudo certbot certonly --standalone -d your-domain.com
```

---

## Monitoring & Logging

### Backend Logs

**Heroku:**
```bash
heroku logs --tail
```

**Railway:**
- View in dashboard

**Render:**
- View in dashboard

**Self-hosted:**
```bash
# With PM2
pm2 logs
```

### Uptime Monitoring

Services:
- UptimeRobot (free)
- StatusCake
- Grafana (advanced)

---

## Performance Optimization

### Backend

1. **Enable gzip compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add caching headers**
   ```javascript
   app.use((req, res, next) => {
     res.set('Cache-Control', 'public, max-age=300');
     next();
   });
   ```

3. **Implement Redis caching**
   ```javascript
   // Cache search results for 1 hour
   const cacheKey = `search:${query}`;
   ```

### Frontend

1. **Code splitting**
   - Vite handles automatically

2. **Image optimization**
   - Mangadex CDN handles compression

3. **CDN**
   - Vercel/Netlify auto-CDN
   - Or use Cloudflare

---

## CI/CD Pipeline

### GitHub Actions (Automatic)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "your-backend-app"
          appdir: "backend"

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: vercel/action@master
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| Backend can't connect to APIs | Check firewall/proxy settings |
| Frontend CORS error | Verify backend CORS_ORIGIN variable |
| Images not loading | Check image CDN accessibility in region |
| Slow performance | Enable caching, use CDN, optimize images |
| 502 Bad Gateway | Backend might be down, check logs |

---

## Scaling (For Future)

When you get more users:

1. **Add database**
   - MongoDB for bookmarks
   - Redis for caching

2. **Message queue**
   - Bull/RabbitMQ for background jobs

3. **Load balancing**
   - Multiple backend instances
   - Kubernetes deployment

4. **Microservices**
   - Separate services for different features
   - Docker containerization

---

## Maintenance

- **Update dependencies** monthly
  ```bash
  npm outdated
  npm update
  ```

- **Monitor performance**
  - Check response times
  - Monitor error rates

- **Regular backups**
  - Database backups daily
  - Code backups in Git

---

## Cost Estimates

| Service | Tier | Cost |
|---------|------|------|
| Backend Hosting | Heroku Free | $7/month (basic) |
| Frontend Hosting | Vercel Free | $0 |
| Domain | Namecheap | $2-12/year |
| Database | MongoDB Atlas Free | $0 |
| CDN | Cloudflare Free | $0 |
| **Total** | **Minimal Setup** | **~$15-30/year** |

---

## Quick Deployment Checklist

- [ ] Backend environment variables set
- [ ] Frontend API URL configured
- [ ] GitHub repository pushed
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Domain DNS configured
- [ ] SSL certificate verified
- [ ] Monitoring setup
- [ ] Error logging enabled
- [ ] Performance tested

---

## Support

For deployment issues:
1. Check service documentation
2. Review logs carefully
3. Test locally first
4. Use postman/curl to test API endpoints

Deployment done! Your app is live! 🚀
