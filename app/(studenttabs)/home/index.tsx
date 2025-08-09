import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, Pressable, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { useStudentCourses } from '@/hooks/useStudentCourses';
import ProgressRing from '@/components/ProgressRing';
import { Feather } from '@expo/vector-icons';

const ORANGE = '#F4A83D';
const GREY   = '#888';

type FilterKey = 'started' | 'finished';

export default function StudentHome() {
  const { user } = useAuth() as any;
  const uid = user?.uid as string | undefined;

  const [filter, setFilter] = useState<FilterKey>('started');
  const { loading, courses } = useStudentCourses(uid);

  const filtered = useMemo(() => {
    if (filter === 'finished') return courses.filter(c => c.completed);
    return courses.filter(c => !c.completed);
  }, [courses, filter]);

  return (
    <View style={styles.container}>
      <Feather name="coffee" size={140} color="#8b6c4eff" style={{ marginTop: 20, alignSelf: 'center' }} />

      {/* filter pills */}
      <View style={styles.toggleRow}>
        {(['started', 'finished'] as const).map(k => (
          <Pressable
            key={k}
            style={[styles.toggleBtn, filter === k && styles.toggleActive]}
            onPress={() => setFilter(k)}
          >
            <Text style={[styles.toggleTxt, filter === k && { color: ORANGE, fontWeight: '700' }]}>
              {cap(k)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* list */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: GREY }}>
            {filter === 'started' ? 'No started courses yet.' : 'No finished courses yet.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingBottom: 110 }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => {
            const pct = computePct(item.modulesCompleted, item.modulesTotal, item.completed, item.progress);
            const color = ringColor(pct);

            return (
              <Pressable
                style={styles.row}
                onPress={() => router.push({ pathname: '/(studenttabs)/home/course/[id]', params: { id: item.id } })}
              >
                {/* thumb */}
                <View style={styles.thumbWrap}>
                  {item.thumbnailUrl
                    ? <Image source={{ uri: item.thumbnailUrl }} style={styles.thumb} />
                    : <View style={[styles.thumb, { backgroundColor: '#FFEFE6' }]} />}
                </View>

                {/* text */}
                <View style={styles.body}>
                  <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                  <Text numberOfLines={1} style={styles.sub}>
                    {formatProgress(item.modulesCompleted, item.modulesTotal)}
                  </Text>
                </View>

                {/* percent ring */}
                <ProgressRing
                  size={40}
                  stroke={4}
                  progress={pct}
                  progressColor={color}
                  trackColor="#E5E5E5"
                  text={`${pct}`}
                  textStyle={{ fontSize: 12 }}
                />
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function formatProgress(done?: number, total?: number) {
  if (done != null && total != null && total > 0) {
    return `You have completed ${done}/${total} modules`;
  }
  return `Continue learning`;
}

function computePct(
  done?: number,
  total?: number,
  completed?: boolean,
  fallbackPct?: number,
) {
  if (completed) return 100;
  if (typeof done === 'number' && typeof total === 'number' && total > 0) {
    return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  }
  if (typeof fallbackPct === 'number') return Math.max(0, Math.min(100, Math.round(fallbackPct)));
  return 0;
}

function ringColor(pct: number) {
  if (pct >= 80) return '#4CD964'; // green
  if (pct >= 40) return '#F5C330'; // yellow
  return '#E53935';                // red
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 18 },
  hero: { width: '90%', height: 120, alignSelf: 'center', marginTop: 6 },
  empty: { marginTop: 32, alignItems: 'center', justifyContent: 'center' },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 6, borderBottomWidth: 1, borderColor: ORANGE },
  toggleBtn: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  toggleActive: { borderBottomWidth: 3, borderColor: ORANGE },
  toggleTxt: { fontSize: 14, color: '#444' },

  sep: { height: 10 },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  thumbWrap: { width: 48, height: 48, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F5F5F5' },
  thumb: { width: '100%', height: '100%' },

  body: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  sub: { fontSize: 12, color: '#666', marginTop: 2 },
});
