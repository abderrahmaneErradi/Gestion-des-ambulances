import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Truck,
  Zap,
  BarChart3,
  UserCog,
  ChevronRight,
  Activity
} from 'lucide-react'

const Sidebar = ({ isOpen }) => {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Tableau de Bord', icon: LayoutDashboard },
    { path: '/ambulances', label: 'Ambulances', icon: Truck },
    { path: '/missions', label: 'Missions', icon: Activity },
    { path: '/patients', label: 'Patients', icon: Zap },
    { path: '/users', label: 'Utilisateurs', icon: UserCog },
    { path: '/reports', label: 'Rapports', icon: BarChart3 }
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Truck size={28} color="#00A8E8" />
          <span className="sidebar-logo-text">GesAmbulances</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">
                <Icon size={20} />
              </span>
              <span className="nav-label">{item.label}</span>
              {isActive && isOpen && <ChevronRight size={16} />}
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Administrateur</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
