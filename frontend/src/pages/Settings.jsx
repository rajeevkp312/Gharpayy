import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import { useProfile } from '../contexts/ProfileContext'
import Topbar from '../components/layout/Topbar.jsx'
import Button from '../components/ui/Button.jsx'

const TABS = [
  { id: 'team', label: 'Team', icon: '👥' },
  { id: 'properties', label: 'Properties', icon: '🏢' },
  { id: 'profile', label: 'Profile', icon: '👤' },
]

export default function Settings({ openSidebar }) {
  const { profile, updateProfile } = useProfile()
  const [activeTab, setActiveTab] = useState('team')
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [agentName, setAgentName] = useState('')
  const [agentEmail, setAgentEmail] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  const [profileSaved, setProfileSaved] = useState(false)

  function onSaveProfile() {
    updateProfile({ name: profile.name, email: profile.email })
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  async function loadAgents() {
    try {
      setLoading(true)
      const res = await axiosClient.get('/api/agents')
      setAgents(res.data || [])
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAgents()
  }, [])

  async function onAddAgent(e) {
    e.preventDefault()
    if (!agentName.trim() || !agentEmail.trim()) return

    try {
      setError('')
      await axiosClient.post('/api/agents', {
        name: agentName.trim(),
        email: agentEmail.trim(),
        phone: agentPhone.trim(),
      })
      setAgentName('')
      setAgentEmail('')
      setAgentPhone('')
      await loadAgents()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  async function onDeactivate(agentId) {
    try {
      setError('')
      await axiosClient.patch(`/api/agents/${agentId}`, { active: false })
      await loadAgents()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  async function onDelete(agentId) {
    if (!window.confirm('Delete this agent?')) return
    try {
      setError('')
      await axiosClient.delete(`/api/agents/${agentId}`)
      await loadAgents()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  function getInitials(name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  function getAvatarColor(name) {
    const colors = ['bg-orange-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400', 'bg-teal-400']
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div>
      <Topbar title="Settings" subtitle="System configuration" onMenuClick={openSidebar} />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-6 flex items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black/70 hover:bg-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold mb-4">Add Agent</div>
              <form onSubmit={onAddAgent} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-xs text-black/50 mb-1">Name *</div>
                  <input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Agent name"
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <div className="text-xs text-black/50 mb-1">Email</div>
                  <input
                    type="email"
                    value={agentEmail}
                    onChange={(e) => setAgentEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <div className="text-xs text-black/50 mb-1">Phone</div>
                  <input
                    value={agentPhone}
                    onChange={(e) => setAgentPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  />
                </div>
              </form>
              <div className="mt-4">
                <Button type="submit" variant="gold" onClick={onAddAgent}>
                  + Add Agent
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold mb-4">Team Members</div>
              {loading ? (
                <div className="text-sm text-black/60">Loading...</div>
              ) : (
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div
                      key={agent._id}
                      className="flex items-center justify-between rounded-xl border border-black/5 bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(
                            agent.name,
                          )}`}
                        >
                          {getInitials(agent.name)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{agent.name}</div>
                          <div className="text-xs text-black/50">{agent.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeactivate(agent._id)}
                          disabled={agent.active === false}
                        >
                          {agent.active === false ? 'Inactive' : 'Deactivate'}
                        </Button>
                        <button
                          onClick={() => onDelete(agent._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  {!agents.length && (
                    <div className="text-sm text-black/60">No agents yet. Add your first agent above.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold mb-2">Properties</div>
            <div className="text-sm text-black/60">
              Manage properties in the <a href="/inventory" className="text-blue-600 hover:underline">Inventory</a> section.
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold mb-4">Profile Settings</div>
            <div className="space-y-4 max-w-md">
              <div>
                <div className="text-xs text-black/50 mb-1">Display Name</div>
                <input
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <div className="text-xs text-black/50 mb-1">Email</div>
                <input
                  value={profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button variant="gold" onClick={onSaveProfile}>
                  Save Changes
                </Button>
                {profileSaved && <span className="text-xs text-green-600">Saved!</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
