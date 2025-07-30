// Deletes the Firestore user document at /users/{uid}.
import { db } from '@/src/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function deleteStudent(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid));
}
