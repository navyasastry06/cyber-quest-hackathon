import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "operative": "Operative",
          "logout": "LOGOUT",
          "dashboard": "Dashboard",
          "simulator": "Simulator",
          "tools": "Tools",
          "chat": "Chat",
          "challenges": "Challenges"
        }
      },
      es: {
        translation: {
          "operative": "Operativo",
          "logout": "SALIR",
          "dashboard": "Panel",
          "simulator": "Simulador",
          "tools": "Centro",
          "chat": "Chatear",
          "challenges": "Desafíos"
        }
      },
      hi: {
        translation: {
          "operative": "संचालक",
          "logout": "लॉग आउट",
          "dashboard": "डैशबोर्ड",
          "simulator": "सिम्युलेटर",
          "tools": "उपकरण",
          "chat": "चैट",
          "challenges": "चुनौतियां"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
