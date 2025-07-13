import { useEffect, useState } from 'react';
import {
  doc, onSnapshot, DocumentData,
  collection, getCountFromServer,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import { db, storage } from '@/src/firebase';

export type CourseData = {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  ownerEmail: string;
  thumbnailUrl: string | null;
  students: number;
  createdAt: Date | null;
};

export function useCourse(id: string) {
  const [loading, setLoading] = useState(true);
  const [course,  setCourse]  = useState<CourseData | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'courses', id), async snap => {
      if (!snap.exists()) { setCourse(null); setLoading(false); return; }
      const data: DocumentData = snap.data();

      /* thumb URL */
      let url: string | null = null;
      try { url = await getDownloadURL(ref(storage, data.thumbnailPath)); }
      catch { /* ignore */ }

      /* student count */
      let count = 0;
      try {
        const agg = await getCountFromServer(
          collection(db, 'courses', id, 'students'),
        );
        count = agg.data().count;
      } catch {}

      setCourse({
        id,
        title:        data.title,
        description:  data.description ?? '',
        status:       data.status,
        ownerEmail:   data.ownerEmail ?? '',
        thumbnailUrl: url,
        students:     count,
        createdAt:    data.createdAt?.toDate?.() ?? null,
      });
      setLoading(false);
    });

    return unsub;
  }, [id]);

  return { loading, course };
}
