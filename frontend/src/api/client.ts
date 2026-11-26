// The one way this app calls its API: a client typed from the backend's OpenAPI document.
//
// `npm run gen:api` exports that document (src/api/openapi.json) and generates
// src/api/schema.ts from it, so every path, field and type here is the server's own. A
// field renamed on the server is then a type error in the screen that reads it, not a
// blank value in front of a user. Lint refuses `fetch` and axios anywhere outside src/api/.
//
//   const { data, error } = await api.GET("/auth/me");
import createClient, { type Middleware } from "openapi-fetch";

import { API_BASE_URL, API_PROJECT_ID, getSessionToken } from "@/lib/api";

import type { paths } from "./schema";

// The session token once someone has signed in, otherwise the shared bearer the
// deployed API expects.
const bearer: Middleware = {
  onRequest({ request }) {
    const token = getSessionToken() ?? API_PROJECT_ID;
    if (token) request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  },
};

// Without its trailing slash: the deployed API sits behind an /apps/<slug>/ prefix and
// its address is baked with one, while every path starts with "/".
export const api = createClient<paths>({ baseUrl: API_BASE_URL.replace(/\/+$/, "") });
api.use(bearer);
