import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, MapPin } from 'lucide-react'

const Ambulances = () => {
  const [ambulances, setAmbulances] = useState([
    { id: 1, numero: 'AMB-001', type: 'Urgence', statut: 'Disponible', localisation: 'Centre-Ville', conducteur: 'Ahmed M.' },
    { id: 2, numero: 'AMB-002', type: 'Transport', statut: 'En mission', localisation: 'Nord', conducteur: 'Fatima R.' },
    { id: 3, numero: 'AMB-003', type: 'Urgence', statut: 'Disponible', localisation: 'Sud', conducteur: 'Mohamed K.' },
    { id: 4, numero: 'AMB-004', type: 'Transport', statut: 'Maintenance', localisation: 'Garage', conducteur: 'N/A' }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newAmbulance, setNewAmbulance] = useState({
    numero: '',
    type: 'Urgence',
    statut: 'Disponible',
    localisation: '',
    conducteur: ''
  })

  const handleStatusChange = (ambulanceId, statut) => {
    setAmbulances((current) =>
      current.map((ambulance) =>
        ambulance.id === ambulanceId ? { ...ambulance, statut } : ambulance
      )
    )
  }

  const filteredAmbulances = ambulances.filter((ambulance) => {
    const value = `${ambulance.numero} ${ambulance.type} ${ambulance.statut} ${ambulance.localisation} ${ambulance.conducteur}`
    return value.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleAddAmbulance = () => {
    if (!newAmbulance.numero.trim()) {
      return
    }

    setAmbulances((current) => [
      ...current,
      {
        id: Date.now(),
        ...newAmbulance,
        localisation: newAmbulance.localisation || 'Centre-Ville',
        conducteur: newAmbulance.conducteur || 'Non assigné'
      }
    ])

    setNewAmbulance({
      numero: '',
      type: 'Urgence',
      statut: 'Disponible',
      localisation: '',
      conducteur: ''
    })
    setShowForm(false)
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px'}}>
        <div>
          <h2 style={{margin: 0, color: '#0F3460', fontSize: '28px', fontWeight: '700'}}>
            Gestion des Ambulances
          </h2>
          <p style={{margin: '8px 0 0', color: '#5a6d82'}}>Recherchez, ajoutez et suivez vos véhicules en temps réel.</p>
        </div>

        <button className="btn-primary" onClick={() => setShowForm((current) => !current)}>
          <Plus size={18} />
          {showForm ? 'Fermer' : 'Ajouter une ambulance'}
        </button>
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px'}}>
        <div className="search-box" style={{flex: '1 1 320px', minWidth: '280px'}}>
          <Search size={20} color="#0F3460" />
          <input
            type="text"
            value={searchTerm}
            placeholder="Rechercher une ambulance..."
            className="search-input"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {showForm && (
        <div className="section" style={{marginBottom: '24px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px'}}>
            <h3 style={{margin: 0, color: '#0F3460'}}>Nouvelle Ambulance</h3>
            <span style={{color: '#5a6d82'}}>Les champs marqués sont obligatoires.</span>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Numéro</label>
              <input
                type="text"
                value={newAmbulance.numero}
                onChange={(event) => setNewAmbulance({...newAmbulance, numero: event.target.value})}
                placeholder="AMB-005"
              />
            </div>
            <div className="form-field">
              <label>Type</label>
              <select
                value={newAmbulance.type}
                onChange={(event) => setNewAmbulance({...newAmbulance, type: event.target.value})}
              >
                <option>Urgence</option>
                <option>Transport</option>
                <option>Transfert</option>
              </select>
            </div>
            <div className="form-field">
              <label>Statut</label>
              <select
                value={newAmbulance.statut}
                onChange={(event) => setNewAmbulance({...newAmbulance, statut: event.target.value})}
              >
                <option>Disponible</option>
                <option>En mission</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div className="form-field">
              <label>Localisation</label>
              <input
                type="text"
                value={newAmbulance.localisation}
                onChange={(event) => setNewAmbulance({...newAmbulance, localisation: event.target.value})}
                placeholder="Centre-Ville"
              />
            </div>
            <div className="form-field">
              <label>Conducteur</label>
              <input
                type="text"
                value={newAmbulance.conducteur}
                onChange={(event) => setNewAmbulance({...newAmbulance, conducteur: event.target.value})}
                placeholder="Nom du conducteur"
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddAmbulance}>
              Ajouter
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Localisation</th>
              <th>Conducteur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAmbulances.map((ambulance) => (
              <tr key={ambulance.id}>
                <td><strong>{ambulance.numero}</strong></td>
                <td>{ambulance.type}</td>
                <td>
                  <select
                    value={ambulance.statut}
                    onChange={(event) => handleStatusChange(ambulance.id, event.target.value)}
                    style={statusSelectStyle}
                  >
                    <option>Disponible</option>
                    <option>En mission</option>
                    <option>Maintenance</option>
                  </select>
                </td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <MapPin size={16} color="#00A8E8" />
                    {ambulance.localisation}
                  </div>
                </td>
                <td>{ambulance.conducteur}</td>
                <td style={{display: 'flex', gap: '8px'}}>
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
  gap: '8px',
  transition: 'background-color 0.2s'
}

const searchContainerStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  border: '1px solid #e0e0e0'
}

const searchInputStyle = {
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: '14px',
  fontFamily: 'inherit'
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
  transition: 'background-color 0.2s',
  ':hover': { backgroundColor: '#f9f9f9' }
}

const tdStyle = {
  padding: '16px',
  fontSize: '14px',
  color: '#333'
}

const getStatusBadgeStyle = (status) => {
  const styles = {
    'Disponible': { backgroundColor: '#d1fae5', color: '#065f46' },
    'En mission': { backgroundColor: '#dbeafe', color: '#0c4a6e' },
    'Maintenance': { backgroundColor: '#fef3c7', color: '#92400e' }
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
  transition: 'background-color 0.2s',
  display: 'flex',
  alignItems: 'center'
}

const statusSelectStyle = {
  width: '100%',
  minWidth: '140px',
  border: '1px solid rgba(15, 52, 96, 0.15)',
  borderRadius: '12px',
  padding: '10px 12px',
  background: '#fff',
  color: '#0F3460',
  fontSize: '14px',
  cursor: 'pointer'
}

export default Ambulances
