# Environment Configuration

## Backend Environment Variables

Create `.env` file in the `backend/` folder (optional):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Settings
CORS_ORIGIN=http://localhost:5173

# API Timeouts (in milliseconds)
API_TIMEOUT=5000

# Rate Limiting (optional for production)
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## Frontend Environment Variables

Create `.env` file in the `frontend/` folder (optional):

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## Database/Storage (for Future)

If you want to add caching or persistent data:

```env
# Redis (optional caching)
REDIS_URL=redis://localhost:6379

# MongoDB (optional for bookmarks/history)
MONGODB_URI=mongodb://localhost:27017/manga-reader
```

## Production Deployment

### Heroku Backend
```env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Vercel/Netlify Frontend
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Security Notes

⚠️ **Never commit `.env` files to version control**

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
node_modules/
dist/
build/
```

## Local Development

For local testing, the default configuration works:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- No `.env` files needed initially

Just run:
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```

Done! Navigate to http://localhost:5173/
