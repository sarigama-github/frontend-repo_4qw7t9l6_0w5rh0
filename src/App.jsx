import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import ChapterBrowser from './components/ChapterBrowser'
import Practice from './components/Practice'
import Tutor from './components/Tutor'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [token, setToken] = useState('')
  const [me, setMe] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(()=>{
    async function loadMe(){
      if(!token) return
      try{
        const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { 'Authorization': `Bearer ${token}` }})
        if(res.ok){
          const data = await res.json()
          setMe(data)
        }
      }catch(e){ console.error(e) }
    }
    loadMe()
  },[token])

  function onAuth(data){
    setToken(data.access_token)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" className="w-10 h-10" />
            <div>
              <div className="text-white font-bold text-xl">SkyLearn</div>
              <div className="text-blue-300/70 text-xs">MVP vertical slice</div>
            </div>
          </div>
          <div className="text-blue-200 text-sm">
            {me? (<span>{me.email}</span>) : (<span>Not signed in</span>)}
          </div>
        </header>

        {!me && (
          <div className="max-w-4xl mx-auto">
            <Auth onAuth={onAuth} />
          </div>
        )}

        {me && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="text-white font-semibold mb-3">Chapters</div>
              <ChapterBrowser token={token} onSelect={setSelected} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              {selected ? (
                <>
                  <Practice token={token} chapter={selected} />
                  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                    <div className="text-white font-semibold mb-2">Tutor</div>
                    <Tutor token={token} chapter={selected} />
                  </div>
                </>
              ) : (
                <div className="text-blue-200">Select a chapter to start practicing and chat with the tutor.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
