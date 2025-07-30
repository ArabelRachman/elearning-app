// app/(auth)/index.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

const ORANGE     = '#F4A83D';
const LIGHT_GREY = '#CACACA';

export default function AuthLanding() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoRow}>
        <FontAwesome5 name="book-open" size={56} color={ORANGE} />
        <FontAwesome5
          name="lightbulb"
          size={22}
          color={ORANGE}
          style={{ position: 'absolute', top: 6 }}
        />
        <Text style={styles.appName}>App{'\n'}Name</Text>
      </View>

      <Image
        source={{
          uri: 'https://via.placeholder.com/280x180.png?text=Illustration',
        }}
        style={styles.illustration}
        resizeMode="contain"
      />

      <View style={{ alignItems: 'center', width: '100%' }}>
        <Text style={styles.tagLine}>
          Start Learning <Text style={{ color: ORANGE }}>New Skills</Text>
        </Text>
        <View style={styles.progressRow}>
          <View style={[styles.progressDot, { backgroundColor: ORANGE }]} />
          <View style={[styles.progressDot, { backgroundColor: LIGHT_GREY }]} />
          <View style={[styles.progressDot, { backgroundColor: LIGHT_GREY }]} />
        </View>
      </View>


       <Text style={styles.smallText}>
         Don’t have an account?{' '}
         <Text style={{ fontWeight: '600' }}>Sign Up</Text>
       </Text>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/login_student')}   
      >
        <Text style={styles.buttonText}>Log In as Student</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginTop: 14 }]}
        onPress={() => router.push('/login_instructor')}
      >
        <Text style={styles.buttonText}>Log In as Instructor</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logoRow: {
    marginTop: 24,
    alignItems: 'center',
  },
  appName: {
    marginTop: 8,
    color: ORANGE,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
  },
  illustration: {
    width: 280,
    height: 180,
    marginTop: 24,
  },
  tagLine: {
    marginTop: 32,
    fontSize: 22,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  progressDot: {
    width: 70,
    height: 6,
    borderRadius: 3,
  },
  smallText: {
    marginTop: 40,
    fontSize: 13,
    color: '#000',
  },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
