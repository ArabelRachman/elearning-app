import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { CourseData } from '@/hooks/useCourse';
import { useCourseDuration } from '@/hooks/useCourseDuration';

const ORANGE = '#F4A83D';

type Props = { data: CourseData };

export default function CourseHeaderStudents({ data }: Props) {
  const totalMin = useCourseDuration(data.id);
  const hourText =
    totalMin == null ? '…' : (totalMin / 60).toFixed(1) + ' hours';

  return (
    <>
      {data.thumbnailUrl && (
        <Image source={{ uri: data.thumbnailUrl }} style={styles.thumb} />
      )}

      {/* title */}
      <View style={styles.row}>
        <Text style={styles.title}>{data.title}</Text>
      </View>

      {/* meta */}
      <Text style={styles.meta}>
        Created by <Text style={{ fontWeight: '700' }}>{data.ownerEmail}</Text>
      </Text>
      <Text style={styles.meta}>{hourText}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  thumb: { width: '100%', aspectRatio: 1.7, borderRadius: 12, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  title: { flex: 1, fontSize: 18, fontWeight: '700' },
  meta: { fontSize: 12, color: '#444', marginTop: 2 },
});
