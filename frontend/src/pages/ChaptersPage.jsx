import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, FileText, Book, ChevronRight, Settings } from 'lucide-react';
import { mangaService } from '../services/mangaService';
import './ChaptersPage.css';

export default function ChaptersPage({ manga, onChapterSelect, showToast }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [infiniteScroll, setInfiniteScroll] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
    loadChapters(0);
  }, [manga.id]);

  // Infinite scroll observer
  useEffect(() => {
    if (!infiniteScroll || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadChapters(offset, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [infiniteScroll, hasMore, loadingMore, offset]);

  const loadChapters = async (newOffset = 0, isInfiniteLoad = false) => {
    try {
      if (isInfiniteLoad) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await mangaService.getMangaChapters(manga.id, 20, newOffset);
      if (newOffset === 0) {
        setChapters(data.data || []);
        if (showToast && !isInfiniteLoad) {
          showToast(`Loaded chapters for ${manga.title}`, 'success');
        }
      } else {
        setChapters(prev => [...prev, ...(data.data || [])]);
        if (showToast && infiniteScroll) {
          showToast('More chapters loaded', 'info');
        }
      }
      setOffset(newOffset + 20);
      setHasMore((data.data || []).length === 20);
    } catch (err) {
      const errorMessage = 'Failed to load chapters. Please try again.';
      setError(errorMessage);
      if (showToast) {
        showToast(errorMessage, 'error');
      }
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    loadChapters(offset);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Unknown date';
    }
  };

  return (
    <div className="chapters-page">
      <div className="chapters-header">
        <div className="header-top">
          <h1>{manga.title}</h1>
          <div className="scroll-toggle">
            <button 
              className={`toggle-btn ${infiniteScroll ? 'active' : ''}`}
              onClick={() => setInfiniteScroll(!infiniteScroll)}
              title="Toggle infinite scroll"
            >
              <Settings size={18} />
              {infiniteScroll ? 'Infinite Scroll' : 'Pagination'}
            </button>
          </div>
        </div>
        <p className="chapters-subtitle">All Chapters</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && chapters.length === 0 && (
        <div className="chapters-loading">
          <div className="spinner"></div>
          <p className="loading-message">Loading chapters...</p>
        </div>
      )}

      {!loading && chapters.length === 0 && !error && (
        <div className="no-chapters">
          <p>No chapters found for this manga</p>
        </div>
      )}

      {chapters.length > 0 && (
        <div className="chapters-container">
          <div className="chapters-list">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="chapter-item"
                onClick={() => onChapterSelect(chapter)}
              >
                <div className="chapter-number">
                  CH. {chapter.chapter || 'Special'}
                </div>
                <div className="chapter-details">
                  <h3 className="chapter-title">
                    {chapter.title || `Chapter ${chapter.chapter || 'Special'}`}
                  </h3>
                  <div className="chapter-meta">
                    <span className="chapter-date">
                      <Calendar size={14} />
                      {formatDate(chapter.publishAt)}
                    </span>
                    {chapter.pages && (
                      <span className="chapter-pages">
                        <FileText size={14} />
                        {chapter.pages} pages
                      </span>
                    )}
                  </div>
                </div>
                <div className="chapter-arrow">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>

          {infiniteScroll && hasMore && !loadingMore && (
            <div ref={observerTarget} className="infinite-scroll-trigger"></div>
          )}

          {!infiniteScroll && hasMore && !loading && (
            <div className="load-more-container">
              <button className="load-more-button" onClick={loadMore}>
                <Book size={16} />
                Load More Chapters
              </button>
            </div>
          )}

          {(loadingMore || (loading && chapters.length > 0)) && (
            <div className="chapters-loading-more">
              <div className="spinner"></div>
              <p className="loading-message">Loading more chapters...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
