// src/hooks/useCourseStudents.ts
import { useEffect, useState } from 'react';
import {
  collection, onSnapshot, doc, getDoc, DocumentData,
} from 'firebase/firestore';
import { db } from '@/src/firebase';

export type CourseStudent = { uid: string; email: string };

export function useCourseStudents(courseId: string) {
  const [loading,  setLoading]  = useState(true);
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [uids,     setUids]     = useState<Set<string>>(new Set()); 

  useEffect(() => {
    const col = collection(db, 'courses', courseId, 'students');
    const unsub = onSnapshot(col, async snap => {
      const uidArr: string[] = snap.docs.map(d => d.id);
      setUids(new Set(uidArr));   

      const results = await Promise.all(
        uidArr.map(async uid => {
          const uSnap = await getDoc(doc(db, 'users', uid));
          const data: DocumentData|undefined = uSnap.data();
          return { uid, email: data?.email ?? '(no email)' } as CourseStudent;
        }),
      );

      setStudents(results);
      setLoading(false);
    });

    return unsub;
  }, [courseId]);

  return { loading, students, uids };
}
