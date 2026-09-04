import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  const rules = fs.readFileSync(path.resolve(__dirname, 'firestore.rules'), 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: 'test-project',
    firestore: { rules },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Rules', () => {
  it('should not allow creating user document with wrong UID', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertFails(db.doc('users/user2').set({
      email: 'user1@test.com',
      role: 'user',
      name: 'User 1'
    }));
  });

  it('should not allow creating user document missing email field', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertFails(db.doc('users/user1').set({
      role: 'user',
      name: 'User 1'
    }));
  });

  it('should not allow creating user document missing role field', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertFails(db.doc('users/user1').set({
      email: 'user1@test.com',
      name: 'User 1'
    }));
  });

  it('should not allow creating user document with extra field', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertFails(db.doc('users/user1').set({
      email: 'user1@test.com',
      role: 'user',
      name: 'User 1',
      isAdmin: true
    }));
  });

  it('should not allow creating user document with invalid role', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertFails(db.doc('users/user1').set({
      email: 'user1@test.com',
      role: 'superadmin',
      name: 'User 1'
    }));
  });

  it('should allow user to create their own document', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(db.doc('users/user1').set({
      email: 'user1@test.com',
      role: 'user',
      name: 'User 1'
    }));
  });
});
