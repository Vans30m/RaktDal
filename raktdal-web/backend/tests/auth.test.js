import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

test("JWT session token signs and verifies correctly", () => {
  const secret = "test-secret";
  const payload = { id: "user123", email: "student@chitkara.edu.in", roles: ["USER"] };

  const token = jwt.sign(payload, secret, { expiresIn: "7d" });
  assert.ok(token);

  const decoded = jwt.verify(token, secret);
  assert.equal(decoded.id, "user123");
  assert.equal(decoded.email, "student@chitkara.edu.in");
  assert.deepEqual(decoded.roles, ["USER"]);

});
