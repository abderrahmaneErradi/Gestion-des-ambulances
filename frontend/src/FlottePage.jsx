import React, { useState, useEffect, useCallback } from 'react';
import { getAmbulances, getAmbulanciers, createAmbulance, updateAmbulance, deleteAmbulance } from './api';
import { showToast } from './toast';

const STATUT_BADGE = {
  disponible: 'badge-green',
  en_mission: 'badge-blue',
  maintenance: 'badge-yellow',
  hors_ligne: 'badge-gray',
};

function AmbulanceModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || { immatriculation: '', type: 'Standard', statut: 'disponible' });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (initial) await updateAmbulance(initial.id_ambulance, form);
      else await createAmbulance(form);
      showToast(initial ? 'Ambulance mise à jour !' : 'Ambulance créée !', 'success');
      onSaved();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>{initial ? '✏️ Modifier l\'ambulance' : '➕ Nouvelle ambulance'}</h3>
        <form onSubmit={handleSave} className="modal-form">
          <div className="form-group">
            <label>Immatriculation</label>
            <input required value={form.immatriculation} onChange={e => set('immatriculation', e.target.value)}
              placeholder="AA-123-BB" disabled={!!initial} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Type de véhicule</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="Standard">Standard</option>
                <option value="Réanimation">Réanimation</option>
                <option value="Pédiatrique">Pédiatrique</option>
                <option value="Bariatrique">Bariatrique</option>
              </select>
            </div>
            <div className="form-group">
              <label>Statut</label>
              <select value={form.statut} onChange={e => set('statut', e.target.value)}>
                <option value="disponible">Disponible</option>
                <option value="en_mission">En Mission</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Enregistrement...' : '💾 Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FlottePage() {
  const [tab, setTab] = useState('ambulances');
  const [ambulances, setAmbulances] = useState([]);
  const [ambulanciers, setAmbulanciers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | {id_ambulance,...}

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ra, rb] = await Promise.all([getAmbulances(), getAmbulanciers()]);
      setAmbulances(ra.data);
      setAmbulanciers(rb.data);
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette ambulance de la flotte ?')) return;
    try {
      await deleteAmbulance(id);
      showToast('Ambulance supprimée.', 'success');
      loadAll();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const filteredAmb = ambulances.filter(a =>
    (!search || a.immatriculation.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatut || a.statut === filterStatut)
  );

  const filteredDrv = ambulanciers.filter(d =>
    !search || d.user?.nom?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {modal && (
        <AmbulanceModal
          initial={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); loadAll(); }}
        />
      )}
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[['ambulances', '🚑 Ambulances'], ['ambulanciers', '👨‍⚕️ Ambulanciers']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`btn ${tab === k ? 'btn-primary' : 'btn-ghost'}`}>{l}</button>
        ))}
      </div>

      {tab === 'ambulances' && (
        <div className="card">
          <div className="table-toolbar">
            <div className="search-bar">
              <span>🔍</span>
              <input placeholder="Rechercher par immatriculation ou type..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
              <option value="">Tous les statuts</option>
              <option value="disponible">Disponible</option>
              <option value="en_mission">En Mission</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <button className="btn btn-primary" onClick={() => setModal('create')}>➕ Ajouter</button>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : filteredAmb.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🚑</div><p>Aucune ambulance trouvée.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Immatriculation</th><th>Type</th><th>Statut</th>
                  <th>Chauffeur(s)</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAmb.map((a, i) => (
                  <tr key={a.id_ambulance}>
                    <td>{i + 1}</td>
                    <td className="primary">{a.immatriculation}</td>
                    <td>{a.type}</td>
                    <td><span className={`badge ${STATUT_BADGE[a.statut] || 'badge-gray'}`}>{a.statut.replace('_', ' ')}</span></td>
                    <td style={{color:'var(--text-muted)'}}>
                      {a.ambulanciers?.length > 0
                        ? a.ambulanciers.map(d => d.user?.nom).join(', ')
                        : <i>Aucun assigné</i>}
                    </td>
                    <td>
                      <div className="actions-wrap">
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(a)}>✏️ Éditer</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id_ambulance)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'ambulanciers' && (
        <div className="card">
          <div className="table-toolbar">
            <div className="search-bar">
              <span>🔍</span>
              <input placeholder="Rechercher un ambulancier..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : filteredDrv.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">👨‍⚕️</div><p>Aucun ambulancier.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Nom Complet</th><th>Email</th><th>Téléphone</th><th>Statut</th><th>Véhicule</th></tr>
              </thead>
              <tbody>
                {filteredDrv.map((d, i) => (
                  <tr key={d.id_ambulancier}>
                    <td>{i + 1}</td>
                    <td className="primary">{d.user?.nom || '—'}</td>
                    <td>{d.user?.email || '—'}</td>
                    <td>{d.telephone}</td>
                    <td><span className={`badge ${STATUT_BADGE[d.statut] || 'badge-gray'}`}>{d.statut.replace('_', ' ')}</span></td>
                    <td>{d.ambulance ? `🚑 ${d.ambulance.immatriculation}` : <i style={{color:'var(--text-muted)'}}>Non assigné</i>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
