// app/(studenttabs)/home/course/[id]/module/[mid].tsx
import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, Pressable, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useModule }     from '@/hooks/useModule';
import { useSubtopics }  from '@/hooks/useSubtopics';
import { useModules }    from '@/hooks/useModules';
import { useCourse }     from '@/hooks/useCourse';
import { getNextModule } from '@/src/lib/getNextModule';
import FileViewer        from '@/components/FileViewer';

import { useAuth } from '@/src/contexts/AuthContext';
import { db } from '@/src/firebase'; // if your alias maps @->src; else use '@/firebase'
import {
  doc,
  runTransaction,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

const ORANGE = '#F4A83D';

export default function StudentModuleScreen() {
  const { id: courseId, sub: subId, mid } =
    useLocalSearchParams<{ id: string; sub: string; mid: string }>();

  const { user } = useAuth() as any; // ensure this exposes user.uid
  const uid = user?.uid as string | undefined;

  const { loading, module } = useModule(courseId, subId, mid);
  const { subtopics }       = useSubtopics(courseId);
  const { modules }         = useModules(courseId, subId);
  const { course }          = useCourse(courseId);

  // compute next lesson (or null)
  const next = useMemo(
    () => getNextModule(subtopics, modules, subId, mid),
    [subtopics, modules, subId, mid]
  );

  if (loading)   return <ActivityIndicator style={{ flex: 1, marginTop: 80 }} />;
  if (!module)   return <Text style={{ margin: 40 }}>Lesson not found.</Text>;

  const courseRoute = {
    pathname: '/(studenttabs)/home/course/[id]' as const,
    params: { id: courseId },
  };

  async function updateProgress(finishCourse: boolean) {
    if (!uid) return;

    const ref = doc(db, 'courses', courseId, 'students', uid);
    const key = `${subId}:${mid}`;

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const data = (snap.data() as any) || {};
      const alreadyDone =
        data?.completedModules && data.completedModules[key] === true;

      // Always record last viewed module + mark this module as done in the map
      tx.set(
        ref,
        {
          lastModule: { subId, moduleId: mid, at: serverTimestamp() },
          completedModules: { [key]: true }, // merge new key into the map
        },
        { merge: true }
      );

      // Only increment if we haven't counted this module before (idempotent)
      if (!alreadyDone) {
        tx.update(ref, { modulesCompleted: increment(1) });
      }

      // If finishing the course, tag completed
      if (finishCourse) {
        tx.set(
          ref,
          { completed: true, completedAt: serverTimestamp() },
          { merge: true }
        );
      }
    });
  }

  async function handleAdvance() {
    // If there is no next module: mark progress + completed and go back to course
    if (!next) {
      await updateProgress(true);
      router.replace(courseRoute);
      return;
    }

    // Otherwise mark current as complete and navigate to next
    await updateProgress(false);
    router.replace({
      pathname: '/(studenttabs)/home/course/[id]/module/[mid]',
      params: { id: courseId, sub: next.subtopicId, mid: next.id },
    });
  }

  return (
    <View style={styles.container}>
      {/* top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Back to course"
        >
          <Feather name="chevron-left" size={20} />
        </Pressable>
        <Text numberOfLines={1} style={styles.topTitle}>{course?.title}</Text>
        {/* spacer to balance back button */}
        <View style={{ width: 32 }} />
      </View>

      {/* lesson info */}
      <View style={{ padding: 18, flex: 1 }}>
        <View style={styles.row}>
          <Feather name="play" size={24} color={ORANGE} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.lessonTitle}>{module.title}</Text>
            <Text style={styles.minute}>{module.minutes} m</Text>
          </View>
        </View>

        {/* file viewer */}
        <FileViewer uri={module.file} />
      </View>

      {/* bottom button */}
      <Pressable style={styles.nextBtn} onPress={handleAdvance}>
        <Text style={styles.nextTxt}>
          {next ? 'Next Module' : 'Finish Course'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingTop: 60,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { flex: 1, textAlign: 'center', fontWeight: '700' },

  row: { flexDirection: 'row', alignItems: 'center' },
  lessonTitle: { fontWeight: '700', fontSize: 16 },
  minute: { fontSize: 12, color: '#666' },

  nextBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: ORANGE,
    paddingHorizontal: 42,
    paddingVertical: 13,
    borderRadius: 26,
  },
  nextTxt: { color: '#fff', fontWeight: '700' },
});
