import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TextInput,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import { addModule } from '@/src/lib/addModule';

const ORANGE='#F4A83D';

type Props={
  visible:boolean;
  courseId:string;
  subtopicId:string;
  onClose:()=>void;
};

export default function AddModuleModal({
  visible, courseId, subtopicId, onClose,
}:Props){
  const [title,setTitle]=useState('');
  const [minutes,setMinutes]=useState('');
  const [file, setFile]   = useState<DocumentPicker.DocumentPickerAsset|null>(null);
  const [loading,setLoad] = useState(false);

  async function pickFile(){
    const res=await DocumentPicker.getDocumentAsync({
      type:['video/*','application/pdf','application/epub+zip'],
    });
    if(!res.canceled && res.assets.length) {setFile(res.assets[0]);};
  }

  async function handleCreate(){
    if(!title.trim()||!file||!minutes.trim()) return;
    setLoad(true);
    try{
      await addModule({
        courseId,
        subtopicId,
        title:title.trim(),
        minutes:parseInt(minutes,10),
        fileUri:file.uri,
        fileName:file.name ?? 'module-file',
      });
      setTitle(''); setMinutes(''); setFile(null); onClose();
    }catch(e:any){ alert(e.message);}finally{ setLoad(false);}
  }

  return(
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.head}>Create New Module</Text>

          <TextInput
            placeholder="Name"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          {/* grey file picker box */}
          <TouchableOpacity style={styles.picker} onPress={pickFile}>
            {file
              ? <Text numberOfLines={1}>{file.name}</Text>
              : <>
                  <Feather name="plus-circle" size={34} color="#888"/>
                  <Text style={{fontSize:11,marginTop:6,color:'#666'}}>
                    Tap to choose PDF / eBook / Video
                  </Text>
                </>
            }
          </TouchableOpacity>

          <TextInput
            placeholder="Estimated minutes…"
            keyboardType="number-pad"
            style={styles.input}
            value={minutes}
            onChangeText={setMinutes}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.btnGrey} onPress={onClose}>
              <Text style={styles.txtGrey}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnOrg, loading && {opacity:.6}]}
              disabled={loading}
              onPress={handleCreate}
            >
              {loading
                ? <ActivityIndicator color="#fff"/>
                : <Text style={styles.txtWhite}>Create</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles=StyleSheet.create({
  backdrop:{flex:1,backgroundColor:'rgba(0,0,0,.25)',justifyContent:'center',alignItems:'center'},
  card:{width:'88%',backgroundColor:'#fff',borderRadius:8,padding:16},
  head:{fontWeight:'700',fontSize:16,marginBottom:10},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:10,marginBottom:12},
  picker:{height:140,borderWidth:1,borderColor:'#ccc',borderRadius:6,
          alignItems:'center',justifyContent:'center',marginBottom:12},
  row:{flexDirection:'row',justifyContent:'space-between',marginTop:4},
  btnGrey:{flex:1,marginRight:6,backgroundColor:'#ccc',borderRadius:18,paddingVertical:10,alignItems:'center'},
  btnOrg:{flex:1,marginLeft:6,backgroundColor:ORANGE,borderRadius:18,paddingVertical:10,alignItems:'center'},
  txtGrey:{fontWeight:'600',color:'#333'}, txtWhite:{fontWeight:'600',color:'#fff'},
});
