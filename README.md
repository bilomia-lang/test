# Manga Reader Application

A fully functional manga/webtoon reader built with React and Express, featuring search, chapters, and a beautiful black & white themed interface. The app uses MangaDex and Jikan APIs with a secure backend proxy to handle CORS issues.

## Features

✨ **Core Features:**
- 🎲 Random manga card on homepage
- 🔍 Search manga by title
- 📚 Browse all chapters with real-time data
- 📖 Full-featured chapter reader with page navigation
- 🎨 Black & white minimalist design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔒 Secure API proxy (no direct frontend-to-API calls)

✅ **Quality Features:**
- Smooth page transitions and animations
- Progress bar for chapter reading
- Error handling and retry mechanisms
- Loading states and spinners
- Image optimization and fallbacks

## Tech Stack

**Backend:**
- Node.js + Express
- Axios (HTTP client)
- CORS enabled for secure cross-origin requests

**Frontend:**
- React 18
- Vite (fast development server)
- Vanilla CSS (black & white theme)

**APIs:**
- MangaDex API (manga data, chapters, pages)
- Jikan API (alternative manga data)

## Project Structure

```
MANGA/
├── backend/
│   ├── package.json
│   └── server.js           # Express server with API routes
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── MangaCard.jsx      # Random manga card
    │   │   └── MangaCard.css
    │   ├── pages/
    │   │   ├── SearchPage.jsx     # Search results
    │   │   ├── SearchPage.css
    │   │   ├── ChaptersPage.jsx   # Chapters list
    │   │   ├── ChaptersPage.css
    │   │   ├── ReaderPage.jsx     # Chapter reader
    │   │   └── ReaderPage.css
    │   ├── services/
    │   │   └── mangaService.js    # API client
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Development server will run on `http://localhost:5173`

## API Endpoints

### Backend Proxy Routes

**MangaDex Routes:**
- `GET /api/mangadex/random` - Get random manga
- `GET /api/mangadex/search?query=...` - Search manga
- `GET /api/mangadex/manga/:id` - Get manga details
- `GET /api/mangadex/manga/:id/chapters?limit=20&offset=0` - Get chapters
- `GET /api/mangadex/chapter/:id` - Get chapter pages

**Jikan Routes:**
- `GET /api/random-manga` - Get random manga from Jikan
- `GET /api/search/manga?query=...` - Search manga on Jikan
- `GET /api/manga/:id` - Get manga details from Jikan

### CORS & Proxy Benefits

The backend proxy handles:
- ✅ CORS issues (frontend safely calls proxy, proxy calls APIs)
- ✅ API rate limiting (proxy can cache responses)
- ✅ Error handling (consistent error responses)
- ✅ Response transformation (clean data for frontend)
- ✅ Security (API keys can be stored server-side if needed)

## Usage

### Home Page
1. View a random manga card with thumbnail and details
2. Click the card to view all chapters
3. Click "Get Random Manga" for another random selection
4. Use the search bar to search for specific manga

### Search
1. Enter a manga title in the search bar
2. Browse results in a grid layout
3. Click on any result to view its chapters

### Chapters
1. View all available chapters for the selected manga
2. See chapter numbers, titles, dates, and page counts
3. Click "Load More" to load additional chapters
4. Click any chapter to start reading

### Reader
1. View manga pages full-screen
2. Navigate with Previous/Next buttons or page dropdown
3. See reading progress at the bottom
4. Responsive for all screen sizes

## Black & White Theme

The app uses a sophisticated black & white color scheme:
- **Primary:** Pure Black (#000000)
- **Secondary:** Pure White (#ffffff)
- **Accent:** Dark Gray (#333333)
- **Text Primary:** Black (#000000)
- **Text Secondary:** Gray (#666666)
- **Background Light:** Off-white (#f9f9f9)

All components follow this theme for consistency.

## Development

### Adding New Features

**Add a new page:**
1. Create component in `src/pages/`
2. Import in `App.jsx`
3. Add route in App state management
4. Style with CSS module

**Add API endpoint:**
1. Create route in `backend/server.js`
2. Use axios to call upstream API
3. Add client method in `src/services/mangaService.js`

**Customize theme:**
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary: #000000;
  --secondary: #ffffff;
  /* ... */
}
```

## Performance Notes

- Backend queries are optimized with timeouts (5 seconds)
- Frontend implements lazy loading for chapter lists
- Images are optimized through MangaDex CDN
- Vite provides fast HMR during development
- Production build is minified and optimized

## Error Handling

The app gracefully handles:
- Network timeouts
- Failed API requests
- Missing images (fallback placeholders)
- Empty search results
- No available chapters

Each page shows helpful error messages with retry options.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# Linux/Mac: lsof -i :5000
# Windows: netstat -ano | findstr :5000
# Kill the process or use a different port
```

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check CORS is enabled in `backend/server.js`
- Check browser console for errors

### API timeouts
- Check your internet connection
- MangaDex API might be under load
- Try again after a few seconds

### Images not loading
- Images come from MangaDex CDN (may be blocked in some regions)
- Fallback placeholder shows if images fail
- Try a VPN if images are region-blocked

## Deployment

### Deploy Backend (Heroku/Railway/Vercel)
```bash
# Add Procfile or configure for your platform
# Set environment variables if needed
# Push to platform
```

### Deploy Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
# Set API_URL environment variable to your backend URL
```

## Future Enhancements

- [ ] User authentication and bookmarks
- [ ] Chapter download functionality
- [ ] Offline reading mode
- [ ] Multiple language support
- [ ] Advanced filtering and sorting
- [ ] Dark mode toggle
- [ ] Social sharing features
- [ ] Reading history

## License

MIT License - Feel free to use this project for personal or commercial use.

## Credits

- **MangaDex API** - For manga data and pages
- **Jikan API** - For alternative manga information
- Built with React + Express

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in browser console
3. Check backend server logs
4. Open an issue with details

---

Enjoy reading! 📚✨
