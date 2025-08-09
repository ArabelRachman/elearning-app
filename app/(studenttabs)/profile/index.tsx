import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/src/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCompletedCoursesCount } from '@/hooks/useCompletedCoursesCount';

import { db, storage } from '@/src/firebase'; // use '@/firebase' if your alias maps @ -> src
import {
  doc,
  setDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

const AVATAR_SIZE = 96;
const ORANGE = '#F4A83D';

export default function StudentProfile() {
  const { user } = useAuth() as any;
  const uid = user?.uid as string | undefined;

  const { loading, profile } = useUserProfile(uid);
  const { count: finishedCount } = useCompletedCoursesCount(uid);

  const [saving, setSaving] = useState(false);

  async function pickAndUpload() {
    // Ask permission
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access.');
      return;
    }

    // Pick
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (res.canceled || !res.assets?.length || !uid) return;

    const asset = res.assets[0];
    setSaving(true);

    try {
      // Turn local uri -> blob
      const fileResp = await fetch(asset.uri);
      const blob = await fileResp.blob();

      // Build new path and upload
      const ts = Date.now();
      const newPath = `avatars/${uid}/${ts}.jpg`;
      const newRef = ref(storage, newPath);
      await uploadBytes(newRef, blob);
      const newURL = await getDownloadURL(newRef);

      // Delete old file (if any)
      const oldPath: string | undefined = profile?.photoPath;
      if (oldPath && oldPath !== newPath) {
        try {
          await deleteObject(ref(storage, oldPath));
        } catch {
          // ignore delete failures
        }
      }

      // Update user doc
      await setDoc(
        doc(db, 'users', uid),
        { photoURL: newURL, photoPath: newPath },
        { merge: true }
      );
    } catch (e: any) {
      Alert.alert('Upload failed', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function onChangePhotoPress() {
    Alert.alert(
      'Change profile photo?',
      '',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Change', onPress: pickAndUpload },
      ],
      { cancelable: true }
    );
  }

  if (!uid) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text>Please sign in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Pressable style={styles.avatarWrap} onPress={onChangePhotoPress} disabled={saving}>
        {profile?.photoURL ? (
          <Image source={{ uri: profile.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Ionicons name="person" size={48} color="#bbb" />
          </View>
        )}
        {saving && (
          <View style={styles.overlay}>
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </Pressable>

      {/* Email */}
      <Text style={styles.email}>{profile?.email ?? user?.email ?? '—'}</Text>

      {/* Stats card */}
      <View style={styles.card}>
        <Text style={styles.statNum}>{finishedCount}</Text>
        <Text style={styles.statLabel}>Courses completed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },

  avatarWrap: {
    alignSelf: 'center',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee',
    marginTop: 24,
  },
  avatar: { width: '100%', height: '100%' },
  avatarFallback: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0006',
    alignItems: 'center',
    justifyContent: 'center',
  },

  email: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },

  card: {
    marginTop: 24,
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  statNum: { fontSize: 28, fontWeight: '800', color: ORANGE },
  statLabel: { marginTop: 4, color: '#666', fontWeight: '600' },
});
