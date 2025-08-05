// до
// import ReactDOM from 'react-dom';
// ReactDOM.render(<App />, document.getElementById('root'));

// после
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Найти контейнер в HTML
const container = document.getElementById('root');
// Инициализировать корень React 18+
const root = createRoot(container);
// Рендерить приложение
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
