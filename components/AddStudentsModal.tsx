// src/components/AddStudentsModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal, View, Text, FlatList, Pressable,
  StyleSheet, ActivityIndicator, TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAllStudents }       from '@/hooks/useAllStudents';
import { useCourseStudents }    from '@/hooks/useCourseStudents';
import { updateCourseStudents } from '@/src/lib/updateCourseStudents';

const ORANGE = '#F4A83D';

type Props = {
  visible:  boolean;
  courseId: string;
  onClose:  () => void;
};

export default function AddStudentsModal({ visible, courseId, onClose }: Props) {
  const { loading: allLd, students }      = useAllStudents();
  const { loading: curLd,  uids: current} = useCourseStudents(courseId);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving,   setSaving]   = useState(false);
  const [query,    setQuery]    = useState('');            // 🔍 search text

  useEffect(() => { if (!curLd) setSelected(new Set(current)); },
            [curLd, current]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q === ''
      ? students
      : students.filter(s => s.email.toLowerCase().includes(q));
  }, [students, query]);

  const toggle = (uid: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  };

  const handleSave = async () => {
    if (saving || curLd) return;
    setSaving(true);
    try {
      await updateCourseStudents(courseId, current, selected);
      onClose();
    } finally { setSaving(false); }
  };

  const loading = allLd || curLd;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Manage students</Text>

          {/* search bar */}
          <View style={styles.searchWrap}>
            <Feather name="search" size={14} color="#888" style={{ marginRight:6 }}/>
            <TextInput
              placeholder="Search email…"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
          </View>

          {/* list */}
          {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={u => u.uid}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={styles.row}
                  onPress={() => toggle(item.uid)}
                >
                  <Text style={{ flex: 1 }}>{item.email}</Text>
                  {selected.has(item.uid) && (
                    <Feather name="check" size={18} color={ORANGE} />
                  )}
                </Pressable>
              )}
            />
          )}

          {/* actions */}
          <Pressable
            style={[styles.btn, saving && { opacity: 0.5 }]}
            disabled={saving}
            onPress={handleSave}
          >
            <Text style={styles.btnTxt}>
              {saving ? 'Saving…' : 'Save'}
            </Text>
          </Pressable>
          <Pressable onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ textAlign: 'center', color: '#888' }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:{ flex:1, backgroundColor:'#0006', justifyContent:'flex-end' },
  sheet:{ backgroundColor:'#fff', padding:20, maxHeight:'80%',
          borderTopLeftRadius:16, borderTopRightRadius:16 },
  title:{ fontSize:16, fontWeight:'700', marginBottom:12 },

  searchWrap:{ flexDirection:'row', alignItems:'center',
               borderWidth:1, borderColor:'#ddd', borderRadius:8,
               paddingHorizontal:10, marginBottom:12 },
  searchInput:{ flex:1, height:32, fontSize:13, padding:0 },

  row:{ flexDirection:'row', alignItems:'center', paddingVertical:8 },
  btn:{ backgroundColor:ORANGE, borderRadius:20,
        paddingVertical:12, marginTop:16 },
  btnTxt:{ color:'#fff', textAlign:'center', fontWeight:'700' },
});
