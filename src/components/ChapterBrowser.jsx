import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function ChapterBrowser({ token, onSelect }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function run(){
      try{
        const res = await fetch(`${API_BASE}/api/chapters`)
        const data = await res.json()
        setItems(data)
      }catch(e){
        console.error(e)
      }finally{ setLoading(false) }
    }
    run()
  },[])

  if(loading) return <div className="text-blue-200">Loading chapters...</div>
  return (
    <div className="grid gap-3">
      {items.map(ch=> (
        <button key={ch.id} onClick={()=>onSelect(ch)} className="text-left p-4 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-blue-500/40 transition">
          <div className="text-white font-semibold">{ch.title}</div>
          <div className="text-xs text-blue-300/70">{ch.subject} • Class {ch.class_number}</div>
        </button>
      ))}
      {items.length===0 && <div className="text-blue-300">No chapters found. Add some via API or DB viewer.</div>}
    </div>
  )
}
