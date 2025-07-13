import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather }      from '@expo/vector-icons';
import { createCourse } from '@/src/lib/createCourse';
import { useAuth }      from '@/src/contexts/AuthContext';

const ORANGE = '#F4A83D';

export default function CreateCourseModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();

  const [title, setTitle]           = useState('');
  const [description, setDesc]      = useState('');
  const [image, setImage]           = useState<ImagePicker.ImagePickerAsset>();
  const [loading, setLoading]       = useState(false);

  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled) setImage(res.assets[0]);
  }

  async function handleCreate() {
    if (!title.trim() || !image) { alert('Title & image required'); return; }

    try {
      setLoading(true);
      const blob = await fetch(image.uri).then(r => r.blob());

      await createCourse({
        title,
        description,
        ownerUid: user!.uid,
        ownerEmail: user!.email!,
        thumbnail: blob,
      });

      // reset + close
      setTitle('');
      setDesc('');
      setImage(undefined);
      onClose();
    } catch (e: any) {
      alert(e.message ?? 'Failed to create course');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Create New Course</Text>

          <TextInput
            style={styles.input}
            placeholder="Course Name"
            value={title}
            onChangeText={setTitle}
          />

          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {image ? (
              <Image
                source={{ uri: image.uri }}
                style={{ flex: 1, borderRadius: 6 }}
              />
            ) : (
              <Feather name="image" size={40} color="#666" />
            )}
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { height: 70 }]}
            placeholder="Course Description…."
            value={description}
            onChangeText={setDesc}
            multiline
          />

          {/* buttons */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.btnGrey} onPress={onClose}>
              <Text style={styles.btnTxtGrey}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnOrange, loading && { opacity: 0.6 }]}
              disabled={loading}
              onPress={handleCreate}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnTxtWhite}>Create</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '88%',
    backgroundColor: ORANGE,
    borderRadius: 6,
    padding: 14,
  },
  title: { fontWeight: '700', fontSize: 14, marginBottom: 6, color: '#fff' },
  input: {
    backgroundColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  imageBox: {
    height: 140,
    borderRadius: 6,
    backgroundColor: '#d1d1d1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btnGrey: {
    flex: 1,
    marginRight: 6,
    backgroundColor: '#ccc',
    borderRadius: 18,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnOrange: {
    flex: 1,
    marginLeft: 6,
    backgroundColor: '#f18500',
    borderRadius: 18,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnTxtGrey: { color: '#333', fontWeight: '600' },
  btnTxtWhite: { color: '#fff', fontWeight: '600' },
});
