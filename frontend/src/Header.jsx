import React from 'react'
import { Menu, Bell, LogOut } from 'lucide-react'

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button onClick={onToggleSidebar} className="icon-button">
          <Menu size={24} />
        </button>
        <div className="header-title">
          <strong>Tableau de bord</strong>
          <h1>Gestion des Ambulances</h1>
        </div>
      </div>

      <div className="header-actions">
        <button className="icon-button">
          <Bell size={24} />
        </button>
        <button className="icon-button">
          <LogOut size={24} />
        </button>
      </div>
    </header>
  )
}

export default Header
