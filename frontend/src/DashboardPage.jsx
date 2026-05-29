import React, { useState, useEffect, useCallback } from 'react';
import { getStats } from './api';

const STAT_COLORS = ['blue', 'green', 'yellow', 'red', 'purple'];
const URGENCE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({ label, value, sub, icon, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-top">
        <div className="stat-label">{label}</div>
        <div className={`stat-icon ${color}`}>{icon}</div>
      </div>
      <div className="stat-value">{value ?? '—'}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function FleetBar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="fleet-bar-row">
      <div className="fleet-bar-label">{label}</div>
      <div className="fleet-bar-outer">
        <div className="fleet-bar-inner" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="fleet-bar-val">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await getStats();
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner" />
      <span>Chargement des statistiques...</span>
    </div>
  );

  if (!data) return <div className="empty-state"><div className="empty-icon">⚠️</div><p>Impossible de charger les données.</p></div>;

  const { flotte, ambulanciers, interventions_jour, repartition_urgences, historique_mensuel } = data;
  const maxUrgence = Math.max(...(repartition_urgences || []).map(u => u.count), 1);
  const maxHist = Math.max(...(historique_mensuel || []).map(m => m.total), 1);

  return (
    <>
      {/* KPI Row 1 — Flotte */}
      <div className="stats-grid">
        <StatCard label="Total Ambulances" value={flotte.total} icon="🚑" color="blue" sub="Parc de véhicules" />
        <StatCard label="Disponibles" value={flotte.disponible} icon="✅" color="green" sub="Prêtes à intervenir" />
        <StatCard label="En Mission" value={flotte.en_mission} icon="🔵" color="blue" sub="En cours de route" />
        <StatCard label="Maintenance" value={flotte.maintenance} icon="🔧" color="yellow" sub="Hors service temporaire" />
        <StatCard label="Ambulanciers" value={ambulanciers.total} icon="👨‍⚕️" color="purple"
          sub={`${ambulanciers.disponible} dispo / ${ambulanciers.hors_ligne} hors ligne`} />
      </div>

      {/* KPI Row 2 — Interventions du jour */}
      <div className="stats-grid" style={{marginBottom: '24px'}}>
        <StatCard label="Urgences du Jour" value={interventions_jour.total} icon="📋" color="blue" sub="Interventions déclenchées" />
        <StatCard label="En Attente" value={interventions_jour.en_attente} icon="⏳" color="yellow" sub="Sans ambulance assignée" />
        <StatCard label="En Cours" value={interventions_jour.en_cours} icon="🚨" color="red" sub="En intervention active" />
        <StatCard label="Terminées" value={interventions_jour.terminees} icon="🏁" color="green" sub="Missions accomplies" />
      </div>

      <div className="grid-two">
        {/* Historique mensuel */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Historique Mensuel</h3>
              <p>Activité sur les 6 derniers mois</p>
            </div>
          </div>
          <div className="history-bars">
            {(historique_mensuel || []).map((m, i) => (
              <div key={i} className="bar-group">
                <div className="bar-wrap">
                  <div className="bar total" style={{ height: `${(m.total / maxHist) * 100}%` }} title={`Total: ${m.total}`} />
                  <div className="bar done" style={{ height: `${(m.terminees / maxHist) * 100}%` }} title={`Terminées: ${m.terminees}`} />
                </div>
                <div className="bar-label">{m.mois.split(' ')[0].substring(0, 3)}</div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item"><div className="legend-dot" style={{background:'#3b82f6'}} /> Total</div>
            <div className="legend-item"><div className="legend-dot" style={{background:'#10b981'}} /> Terminées</div>
          </div>
        </div>

        {/* Répartition urgences */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Répartition par Type d'Urgence</h3>
              <p>Volume global de missions</p>
            </div>
          </div>
          <div className="urgence-list">
            {(repartition_urgences || []).map((u, i) => (
              <div key={i} className="urgence-item">
                <div className="urgence-row">
                  <span className="urgence-name">{u.type_urgence}</span>
                  <span className="urgence-count" style={{color: URGENCE_COLORS[i % URGENCE_COLORS.length]}}>{u.count}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill"
                    style={{ width: `${(u.count / maxUrgence) * 100}%`, background: URGENCE_COLORS[i % URGENCE_COLORS.length] }}
                  />
                </div>
              </div>
            ))}
            {(!repartition_urgences || repartition_urgences.length === 0) &&
              <div className="empty-state"><p>Aucune donnée disponible.</p></div>
            }
          </div>
        </div>
      </div>

      {/* État de la flotte */}
      <div className="card">
        <div className="card-header">
          <div><h3>État en temps réel de la flotte</h3><p>Mise à jour automatique toutes les 30 secondes</p></div>
          <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'0.78rem', color:'var(--success)'}}>
            <span className="live-dot" /> Actif
          </div>
        </div>
        <div className="fleet-visual">
          <FleetBar label="🟢 Disponibles" value={flotte.disponible} max={flotte.total} color="var(--success)" />
          <FleetBar label="🔵 En Mission" value={flotte.en_mission} max={flotte.total} color="var(--accent)" />
          <FleetBar label="🟡 Maintenance" value={flotte.maintenance} max={flotte.total} color="var(--warning)" />
        </div>
      </div>
    </>
  );
}
