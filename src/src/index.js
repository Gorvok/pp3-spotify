import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root

root.render(
    <Router>
        <App />
    </Router>
);
