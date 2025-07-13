import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  getCountFromServer,
  DocumentData,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import { db, storage } from '@/src/firebase';
import { useAuth }     from '@/src/contexts/AuthContext';

export type CourseItem = {
  id: string;
  title: string;
  description: string; 
  thumbnailUrl: string | null;
  students: number;   
};

export function useCourses(status: 'draft' | 'published') {
  const { user } = useAuth();
  const [loading, setLoading]   = useState(true);
  const [courses, setCourses]   = useState<CourseItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'courses'),
      where('owner', '==', user.uid),
      where('status', '==', status),
    );

    const unsub = onSnapshot(q, async snap => {
      const enriched = await Promise.all(
        snap.docs.map(async d => enrich(d.data(), d.id)),
      );
      setCourses(enriched);
      setLoading(false);
    });

    return unsub;
  }, [status, user?.uid]);

  return { loading, courses };
}

async function enrich(data: DocumentData, id: string): Promise<CourseItem> {
  // thumbnail
  let url: string | null = null;
  try {
    url = await getDownloadURL(ref(storage, data.thumbnailPath));
  } catch { /* file missing → keep null */ }

  // student count (collection may not exist)
  let count = 0;
  try {
    const coll = collection(db, 'courses', id, 'students');
    const agg  = await getCountFromServer(coll);
    count = agg.data().count;
  } catch { /* keep 0 */ }

  return {
    id,
    title: data.title,
    thumbnailUrl: url,
    description: data.description ?? '',
    students: count,
  };
}
