import { Mission, MissionStatus, UrgencyLevel } from '@/types';

export function urgencyRank(level: UrgencyLevel) {
  switch (level) {
    case 'critique':
      return 0;
    case 'modere':
      return 1;
    default:
      return 2;
  }
}

export function missionStatusRank(status: MissionStatus) {
  switch (status) {
    case 'en_attente':
      return 0;
    case 'accepte':
      return 1;
    case 'en_route':
      return 2;
    case 'arrive':
      return 3;
    case 'termine':
      return 4;
    case 'annule':
      return 5;
    default:
      return 9;
  }
}

export function sortMissions(missions: Mission[]) {
  return [...missions].sort((left, right) => {
    const urgencyDelta = urgencyRank(left.urgency) - urgencyRank(right.urgency);
    if (urgencyDelta !== 0) return urgencyDelta;
    const statusDelta = missionStatusRank(left.status) - missionStatusRank(right.status);
    if (statusDelta !== 0) return statusDelta;
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}
