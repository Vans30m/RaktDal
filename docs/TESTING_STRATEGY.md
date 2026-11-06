# RaktDal Testing Strategy & QA Architecture

**Platform:** RaktDal – Pan-India Blood Donation & Donor Coordination Platform  
**Phase:** Phase 20 (Final Quality Assurance & Production Readiness)  
**Date:** November 2026  
**Standard Compliance:** ISO/IEC/IEEE 29119 Software Testing Standards  

---

## 1. Quality Objectives & Scope

The testing strategy governs the validation of RaktDal's modular monolith backend, vanilla JavaScript SPA, and cross-platform desktop wrapper (Electron).

### Core Testing Pillars:
1. **Safety & Medical Disclaimers:** Ensure zero automated medical eligibility decisions; ensure reported blood bank stock is explicitly labeled as non-guaranteed.
2. **Privacy by Design:** Strict validation that public discovery endpoints strip all Personally Identifiable Information (PII) including phone numbers, emails, and street addresses.
3. **Role & Privilege Enforcement:** Strict two-role model (`USER` and `ADMIN`) with complete isolation between Platform `ADMIN` and Organization `ADMIN`.
4. **Resilience & Fault Tolerance:** In-app notifications and core transactions must succeed even if external email (Resend) or push (FCM) providers fail.

---

## 2. Test Pyramid & Automation Framework

```
                 / \
                /   \
               / E2E \       Journey Tests (Browser & API Flows)
              /-------\
             /  Integ  \     Module & Route Integration (Supertest/Node Test)
            /-----------\
           /    Unit     \   Schema, Hashing, Token Validation, Helpers
          /---------------\
```

| Layer | Tools / Runtime | Test Count | Target Execution Time |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | Node.js Built-in Runner (`node --test`), Argon2, Crypto | 52 tests | < 1.5s |
| **Integration Tests** | `node --test`, Mongoose In-Memory/Mock, Express App | 64 tests | < 2.0s |
| **Security Tests** | RBAC, IDOR, NoSQL injection, XSS checks | Included in Suite | < 0.5s |
| **Total Automated** | **116 Tests across 16 Suites** | **116 Passed (100%)** | **~3.2s** |

---

## 3. Test Environments & Boundaries

### 3.1 Environments
- **Local Development / Test:** Isolated in-memory data structures, mock OAuth tokens, simulated email dispatch.
- **Staging / Render Pre-Production:** MongoDB Atlas Sandbox, Google OAuth staging client with authorized redirect URIs.
- **Production:** MongoDB Atlas Production cluster with TLS 1.3, strict CORS whitelist, Secure SameSite cookies.

### 3.2 Prohibited Testing Practices
- Real patient or donor blood records must never be injected into test databases.
- Test suites must not perform live HTTP calls to Google's production OAuth endpoints (mock claims verification).
- No hardcoded secrets or production credentials in test files.

---

## 4. Test Execution Matrix by Module

| Module | Test Types | Key Assertions |
| :--- | :--- | :--- |
| **Authentication** | Unit, Security | State nonce verification, PKCE S256 challenge, Argon2 hash verification, token expiry. |
| **RBAC & Authorization** | Security, Integration | Platform `ADMIN` vs Organization `ADMIN` separation; standard `USER` blocked from elevation. |
| **Donor Profiles** | Unit, Data Privacy | `toPublicDiscovery()` masks PII; age between 18–65; valid 6-digit Indian PIN codes. |
| **Blood Requests** | Functional, State Machine | Unit cap of 50; transition states `OPEN` -> `IN_PROGRESS` -> `FULFILLED`/`CANCELLED`. |
| **Camps & Inventory** | Integration, Concurrency | Compound unique keys prevent duplicates; stale inventory flag (>30 days). |
| **Notifications** | Integration, Fallback | Provider failure handling; idempotency key check prevents duplicates. |
| **CSV & Reporting** | Security, Data Integrity | Anti-formula injection (`=`, `+`, `-`, `@` escaped with single quote). |

---

## 5. Continuous Integration (CI) Quality Gates

A pull request or merge commit must satisfy the following criteria:
1. `npm test` passes with 0 failures and 0 skipped tests.
2. ESLint / syntax checks complete cleanly without syntax errors.
3. No environment secrets detected in version control.
4. All package dependencies audited via `npm audit`.

