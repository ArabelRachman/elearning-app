import { useEffect, useState } from 'react';
import { collectionGroup, onSnapshot, query, where, DocumentData } from 'firebase/firestore';
import { db } from '@/src/firebase';

export function useCompletedCoursesCount(uid?: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!uid) { setCount(0); return; }

    const q = query(
      collectionGroup(db, 'students'),
      where('uid', '==', uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      let c = 0;
      snap.forEach(d => {
        const data = d.data() as DocumentData;
        if (data.completed === true) c += 1;
      });
      setCount(c);
    });

    return unsub;
  }, [uid]);

  return { count };
}
