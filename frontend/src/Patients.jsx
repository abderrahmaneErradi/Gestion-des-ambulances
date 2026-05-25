import React from 'react'

const Patients = () => {
  const patients = [
    { id: 1, nom: 'Jean Dupont', age: 45, telephone: '+212 6 12 34 56 78', adresse: 'Rue Mohamed V, Casablanca' },
    { id: 2, nom: 'Marie Martin', age: 32, telephone: '+212 6 23 45 67 89', adresse: 'Avenue Hassan II, Rabat' },
    { id: 3, nom: 'Pierre Bernard', age: 67, telephone: '+212 6 34 56 78 90', adresse: 'Boulevard Zerktouni, Fès' }
  ]

  return (
    <div>
      <h2 style={{marginBottom: '24px', color: '#0F3460', fontSize: '28px', fontWeight: '700'}}>
        Gestion des Patients
      </h2>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadStyle}>
              <th style={thStyle}>Nom Complet</th>
              <th style={thStyle}>Âge</th>
              <th style={thStyle}>Téléphone</th>
              <th style={thStyle}>Adresse</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} style={tbodyRowStyle}>
                <td style={tdStyle}>{patient.nom}</td>
                <td style={tdStyle}>{patient.age} ans</td>
                <td style={tdStyle}>{patient.telephone}</td>
                <td style={tdStyle}>{patient.adresse}</td>
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

export default Patients
