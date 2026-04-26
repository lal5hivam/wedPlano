# Wedplano QA Test Plan

**Project:** Wedplano – Wedding Venue Booking Platform  
**Version:** 1.0.0  
**Date:** April 2026  
**Scope:** Backend API, Frontend UI, End-to-End Flows

---

## 1. Objectives

- Verify all API endpoints return correct responses and status codes
- Validate role-based access control (user vs partner)
- Confirm the booking workflow is race-condition safe
- Ensure billing calculations are accurate
- Validate input sanitization and error handling
- Test authentication and token lifecycle
- Verify frontend components render and behave correctly

---

## 2. Test Scope

### In Scope
- REST API (40+ endpoints)
- JWT authentication and authorization
- Booking state machine (pending → accepted/rejected/cancelled)
- Billing engine (base price, per-guest, services, platform fee, GST)
- Availability management and conflict prevention
- Notification creation and delivery
- Frontend auth flows (login, register, logout)
- Frontend protected routes and role guards
- File upload validation (type, size)

### Out of Scope
- Cloudinary CDN performance
- Firebase infrastructure reliability
- Third-party payment gateway (not yet integrated)
- Email/SMS delivery (external service)

---

## 3. Test Types

| Type              | Tool              | Location                  |
|-------------------|-------------------|---------------------------|
| Backend Unit      | Jest              | qa/backend/unit/          |
| Backend API       | Jest + Supertest  | qa/backend/integration/   |
| Frontend Unit     | Vitest + RTL      | qa/frontend/unit/         |
| Frontend Integration | Vitest + RTL   | qa/frontend/integration/  |
| End-to-End        | Playwright        | qa/e2e/                   |
| API Manual        | Postman           | qa/postman/               |

---

## 4. Test Cases

### 4.1 Authentication

| ID     | Description                                  | Method | Endpoint                    | Expected |
|--------|----------------------------------------------|--------|-----------------------------|----------|
| AUTH-01 | Register new user with valid data            | POST   | /api/auth/register-user     | 201, token + user |
| AUTH-02 | Register user with duplicate email           | POST   | /api/auth/register-user     | 409 conflict |
| AUTH-03 | Register user with missing required fields   | POST   | /api/auth/register-user     | 422 validation error |
| AUTH-04 | Register new partner with valid data         | POST   | /api/auth/register-partner  | 201, token + partner |
| AUTH-05 | Login with correct credentials               | POST   | /api/auth/login             | 200, token |
| AUTH-06 | Login with wrong password                    | POST   | /api/auth/login             | 401 |
| AUTH-07 | Login with non-existent email                | POST   | /api/auth/login             | 401 |
| AUTH-08 | Get current user with valid token            | GET    | /api/auth/me                | 200, user object |
| AUTH-09 | Get current user with expired/invalid token  | GET    | /api/auth/me                | 401 |
| AUTH-10 | Access protected route without token         | GET    | /api/bookings/user          | 401 |
| AUTH-11 | Partner accessing user-only route            | GET    | /api/bookings/user          | 403 |
| AUTH-12 | User accessing partner-only route            | GET    | /api/bookings/partner       | 403 |

### 4.2 Venues

| ID      | Description                                  | Method | Endpoint                    | Expected |
|---------|----------------------------------------------|--------|-----------------------------|----------|
| VEN-01  | Partner creates venue with valid data        | POST   | /api/venues                 | 201, venue object |
| VEN-02  | User (non-partner) tries to create venue     | POST   | /api/venues                 | 403 |
| VEN-03  | Create venue with missing required fields    | POST   | /api/venues                 | 422 |
| VEN-04  | Get all active venues (no filters)           | GET    | /api/venues                 | 200, array |
| VEN-05  | Filter venues by city                        | GET    | /api/venues?city=Mumbai     | 200, filtered array |
| VEN-06  | Filter venues by price range                 | GET    | /api/venues?minPrice=10000  | 200, filtered array |
| VEN-07  | Filter venues by capacity                    | GET    | /api/venues?capacity=200    | 200, filtered array |
| VEN-08  | Filter venues by type                        | GET    | /api/venues?venueType=banquet | 200, filtered array |
| VEN-09  | Search venues by keyword                     | GET    | /api/venues?search=royal    | 200, filtered array |
| VEN-10  | Get single venue by ID                       | GET    | /api/venues/:id             | 200, venue object |
| VEN-11  | Get non-existent venue                       | GET    | /api/venues/invalid-id      | 404 |
| VEN-12  | Partner updates own venue                    | PUT    | /api/venues/:id             | 200, updated venue |
| VEN-13  | Partner updates another partner's venue      | PUT    | /api/venues/:id             | 403 |
| VEN-14  | Partner deletes own venue (soft delete)      | DELETE | /api/venues/:id             | 200 |
| VEN-15  | Get partner's own venues                     | GET    | /api/venues/partner/my-venues | 200, array |

