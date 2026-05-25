import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DriverHomeStack, FleetStack, HomeStack, MapStack, ProfileStack, StatsStack } from './sharedStacks';
import { colors } from '@/theme/tokens';

const Tab = createBottomTabNavigator();

function screenOptions(iconName: keyof typeof Ionicons.glyphMap) {
  return {
    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name={iconName} color={color} size={size} />,
    headerShown: false,
    tabBarActiveTintColor: colors.actionBlue,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: { backgroundColor: colors.navy, borderTopColor: colors.border },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' as const },
  };
}

export function AdminTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Accueil" component={HomeStack} options={screenOptions('home')} />
      <Tab.Screen name="Carte" component={MapStack} options={screenOptions('map')} />
      <Tab.Screen name="Flotte" component={FleetStack} options={screenOptions('car-sport')} />
      <Tab.Screen name="Statistiques" component={StatsStack} options={screenOptions('stats-chart')} />
      <Tab.Screen name="Profil" component={ProfileStack} options={screenOptions('person')} />
    </Tab.Navigator>
  );
}

export function OperatorTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Accueil" component={HomeStack} options={screenOptions('home')} />
      <Tab.Screen name="Carte" component={MapStack} options={screenOptions('map')} />
      <Tab.Screen name="Flotte" component={FleetStack} options={screenOptions('car-sport')} />
      <Tab.Screen name="Statistiques" component={StatsStack} options={screenOptions('stats-chart')} />
      <Tab.Screen name="Profil" component={ProfileStack} options={screenOptions('person')} />
    </Tab.Navigator>
  );
}

export function DriverTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Accueil" component={DriverHomeStack} options={screenOptions('home')} />
      <Tab.Screen name="Carte" component={MapStack} options={screenOptions('map')} />
    </Tab.Navigator>
  );
}
