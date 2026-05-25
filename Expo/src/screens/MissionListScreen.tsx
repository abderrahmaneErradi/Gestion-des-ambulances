import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { Screen, Card, StatusBadge, UrgencyBadge, TitleBlock, SegmentedControl, EmptyState } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { sortMissions, urgencyRank } from '@/utils/status';
import { ScreenProps } from '@/navigation/types';

type FilterValue = 'all' | 'critique' | 'modere' | 'planifie';

export function MissionListScreen({ navigation }: ScreenProps<'MissionList'>) {
  const missions = useAppStore((state) => state.missions);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    return sortMissions(missions)
      .filter((mission) => (filter === 'all' ? true : mission.urgency === filter))
      .filter((mission) => {
        if (!normalizedSearch) return true;
        return [mission.patientName, mission.pickupAddress, mission.destination, mission.status].some((value) => value.toLowerCase().includes(normalizedSearch));
      });
  }, [filter, missions, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setRefreshing(false);
  };

  return (
    <Screen>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <TitleBlock title="Missions" subtitle="Recherche, filtrage et priorisation par niveau d'urgence." />

        <View className="mb-3 rounded-card border border-border bg-card px-4 py-3">
          <TextInput value={search} onChangeText={setSearch} placeholder="Rechercher une mission..." placeholderTextColor="#64748b" className="text-primaryText" />
        </View>

        <SegmentedControl
          items={[
            { label: 'Toutes', value: 'all' },
            { label: 'Critique', value: 'critique' },
            { label: 'Modéré', value: 'modere' },
            { label: 'Planifié', value: 'planifie' },
          ]}
          value={filter}
          onChange={(value) => setFilter(value as FilterValue)}
        />

        {filtered.length === 0 ? (
          <EmptyState title="Aucune mission trouvée" subtitle="Essayez un autre filtre ou une autre recherche." />
        ) : (
          <View className="gap-3">
            {filtered.map((mission) => (
              <Pressable key={mission.id} onPress={() => navigation.navigate('MissionDetail', { missionId: mission.id })}>
                <Card>
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-[16px] font-bold text-primaryText">{mission.patientName}</Text>
                        <UrgencyBadge urgency={mission.urgency} />
                      </View>
                      <Text className="mt-1 text-[12px] text-mutedText">{mission.pickupAddress}</Text>
                      <Text className="mt-1 text-[12px] text-mutedText">Vers {mission.destination}</Text>
                    </View>
                    <StatusBadge status={mission.status} />
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
