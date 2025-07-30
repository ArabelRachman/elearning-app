import React from 'react';
import { Stack } from 'expo-router';

export default function AccountAddStack() {
  // Stack for the "acountadd" tab; children live in this folder.
  // Keep header off here since you render a custom header in the Tabs layout.
  return <Stack screenOptions={{ headerShown: false }} />;
}
