import { LocalizationSettings } from "@/lib/types/superadmin";

export function getSystemTimezoneOffset(): string {
  const offset = -new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? "+" : "-";
  return `${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

// ---------------- Persistence ----------------

export const LS_KEY = "localization-settings-v1";



export const DEFAULTS: LocalizationSettings = {
  language: "en",
  supportedLanguages: ["en"],
  direction: "ltr",
  dateFormatId: "DD-MMM-YYYY",
  timeFormat: "24h",
  timezone: getSystemTimezoneOffset(),
  mapLat: 0,
  mapLng: 0,
  mapZoom: 2,
};

export function loadSettings(): LocalizationSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as LocalizationSettings;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(s: LocalizationSettings) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

// ---------------- Helpers ----------------

export function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export function formatDateByPattern(
  date: Date,
  pattern: LocalizationSettings["dateFormatId"]
) {
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthsFull = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  switch (pattern) {
    case "DD-MMM-YYYY":
      return `${pad2(D)} ${months[M - 1]} ${Y}`;
    case "DD/MM/YYYY":
      return `${pad2(D)}/${pad2(M)}/${Y}`;
    case "YYYY-MM-DD":
      return `${Y}-${pad2(M)}-${pad2(D)}`;
    case "MMM DD, YYYY":
      return `${months[M - 1]} ${pad2(D)}, ${Y}`;
    case "DD.MM.YYYY":
      return `${pad2(D)}.${pad2(M)}.${Y}`;
    case "MM/DD/YYYY":
      return `${pad2(M)}/${pad2(D)}/${Y}`;
    case "D MMM YYYY":
      return `${D} ${months[M - 1]} ${Y}`;
    case "ddd, DD MMM YYYY":
      return `${days[date.getDay()]}, ${pad2(D)} ${months[M - 1]} ${Y}`;
    case "MMMM DD, YYYY":
      return `${monthsFull[M - 1]} ${pad2(D)}, ${Y}`;
    default:
      return `${pad2(D)} ${months[M - 1]} ${Y}`;
  }
}

export function formatPreview(
  date: Date,
  tzOffset: string,
  dateFormatId: LocalizationSettings["dateFormatId"],
  use24h: boolean
) {
  const match = tzOffset.match(/([+-])(\d{2}):(\d{2})/);
  if (!match) {
    const dateStr = formatDateByPattern(date, dateFormatId);
    const timeStr = use24h
      ? `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
      : date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
    return { dateStr, timeStr };
  }

  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  const offsetMs = sign * (hours * 60 + minutes) * 60 * 1000;
  const adjustedDate = new Date(date.getTime() + offsetMs);

  const dateStr = formatDateByPattern(adjustedDate, dateFormatId);
  const timeStr = use24h
    ? `${pad2(adjustedDate.getUTCHours())}:${pad2(
        adjustedDate.getUTCMinutes()
      )}`
    : adjustedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      });

  return { dateStr, timeStr };
}