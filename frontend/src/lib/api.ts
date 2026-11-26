/// <reference types="vite/client" />
// Without the reference above, `import.meta.env` is not typed and `tsc --noEmit` fails.
//
// Where the API lives and who is calling it. The calls themselves go through the
// generated client in src/api/client.ts (`npm run gen:api`), never through fetch here.
//
// Set at build time: the platform bakes the deployed API URL into the frontend build.
// The fallback is the local backend so a bare `npm run dev` still points somewhere real.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// The shared bearer the deployed API expects (its SECRET_KEY): the project id, not a
// secret. The platform bakes the same value into both sides at deploy time, so
// authenticated calls work out of the box.
export const API_PROJECT_ID: string = import.meta.env.VITE_API_PROJECT_ID ?? "";

// The frontend and the API are on different origins once deployed, so sign-in cannot rely
// on a cookie coming back. `/auth/login` returns its token in the response body: the screen
// that signs in calls `setSessionToken` with it, and the client sends it as the bearer on
// every later call, ahead of the shared bearer. Guarded for a server render, where there
// is no `localStorage`.
const SESSION_TOKEN_KEY = "session_token";

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_TOKEN_KEY, token);
  } catch {
    // Storage unavailable (private mode, quota): the session just won't persist.
  }
}

export function clearSessionToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // Nothing to clear if storage was never reachable.
  }
}
