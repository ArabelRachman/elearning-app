import { collectionGroup, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';

/** Adds { uid: <docId> } to any /courses/** doc missing it. */
export async function backfillStudentUidField() {
  const snap = await getDocs(collectionGroup(db, 'students'));
  const ops: Promise<any>[] = [];
  snap.forEach((d) => {
    if (!d.data().uid) ops.push(updateDoc(d.ref, { uid: d.id }));
  });
  await Promise.all(ops);
  return { updated: ops.length, scanned: snap.size };
}
