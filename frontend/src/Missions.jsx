import React, { useState } from 'react'
import { Plus, Clock, AlertCircle } from 'lucide-react'

const Missions = () => {
  const [missions, setMissions] = useState([
    { id: 1, patient: 'Jean Dupont', type: 'Urgence', priorite: 'Haute', statut: 'En cours', ambulance: 'AMB-001' },
    { id: 2, patient: 'Marie Martin', type: 'Non urgent', priorite: 'Basse', statut: 'Planifiée', ambulance: 'AMB-003' },
    { id: 3, patient: 'Pierre Bernard', type: 'Transfert', priorite: 'Moyenne', statut: 'Complétée', ambulance: 'AMB-002' },
    { id: 4, patient: 'Sophie Leclerc', type: 'Urgence', priorite: 'Critique', statut: 'En cours', ambulance: 'AMB-001' }
  ])

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h2 style={{margin: 0, color: '#0F3460', fontSize: '28px', fontWeight: '700'}}>
          Gestion des Missions
        </h2>
        <button style={primaryButtonStyle}>
          <Plus size={20} />
          <span>Nouvelle Mission</span>
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
        <div style={filterCardStyle('#3b82f6')}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', opacity: 0.8}}>En cours</p>
          <p style={{margin: 0, fontSize: '24px', fontWeight: '700'}}>2</p>
        </div>
        <div style={filterCardStyle('#10b981')}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', opacity: 0.8}}>Complétées</p>
          <p style={{margin: 0, fontSize: '24px', fontWeight: '700'}}>156</p>
        </div>
        <div style={filterCardStyle('#f59e0b')}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', opacity: 0.8}}>Planifiées</p>
          <p style={{margin: 0, fontSize: '24px', fontWeight: '700'}}>5</p>
        </div>
        <div style={filterCardStyle('#ef4444')}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', opacity: 0.8}}>Urgentes</p>
          <p style={{margin: 0, fontSize: '24px', fontWeight: '700'}}>3</p>
        </div>
      </div>

      {/* Missions Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadStyle}>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Priorité</th>
              <th style={thStyle}>Statut</th>
              <th style={thStyle}>Ambulance</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((mission) => (
              <tr key={mission.id} style={tbodyRowStyle}>
                <td style={tdStyle}>{mission.patient}</td>
                <td style={tdStyle}>{mission.type}</td>
                <td style={tdStyle}>
                  <span style={getPrioriteBadgeStyle(mission.priorite)}>
                    {mission.priorite}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={getStatusBadgeStyle(mission.statut)}>
                    {mission.statut}
                  </span>
                </td>
                <td style={tdStyle}><strong>{mission.ambulance}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const primaryButtonStyle = {
  backgroundColor: '#0F3460',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}

const filterCardStyle = (color) => ({
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '16px',
  borderLeft: `4px solid ${color}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  cursor: 'pointer'
})

const tableContainerStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
}

const theadStyle = {
  backgroundColor: '#f5f7fa'
}

const thStyle = {
  padding: '16px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '14px',
  color: '#0F3460',
  borderBottom: '2px solid #e0e0e0'
}

const tbodyRowStyle = {
  borderBottom: '1px solid #e0e0e0'
}

const tdStyle = {
  padding: '16px',
  fontSize: '14px',
  color: '#333'
}

const getPrioriteBadgeStyle = (priorite) => {
  const styles = {
    'Critique': { backgroundColor: '#fee2e2', color: '#991b1b' },
    'Haute': { backgroundColor: '#fef3c7', color: '#92400e' },
    'Moyenne': { backgroundColor: '#dbeafe', color: '#0c4a6e' },
    'Basse': { backgroundColor: '#d1fae5', color: '#065f46' }
  }
  return {
    ...styles[priorite],
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  }
}

const getStatusBadgeStyle = (status) => {
  const styles = {
    'En cours': { backgroundColor: '#dbeafe', color: '#0c4a6e' },
    'Complétée': { backgroundColor: '#d1fae5', color: '#065f46' },
    'Planifiée': { backgroundColor: '#fef3c7', color: '#92400e' }
  }
  return {
    ...styles[status],
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  }
}

export default Missions
