// app/(tabs)/accountlist/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function AccountListStack() {
  // Keep headers off here since your Tabs layout renders a custom header.
  return <Stack screenOptions={{ headerShown: false }} />;
}
