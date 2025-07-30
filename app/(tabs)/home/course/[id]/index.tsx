import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { db }                 from '@/src/firebase';
import { useCourse }          from '@/hooks/useCourse';
import CourseHeader           from '@/components/CourseHeader';
import CourseTabs             from '@/components/CourseTabs';
import AddSubtopicModal       from '@/components/AddSubtopicModal';

const ORANGE = '#F4A83D';

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, course } = useCourse(id);
  const [showAdd,   setShowAdd]   = useState(false);
  const [publishing, setPublishing] = useState(false);

  /* guards */
  if (loading)  return <ActivityIndicator style={{ flex:1, marginTop:80 }} />;
  if (!course)  return <Text style={{ margin:40 }}>Course not found.</Text>;

  /* publish handler */
  async function handlePublish() {
    Alert.alert(
      'Publish course?',
      'Students will be able to enroll as soon as you publish.',
      [
        { text:'Cancel', style:'cancel' },
        {
          text:'Publish',
          style:'destructive',
          onPress: async () => {
            setPublishing(true);
            try {
              await updateDoc(
                doc(db, 'courses', course.id),
                { status:'published', publishedAt: serverTimestamp() },
              );
            } finally { setPublishing(false); }
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      {/* fake header */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={20} />
        </Pressable>
        <Text style={styles.topTitle}>Manage Courses</Text>
      </View>

      {/* body */}
      <View style={{ flex:1, padding:18 }}>
        <CourseHeader
          data={course}
          onAddSubtopic={() => setShowAdd(true)}
        />
        <CourseTabs courseId={course.id} description={course.description} />
      </View>

      {/* publish button (only for drafts) */}
      {course.status === 'draft' && (
        <Pressable
          style={[styles.pubBtn, publishing && { opacity:0.6 }]}
          disabled={publishing}
          onPress={handlePublish}
        >
          <Text style={styles.pubTxt}>
            {publishing ? 'Publishing…' : 'Publish Course'}
          </Text>
        </Pressable>
      )}

      {/* add-subtopic modal */}
      <AddSubtopicModal
        visible={showAdd}
        courseId={course.id}
        onClose={() => setShowAdd(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff' },

  topBar:{ flexDirection:'row', alignItems:'center',
           paddingHorizontal:14, paddingTop:40 },
  backBtn:{ width:32, height:32, borderWidth:1, borderRadius:6,
            alignItems:'center', justifyContent:'center' },
  topTitle:{ flex:1, textAlign:'center', fontWeight:'700' },

  pubBtn:{ position:'absolute', bottom:20, alignSelf:'center',
           backgroundColor:ORANGE, paddingHorizontal:32, paddingVertical:13,
           borderRadius:26 },
  pubTxt:{ color:'#fff', fontWeight:'700' },
});
