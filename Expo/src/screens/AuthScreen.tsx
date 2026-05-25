import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, PrimaryButton, SecondaryButton, TextField, Badge, TitleBlock, RoleBadge } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { colors, roleMeta } from '@/theme/tokens';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  role: z.enum(['admin', 'operateur', 'conducteur']),
});

type FormValues = z.infer<typeof schema>;

const demoAccounts = [
  { email: 'admin@ambulance.app', role: 'admin' as const },
  { email: 'operator@ambulance.app', role: 'operateur' as const },
  { email: 'driver@ambulance.app', role: 'conducteur' as const },
];

export function AuthScreen() {
  const login = useAppStore((state) => state.login);
  const currentUser = useAppStore((state) => state.currentUser);
  const [selectedRole, setSelectedRole] = useState<FormValues['role']>('operateur');

  const { control, handleSubmit, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'operator@ambulance.app', password: 'demo', role: 'operateur' },
  });

  useEffect(() => {
    setValue('role', selectedRole);
  }, [selectedRole, setValue]);

  useEffect(() => {
    if (currentUser) {
      // Root navigator handles the redirect once state changes.
    }
  }, [currentUser]);

  const onSubmit = handleSubmit((values) => {
    const result = login(values.email, values.password, values.role);
    if (!result.ok) {
      Alert.alert('Connexion refusée', result.message);
      return;
    }

    if (values.email === 'driver@ambulance.app' && values.role !== 'conducteur') {
      Alert.alert('Rôle attendu', 'Le conducteur doit se connecter avec le rôle Conducteur.');
    }
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <View className="mb-5">
          <Text className="text-[30px] font-bold text-primaryText">AmbulanceApp</Text>
          <Text className="mt-2 text-[14px] leading-6 text-mutedText">
            Gestion intelligente de flotte, missions urgentes et suivi en temps réel pour opérateurs, administrateurs et conducteurs.
          </Text>
        </View>

        <Card className="mb-4">
          <TitleBlock title="Connexion" subtitle="Choisissez un rôle, puis connectez-vous avec un compte de démonstration." />

          <Controller control={control} name="email" render={({ field: { value, onChange } }) => <TextField label="Adresse email" value={value} onChangeText={onChange} placeholder="operator@ambulance.app" keyboardType="email-address" />} />
          <Controller control={control} name="password" render={({ field: { value, onChange } }) => <TextField label="Mot de passe" value={value} onChangeText={onChange} placeholder="••••••••" secureTextEntry />} />

          <Text className="mb-2 text-[13px] font-semibold text-primaryText">Rôle</Text>
          <View className="mb-4 flex-row gap-2">
            {Object.entries(roleMeta).map(([key, meta]) => {
              const active = selectedRole === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setSelectedRole(key as FormValues['role'])}
                  className={`flex-1 rounded-pill border px-3 py-3 ${active ? 'bg-actionBlue border-actionBlue' : 'bg-white/5 border-border'}`}
                >
                  <Text className={`text-center text-[12px] font-semibold ${active ? 'text-white' : 'text-primaryText'}`}>{meta.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <PrimaryButton label="Se connecter" icon="log-in-outline" onPress={onSubmit} />
        </Card>

        <Card className="mb-4">
          <Text className="mb-3 text-[16px] font-bold text-primaryText">Comptes de test</Text>
          <View className="gap-3">
            {demoAccounts.map((account) => (
              <Pressable
                key={account.email}
                onPress={() => {
                  setSelectedRole(account.role);
                  setValue('email', account.email);
                  setValue('role', account.role);
                }}
                className="rounded-card border border-border bg-navy px-4 py-3"
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-semibold text-primaryText">{account.email}</Text>
                    <Text className="text-[12px] text-mutedText">Appuyez pour préremplir</Text>
                  </View>
                  <RoleBadge role={account.role} />
                </View>
              </Pressable>
            ))}
          </View>
        </Card>

        <View className="flex-row items-center justify-center gap-2">
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.availableGreen} />
          <Text className="text-[12px] text-mutedText">Cache local, synchronisation live et notifications intégrées.</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
