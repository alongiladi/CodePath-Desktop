# Security Specification & Threat Model

## Core Data Invariants
1. **User Profile Isolation**: Users can only read and write their own `/users/{userId}` profile document (`request.auth.uid == userId`).
2. **Subcollection Ownership**: Memory Palaces (`/users/{userId}/palaces/{palaceId}`) and Practice Sessions (`/users/{userId}/sessions/{sessionId}`) are strictly private to their owner `userId`.
3. **Identity Verification**: On creation and mutation, `incoming().userId == request.auth.uid` must hold.
4. **Leaderboard Consistency**: A user can write to `/leaderboard/{userId}` only if `request.auth.uid == userId`.
5. **Leaderboard Visibility**: Public reads (`allow get, list`) are permitted on `/leaderboard` so learners can view rankings and compare progress.
6. **Immutable Fields**: `id`, `userId`, `createdAt` cannot be altered after creation.
7. **String & Array Bounding**: All string fields are bounded by length limits and arrays are bounded to prevent Denial-of-Wallet attacks.

## The Dirty Dozen Threat Payloads
1. **Unauthenticated Profile Read**: Anonymous user attempts `GET /users/victim-uid`. (Expect: PERMISSION_DENIED)
2. **Cross-User Profile Write**: Attacker authenticated as `attacker-uid` attempts `SET /users/victim-uid` with modified XP. (Expect: PERMISSION_DENIED)
3. **Ghost Field Poisoning**: Client attempts to inject `isAdmin: true` or `bypassed: true` into their own user profile. (Expect: PERMISSION_DENIED)
4. **Oversized String Bomb**: Client attempts to write a 2MB string into `title` or `description` of a memory palace. (Expect: PERMISSION_DENIED)
5. **Unbounded Array Flooding**: Client attempts to push 50,000 locus objects into a memory palace. (Expect: PERMISSION_DENIED)
6. **Cross-User Palace Read**: User B queries `/users/UserA/palaces/palace123`. (Expect: PERMISSION_DENIED)
7. **Cross-User Palace Mutation**: User B executes `UPDATE /users/UserA/palaces/palace123` changing items. (Expect: PERMISSION_DENIED)
8. **Spoofed Session Score**: Attacker attempts to post a practice session with `userId: "admin-uid"` or negative accuracy. (Expect: PERMISSION_DENIED)
9. **Leaderboard Impersonation**: Attacker authenticated as `attacker-uid` attempts to overwrite `/leaderboard/victim-uid`. (Expect: PERMISSION_DENIED)
10. **Path Variable ID Traversal**: Malicious request targets path `/users/../..//attack`. (Expect: PERMISSION_DENIED)
11. **Negative Score Exploit**: Practice session submitted with `score: -9999` or `accuracy: 105`. (Expect: PERMISSION_DENIED)
12. **Immutable Timestamp Rewrite**: Client attempts to backdate `createdAt` on an existing palace. (Expect: PERMISSION_DENIED)
