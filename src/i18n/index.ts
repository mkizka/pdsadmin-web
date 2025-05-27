import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en.json";
import jaTranslation from "./locales/ja.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
};

export async function setupI18n() {
  await i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false, // Reactが自動的にエスケープするため不要
      },
    });
  document.documentElement.lang = i18next.language;
  i18next.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
  });
}
