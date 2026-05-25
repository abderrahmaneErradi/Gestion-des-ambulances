import React from 'react';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { useAppStore } from '@/store/useAppStore';
import { AuthStack } from './AuthStack';
import { AdminTabs, DriverTabs, OperatorTabs } from './roleTabs';
import { Screen } from '@/components/ui';
import { ActivityIndicator, Text, View } from 'react-native';

const navTheme: Theme = {
  dark: true,
  colors: {
    primary: '#3b82f6',
    background: '#0d1526',
    card: '#111d35',
    text: '#f1f5f9',
    border: '#1e2d4a',
    notification: '#ef4444',
  },
};

function LoadingGate() {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-primaryText">Chargement de l'application...</Text>
      </View>
    </Screen>
  );
}

export function RootNavigator() {
  const currentUser = useAppStore((state) => state.currentUser);
  const hasHydrated = useAppStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <LoadingGate />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      {!currentUser ? <AuthStack /> : currentUser.role === 'admin' ? <AdminTabs /> : currentUser.role === 'operateur' ? <OperatorTabs /> : <DriverTabs />}
    </NavigationContainer>
  );
}
