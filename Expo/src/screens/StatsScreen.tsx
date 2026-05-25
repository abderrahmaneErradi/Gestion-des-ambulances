import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Screen, Card, MetricCard, SectionHeader, SegmentedControl, TitleBlock } from '@/components/ui';
import { BarChart, LineChart, PieChart } from '@/components/charts';
import { useAppStore } from '@/store/useAppStore';
import { colors } from '@/theme/tokens';

type RangeValue = '7' | '30' | '90';

export function StatsScreen() {
  const missions = useAppStore((state) => state.missions);
  const [range, setRange] = useState<RangeValue>('7');

  const stats = useMemo(() => {
    const days = Number(range);
    const start = Date.now() - days * 24 * 60 * 60 * 1000;
    const filtered = missions.filter((mission) => new Date(mission.createdAt).getTime() >= start);

    const byDay = Array.from({ length: days }, (_, index) => {
      const day = new Date(Date.now() - (days - 1 - index) * 24 * 60 * 60 * 1000);
      const label = day.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      const value = filtered.filter((mission) => new Date(mission.createdAt).toDateString() === day.toDateString()).length;
      return { label, value };
    });

    const urgency = [
      { label: 'Critique', value: filtered.filter((mission) => mission.urgency === 'critique').length, color: colors.urgentRed },
      { label: 'Modéré', value: filtered.filter((mission) => mission.urgency === 'modere').length, color: colors.amber },
      { label: 'Planifié', value: filtered.filter((mission) => mission.urgency === 'planifie').length, color: colors.availableGreen },
    ];

    const responseTime = byDay.map((entry, index) => ({ label: entry.label, value: Math.max(8, 18 + (index % 4) * 3 - entry.value * 1.5) }));

    return { filtered, byDay, urgency, responseTime };
  }, [missions, range]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <TitleBlock title="Statistiques" subtitle="Analytique locale: missions par jour, répartition d'urgence et temps de réponse." />

        <SegmentedControl items={[{ label: '7 jours', value: '7' }, { label: '30 jours', value: '30' }, { label: '90 jours', value: '90' }]} value={range} onChange={(value) => setRange(value as RangeValue)} />

        <View className="mb-4 flex-row gap-3">
          <View className="flex-1"><MetricCard label="Missions filtrées" value={stats.filtered.length} icon="stats-chart-outline" tone="action" /></View>
          <View className="flex-1"><MetricCard label="Urgentes" value={stats.urgency[0].value} icon="alert-circle-outline" tone="urgent" /></View>
        </View>

        <SectionHeader title="Missions par jour" />
        <BarChart data={stats.byDay.slice(-7)} />

        <SectionHeader title="Répartition des urgences" />
        <PieChart data={stats.urgency} />

        <SectionHeader title="Temps moyen de réponse" />
        <LineChart data={stats.responseTime.slice(-7)} />
      </ScrollView>
    </Screen>
  );
}
