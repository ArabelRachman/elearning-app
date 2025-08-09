// components/CourseTabsStudents.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  FlatList, ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';

import { useSubtopics } from '@/hooks/useSubtopics';
import { useModules }   from '@/hooks/useModules';
import { useCourseProgress } from '@/hooks/useCourseProg';

const ORANGE  = '#F4A83D';
const GREEN   = '#4CD964';
const GREY_BG = '#EFEFEF';
const GREY_BR = '#CFCFCF';

type Props = { courseId: string; description: string };

export default function CourseTabsStudents({ courseId, description }: Props) {
  const [tab, setTab] = useState<'Modules' | 'Description'>('Modules');

  const { loading: subLoad, subtopics }   = useSubtopics(courseId);
  const { loading: progLoad, completedSet } = useCourseProgress(courseId);

  return (
    <>
      {/* pill selector */}
      <View style={styles.pillRow}>
        {(['Modules', 'Description'] as const).map((k) => (
          <Pressable
            key={k}
            style={[styles.pill, tab === k && styles.pillActive]}
            onPress={() => setTab(k)}
          >
            <Text style={[styles.pillTxt, tab === k && { fontWeight: '700', color: '#000' }]}>
              {k}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* DESCRIPTION TAB */}
      {tab === 'Description' && (
        <ScrollView style={{ marginTop: 10 }} nestedScrollEnabled>
          <Text style={{ fontSize: 14 }}>{description}</Text>
        </ScrollView>
      )}

      {/* MODULES TAB */}
      {tab === 'Modules' && (subLoad || progLoad ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          style={{ marginTop: 10 }}
          data={subtopics}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => (
            <SubtopicBlockStudent
              courseId={courseId}
              sub={item}
              completedSet={completedSet}
            />
          )}
        />
      ))}
    </>
  );
}

function SubtopicBlockStudent({
  courseId,
  sub,
  completedSet,
}: {
  courseId: string;
  sub: { id: string; title: string };
  completedSet: Set<string>;
}) {
  const { loading, modules } = useModules(courseId, sub.id);

  return (
    <View style={{ marginBottom: 12 }}>
      {/* bar */}
      <View style={styles.topicBar}>
        <Text style={styles.topicTxt}>Subtopic: {sub.title}</Text>
      </View>

      {/* lessons */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 6 }} size="small" />
      ) : modules.length === 0 ? (
        <Text style={styles.empty}>No modules yet</Text>
      ) : (
        modules.map((m) => {
          const key  = `${sub.id}:${m.id}`;
          const done = completedSet.has(key);
          return (
            <Pressable
              key={m.id}
              style={styles.modRow}
              onPress={() =>
                router.push({
                  pathname: '/(studenttabs)/home/course/[id]/module/[mid]',
                  params: { id: courseId, sub: sub.id, mid: m.id },
                })
              }
            >
              <Text style={styles.play}>▶</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.modTitle}>{m.title}</Text>
                <Text style={styles.modTime}>{m.minutes} m</Text>
              </View>

              {/* right-side status dot */}
              <View style={[styles.dot, done ? styles.dotDone : styles.dotTodo]}>
                {done && <Text style={styles.checkTxt}>✓</Text>}
              </View>
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pillRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 },
  pill: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  pillActive: { backgroundColor: '#d9d9d9', borderRadius: 12 },
  pillTxt: { fontSize: 13, color: '#555' },

  topicBar: {
    backgroundColor: ORANGE,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicTxt: { color: '#fff', fontWeight: '700', flex: 1 },

  modRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  play: { marginRight: 12, fontSize: 18 },
  modTitle: { fontSize: 15, fontWeight: '600' },
  modTime: { fontSize: 12, color: '#666' },

  dot: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 10, borderWidth: 2,
  },
  dotTodo: { backgroundColor: GREY_BG, borderColor: GREY_BR },
  dotDone: { backgroundColor: GREEN, borderColor: GREEN },
  checkTxt: { fontSize: 14, fontWeight: '900', color: '#000', lineHeight: 16 },

  empty: { fontSize: 12, color: '#666', marginTop: 20, textAlign: 'center' },
});
