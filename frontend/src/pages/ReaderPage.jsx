import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Settings } from 'lucide-react';
import { mangaService } from '../services/mangaService';
import './ReaderPage.css';

export default function ReaderPage({ chapter, manga, showToast }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fitMode, setFitMode] = useState('width'); // 'width', 'height', 'page'
  const [infiniteScroll, setInfiniteScroll] = useState(true);
  const intersectionRef = useRef(null);

  useEffect(() => {
    loadChapterPages();
  }, [chapter.id]);

  // Keyboard navigation for infinite scroll
  useEffect(() => {
    if (!infiniteScroll) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPreviousPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPageIndex, pages.length, infiniteScroll]);

  const loadChapterPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mangaService.getChapterPages(chapter.id);
      setPages(data.pages || []);
      setCurrentPageIndex(0);
      if (showToast) {
        showToast(`Loaded ${data.pages?.length || 0} pages`, 'success');
      }
    } catch (err) {
      const errorMessage = 'Failed to load chapter pages. Please try again.';
      setError(errorMessage);
      if (showToast) {
        showToast(errorMessage, 'error');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      if (!infiniteScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      if (!infiniteScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const jumpToPage = (e) => {
    const page = parseInt(e.target.value) - 1;
    if (page >= 0 && page < pages.length) {
      setCurrentPageIndex(page);
      if (!infiniteScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const currentPage = pages[currentPageIndex];

  if (loading) {
    return (
      <div className="reader-page">
        <div className="reader-loading">
          <div className="spinner"></div>
          <p className="loading-message">Loading chapter pages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reader-page">
        <div className="reader-error">
          <p className="error-message">{error}</p>
          <button onClick={loadChapterPages} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="reader-page">
        <div className="no-pages">
          <p>No pages available for this chapter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-page">
      <div className="reader-header">
        <div className="reader-title">
          <h2>{manga.title}</h2>
          <p>Chapter {chapter.chapter || 'Special'}</p>
          {chapter.title && <p className="chapter-name">{chapter.title}</p>}
        </div>
        <div className="scroll-toggle">
          <button 
            className={`toggle-btn ${infiniteScroll ? 'active' : ''}`}
            onClick={() => setInfiniteScroll(!infiniteScroll)}
            title="Toggle infinite scroll"
          >
            <Settings size={16} />
            {infiniteScroll ? 'Scroll' : 'Page'}
          </button>
        </div>
      </div>

      {!infiniteScroll && (
        <div className="reader-controls">
          <div className="controls-left">
            <button
              className="nav-button"
              onClick={goToPreviousPage}
              disabled={currentPageIndex === 0}
              title="Previous page"
            >
              <ChevronUp size={18} />
              Previous
            </button>
          </div>

          <div className="page-indicator">
            <select value={currentPageIndex + 1} onChange={jumpToPage} className="page-select">
              {pages.map((_, index) => (
                <option key={index} value={index + 1}>
                  Page {index + 1}
                </option>
              ))}
            </select>
            <span className="page-count">of {pages.length}</span>
          </div>

          <div className="controls-right">
            <button
              className="nav-button"
              onClick={goToNextPage}
              disabled={currentPageIndex === pages.length - 1}
              title="Next page"
            >
              Next
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
      )}

      <div className={`reader-content fit-${fitMode} ${infiniteScroll ? 'infinite-scroll' : ''}`}>
        {infiniteScroll ? (
          // Infinite scroll mode - show all visible pages
          <div className="infinite-scroll-container">
            {pages.map((page, index) => (
              <div
                key={index}
                className={`page-container ${currentPageIndex === index ? 'active' : ''}`}
              >
                <img
                  src={page.url}
                  alt={`Page ${index + 1}`}
                  className="page-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"%3E%3Crect fill="%23f0f0f0" width="400" height="600"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3EFailed to load image%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="page-counter">{index + 1} / {pages.length}</div>
              </div>
            ))}
          </div>
        ) : (
          // Single page mode
          currentPage && (
            <div className="page-container">
              <img
                src={currentPage.url}
                alt={`Page ${currentPageIndex + 1}`}
                className="page-image"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"%3E%3Crect fill="%23f0f0f0" width="400" height="600"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3EFailed to load image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          )
        )}
      </div>

      {!infiniteScroll && (
        <div className="reader-footer">
          <div className="footer-controls">
            <button
              className="nav-button"
              onClick={goToPreviousPage}
              disabled={currentPageIndex === 0}
            >
              <ChevronUp size={18} />
              Previous
            </button>
            <span className="footer-info">
              Page {currentPageIndex + 1} / {pages.length}
            </span>
            <button
              className="nav-button"
              onClick={goToNextPage}
              disabled={currentPageIndex === pages.length - 1}
            >
              Next
              <ChevronDown size={18} />
            </button>
          </div>

          <div className="reading-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentPageIndex + 1) / pages.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
