import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeApp, setActiveApp] = useState('core');

  // Debug: Log whenever activeApp changes
  useEffect(() => {
    console.log('Active app changed to:', activeApp);
  }, [activeApp]);

  // Handle URL-based routing
  useEffect(() => {
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
    } else {
      console.log('Setting initial active app to core (default)');
      setActiveApp('core');
      // Update URL to reflect default app
      if (path !== '/core' && path !== '/') {
        window.history.pushState({}, '', '/core');
      }
    }

    window.addEventListener('popstate', handlePopState);
    return () => {
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
      <div style={{ flex: 1, height: 'calc(100vh - 60px)', padding: '20px' }}>
        {activeApp === 'auth' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#f3f4f6',
            borderRadius: '10px',
            padding: '40px'
          }}>
            <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>🔐 Auth App</h1>
            <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: '600px', marginBottom: '30px' }}>
              Your beautiful Auth App is ready! To see it in action, you need to deploy it separately to Vercel.
            </p>
            <div style={{ marginTop: '20px' }}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '0 10px'
              }}>
                View Auth App Locally
              </button>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '0 10px'
              }}>
                Deploy to Vercel
              </button>
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '20px' }}>
              <strong>Local Development:</strong> Run <code>npm run dev:auth</code> to see your auth app at localhost:8081
            </p>
          </div>
        )}
        {activeApp === 'core' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#f3f4f6',
            borderRadius: '10px',
            padding: '40px'
          }}>
            <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>🏠 Core App</h1>
            <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: '600px', marginBottom: '30px' }}>
              Your beautiful Core App is ready! To see it in action, you need to deploy it separately to Vercel.
            </p>
            <div style={{ marginTop: '20px' }}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '0 10px'
              }}>
                View Core App Locally
              </button>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '0 10px'
              }}>
                Deploy to Vercel
              </button>
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '20px' }}>
              <strong>Local Development:</strong> Run <code>npm run dev:core</code> to see your core app at localhost:8080
            </p>
          </div>
        )}
        {activeApp === 'quiz' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#f3f4f6',
            borderRadius: '10px',
            padding: '40px'
          }}>
            <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>🧠 Quiz App</h1>
            <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: '600px', marginBottom: '30px' }}>
              Your beautiful Quiz App is ready! To see it in action, you need to deploy it separately to Vercel.
            </p>
            <div style={{ marginTop: '20px' }}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '0 10px'
              }}>
                View Quiz App Locally
              </button>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '0 10px'
              }}>
                Deploy to Vercel
              </button>
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '20px' }}>
              <strong>Local Development:</strong> Run <code>npm run dev:quiz</code> to see your quiz app at localhost:8084
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 