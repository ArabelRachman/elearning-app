import { useEffect, useState } from 'react';
import {
  collection, query, orderBy, limit,
  onSnapshot, getDocs, DocumentData,
} from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Module } from './useModules';

export type Subtopic = {
  id: string;
  title: string;
  moduleCount?: number;
  firstModule?: Module & { subtopicId: string };
};

export function useSubtopics(courseId: string) {
  const [loading, setLoading] = useState(true);
  const [subtopics, setSubs]  = useState<Subtopic[]>([]);

  useEffect(() => {
    const subQ = query(
      collection(db, 'courses', courseId, 'subtopics'),
      orderBy('createdAt', 'asc'),
    );

    const unsub = onSnapshot(subQ, async snap => {
      const list: Subtopic[] = [];

      for (const docSnap of snap.docs) {
        const d = docSnap.data() as DocumentData;

        const base: Subtopic = {
          id:          docSnap.id,
          title:       d.title,
          moduleCount: d.moduleCount ?? 0,
        };

        if (base.moduleCount! > 0) {
          const modCol   = collection(
            db, 'courses', courseId, 'subtopics', docSnap.id, 'modules',
          );
          const firstQ   = query(modCol, orderBy('createdAt'), limit(1));
          const firstSnap= await getDocs(firstQ);

          if (!firstSnap.empty) {
            const m  = firstSnap.docs[0];
            const md = m.data() as DocumentData;
            base.firstModule = {
              id:        m.id,
              title:     md.title,
              minutes:   md.minutes ?? 0,
              file:      md.file,
              subtopicId: docSnap.id,
            };
          }
        }
        list.push(base);
      }

      setSubs(list);  
      setLoading(false);
    });

    return unsub;
  }, [courseId]);

  return { loading, subtopics };
}
