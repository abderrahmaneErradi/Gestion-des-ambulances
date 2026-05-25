export type UrgencyLevel = 'critique' | 'modere' | 'planifie';
export type AmbulanceStatus = 'disponible' | 'en_mission' | 'retour' | 'maintenance';
export type MissionStatus = 'en_attente' | 'accepte' | 'en_route' | 'arrive' | 'termine' | 'annule';
export type UserRole = 'admin' | 'operateur' | 'conducteur';

export interface Mission {
  id: string;
  patientName: string;
  patientPhone?: string;
  pickupAddress: string;
  destination: string;
  urgency: UrgencyLevel;
  status: MissionStatus;
  assignedAmbulanceId: string;
  createdAt: Date;
  estimatedArrival?: Date;
}

export interface Ambulance {
  id: string;
  licensePlate: string;
  status: AmbulanceStatus;
  driverId: string;
  location: { latitude: number; longitude: number };
  currentMissionId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface MissionTimelineEntry {
  status: MissionStatus;
  at: Date;
  note?: string;
}

export interface MissionRoutePoint {
  latitude: number;
  longitude: number;
}

export interface MissionDraftInput {
  patientName: string;
  patientPhone?: string;
  pickupAddress: string;
  destination: string;
  urgency: UrgencyLevel;
  assignedAmbulanceId: string;
}
