import {
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {
  ref,
  listAll,
  deleteObject,
} from 'firebase/storage';
import { Alert } from 'react-native';
import { db, storage } from '@/src/firebase';

export async function deleteCourse(courseId: string) {
  return new Promise<void>((resolve, reject) => {
    Alert.alert(
      'Delete course',
      'Are you sure you want to delete this course?',
      [
        { text: 'No', style: 'cancel', onPress: () => reject() },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. delete Storage folder
              const folder = ref(storage, `courses/${courseId}`);
              const all    = await listAll(folder);
              await Promise.all(all.items.map(deleteObject));

              // 2. delete Firestore doc
              await deleteDoc(doc(db, 'courses', courseId));

              resolve();
            } catch (e) { reject(e); }
          },
        },
      ],
    );
  });
}
