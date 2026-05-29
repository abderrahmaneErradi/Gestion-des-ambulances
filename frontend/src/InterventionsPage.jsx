import React, { useState, useEffect, useCallback } from 'react';
import {
  getInterventions, getAmbulances,
  assignManually, assignAuto, cancelIntervention, updateStatus
} from './api';
import { showToast } from './toast';

const STATUT_BADGE = {
  en_attente: 'badge-yellow',
  accepte: 'badge-blue',
  en_cours: 'badge-red',
  terminee: 'badge-green',
};
const STATUT_LABEL = {
  en_attente: '⏳ En Attente',
  accepte: '✅ Accepté',
  en_cours: '🚨 En Cours',
  terminee: '🏁 Terminée',
};

function AssignModal({ intervention, ambulances, onClose, onDone }) {
  const [ambulanceId, setAmbulanceId] = useState('');
  const [loading, setLoading] = useState(false);

  const available = ambulances.filter(a => a.statut === 'disponible');

  const handleAssign = async () => {
    if (!ambulanceId) return showToast('Sélectionnez une ambulance', 'error');
    setLoading(true);
    try {
      await assignManually(intervention.id_intervention, parseInt(ambulanceId));
      showToast('Ambulance affectée manuellement !', 'success');
      onDone();
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleAuto = async () => {
    setLoading(true);
    try {
      await assignAuto(intervention.id_intervention);
      showToast('Affectation automatique réussie !', 'success');
      onDone();
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>🚑 Affecter une Ambulance</h3>
        <p style={{color:'var(--text-muted)', fontSize:'0.85rem', marginBottom:'16px'}}>
          Intervention <strong style={{color:'var(--text-primary)'}}>#{intervention.id_intervention}</strong> —
          Urgence : <strong style={{color:'var(--accent-light)'}}>{intervention.type_urgence}</strong><br/>
          Patient : {intervention.patient?.user?.nom || '—'} • {intervention.localisation}
        </p>

        <div className="modal-form">
          <div className="form-group">
            <label>Sélectionner une ambulance disponible</label>
            <select value={ambulanceId} onChange={e => setAmbulanceId(e.target.value)}>
              <option value="">-- Choisir un véhicule --</option>
              {available.map(a => (
                <option key={a.id_ambulance} value={a.id_ambulance}>
                  🚑 {a.immatriculation} — {a.type}
                </option>
              ))}
            </select>
            {available.length === 0 &&
              <p style={{color:'var(--danger)', fontSize:'0.78rem', marginTop:'6px'}}>⚠️ Aucune ambulance disponible en ce moment.</p>
            }
          </div>
        </div>

        <div className="modal-footer" style={{flexWrap:'wrap'}}>
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Annuler</button>
          <button className="btn btn-success" onClick={handleAuto} disabled={loading}>
            {loading ? '⏳...' : '⚡ Affectation Automatique'}
          </button>
          <button className="btn btn-primary" onClick={handleAssign} disabled={loading || !ambulanceId}>
            {loading ? '⏳...' : '✅ Confirmer Manuellement'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState('');
  const [filterUrgence, setFilterUrgence] = useState('');
  const [search, setSearch] = useState('');
  const [assignModal, setAssignModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const filters = {};
      if (filterStatut) filters.statut = filterStatut;
      if (filterUrgence) filters.type_urgence = filterUrgence;
      const [ri, ra] = await Promise.all([getInterventions(filters), getAmbulances()]);
      setInterventions(ri.data);
      setAmbulances(ra.data);
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoading(false); }
  }, [filterStatut, filterUrgence]);

  useEffect(() => { setLoading(true); loadData(); }, [loadData]);

  const handleCancel = async (id) => {
    if (!confirm('Annuler cette mission et libérer le véhicule ?')) return;
    setActionLoading(id + '-cancel');
    try {
      await cancelIntervention(id);
      showToast('Mission annulée, ambulance libérée.', 'success');
      loadData();
    } catch (e) { showToast(e.message, 'error'); }
    finally { setActionLoading(null); }
  };

  const handleStatus = async (id, statut) => {
    setActionLoading(id + '-status');
    try {
      await updateStatus(id, statut);
      showToast(`Statut mis à jour : ${STATUT_LABEL[statut]}`, 'success');
      loadData();
    } catch (e) { showToast(e.message, 'error'); }
    finally { setActionLoading(null); }
  };

  const filtered = interventions.filter(i =>
    !search ||
    i.localisation?.toLowerCase().includes(search.toLowerCase()) ||
    i.patient?.user?.nom?.toLowerCase().includes(search.toLowerCase()) ||
    i.type_urgence?.toLowerCase().includes(search.toLowerCase())
  );

  const urgenceTypes = [...new Set(interventions.map(i => i.type_urgence))];

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {assignModal && (
        <AssignModal
          intervention={assignModal}
          ambulances={ambulances}
          onClose={() => setAssignModal(null)}
          onDone={() => { setAssignModal(null); loadData(); }}
        />
      )}

      <div className="card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Rechercher patient, lieu, type..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="en_attente">En Attente</option>
            <option value="accepte">Accepté</option>
            <option value="en_cours">En Cours</option>
            <option value="terminee">Terminée</option>
          </select>
          <select className="filter-select" value={filterUrgence} onChange={e => setFilterUrgence(e.target.value)}>
            <option value="">Toutes urgences</option>
            {urgenceTypes.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={loadData}>🔄 Actualiser</button>
        </div>

        {/* Summary counters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {Object.entries(STATUT_LABEL).map(([k, l]) => {
            const count = interventions.filter(i => i.statut === k).length;
            return (
              <div key={k} onClick={() => setFilterStatut(filterStatut === k ? '' : k)}
                style={{ cursor: 'pointer', padding: '6px 14px', borderRadius: '99px',
                  background: filterStatut === k ? 'rgba(59,130,246,0.2)' : 'var(--bg-secondary)',
                  border: `1px solid ${filterStatut === k ? 'var(--accent)' : 'var(--border)'}`,
                  fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {l} <strong style={{ color: 'var(--text-primary)', marginLeft: '4px' }}>{count}</strong>
              </div>
            );
          })}
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /><span>Chargement...</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><p>Aucune intervention trouvée.</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Patient</th><th>Urgence</th><th>Localisation</th>
                  <th>Date</th><th>Statut</th><th>Ambulance</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(iv => (
                  <tr key={iv.id_intervention}>
                    <td style={{ color: 'var(--text-muted)' }}>#{iv.id_intervention}</td>
                    <td className="primary">{iv.patient?.user?.nom || '—'}</td>
                    <td>
                      <span className={`badge ${iv.type_urgence === 'Réanimation' ? 'badge-red' : 'badge-blue'}`}>
                        {iv.type_urgence}
                      </span>
                    </td>
                    <td title={iv.localisation} style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      📍 {iv.localisation}
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>{formatDate(iv.date_intervention)}</td>
                    <td><span className={`badge ${STATUT_BADGE[iv.statut]}`}>{STATUT_LABEL[iv.statut]}</span></td>
                    <td>
                      {iv.ambulance
                        ? <span style={{ fontSize: '0.82rem' }}>🚑 {iv.ambulance.immatriculation}</span>
                        : <i style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Non assignée</i>}
                    </td>
                    <td>
                      <div className="actions-wrap">
                        {/* Affecter */}
                        {(iv.statut === 'en_attente') && (
                          <button className="btn btn-primary btn-sm" onClick={() => setAssignModal(iv)}>🚑 Affecter</button>
                        )}
                        {/* Marquer en cours */}
                        {iv.statut === 'accepte' && (
                          <button className="btn btn-ghost btn-sm"
                            disabled={actionLoading === iv.id_intervention + '-status'}
                            onClick={() => handleStatus(iv.id_intervention, 'en_cours')}>
                            🚨 En Cours
                          </button>
                        )}
                        {/* Terminer */}
                        {iv.statut === 'en_cours' && (
                          <button className="btn btn-success btn-sm"
                            disabled={actionLoading === iv.id_intervention + '-status'}
                            onClick={() => handleStatus(iv.id_intervention, 'terminee')}>
                            🏁 Terminer
                          </button>
                        )}
                        {/* Annuler */}
                        {(iv.statut === 'accepte' || iv.statut === 'en_attente') && (
                          <button className="btn btn-danger btn-sm"
                            disabled={actionLoading === iv.id_intervention + '-cancel'}
                            onClick={() => handleCancel(iv.id_intervention)}>
                            ✖ Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
