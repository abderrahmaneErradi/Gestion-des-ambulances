import React, { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, AmbulanceBadge, Badge, FloatingActionButton, TitleBlock, EmptyState } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { ScreenProps } from '@/navigation/types';
import { formatShortDate } from '@/utils/format';

export function FleetScreen({ navigation }: ScreenProps<'Fleet'>) {
  const ambulances = useAppStore((state) => state.ambulances);
  const users = useAppStore((state) => state.users);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 550));
    setRefreshing(false);
  };

  return (
    <Screen>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <TitleBlock title="Flotte" subtitle="Surveillance des véhicules, du statut et des coordonnées GPS." />

        {ambulances.length === 0 ? (
          <EmptyState title="Aucune ambulance" subtitle="Les véhicules apparaîtront ici une fois chargés depuis les fixtures." />
        ) : (
          <View className="gap-3">
            {ambulances.map((ambulance) => {
              const expanded = expandedId === ambulance.id;
              const driver = users.find((user) => user.id === ambulance.driverId);
              return (
                <Pressable key={ambulance.id} onPress={() => setExpandedId(expanded ? null : ambulance.id)}>
                  <Card>
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-[16px] font-bold text-primaryText">{ambulance.licensePlate}</Text>
                          <AmbulanceBadge status={ambulance.status} />
                        </View>
                        <Text className="mt-1 text-[12px] text-mutedText">Conducteur: {driver?.name ?? 'Inconnu'}</Text>
                        <Text className="mt-1 text-[12px] text-mutedText">Mission: {ambulance.currentMissionId ?? 'Aucune'}</Text>
                      </View>
                      <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#f1f5f9" />
                    </View>

                    {expanded ? (
                      <View className="mt-4 gap-2 border-t border-border pt-4">
                        <Text className="text-[12px] text-mutedText">Latitude: {ambulance.location.latitude.toFixed(5)}</Text>
                        <Text className="text-[12px] text-mutedText">Longitude: {ambulance.location.longitude.toFixed(5)}</Text>
                        <Text className="text-[12px] text-mutedText">Dernière activité: {formatShortDate(new Date())}</Text>
                        <View className="flex-row gap-2">
                          <Badge label="GPS actif" tone="action" />
                          <Badge label="Mise à jour live" tone="success" />
                        </View>
                        <Pressable onPress={() => navigation.navigate('AmbulanceDetail', { ambulanceId: ambulance.id })} className="rounded-pill bg-actionBlue px-4 py-3">
                          <Text className="text-center text-[12px] font-semibold text-white">Voir le détail</Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => navigation.navigate('NewMission')} />
    </Screen>
  );
}
