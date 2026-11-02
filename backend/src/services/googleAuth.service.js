import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";

/**
 * Creates and returns configured Google OAuth2Client
 */
export function getGoogleOAuthClient() {
  return new OAuth2Client(
    env.google.clientId,
    env.google.clientSecret,
    env.google.callbackUrl
  );
}

/**
 * Generates Google OAuth authorization URL with PKCE (S256), state, and OpenID Connect scopes
 */
export function generateGoogleAuthUrl({ client, state, codeChallenge }) {
  const oauthClient = client || getGoogleOAuthClient();

  return oauthClient.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "profile", "email"],
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    prompt: "consent"
  });
}

/**
 * Exchanges authorization code and code_verifier for Google tokens, then verifies ID token
 */
export async function exchangeAndVerifyGoogleToken({ client, code, codeVerifier }) {
  const oauthClient = client || getGoogleOAuthClient();

  // Exchange authorization code with PKCE verifier
  const { tokens } = await oauthClient.getToken({
    code,
    codeVerifier
  });

  if (!tokens?.id_token) {
    throw new Error("No ID token returned from Google identity provider.");
  }

  // Cryptographically verify ID token signature, issuer, audience, and expiration
  const ticket = await oauthClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.google.clientId || "test-google-client-id"
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid ID token payload.");
  }

  // Validate issuer matches Google OpenID endpoints
  const validIssuers = ["accounts.google.com", "https://accounts.google.com"];
  if (!validIssuers.includes(payload.iss)) {
    throw new Error(`Invalid token issuer: ${payload.iss}`);
  }

  // Ensure immutable OpenID 'sub' is present
  if (!payload.sub) {
    throw new Error("Missing 'sub' identifier in Google ID token.");
  }

  return {
    tokens,
    payload: {
      sub: payload.sub,
      email: payload.email ? payload.email.toLowerCase().trim() : null,
      emailVerified: Boolean(payload.email_verified),
      name: payload.name || "Blood Donor",
      picture: payload.picture || null
    }
  };
}
