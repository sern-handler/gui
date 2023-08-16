import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLocale from '../locales/en.json' assert { type: "json" };
import esLocale from '../locales/es.json' assert { type: "json" };

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: enLocale,
      es: esLocale
    },
    lng: window.localStorage.getItem('lang') || 'en',
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
