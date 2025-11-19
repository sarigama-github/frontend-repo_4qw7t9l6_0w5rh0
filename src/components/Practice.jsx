import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function Practice({ token, chapter }){
  const [qs, setQs] = useState([])
  const [answer, setAnswer] = useState({})

  async function generate(){
    const res = await fetch(`${API_BASE}/api/questions/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter_id: chapter.id, difficulty: 'easy', count: 5 })
    })
    const data = await res.json()
    setQs(data.items || [])
    setAnswer({})
  }

  async function check(qid, idx){
    const res = await fetch(`${API_BASE}/api/questions/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: qid, option_index: idx })
    })
    const data = await res.json()
    setAnswer(a=>({...a, [qid]: data}))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-white font-semibold">Practice: {chapter.title}</div>
          <div className="text-xs text-blue-300/70">{chapter.subject} • Class {chapter.class_number}</div>
        </div>
        <button onClick={generate} className="px-3 py-2 rounded bg-blue-600 text-white">Generate Questions</button>
      </div>

      <div className="grid gap-4">
        {qs.map(q => (
          <div key={q.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="text-blue-100 mb-2">{q.content?.prompt}</div>
            <div className="grid gap-2">
              {q.content?.options?.map((opt, idx)=>(
                <button key={idx} onClick={()=>check(q.id, idx)} className="text-left px-3 py-2 rounded bg-slate-900/60 border border-slate-700 hover:border-blue-500/40">
                  {String.fromCharCode(65+idx)}. {opt}
                </button>
              ))}
            </div>
            {answer[q.id] && (
              <div className={"mt-2 text-sm " + (answer[q.id].correct? 'text-green-400' : 'text-red-400')}>
                {answer[q.id].correct? 'Correct!' : 'Not correct.'} {answer[q.id].explanation || ''}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
