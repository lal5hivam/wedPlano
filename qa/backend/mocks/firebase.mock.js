/**
 * Firebase / Firestore mock helpers.
 *
 * Usage in test files:
 *   jest.mock('../../../backend/src/config/firebase', () => require('./firebase.mock'));
 *
 * The mock exposes a simple in-memory store so tests can seed data
 * and assert on writes without a live Firebase connection.
 */

const store = {};

/**
 * Reset the in-memory store between tests.
 * Call this in beforeEach / afterEach.
 */
const resetStore = () => {
  Object.keys(store).forEach((k) => delete store[k]);
};

/**
 * Seed the store with initial data.
 * @param {string} collection
 * @param {string} docId
 * @param {Object} data
 */
const seedDocument = (collection, docId, data) => {
  if (!store[collection]) store[collection] = {};
  store[collection][docId] = { ...data };
};

/**
 * Read a document directly from the mock store (for assertions).
 */
const getDocument = (collection, docId) => {
  return store[collection]?.[docId] ?? null;
};

// ─── Firestore document snapshot ─────────────────────────────────────────────

const makeDocSnapshot = (data) => ({
  exists: data !== null && data !== undefined,
  data: () => data,
  id: data?.id ?? data?.uid ?? data?.venueId ?? 'mock-id',
});

// ─── Firestore query snapshot ─────────────────────────────────────────────────

const makeQuerySnapshot = (docs) => ({
  empty: docs.length === 0,
  docs: docs.map((d) => makeDocSnapshot(d)),
  forEach: (fn) => docs.forEach((d) => fn(makeDocSnapshot(d))),
});

// ─── Mock collection builder ──────────────────────────────────────────────────

const makeCollection = (collectionName) => {
  const col = {
    _filters: [],

    doc: (docId) => ({
      get: jest.fn(async () => {
        const data = store[collectionName]?.[docId] ?? null;
        return makeDocSnapshot(data);
      }),
      set: jest.fn(async (data) => {
        if (!store[collectionName]) store[collectionName] = {};
        store[collectionName][docId] = { ...data };
      }),
      update: jest.fn(async (data) => {
        if (!store[collectionName]?.[docId]) throw new Error('Document not found');
        store[collectionName][docId] = { ...store[collectionName][docId], ...data };
      }),
      delete: jest.fn(async () => {
        if (store[collectionName]) delete store[collectionName][docId];
      }),
    }),

    where: jest.fn(function (field, op, value) {
      this._filters.push({ field, op, value });
      return this;
    }),

    get: jest.fn(async function () {
      const docs = Object.values(store[collectionName] ?? {}).filter((doc) => {
        return this._filters.every(({ field, op, value }) => {
          if (op === '==') return doc[field] === value;
          if (op === '!=') return doc[field] !== value;
          if (op === '>') return doc[field] > value;
          if (op === '>=') return doc[field] >= value;
          if (op === '<') return doc[field] < value;
          if (op === '<=') return doc[field] <= value;
          if (op === 'in') return Array.isArray(value) && value.includes(doc[field]);
          return true;
        });
      });
      this._filters = [];
      return makeQuerySnapshot(docs);
    }),

    add: jest.fn(async (data) => {
      const id = `auto-${Date.now()}`;
      if (!store[collectionName]) store[collectionName] = {};
      store[collectionName][id] = { ...data, id };
      return { id };
    }),
  };

  return col;
};

// ─── Mock db ──────────────────────────────────────────────────────────────────

const db = {
  collection: jest.fn((name) => makeCollection(name)),

  runTransaction: jest.fn(async (fn) => {
    // Simplified transaction — runs the callback with a mock transaction object
    const t = {
      get: jest.fn(async (ref) => ref.get()),
      set: jest.fn(async (ref, data) => ref.set(data)),
      update: jest.fn(async (ref, data) => ref.update(data)),
    };
    return fn(t);
  }),
};

module.exports = { db, resetStore, seedDocument, getDocument };
