import React from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'

const Reports = () => {
  const stats = [
    { label: 'Total missions ce mois', value: 248 },
    { label: 'Temps moyen d\'intervention', value: '14 min' },
    { label: 'Missions urgentes traitées', value: 89 },
    { label: 'Taux de satisfaction', value: '94%' }
  ]

  return (
    <div>
      <h2 style={{marginBottom: '24px', color: '#0F3460', fontSize: '28px', fontWeight: '700'}}>
        Rapports et Statistiques
      </h2>

      <div style={statsGridStyle}>
        {stats.map((stat, idx) => (
          <div key={idx} style={statCardStyle}>
            <TrendingUp size={32} color="#00A8E8" />
            <p style={{margin: '16px 0 8px 0', fontSize: '14px', opacity: 0.8}}>{stat.label}</p>
            <p style={{margin: 0, fontSize: '28px', fontWeight: '700', color: '#0F3460'}}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{marginTop: '32px'}}>
        <div style={chartCardStyle}>
          <h3 style={{margin: '0 0 24px 0', color: '#0F3460', fontSize: '18px', fontWeight: '600'}}>
            Missions par jour (7 derniers jours)
          </h3>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px'}}>
            {[65, 78, 45, 92, 87, 71, 56].map((value, idx) => (
              <div key={idx} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                <div style={{
                  width: '100%',
                  height: `${(value / 100) * 150}px`,
                  backgroundColor: '#00A8E8',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }} />
                <span style={{fontSize: '12px', color: '#666'}}>{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][idx]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
        <div style={reportSectionStyle}>
          <h3 style={{margin: '0 0 16px 0', color: '#0F3460', fontSize: '16px', fontWeight: '600'}}>
            Top Ambulances
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {['AMB-001', 'AMB-003', 'AMB-002'].map((amb, idx) => (
              <div key={amb} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0'}}>
                <span>{amb}</span>
                <span style={{fontWeight: '600', color: '#0F3460'}}>{45 - idx * 8} missions</span>
              </div>
            ))}
          </div>
        </div>

        <div style={reportSectionStyle}>
          <h3 style={{margin: '0 0 16px 0', color: '#0F3460', fontSize: '16px', fontWeight: '600'}}>
            Distribution par Type
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Urgences</span>
              <span style={{fontWeight: '600', color: '#0F3460'}}>62%</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Transferts</span>
              <span style={{fontWeight: '600', color: '#0F3460'}}>24%</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Non urgent</span>
              <span style={{fontWeight: '600', color: '#0F3460'}}>14%</span>
            </div>
          </div>
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

const statCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  borderLeft: '4px solid #0F3460'
}

const chartCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
}

const reportSectionStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
}

export default Reports
