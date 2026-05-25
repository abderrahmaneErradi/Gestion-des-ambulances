import * as Notifications from 'expo-notifications';

let configured = false;

export function configureNotifications() {
  if (configured) return;
  configured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function ensurePermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function notifyUrgentMission(patientName: string, urgency: string) {
  if (!(await ensurePermission())) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nouvelle mission urgente',
      body: `${patientName} nécessite une prise en charge ${urgency}.`,
    },
    trigger: null,
  });
}

export async function notifyDriverAssignment(driverName: string, missionLabel: string) {
  if (!(await ensurePermission())) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Mission assignée',
      body: `${driverName} a reçu ${missionLabel}.`,
    },
    trigger: null,
  });
}
