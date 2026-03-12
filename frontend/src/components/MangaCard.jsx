import React, { useEffect, useState } from 'react';
import { mangaService } from '../services/mangaService';
import './MangaCard.css';

export default function MangaCard({ onMangaSelect, onSearch, showToast }) {
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadRandomManga();
  }, []);

  const loadRandomManga = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mangaService.getRandomManga();
      setManga(data);
      if (showToast) {
        showToast(`Loaded: ${data.title}`, 'success');
      }
    } catch (err) {
      const errorMessage = 'Failed to load manga. Please try again.';
      setError(errorMessage);
      if (showToast) {
        showToast(errorMessage, 'error');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearching(true);
      if (showToast) {
        showToast(`Searching for "${searchQuery}"...`, 'info');
      }
      // Navigate to search page
      onSearch();
    }
  };

  const handleRandomClick = () => {
    loadRandomManga();
  };

  const handleCardClick = () => {
    if (manga && manga.id) {
      onMangaSelect(manga);
    }
  };

  return (
    <div className="manga-card-section">
      <div className="search-container">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search manga or webtoon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            disabled={searching}
          />
          <button type="submit" className="search-button" disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="card-wrapper">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-message">Loading random manga...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={loadRandomManga} className="retry-button">
              Try Again
            </button>
          </div>
        ) : manga ? (
          <div className="manga-card" onClick={handleCardClick}>
            {manga.coverUrl && (
              <div className="manga-image-container">
                <img
                  src={mangaService.getCoverImageUrl(manga.id, manga.coverUrl)}
                  alt={manga.title}
                  className="manga-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"%3E%3Crect fill="%23f0f0f0" width="300" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image Available%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            )}
            <div className="manga-content">
              <h2 className="manga-title">{manga.title}</h2>
              <p className="manga-status">
                Status: <span className={`status-${manga.status || 'unknown'}`}>{manga.status || 'Unknown'}</span>
              </p>
              <p className="manga-description">
                {manga.description ? manga.description.substring(0, 150) + '...' : 'No description available'}
              </p>
              <div className="card-actions">
                <button className="view-chapters-btn">
                  View Chapters →
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="action-buttons">
        <button onClick={handleRandomClick} className="random-button" disabled={loading}>
          Get Random Manga
        </button>
      </div>
    </div>
  );
}
