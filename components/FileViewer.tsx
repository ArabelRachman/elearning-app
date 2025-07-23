import React from 'react';
import {
  View, StyleSheet, ActivityIndicator, Text,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';

type Props = { uri?: string };

/* Extract a lowercase file‑extension, e.g. “mp4 | pdf”. */
function getExt(url?: string): string {
  if (!url) return '';
  try {
    const clean = new URL(url).pathname.toLowerCase();   // strips “…?alt=…”
    return clean.slice(clean.lastIndexOf('.') + 1);
  } catch {
    return '';
  }
}

export default function FileViewer({ uri }: Props) {
  /* Early exit for missing files */
  if (!uri) {
    return (
      <View style={[styles.doc, styles.fallback]}>
        <Feather name="alert-circle" size={26} color="#555" />
        <Text style={styles.msg}>No file attached to this lesson.</Text>
      </View>
    );
  }

  const ext = getExt(uri);

  if (ext === 'mp4') {
    return (
      <Video
        source={{ uri }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        style={styles.video}
      />
    );
  }

  if (ext === 'pdf' || ext === 'epub') {
    return (
      <WebView
        style={styles.doc}
        source={{
          uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(uri)}`,
        }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator style={styles.doc} />}
      />
    );
  }

  /* Fallback for unknown formats */
  return (
    <View style={[styles.doc, styles.fallback]}>
      <Feather name="alert-circle" size={26} color="#555" />
      <Text style={styles.msg}>Can’t preview this file type.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  video:    { width: '100%', aspectRatio: 16 / 9, borderRadius: 8, marginTop: 10 },
  doc:      { flex: 1, width: '100%', borderRadius: 8, marginTop: 10 },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  msg:      { fontSize: 12, color: '#555', marginTop: 4 },
});
