// app/layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import ProtectedRoute from '../routes/protectedRoute';

export default function AppLayout() {
  return (
    <ProtectedRoute>
      <Slot />
    </ProtectedRoute>
  );
}
