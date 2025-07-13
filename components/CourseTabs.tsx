import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, FlatList,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

import AddModuleModal   from '@/components/AddModuleModal';
import AddStudentsModal from '@/components/AddStudentsModal';

import { useSubtopics }      from '@/hooks/useSubtopics';
import { useModules }        from '@/hooks/useModules';
import { useCourseStudents } from '@/hooks/useCourseStudents';

const ORANGE = '#F4A83D';

type Props = { courseId: string; description: string };

export default function CourseTabs({ courseId, description }: Props) {
  const [tab, setTab] = useState<'Modules' | 'Description' | 'Students'>('Modules');

  /* sub-topics (Modules tab) */
  const { loading: subLoad, subtopics } = useSubtopics(courseId);

  /* course-students (Students tab) */
  const { loading: stuLoad, students }  = useCourseStudents(courseId);

  /* modal state */
  const [targetSub, setTargetSub] = useState<{ id: string; title: string } | null>(null);
  const [showAddStu, setShowStu]  = useState(false);

  return (
    <>
      {/* pill selector */}
      <View style={styles.pillRow}>
        {(['Modules','Description','Students'] as const).map(k => (
          <Pressable
            key={k}
            style={[styles.pill, tab===k && styles.pillActive]}
            onPress={() => setTab(k)}
          >
            <Text style={[
              styles.pillTxt,
              tab===k && { fontWeight:'700', color:'#000' },
            ]}>{k}</Text>
          </Pressable>
        ))}
      </View>

      {/* DESCRIPTION TAB */}
      {tab==='Description' && (
        <ScrollView style={{ marginTop:10 }} nestedScrollEnabled>
          <Text style={{ fontSize:14 }}>{description}</Text>
        </ScrollView>
      )}

      {/* MODULES TAB */}
      {tab==='Modules' && (
        subLoad ? (
          <ActivityIndicator style={{ marginTop:20 }} />
        ) : (
          <FlatList
            style={{ marginTop:10 }}
            data={subtopics}
            keyExtractor={s=>s.id}
            renderItem={({ item }) => (
              <SubtopicBlock
                courseId={courseId}
                sub={item}
                onAdd={() => setTargetSub(item)}
              />
            )}
          />
        )
      )}

      {/* STUDENTS TAB */}
      {tab==='Students' && (
        <>
          {/* add-button top-right */}
          <Pressable
            style={styles.addStud}
            onPress={() => setShowStu(true)}
          >
            <Feather name="user-plus" size={16} color="#fff" />
            <Text style={styles.addTxt}>Add students</Text>
          </Pressable>

          {stuLoad ? (
            <ActivityIndicator style={{ marginTop:20 }} />
          ) : students.length === 0 ? (
            <Text style={styles.empty}>No students enrolled</Text>
          ) : (
            <FlatList
              style={{ marginTop:10 }}
              data={students}
              keyExtractor={u => u.uid}
              renderItem={({ item }) => (
                <Text style={{ marginVertical:6 }}>{item.email}</Text>
              )}
            />
          )}

          {/* modal */}
          <AddStudentsModal
            visible={showAddStu}
            courseId={courseId}
            onClose={() => setShowStu(false)}
          />
        </>
      )}

      {/* add-module modal */}
      {targetSub && (
        <AddModuleModal
          visible
          courseId={courseId}
          subtopicId={targetSub.id}
          onClose={() => setTargetSub(null)}
        />
      )}
    </>
  );
}

function SubtopicBlock({
  courseId, sub, onAdd,
}: {
  courseId: string;
  sub: { id: string; title: string };
  onAdd: () => void;
}) {
  const { loading, modules } = useModules(courseId, sub.id);

  return (
    <View style={{ marginBottom:12 }}>
      {/* bar */}
      <View style={styles.topicBar}>
        <Text style={styles.topicTxt}>Subtopic: {sub.title}</Text>
        <Pressable style={styles.plus} onPress={onAdd}>
          <Feather name="plus" size={14} color="#fff" />
        </Pressable>
      </View>

      {/* lessons */}
      {loading ? (
        <ActivityIndicator style={{ marginTop:6 }} size="small" />
      ) : modules.length===0 ? (
        <Text style={styles.empty}>No modules yet</Text>
      ) : (
        modules.map(m=>(
          <Pressable
            key={m.id}
            style={styles.modRow}
            onPress={() => router.push({
              pathname:'/course/[id]/module/[mid]',
              params:{ id:courseId, sub:sub.id, mid:m.id },
            })}
          >
            <Text style={styles.play}>▶</Text>
            <View style={{ flex:1 }}>
              <Text style={styles.modTitle}>{m.title}</Text>
              <Text style={styles.modTime}>{m.minutes} m</Text>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pillRow:{ flexDirection:'row', justifyContent:'space-evenly', marginTop:10 },
  pill:{ flex:1, alignItems:'center', paddingVertical:6 },
  pillActive:{ backgroundColor:'#d9d9d9', borderRadius:12 },
  pillTxt:{ fontSize:13, color:'#555' },

  topicBar:{ backgroundColor:ORANGE, borderRadius:4, paddingVertical:6,
             paddingHorizontal:12, flexDirection:'row', alignItems:'center' },
  topicTxt:{ color:'#fff', fontWeight:'700', flex:1 },
  plus:{ marginLeft:'auto', width:24, height:24, borderRadius:12,
         backgroundColor:'#0003', alignItems:'center', justifyContent:'center' },

  modRow:{ flexDirection:'row', alignItems:'center', marginTop:8 },
  play:{ marginRight:12, fontSize:18 },
  modTitle:{ fontSize:15, fontWeight:'600' },
  modTime:{ fontSize:12, color:'#666' },

  empty:{ fontSize:12, color:'#666', marginTop:20, textAlign:'center' },

  addStud:{ alignSelf:'flex-end', flexDirection:'row', alignItems:'center',
           backgroundColor:ORANGE, paddingHorizontal:12, paddingVertical:6,
           borderRadius:20, marginTop:10 },
  addTxt:{ color:'#fff', marginLeft:6, fontSize:12, fontWeight:'700' },
});
