import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { YStack } from 'tamagui'; 
import { ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth'; // Adjust the import path as needed

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);


  if (loading) {
    return (
      <YStack justifyContent="center" alignItems="center" flex={1}>
        <ActivityIndicator />
      </YStack>
    );
  }
  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;