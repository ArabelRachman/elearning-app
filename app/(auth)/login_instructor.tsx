// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';

const ORANGE      = '#F4A83D';
const LIGHT_GREY  = '#D9D9D9';
const PLACEHOLDER = '#888';

export default function LoginScreen() {
  const { loginInstructor } = useAuth();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* -------------------------------------------------------------- */
  /*  Main submit handler                                           */
  /* -------------------------------------------------------------- */
  async function handleLogin() {
    if (!email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      alert('Please enter a valid password');
      return;
    }

    try {
      setSubmitting(true);
      await loginInstructor(email, password);     // 🔑 AuthContext helper
      router.replace('/(tabs)');        // land in protected area
    } catch (err: any) {
      alert(err.message ?? 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSpacer} />

      {/* back arrow */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
        <FontAwesome5 name="arrow-left" size={20} color="#000" />
      </TouchableOpacity>

      {/* header */}
      <View style={styles.header}>
        <FontAwesome5 name="book-open" size={60} color={ORANGE} />
        <FontAwesome5
          name="lightbulb"
          size={25}
          color={ORANGE}
          style={{ position: 'absolute', top: 8 }}
        />
        <Text style={styles.headerText}>Instructor Login</Text>
      </View>

      {/* email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Input text"
        placeholderTextColor={PLACEHOLDER}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      {/* password */}
      <Text style={[styles.label, { marginTop: 24 }]}>Password</Text>
      <TextInput
        placeholder="Input text"
        placeholderTextColor={PLACEHOLDER}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* links */}
      <View style={styles.linksRow}>
        <Pressable onPress={() => {/* TODO: reset flow */}}>
          <Text style={styles.link}>Forgot Password?</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/signup')}>
          <Text style={styles.link}>Create an Account</Text>
        </Pressable>
      </View>

      {/* submit button */}
      <TouchableOpacity
        style={[styles.loginBtn, submitting && { opacity: 0.5 }]}
        disabled={submitting}
        onPress={handleLogin}
      >
        <Text style={styles.loginTxt}>
          {submitting ? 'Logging in…' : 'Log In'}
        </Text>
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
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: 16,
    padding: 6,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  headerText: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: LIGHT_GREY,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: ORANGE,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 42,
  },
  loginTxt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  topSpacer: {
    width: '100%',
    height: 90,
    backgroundColor: '#fff',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  link: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
});
