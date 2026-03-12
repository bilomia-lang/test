import React from 'react';
import { BookOpen, Home, Search, MessageSquare, Check } from 'lucide-react';
import './404Page.css';

export default function NotFoundPage({ onNavigateHome }) {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-illustration">
            <div className="not-found-icon">
              <BookOpen size={64} />
            </div>
            <div className="not-found-404">404</div>
          </div>
          
          <h1>Page Not Found</h1>
          <p>Sorry, the manga you're looking for doesn't exist or has been moved.</p>
          
          <div className="not-found-suggestions">
            <p className="suggestions-title">What you can do:</p>
            <ul>
              <li>
                <Check size={16} />
                Go back home and browse trending manga
              </li>
              <li>
                <Check size={16} />
                Use the search bar to find what you're looking for
              </li>
              <li>
                <Check size={16} />
                Check our popular collections
              </li>
              <li>
                <Check size={16} />
                Report a broken link to our support team
              </li>
            </ul>
          </div>
          
          <div className="not-found-actions">
            <button className="btn-primary" onClick={onNavigateHome}>
              <Home size={16} />
              Back to Home
            </button>
            <button className="btn-secondary" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
