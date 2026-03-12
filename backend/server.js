import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Parse allowed origins from environment variable or use defaults
const getAllowedOrigins = () => {
  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ];

  if (process.env.FRONTEND_URL) {
    const envOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim());
    return [...defaultOrigins, ...envOrigins];
  }

  return defaultOrigins;
};

// CORS configuration
app.use(cors({
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// API Base URLs
const MANGADEX_API = process.env.MANGADEX_API || 'https://api.mangadex.org';
const JIKAN_API = process.env.JIKAN_API || 'https://api.jikan.moe/v4';

// ============== JIKAN API ROUTES ==============

// Get random manga
app.get('/api/random-manga', async (req, res) => {
  try {
    const response = await axios.get(`${JIKAN_API}/random/manga`, {
      timeout: 5000
    });
    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching random manga from Jikan:', error.message);
    res.status(500).json({ error: 'Failed to fetch random manga' });
  }
});

// Search manga by query
app.get('/api/search/manga', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) return res.status(400).json({ error: 'Query required' });

    const response = await axios.get(`${JIKAN_API}/manga`, {
      params: { query, page, limit: 12 },
      timeout: 5000
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching manga:', error.message);
    res.status(500).json({ error: 'Failed to search manga' });
  }
});

// Get manga details from Jikan
app.get('/api/manga/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${JIKAN_API}/manga/${id}`, {
      timeout: 5000
    });
    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching manga details:', error.message);
    res.status(500).json({ error: 'Failed to fetch manga details' });
  }
});

// ============== MANGADEX API ROUTES ==============

// Search manga on MangaDex
app.get('/api/mangadex/search', async (req, res) => {
  try {
    const { query, limit = 12, offset = 0 } = req.query;
    if (!query) return res.status(400).json({ error: 'Query required' });

    const response = await axios.get(`${MANGADEX_API}/manga`, {
      params: {
        title: query,
        limit,
        offset,
        includes: ['cover_art'],
        order: { relevance: 'desc' }
      },
      timeout: 5000
    });

    const mangaList = response.data.data.map(manga => ({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      description: manga.attributes.description.en || '',
      status: manga.attributes.status,
      coverUrl: manga.relationships.find(r => r.type === 'cover_art')?.attributes?.fileName || null
    }));

    res.json({
      data: mangaList,
      total: response.data.total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching manga from MangaDex:', error.message);
    
    // Fallback to demo data
    const results = demoMangaList.filter(m => 
      m.title.toLowerCase().includes(req.query.query?.toLowerCase() || '')
    );
    
    res.json({
      data: results.length > 0 ? results : demoMangaList,
      total: demoMangaList.length,
      limit: req.query.limit || 12,
      offset: req.query.offset || 0
    });
  }
});

// Get MangaDex manga by ID
app.get('/api/mangadex/manga/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${MANGADEX_API}/manga/${id}`, {
      params: {
        includes: ['cover_art', 'author', 'artist']
      },
      timeout: 5000
    });

    const manga = response.data.data;
    res.json({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      description: manga.attributes.description.en || '',
      status: manga.attributes.status,
      coverUrl: manga.relationships.find(r => r.type === 'cover_art')?.attributes?.fileName || null,
      relationships: manga.relationships
    });
  } catch (error) {
    console.error('Error fetching manga details from MangaDex:', error.message);
    res.status(500).json({ error: 'Failed to fetch manga details' });
  }
});

// Get manga chapters from MangaDex
app.get('/api/mangadex/manga/:id/chapters', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const response = await axios.get(`${MANGADEX_API}/manga/${id}/feed`, {
      params: {
        limit,
        offset,
        translatedLanguage: ['en'],
        order: { chapter: 'desc' },
        includes: ['scanlation_group']
      },
      timeout: 5000
    });

    const chapters = response.data.data.map(chapter => ({
      id: chapter.id,
      chapter: chapter.attributes.chapter || 'Special',
      title: chapter.attributes.title || '',
      volume: chapter.attributes.volume,
      pages: chapter.attributes.pages,
      publishAt: chapter.attributes.publishAt,
      groups: chapter.relationships
        .filter(r => r.type === 'scanlation_group')
        .map(r => r.id)
    }));

    res.json({
      data: chapters,
      total: response.data.total
    });
  } catch (error) {
    console.error('Error fetching chapters:', error.message);
    
    // Fallback to demo data
    res.json({
      data: demoChapters,
      total: demoChapters.length
    });
  }
});

// Get chapter pages from MangaDex
app.get('/api/mangadex/chapter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${MANGADEX_API}/at-home/server/${id}`, {
      timeout: 5000
    });

    const { baseUrl, chapter } = response.data;
    const pages = chapter.dataSaver.map((page, index) => ({
      index,
      url: `${baseUrl}/data-saver/${chapter.hash}/${page}`
    }));

    res.json({
      pages,
      pageCount: chapter.dataSaver.length
    });
  } catch (error) {
    console.error('Error fetching chapter pages:', error.message);
    
    // Fallback: Generate placeholder pages
    const pages = Array.from({ length: 10 }, (_, i) => ({
      index: i,
      url: `https://via.placeholder.com/400x600?text=Page+${i + 1}`
    }));
    
    res.json({
      pages,
      pageCount: pages.length
    });
  }
});


// Get random manga from MangaDex
app.get('/api/mangadex/random', async (req, res) => {
  try {
    const response = await axios.get(`${MANGADEX_API}/manga/random`, {
      params: {
        includes: ['cover_art']
      },
      timeout: 8000
    });

    const manga = response.data.data;
    res.json({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      description: manga.attributes.description.en || '',
      status: manga.attributes.status,
      coverUrl: manga.relationships.find(r => r.type === 'cover_art')?.attributes?.fileName || null
    });
  } catch (error) {
    console.error('Error fetching random manga from MangaDex:', error.message);
    
    // Fallback: Try Jikan API
    try {
      const jikanResponse = await axios.get(`${JIKAN_API}/random/manga`, {
        timeout: 8000
      });
      const data = jikanResponse.data.data;
      res.json({
        id: data.mal_id,
        title: data.title,
        description: data.synopsis || '',
        status: data.status || 'Unknown',
        coverUrl: data.images?.jpg?.image_url || null
      });
    } catch (jikanError) {
      console.error('Error fetching from Jikan API:', jikanError.message);
      
      // Final fallback: Use demo data
      const randomManga = demoMangaList[Math.floor(Math.random() * demoMangaList.length)];
      res.json(randomManga);
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', mode: NODE_ENV });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Manga Reader API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      randomManga: '/api/random-manga',
      search: '/api/search/manga',
      manga: '/api/manga/:id',
      mangadexSearch: '/api/mangadex/search',
      mangadexManga: '/api/mangadex/manga/:id',
      mangadexChapters: '/api/mangadex/manga/:id/feed',
      mangadexPages: '/api/mangadex/at-home/server/:chapterId'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
