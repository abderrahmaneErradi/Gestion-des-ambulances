import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import { mockAmbulances, mockMissions, mockUsers, missionTimelineSeed } from '@/data/mockData';
import { Mission, MissionDraftInput, MissionStatus, MissionTimelineEntry, User, Ambulance, UserRole } from '@/types';

type AuthResult = { ok: true } | { ok: false; message: string };

interface AppState {
  currentUser: User | null;
  users: User[];
  missions: Mission[];
  ambulances: Ambulance[];
  missionTimeline: Record<string, MissionTimelineEntry[]>;
  hasHydrated: boolean;
  unreadAlertCount: number;
  login: (email: string, password: string, role: UserRole) => AuthResult;
  logout: () => void;
  setHydrated: (value: boolean) => void;
  createMission: (input: MissionDraftInput) => Mission;
  updateMissionStatus: (missionId: string, status: MissionStatus, note?: string) => void;
  assignAmbulanceToMission: (missionId: string, ambulanceId: string) => void;
  updateAmbulanceLocation: (ambulanceId: string, location: { latitude: number; longitude: number }) => void;
  updateAmbulanceStatus: (ambulanceId: string, status: Ambulance['status']) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  resetDemoData: () => void;
}

function seedState() {
  return {
    users: mockUsers,
    missions: mockMissions,
    ambulances: mockAmbulances,
    missionTimeline: missionTimelineSeed,
  };
}

function nextMissionStatus(current: MissionStatus): MissionStatus {
  switch (current) {
    case 'en_attente':
      return 'accepte';
    case 'accepte':
      return 'en_route';
    case 'en_route':
      return 'arrive';
    case 'arrive':
      return 'termine';
    default:
      return current;
  }
}

function upsertTimeline(
  timeline: Record<string, MissionTimelineEntry[]>,
  missionId: string,
  entry: MissionTimelineEntry,
) {
  return {
    ...timeline,
    [missionId]: [...(timeline[missionId] ?? []), entry],
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      ...seedState(),
      hasHydrated: false,
      unreadAlertCount: 3,
      login: (email, _password, role) => {
        const user = get().users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.role === role);
        if (!user) {
          return { ok: false, message: 'Compte introuvable pour cet email et ce rôle.' };
        }
        set({ currentUser: user });
        return { ok: true };
      },
      logout: () => set({ currentUser: null }),
      setHydrated: (value) => set({ hasHydrated: value }),
      createMission: (input) => {
        const missionId = `mission-${Date.now()}`;
        const mission: Mission = {
          id: missionId,
          patientName: input.patientName,
          patientPhone: input.patientPhone,
          pickupAddress: input.pickupAddress,
          destination: input.destination,
          urgency: input.urgency,
          status: 'en_attente',
          assignedAmbulanceId: input.assignedAmbulanceId,
          createdAt: new Date(),
          estimatedArrival: new Date(Date.now() + 1000 * 60 * 25),
        };

        set((state) => ({
          missions: [mission, ...state.missions],
          ambulances: state.ambulances.map((ambulance) =>
            ambulance.id === input.assignedAmbulanceId
              ? { ...ambulance, status: 'en_mission', currentMissionId: missionId }
              : ambulance,
          ),
          missionTimeline: upsertTimeline(state.missionTimeline, missionId, { status: 'en_attente', at: new Date(), note: 'Mission créée' }),
          unreadAlertCount: state.unreadAlertCount + (input.urgency === 'critique' ? 1 : 0),
        }));

        return mission;
      },
      updateMissionStatus: (missionId, status, note) => {
        set((state) => ({
          missions: state.missions.map((mission) => (mission.id === missionId ? { ...mission, status } : mission)),
          missionTimeline: upsertTimeline(state.missionTimeline, missionId, { status, at: new Date(), note }),
          ambulances: state.ambulances.map((ambulance) => {
            if (ambulance.currentMissionId !== missionId) return ambulance;
            const nextStatus = status === 'termine' || status === 'annule' ? 'retour' : 'en_mission';
            return { ...ambulance, status: nextStatus, currentMissionId: status === 'termine' || status === 'annule' ? undefined : missionId };
          }),
        }));
      },
      assignAmbulanceToMission: (missionId, ambulanceId) => {
        set((state) => ({
          missions: state.missions.map((mission) => (mission.id === missionId ? { ...mission, assignedAmbulanceId: ambulanceId } : mission)),
          ambulances: state.ambulances.map((ambulance) => {
            if (ambulance.id === ambulanceId) {
              return { ...ambulance, status: 'en_mission', currentMissionId: missionId };
            }
            if (ambulance.currentMissionId === missionId && ambulance.id !== ambulanceId) {
              return { ...ambulance, status: 'disponible', currentMissionId: undefined };
            }
            return ambulance;
          }),
          missionTimeline: upsertTimeline(state.missionTimeline, missionId, { status: 'accepte', at: new Date(), note: 'Ambulance réassignée' }),
        }));
      },
      updateAmbulanceLocation: (ambulanceId, location) => {
        set((state) => ({
          ambulances: state.ambulances.map((ambulance) => (ambulance.id === ambulanceId ? { ...ambulance, location } : ambulance)),
        }));
      },
      updateAmbulanceStatus: (ambulanceId, status) => {
        set((state) => ({
          ambulances: state.ambulances.map((ambulance) => (ambulance.id === ambulanceId ? { ...ambulance, status } : ambulance)),
        }));
      },
      addUser: (user) => {
        set((state) => ({ users: [user, ...state.users] }));
      },
      updateUser: (user) => {
        set((state) => ({ users: state.users.map((entry) => (entry.id === user.id ? user : entry)) }));
      },
      deleteUser: (userId) => {
        set((state) => ({ users: state.users.filter((entry) => entry.id !== userId) }));
      },
      resetDemoData: () => set({ ...seedState(), currentUser: get().currentUser, unreadAlertCount: 3 }),
    }),
    {
      name: 'ambulance-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
        missions: state.missions,
        ambulances: state.ambulances,
        missionTimeline: state.missionTimeline,
        unreadAlertCount: state.unreadAlertCount,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
