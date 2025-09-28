import { useState, useEffect } from 'react';
import { getBackendStatus, isBackendReady } from '@/lib/backend-warmup';

const BackendStatusIndicator = () => {
  const [status, setStatus] = useState(getBackendStatus());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Update status every 10 seconds
    const interval = setInterval(() => {
      setStatus(getBackendStatus());
    }, 10000);

    // Show indicator for 5 seconds after status change
    const showIndicator = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    };

    // Show indicator when backend comes online
    if (status.isOnline && !isVisible) {
      showIndicator();
    }

    return () => clearInterval(interval);
  }, [status.isOnline, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
        status.isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            status.isOnline ? 'bg-green-200' : 'bg-red-200'
          }`} />
          <span className="text-sm font-medium">
            {status.isOnline ? 'Backend Online' : 'Backend Offline'}
          </span>
          {status.responseTime > 0 && (
            <span className="text-xs opacity-75">
              ({status.responseTime}ms)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendStatusIndicator;
