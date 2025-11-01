import { STORAGE_KEYS, UserStorageKey } from "./constants";

/**
 * Safely parse JSON without throwing.
 */
function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    console.error("Failed to parse localStorage data:", value);
    return null;
  }
}

/**
 * Get stored user object by type.
 * @param type STORAGE_KEYS.SUPER_ADMIN | STORAGE_KEYS.ADMIN | STORAGE_KEYS.USER
 */
export function getStoredUser<T = any>(type: UserStorageKey): T | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(type);
  return safeParse<T>(data);
}

/**
 * Clear a specific stored user.
 */
export function clearStoredUser(type: UserStorageKey) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(type);
}

/**
 * Clear all stored user data.
 */
export function clearAllStoredUsers() {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}

/**
 * Optionally: return any available user (priority: superadmin → admin → user)
 */
export function getAnyUser<T = any>(): T | null {
  return (
    getStoredUser<T>(STORAGE_KEYS.SUPER_ADMIN) ||
    getStoredUser<T>(STORAGE_KEYS.ADMIN) ||
    getStoredUser<T>(STORAGE_KEYS.USER)
  );
}





// Calling example 
// import { STORAGE_KEYS } from "@/services/common/constants";
// import { getStoredUser, clearStoredUser, getAnyUser } from "@/services/common/storage";

// // Get specific user
// const admin = getStoredUser(STORAGE_KEYS.ADMIN);
// console.log(admin?.name, admin?.role);

// // Get whichever user is active
// const anyUser = getAnyUser();
// console.log(anyUser?.email);

// // Clear one or all
// clearStoredUser(STORAGE_KEYS.USER);
// clearAllStoredUsers();