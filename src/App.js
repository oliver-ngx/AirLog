import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
      }}>
        Loading...
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '34px', fontWeight: '700' }}>AirLog</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 69, 58, 0.15)',
              border: 'none',
              borderRadius: '12px',
              color: '#FF453A',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>

        <div style={{
          background: 'rgba(28, 28, 30, 0.8)',
          padding: '24px',
          borderRadius: '20px',
          marginBottom: '20px'
        }}>
          <p style={{ color: '#8E8E93', marginBottom: '8px' }}>Logged in as:</p>
          <p style={{ fontSize: '17px', fontWeight: '600' }}>{session.user.email}</p>
        </div>

        <div style={{
          background: 'rgba(28, 28, 30, 0.8)',
          padding: '40px 24px',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '17px', color: '#8E8E93' }}>
            ✅ Authentication is working!
          </p>
          <p style={{ fontSize: '15px', color: '#8E8E93', marginTop: '16px' }}>
            Next we'll add the logging system
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