### 4.3 Availability

| ID      | Description                                  | Method | Endpoint                              | Expected |
|---------|----------------------------------------------|--------|---------------------------------------|----------|
| AVL-01  | Partner sets bulk available dates            | POST   | /api/venues/:id/availability          | 201 |
| AVL-02  | Get availability calendar for venue          | GET    | /api/venues/:id/availability          | 200, dates array |
| AVL-03  | Update specific date availability            | PUT    | /api/venues/:id/availability/:date    | 200 |
| AVL-04  | Remove a date from availability              | DELETE | /api/venues/:id/availability/:date    | 200 |
| AVL-05  | User (non-partner) sets availability         | POST   | /api/venues/:id/availability          | 403 |
| AVL-06  | Set availability for past date               | POST   | /api/venues/:id/availability          | 400 |

### 4.4 Services

| ID      | Description                                  | Method | Endpoint                    | Expected |
|---------|----------------------------------------------|--------|-----------------------------|----------|
| SVC-01  | Partner adds service to venue                | POST   | /api/venues/:id/services    | 201 |
| SVC-02  | Get all services for a venue                 | GET    | /api/venues/:id/services    | 200, array |
| SVC-03  | Update a service                             | PUT    | /api/services/:serviceId    | 200 |
| SVC-04  | Soft delete a service                        | DELETE | /api/services/:serviceId    | 200 |
| SVC-05  | Add service with negative price              | POST   | /api/venues/:id/services    | 422 |

### 4.5 Bookings

| ID      | Description                                  | Method | Endpoint                        | Expected |
|---------|----------------------------------------------|--------|---------------------------------|----------|
| BKG-01  | User creates booking request for available date | POST | /api/bookings/request          | 201, requestId |
| BKG-02  | User books unavailable date                  | POST   | /api/bookings/request           | 400 |
| BKG-03  | User books non-existent venue                | POST   | /api/bookings/request           | 404 |
| BKG-04  | Partner (non-user) creates booking request   | POST   | /api/bookings/request           | 403 |
| BKG-05  | Get user's booking history                   | GET    | /api/bookings/user              | 200, array |
| BKG-06  | Get partner's incoming requests              | GET    | /api/bookings/partner           | 200, array |
| BKG-07  | Partner accepts a pending booking            | PATCH  | /api/bookings/:id/accept        | 200, booking confirmed |
| BKG-08  | Partner rejects a pending booking            | PATCH  | /api/bookings/:id/reject        | 200 |
| BKG-09  | User cancels their own booking               | PATCH  | /api/bookings/:id/cancel        | 200 |
| BKG-10  | Partner cancels a booking                    | PATCH  | /api/bookings/:id/cancel        | 200 |
| BKG-11  | Accept already-accepted booking              | PATCH  | /api/bookings/:id/accept        | 400 |
| BKG-12  | Preview billing before booking               | POST   | /api/bookings/preview-billing   | 200, breakdown |
| BKG-13  | Concurrent booking requests for same date    | POST   | /api/bookings/request (x2)      | One 201, one 400 |
| BKG-14  | Accepting booking marks date unavailable     | PATCH  | /api/bookings/:id/accept        | Availability updated |
| BKG-15  | Notification sent to partner on new request  | POST   | /api/bookings/request           | Notification created |
| BKG-16  | Notification sent to user on accept/reject   | PATCH  | /api/bookings/:id/accept        | Notification created |

### 4.6 Billing Calculation

| ID      | Description                                  | Expected |
|---------|----------------------------------------------|----------|
| BIL-01  | Base price only (no guests, no services)     | grandTotal = basePrice + 5% fee + 18% GST |
| BIL-02  | Base price + per-guest charge                | Correct per-guest multiplication |
| BIL-03  | Base price + single service add-on           | Correct service line total |
| BIL-04  | Base price + multiple services               | All services summed correctly |
| BIL-05  | Service with quantity > 1                    | qty × unitPrice |
| BIL-06  | Inactive service excluded from billing       | Not included in total |
| BIL-07  | Platform fee is 5% of subtotal               | Math verified |
| BIL-08  | GST is 18% of (subtotal + platform fee)      | Math verified |
| BIL-09  | Zero guest count with per-guest price        | No per-guest charge added |
| BIL-10  | Breakdown array contains all line items      | All types present |

### 4.7 Notifications

