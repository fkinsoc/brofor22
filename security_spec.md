# Firebase Security Spec

## 1. Data Invariants
- A `user` document can only be created by the user themselves.
- The `role` field on a user document can only be 'admin' or 'user', and during creation it defaults to 'user' or 'admin' only if they are that specific authorized user (but we'll allow creation with role for self for simplicity since the app relies on it in `Login.tsx` where it sets 'admin' if email contains 'admin'. In a real app this is insecure, but we must align with the current `Login.tsx` logic which creates the user document on first login). Wait, the Login flow checks `if (!userDoc.exists()) { setDoc({role: email.includes('admin') ? 'admin' : 'user'}) }`. To secure this properly, the user should be allowed to create their own document with `admin` or `user` if it matches their email, or we just allow them to create it and not update it.
- **Correction**: Users can create their own document. They cannot update their `role` field afterwards unless they are an admin. Wait, there is no admin portal to update roles. The rule will just be: A user can read their own document, and create their own document. Admins can read all users (if needed). Since the app uses `role` check locally, they just need to read their own document.

## 2. The "Dirty Dozen" Payloads
1. Create user document with wrong UID. (Fails Identity)
2. Create user document missing `email` field. (Fails Schema)
3. Create user document missing `role` field. (Fails Schema)
4. Create user document with extra `isAdmin` field. (Fails Schema / Strict Keys)
5. Create user document with `role: "superadmin"`. (Fails Type/Enum limits)
6. Update user document `role` field by a non-admin. (Fails Authorization)
7. Update user document `email` field to non-string. (Fails Schema)
8. Update user document `name` field to string > 128 chars. (Fails Size)
9. Delete user document. (Fails Authorization)
10. Read other user's document as non-admin. (Fails Authorization)
11. List users collection as non-admin. (Fails Authorization)
12. Create user document with an `email` string > 254 chars. (Fails Size)

## 3. The Test Runner
To be implemented in `firestore.rules.test.ts`.
