import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Location from 'expo-location';
import { useAppStore } from '@/store/useAppStore';

const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL;

export function useLiveFleet() {
  const ambulances = useAppStore((state) => state.ambulances);
  const updateAmbulanceLocation = useAppStore((state) => state.updateAmbulanceLocation);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let socket: Socket | undefined;
    let mounted = true;

    const startPolling = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!mounted || permission.status !== 'granted') {
        setTrackingEnabled(false);
        return;
      }

      setTrackingEnabled(true);

      const tick = async () => {
        const position = await Location.getCurrentPositionAsync({});
        if (!mounted) return;

        const anchorLat = position.coords.latitude;
        const anchorLng = position.coords.longitude;

        ambulances.forEach((ambulance, index) => {
          const variation = index * 0.0012;
          updateAmbulanceLocation(ambulance.id, {
            latitude: Number((anchorLat + variation + (ambulance.location.latitude - anchorLat) * 0.98).toFixed(6)),
            longitude: Number((anchorLng - variation + (ambulance.location.longitude - anchorLng) * 0.98).toFixed(6)),
          });
        });

        setLastSyncAt(new Date());
      };

      await tick();
      interval = setInterval(tick, 10000);
    };

    if (socketUrl) {
      socket = io(socketUrl, { transports: ['websocket'], autoConnect: true });
      socket.on('ambulance:update', (payload) => {
        if (!mounted) return;
        const updates = Array.isArray(payload) ? payload : [payload];
        updates.forEach((update: { id: string; location?: { latitude: number; longitude: number } }) => {
          if (update.location) {
            updateAmbulanceLocation(update.id, update.location);
          }
        });
        setLastSyncAt(new Date());
      });
      socket.on('connect', () => setTrackingEnabled(true));
      socket.on('disconnect', () => setTrackingEnabled(false));
    } else {
      void startPolling();
    }

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
      socket?.disconnect();
    };
  }, [ambulances, updateAmbulanceLocation]);

  return { trackingEnabled, lastSyncAt };
}
