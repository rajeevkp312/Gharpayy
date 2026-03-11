import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import { ProfileProvider } from './contexts/ProfileContext'
import PageShell from './components/layout/PageShell.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LeadForm from './pages/LeadForm.jsx'
import Leads from './pages/Leads.jsx'
import Visits from './pages/Visits.jsx'
import PipelineBoard from './components/PipelineBoard.jsx'
import FollowUps from './pages/FollowUps.jsx'
import AgentLeaderboard from './pages/AgentLeaderboard.jsx'
import PublicLeadForm from './pages/PublicLeadForm.jsx'
import Messages from './pages/Messages.jsx'
import Bookings from './pages/Bookings.jsx'
import Analytics from './pages/Analytics.jsx'
import Historical from './pages/Historical.jsx'
import Owners from './pages/Owners.jsx'
import Inventory from './pages/Inventory.jsx'
import Availability from './pages/Availability.jsx'
import Effort from './pages/Effort.jsx'
import Settings from './pages/Settings.jsx'

function App() {
  return (
    <ProfileProvider>
      <PageShell>
      {({ openSidebar }) => (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard openSidebar={openSidebar} />} />
          <Route path="/leads" element={<Leads openSidebar={openSidebar} />} />
          <Route path="/leads/new" element={<LeadForm openSidebar={openSidebar} />} />
          <Route path="/pipeline" element={<PipelineBoard openSidebar={openSidebar} />} />
          <Route path="/followups" element={<FollowUps openSidebar={openSidebar} />} />
          <Route path="/leaderboard" element={<AgentLeaderboard openSidebar={openSidebar} />} />
          <Route path="/visits" element={<Visits openSidebar={openSidebar} />} />
          <Route path="/public/lead" element={<PublicLeadForm />} />
          <Route path="/messages" element={<Messages openSidebar={openSidebar} />} />
          <Route path="/bookings" element={<Bookings openSidebar={openSidebar} />} />
          <Route path="/analytics" element={<Analytics openSidebar={openSidebar} />} />
          <Route path="/historical" element={<Historical openSidebar={openSidebar} />} />
          <Route path="/owners" element={<Owners openSidebar={openSidebar} />} />
          <Route path="/inventory" element={<Inventory openSidebar={openSidebar} />} />
          <Route path="/availability" element={<Availability openSidebar={openSidebar} />} />
          <Route path="/effort" element={<Effort openSidebar={openSidebar} />} />
          <Route path="/settings" element={<Settings openSidebar={openSidebar} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </PageShell>
    </ProfileProvider>
  )
}

export default App
