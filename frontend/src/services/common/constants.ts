export const STORAGE_KEYS = {
  SUPER_ADMIN: "suser",
  ADMIN: "auser",
  USER: "user",
} as const;

export const langs = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ru", name: "русский", flag: "🇷🇺" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

 
export type UserStorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
