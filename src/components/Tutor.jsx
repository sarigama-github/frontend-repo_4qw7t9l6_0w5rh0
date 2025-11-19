import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function Tutor({ token, chapter }){
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])

  async function ask(){
    const res = await fetch(`${API_BASE}/api/tutor/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text: q, context_chapter_id: chapter?.id || null })
    })
    const data = await res.json()
    setItems(prev => [data, ...prev])
    setQ('')
  }

  useEffect(()=>{
    async function load(){
      const res = await fetch(`${API_BASE}/api/tutor/history`, { headers: { 'Authorization': `Bearer ${token}` }})
      const data = await res.json()
      setItems(data)
    }
    if(token) load()
  },[token])

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask a doubt..." className="flex-1 px-3 py-2 rounded bg-slate-900/70 text-blue-100 border border-slate-700" />
        <button onClick={ask} className="px-3 py-2 rounded bg-blue-600 text-white">Ask</button>
      </div>
      <div className="grid gap-3">
        {items.map(m => (
          <div key={m.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
            <div className="text-blue-200 text-sm">Q: {m.text}</div>
            <div className="text-white">A: {m.answer}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
