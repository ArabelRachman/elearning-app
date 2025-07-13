import React from 'react';
import { Tabs, router } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/src/contexts/AuthContext';

function BottomIcon({
  name,
  lib,
  focused,
}: {
  name: string;
  lib: 'Ionicons' | 'Feather' | 'MC';
  focused: boolean;
}) {
  const tint = focused ? Colors.light.tint : '#b6b6b6';
  const size = 22;

  if (lib === 'Feather')
    return <Feather name={name as any} size={size} color={tint} />;
  if (lib === 'MC')
    return (
      <MaterialCommunityIcons name={name as any} size={size} color={tint} />
    );
  return <Ionicons name={name as any} size={size} color={tint} />;
}

export default function TabLayout() {
  const { isLoading, isAuthenticated, logout } = useAuth();
  const scheme = useColorScheme();

  if (isLoading) return null;
  if (!isAuthenticated) return null; // guard

  const handleLogout = async () => {
    await logout();
    router.push('/(auth)'); // back to auth landing
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <BottomIcon name="home" lib="Ionicons" focused={focused} />
          ),

          /* Custom header for this tab */
          headerShown: true,
          header: () => (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Manage Courses</Text>

              <View style={styles.headerIcons}>
                {/* notifications */}
                <TouchableOpacity style={{ marginRight: 12 }}>
                  <Feather name="bell" size={20} color={Colors.light.tint} />
                  <View style={styles.badge} />
                </TouchableOpacity>

                {/* logout */}
                <TouchableOpacity onPress={handleLogout}>
                  <Feather name="log-out" size={20} color="crimson" />
                </TouchableOpacity>
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="cloud"
        options={{
          href: null, // inactive for now
          tabBarIcon: ({ focused }) => (
            <BottomIcon name="cloud" lib="Feather" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          href: null,
          tabBarIcon: ({ focused }) => (
            <BottomIcon name="refresh-circle" lib="Ionicons" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          tabBarIcon: ({ focused }) => (
            <BottomIcon
              name="account-circle-outline"
              lib="MC"
              focused={focused}
            />
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
