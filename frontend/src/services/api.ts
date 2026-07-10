const DEFAULT_API_BASE_URL = "https://primeseats-nk.onrender.com";

export const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export const buildApiUrl = (path: string) => `${apiBaseUrl}${path}`;
