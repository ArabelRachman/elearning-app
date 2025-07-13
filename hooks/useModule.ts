import { useEffect, useState } from 'react';
import {
  doc, onSnapshot, DocumentData,
} from 'firebase/firestore';
import { db } from '@/src/firebase';

export type ModuleData = {
  id: string;
  title: string;
  minutes: number;
  file: string;     // download URL
  subtopicId: string;
};

export function useModule(
  courseId: string,
  subtopicId: string,
  moduleId: string,
) {
  const [loading, setLoading] = useState(true);
  const [module, setModule]   = useState<ModuleData | null>(null);

  useEffect(() => {
    const ref = doc(
      db,
      'courses',   courseId,
      'subtopics', subtopicId,
      'modules',   moduleId,
    );
    const unsub = onSnapshot(ref, snap => {
      if (!snap.exists()) { setModule(null); setLoading(false); return; }
      const d:DocumentData = snap.data();
      setModule({
        id: snap.id,
        title:  d.title,
        minutes:d.minutes ?? 0,
        file:   d.file,
        subtopicId,
      });
      setLoading(false);
    });
    return unsub;
  }, [courseId, subtopicId, moduleId]);

  return { loading, module };
}
