import React from 'react'
import { Trash2, Edit2 } from 'lucide-react'

const Users = () => {
  const users = [
    { id: 1, nom: 'Admin', email: 'admin@gestion-ambulances.com', role: 'Administrateur', statut: 'Actif' },
    { id: 2, nom: 'Ahmed Khalil', email: 'ahmed@gestion-ambulances.com', role: 'Opérateur', statut: 'Actif' },
    { id: 3, nom: 'Fatima Zahra', email: 'fatima@gestion-ambulances.com', role: 'Conducteur', statut: 'Actif' },
    { id: 4, nom: 'Mohamed Hassan', email: 'hassan@gestion-ambulances.com', role: 'Conducteur', statut: 'Inactif' }
  ]

  return (
    <div>
      <h2 style={{marginBottom: '24px', color: '#0F3460', fontSize: '28px', fontWeight: '700'}}>
        Gestion des Utilisateurs
      </h2>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadStyle}>
              <th style={thStyle}>Nom</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Rôle</th>
              <th style={thStyle}>Statut</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={tbodyRowStyle}>
                <td style={tdStyle}>{user.nom}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <span style={getRoleBadgeStyle(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={getStatusBadgeStyle(user.statut)}>
                    {user.statut}
                  </span>
                </td>
                <td style={{...tdStyle, display: 'flex', gap: '8px'}}>
                  <button style={actionButtonStyle}>
                    <Edit2 size={16} />
                  </button>
                  <button style={{...actionButtonStyle, color: '#ef4444'}}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
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
  borderBottom: '1px solid #e0e0e0'
}

const tdStyle = {
  padding: '16px',
  fontSize: '14px',
  color: '#333'
}

const getRoleBadgeStyle = (role) => {
  const styles = {
    'Administrateur': { backgroundColor: '#e0e7ff', color: '#3730a3' },
    'Opérateur': { backgroundColor: '#f0fdf4', color: '#166534' },
    'Conducteur': { backgroundColor: '#fef3c7', color: '#92400e' }
  }
  return {
    ...styles[role],
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  }
}

const getStatusBadgeStyle = (status) => {
  const styles = {
    'Actif': { backgroundColor: '#d1fae5', color: '#065f46' },
    'Inactif': { backgroundColor: '#fee2e2', color: '#991b1b' }
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

const actionButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '4px',
  color: '#0F3460',
  transition: 'background-color 0.2s'
}

export default Users
