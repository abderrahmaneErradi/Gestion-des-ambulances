# AmbulanceApp

Mobile React Native app for intelligent ambulance fleet management built with Expo managed workflow, TypeScript, React Navigation v6, Zustand, React Query, NativeWind, Expo Location, Expo Notifications, AsyncStorage, Socket.io-client, React Hook Form, and Zod.

## Setup

```bash
cd Expo
npm install
npm start
```

If the dependency tree needs to be aligned with the current Expo SDK, run:

```bash
npx expo install --fix
```

## Mock login accounts

- `admin@ambulance.app` / any password, role `admin`
- `operator@ambulance.app` / any password, role `operateur`
- `driver@ambulance.app` / any password, role `conducteur`

## Included screens

Auth, dashboard, live map, mission list/detail, new mission form, fleet, ambulance detail, stats, admin users, driver home, and profile.

## Notes

- Data is seeded from local fixtures and cached with AsyncStorage.
- Live tracking uses Expo Location polling and optionally Socket.io when `EXPO_PUBLIC_SOCKET_URL` is defined.
- Charts are rendered with lightweight custom components so the app stays self-contained during bootstrapping.
