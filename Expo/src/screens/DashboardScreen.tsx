import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Animated, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, MetricCard, PrimaryButton, SectionHeader, StatusBadge, UrgencyBadge, EmptyState, TitleBlock, Badge } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { ScreenProps } from '@/navigation/types';
import { sortMissions } from '@/utils/status';
import { formatDateTime } from '@/utils/format';

function CountUp({ value }: { value: number }) {
  const animated = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    Animated.timing(animated, {
      toValue: value,
      duration: 800,
      useNativeDriver: false,
    }).start();

    const listener = animated.addListener(({ value: current }) => setDisplay(Math.round(current)));
    return () => animated.removeListener(listener);
  }, [animated, value]);

  return <Text className="text-[28px] font-bold text-primaryText">{display}</Text>;
}

export function DashboardScreen({ navigation }: ScreenProps<'Dashboard'>) {
  const missions = useAppStore((state) => state.missions);
  const ambulances = useAppStore((state) => state.ambulances);
  const unreadAlertCount = useAppStore((state) => state.unreadAlertCount);
  const [refreshing, setRefreshing] = useState(false);

  const metrics = useMemo(() => {
    const available = ambulances.filter((item) => item.status === 'disponible').length;
    const urgent = missions.filter((item) => item.urgency === 'critique' && item.status !== 'termine' && item.status !== 'annule').length;
    const today = missions.filter((item) => new Date(item.createdAt).toDateString() === new Date().toDateString()).length;
    return { available, urgent, today };
  }, [ambulances, missions]);

  const activeMissions = useMemo(() => sortMissions(missions).filter((mission) => mission.status !== 'termine' && mission.status !== 'annule').slice(0, 5), [missions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setRefreshing(false);
  };

  return (
    <Screen>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f1f5f9" />} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <TitleBlock
          title="Tableau de bord"
          subtitle="Suivi des urgences, des véhicules disponibles et des missions actives."
          action={<Badge label={`${unreadAlertCount} alertes`} tone="urgent" />}
        />

        <View className="mb-4 flex-row gap-3">
          <View className="flex-1"><MetricCard label="Urgences" value={<CountUp value={metrics.urgent} />} icon="warning-outline" tone="urgent" helper="Missions critiques en cours" /></View>
          <View className="flex-1"><MetricCard label="Disponibles" value={<CountUp value={metrics.available} />} icon="car-sport-outline" tone="success" helper="Ambulances prêtes à partir" /></View>
        </View>
        <View className="mb-4 flex-row gap-3">
          <View className="flex-1"><MetricCard label="Missions / jour" value={<CountUp value={metrics.today} />} icon="calendar-outline" tone="action" helper="Créées aujourd'hui" /></View>
          <View className="flex-1"><MetricCard label="Taux réponse" value="94%" icon="trending-up-outline" tone="warning" helper="Basé sur le temps moyen estimé" /></View>
        </View>

        <Card className="mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[16px] font-bold text-primaryText">Missions actives</Text>
              <Text className="mt-1 text-[12px] text-mutedText">Triées automatiquement par niveau d'urgence.</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('MissionList')} className="rounded-pill bg-white/5 px-3 py-2">
              <Text className="text-[12px] font-semibold text-primaryText">Voir tout</Text>
            </Pressable>
          </View>
        </Card>

        {activeMissions.length === 0 ? (
          <EmptyState title="Aucune mission active" subtitle="Les nouvelles missions urgentes apparaîtront ici." action={<PrimaryButton label="Créer une mission" onPress={() => navigation.navigate('NewMission')} icon="add-circle-outline" />} />
        ) : (
          <View className="gap-3">
            {activeMissions.map((mission) => (
              <Pressable key={mission.id} onPress={() => navigation.navigate('MissionDetail', { missionId: mission.id })}>
                <Card>
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-[16px] font-bold text-primaryText">{mission.patientName}</Text>
                        <UrgencyBadge urgency={mission.urgency} />
                      </View>
                      <Text className="mt-1 text-[12px] text-mutedText">{mission.pickupAddress}</Text>
                      <Text className="mt-1 text-[12px] text-mutedText">Destination: {mission.destination}</Text>
                    </View>
                    <StatusBadge status={mission.status} />
                  </View>
                  <View className="mt-4 flex-row items-center justify-between">
                    <Text className="text-[12px] text-mutedText">Créée {formatDateTime(mission.createdAt)}</Text>
                    <Text className="text-[12px] font-semibold text-primaryText">Ambulance #{mission.assignedAmbulanceId.replace('amb-', '')}</Text>
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable onPress={() => navigation.navigate('NewMission')} className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full bg-urgentRed">
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </Screen>
  );
}
