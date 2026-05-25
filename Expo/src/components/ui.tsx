import React from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, missionStatusMeta, radii, roleMeta, urgencyMeta, ambulanceStatusMeta } from '@/theme/tokens';

type CardProps = React.PropsWithChildren<{ className?: string }>; 

export function Screen({ children }: React.PropsWithChildren) {
  return <View className="flex-1 bg-navy">{children}</View>;
}

export function Card({ children, className = '' }: CardProps) {
  return <View className={`rounded-card border border-border bg-card p-4 ${className}`}>{children}</View>;
}

type PillTone = 'urgent' | 'action' | 'success' | 'warning' | 'muted';

const pillStyles: Record<PillTone, string> = {
  urgent: 'bg-urgentRed/15 text-urgentRed border-urgentRed/30',
  action: 'bg-actionBlue/15 text-actionBlue border-actionBlue/30',
  success: 'bg-availableGreen/15 text-availableGreen border-availableGreen/30',
  warning: 'bg-amber/15 text-amber border-amber/30',
  muted: 'bg-white/5 text-mutedText border-border',
};

export function Badge({ label, tone = 'muted', className = '' }: { label: string; tone?: PillTone; className?: string }) {
  return <View className={`self-start rounded-pill border px-3 py-1 ${pillStyles[tone]} ${className}`}><Text className="text-[12px] font-semibold">{label}</Text></View>;
}

export function RoleBadge({ role }: { role: keyof typeof roleMeta }) {
  const meta = roleMeta[role];
  return <View className="self-start rounded-pill border border-border bg-white/5 px-3 py-1"><Text style={{ color: meta.color }} className="text-[12px] font-semibold">{meta.label}</Text></View>;
}

export function StatusBadge({ status }: { status: keyof typeof missionStatusMeta }) {
  const meta = missionStatusMeta[status];
  return <View className="self-start rounded-pill border px-3 py-1" style={{ borderColor: `${meta.color}40`, backgroundColor: `${meta.color}18` }}><Text style={{ color: meta.color }} className="text-[12px] font-semibold">{meta.label}</Text></View>;
}

export function AmbulanceBadge({ status }: { status: keyof typeof ambulanceStatusMeta }) {
  const meta = ambulanceStatusMeta[status];
  return <View className="self-start rounded-pill border px-3 py-1" style={{ borderColor: `${meta.color}40`, backgroundColor: `${meta.color}18` }}><Text style={{ color: meta.color }} className="text-[12px] font-semibold">{meta.label}</Text></View>;
}

export function UrgencyBadge({ urgency }: { urgency: keyof typeof urgencyMeta }) {
  const meta = urgencyMeta[urgency];
  return <View className="self-start rounded-pill border px-3 py-1" style={{ borderColor: `${meta.color}40`, backgroundColor: `${meta.color}18` }}><Text style={{ color: meta.color }} className="text-[12px] font-semibold">{meta.label}</Text></View>;
}

export function TitleBlock({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <View className="mb-4 flex-row items-start justify-between gap-3">
      <View className="flex-1">
        <Text className="text-[26px] font-bold text-primaryText">{title}</Text>
        {subtitle ? <Text className="mt-1 text-[13px] leading-5 text-mutedText">{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function MetricCard({ label, value, icon, tone = 'action', helper }: { label: string; value: React.ReactNode; icon: keyof typeof Ionicons.glyphMap; tone?: PillTone; helper?: string }) {
  const color = tone === 'urgent' ? colors.urgentRed : tone === 'success' ? colors.availableGreen : tone === 'warning' ? colors.amber : colors.actionBlue;
  return (
    <Card className="flex-1">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-[12px] uppercase tracking-[1px] text-mutedText">{label}</Text>
          <Text className="mt-2 text-[28px] font-bold text-primaryText">{value}</Text>
          {helper ? <Text className="mt-1 text-[12px] text-mutedText">{helper}</Text> : null}
        </View>
        <View className="rounded-full p-3" style={{ backgroundColor: `${color}1f` }}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
      </View>
    </Card>
  );
}

export function PrimaryButton({ label, onPress, icon, loading = false, disabled = false, tone = 'action' }: { label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; loading?: boolean; disabled?: boolean; tone?: 'action' | 'urgent' | 'success' }) {
  const backgroundColor = tone === 'urgent' ? colors.urgentRed : tone === 'success' ? colors.availableGreen : colors.actionBlue;
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [{ opacity: pressed || disabled ? 0.85 : 1, backgroundColor }] } className="flex-row items-center justify-center rounded-pill px-4 py-3">
      {loading ? <ActivityIndicator color="#fff" /> : icon ? <Ionicons name={icon} size={16} color="#fff" /> : null}
      <Text className="ml-2 font-semibold text-white">{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center justify-center rounded-pill border border-border bg-white/5 px-4 py-3">
      {icon ? <Ionicons name={icon} size={16} color={colors.text} /> : null}
      <Text className="ml-2 font-semibold text-primaryText">{label}</Text>
    </Pressable>
  );
}

export function TextField({ label, value, onChangeText, placeholder, keyboardType = 'default', secureTextEntry = false, multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType']; secureTextEntry?: boolean; multiline?: boolean; }) {
  return (
    <View className="mb-3">
      <Text className="mb-2 text-[13px] font-semibold text-primaryText">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        className={`rounded-card border border-border bg-navy px-4 py-3 text-primaryText ${multiline ? 'min-h-[92px]' : ''}`}
      />
    </View>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="text-[18px] font-bold text-primaryText">{title}</Text>
      {action}
    </View>
  );
}

export function EmptyState({ title, subtitle, icon = 'information-circle-outline', action }: { title: string; subtitle?: string; icon?: keyof typeof Ionicons.glyphMap; action?: React.ReactNode }) {
  return (
    <Card className="items-center py-8">
      <View className="mb-4 rounded-full bg-actionBlue/15 p-4">
        <Ionicons name={icon} size={26} color={colors.actionBlue} />
      </View>
      <Text className="text-center text-[18px] font-bold text-primaryText">{title}</Text>
      {subtitle ? <Text className="mt-2 text-center text-[13px] leading-5 text-mutedText">{subtitle}</Text> : null}
      {action ? <View className="mt-4">{action}</View> : null}
    </Card>
  );
}

export function FloatingActionButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full bg-urgentRed shadow-lg shadow-black/40">
      <Ionicons name="add" size={28} color="#fff" />
    </Pressable>
  );
}

export function SegmentedControl({ items, value, onChange }: { items: Array<{ label: string; value: string }>; value: string; onChange: (value: string) => void }) {
  return (
    <View className="mb-4 flex-row rounded-pill border border-border bg-white/5 p-1">
      {items.map((item) => {
        const active = value === item.value;
        return (
          <Pressable key={item.value} onPress={() => onChange(item.value)} className={`flex-1 rounded-pill px-3 py-2 ${active ? 'bg-actionBlue' : 'bg-transparent'}`}>
            <Text className={`text-center text-[12px] font-semibold ${active ? 'text-white' : 'text-mutedText'}`}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
