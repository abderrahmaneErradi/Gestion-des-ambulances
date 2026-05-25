import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, PrimaryButton, StatusBadge, UrgencyBadge, TitleBlock, Badge } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { missionRoutes } from '@/data/mockData';
import { colors } from '@/theme/tokens';
import { ScreenProps } from '@/navigation/types';

export function DriverHomeScreen({ navigation }: ScreenProps<'DriverHome'>) {
  const currentUser = useAppStore((state) => state.currentUser);
  const ambulances = useAppStore((state) => state.ambulances);
  const missions = useAppStore((state) => state.missions);
  const updateMissionStatus = useAppStore((state) => state.updateMissionStatus);

  const ambulance = useMemo(() => ambulances.find((entry) => entry.driverId === currentUser?.id), [ambulances, currentUser?.id]);
  const currentMission = useMemo(() => missions.find((mission) => mission.assignedAmbulanceId === ambulance?.id && mission.status !== 'termine' && mission.status !== 'annule'), [ambulance?.id, missions]);
  const route = currentMission ? missionRoutes[currentMission.id] ?? [] : [];

  const nextStatus = currentMission?.status === 'accepte' ? 'en_route' : currentMission?.status === 'en_route' ? 'arrive' : currentMission?.status === 'arrive' ? 'termine' : 'accepte';

  const driverMapRegion = ambulance
    ? { ...ambulance.location, latitudeDelta: 0.04, longitudeDelta: 0.04 }
    : { latitude: 33.5731, longitude: -7.5898, latitudeDelta: 0.04, longitudeDelta: 0.04 };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="mb-2 flex-row items-center justify-between">
          <TitleBlock title="Accueil conducteur" subtitle="Vue simplifiée avec mission courante et mise à jour de statut." />
          <Pressable onPress={() => navigation.navigate('Profile')} className="rounded-full bg-white/5 p-3">
            <Ionicons name="person-outline" size={18} color="#f1f5f9" />
          </Pressable>
        </View>

        {currentMission ? (
          <Card className="mb-4">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-[16px] font-bold text-primaryText">{currentMission.patientName}</Text>
                <Text className="mt-1 text-[12px] text-mutedText">Destination: {currentMission.destination}</Text>
                <Text className="mt-1 text-[12px] text-mutedText">Prise en charge: {currentMission.pickupAddress}</Text>
              </View>
              <UrgencyBadge urgency={currentMission.urgency} />
            </View>
            <View className="mt-3 flex-row items-center justify-between">
              <StatusBadge status={currentMission.status} />
              <Badge label={ambulance?.licensePlate ?? 'Véhicule'} tone="action" />
            </View>
            <View className="mt-4">
              <PrimaryButton label={`Passer à ${nextStatus}`} onPress={() => updateMissionStatus(currentMission.id, nextStatus, 'Statut conducteur mis à jour')} icon="navigate-outline" />
            </View>
          </Card>
        ) : (
          <Card className="mb-4">
            <Text className="text-[16px] font-bold text-primaryText">Aucune mission courante</Text>
            <Text className="mt-2 text-[13px] text-mutedText">Les missions affectées apparaîtront ici dès qu’elles seront assignées à votre ambulance.</Text>
          </Card>
        )}

        <Card className="mb-4 overflow-hidden p-0">
          <MapView style={{ width: '100%', height: 220 }} initialRegion={driverMapRegion}>
            {ambulance ? <Marker coordinate={ambulance.location}><View className="h-4 w-4 rounded-full bg-urgentRed" /></Marker> : null}
            {route.length > 1 ? <Polyline coordinates={route} strokeWidth={4} strokeColor={colors.actionBlue} /> : null}
          </MapView>
        </Card>

        <Card>
          <Text className="text-[16px] font-bold text-primaryText">Statut conducteur</Text>
          <Text className="mt-2 text-[13px] text-mutedText">Accepté → En route → Arrivé → Terminé</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
