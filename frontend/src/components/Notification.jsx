import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    error: 'bg-red-500 border-red-600',
    success: 'bg-green-500 border-green-600',
    info: 'bg-blue-500 border-blue-600',
    warning: 'bg-yellow-500 border-yellow-600',
  };

  const Icon = icons[type];

  if (!isVisible) return null;

  return (
    <div className={`fixed top-6 right-6 z-50 border ${colors[type]} text-white rounded-xl shadow-xl p-4 min-w-[300px] max-w-[400px] transform transition-all duration-300 animate-slideIn`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="text-white/80 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;