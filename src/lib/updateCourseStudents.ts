import { writeBatch, doc } from 'firebase/firestore';
import { db } from '@/src/firebase';

/**
 * Sync course-students to match `desired`.
 * Adds any UIDs not yet enrolled and removes UIDs that were unchecked.
 */
export async function updateCourseStudents(
  courseId: string,
  current: Set<string>,  
  desired: Set<string>,       
) {
  const batch = writeBatch(db);

  // adds
  desired.forEach(uid => {
    if (!current.has(uid)) {
      batch.set(doc(db, 'courses', courseId, 'students', uid), {
        addedAt: Date.now(),
      });
    }
  });

  // removes
  current.forEach(uid => {
    if (!desired.has(uid)) {
      batch.delete(doc(db, 'courses', courseId, 'students', uid));
    }
  });

  await batch.commit();
}
