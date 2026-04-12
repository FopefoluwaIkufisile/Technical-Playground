"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Server, Zap, ShieldCheck, Info, ChevronRight, RefreshCw, Terminal, Globe, Layout, User, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "⚖ Load Balancer" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]
type Algorithm = "round-robin" | "least-connections" | "consistent-hashing"

interface BackendNode { id: string; activeConnections: number; isHealthy: boolean; totalRequests: number; region: string }
interface RequestPacket { id: string; userId: string; targetNodeId?: string }

export default function BalancePage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-amber-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <RefreshCw className="w-3 h-3" /> Load Balancer · Infrastructure
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-amber-400 bg-clip-text text-transparent">Load Balancer</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">How traffic is distributed across backend servers — Round Robin, Least Connections, Consistent Hashing, health checks, and what happens when a node goes down mid-request.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "simulator" && <SimulatorTab />}
            {tab === "deepdive" && <DeepDiveTab />}
            {tab === "pitfalls" && <PitfallsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

function ConceptsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><RefreshCw className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Why Load Balancers Exist</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A single server has limits — CPU, memory, network. <strong className="text-white">Load balancing</strong> horizontally distributes traffic across multiple backend instances, enabling high availability, zero-downtime deployments, and elastic scaling. The load balancer acts as the single entry point (reverse proxy).
          </p>
          <div className="space-y-3">
            {[
              { algo: "Round Robin", complexity: "O(1)", desc: "Requests go to servers 1, 2, 3, 1, 2, 3... in a cycle. Dead simple. Works well when all requests have similar cost. Fails when some requests are 100× slower — one server accumulates work.", use: "Stateless APIs, uniform workloads", color: "amber" },
              { algo: "Least Connections", complexity: "O(log n)", desc: "New request goes to the server with fewest active connections. Naturally adapts — slow backend accumulates connections and gets fewer new ones. Requires the LB to track active connection count per upstream.", use: "Long-lived connections, mixed workloads", color: "orange" },
              { algo: "Consistent Hashing", complexity: "O(log n)", desc: "Hash the request key (user ID, session, IP) to always route the same user to the same server. Minimizes cache misses. When a server is added/removed, only 1/n of keys are remapped (vs naive hash which remaps all).", use: "Session-dependent, cache-heavy systems", color: "red" },
            ].map(a => (
              <div key={a.algo} className={cn("p-4 rounded-2xl border", a.color === "amber" ? "bg-amber-500/5 border-amber-500/20" : a.color === "orange" ? "bg-orange-500/5 border-orange-500/20" : "bg-red-500/5 border-red-500/20")}>
                <div className="flex justify-between items-center mb-1.5">
                  <p className={cn("text-[10px] font-black uppercase", a.color === "amber" ? "text-amber-400" : a.color === "orange" ? "text-orange-400" : "text-red-400")}>{a.algo}</p>
                  <div className="flex items-center gap-2">
                    <code className="text-[8px] font-mono text-gray-600">{a.complexity}</code>
                    <span className="text-[8px] text-gray-700 uppercase font-black border border-white/5 px-1.5 rounded">{a.use}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">L4 vs L7 Load Balancing</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
              <p className="text-[10px] font-black text-blue-400">Layer 4 (Transport) — TCP/UDP</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Distributes based on IP address and port only. Extremely fast (near line-rate on dedicated hardware). Cannot inspect HTTP headers, paths, or cookies. Used for raw performance scenarios.</p>
              <div className="bg-black/40 p-2.5 rounded-lg font-mono text-[9px] text-gray-600">
                <p>Rule: any TCP:443 → SNAT to backend pool</p>
                <p>Does not know if it&apos;s GET /api or POST /upload</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <p className="text-[10px] font-black text-amber-400">Layer 7 (Application) — HTTP/S</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Terminates TLS, reads HTTP headers, URL paths, cookies. Can route <code className="text-white">/api/*</code> to API servers and <code className="text-white">/static/*</code> to CDN. Enables A/B routing, canary deployments, and header-based tenant routing.</p>
              <div className="bg-black/40 p-2.5 rounded-lg font-mono text-[9px] text-gray-600">
                <p className="text-amber-400">if path starts with /api → backend-pool-a</p>
                <p className="text-amber-400">if header X-Beta: true → canary-pool</p>
                <p className="text-amber-400">if cookie tenant = acme → acme-cluster</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/3 border border-white/10 space-y-1">
              <p className="text-[10px] font-black text-white">Health Checks</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Every LB runs continuous health probes. L4: TCP connect to backend. L7: HTTP GET /health → expects 200. Failed probes mark backend as unhealthy and stop routing to it until it recovers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [algo, setAlgo] = useState<Algorithm>("round-robin")
  const [nodes, setNodes] = useState<BackendNode[]>([
    { id: "NODE_01", activeConnections: 0, isHealthy: true, totalRequests: 0, region: "us-east-1" },
    { id: "NODE_02", activeConnections: 0, isHealthy: true, totalRequests: 0, region: "us-east-1" },
    { id: "NODE_03", activeConnections: 0, isHealthy: true, totalRequests: 0, region: "us-west-2" },
  ])
  const [requests, setRequests] = useState<RequestPacket[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const rrIndexRef = useRef(0)

  const addLog = (msg: string) => setLogs(p => [`[LB] ${msg}`, ...p].slice(0, 8))

  const spawnRequest = useCallback(() => {
    const userId = ["user_alice", "user_bob", "user_charlie"][Math.floor(Math.random() * 3)]
    const healthyNodes = nodes.filter(n => n.isHealthy)
    if (!healthyNodes.length) { addLog("503 Service Unavailable — all backends unhealthy"); return }

    let targetNode: BackendNode
    if (algo === "round-robin") {
      targetNode = healthyNodes[rrIndexRef.current % healthyNodes.length]
      rrIndexRef.current++
    } else if (algo === "least-connections") {
      targetNode = healthyNodes.reduce((a, b) => a.activeConnections < b.activeConnections ? a : b)
    } else {
      const hash = userId.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
      targetNode = healthyNodes[hash % healthyNodes.length]
    }

    const reqId = Math.random().toString(36).slice(2, 7).toUpperCase()
    setRequests(p => [...p, { id: reqId, userId, targetNodeId: targetNode.id }])
    setNodes(p => p.map(n => n.id === targetNode.id ? { ...n, activeConnections: n.activeConnections + 1, totalRequests: n.totalRequests + 1 } : n))
    addLog(`${reqId} → ${targetNode.id} (${algo}, ${userId})`)

    const duration = 800 + Math.random() * 1500
    setTimeout(() => {
      setRequests(p => p.filter(r => r.id !== reqId))
      setNodes(p => p.map(n => n.id === targetNode.id ? { ...n, activeConnections: Math.max(0, n.activeConnections - 1) } : n))
    }, duration)
  }, [algo, nodes])

  const blastRequests = () => { for (let i = 0; i < 5; i++) setTimeout(spawnRequest, i * 100) }

  const maxRequests = Math.max(...nodes.map(n => n.totalRequests), 1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-[28px] border-white/5 space-y-4">
            <p className="text-[9px] uppercase font-black text-gray-600">Algorithm</p>
            {(["round-robin", "least-connections", "consistent-hashing"] as Algorithm[]).map(a => (
              <button key={a} onClick={() => setAlgo(a)} className={cn("w-full px-4 py-3 rounded-xl border text-[10px] font-black uppercase text-left flex justify-between items-center transition-all",
                algo === a ? "bg-amber-500/10 border-amber-500/40 text-amber-400" : "bg-white/3 border-white/5 text-gray-700 hover:text-white"
              )}>
                {a.replace(/-/g, " ")}
                {algo === a && <span className="text-[8px] text-amber-600 font-black">ACTIVE</span>}
              </button>
            ))}
            <button onClick={spawnRequest} className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs transition-all active:scale-95">SEND REQUEST</button>
            <button onClick={blastRequests} className="w-full py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black hover:bg-amber-500/20 transition-all">BLAST × 5</button>
          </div>
          <div className="glass p-4 rounded-2xl border-white/5 h-44 overflow-y-auto">
            <p className="text-[9px] text-amber-500 uppercase font-black mb-2">Access Log</p>
            {logs.map((l, i) => <div key={i} className="text-[9px] font-mono text-gray-600 py-0.5 border-b border-white/3 truncate">{l}</div>)}
            {!logs.length && <p className="text-gray-800 italic text-center mt-12 text-[9px]">Awaiting traffic...</p>}
          </div>
        </div>

        <div className="lg:col-span-3 glass p-6 rounded-[32px] border-white/5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] uppercase font-black text-gray-600">Backend Pool</p>
              <p className="text-sm font-black">
                <span className={cn(nodes.every(n => n.isHealthy) ? "text-emerald-400" : "text-amber-400")}>{nodes.filter(n => n.isHealthy).length}/{nodes.length}</span>
                <span className="text-gray-600 font-normal"> upstream healthy</span>
              </p>
            </div>
            <button onClick={() => setNodes(p => p.map(n => ({ ...n, totalRequests: 0, activeConnections: 0 })))} className="text-[9px] text-gray-600 hover:text-white border border-white/5 px-3 py-1.5 rounded-lg transition-colors">Reset Stats</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {nodes.map(node => (
              <div key={node.id} className={cn("p-5 rounded-[24px] border transition-all", node.isHealthy ? "bg-white/3 border-white/10" : "bg-red-500/5 border-red-500/20 opacity-60")}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", node.isHealthy ? "bg-emerald-400" : "bg-red-400 animate-pulse")} />
                    <p className="text-[10px] font-black">{node.id}</p>
                  </div>
                  <button onClick={() => setNodes(p => p.map(n => n.id === node.id ? { ...n, isHealthy: !n.isHealthy, activeConnections: 0 } : n))} className={cn("text-[8px] font-black px-2 py-1 rounded-lg uppercase transition-all", node.isHealthy ? "text-red-400 bg-red-500/10 hover:bg-red-500/20" : "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20")}>
                    {node.isHealthy ? "Kill" : "Restore"}
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[8px] text-gray-600 mb-1 uppercase font-black">
                      <span>Active Connections</span>
                      <span className={cn(node.activeConnections > 0 ? "text-amber-400" : "text-gray-800")}>{node.activeConnections}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${Math.min(100, node.activeConnections * 10)}%` }} className="h-full bg-amber-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[8px] text-gray-600 mb-1 uppercase font-black">
                      <span>Total Handled</span>
                      <span className="text-white font-mono">{node.totalRequests}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${(node.totalRequests / maxRequests) * 100}%` }} className="h-full bg-indigo-500 rounded-full" />
                    </div>
                  </div>
                  <p className="text-[8px] text-gray-700 font-mono">{node.region}</p>
                  {node.activeConnections > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {requests.filter(r => r.targetNodeId === node.id).map(r => (
                        <motion.div key={r.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[7px] font-mono font-black">{r.id}</motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {algo === "consistent-hashing" && (
            <div className="mt-5 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-[10px] text-indigo-300">
              <strong className="text-white">Consistent Hashing active:</strong> user_alice, user_bob, and user_charlie always route to the same node. Kill a node and those users automatically remap to remaining nodes (1/n remapping, not all).
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DeepDiveTab() {
  const [active, setActive] = useState("health")
  const topics = [
    { id: "health", name: "Health Checks & Failover", color: "amber",
      desc: "Load balancers continuously probe backends. A failed health check removes the backend from the pool. Understanding the probe type and timing is critical to avoid false positives.",
      code: `// NGINX upstream health check config:
upstream api_servers {
  server backend1.internal:8080;
  server backend2.internal:8080;
  server backend3.internal:8080;

  # Active health checks (NGINX Plus / HAProxy)
  health_check interval=5s fails=3 passes=2 uri=/health;
  # interval: check every 5 seconds
  # fails: 3 consecutive failures → mark DOWN
  # passes: 2 consecutive successes → mark UP again
  # uri: path to probe (must return 2xx)
}

// Your /health endpoint should check:
app.get('/health', async (req, res) => {
  const checks = await Promise.all([
    db.ping(),           // DB reachable?
    cache.ping(),        // Redis alive?
    checkDiskSpace(),    // Not full?
  ])
  if (checks.every(Boolean)) {
    res.json({ status: 'healthy', timestamp: Date.now() })
  } else {
    // Return 503 → LB marks this backend unhealthy immediately
    res.status(503).json({ status: 'degraded', checks })
  }
})

// Passive health check (all LBs):
// Tracks real request failures (5xx responses, timeouts)
// Marks backend unhealthy after threshold exceeded
server backend1.internal:8080 max_fails=5 fail_timeout=30s;`,
      insight: "Your /health endpoint must actually test dependencies (DB, cache) not just return 200 trivially. A backend that's 'alive' but can't reach its database will still serve errors. Health checks should mirror real request capacity.",
    },
    { id: "session", name: "Session Affinity (Sticky Sessions)", color: "orange",
      desc: "Stateful applications (server-side sessions, in-memory caches) break under load balancing if the same user can hit different servers. Sticky sessions solve this — at a cost.",
      code: `// Problem: user logs in → session stored on Backend 1
// Next request → Backend 2 → "not logged in!" → bug

// Solution 1: Session Affinity (LB level)
// NGINX: ip_hash (routes same client IP to same backend)
upstream api { ip_hash; server b1; server b2; server b3; }
// Cons: uneven distribution (one IP may be a NAT with 10k users)

// AWS ALB: cookie-based stickiness
// LB injects AWSALB cookie → subsequent requests include it
// LB reads cookie → routes to same target

// BETTER Solution 2: Externalize session state
// Don't store session in backend memory — store in Redis
import session from 'express-session'
import RedisStore from 'connect-redis'
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
}))
// Now ALL backends share session state via Redis
// Any backend can serve any user → true horizontal scaling
// No sticky sessions needed!

// BEST Solution 3: JWT / stateless auth
// No session state at all — token is self-contained
// Bearer token → validate signature → extract claims
// Works with any backend → perfect for load-balanced APIs`,
      insight: "Sticky sessions are a band-aid. The real fix is to externalize all state to Redis, a database, or use stateless tokens (JWT). Then any backend can serve any user — true horizontal scalability with no coordination.",
    },
  ]
  const p = topics.find(t => t.id === active)!
  const c = p.color === "amber" ? "text-amber-400 bg-amber-500/5 border-amber-500/20" : "text-orange-400 bg-orange-500/5 border-orange-500/20"
  return (
    <div className="space-y-6">
      <div className="flex gap-2">{topics.map(t => (<button key={t.id} onClick={() => setActive(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold border transition-all", active === t.id ? c : "bg-white/5 border-white/10 text-gray-500 hover:text-white")}>{t.name}</button>))}</div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass p-6 rounded-[32px] border-white/5 space-y-4">
            <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
            <pre className={cn("p-5 rounded-2xl border text-xs font-mono leading-6 whitespace-pre-wrap overflow-auto", c)}>{p.code}</pre>
          </div>
          <div className={cn("glass p-6 rounded-[24px] border space-y-3", c)}>
            <p className={cn("text-[10px] font-black uppercase tracking-widest", c.split(" ")[0])}>Key Insight</p>
            <p className="text-sm text-gray-400 leading-relaxed">{p.insight}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("thundering-herd")
  const pitfalls = [
    { id: "thundering-herd", severity: "HIGH", title: "Thundering Herd After Recovery",
      summary: "When a backend recovers from an outage, the LB immediately re-adds it and floods it with all queued traffic. The backend is overwhelmed at the moment it's most fragile and fails again.",
      bad: `// ❌ Standard config: backend recovers → instant full traffic
upstream api {
  server backend1:8080;
  server backend2:8080;  // was unhealthy, just came back up
  server backend3:8080;
  # health_check passes=1;
  # After 1 success → immediately RE-ENTERs pool at full weight
}

// Scenario:
// Backend2 was down 5 minutes → 200 requests queued
// Backend2 passes health check (200 on /health, DB not warmed)
// LB: "Backend2 healthy!" → sends all 200 queued requests
// Backend2: cold JVM, cold cache, cold DB connection pool...
// Backend2: crashes again under load spike
// Repeat indefinitely (thundering herd loop)`,
      good: `// ✅ Slow start: gradually ramp up traffic to recovered backend
upstream api {
  server backend1:8080;
  server backend2:8080 slow_start=60s;  # ← NGINX Plus
  # Gradually increases weight from 0 → full over 60 seconds
  # Gives backend time to warm caches and connection pools
  
  # Also: increase passes threshold
  health_check interval=5s fails=3 passes=5;
  # Requires 5 successful probes (25s) before returning to pool
}

// HAProxy: gradual weight restore
  server backend2 127.0.0.2:8080 weight 1    # start at 1
  # operator manually increases weight over time

// Application-level: expose readiness separately from liveness
GET /health/live   → "am I alive?" (quick, no-dep check)  
GET /health/ready  → "am I ready for traffic?" (DB, cache warmed)
// K8s: readinessProbe ≠ livenessProbe  ← critical distinction`,
    },
  ]
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Load balancer pitfalls often appear under real failure conditions — thundering herds, split-brain health, and sticky session distribution skew all hide in production traffic.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className="glass rounded-[24px] border border-orange-500/20 hover:border-orange-500/40 overflow-hidden transition-colors">
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black border bg-orange-500/20 text-orange-400 border-orange-500/30 shrink-0">{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Problem</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Fix</p><pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
