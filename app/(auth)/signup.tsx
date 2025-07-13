import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';  

const ORANGE      = '#F4A83D';
const LIGHT_GREY  = '#D9D9D9';
const PLACEHOLDER = '#888';

export default function SignUpScreen() {
  const { signup } = useAuth();      
  const [email,            setEmail]    = useState('');
  const [password,         setPassword] = useState('');
  const [confirmPassword,  setConfirm]  = useState('');
  const [role,             setRole]     = useState<'student' | 'instructor'>(
    'student'
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSignUp() {
    if (!email.includes('@')) {
      alert('Please enter a valid email'); return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters'); return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match'); return;
    }
    try {
      setSubmitting(true);
      await signup(email, password, role);               // ⬅️ NEW
      router.replace('/(tabs)');                         // land inside app
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* back arrow */}
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <FontAwesome5 name="arrow-left" size={20} color="#000" />
      </Pressable>

      {/* logo + title */}
      <View style={styles.header}>
        <FontAwesome5 name="book-open" size={60} color={ORANGE} />
        <FontAwesome5
          name="lightbulb"
          size={25}
          color={ORANGE}
          style={{ position: 'absolute', top: 8 }}
        />

        <Text style={styles.appName}>App{'\n'}Name</Text>
        <Text style={styles.create}>
          Create an <Text style={{ color: ORANGE }}>Account</Text>
        </Text>
      </View>

      {/* form */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Input text"
        placeholderTextColor={PLACEHOLDER}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={[styles.label, { marginTop: 24 }]}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Input text"
        placeholderTextColor={PLACEHOLDER}
        style={styles.input}
        secureTextEntry
      />

      <Text style={[styles.label, { marginTop: 24 }]}>Confirm Password</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirm}
        placeholder="Input text"
        placeholderTextColor={PLACEHOLDER}
        style={styles.input}
        secureTextEntry
      />

      {/* role radio buttons */}
      <View style={styles.radioRow}>
        <Pressable
          style={styles.radioWrap}
          onPress={() => setRole('student')}
        >
          <View
            style={[
              styles.radioDot,
              { backgroundColor: role === 'student' ? ORANGE : LIGHT_GREY },
            ]}
          />
          <Text style={styles.radioLabel}>Student</Text>
        </Pressable>

        <Pressable
          style={styles.radioWrap}
          onPress={() => setRole('instructor')}
        >
          <View
            style={[
              styles.radioDot,
              { backgroundColor: role === 'instructor' ? ORANGE : LIGHT_GREY },
            ]}
          />
          <Text style={styles.radioLabel}>Instructor</Text>
        </Pressable>
      </View>

      {/* sign-up button */}
      <TouchableOpacity
        style={[styles.btn, submitting && { opacity: 0.5 }]}
        disabled={submitting}
        onPress={handleSignUp}
      >
        <Text style={styles.btnTxt}>
          {submitting ? 'Creating…' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* styles                                                            */
/* ────────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  backBtn: {
    position: 'absolute',
    top: 64,
    left: 16,
    padding: 6,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginTop: 110,
    marginBottom: 40,
  },
  appName: {
    color: ORANGE,
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 30,
    textAlign: 'center',
    marginTop: 6,
  },
  create: {
    marginTop: 22,
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
  radioRow: {
    flexDirection: 'row',
    gap: 26,
    marginTop: 24,
  },
  radioWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  btn: {
    backgroundColor: ORANGE,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 40,
  },
  btnTxt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
