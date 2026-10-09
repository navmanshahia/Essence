import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class StorefrontErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error, details) {
    console.error('ESSENCE storefront rendering error:', error, details);
  }
  render() {
    if (this.state.failed) {
      return (
        <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', background: '#17110e', color: '#e6d4c0', padding: 30, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(52px, 9vw, 100px)', letterSpacing: '.13em', marginBottom: 0 }}>ESSENCE</h1>
          <p style={{ fontSize: 12, letterSpacing: '.15em' }}>THE ATELIER IS TEMPORARILY UNAVAILABLE</p>
          <p style={{ maxWidth: 440, lineHeight: 1.8, fontSize: 13, opacity: .75 }}>A visual component could not load on this device. Reload the page to try again. If the issue persists, check the browser console or contact support.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '14px 24px', background: '#d9bb93', color: '#1a140f', marginTop: 10 }}>RELOAD EXPERIENCE</button>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StorefrontErrorBoundary>
    <React.StrictMode><App /></React.StrictMode>
  </StorefrontErrorBoundary>
);
