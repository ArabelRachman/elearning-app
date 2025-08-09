import {
  writeBatch,
  doc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/src/firebase';

/** Sum of subtopics.{moduleCount} for a course */
async function computeModulesTotal(courseId: string): Promise<number | undefined> {
  try {
    const subCol = collection(db, 'courses', courseId, 'subtopics');
    const snap = await getDocs(subCol);
    let total = 0;
    snap.forEach(d => {
      const n = Number(d.get('moduleCount'));
      if (Number.isFinite(n)) total += n;
    });
    return total;
  } catch {
    return undefined;
  }
}

/**
 * Sync course-students to match `desired`.
 * - Adds any UIDs not yet enrolled (seeds progress fields, incl. modulesTotal)
 * - Removes UIDs that were unchecked.
 * NOTE: Batch limit is 500 ops; chunk if you might exceed that.
 */
export async function updateCourseStudents(
  courseId: string,
  current: Set<string>,
  desired: Set<string>,
) {
  const batch = writeBatch(db);

  // Compute modulesTotal from subtopics' moduleCount
  const modulesTotal = await computeModulesTotal(courseId);

  // Adds (seed progress)
  desired.forEach((uid) => {
    if (!current.has(uid)) {
      const ref = doc(db, 'courses', courseId, 'students', uid);
      batch.set(
        ref,
        {
          uid,                          // for collectionGroup queries
          addedAt: serverTimestamp(),
          modulesCompleted: 0,          // or completedCount if you prefer
          ...(modulesTotal !== undefined ? { modulesTotal } : {}),
          completed: false,
          completedModules: {},         // map of "<subId>:<moduleId>": true
        },
        { merge: true }
      );
    }
  });

  // Removes (unenroll)
  current.forEach((uid) => {
    if (!desired.has(uid)) {
      batch.delete(doc(db, 'courses', courseId, 'students', uid));
    }
  });

  await batch.commit();
}
