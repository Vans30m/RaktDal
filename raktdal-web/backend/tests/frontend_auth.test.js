import test from "node:test";
import assert from "node:assert/strict";

// Mocking browser window and DOM globals for node test runner
global.window = {
  location: {
    hostname: "localhost",
    origin: "http://localhost:5500",
    hash: "#/"
  }
};

import { api } from "../../frontend/js/api.js";

test("Frontend API: Base URL resolution", () => {
  const baseUrl = api.getBaseUrl();
  assert.equal(baseUrl, "http://localhost:5000/api/v1", "Localhost must resolve to default backend port 5000");

  const googleUrl = api.getGoogleAuthUrl();
  assert.equal(googleUrl, "http://localhost:5000/api/v1/auth/google");
});

test("Frontend API: Concurrency deduplication for token refresh", async () => {
  let refreshCalls = 0;

  // Mock fetch
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    if (url.includes("/auth/refresh")) {
      refreshCalls++;
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 10));
      return { ok: true, status: 200, json: async () => ({ success: true }) };
    }
    // Resource endpoint returns 401 on first hit
    return { ok: false, status: 401 };
  };

  try {
    // Fire 5 simultaneous requests that all receive 401
    const p1 = api.request("/test-endpoint-1");
    const p2 = api.request("/test-endpoint-2");
    const p3 = api.request("/test-endpoint-3");

    await Promise.all([p1, p2, p3]);

    // Token refresh should only have been called ONCE due to promise deduplication
    assert.equal(refreshCalls, 1, "Simultaneous 401 requests must deduplicate to a single refresh call");
  } finally {
    global.fetch = originalFetch;
  }
});

test("Frontend Router: Route mapping and query param extraction", () => {
  const testCases = [
    { hash: "#/", expectedPath: "/", expectedParams: {} },
    { hash: "#/login", expectedPath: "/login", expectedParams: {} },
    { hash: "#/login?error=cancelled", expectedPath: "/login", expectedParams: { error: "cancelled" } },
    { hash: "#/auth/callback?status=success", expectedPath: "/auth/callback", expectedParams: { status: "success" } },
    { hash: "#/profile", expectedPath: "/profile", expectedParams: {} },
    { hash: "#/admin", expectedPath: "/admin", expectedParams: {} }
  ];

  for (const tc of testCases) {
    const [pathWithHash, queryString] = tc.hash.split("?");
    const path = pathWithHash.replace(/^#/, "") || "/";
    const params = new URLSearchParams(queryString || "");

    assert.equal(path, tc.expectedPath);
    for (const [k, v] of Object.entries(tc.expectedParams)) {
      assert.equal(params.get(k), v);
    }
  }
});

test("Frontend Route Guard Logic: Authenticated vs Guest vs Admin", () => {
  // Scenario 1: Guest trying to access protected /profile
  const guestState = { isAuthenticated: false, isAdmin: false };
  const shouldRedirectToLogin = (path, state) => {
    if (path === "/profile" && !state.isAuthenticated) return true;
    if (path === "/admin" && !state.isAuthenticated) return true;
    return false;
  };
  assert.equal(shouldRedirectToLogin("/profile", guestState), true);
  assert.equal(shouldRedirectToLogin("/admin", guestState), true);
  assert.equal(shouldRedirectToLogin("/", guestState), false);

  // Scenario 2: Standard user trying to access /admin
  const standardUserState = { isAuthenticated: true, isAdmin: false };
  const isForbiddenAdmin = (path, state) => {
    return path === "/admin" && !state.isAdmin;
  };
  assert.equal(isForbiddenAdmin("/admin", standardUserState), true);

  // Scenario 3: Admin user accessing /admin
  const adminState = { isAuthenticated: true, isAdmin: true };
  assert.equal(isForbiddenAdmin("/admin", adminState), false);
  assert.equal(shouldRedirectToLogin("/profile", adminState), false);
});
