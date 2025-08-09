// app/(studenttabs)/_layout.tsx
import React from 'react';
import { Tabs, router } from 'expo-router';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useAuth } from '@/src/contexts/AuthContext';

function BottomIcon({
  name, lib, focused,
}: {
  name: string;
  lib: 'Ionicons' | 'Feather' | 'MC' | 'AntDesign';
  focused: boolean;
}) {
  const tint = focused ? Colors.light.tint : '#b6b6b6';
  const size = 22;

  if (lib === 'Feather') return <Feather name={name as any} size={size} color={tint} />;
  if (lib === 'MC')      return <MaterialCommunityIcons name={name as any} size={size} color={tint} />;
  if (lib === 'AntDesign') return <AntDesign name={name as any} size={size} color={tint} />;
  return <Ionicons name={name as any} size={size} color={tint} />;
}

export const unstable_settings = { initialRouteName: 'home' };

export default function TabLayout() {
  const { isLoading, isAuthenticated, logout } = useAuth();
  if (isLoading || !isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/(auth)');
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* HOME TAB */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <BottomIcon name="home" lib="Ionicons" focused={focused} />
          ),
          headerShown: true,
          header: () => (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>My Courses</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity onPress={handleLogout}>
                  <Feather name="log-out" size={20} color="crimson" />
                </TouchableOpacity>
              </View>
            </View>
          ),
        }}
      />

            <Tabs.Screen
        name="profile"  // keep matching your folder name
        options={{
          tabBarIcon: ({ focused }) => (
            <BottomIcon name="person" lib="Ionicons" focused={focused} />
            // or "person-add-outline" if you prefer the outline style
          ),
          headerShown: true,
          header: () => (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Profile</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.select({ ios: 66, default: 62 }),
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.select({ ios: 52, default: 32 }),
    paddingBottom: 10,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderColor: Colors.light.tint,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'red',
  },
});
