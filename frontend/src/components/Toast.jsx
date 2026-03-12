import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ message, type = 'error', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      case 'network':
        return <AlertCircle size={20} />;
      case 'api':
        return <AlertCircle size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{getIcon()}</span>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={18} />
      </button>
    </div>
  );
}
