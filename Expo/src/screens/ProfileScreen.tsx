import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, PrimaryButton, SecondaryButton, RoleBadge, TitleBlock, Badge } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/utils/format';
import { ScreenProps } from '@/navigation/types';

export function ProfileScreen({ navigation }: ScreenProps<'Profile'>) {
  const currentUser = useAppStore((state) => state.currentUser);
  const logout = useAppStore((state) => state.logout);
  const resetDemoData = useAppStore((state) => state.resetDemoData);

  if (!currentUser) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-primaryText">Aucun utilisateur connecté.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <TitleBlock title="Profil" subtitle="Informations personnelles, rôle et actions de session." action={<RoleBadge role={currentUser.role} />} />

        <Card className="mb-4">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-actionBlue/20">
              <Ionicons name="person" size={28} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-[18px] font-bold text-primaryText">{currentUser.name}</Text>
              <Text className="mt-1 text-[13px] text-mutedText">{currentUser.email}</Text>
              <Text className="mt-1 text-[13px] text-mutedText">{currentUser.phone ?? 'Téléphone non renseigné'}</Text>
            </View>
          </View>
        </Card>

        <Card className="mb-4">
          <Text className="text-[16px] font-bold text-primaryText">Dernière activité</Text>
          <Text className="mt-2 text-[13px] text-mutedText">Session locale active. Les données sont persistées dans AsyncStorage.</Text>
          <View className="mt-3 flex-row gap-2">
            <Badge label={`Connecté le ${formatDateTime(new Date())}`} tone="action" />
          </View>
        </Card>

        {currentUser.role === 'admin' ? (
          <Card className="mb-4">
            <Text className="text-[16px] font-bold text-primaryText">Administration</Text>
            <Text className="mt-2 text-[13px] text-mutedText">Accédez à la gestion des comptes opérateurs et conducteurs.</Text>
            <View className="mt-3"><PrimaryButton label="Gérer les utilisateurs" icon="people-outline" onPress={() => navigation.navigate('AdminUsers')} /></View>
          </Card>
        ) : null}

        <View className="gap-3">
          <SecondaryButton label="Réinitialiser les données démo" onPress={() => {
            Alert.alert('Réinitialiser ?', 'Restaure les données de démonstration locales.', [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Réinitialiser', style: 'destructive', onPress: resetDemoData },
            ]);
          }} icon="refresh-outline" />
          <PrimaryButton label="Déconnexion" icon="log-out-outline" tone="urgent" onPress={logout} />
        </View>
      </ScrollView>
    </Screen>
  );
}
