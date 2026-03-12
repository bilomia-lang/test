# API Documentation

Complete reference for all backend endpoints and how they work.

## Base URL
```
http://localhost:5000
```

## Authentication
No authentication required. All endpoints are public.

## Response Format

### Success Response (200 OK)
```json
{
  "data": { ... },
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Endpoints

### 🎲 Random Manga

**Endpoint:** `GET /api/mangadex/random`

**Description:** Get a random manga with cover image

**Query Parameters:** None

**Response:**
```json
{
  "id": "a1b2c3d4",
  "title": "One Piece",
  "description": "Long-running anime series...",
  "status": "ongoing",
  "coverUrl": "filename.jpg"
}
```

**Usage:**
```javascript
const manga = await fetch('http://localhost:5000/api/mangadex/random')
  .then(res => res.json())
```

---

### 🔍 Search Manga

**Endpoint:** `GET /api/mangadex/search`

**Description:** Search manga by title

**Query Parameters:**
- `query` (required): Manga title to search
- `limit` (optional): Results per page (default: 12)

**Response:**
```json
{
  "data": [
    {
      "id": "id1",
      "title": "Manga Title",
      "description": "...",
      "status": "ongoing",
      "coverUrl": "filename.jpg"
    }
  ],
  "total": 150,
  "limit": 12,
  "offset": 0
}
```

**Usage:**
```javascript
const results = await fetch('http://localhost:5000/api/mangadex/search?query=one%20piece&limit=12')
  .then(res => res.json())
```

---

### 📚 Get Manga Details

**Endpoint:** `GET /api/mangadex/manga/:id`

**Description:** Get full details for a specific manga

**Path Parameters:**
- `id` (required): Manga ID

**Response:**
```json
{
  "id": "a1b2c3d4",
  "title": "One Piece",
  "description": "...",
  "status": "ongoing",
  "coverUrl": "filename.jpg",
  "relationships": [{ ... }]
}
```

**Usage:**
```javascript
const details = await fetch('http://localhost:5000/api/mangadex/manga/a1b2c3d4')
  .then(res => res.json())
```

---

### 📖 Get Manga Chapters

**Endpoint:** `GET /api/mangadex/manga/:id/chapters`

**Description:** Get all chapters for a manga (with pagination)

**Path Parameters:**
- `id` (required): Manga ID

**Query Parameters:**
- `limit` (optional): Chapters per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": "chapter-id-001",
      "chapter": "1",
      "title": "The Beginning",
      "volume": "1",
      "pages": 25,
      "publishAt": "2023-01-15T10:00:00Z",
      "groups": ["scanlation-group-id"]
    }
  ],
  "total": 1050
}
```

**Usage:**
```javascript
const chapters = await fetch('http://localhost:5000/api/mangadex/manga/a1b2c3d4/chapters?limit=20&offset=0')
  .then(res => res.json())
```

---

### 📄 Get Chapter Pages

**Endpoint:** `GET /api/mangadex/chapter/:id`

**Description:** Get all pages/images for a specific chapter

**Path Parameters:**
- `id` (required): Chapter ID

**Response:**
```json
{
  "pages": [
    {
      "index": 0,
      "url": "https://uploads.mangadex.org/data-saver/hash/page1.jpg"
    },
    {
      "index": 1,
      "url": "https://uploads.mangadex.org/data-saver/hash/page2.jpg"
    }
  ],
  "pageCount": 25
}
```

**Usage:**
```javascript
const images = await fetch('http://localhost:5000/api/mangadex/chapter/chapter-id-001')
  .then(res => res.json())
```

---

## Jikan API Endpoints

### Random Manga (Jikan)

**Endpoint:** `GET /api/random-manga`

Alternative source for random manga from Jikan API

**Response:** Similar to MangaDex random endpoint

---

### Search Manga (Jikan)

**Endpoint:** `GET /api/search/manga`

**Query Parameters:**
- `query` (required): Manga title
- `page` (optional): Page number (default: 1)

---

### Manga Details (Jikan)

**Endpoint:** `GET /api/manga/:id`

Get manga details from Jikan (different data structure than MangaDex)

---

## Error Responses

### Bad Request (400)
```json
{
  "error": "Query required"
}
```

### Server Error (500)
```json
{
  "error": "Failed to fetch manga"
}
```

### Timeout (Handled gracefully)
- Request times out after 5 seconds
- Returns error message
- Frontend shows retry button

---

## Rate Limiting

Currently no rate limiting. In production, consider:
- Max 100 requests per 15 minutes per IP
- Cache responses
- Implement Redis caching

---

## CORS Headers

All responses include CORS headers:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Credentials: true
```

---

## Performance Tips

1. **Use pagination** for chapter lists
   ```javascript
   // Load 20 chapters at a time
   /api/mangadex/manga/:id/chapters?limit=20&offset=0
   ```

2. **Cache chapter pages** in browser
   ```javascript
   // Store in localStorage or sessionStorage
   const pages = JSON.parse(localStorage.getItem(`chapter-${chapterId}`))
   ```

3. **Lazy load images** in reader
   ```javascript
   // Only load current and next page images
   ```

4. **Combine requests** when possible
   - Get manga info and chapters in one request series

---

## Testing Endpoints

### Using cURL

```bash
# Get random manga
curl http://localhost:5000/api/mangadex/random

# Search manga
curl "http://localhost:5000/api/mangadex/search?query=naruto"

# Get chapters
curl "http://localhost:5000/api/mangadex/manga/05b3f68f-6522-42da-8cb8-7e4186eb0509/chapters"
```

### Using Postman

1. Import the base URL: `http://localhost:5000`
2. Create requests for each endpoint
3. Set query parameters in "Params" tab
4. Send and view responses

---

## API Integration in Frontend

See `src/services/mangaService.js` for the client implementation:

```javascript
import { mangaService } from './services/mangaService'

// Get random manga
const manga = await mangaService.getRandomManga()

// Search
const results = await mangaService.searchManga('One Piece')

// Get chapters
const chapters = await mangaService.getMangaChapters(mangaId)

// Get pages
const pages = await mangaService.getChapterPages(chapterId)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 Not Found | Check endpoint URL spelling, use correct path parameters |
| 500 Server Error | Backend server might be down, check backend logs |
| CORS error | Ensure backend is running on correct port |
| Empty results | API might not have data, try different search query |
| Timeout | MangaDex API under load, retry after a few seconds |

---

## External API Documentation

- **MangaDex API:** https://api.mangadex.org/docs
- **Jikan API:** https://jikan.moe/upcoming

For latest API changes, check official documentation.
