"use client";
import React, { ReactNode, useState, createContext, useContext, useEffect } from "react";
import { IntlProvider } from "react-intl";
import Cookies from "js-cookie";

import enMessages from "@/../public/locales/en/translation.json";
import frMessages from "@/../public/locales/fr/translation.json";

const messages: Record<string, Record<string, string>> = {
  en: enMessages,
  fr: frMessages,
};

// Create context
const LanguageContext = createContext({
  locale: "en",
  setLocale: (lang: string) => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  // Load saved language from cookie (default: "en")
  const [locale, setLocaleState] = useState<string>(Cookies.get("locale") || "en");

  // Update cookie whenever locale changes
  const setLocale = (lang: string) => {
    setLocaleState(lang);
    Cookies.set("locale", lang, { expires: 365, path: "/" }); // persist for 1 year
  };

  // If cookie changes outside React (rare), sync it
  useEffect(() => {
    const cookieLang = Cookies.get("locale");
    if (cookieLang && cookieLang !== locale) {
      setLocaleState(cookieLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
