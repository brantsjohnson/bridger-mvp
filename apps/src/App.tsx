import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeApp, setActiveApp] = useState('core');

  // Debug: Log whenever activeApp changes
  useEffect(() => {
    console.log('Active app changed to:', activeApp);
  }, [activeApp]);

  // Listen for messages from iframes to handle navigation
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE_TO_CORE') {
        console.log('Setting active app to core');
        setActiveApp('core');
        // Update URL to reflect the navigation
        window.history.pushState({}, '', '/core');
      }
      
      if (event.data && event.data.type === 'NAVIGATE_TO_CORE_WITH_USER') {
        console.log('Setting active app to core with user data');
        setActiveApp('core');
        // Update URL to reflect the navigation
        window.history.pushState({}, '', '/core');
        
        // Store user data for the core app to access
        if (event.data.userData) {
          localStorage.setItem('bridger_user_data', JSON.stringify(event.data.userData));
        }
      }
      
      if (event.data && event.data.type === 'NAVIGATE_TO_QUIZ') {
        console.log('Setting active app to quiz');
        setActiveApp('quiz');
        // Update URL to reflect the navigation
        window.history.pushState({}, '', '/quiz');
      }
      
      if (event.data && event.data.type === 'UPDATE_URL') {
        // Update URL when core app navigates
        window.history.pushState({}, '', event.data.url);
      }
    };

    // Handle URL-based routing
    const handlePopState = () => {
      const path = window.location.pathname;
      console.log('PopState - Current path:', path);
      if (path === '/auth') {
        console.log('Setting active app to auth (popstate)');
        setActiveApp('auth');
      } else if (path === '/quiz') {
        console.log('Setting active app to quiz (popstate)');
        setActiveApp('quiz');
      } else if (path.startsWith('/core')) {
        console.log('Setting active app to core (popstate)');
        setActiveApp('core');
        // Pass the sub-route to the core app
        const subRoute = path.replace('/core', '') || '/';
        window.postMessage({ type: 'CORE_ROUTE', route: subRoute }, '*');
      } else {
        console.log('Setting active app to core (default)');
        setActiveApp('core');
      }
    };

    // Set initial app based on URL
    const path = window.location.pathname;
    console.log('Initial path:', path);
    if (path === '/auth') {
      console.log('Setting initial active app to auth');
      setActiveApp('auth');
    } else if (path === '/quiz') {
      console.log('Setting initial active app to quiz');
      setActiveApp('quiz');
    } else if (path.startsWith('/core')) {
      console.log('Setting initial active app to core');
      setActiveApp('core');
      // Pass the sub-route to the core app
      const subRoute = path.replace('/core', '') || '/';
      window.postMessage({ type: 'CORE_ROUTE', route: subRoute }, '*');
    } else {
      console.log('Setting initial active app to core (default)');
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
      {/* Debug Info */}
      <div style={{ 
        backgroundColor: '#1f1f1f', 
        color: '#00ff00', 
        padding: '5px 10px', 
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        Debug: Active App = {activeApp} | URL = {window.location.pathname}
      </div>
      
      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        backgroundColor: '#1f2937', 
        padding: '10px',
        borderBottom: '2px solid #374151'
      }}>
        <button
          onClick={() => {
            console.log('Auth button clicked');
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
            console.log('Core button clicked');
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
            console.log('Quiz button clicked');
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
            src={process.env.NODE_ENV === 'production' ? '/auth-app' : 'http://localhost:8081'}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Auth App"
            allow="camera; microphone; geolocation"
            allowFullScreen
          />
        )}
        {activeApp === 'core' && (
          <iframe
            src={process.env.NODE_ENV === 'production' ? '/core-app' : 'http://localhost:8080'}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Core App"
            allow="camera; microphone; geolocation"
            allowFullScreen
          />
        )}
        {activeApp === 'quiz' && (
          <iframe
            src={process.env.NODE_ENV === 'production' ? '/quiz-app' : 'http://localhost:8084'}
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