import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { logAnalytics } from './fbase';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

logAnalytics('app started');
