import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
  Map: undefined;
  Fleet: undefined;
  Stats: undefined;
  Profile: undefined;
  MissionList: undefined;
  MissionDetail: { missionId: string };
  NewMission: undefined;
  AmbulanceDetail: { ambulanceId: string };
  AdminUsers: undefined;
  DriverHome: undefined;
};

export type ScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;
