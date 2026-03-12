import React, { useState, useEffect, useRef } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { mangaService } from '../services/mangaService';
import './SearchPage.css';

export default function SearchPage({ onMangaSelect, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimer = useRef(null);

  // Debounced search function
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!searchQuery.trim()) {
      setHasSearched(false);
      setResults([]);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const data = await mangaService.searchManga(query);
      setResults(data.data || []);
      if (showToast && data.data?.length > 0) {
        showToast(`Found ${data.data.length} results for "${query}"`, 'success');
      }
    } catch (err) {
      const errorMessage = 'Failed to search manga. Please try again.';
      setError(errorMessage);
      if (showToast) {
        showToast(errorMessage, 'error');
      }
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    performSearch(searchQuery);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search for manga or webtoon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading && (
        <div className="search-loading">
          <div className="spinner"></div>
          <p className="loading-message">Searching for manga...</p>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className="no-results">
          <p>No manga found for "{searchQuery}"</p>
          <p className="hint">Try searching with different keywords</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="search-results">
          <h2>Search Results ({results.length})</h2>
          <div className="results-grid">
            {results.map((manga) => (
              <div key={manga.id} className="result-card" onClick={() => onMangaSelect(manga)}>
                {manga.coverUrl && (
                  <div className="result-image">
                    <img
                      src={mangaService.getCoverImageUrl(manga.id, manga.coverUrl)}
                      alt={manga.title}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280"%3E%3Crect fill="%23f0f0f0" width="200" height="280"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
                <div className="result-info">
                  <h3>{manga.title}</h3>
                  <p className="result-status">{manga.status || 'Unknown'}</p>
                  <p className="result-description">
                    {manga.description ? manga.description.substring(0, 80) + '...' : 'No description'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasSearched && (
        <div className="initial-message">
          <p>Enter a manga title to search</p>
        </div>
      )}
    </div>
  );
}
