// src/components/CourseRow.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CourseItem } from '@/hooks/useCourses';

type Props = CourseItem & {
  showMenu: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onEdit: () => void; 
  onDelete: () => void;
};

export default function CourseRow({
  id,
  title,
  thumbnailUrl,
  students,
  showMenu,
  onOpenMenu,
  onCloseMenu,
  onEdit, 
  onDelete,
}: Props) {

  const [thumb, setThumb] = useState<string | null>(null);
  useEffect(() => setThumb(thumbnailUrl), [thumbnailUrl]);

  return (
    <View style={styles.row}>
      {thumb ? (
        <Image source={{ uri: thumb }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, { backgroundColor: '#eee' }]} />
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.sub}>
          {students === 0 ? 'no students' : `${students} students`}
        </Text>
      </View>

      <Pressable onPress={showMenu ? onCloseMenu : onOpenMenu}>
        <Feather name="more-horizontal" size={22} color="#333" />
      </Pressable>

      {showMenu && (
        <View style={styles.popup}>
          <Pressable style={styles.popBtn} onPress={onEdit}>
            <Text style={styles.popTxt}>edit</Text>
          </Pressable>
          <Pressable style={styles.popBtn} onPress={onDelete}>
            <Text style={styles.popTxt}>delete</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  thumb:   { width: 46, height: 46, borderRadius: 10, marginRight: 12 },
  title:   { fontSize: 15, fontWeight: '600' },
  sub:     { fontSize: 12, color: '#666' },

  popup:   { position: 'absolute', right: 0, top: 38, backgroundColor: '#fff', borderWidth: 1, borderColor: '#bbb', borderRadius: 6 },
  popBtn:  { paddingHorizontal: 12, paddingVertical: 6 },
  popTxt:  { fontSize: 12 },
});
