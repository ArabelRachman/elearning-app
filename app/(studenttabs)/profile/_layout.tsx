import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileStack() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      {/* Use the Tabs header for the root profile screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
