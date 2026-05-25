import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Screen, Card, AmbulanceBadge, Badge, PrimaryButton, SecondaryButton, TitleBlock } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/utils/format';
import { ScreenProps } from '@/navigation/types';

export function AmbulanceDetailScreen({ route }: ScreenProps<'AmbulanceDetail'>) {
  const { ambulanceId } = route.params;
  const currentUser = useAppStore((state) => state.currentUser);
  const ambulance = useAppStore((state) => state.ambulances.find((entry) => entry.id === ambulanceId));
  const driver = useAppStore((state) => state.users.find((entry) => entry.id === ambulance?.driverId));
  const missions = useAppStore((state) => state.missions.filter((mission) => mission.assignedAmbulanceId === ambulanceId));
  const updateAmbulanceStatus = useAppStore((state) => state.updateAmbulanceStatus);

  const history = useMemo(() => [...missions].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()), [missions]);

  if (!ambulance) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-primaryText">Ambulance introuvable.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <TitleBlock title={ambulance.licensePlate} subtitle="Détails du véhicule, conducteur et historique des missions." action={<AmbulanceBadge status={ambulance.status} />} />

        <Card className="mb-4">
          <Text className="text-[16px] font-bold text-primaryText">Informations véhicule</Text>
          <Text className="mt-2 text-[13px] text-mutedText">Conducteur: {driver?.name ?? 'Inconnu'}</Text>
          <Text className="mt-1 text-[13px] text-mutedText">Latitude: {ambulance.location.latitude.toFixed(5)}</Text>
          <Text className="mt-1 text-[13px] text-mutedText">Longitude: {ambulance.location.longitude.toFixed(5)}</Text>
          <Text className="mt-1 text-[13px] text-mutedText">Mission en cours: {ambulance.currentMissionId ?? 'Aucune'}</Text>
        </Card>

        <Card className="mb-4">
          <Text className="text-[16px] font-bold text-primaryText">Historique mission</Text>
          <View className="mt-3 gap-3">
            {history.length === 0 ? <Text className="text-[13px] text-mutedText">Aucune mission liée à ce véhicule.</Text> : null}
            {history.map((mission) => (
              <View key={mission.id} className="rounded-card border border-border bg-navy p-3">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-semibold text-primaryText">{mission.patientName}</Text>
                    <Text className="text-[12px] text-mutedText">{mission.destination}</Text>
                  </View>
                  <Badge label={mission.status} tone="action" />
                </View>
                <Text className="mt-2 text-[12px] text-mutedText">Créée {formatDateTime(mission.createdAt)}</Text>
              </View>
            ))}
          </View>
        </Card>

        {currentUser?.role === 'admin' ? (
          <Card className="mb-4">
            <Text className="text-[16px] font-bold text-primaryText">Changer le statut</Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {(['disponible', 'en_mission', 'retour', 'maintenance'] as const).map((status) => (
                <Pressable key={status} onPress={() => updateAmbulanceStatus(ambulance.id, status)} className="rounded-pill border border-border bg-white/5 px-3 py-2">
                  <Text className="text-[12px] font-semibold text-primaryText">{status}</Text>
                </Pressable>
              ))}
            </View>
          </Card>
        ) : (
          <Card className="mb-4">
            <Text className="text-[13px] text-mutedText">Les changements de statut sont réservés aux administrateurs.</Text>
          </Card>
        )}

        <SecondaryButton label="Retour" onPress={() => {}} />
      </ScrollView>
    </Screen>
  );
}
