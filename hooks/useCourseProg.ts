// hooks/useCourseProg.ts
import { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { useAuth } from '@/src/contexts/AuthContext';

export function useCourseProgress(courseId: string) {
  const { user } = useAuth() as any;
  const uid: string | undefined = user?.uid;

  const [loading, setLoading] = useState(true);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!uid || !courseId) {
      setCompletedMap({});
      setCompleted(false);
      setLoading(false);
      return;
    }
    const ref = doc(db, 'courses', courseId, 'students', uid);
    const unsub = onSnapshot(ref, (snap) => {
      const data = (snap.data() as DocumentData) || {};
      setCompletedMap((data.completedModules as Record<string, boolean>) || {});
      setCompleted(!!data.completed);
      setLoading(false);
    });
    return unsub;
  }, [uid, courseId]);

  const completedSet = useMemo(
    () => new Set(Object.keys(completedMap)),
    [completedMap]
  );

  return { loading, completedSet, completed };
}
