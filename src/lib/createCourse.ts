import { v4 as uuid } from 'uuid';
import {
  doc,
  setDoc,
  serverTimestamp,
  collection
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
} from 'firebase/storage';

import { db, storage } from '@/src/firebase';

/**
 * Creates a course doc + uploads thumbnail.
 */
export async function createCourse({
  title,
  description,
  ownerUid,
  ownerEmail,
  thumbnail,
}: {
  title: string;
  description: string;
  ownerUid: string;
  ownerEmail: string;
  thumbnail: Blob;  
}) {
  const courseRef = doc(collection(db, 'courses'));   
  const courseId  = courseRef.id;

  const thumbPath = `courses/${courseId}/thumb.jpg`;
  await uploadBytes(ref(storage, thumbPath), thumbnail);

  await setDoc(doc(db, 'courses', courseId), {
    title,
    description,
    owner: ownerUid,
    ownerEmail,
    status: 'draft',      // private by default
    thumbnailPath: thumbPath,
    createdAt: serverTimestamp(),
  });

  await setDoc(doc(db, 'courses', courseId, 'meta', 'placeholders'), {
    createdAt: serverTimestamp(),
  });

  return courseId;
}
