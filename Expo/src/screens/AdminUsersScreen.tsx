import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, PrimaryButton, SecondaryButton, TextField, TitleBlock, RoleBadge, Badge, EmptyState } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { ScreenProps } from '@/navigation/types';
import { roleMeta } from '@/theme/tokens';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  role: z.enum(['operateur', 'conducteur', 'admin']),
});

type FormValues = z.infer<typeof schema>;

export function AdminUsersScreen({}: ScreenProps<'AdminUsers'>) {
  const currentUser = useAppStore((state) => state.currentUser);
  const users = useAppStore((state) => state.users);
  const addUser = useAppStore((state) => state.addUser);
  const updateUser = useAppStore((state) => state.updateUser);
  const deleteUser = useAppStore((state) => state.deleteUser);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editableUsers = useMemo(() => users.filter((user) => user.role !== 'admin'), [users]);

  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '', role: 'operateur' },
  });

  const openForm = (user?: FormValues) => {
    if (user) {
      setEditingId(user.id ?? null);
      reset(user);
    } else {
      setEditingId(null);
      reset({ name: '', email: '', phone: '', role: 'operateur' });
    }
    setModalVisible(true);
  };

  const onSubmit = handleSubmit((values) => {
    const payload = {
      id: editingId ?? `user-${Date.now()}`,
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role,
    };

    if (editingId) {
      updateUser(payload);
    } else {
      addUser(payload);
    }

    setModalVisible(false);
  });

  if (currentUser?.role !== 'admin') {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <EmptyState title="Accès administrateur requis" subtitle="La gestion des comptes est disponible uniquement pour les administrateurs." />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <TitleBlock title="Utilisateurs" subtitle="Créer, éditer ou supprimer des opérateurs et des conducteurs." action={<PrimaryButton label="Ajouter" icon="person-add-outline" onPress={() => openForm()} /> as React.ReactElement} />

        <View className="gap-3">
          {editableUsers.map((user) => (
            <Card key={user.id}>
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[16px] font-bold text-primaryText">{user.name}</Text>
                    <RoleBadge role={user.role} />
                  </View>
                  <Text className="mt-1 text-[12px] text-mutedText">{user.email}</Text>
                  <Text className="mt-1 text-[12px] text-mutedText">{user.phone ?? 'Téléphone non renseigné'}</Text>
                </View>
                <View className="gap-2">
                  <Pressable
                    onPress={() => {
                      setEditingId(user.id);
                      reset(user);
                      setModalVisible(true);
                    }}
                    className="rounded-pill bg-actionBlue px-3 py-2"
                  >
                    <Text className="text-[12px] font-semibold text-white">Éditer</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      Alert.alert('Supprimer cet utilisateur ?', user.name, [
                        { text: 'Annuler', style: 'cancel' },
                        { text: 'Supprimer', style: 'destructive', onPress: () => deleteUser(user.id) },
                      ]);
                    }}
                    className="rounded-pill border border-urgentRed/40 bg-urgentRed/15 px-3 py-2"
                  >
                    <Text className="text-[12px] font-semibold text-urgentRed">Supprimer</Text>
                  </Pressable>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <Pressable onPress={() => setModalVisible(false)} className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-[24px] border border-border bg-card p-4">
            <Text className="mb-3 text-[18px] font-bold text-primaryText">{editingId ? 'Modifier le compte' : 'Nouvel utilisateur'}</Text>
            <Controller control={control} name="name" render={({ field: { value, onChange } }) => <TextField label="Nom" value={value} onChangeText={onChange} placeholder="Nom complet" />} />
            <Controller control={control} name="email" render={({ field: { value, onChange } }) => <TextField label="Email" value={value} onChangeText={onChange} placeholder="email@exemple.com" keyboardType="email-address" />} />
            <Controller control={control} name="phone" render={({ field: { value, onChange } }) => <TextField label="Téléphone" value={value ?? ''} onChangeText={onChange} placeholder="+212..." keyboardType="phone-pad" />} />
            <Text className="mb-2 text-[13px] font-semibold text-primaryText">Rôle</Text>
            <View className="mb-4 flex-row gap-2">
              {(['operateur', 'conducteur'] as const).map((role) => (
                <Pressable key={role} onPress={() => setValue('role', role)} className="flex-1 rounded-pill border border-border bg-white/5 px-3 py-3">
                  <Text className="text-center text-[12px] font-semibold text-primaryText">{roleMeta[role].label}</Text>
                </Pressable>
              ))}
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1"><PrimaryButton label="Enregistrer" onPress={onSubmit} icon="save-outline" /></View>
              <View className="flex-1"><SecondaryButton label="Annuler" onPress={() => setModalVisible(false)} icon="close-outline" /></View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}