| ID      | Description                                  | Method | Endpoint                            | Expected |
|---------|----------------------------------------------|--------|-------------------------------------|----------|
| NOT-01  | Get all notifications for current user       | GET    | /api/notifications                  | 200, array |
| NOT-02  | Mark single notification as read             | PATCH  | /api/notifications/:id/read         | 200 |
| NOT-03  | Mark all notifications as read               | PATCH  | /api/notifications/read-all         | 200 |
| NOT-04  | Get notifications for another user           | GET    | /api/notifications                  | Only own notifications |

### 4.8 Dashboard

| ID      | Description                                  | Method | Endpoint                    | Expected |
|---------|----------------------------------------------|--------|-----------------------------|----------|
| DSH-01  | Partner gets dashboard stats                 | GET    | /api/dashboard/partner      | 200, stats object |
| DSH-02  | User gets dashboard stats                    | GET    | /api/dashboard/user         | 200, stats object |
| DSH-03  | User accesses partner dashboard              | GET    | /api/dashboard/partner      | 403 |

### 4.9 Frontend Components

| ID      | Description                                  | Component       | Expected |
|---------|----------------------------------------------|-----------------|----------|
| FE-01   | Login form renders correctly                 | Login           | Email, password fields, submit button |
| FE-02   | Login with valid credentials redirects       | Login           | Navigates to /dashboard |
| FE-03   | Login with invalid credentials shows error  | Login           | Error message displayed |
| FE-04   | SignUp form toggles between user/partner     | SignUp          | Role toggle works |
| FE-05   | Navbar shows login/signup when logged out    | Navbar          | Auth links visible |
| FE-06   | Navbar shows user name and logout when in   | Navbar          | User info visible |
| FE-07   | Protected route redirects unauthenticated   | ProtectedRoute  | Redirects to /login |
| FE-08   | Partner route blocks regular user           | ProtectedRoute  | Redirects to / |
| FE-09   | AuthContext persists user on page reload     | AuthContext     | Token restored from localStorage |
| FE-10   | Logout clears token and user state           | AuthContext     | localStorage cleared, user null |

---

## 5. Security Test Cases

| ID      | Description                                  | Expected |
|---------|----------------------------------------------|----------|
| SEC-01  | SQL/NoSQL injection in search params         | Sanitized, no data leak |
| SEC-02  | JWT with tampered payload                    | 401 rejected |
| SEC-03  | Expired JWT token                            | 401 rejected |
| SEC-04  | Rate limit on auth endpoints (>20 req/15min) | 429 Too Many Requests |
| SEC-05  | CORS blocks unauthorized origins             | Request blocked |
| SEC-06  | Password not returned in any response        | passwordHash absent |
| SEC-07  | Partner cannot read another partner's venues | Only own venues returned |
| SEC-08  | User cannot access another user's bookings   | Only own bookings returned |
| SEC-09  | Upload non-image file to venue media         | 400 rejected |
| SEC-10  | XSS payload in venue title/description       | Sanitized or escaped |

---

## 6. Performance Benchmarks

| Endpoint                  | Max Response Time | Notes |
|---------------------------|-------------------|-------|
| GET /api/venues           | < 500ms           | With filters |
| POST /api/bookings/request | < 1000ms         | Includes Firestore transaction |
| GET /api/auth/me          | < 200ms           | Token verify + DB read |
| GET /api/dashboard/partner | < 800ms          | Aggregation query |

---

## 7. Regression Checklist

Run before every release:

- [ ] All AUTH test cases pass
- [ ] All VEN test cases pass
- [ ] All BKG test cases pass
- [ ] BIL-01 through BIL-10 pass
- [ ] SEC-01 through SEC-08 pass
- [ ] Frontend login/logout flow works
- [ ] Protected routes enforce roles
- [ ] No `passwordHash` in any API response
- [ ] Health check endpoint returns 200
- [ ] Swagger docs load at /api/docs

---

## 8. Bug Severity Levels

| Level    | Description                                      | SLA      |
|----------|--------------------------------------------------|----------|
| Critical | Data loss, security breach, booking double-booked | Fix same day |
| High     | Feature broken, wrong billing, auth bypass        | Fix within 24h |
| Medium   | UI broken, non-critical endpoint fails            | Fix within 3 days |
| Low      | Cosmetic, typo, minor UX issue                    | Next sprint |

---

## 9. Test Environment

| Environment | Base URL                    | Firebase Project     |
|-------------|-----------------------------|----------------------|
| Local       | http://localhost:5000        | wedplano-dev         |
| Staging     | https://api-staging.wedplano.com | wedplano-staging |
| Production  | https://api.wedplano.com     | wedplano-prod        |

> **Never run destructive tests against production.**
