import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  ActivityIndicator, Alert, Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAllStudents } from '@/hooks/useAllStudents';
import { deleteStudent } from '@/src/lib/deleteStudent';

const ORANGE = '#F4A83D';

export default function AccountListScreen() {
  const { loading, students } = useAllStudents();
  const [query, setQuery] = useState('');
  const [deletingUid, setDeletingUid] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(s => (s.email ?? '').toLowerCase().includes(q));
  }, [students, query]);

  function confirmDelete(uid: string, email?: string) {
    Alert.alert(
      'Delete student?',
      email ? `This will remove ${email} from Firestore.` : 'This will remove this student from Firestore.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingUid(uid);
              await deleteStudent(uid); // Firestore doc delete only
              // useAllStudents will auto-refresh via onSnapshot
            } catch (e: any) {
              Alert.alert('Delete failed', e?.message ?? 'Please try again.');
            } finally {
              setDeletingUid(null);
            }
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <Feather name="search" size={16} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search email"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="search"
        />
        <Text style={styles.count}>{filtered.length}</Text>
      </View>

      {/* Body */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {query ? 'No emails match your search.' : 'No student accounts yet.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.uid}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 90 }}
          initialNumToRender={20}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => {
            const isDeleting = deletingUid === item.uid;
            return (
              <View style={styles.row}>
                <Text numberOfLines={1} style={styles.email}>
                  {item.email || '(no email)'}
                </Text>
                <Pressable
                  onPress={() => confirmDelete(item.uid, item.email)}
                  disabled={isDeleting}
                  accessibilityLabel="Delete student"
                  style={({ pressed }) => [
                    styles.trashBtn,
                    isDeleting && { opacity: 0.5 },
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Feather name="trash-2" size={18} color="crimson" />
                  )}
                </Pressable>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10,
  },
  input: { flex: 1, fontSize: 14, color: '#222' },
  count: {
    marginLeft: 8, fontSize: 12, color: ORANGE, fontWeight: '700',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
    backgroundColor: '#FFF6EA',
  },
  row: {
    minHeight: 44, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 8,
  },
  email: { fontSize: 14, color: '#333', flexShrink: 1, paddingRight: 12 },
  trashBtn: {
    height: 32, width: 32, alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, borderWidth: 1, borderColor: '#f1d6d6', backgroundColor: '#fff',
  },
  sep: { height: 1, backgroundColor: '#f0f0f0' },
  empty: { marginTop: 32, alignItems: 'center' },
  emptyText: { color: '#888' },
});
