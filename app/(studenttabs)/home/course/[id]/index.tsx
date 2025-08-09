// app/(studenttabs)/home/course/[id]/index.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useCourse } from '@/hooks/useCourse';
import CourseHeaderStudents from '@/components/CourseHeaderStudents';
import CourseTabsStudents from '@/components/CourseTabsStudents';

const ORANGE = '#F4A83D';

export default function StudentCourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, course } = useCourse(id);

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 80 }} />;
  if (!course) return <Text style={{ margin: 40 }}>Course not found.</Text>;

  return (
    <View style={styles.container}>
      {/* top header (pill style) */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={20} />
        </Pressable>

        <View style={styles.titlePill}>
          <Text style={styles.titlePillText}>My Courses</Text>
        </View>

        {/* spacer to balance the back button width */}
        <View style={{ width: 32 }} />
      </View>

      {/* body */}
      <View style={{ flex: 1, padding: 18 }}>
        {/* Read-only header (no add / publish actions) */}
        <CourseHeaderStudents data={course} />

        {/* Modules + Description tabs (same as instructor, read-only usage) */}
        <CourseTabsStudents courseId={course.id} description={course.description} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 40,
    paddingBottom: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePill: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePillText: { color: '#fff', fontWeight: '700' },
});
