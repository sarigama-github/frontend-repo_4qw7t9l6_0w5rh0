import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [profile, setProfile] = useState({
    exam_type: 'NEET',
    grade: 11,
    subjects: ['Physics'],
    learning_goals: []
  })

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const form = new URLSearchParams()
      form.set('username', email)
      form.set('password', password)
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      onAuth(data)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, profile })
      })
      if (!res.ok) throw new Error('Register failed')
      const data = await res.json()
      onAuth(data)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
      <div className="flex justify-center gap-2 mb-4">
        <button className={`px-3 py-1 rounded ${mode==='login'?'bg-blue-600 text-white':'bg-slate-700 text-blue-200'}`} onClick={()=>setMode('login')}>Login</button>
        <button className={`px-3 py-1 rounded ${mode==='register'?'bg-blue-600 text-white':'bg-slate-700 text-blue-200'}`} onClick={()=>setMode('register')}>Register</button>
      </div>
      <form onSubmit={mode==='login'?handleLogin:handleRegister} className="space-y-3">
        <input className="w-full px-3 py-2 rounded bg-slate-900/70 text-blue-100 border border-slate-700" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full px-3 py-2 rounded bg-slate-900/70 text-blue-100 border border-slate-700" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {mode==='register' && (
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-200">
            <select className="bg-slate-900/70 border border-slate-700 rounded px-2 py-1" value={profile.exam_type} onChange={e=>setProfile(p=>({...p, exam_type:e.target.value}))}>
              <option>NEET</option>
              <option>NSEJS</option>
              <option>Board</option>
            </select>
            <select className="bg-slate-900/70 border border-slate-700 rounded px-2 py-1" value={profile.grade} onChange={e=>setProfile(p=>({...p, grade:Number(e.target.value)}))}>
              <option value={11}>Class 11</option>
              <option value={12}>Class 12</option>
            </select>
          </div>
        )}
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 transition text-white rounded py-2">{loading? 'Please wait...' : (mode==='login'?'Login':'Create account')}</button>
      </form>
    </div>
  )
}
