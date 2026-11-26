// Loaded by Vitest before every test file (see `test.setupFiles` in
// vite.config.ts).
//
// jest-dom adds the matchers a component test is actually written in --
// toBeInTheDocument, toBeDisabled, toHaveValue. Without them a test either
// asserts something weaker than it means or fails to compile, and the agent
// writing it has no way to tell which.
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Every test starts on an empty document. Vitest does not unmount between
// tests, and a component left mounted makes the next `getByRole` ambiguous --
// which reads as a broken component rather than a dirty fixture.
afterEach(cleanup);

// No unit test talks to a real server. A screen that loads data when it mounts would
// otherwise call the API on localhost, and the run would fail with ECONNREFUSED even
// when every test passes. This answers like a server that is down (503), so the screen
// shows its error state. A test that needs data mocks the client or stubs fetch itself.
vi.stubGlobal(
  "fetch",
  vi.fn(
    async () =>
      new Response(JSON.stringify({ detail: "No API in unit tests" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }),
  ),
);
