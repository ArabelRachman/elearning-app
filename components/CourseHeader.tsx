import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CourseData } from '@/hooks/useCourse';
import { useCourseDuration } from '@/hooks/useCourseDuration';

const ORANGE = '#F4A83D';

type Props = {
  data: CourseData;
  onAddSubtopic: () => void;
};

export default function CourseHeader({ data, onAddSubtopic }: Props) {
  const totalMin = useCourseDuration(data.id);
  const hourText =
    totalMin == null
      ? '…'  
      : (totalMin / 60).toFixed(1) + ' hrs';

  return (
    <>
      {data.thumbnailUrl && (
        <Image source={{ uri: data.thumbnailUrl }} style={styles.thumb} />
      )}

      {/* title row + round “+” */}
      <View style={styles.row}>
        <Text style={styles.title}>{data.title}</Text>

        <Pressable style={styles.addBtn} onPress={onAddSubtopic}>
          <Feather name="plus" size={16} color="#fff" />
        </Pressable>
      </View>

      <Text style={styles.meta}>
        Created by <Text style={{ fontWeight: '700' }}>{data.ownerEmail}</Text>
      </Text>
      <Text style={styles.meta}>
        {hourText} · {data.status === 'published' ? 'Public' : 'Private'}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  thumb:{ width:'100%', aspectRatio:1.7, borderRadius:12, marginTop:4 },
  row:  { flexDirection:'row', alignItems:'center', marginTop:14 },
  title:{ flex:1, fontSize:18, fontWeight:'700' },
  addBtn:{ width:32, height:32, borderRadius:16, backgroundColor:ORANGE,
           alignItems:'center', justifyContent:'center' },
  meta:{ fontSize:12, color:'#444', marginTop:2 },
});
