import { useEffect, useState } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/src/firebase';

export type UserProfile = {
  email?: string;
  photoURL?: string;
  photoPath?: string; // for deleting old file
};

export function useUserProfile(uid?: string) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!uid) { setProfile(null); setLoading(false); return; }
    const unsub = onSnapshot(doc(db, 'users', uid), (snap) => {
      const data = (snap.data() as DocumentData) || {};
      setProfile({
        email: data.email,
        photoURL: data.photoURL,
        photoPath: data.photoPath,
      });
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return { loading, profile };
}
