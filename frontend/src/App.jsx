import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Dashboard from './Dashboard'
import Ambulances from './Ambulances'
import Missions from './Missions'
import Patients from './Patients'
import Users from './Users'
import Reports from './Reports'
import './App.css'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={sidebarOpen} />
        <div className="main-content">
          <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ambulances" element={<Ambulances />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/users" element={<Users />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}
