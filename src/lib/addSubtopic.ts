import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';

/**  Creates a subtopic doc under /courses/{id}/subtopics  */
export async function addSubtopic(courseId: string, title: string) {
  await addDoc(collection(db, 'courses', courseId, 'subtopics'), {
    title,
    createdAt: serverTimestamp(),
    moduleCount: 0,
  });
}
