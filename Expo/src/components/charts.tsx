import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { Card } from '@/components/ui';
import { colors } from '@/theme/tokens';

export function BarChart({ data }: { data: Array<{ label: string; value: number; color?: string }> }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <Card>
      <View className="h-44 flex-row items-end justify-between gap-3">
        {data.map((item) => {
          const height = Math.max(12, (item.value / max) * 120);
          const barColor = item.color ?? colors.actionBlue;
          return (
            <View key={item.label} className="flex-1 items-center">
              <View className="w-full items-center justify-end rounded-t-[12px] bg-white/5" style={{ height: 132 }}>
                <View className="w-full rounded-t-[12px]" style={{ height, backgroundColor: barColor }} />
              </View>
              <Text className="mt-2 text-[11px] text-mutedText">{item.label}</Text>
              <Text className="text-[11px] font-semibold text-primaryText">{item.value}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

export function PieChart({ data }: { data: Array<{ label: string; value: number; color: string }> }) {
  const total = Math.max(data.reduce((sum, item) => sum + item.value, 0), 1);
  const size = 140;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  return (
    <Card>
      <View className="flex-row items-center gap-4">
        <Svg width={size} height={size}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="transparent" />
          {data.map((item, index) => {
            const dash = (item.value / total) * circumference;
            const circle = (
              <Circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                rotation={-90}
                originX={size / 2}
                originY={size / 2}
              />
            );
            offset += dash;
            return circle;
          })}
          <SvgText x={size / 2} y={size / 2 - 4} fill={colors.text} fontSize="18" fontWeight="700" textAnchor="middle">
            {total}
          </SvgText>
          <SvgText x={size / 2} y={size / 2 + 16} fill={colors.muted} fontSize="10" textAnchor="middle">
            Missions
          </SvgText>
        </Svg>
        <View className="flex-1 gap-2">
          {data.map((item) => (
            <View key={item.label} className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <Text className="text-[12px] text-primaryText">{item.label}</Text>
              </View>
              <Text className="text-[12px] font-semibold text-primaryText">{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

export function LineChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const width = 320;
  const height = 120;
  const max = Math.max(...data.map((item) => item.value), 1);
  const step = data.length > 1 ? width / (data.length - 1) : width;
  const points = data.map((item, index) => `${index * step},${height - (item.value / max) * (height - 20) - 10}`).join(' ');

  return (
    <Card>
      <Svg width="100%" height={150} viewBox={`0 0 ${width} ${height + 20}`}>
        {[0, 1, 2, 3].map((tick) => (
          <Line key={tick} x1={0} x2={width} y1={10 + (tick * height) / 3} y2={10 + (tick * height) / 3} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        ))}
        <Polyline points={points} fill="none" stroke={colors.actionBlue} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
        {data.map((item, index) => {
          const x = index * step;
          const y = height - (item.value / max) * (height - 20) - 10;
          return <Circle key={item.label} cx={x} cy={y} r={4} fill={colors.urgentRed} />;
        })}
      </Svg>
      <View className="mt-1 flex-row justify-between px-1">
        {data.map((item) => <Text key={item.label} className="text-[11px] text-mutedText">{item.label}</Text>)}
      </View>
    </Card>
  );
}
