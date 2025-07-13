import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet,
  TextInput, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { addSubtopic } from '@/src/lib/addSubtopic';

const ORANGE = '#F4A83D';

type Props = {
  visible: boolean;
  courseId: string;
  onClose: () => void;
};

export default function AddSubtopicModal({ visible, courseId, onClose }: Props) {
  const [title, setTitle]   = useState('');
  const [loading, setLoad]  = useState(false);

  async function handleSave() {
    if (!title.trim()) { return; }
    setLoad(true);
    try {
      await addSubtopic(courseId, title.trim());
      setTitle('');
      onClose();
    } catch (e:any) { alert(e.message); }
    finally { setLoad(false); }
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.header}>New Sub-Topic</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Sub-topic title"
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.btnGrey} onPress={onClose}>
              <Text style={styles.txtGrey}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnOrange, loading && { opacity: .6 }]}
              disabled={loading}
              onPress={handleSave}
            >
              {loading
                ? <ActivityIndicator color="#fff"/>
                : <Text style={styles.txtWhite}>Add</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:{ flex:1, backgroundColor:'rgba(0,0,0,0.25)', justifyContent:'center', alignItems:'center' },
  card:{ width:'85%', backgroundColor:'#fff', borderRadius:8, padding:16 },
  header:{ fontWeight:'700', fontSize:16, marginBottom:10 },
  input:{ borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:10, marginBottom:14 },
  row:{ flexDirection:'row', justifyContent:'space-between' },
  btnGrey:{ flex:1, marginRight:6, backgroundColor:'#ccc', borderRadius:18, paddingVertical:10, alignItems:'center' },
  btnOrange:{ flex:1, marginLeft:6, backgroundColor:ORANGE, borderRadius:18, paddingVertical:10, alignItems:'center' },
  txtGrey:{ color:'#333', fontWeight:'600' },
  txtWhite:{ color:'#fff', fontWeight:'600' },
});
