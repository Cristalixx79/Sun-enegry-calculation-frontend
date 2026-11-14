import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './apiConfig';
import App from './App';
import { store } from './store';
import './styles/app.css';

// Provider — хранилище Redux для всего приложения.
// HashRouter: адреса вида /#/feed/3 — приложение работает на статическом
// хостинге (GitHub Pages) без настройки серверных перенаправлений.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
);
