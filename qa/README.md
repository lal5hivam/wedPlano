# Wedplano QA & Testing

This directory contains all quality assurance and testing resources for the Wedplano wedding venue booking platform.

## Directory Structure

```
qa/
├── README.md                        # This file
├── backend/
│   ├── unit/
│   │   ├── billing.service.test.js  # Billing calculation unit tests
│   │   ├── auth.middleware.test.js  # JWT auth middleware unit tests
│   │   └── error.middleware.test.js # Error handler unit tests
│   ├── integration/
│   │   ├── auth.test.js             # Auth endpoints integration tests
│   │   ├── venues.test.js           # Venue CRUD integration tests
│   │   ├── bookings.test.js         # Booking workflow integration tests
│   │   ├── availability.test.js     # Availability management tests
│   │   ├── services.test.js         # Venue services tests
│   │   ├── notifications.test.js    # Notification endpoint tests
│   │   └── dashboard.test.js        # Dashboard endpoint tests
│   ├── mocks/
│   │   ├── firebase.mock.js         # Firestore mock helpers
│   │   └── fixtures.js              # Shared test data fixtures
│   └── setup.js                     # Jest global setup / teardown
├── frontend/
│   ├── unit/
│   │   ├── AuthContext.test.jsx     # AuthContext hook unit tests
│   │   └── Navbar.test.jsx          # Navbar component unit tests
│   ├── integration/
│   │   └── LoginFlow.test.jsx       # Login page integration test
│   └── setup.js                     # Vitest / jsdom setup
├── e2e/
│   ├── auth.spec.js                 # End-to-end auth flows
│   ├── booking.spec.js              # End-to-end booking workflow
│   └── venue.spec.js                # End-to-end venue management
├── postman/
│   └── Wedplano.postman_collection.json  # Importable Postman collection
└── test-plan.md                     # Full QA test plan
```

## Quick Start

### Backend Tests (Jest)

```bash
cd backend
npm install --save-dev jest supertest @jest/globals
npx jest --testPathPattern=qa/backend --coverage
```

### Frontend Tests (Vitest + React Testing Library)

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npx vitest run qa/frontend
```

### E2E Tests (Playwright)

```bash
npm install --save-dev @playwright/test
npx playwright install
npx playwright test qa/e2e
```

## Test Coverage Goals

| Area              | Target |
|-------------------|--------|
| Backend unit      | ≥ 90%  |
| Backend API       | ≥ 80%  |
| Frontend unit     | ≥ 75%  |
| E2E critical path | 100%   |

## Environment

Copy `backend/.env.example` to `backend/.env.test` and set:

```
NODE_ENV=test
JWT_SECRET=test-secret-key
FIREBASE_PROJECT_ID=wedplano-test
```

Tests use mocked Firestore — no live Firebase connection required.
