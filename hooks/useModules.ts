import { useEffect, useState } from 'react';
import {
  collection, query, onSnapshot, orderBy, DocumentData,
} from 'firebase/firestore';
import { db } from '@/src/firebase';

export type Module = {
  id: string;
  title: string;
  minutes: number;
};

export function useModules(courseId: string, subtopicId: string) {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const q = query(
      collection(
        db,
        'courses', courseId,
        'subtopics', subtopicId,
        'modules',
      ),
      orderBy('createdAt', 'asc'),
    );

    const unsub = onSnapshot(q, snap => {
      const list: Module[] = [];
      snap.forEach(doc => {
        const d: DocumentData = doc.data();
        list.push({
          id: doc.id,
          title: d.title,
          minutes: d.minutes ?? 0,
        });
      });
      setModules(list);
      setLoading(false);
    });

    return unsub;
  }, [courseId, subtopicId]);

  return { loading, modules };
}
