/**
 * Integration tests for Auth endpoints.
 *
 * Uses Supertest to make real HTTP requests against the Express app.
 * Firebase is mocked so no live connection is needed.
 *
 * Covers: AUTH-01 through AUTH-12
 */

jest.mock('../../../backend/src/config/firebase', () => require('../mocks/firebase.mock'));

const request = require('supertest');
const app = require('../../../backend/src/app');
const { resetStore, seedDocument } = require('../mocks/firebase.mock');
const { mockUser, mockPartner } = require('../mocks/fixtures');

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  resetStore();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const registerUser = (overrides = {}) =>
  request(app)
    .post('/api/auth/register-user')
    .send({
      name: 'Test User',
      email: `user_${Date.now()}@test.com`,
      password: 'Password123!',
      phone: '9000000001',
      ...overrides,
    });

const registerPartner = (overrides = {}) =>
  request(app)
    .post('/api/auth/register-partner')
    .send({
      name: 'Test Partner',
      email: `partner_${Date.now()}@test.com`,
      password: 'Password123!',
      phone: '9000000002',
      ...overrides,
    });

// ─── Register User ────────────────────────────────────────────────────────────

describe('POST /api/auth/register-user', () => {
  // AUTH-01
  it('registers a new user and returns token + user object', async () => {
    const res = await registerUser();

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('user');
    expect(res.body.user.email).toBeDefined();
  });

  it('does not return passwordHash in the response', async () => {
    const res = await registerUser();
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  // AUTH-02
  it('returns 409 when email is already registered', async () => {
    const email = `dup_${Date.now()}@test.com`;
    await registerUser({ email });
    const res = await registerUser({ email });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  // AUTH-03
  it('returns 422 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register-user')
      .send({ email: 'incomplete@test.com' });

    expect(res.status).toBe(422);
  });

  it('returns 422 for invalid email format', async () => {
    const res = await registerUser({ email: 'not-an-email' });
    expect(res.status).toBe(422);
  });

  it('returns 422 for password shorter than minimum length', async () => {
    const res = await registerUser({ password: '123' });
    expect(res.status).toBe(422);
  });
});

// ─── Register Partner ─────────────────────────────────────────────────────────

describe('POST /api/auth/register-partner', () => {
  // AUTH-04
  it('registers a new partner and returns token + partner object', async () => {
    const res = await registerPartner();

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('partner');
  });

  it('returns 409 for duplicate partner email', async () => {
    const email = `dup_partner_${Date.now()}@test.com`;
    await registerPartner({ email });
    const res = await registerPartner({ email });

    expect(res.status).toBe(409);
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  let registeredEmail;
  const password = 'Password123!';

  beforeEach(async () => {
    registeredEmail = `login_${Date.now()}@test.com`;
    await registerUser({ email: registeredEmail, password });
  });

  // AUTH-05
  it('returns 200 and a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: registeredEmail, password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  // AUTH-06
  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: registeredEmail, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // AUTH-07
  it('returns 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@test.com', password });

    expect(res.status).toBe(401);
  });

  it('does not return passwordHash in login response', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: registeredEmail, password });

    expect(res.body.user?.passwordHash).toBeUndefined();
  });
});

// ─── Get Current User ─────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  let token;

  beforeEach(async () => {
    const res = await registerUser();
    token = res.body.token;
  });

  // AUTH-08
  it('returns the current user for a valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.role).toBe('user');
  });

  // AUTH-09
  it('returns 401 for an invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
  });

  // AUTH-10
  it('returns 401 when no Authorization header is provided', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

// ─── Role-Based Access ────────────────────────────────────────────────────────

describe('Role-based access control', () => {
  let userToken;
  let partnerToken;

  beforeEach(async () => {
    const userRes = await registerUser();
    userToken = userRes.body.token;

    const partnerRes = await registerPartner();
    partnerToken = partnerRes.body.token;
  });

  // AUTH-11
  it('blocks partner from accessing user-only route', async () => {
    const res = await request(app)
      .get('/api/bookings/user')
      .set('Authorization', `Bearer ${partnerToken}`);

    expect(res.status).toBe(403);
  });

  // AUTH-12
  it('blocks user from accessing partner-only route', async () => {
    const res = await request(app)
      .get('/api/bookings/partner')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});
