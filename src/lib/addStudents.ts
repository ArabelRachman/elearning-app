import { doc, writeBatch } from 'firebase/firestore';
import { db } from '@/src/firebase';

/** Adds the given student UIDs to courses/{courseId}/students/{uid} */
export async function addStudents(courseId: string, uids: string[]) {
  const batch = writeBatch(db);
  uids.forEach(uid => {
    const ref = doc(db, 'courses', courseId, 'students', uid);
    batch.set(ref, { addedAt: Date.now() });
  });
  await batch.commit();
}
