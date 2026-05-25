import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Screen, Card, StatusBadge, UrgencyBadge, TitleBlock, Badge, SecondaryButton, PrimaryButton } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/utils/format';
import { missionStatusMeta } from '@/theme/tokens';
import { ScreenProps } from '@/navigation/types';

export function MissionDetailScreen({ route, navigation }: ScreenProps<'MissionDetail'>) {
  const { missionId } = route.params;
  const mission = useAppStore((state) => state.missions.find((item) => item.id === missionId));
  const ambulance = useAppStore((state) => state.ambulances.find((item) => item.id === mission?.assignedAmbulanceId));
  const driver = useAppStore((state) => state.users.find((item) => item.id === ambulance?.driverId));
  const missionTimeline = useAppStore((state) => state.missionTimeline[missionId] ?? []);
  const updateMissionStatus = useAppStore((state) => state.updateMissionStatus);

  const timeline = useMemo(() => [...missionTimeline].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()), [missionTimeline]);

  if (!mission) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-primaryText">Mission introuvable.</Text>
        </View>
      </Screen>
    );
  }

  const update = (status: keyof typeof missionStatusMeta) => {
    updateMissionStatus(mission.id, status, `Statut passé à ${missionStatusMeta[status].label}`);
    if (status === 'annule') {
      Alert.alert('Mission annulée');
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <TitleBlock title={mission.patientName} subtitle={`${mission.pickupAddress} vers ${mission.destination}`} action={<UrgencyBadge urgency={mission.urgency} />} />

        <Card className="mb-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-[16px] font-bold text-primaryText">Informations patient</Text>
              <Text className="mt-2 text-[13px] text-mutedText">Téléphone: {mission.patientPhone ?? 'Non renseigné'}</Text>
              <Text className="mt-1 text-[13px] text-mutedText">Créée: {formatDateTime(mission.createdAt)}</Text>
              {mission.estimatedArrival ? <Text className="mt-1 text-[13px] text-mutedText">ETA estimé: {formatDateTime(mission.estimatedArrival)}</Text> : null}
            </View>
            <StatusBadge status={mission.status} />
          </View>
        </Card>

        <Card className="mb-4">
          <Text className="text-[16px] font-bold text-primaryText">Affectation</Text>
          <Text className="mt-2 text-[13px] text-mutedText">Ambulance: {ambulance?.licensePlate ?? 'Non affectée'}</Text>
          <Text className="mt-1 text-[13px] text-mutedText">Conducteur: {driver?.name ?? 'Inconnu'}</Text>
          <View className="mt-4 flex-row flex-wrap gap-2">
            <Badge label="Accept / Complete / Cancel" tone="action" />
          </View>
        </Card>

        <Card className="mb-4">
          <Text className="text-[16px] font-bold text-primaryText">Chronologie</Text>
          <View className="mt-3 gap-3">
            {timeline.map((entry) => (
              <View key={`${entry.status}-${new Date(entry.at).getTime()}`} className="flex-row gap-3">
                <View className="mt-1 h-3 w-3 rounded-full bg-actionBlue" />
                <View className="flex-1">
                  <Text className="font-semibold text-primaryText">{missionStatusMeta[entry.status].label}</Text>
                  <Text className="text-[12px] text-mutedText">{formatDateTime(entry.at)}{entry.note ? ` · ${entry.note}` : ''}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <View className="gap-3">
          <View className="flex-row gap-3">
            <View className="flex-1"><PrimaryButton label="Accept" onPress={() => update('accepte')} icon="checkmark-circle-outline" tone="success" /></View>
            <View className="flex-1"><PrimaryButton label="Complete" onPress={() => update('termine')} icon="flag-outline" tone="action" /></View>
          </View>
          <SecondaryButton label="Cancel" onPress={() => update('annule')} icon="close-circle-outline" />
        </View>

        <Pressable onPress={() => navigation.goBack()} className="mt-4 rounded-pill border border-border bg-white/5 px-4 py-3">
          <Text className="text-center text-[12px] font-semibold text-primaryText">Retour</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
