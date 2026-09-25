import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from './config';
import { handleFirestoreError, OperationType } from './error';
import {
  UserProfile,
  LeaderboardEntry,
} from '../types';

const LOCAL_STORAGE_PROFILE_KEY = 'codepath_local_profile';

/**
 * Checks if the current request is for an authenticated Firebase user
 */
function isUserAuthenticated(userId: string): boolean {
  return !!auth.currentUser && auth.currentUser.uid === userId;
}

/**
 * Persists or updates the user profile in Firestore and syncs leaderboard entry
 */
export async function syncUserProfileToFirestore(
  userId: string,
  profile: Partial<UserProfile> & { name: string; email: string; xp: number; level: string | number; streak: number }
): Promise<void> {
  const payload = {
    id: userId,
    name: profile.name || 'Anonymous Learner',
    email: profile.email || 'user@example.com',
    avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    xp: profile.xp ?? 0,
    level: typeof profile.level === 'number' ? profile.level : parseInt(String(profile.level).replace(/\D/g, '')) || 1,
    streak: profile.streak ?? 0,
    dailyGoalMinutes: profile.dailyGoalMinutes ?? 15,
    editorFontSize: profile.editorFontSize || 'md',
    soundEnabled: profile.soundEnabled ?? true,
    completedLessons: profile.completedLessons || [],
    completedExercises: profile.completedExercises || [],
    quizScores: profile.quizScores || {},
    unlockedAchievements: profile.unlockedAchievements || [],
    completedArchitectureChallenges: profile.completedArchitectureChallenges || [],
    updatedAt: new Date().toISOString(),
  };

  // Always keep a local copy for resilience
  try {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore local storage errors
  }

  // If not authenticated with Firebase, don't execute unauthorized Firestore write
  if (!isUserAuthenticated(userId)) {
    return;
  }

  const userRef = doc(db, 'users', userId);
  const path = `users/${userId}`;

  try {
    await setDoc(userRef, payload, { merge: true });

    // Also sync the public leaderboard record
    const lbRef = doc(db, 'leaderboard', userId);
    const lbPayload = {
      id: userId,
      userId: userId,
      displayName: payload.name,
      photoURL: payload.avatar,
      xp: payload.xp,
      level: payload.level,
      streak: payload.streak,
      badgesCount: (payload.unlockedAchievements || []).length,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(lbRef, lbPayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Retrieves the user profile from Firestore or local fallback
 */
export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  if (!isUserAuthenticated(userId)) {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  const userRef = doc(db, 'users', userId);
  const path = `users/${userId}`;

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Subscribes to real-time profile updates for the current user
 */
export function subscribeToUserProfile(
  userId: string,
  onUpdate: (profile: UserProfile) => void
): () => void {
  if (!isUserAuthenticated(userId)) {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (saved) onUpdate(JSON.parse(saved));
    } catch {
      // fallback
    }
    return () => {};
  }

  const userRef = doc(db, 'users', userId);
  const path = `users/${userId}`;

  return onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as UserProfile);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Retrieves top leaderboard users ordered by XP descending
 */
export async function getLeaderboardFromFirestore(maxEntries: number = 25): Promise<LeaderboardEntry[]> {
  const lbRef = collection(db, 'leaderboard');
  const path = 'leaderboard';

  try {
    const q = query(lbRef, orderBy('xp', 'desc'), limit(maxEntries));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d, index) => ({
        id: d.id,
        ...d.data(),
        rank: index + 1,
      } as LeaderboardEntry));
    }
  } catch (error) {
    console.warn('Leaderboard fetch fallback:', error);
  }

  // Fallback demo leaderboard entries if empty
  return [
    {
      id: 'demo-1',
      userId: 'demo-1',
      displayName: 'Alex Chen (Staff Architect)',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      xp: 14250,
      level: 28,
      streak: 42,
      badgesCount: 16,
      rank: 1,
    },
    {
      id: 'demo-2',
      userId: 'demo-2',
      displayName: 'Maya Lin (Senior Engineer)',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      xp: 11800,
      level: 22,
      streak: 28,
      badgesCount: 12,
      rank: 2,
    },
    {
      id: 'demo-3',
      userId: 'demo-3',
      displayName: 'David K. (System Specialist)',
      photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      xp: 8650,
      level: 17,
      streak: 19,
      badgesCount: 9,
      rank: 3,
    },
  ];
}
