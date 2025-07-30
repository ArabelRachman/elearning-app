// app/(tabs)/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';

import { useCourses, CourseItem } from '@/hooks/useCourses';
import CourseRow            from '@/components/CourseRow';
import CreateCourseModal    from '@/components/CreateCourseModal';
import EditCourseModal      from '@/components/EditCourseModal';
import { deleteCourse }     from '@/src/lib/deleteCourse';

const ORANGE = '#F4A83D';

export default function ManageCourses() {
  const [filter, setFilter] = useState<'draft' | 'published'>('published');
  const { loading, courses } = useCourses(filter);

  const [menuFor, setMenuFor]   = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseItem | null>(null);

  return (
    <View style={styles.container}>
      {/* hero */}
      <Image
        source={{ uri: 'https://i.imgur.com/rRYdOrM.png' }}
        style={styles.hero}
        resizeMode="contain"
      />

      {/* filter pills */}
      <View style={styles.toggleRow}>
        {(['draft', 'published'] as const).map(k => (
          <Pressable
            key={k}
            style={[styles.toggleBtn, filter === k && styles.toggleActive]}
            onPress={() => setFilter(k)}
          >
            <Text
              style={[
                styles.toggleTxt,
                filter === k && { color: ORANGE, fontWeight: '700' },
              ]}
            >
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* list */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={c => c.id}
          contentContainerStyle={{ paddingBottom: 110 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({ pathname: '/(tabs)/home/course/[id]', params: { id: item.id } })
              }>
              <CourseRow
                {...item}
                showMenu={menuFor === item.id}
                onOpenMenu={() => setMenuFor(item.id)}
                onCloseMenu={() => setMenuFor(null)}
                onEdit={() => {
                  setEditCourse(item);
                  setMenuFor(null);
                }}
                onDelete={async () => {
                  setMenuFor(null);
                  try { await deleteCourse(item.id); } catch {}
                }}
              />
            </Pressable>
          )}
        />
      )}

      {/* create-course FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)}>
        <Text style={styles.fabTxt}>Create Course</Text>
      </TouchableOpacity>

      {/* modals */}
      <CreateCourseModal visible={showCreate} onClose={() => setShowCreate(false)} />

      {editCourse && (
        <EditCourseModal
          visible={true}
          onClose={() => setEditCourse(null)}
          courseId={editCourse.id}
          currentTitle={editCourse.title}
          currentDesc={editCourse.description}
          currentThumbUrl={editCourse.thumbnailUrl}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff', paddingHorizontal:18 },
  hero:{ width:'90%', height:120, alignSelf:'center', marginTop:6 },

  toggleRow:{ flexDirection:'row', justifyContent:'space-evenly', marginTop:6, borderBottomWidth:1, borderColor:ORANGE },
  toggleBtn:{ flex:1, alignItems:'center', paddingVertical:8 },
  toggleActive:{ borderBottomWidth:3, borderColor:ORANGE },
  toggleTxt:{ fontSize:14, color:'#444' },

  fab:{ position:'absolute', bottom:20, alignSelf:'center', backgroundColor:ORANGE, paddingHorizontal:26, paddingVertical:12, borderRadius:22 },
  fabTxt:{ color:'#fff', fontWeight:'600' },
});
