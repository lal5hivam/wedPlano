const admin = require('firebase-admin');

let db = null;
let initialized = false;

const initializeFirebase = () => {
  if (initialized) return db;

  // Validate Firebase configuration
  const requiredFirebaseVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID',
    'FIREBASE_AUTH_URI',
    'FIREBASE_TOKEN_URI',
  ];

  const missingVars = requiredFirebaseVars.filter(v => !process.env[v]);
  if (missingVars.length > 0) {
    throw new Error(`Missing Firebase config: ${missingVars.join(', ')}`);
  }

  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.includes('\\n')
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
  };

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  db = admin.firestore();
  initialized = true;
  return db;
};

// Get database instance (initializes on first call)
const getDb = () => {
  if (!initialized) {
    initializeFirebase();
  }
  return db;
};

module.exports = { 
  admin, 
  get db() {
    return getDb();
  },
  initializeFirebase 
};
