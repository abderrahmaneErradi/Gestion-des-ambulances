import { AmbulanceStatus, MissionStatus, UrgencyLevel, UserRole } from '@/types';

export const colors = {
  navy: '#0d1526',
  background: '#0d1526',
  card: '#111d35',
  border: '#1e2d4a',
  text: '#f1f5f9',
  muted: '#64748b',
  urgentRed: '#ef4444',
  availableGreen: '#22c55e',
  amber: '#f59e0b',
  actionBlue: '#3b82f6',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const radii = {
  card: 14,
  pill: 20,
};

export const urgencyMeta: Record<UrgencyLevel, { label: string; color: string; icon: string }> = {
  critique: { label: 'Critique', color: colors.urgentRed, icon: 'alert-circle' },
  modere: { label: 'Modéré', color: colors.amber, icon: 'time' },
  planifie: { label: 'Planifié', color: colors.availableGreen, icon: 'checkmark-circle' },
};

export const missionStatusMeta: Record<MissionStatus, { label: string; color: string }> = {
  en_attente: { label: 'En attente', color: colors.warning },
  accepte: { label: 'Accepté', color: colors.info },
  en_route: { label: 'En route', color: colors.actionBlue },
  arrive: { label: 'Arrivé', color: colors.amber },
  termine: { label: 'Terminé', color: colors.success },
  annule: { label: 'Annulé', color: colors.danger },
};

export const ambulanceStatusMeta: Record<AmbulanceStatus, { label: string; color: string }> = {
  disponible: { label: 'Disponible', color: colors.success },
  en_mission: { label: 'En mission', color: colors.danger },
  retour: { label: 'Retour', color: colors.warning },
  maintenance: { label: 'Maintenance', color: colors.muted },
};

export const roleMeta: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Administrateur', color: colors.urgentRed },
  operateur: { label: 'Opérateur', color: colors.actionBlue },
  conducteur: { label: 'Conducteur', color: colors.availableGreen },
};
