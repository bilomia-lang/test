# Quick Start Guide

## 1. Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## 2. Start the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm start
```

You should see: `Backend server running on http://localhost:5000`

### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm run dev
```

You should see: `http://localhost:5173/`

## 3. Open in Browser

Navigate to: **http://localhost:5173/**

## 4. Features to Try

### 🏠 Home Page
- See a random manga card with thumbnail
- Click "Get Random Manga" for more
- Use the search bar

### 🔍 Search Page
- Type a manga title (e.g., "One Piece", "Solo Leveling")
- Browse results in grid
- Click on any manga

### 📚 Chapters Page
- View all chapters for selected manga
- Load more chapters with button
- Click any chapter to read

### 📖 Reader Page
- Navigate pages with Previous/Next
- Use dropdown to jump to specific page
- See progress bar at bottom

## Color Scheme

Pure **Black & White** theme:
- Black header and buttons
- White background
- Gray accents for secondary elements
- Clean, minimalist design

## API Flow

```
User Browser
    ↓
React Frontend (localhost:5173)
    ↓ (Axios HTTP calls)
Express Backend (localhost:5000)
    ↓ (Proxy requests)
MangaDex API / Jikan API
    ↓
Data back to Frontend
    ↓
Display in React Components
```

## Important Notes

✅ **Backend handles:**
- CORS (Cross-Origin Resource Sharing)
- API proxy for both MangaDex and Jikan
- Error handling and timeouts
- Response formatting

✅ **Frontend never directly calls external APIs:**
- All requests go through backend proxy
- Secure and scalable architecture
- Consistent error handling

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | `npm start` with PORT=3000 |
| Can't connect backend | Ensure backend server is running |
| No images load | Check internet connection, image URLs from CDN |
| Search returns nothing | API might be slow, try again |
| Pages won't load in reader | Chapter might not have pages, try another |

## Next Steps

- Modify colors in `frontend/src/index.css`
- Add new features to backend routes
- Customize React components
- Deploy to production

## File Structure at a Glance

```
Backend (Node.js + Express):
server.js
├── /api/mangadex/random - Random manga
├── /api/mangadex/search - Search manga
├── /api/mangadex/manga/:id - Manga details
├── /api/mangadex/manga/:id/chapters - Get chapters
└── /api/mangadex/chapter/:id - Get pages

Frontend (React + Vite):
src/
├── App.jsx - Main app router
├── components/MangaCard.jsx - Home random card
├── pages/
│   ├── SearchPage.jsx - Search results
│   ├── ChaptersPage.jsx - Chapters list
│   └── ReaderPage.jsx - Chapter viewer
└── services/mangaService.js - API client
```

## Learning Path

1. **Day 1:** Get app running, explore UI
2. **Day 2:** Modify styling, learn component structure
3. **Day 3:** Add new API endpoints to backend
4. **Day 4:** Create new React components
5. **Day 5:** Deploy to production

That's it! Happy reading! 📖✨
