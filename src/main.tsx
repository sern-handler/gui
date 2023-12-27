import * as ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLocale from '../locales/en.json' assert { type: "json" };
import esLocale from '../locales/es.json' assert { type: "json" };
import trLocale from '../locales/tr.json' assert { type: "json" };
import SnowfallDecember from './SnowfallDecember.js';
import NewUpdate from './NewUpdate.js';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: enLocale,
      es: esLocale,
      tr: trLocale
    },
    lng: window.localStorage.getItem('lang') || 'en',
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <div>
    <SnowfallDecember />
    <NewUpdate />
    <App />
  </div>
);