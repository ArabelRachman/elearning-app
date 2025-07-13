import { useEffect, useState } from 'react';
import {
  collection, getDocs, DocumentData,
} from 'firebase/firestore';
import { db } from '@/src/firebase';

/**
 * Returns total minutes for **all modules** inside a course.
 * Fetch-once implementation (runs again if courseId changes).
 */
export function useCourseDuration(courseId: string) {
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        let total = 0;

        const subCol = collection(db, 'courses', courseId, 'subtopics');
        const subSnap = await getDocs(subCol);

        for (const sub of subSnap.docs) {
          const modCol = collection(
            db, 'courses', courseId, 'subtopics', sub.id, 'modules',
          );
          const modSnap = await getDocs(modCol);
          modSnap.forEach((m) => {
            const d: DocumentData = m.data();
            total += d.minutes ?? 0;
          });
        }

        if (isMounted) setMinutes(total);
      } catch (e) {
        console.error('useCourseDuration:', e);
        if (isMounted) setMinutes(0);
      }
    })();

    return () => { isMounted = false; };
  }, [courseId]);

  return minutes;            // null ⇒ still loading
}
