import React from 'react';
import {
  View, StyleSheet, ActivityIndicator, Text,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';

/* helper: extract lowercase file-extension */
function getExt(url: string) {
  try {
    const clean = new URL(url).pathname.toLowerCase();      // strip “…?alt=…”
    return clean.slice(clean.lastIndexOf('.') + 1);         // “mp4” | ”pdf” …
  } catch { return ''; }
}

export default function FileViewer({ uri }: { uri: string }) {
  const ext = getExt(uri);

  if (ext === 'mp4') {
    return (
      <Video
        source={{ uri }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        style={styles.video}          /* 16 : 9, fits nicely on phones */
      />
    );
  }

  if (ext === 'pdf' || ext === 'epub') {
    return (
      <WebView
        style={styles.doc}            /* flex-fill, scrollable */
        source={{
          uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(uri)}`,
        }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator style={styles.doc} />}
      />
    );
  }

  console.log('FileViewer – unhandled URI →', uri);
  return (
    <View style={[styles.doc, styles.fallback]}>
      <Feather name="alert-circle" size={26} color="#555" />
      <Text style={{ fontSize:12, color:'#555', marginTop:4 }}>
        Can’t preview
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  video: { width:'100%', aspectRatio:16/9, borderRadius:8, marginTop:10 },

  doc:   { flex:1, width:'100%', borderRadius:8, marginTop:10 },

  fallback:{ alignItems:'center', justifyContent:'center' },
});
