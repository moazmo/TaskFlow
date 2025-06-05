import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('Starting TaskFlow renderer...');

const container = document.getElementById('root');
if (!container) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('Creating React root...');

try {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('TaskFlow app rendered successfully!');
} catch (error) {
  console.error('Error rendering TaskFlow app:', error);
  // Fallback to DOM manipulation if React fails
  container.innerHTML = `
    <div style="background-color: red; color: white; padding: 20px; font-size: 18px;">
      <h1>TaskFlow Failed to Load</h1>
      <p>Error: ${error}</p>
    </div>
  `;
}
