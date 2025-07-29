import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeApp, setActiveApp] = useState('core');

  // Listen for messages from iframes to handle navigation
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE_TO_CORE') {
        setActiveApp('core');
        // Update URL to reflect the navigation
        window.history.pushState({}, '', '/core');
      }
      
      if (event.data && event.data.type === 'NAVIGATE_TO_CORE_WITH_USER') {
        setActiveApp('core');
        // Update URL to reflect the navigation
        window.history.pushState({}, '', '/core');
        
        // Store user data for the core app to access
        if (event.data.userData) {
          localStorage.setItem('bridger_user_data', JSON.stringify(event.data.userData));
        }
      }
      
      if (event.data && event.data.type === 'NAVIGATE_TO_QUIZ') {
        setActiveApp('quiz');
        // Update URL to reflect the navigation
        window.history.pushState({}, '', '/quiz');
      }
    };

    // Handle URL-based routing
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/auth') {
        setActiveApp('auth');
      } else if (path === '/quiz') {
        setActiveApp('quiz');
      } else {
        setActiveApp('core');
      }
    };

    // Set initial app based on URL
    const path = window.location.pathname;
    if (path === '/auth') {
      setActiveApp('auth');
    } else if (path === '/quiz') {
      setActiveApp('quiz');
    } else {
      setActiveApp('core');
      // Update URL to reflect default app
      if (path !== '/core' && path !== '/') {
        window.history.pushState({}, '', '/core');
      }
    }

    window.addEventListener('message', handleMessage);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        backgroundColor: '#1f2937', 
        padding: '10px',
        borderBottom: '2px solid #374151'
      }}>
        <button
          onClick={() => {
            setActiveApp('auth');
            window.history.pushState({}, '', '/auth');
            // Clear user data when going to auth
            localStorage.removeItem('bridger_user_data');
          }}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            backgroundColor: activeApp === 'auth' ? '#3b82f6' : '#4b5563',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Auth App
        </button>
        <button
          onClick={() => {
            setActiveApp('core');
            window.history.pushState({}, '', '/core');
          }}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            backgroundColor: activeApp === 'core' ? '#3b82f6' : '#4b5563',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Core App
        </button>
        <button
          onClick={() => {
            setActiveApp('quiz');
            window.history.pushState({}, '', '/quiz');
          }}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            backgroundColor: activeApp === 'quiz' ? '#3b82f6' : '#4b5563',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Quiz App
        </button>
      </div>

      {/* App Content */}
      <div style={{ flex: 1, height: 'calc(100vh - 60px)' }}>
        {activeApp === 'auth' && (
          <iframe
            src="http://localhost:8081"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Auth App"
            allow="camera; microphone; geolocation"
            allowFullScreen
          />
        )}
        {activeApp === 'core' && (
          <iframe
            src="http://localhost:8080"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Core App"
            allow="camera; microphone; geolocation"
            allowFullScreen
          />
        )}
        {activeApp === 'quiz' && (
          <iframe
            src="http://localhost:8084"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Quiz App"
            allow="camera; microphone; geolocation"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

export default App; 