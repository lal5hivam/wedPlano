/**
 * Unit tests for auth.middleware.js
 *
 * Tests verifyToken and requireRole in isolation using mocked Firebase.
 */

jest.mock('../../../backend/src/config/firebase', () => require('../mocks/firebase.mock'));

const jwt = require('jsonwebtoken');
const { verifyToken, requireRole } = require('../../../backend/src/middlewares/auth.middleware');
const { seedDocument, resetStore } = require('../mocks/firebase.mock');
const { mockUser, mockPartner } = require('../mocks/fixtures');

const JWT_SECRET = process.env.JWT_SECRET;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const makeReq = (token) => ({
  headers: { authorization: token ? `Bearer ${token}` : undefined },
});

const validToken = (uid = mockUser.uid) =>
  jwt.sign({ uid }, JWT_SECRET, { expiresIn: '1h' });

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  resetStore();
  seedDocument('users', mockUser.uid, mockUser);
  seedDocument('users', mockPartner.uid, mockPartner);
});

// ─── verifyToken ──────────────────────────────────────────────────────────────

describe('verifyToken', () => {
  it('calls next() and attaches user to req when token is valid', async () => {
    const req = makeReq(validToken());
    const res = makeRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBeDefined();
    expect(req.user.uid).toBe(mockUser.uid);
    expect(req.user.role).toBe('user');
  });

  it('returns 401 when Authorization header is missing', async () => {
    const req = { headers: {} };
    const res = makeRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token does not start with "Bearer "', async () => {
    const req = { headers: { authorization: 'Token abc123' } };
    const res = makeRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is expired', async () => {
    const expiredToken = jwt.sign({ uid: mockUser.uid }, JWT_SECRET, { expiresIn: '-1s' });
    const req = makeReq(expiredToken);
    const res = makeRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is signed with wrong secret', async () => {
    const badToken = jwt.sign({ uid: mockUser.uid }, 'wrong-secret', { expiresIn: '1h' });
    const req = makeReq(badToken);
    const res = makeRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when user does not exist in Firestore', async () => {
    const tokenForGhost = jwt.sign({ uid: 'ghost-uid' }, JWT_SECRET, { expiresIn: '1h' });
    const req = makeReq(tokenForGhost);
    const res = makeRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('does not expose passwordHash on req.user', async () => {
    const req = makeReq(validToken());
    const res = makeRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(req.user.passwordHash).toBeUndefined();
  });
});

// ─── requireRole ──────────────────────────────────────────────────────────────

describe('requireRole', () => {
  it('calls next() when user has the required role', () => {
    const req = { user: mockUser };
    const res = makeRes();
    const next = jest.fn();

    requireRole('user')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('calls next() when user matches one of multiple allowed roles', () => {
    const req = { user: mockPartner };
    const res = makeRes();
    const next = jest.fn();

    requireRole('user', 'partner')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('returns 403 when user role does not match', () => {
    const req = { user: mockUser }; // role: 'user'
    const res = makeRes();
    const next = jest.fn();

    requireRole('partner')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when req.user is undefined', () => {
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    requireRole('user')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
