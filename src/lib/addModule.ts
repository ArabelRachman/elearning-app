import { addDoc, collection, serverTimestamp, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/src/firebase';
import { increment, updateDoc } from 'firebase/firestore';


type Params={
  courseId:string;
  subtopicId:string;
  title:string;
  minutes:number;
  fileUri:string;
  fileName:string;
};

export async function addModule(p:Params){
  const path=`courses/${p.courseId}/modules/${Date.now()}_${p.fileName}`;
  const blob = await fetch(p.fileUri).then(r=>r.blob());
  await uploadBytes(ref(storage, path), blob);
  const url=await getDownloadURL(ref(storage, path));

  await addDoc(
    collection(db,'courses',p.courseId,'subtopics',p.subtopicId,'modules'),
    {
      title:p.title,
      minutes:p.minutes,
      file:url,
      createdAt:serverTimestamp(),
    },
  );

  try {
    await updateDoc(doc(db, 'courses', p.courseId, 'subtopics', p.subtopicId), {
      moduleCount: increment(1),
    });
    console.log('incremented');
  } catch (err) {
    console.error('Error incrementing module count:', err);
  }
}
