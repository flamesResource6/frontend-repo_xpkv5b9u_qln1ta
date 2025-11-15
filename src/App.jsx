import { useEffect, useState } from 'react'

function Badge({ children }) {
  return (
    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-200">
      {children}
    </span>
  )
}

function Stat({ label, value }) {
  return (
    <div className="p-4 bg-white/70 rounded-lg border shadow-sm">
      <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-2xl font-semibold text-gray-800">{value}</div>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <div className="group bg-white/80 hover:bg-white transition-colors border rounded-xl overflow-hidden shadow-sm">
      {project.image_url && (
        <img src={project.image_url} alt={project.name} className="w-full h-40 object-cover" />
      )}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack?.map((t, i) => (
            <Badge key={i}>{t}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" className="text-blue-600 hover:underline">Code</a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" className="text-blue-600 hover:underline">Live</a>
          )}
        </div>
      </div>
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: 'idle', msg: '' })
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'loading', msg: 'Sending...' })
    try {
      const res = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus({ type: 'success', msg: 'Sent! I will get back to you shortly.' })
      setForm({ name: '', email: '', message: '' })
    } catch (e) {
      setStatus({ type: 'error', msg: e.message })
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="border rounded-lg p-3" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        <input className="border rounded-lg p-3" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
      </div>
      <textarea className="border rounded-lg p-3 w-full" rows="4" placeholder="Message" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required />
      <button className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700">Send message</button>
      {status.type !== 'idle' && (
        <p className={`text-sm ${status.type==='error'?'text-red-600': status.type==='success'?'text-green-600':'text-gray-600'}`}>{status.msg}</p>
      )}
    </form>
  )
}

function App() {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      try {
        const p = await fetch(`${baseUrl}/profile`).then(r=>r.json())
        const pr = await fetch(`${baseUrl}/projects`).then(r=>r.json())
        setProfile(p)
        setProjects(pr)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600 text-white grid place-items-center font-bold">DJ</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile?.name || 'Django Developer'}</h1>
            <p className="text-gray-600">{profile?.title || 'Backend Engineer • Python'}</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          {(profile?.skills || ['Python','Django','DRF']).slice(0,4).map((s,i)=>(<Badge key={i}>{s}</Badge>))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        <section className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 p-6 bg-white/80 rounded-2xl border">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">
              {profile?.bio || 'Passionate Django developer focused on scalable APIs, clean architecture, and DevOps.'}
            </p>
            {profile?.social && (
              <div className="flex gap-4 mt-4 text-blue-600 text-sm">
                {profile.social.github && <a href={profile.social.github} target="_blank" className="hover:underline">GitHub</a>}
                {profile.social.linkedin && <a href={profile.social.linkedin} target="_blank" className="hover:underline">LinkedIn</a>}
                {profile.social.website && <a href={profile.social.website} target="_blank" className="hover:underline">Website</a>}
              </div>
            )}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Stat label="Years" value={profile?.years_experience ?? 5} />
            <Stat label="Projects" value={Math.max(projects.length, 3)} />
            <Stat label="Stack" value={(profile?.skills || []).length || 6} />
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Featured Projects</h2>
            <a href="/test" className="text-sm text-gray-500 hover:text-gray-700">Backend test</a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(projects?.length ? projects : [
              {name:'SaaS Platform', description:'Multi-tenant billing with Stripe', tech_stack:['Django','DRF','Stripe']},
              {name:'Analytics Dashboard', description:'Kafka + WebSockets for realtime metrics', tech_stack:['Django','Channels','Kafka']},
              {name:'Headless CMS', description:'GraphQL API with permissions', tech_stack:['Django','GraphQL']},
            ]).map((p,i)=> <ProjectCard key={i} project={p} />)}
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-white/80 rounded-2xl border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
            <ContactForm />
          </div>
          <div className="p-6 bg-white/80 rounded-2xl border">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Core Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(profile?.skills || ['Python','Django','DRF','PostgreSQL','Redis','Celery','Docker']).map((s,i)=>(
                <Badge key={i}>{s}</Badge>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center text-xs text-gray-500 py-8">
        © {new Date().getFullYear()} {profile?.name || 'Django Developer'}. Built with love for Python.
      </footer>
    </div>
  )
}

export default App
