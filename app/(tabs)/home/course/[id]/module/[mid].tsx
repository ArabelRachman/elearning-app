import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, Pressable, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useModule } from '@/hooks/useModule';
import { useSubtopics } from '@/hooks/useSubtopics';
import { useModules }  from '@/hooks/useModules';
import { getNextModule } from '@/src/lib/getNextModule';
import FileViewer from '@/components/FileViewer';
import { useCourse } from '@/hooks/useCourse';

const ORANGE='#F4A83D';

export default function ModuleScreen() {
  const { id:courseId, sub:subId, mid } =
    useLocalSearchParams<{id:string;sub:string;mid:string}>();

  const { loading, module } = useModule(courseId, subId, mid);
  const { subtopics }       = useSubtopics(courseId);   // all subs
  const { modules }         = useModules(courseId, subId); // current sub modules\
  const { course } = useCourse(courseId);

  /* compute next lesson (or null) */
  const next = useMemo(
    () => getNextModule(subtopics, modules, subId, mid),
    [subtopics, modules, subId, mid],
  );

  if (loading) return <ActivityIndicator style={{ flex:1, marginTop:80 }} />;
  if (!module) return <Text style={{ margin:40 }}>Lesson not found.</Text>;

  return (
    <View style={styles.container}>
      {/* top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() =>
            router.replace({
              pathname: '/(tabs)/home/course/[id]',   // course page
              params:   { id: courseId }, // current course
            })
          }
          style={styles.backBtn}
        >
          <Feather name="chevron-left" size={20} />
        </Pressable>
        <Text style={styles.topTitle}>{course?.title}</Text>
      </View>

      {/* lesson info */}
      <View style={{ padding:18, flex:1 }}>
        <View style={styles.row}>
          <Feather name="play" size={24} color={ORANGE} />
          <View style={{ marginLeft:10 }}>
            <Text style={styles.lessonTitle}>{module.title}</Text>
            <Text style={styles.minute}>{module.minutes} m</Text>
          </View>
        </View>

        {/* file viewer */}
        <FileViewer uri={module.file} />

      </View>

      {/* bottom button */}
      <Pressable
        style={styles.nextBtn}
        onPress={() => {
          if (!next) {             router.replace({
              pathname: '/(tabs)/home/course/[id]',   // course page
              params:   { id: courseId }, // current course
            }); return; }
          router.replace({
            pathname:`/(tabs)/home/course/[id]/module/[mid]`,
            params:{ id:courseId, sub:next.subtopicId, mid:next.id },
          });
        }}
      >
        <Text style={styles.nextTxt}>
          {next ? 'Next Module' : 'Finish Course'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff' },

  topBar:{ flexDirection:'row', alignItems:'center', padding:14, paddingTop:60 },
  backBtn:{ width:32, height:32, borderWidth:1, borderRadius:6, alignItems:'center', justifyContent:'center' },
  topTitle:{ flex:1, textAlign:'center', fontWeight:'700' },

  row:{ flexDirection:'row', alignItems:'center' },
  lessonTitle:{ fontWeight:'700', fontSize:16 },
  minute:{ fontSize:12, color:'#666' },

  nextBtn:{ position:'absolute', bottom:20, alignSelf:'center',
            backgroundColor:ORANGE, paddingHorizontal:42,
            paddingVertical:13, borderRadius:26 },
  nextTxt:{ color:'#fff', fontWeight:'700' },
});
