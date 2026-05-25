import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { MissionListScreen } from '@/screens/MissionListScreen';
import { MissionDetailScreen } from '@/screens/MissionDetailScreen';
import { NewMissionScreen } from '@/screens/NewMissionScreen';
import { MapScreen } from '@/screens/MapScreen';
import { FleetScreen } from '@/screens/FleetScreen';
import { AmbulanceDetailScreen } from '@/screens/AmbulanceDetailScreen';
import { StatsScreen } from '@/screens/StatsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { AdminUsersScreen } from '@/screens/AdminUsersScreen';
import { DriverHomeScreen } from '@/screens/DriverHomeScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const stackOptions = {
  headerStyle: { backgroundColor: '#0d1526' },
  headerTintColor: '#f1f5f9',
  contentStyle: { backgroundColor: '#0d1526' },
};

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Accueil' }} />
      <Stack.Screen name="MissionList" component={MissionListScreen} options={{ title: 'Missions' }} />
      <Stack.Screen name="MissionDetail" component={MissionDetailScreen} options={{ title: 'Détail mission' }} />
      <Stack.Screen name="NewMission" component={NewMissionScreen} options={{ title: 'Nouvelle mission' }} />
    </Stack.Navigator>
  );
}

export function MapStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Carte' }} />
      <Stack.Screen name="MissionDetail" component={MissionDetailScreen} options={{ title: 'Détail mission' }} />
      <Stack.Screen name="NewMission" component={NewMissionScreen} options={{ title: 'Nouvelle mission' }} />
    </Stack.Navigator>
  );
}

export function FleetStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Fleet" component={FleetScreen} options={{ title: 'Flotte' }} />
      <Stack.Screen name="AmbulanceDetail" component={AmbulanceDetailScreen} options={{ title: 'Ambulance' }} />
      <Stack.Screen name="NewMission" component={NewMissionScreen} options={{ title: 'Nouvelle mission' }} />
    </Stack.Navigator>
  );
}

export function StatsStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Stats" component={StatsScreen} options={{ title: 'Statistiques' }} />
    </Stack.Navigator>
  );
}

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Utilisateurs' }} />
    </Stack.Navigator>
  );
}

export function DriverHomeStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="DriverHome" component={DriverHomeScreen} options={{ title: 'Accueil conducteur' }} />
      <Stack.Screen name="MissionDetail" component={MissionDetailScreen} options={{ title: 'Détail mission' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Stack.Navigator>
  );
}
