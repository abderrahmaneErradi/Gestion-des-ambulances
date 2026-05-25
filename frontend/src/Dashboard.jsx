import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    { title: 'Ambulances', value: 12, icon: '🚑', color: '#0F3460' },
    { title: 'Missions Aujourd\'hui', value: 24, icon: '📋', color: '#00A8E8' },
    { title: 'Patients Actifs', value: 8, icon: '👥', color: '#10b981' },
    { title: 'Équipes Disponibles', value: 15, icon: '👨‍⚕️', color: '#f59e0b' }
  ]

  const recentMissions = [
    { id: 1, patient: 'Jean Dupont', type: 'Urgence', status: 'En cours', time: '14:32' },
    { id: 2, patient: 'Marie Martin', type: 'Non urgent', status: 'Complétée', time: '13:15' },
    { id: 3, patient: 'Pierre Bernard', type: 'Transfert', status: 'Planifiée', time: '15:00' }
  ]

  return (
    <div>
      <h2 style={{marginBottom: '24px', color: '#0F3460', fontSize: '28px', fontWeight: '700'}}>
        Tableau de Bord
      </h2>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        {stats.map((stat, idx) => (
          <div key={idx} style={statCardStyle(stat.color)}>
            <div style={statIconStyle}>{stat.icon}</div>
            <div>
              <p style={{margin: '0 0 8px 0', fontSize: '14px', opacity: 0.8}}>
                {stat.title}
              </p>
              <p style={{margin: 0, fontSize: '32px', fontWeight: '700', color: '#0F3460'}}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Missions */}
      <div style={{marginTop: '32px'}}>
        <h3 style={{marginBottom: '16px', color: '#0F3460', fontSize: '18px', fontWeight: '600'}}>
          Missions Récentes
        </h3>
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Patient</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Statut</th>
                <th style={thStyle}>Heure</th>
              </tr>
            </thead>
            <tbody>
              {recentMissions.map((mission) => (
                <tr key={mission.id} style={tbodyRowStyle}>
                  <td style={tdStyle}>{mission.patient}</td>
                  <td style={tdStyle}>{mission.type}</td>
                  <td style={tdStyle}>
                    <span style={getStatusBadgeStyle(mission.status)}>
                      {mission.status}
                    </span>
                  </td>
                  <td style={tdStyle}>{mission.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '20px',
  marginBottom: '32px'
}

const statCardStyle = (color) => ({
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  borderLeft: `4px solid ${color}`,
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s'
})

const statIconStyle = {
  fontSize: '32px'
}

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
  borderBottom: '1px solid #e0e0e0',
  transition: 'background-color 0.2s'
}

const tdStyle = {
  padding: '16px',
  fontSize: '14px',
  color: '#333'
}

const getStatusBadgeStyle = (status) => {
  const styles = {
    'En cours': { backgroundColor: '#3b82f6', color: '#fff' },
    'Complétée': { backgroundColor: '#10b981', color: '#fff' },
    'Planifiée': { backgroundColor: '#f59e0b', color: '#fff' }
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

export default Dashboard
