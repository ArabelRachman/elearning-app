import { useEffect, useState } from 'react';
import {
  collection, query, where, onSnapshot, DocumentData,
} from 'firebase/firestore';
import { db } from '@/src/firebase';

export type Student = { uid: string; email: string };

export function useAllStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'student'),
    );
    const unsub = onSnapshot(q, snap => {
      const list: Student[] = [];
      snap.forEach(d => {
        const data = d.data() as DocumentData;
        list.push({ uid: d.id, email: data.email });
      });
      setStudents(list);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { loading, students };
}
