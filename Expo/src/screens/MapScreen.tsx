import React, { useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Badge, FloatingActionButton, TitleBlock, AmbulanceBadge, StatusBadge, UrgencyBadge } from '@/components/ui';
import { useLiveFleet } from '@/hooks/useLiveFleet';
import { useAppStore } from '@/store/useAppStore';
import { missionRoutes } from '@/data/mockData';
import { colors } from '@/theme/tokens';
import { ScreenProps } from '@/navigation/types';

function PulseMarker({ color }: { color: string }) {
  const pulse = React.useRef(new Animated.Value(0.7)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.7, duration: 800, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View className="items-center justify-center">
      <Animated.View style={{ transform: [{ scale: pulse }] }} className="absolute h-9 w-9 rounded-full" />
      <View className="h-4 w-4 rounded-full border-2 border-white" style={{ backgroundColor: color }} />
    </View>
  );
}

export function MapScreen({ navigation }: ScreenProps<'Map'>) {
  const { trackingEnabled, lastSyncAt } = useLiveFleet();
  const ambulances = useAppStore((state) => state.ambulances);
  const missions = useAppStore((state) => state.missions);
  const [selectedMissionId, setSelectedMissionId] = useState<string>(missions[0]?.id ?? '');

  const selectedMission = missions.find((mission) => mission.id === selectedMissionId) ?? missions[0];
  const selectedAmbulance = ambulances.find((ambulance) => ambulance.id === selectedMission?.assignedAmbulanceId);
  const route = selectedMission ? missionRoutes[selectedMission.id] ?? [] : [];

  const initialRegion = useMemo(() => {
    const base = ambulances[0]?.location ?? { latitude: 33.5731, longitude: -7.5898 };
    return { ...base, latitudeDelta: 0.06, longitudeDelta: 0.06 };
  }, [ambulances]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <TitleBlock
          title="Carte live"
          subtitle={trackingEnabled ? 'Suivi GPS actif avec mise à jour automatique.' : 'Suivi de repli via polling local en attente de permission GPS.'}
          action={<Badge label={lastSyncAt ? `Sync ${lastSyncAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : 'En attente'} tone={trackingEnabled ? 'success' : 'warning'} />}
        />

        <Card className="mb-4 overflow-hidden p-0">
          <MapView style={{ height: 320, width: '100%' }} initialRegion={initialRegion}>
            {ambulances.map((ambulance) => (
              <Marker key={ambulance.id} coordinate={ambulance.location} onPress={() => setSelectedMissionId(ambulance.currentMissionId ?? selectedMissionId)}>
                <PulseMarker color={ambulance.status === 'disponible' ? colors.availableGreen : ambulance.status === 'maintenance' ? colors.muted : ambulance.status === 'retour' ? colors.amber : colors.urgentRed} />
              </Marker>
            ))}
            {route.length > 1 ? <Polyline coordinates={route} strokeWidth={4} strokeColor={selectedMission?.urgency === 'critique' ? colors.urgentRed : colors.actionBlue} /> : null}
          </MapView>
        </Card>

        <View className="mb-3 flex-row flex-wrap gap-2">
          {missions.slice(0, 4).map((mission) => (
            <Pressable key={mission.id} onPress={() => setSelectedMissionId(mission.id)} className={`rounded-pill border px-3 py-2 ${mission.id === selectedMissionId ? 'border-actionBlue bg-actionBlue' : 'border-border bg-white/5'}`}>
              <Text className={`text-[12px] font-semibold ${mission.id === selectedMissionId ? 'text-white' : 'text-primaryText'}`}>{mission.patientName}</Text>
            </Pressable>
          ))}
        </View>

        {selectedMission ? (
          <Card>
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-[17px] font-bold text-primaryText">{selectedMission.patientName}</Text>
                  <UrgencyBadge urgency={selectedMission.urgency} />
                </View>
                <Text className="mt-1 text-[12px] text-mutedText">{selectedMission.pickupAddress}</Text>
                <Text className="mt-1 text-[12px] text-mutedText">Destination: {selectedMission.destination}</Text>
                {selectedAmbulance ? <Text className="mt-2 text-[12px] text-primaryText">Ambulance {selectedAmbulance.licensePlate}</Text> : null}
              </View>
              <StatusBadge status={selectedMission.status} />
            </View>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <AmbulanceBadge status={selectedAmbulance?.status ?? 'disponible'} />
              </View>
              <Pressable onPress={() => navigation.navigate('MissionDetail', { missionId: selectedMission.id })} className="flex-1 rounded-pill bg-actionBlue px-4 py-3">
                <Text className="text-center text-[12px] font-semibold text-white">Ouvrir la mission</Text>
              </Pressable>
            </View>
          </Card>
        ) : null}
      </ScrollView>
      <FloatingActionButton onPress={() => navigation.navigate('NewMission')} />
    </Screen>
  );
}
