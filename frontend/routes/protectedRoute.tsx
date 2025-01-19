import React, { ReactNode, useEffect } from 'react';
import { Linking, ActivityIndicator } from 'react-native';
import { YStack } from 'tamagui';
import { useAuth } from '../hooks/useAuth'; // Adjust the import path as needed

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      Linking.openURL('/login');
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <YStack justifyContent="center" alignItems="center" flex={1}>
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;