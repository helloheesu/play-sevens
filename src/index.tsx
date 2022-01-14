import { logEvent } from 'firebase/analytics';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { analytics } from './fbase';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

logEvent(analytics, 'app started');
