let adminApp;

class AuthenticationError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'AuthenticationError';
    this.status = status;
    this.code = code;
  }
}

function getAdminAuth() {
  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new AuthenticationError(503, 'auth_not_configured', 'Firebase authentication is not configured.');
  }
  try {
    const admin = require('firebase-admin');
    if (!adminApp) {
      adminApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
    return admin.auth(adminApp);
  } catch (error) {
    if (error instanceof AuthenticationError) throw error;
    throw new AuthenticationError(503, 'auth_unavailable', 'Firebase authentication is temporarily unavailable.');
  }
}

async function authenticateRequest(req) {
  const parts = typeof req.headers.authorization === 'string'
    ? req.headers.authorization.trim().split(/\s+/) : [];
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    throw new AuthenticationError(401, 'missing_token', 'A Firebase ID token is required.');
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(parts[1], true);
    if (!decoded.uid) throw new Error('Token has no user ID');
    return { uid: decoded.uid };
  } catch (error) {
    if (error instanceof AuthenticationError) throw error;
    const invalidTokenCodes = new Set([
      'auth/argument-error', 'auth/id-token-expired', 'auth/id-token-revoked',
      'auth/invalid-id-token', 'auth/user-disabled', 'auth/user-not-found'
    ]);
    if (invalidTokenCodes.has(error.code)) {
      throw new AuthenticationError(401, 'invalid_token', 'The Firebase ID token is invalid or expired.');
    }
    throw new AuthenticationError(503, 'token_verification_unavailable', 'Firebase token verification is temporarily unavailable.');
  }
}

module.exports = { authenticateRequest, AuthenticationError };
