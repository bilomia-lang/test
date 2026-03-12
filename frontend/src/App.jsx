import React, { useState, useCallback } from 'react';
import './App.css';
import MangaCard from './components/MangaCard';
import SearchPage from './pages/SearchPage';
import ChaptersPage from './pages/ChaptersPage';
import ReaderPage from './pages/ReaderPage';
import PricingPage from './pages/PricingPage';
import NotFoundPage from './pages/404Page';
import Toast from './components/Toast';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedManga, setSelectedManga] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const navigateToManga = (manga) => {
    setSelectedManga(manga);
    setCurrentPage('chapters');
  };

  const navigateToReader = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentPage('reader');
  };

  const goBack = () => {
    if (currentPage === 'reader') {
      setCurrentPage('chapters');
    } else if (currentPage === 'chapters' || currentPage === 'search') {
      setCurrentPage('home');
    } else if (currentPage === 'pricing') {
      setCurrentPage('home');
    }
  };

  const handleNavigateHome = () => {
    setCurrentPage('home');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
              Manga Reader
            </h1>
          </div>
          <nav className="header-nav">
            {currentPage !== 'home' && (
              <button className="nav-button" onClick={goBack}>
                Back
              </button>
            )}
            <button
              className={`nav-button ${currentPage === 'pricing' ? 'active' : ''}`}
              onClick={() => setCurrentPage('pricing')}
            >
              Pricing
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {currentPage === 'home' && (
          <MangaCard
            onMangaSelect={navigateToManga}
            onSearch={() => setCurrentPage('search')}
            showToast={showToast}
          />
        )}
        {currentPage === 'search' && (
          <SearchPage onMangaSelect={navigateToManga} showToast={showToast} />
        )}
        {currentPage === 'chapters' && selectedManga && (
          <ChaptersPage
            manga={selectedManga}
            onChapterSelect={navigateToReader}
            showToast={showToast}
          />
        )}
        {currentPage === 'reader' && selectedChapter && (
          <ReaderPage
            chapter={selectedChapter}
            manga={selectedManga}
            showToast={showToast}
          />
        )}
        {currentPage === 'pricing' && (
          <PricingPage onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === '404' && (
          <NotFoundPage onNavigateHome={handleNavigateHome} />
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by MangaDex, Jikan & Cominick APIs | Google Casual Design</p>
      </footer>

      {/* Toast Notifications Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
