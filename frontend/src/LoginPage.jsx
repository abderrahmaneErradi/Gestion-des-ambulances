import React, { useState } from 'react';
import { authLogin } from './api';
import { showToast } from './toast';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@secours.fr');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authLogin(email, password);
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('auth_user', JSON.stringify(res.data.user));
      showToast(`Bienvenue, ${res.data.user.nom} !`, 'success');
      onLogin(res.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🚑</div>
          <h1>Système de Régulation</h1>
          <p>Interface de supervision des ambulances</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">⚠️ {error}</div>}
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email" type="email" required autoFocus
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@secours.fr"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password" type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? '⏳ Connexion en cours...' : '🔐 Se connecter au back-office'}
          </button>
        </form>
        <div className="demo-hint">
          <p>Accès Admin : <strong>admin@secours.fr</strong> / <strong>password123</strong></p>
          <p style={{marginTop:'4px'}}>Opérateur : <strong>operator@secours.fr</strong> / <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
}
