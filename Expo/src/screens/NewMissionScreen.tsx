import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, PrimaryButton, SecondaryButton, TextField, TitleBlock, UrgencyBadge, Badge } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { notifyDriverAssignment, notifyUrgentMission } from '@/services/notifications';
import { urgencyMeta } from '@/theme/tokens';
import { ScreenProps } from '@/navigation/types';

const schema = z.object({
  patientName: z.string().min(2, 'Le nom du patient est requis'),
  patientPhone: z.string().optional(),
  pickupAddress: z.string().min(4, 'Adresse de prise en charge requise'),
  destination: z.string().min(4, 'Destination requise'),
  urgency: z.enum(['critique', 'modere', 'planifie']),
  assignedAmbulanceId: z.string().min(1, 'Sélectionnez une ambulance disponible'),
});

type FormValues = z.infer<typeof schema>;

export function NewMissionScreen({ navigation }: ScreenProps<'NewMission'>) {
  const availableAmbulances = useAppStore((state) => state.ambulances.filter((ambulance) => ambulance.status === 'disponible'));
  const users = useAppStore((state) => state.users);
  const createMission = useAppStore((state) => state.createMission);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientName: '',
      patientPhone: '',
      pickupAddress: '',
      destination: '',
      urgency: 'modere',
      assignedAmbulanceId: availableAmbulances[0]?.id ?? '',
    },
  });

  const selectedUrgency = watch('urgency');
  const selectedAmbulanceId = watch('assignedAmbulanceId');

  const selectedAmbulance = useMemo(
    () => availableAmbulances.find((ambulance) => ambulance.id === selectedAmbulanceId),
    [availableAmbulances, selectedAmbulanceId],
  );

  const onSubmit = handleSubmit(async (values) => {
    if (!availableAmbulances.length) {
      Alert.alert('Aucune ambulance disponible', 'Impossible de créer une mission tant qu’aucun véhicule n’est disponible.');
      return;
    }

    setSubmitting(true);
    try {
      const mission = createMission(values);
      if (values.urgency === 'critique') {
        await notifyUrgentMission(values.patientName, 'critique');
      }

      const driverName = users.find((user) => user.id === selectedAmbulance?.driverId)?.name ?? 'Conducteur';
      await notifyDriverAssignment(driverName, `la mission ${mission.id}`);

      Alert.alert('Mission créée', 'La mission a été enregistrée et assignée à une ambulance disponible.');
      reset({
        patientName: '',
        patientPhone: '',
        pickupAddress: '',
        destination: '',
        urgency: 'modere',
        assignedAmbulanceId: availableAmbulances[0]?.id ?? '',
      });
      navigation.navigate('MissionDetail', { missionId: mission.id });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <TitleBlock title="Nouvelle mission" subtitle="Le formulaire ne propose que les ambulances disponibles pour l'affectation intelligente." />

        <Card className="mb-4">
          <Controller control={control} name="patientName" render={({ field: { value, onChange } }) => <TextField label="Nom du patient" value={value} onChangeText={onChange} placeholder="Nom complet" />} />
          <Controller control={control} name="patientPhone" render={({ field: { value, onChange } }) => <TextField label="Téléphone patient" value={value ?? ''} onChangeText={onChange} placeholder="+212..." keyboardType="phone-pad" />} />
          <Controller control={control} name="pickupAddress" render={({ field: { value, onChange } }) => <TextField label="Adresse de prise en charge" value={value} onChangeText={onChange} placeholder="Adresse de départ" multiline />} />
          <Controller control={control} name="destination" render={({ field: { value, onChange } }) => <TextField label="Destination" value={value} onChangeText={onChange} placeholder="Destination finale" multiline />} />
        </Card>

        <Card className="mb-4">
          <Text className="mb-2 text-[13px] font-semibold text-primaryText">Niveau d'urgence</Text>
          <View className="flex-row gap-2">
            {Object.entries(urgencyMeta).map(([key, meta]) => {
              const active = selectedUrgency === key;
              return (
                <Pressable key={key} onPress={() => setValue('urgency', key as FormValues['urgency'])} className={`flex-1 rounded-card border px-3 py-3 ${active ? 'border-actionBlue bg-actionBlue/20' : 'border-border bg-white/5'}`}>
                  <View className="items-center gap-2">
                    <Ionicons name={meta.icon as keyof typeof Ionicons.glyphMap} size={20} color={meta.color} />
                    <Text className="text-[12px] font-semibold text-primaryText">{meta.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View className="mt-3"><UrgencyBadge urgency={selectedUrgency} /></View>
        </Card>

        <Card className="mb-4">
          <Text className="mb-2 text-[13px] font-semibold text-primaryText">Ambulance disponible</Text>
          <Pressable onPress={() => setSelectorOpen(true)} className="rounded-card border border-border bg-navy px-4 py-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-semibold text-primaryText">{selectedAmbulance?.licensePlate ?? 'Sélectionner une ambulance'}</Text>
                <Text className="text-[12px] text-mutedText">{selectedAmbulance ? `Conducteur: ${users.find((user) => user.id === selectedAmbulance.driverId)?.name ?? 'Inconnu'}` : 'Aucun véhicule disponible'}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#f1f5f9" />
            </View>
          </Pressable>
        </Card>

        <View className="gap-3">
          <PrimaryButton label="Créer la mission" icon="add-circle-outline" onPress={onSubmit} loading={submitting} />
          <SecondaryButton label="Annuler" icon="close-outline" onPress={() => navigation.goBack()} />
        </View>

        <Modal visible={selectorOpen} transparent animationType="slide" onRequestClose={() => setSelectorOpen(false)}>
          <Pressable onPress={() => setSelectorOpen(false)} className="flex-1 justify-end bg-black/50">
            <View className="rounded-t-[24px] border border-border bg-card p-4">
              <Text className="mb-3 text-[16px] font-bold text-primaryText">Ambulances disponibles</Text>
              <View className="gap-2">
                {availableAmbulances.map((ambulance) => (
                  <Pressable
                    key={ambulance.id}
                    onPress={() => {
                      setValue('assignedAmbulanceId', ambulance.id);
                      setSelectorOpen(false);
                    }}
                    className={`rounded-card border px-4 py-3 ${selectedAmbulanceId === ambulance.id ? 'border-actionBlue bg-actionBlue/15' : 'border-border bg-navy'}`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="font-semibold text-primaryText">{ambulance.licensePlate}</Text>
                        <Text className="text-[12px] text-mutedText">{users.find((user) => user.id === ambulance.driverId)?.name ?? 'Conducteur inconnu'}</Text>
                      </View>
                      <Badge label="Disponible" tone="success" />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </Pressable>
        </Modal>
      </ScrollView>
    </Screen>
  );
}
