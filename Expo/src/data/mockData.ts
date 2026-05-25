import { Ambulance, Mission, MissionRoutePoint, MissionTimelineEntry, User } from '@/types';

const now = Date.now();

export const mockUsers: User[] = [
  { id: 'user-admin-1', name: 'Sara El Idrissi', email: 'admin@ambulance.app', role: 'admin', phone: '+212600000001' },
  { id: 'user-operator-1', name: 'Youssef Amrani', email: 'operator@ambulance.app', role: 'operateur', phone: '+212600000002' },
  { id: 'user-driver-1', name: 'Mehdi Bensaid', email: 'driver@ambulance.app', role: 'conducteur', phone: '+212600000003' },
  { id: 'user-driver-2', name: 'Rachid Alaoui', email: 'driver2@ambulance.app', role: 'conducteur', phone: '+212600000004' },
  { id: 'user-driver-3', name: 'Nadia Khellaf', email: 'driver3@ambulance.app', role: 'conducteur', phone: '+212600000005' },
];

export const mockAmbulances: Ambulance[] = [
  {
    id: 'amb-1',
    licensePlate: '12-A-3456',
    status: 'en_mission',
    driverId: 'user-driver-1',
    location: { latitude: 33.5731, longitude: -7.5898 },
    currentMissionId: 'mission-1',
  },
  {
    id: 'amb-2',
    licensePlate: '34-B-8899',
    status: 'disponible',
    driverId: 'user-driver-2',
    location: { latitude: 33.5898, longitude: -7.6123 },
  },
  {
    id: 'amb-3',
    licensePlate: '55-C-1020',
    status: 'retour',
    driverId: 'user-driver-3',
    location: { latitude: 33.5604, longitude: -7.6032 },
    currentMissionId: 'mission-3',
  },
  {
    id: 'amb-4',
    licensePlate: '61-D-4411',
    status: 'maintenance',
    driverId: 'user-driver-2',
    location: { latitude: 33.5821, longitude: -7.5811 },
  },
];

export const mockMissions: Mission[] = [
  {
    id: 'mission-1',
    patientName: 'Amina Boulhane',
    patientPhone: '+212612345678',
    pickupAddress: 'Clinique Atlas, Casablanca',
    destination: 'CHU Ibn Rochd, Casablanca',
    urgency: 'critique',
    status: 'en_route',
    assignedAmbulanceId: 'amb-1',
    createdAt: new Date(now - 1000 * 60 * 22),
    estimatedArrival: new Date(now + 1000 * 60 * 18),
  },
  {
    id: 'mission-2',
    patientName: 'Omar Haddad',
    pickupAddress: 'Résidence Al Qods, Casablanca',
    destination: 'Hôpital Cheikh Khalifa',
    urgency: 'modere',
    status: 'en_attente',
    assignedAmbulanceId: 'amb-2',
    createdAt: new Date(now - 1000 * 60 * 35),
    estimatedArrival: new Date(now + 1000 * 60 * 28),
  },
  {
    id: 'mission-3',
    patientName: 'Samir Benjelloun',
    patientPhone: '+212655551111',
    pickupAddress: 'Urgences privées Oasis',
    destination: 'Polyclinique Anfa',
    urgency: 'planifie',
    status: 'arrive',
    assignedAmbulanceId: 'amb-3',
    createdAt: new Date(now - 1000 * 60 * 95),
    estimatedArrival: new Date(now - 1000 * 60 * 8),
  },
  {
    id: 'mission-4',
    patientName: 'Lina El Fassi',
    pickupAddress: 'Centre médical Maarif',
    destination: 'Clinique Jerrada',
    urgency: 'critique',
    status: 'en_attente',
    assignedAmbulanceId: 'amb-2',
    createdAt: new Date(now - 1000 * 60 * 12),
    estimatedArrival: new Date(now + 1000 * 60 * 14),
  },
];

export const missionRoutes: Record<string, MissionRoutePoint[]> = {
  'mission-1': [
    { latitude: 33.5731, longitude: -7.5898 },
    { latitude: 33.5769, longitude: -7.5946 },
    { latitude: 33.5834, longitude: -7.6019 },
  ],
  'mission-2': [
    { latitude: 33.5898, longitude: -7.6123 },
    { latitude: 33.587, longitude: -7.6058 },
    { latitude: 33.5825, longitude: -7.5972 },
  ],
  'mission-3': [
    { latitude: 33.5604, longitude: -7.6032 },
    { latitude: 33.5661, longitude: -7.5951 },
    { latitude: 33.5718, longitude: -7.5873 },
  ],
  'mission-4': [
    { latitude: 33.5821, longitude: -7.5811 },
    { latitude: 33.5797, longitude: -7.5892 },
    { latitude: 33.5758, longitude: -7.5968 },
  ],
};

export const missionTimelineSeed: Record<string, MissionTimelineEntry[]> = {
  'mission-1': [
    { status: 'en_attente', at: new Date(now - 1000 * 60 * 22), note: 'Mise en file prioritaire' },
    { status: 'accepte', at: new Date(now - 1000 * 60 * 20), note: 'Ambulance assignée' },
    { status: 'en_route', at: new Date(now - 1000 * 60 * 16), note: 'Départ vers le patient' },
  ],
  'mission-2': [{ status: 'en_attente', at: new Date(now - 1000 * 60 * 35), note: 'En attente de prise en charge' }],
  'mission-3': [
    { status: 'en_attente', at: new Date(now - 1000 * 60 * 95) },
    { status: 'accepte', at: new Date(now - 1000 * 60 * 88) },
    { status: 'en_route', at: new Date(now - 1000 * 60 * 70) },
    { status: 'arrive', at: new Date(now - 1000 * 60 * 8), note: 'Patient pris en charge' },
  ],
  'mission-4': [{ status: 'en_attente', at: new Date(now - 1000 * 60 * 12) }],
};
