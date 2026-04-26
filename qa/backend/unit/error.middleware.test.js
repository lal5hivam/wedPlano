/**
 * Unit tests for error.middleware.js
 *
 * Tests asyncHandler, createError, and the errorHandler middleware.
 */

const { asyncHandler, createError, errorHandler } = require('../../../backend/src/middlewares/error.middleware');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─── createError ──────────────────────────────────────────────────────────────

describe('createError', () => {
  it('creates an Error with the given message and status', () => {
    const err = createError('Not found', 404);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Not found');
    expect(err.status).toBe(404);
  });

  it('defaults status to 500 when not provided', () => {
    const err = createError('Something went wrong');
    expect(err.status).toBe(500);
  });
});

// ─── asyncHandler ─────────────────────────────────────────────────────────────

describe('asyncHandler', () => {
  it('calls the wrapped function and passes req, res, next', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const wrapped = asyncHandler(handler);
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next(error) when the wrapped function throws', async () => {
    const error = new Error('Async failure');
    const handler = jest.fn().mockRejectedValue(error);
    const wrapped = asyncHandler(handler);
    const next = jest.fn();

    await wrapped({}, makeRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ─── errorHandler ─────────────────────────────────────────────────────────────

describe('errorHandler', () => {
  it('responds with the error status and message', () => {
    const err = createError('Venue not found', 404);
    const res = makeRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Venue not found' })
    );
  });

  it('defaults to 500 for errors without a status', () => {
    const err = new Error('Unexpected crash');
    const res = makeRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('does not expose stack traces in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const err = createError('Internal error', 500);
    const res = makeRes();
    errorHandler(err, {}, res, jest.fn());

    const responseBody = res.json.mock.calls[0][0];
    expect(responseBody.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });
});
