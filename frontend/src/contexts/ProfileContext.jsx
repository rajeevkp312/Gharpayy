import { createContext, useContext, useEffect, useState } from 'react'

const ProfileContext = createContext()

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({ name: 'Admin', email: 'admin@gharpayy.com' })

  useEffect(() => {
    const stored = localStorage.getItem('profile')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setProfile({ name: parsed.name || 'Admin', email: parsed.email || 'admin@gharpayy.com' })
      } catch {}
    }
  }, [])

  function updateProfile(updates) {
    const newProfile = { ...profile, ...updates }
    setProfile(newProfile)
    localStorage.setItem('profile', JSON.stringify(newProfile))
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
