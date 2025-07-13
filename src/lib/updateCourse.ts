import {
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db, storage } from '@/src/firebase';

export async function updateCourse({
  courseId,
  title,
  description,
  thumbnail,         // may be null (unchanged)
}: {
  courseId: string;
  title: string;
  description: string;
  thumbnail: Blob | null;
}) {
  let thumbPath: string | undefined;

  if (thumbnail) {
    thumbPath = `courses/${courseId}/thumb.jpg`;
    await uploadBytes(ref(storage, thumbPath), thumbnail);
  }

  await updateDoc(doc(db, 'courses', courseId), {
    title,
    description,
    ...(thumbPath && { thumbnailPath: thumbPath }),
  });

  /* return fresh URL so UI can update immediately */
  return thumbPath
    ? await getDownloadURL(ref(storage, thumbPath))
    : null;
}
