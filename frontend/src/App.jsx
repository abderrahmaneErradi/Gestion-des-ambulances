import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import FlottePage from './FlottePage';
import InterventionsPage from './InterventionsPage';
import { ToastContainer } from './toast';
import { authLogout } from './api';
import { showToast } from './toast';

const NAV = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: '📊', section: 'SUPERVISION' },
  { id: 'interventions', label: 'Interventions', icon: '🚨', section: 'SUPERVISION' },
  { id: 'flotte', label: 'Flotte & Équipages', icon: '🚑', section: 'GESTION' },
];

function Sidebar({ page, setPage, user, onLogout }) {
  const sections = [...new Set(NAV.map(n => n.section))];
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🚑</div>
        <div>
          <h2>SGA Régulation</h2>
          <span>Système de Supervision</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {sections.map(sec => (
          <div key={sec}>
            <div className="nav-section">{sec}</div>
            {NAV.filter(n => n.section === sec).map(n => (
              <div key={n.id}
                className={`nav-item ${page === n.id ? 'active' : ''}`}
                onClick={() => setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.nom?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <div className="user-name">{user?.nom?.split(' ')[0] || 'Utilisateur'}</div>
            <div className="user-role">{user?.role || 'admin'}</div>
          </div>
          <button className="logout-btn" title="Déconnexion" onClick={onLogout}>⏻</button>
        </div>
      </div>
    </aside>
  );
}

const PAGE_META = {
  dashboard: { title: 'Tableau de Bord', desc: 'Vue synthétique en temps réel de toute l\'activité de régulation' },
  interventions: { title: 'Gestion des Interventions', desc: 'Supervision, affectation et suivi de toutes les missions de secours' },
  flotte: { title: 'Flotte & Équipages', desc: 'Gestion du parc de véhicules et des ambulanciers opérationnels' },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  // Restaurer la session si un token est déjà stocké
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const stored = localStorage.getItem('auth_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const handleLogin = (u) => setUser(u);

  const handleLogout = async () => {
    try { await authLogout(); } catch {}
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    showToast('Déconnexion réussie.', 'info');
  };

  const meta = PAGE_META[page] || PAGE_META.dashboard;

  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>{meta.title}</h1>
            <p>{meta.desc}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.8rem' }}>
            <span className="live-dot" />
            Connecté — API Laravel opérationnelle
          </div>
        </header>
        <div className="page-content">
          {page === 'dashboard' && <DashboardPage />}
          {page === 'interventions' && <InterventionsPage />}
          {page === 'flotte' && <FlottePage />}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
