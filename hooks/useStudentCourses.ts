import { useEffect, useState } from 'react';
import {
  collectionGroup, onSnapshot, query, where,
  getDoc, documentId, // (documentId not used here now, but ok to keep/remove)
  QueryDocumentSnapshot, DocumentData,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { db } from '@/src/firebase';

export type StudentCourse = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  modulesCompleted?: number;
  modulesTotal?: number;
  progress?: number;
  completed?: boolean;
};

export function useStudentCourses(uid?: string) {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setCourses([]); setLoading(false); return; }

    const cg = collectionGroup(db, 'students');
    // ✅ query by a field we control
    const q = query(cg, where('uid', '==', uid));

    const unsub = onSnapshot(q, async (snap) => {
      try {
        const next = await hydrateCoursesFromMemberships(snap.docs);
        setCourses(next);
      } catch (e) {
        console.warn('useStudentCourses hydrate error', e);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error('useStudentCourses snapshot error', err);
      setLoading(false);
    });

    return unsub;
  }, [uid]);

  return { loading, courses };
}

async function hydrateCoursesFromMemberships(
  memberships: QueryDocumentSnapshot<DocumentData>[]
): Promise<StudentCourse[]> {
  const storage = getStorage();
  const results: StudentCourse[] = [];

  for (const m of memberships) {
    const courseRef = m.ref.parent.parent; // /courses/{courseId}
    if (!courseRef) continue;

    const courseSnap = await getDoc(courseRef);
    if (!courseSnap.exists()) continue;

    const c = courseSnap.data() as any;

    let thumbnailUrl: string | undefined;
    if (c?.thumbnailPath) {
      try { thumbnailUrl = await getDownloadURL(ref(storage, c.thumbnailPath)); }
      catch { /* ignore */ }
    }

    const s = m.data() as any;
    const done  = num(s?.modulesCompleted);
    const total = num(s?.modulesTotal);
    const completed = !!s?.completed || (total > 0 && done >= total);
    const progress = total > 0 ? Math.round((done / total) * 100) : (completed ? 100 : 0);

    results.push({
      id: courseSnap.id,
      title: c?.title ?? '(Untitled)',
      description: c?.description ?? '',
      thumbnailUrl,
      modulesCompleted: done || undefined,
      modulesTotal: total || undefined,
      progress,
      completed,
    });
  }

  results.sort((a, b) => Number(!!a.completed) - Number(!!b.completed));
  return results;
}

function num(v: any) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
