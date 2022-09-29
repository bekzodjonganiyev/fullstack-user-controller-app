import React from 'react';
import ReactDOM from 'react-dom/client';

import "./assets/app.css"

import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { TokenProvider } from './components/context/tokenContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <TokenProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TokenProvider>
);

