"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Box, Boxes, Database, HardDrive, Network, Plus,
  Play, Trash2, Cpu, CheckCircle2, Terminal, Server, Globe,
  FileCode, ChevronRight, Info, Layers, AlertTriangle, Zap, RefreshCw
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "layers" | "simulator" | "compose"

const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "layers", label: "Image Layers" },
  { id: "simulator", label: "🐋 Simulator" },
  { id: "compose", label: "Docker Compose" },
]

export default function DockerPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-blue-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Box className="w-3 h-3" /> Docker · Containerization
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-blue-400 bg-clip-text text-transparent">
            Docker Shipyard
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            How containers work — namespaces, cgroups, image layers, volumes, networking, and how Docker Compose orchestrates multi-container applications.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "layers" && <LayersTab />}
            {tab === "simulator" && <SimulatorTab />}
            {tab === "compose" && <ComposeTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/* ════════ CONCEPTS ════════ */
function ConceptsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><Box className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Containers vs Virtual Machines</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Containers solve the <strong className="text-white">&quot;it works on my machine&quot;</strong> problem by packaging application code with all its dependencies into a single, portable unit. Unlike VMs, containers share the host OS kernel — they&apos;re not full machine emulations.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
              <p className="text-red-400 font-black text-xs uppercase">Virtual Machine</p>
              <div className="space-y-1 text-[10px] text-gray-500 font-mono">
                {["┌─ App Code ─────┐", "│ Runtime (Node) │", "│ OS (Ubuntu)    │", "│ Hypervisor     │", "└─ Host Hardware ┘"].map(l => <p key={l}>{l}</p>)}
              </div>
              <ul className="text-[11px] text-gray-500 space-y-1">
                <li>• Full OS per VM (GBs)</li>
                <li>• Boots in minutes</li>
                <li>• Strong isolation</li>
                <li>• High resource overhead</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
              <p className="text-blue-400 font-black text-xs uppercase">Docker Container</p>
              <div className="space-y-1 text-[10px] text-gray-500 font-mono">
                {["┌─ App Code ─────┐", "│ Runtime (Node) │", "│ Container Layer│", "├─ Shared Kernel ┤", "└─ Host Hardware ┘"].map(l => <p key={l}>{l}</p>)}
              </div>
              <ul className="text-[11px] text-gray-500 space-y-1">
                <li>• Shares host kernel</li>
                <li>• Starts in milliseconds</li>
                <li>• Process isolation</li>
                <li>• Minimal overhead</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">The Linux Kernel Features Docker Uses</h3>
          <div className="space-y-3">
            {[
              { feature: "Namespaces", desc: "Isolate what a process can see. Each container gets its own PID namespace (can't see host PIDs), network namespace (own IP, interfaces), mount namespace (own filesystem), UTS (own hostname), and user namespace.", color: "blue", cmd: "mount --make-private /proc/[pid]/ns/net" },
              { feature: "Control Groups (cgroups)", desc: "Limit what resources a container can use. Set CPU quotas (e.g., max 50% of one core), memory limits (e.g., 512MB max), disk I/O bandwidth, and network bandwidth per container.", color: "violet", cmd: "docker run --cpus=0.5 --memory=512m ..." },
              { feature: "Union Filesystems (OverlayFS)", desc: "Container images are built in layers — each Dockerfile instruction creates a read-only layer. A thin writable layer sits on top per container. Images share layers, minimizing disk usage.", color: "emerald", cmd: "mount -t overlay overlay /var/lib/docker/..." },
              { feature: "seccomp & AppArmor", desc: "Additional security — restrict which system calls a container can make. Blocks dangerous syscalls like ptrace, setuid, and kernel module loading from within containers.", color: "amber", cmd: "docker run --security-opt=no-new-privileges" },
            ].map(f => (
              <div key={f.feature} className={cn("p-4 rounded-2xl border",
                f.color === "blue" ? "bg-blue-500/5 border-blue-500/20" :
                f.color === "violet" ? "bg-violet-500/5 border-violet-500/20" :
                f.color === "emerald" ? "bg-emerald-500/5 border-emerald-500/20" :
                "bg-amber-500/5 border-amber-500/20"
              )}>
                <div className="flex justify-between items-start mb-1">
                  <p className={cn("text-[11px] font-black uppercase", f.color === "blue" ? "text-blue-400" : f.color === "violet" ? "text-violet-400" : f.color === "emerald" ? "text-emerald-400" : "text-amber-400")}>{f.feature}</p>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
                <code className="text-[9px] text-gray-700 font-mono mt-1 block">{f.cmd}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════ LAYERS ════════ */
function LayersTab() {
  const [activeLayer, setActiveLayer] = useState(3)
  const layers = [
    { id: 0, cmd: "FROM ubuntu:22.04", desc: "Base image — a minimal Ubuntu filesystem snapshot from Docker Hub. ~77MB. Contains the OS filesystem layout but not the full OS kernel (uses host's).", type: "base", size: "77MB" },
    { id: 1, cmd: "RUN apt-get update && apt-get install -y curl", desc: "install curl. apt-get runs package index update, downloads curl and its dependencies. This layer snapshot captures all new/changed files compared to layer 0.", type: "run", size: "+45MB" },
    { id: 2, cmd: "RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash && apt-get install -y nodejs", desc: "Install Node.js 20. Adds Node, npm, and their dependencies. This is the heaviest layer — Node.js runtime is ~120MB.", type: "run", size: "+120MB" },
    { id: 3, cmd: "WORKDIR /app", desc: "Set the working directory for subsequent instructions. Creates /app directory if it doesn't exist. No actual files changed — tiny metadata layer.", type: "meta", size: "0B" },
    { id: 4, cmd: "COPY package*.json ./", desc: "Copy package.json and package-lock.json into /app. This is a separate layer from the app code — so if only app code changes, this layer (and node_modules install) is cached.", type: "copy", size: "+2KB" },
    { id: 5, cmd: "RUN npm ci", desc: "Install exact dependencies from package-lock.json. npm ci is faster and reproducible vs npm install. This layer is cached unless package-lock.json changes (layer 4 changed).", type: "run", size: "+45MB" },
    { id: 6, cmd: "COPY . .", desc: "Copy all application source code. This changes frequently. By placing it AFTER npm ci (layer 5), we ensure node_modules layer is cached even when source changes.", type: "copy", size: "+2MB" },
    { id: 7, cmd: "EXPOSE 3000", desc: "Document that the container listens on port 3000. Doesn't actually open the port — that's done with -p 3000:3000 when running. Pure metadata.", type: "meta", size: "0B" },
    { id: 8, cmd: "CMD [\"node\", \"server.js\"]", desc: "The default command to run when the container starts. This sets the entrypoint but doesn't run it during build. Overridable with docker run ... node other.js.", type: "cmd", size: "0B" },
  ]
  const typeColor = { base: "blue", run: "violet", copy: "emerald", meta: "gray", cmd: "amber" } as const
  const colorCls = { blue: "text-blue-400 bg-blue-500/10 border-blue-500/30", violet: "text-violet-400 bg-violet-500/10 border-violet-500/30", emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", gray: "text-gray-400 bg-gray-500/10 border-gray-500/30", amber: "text-amber-400 bg-amber-500/10 border-amber-500/30" }

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-[24px] border-white/5 flex gap-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Docker images are built in <strong className="text-white">read-only layers</strong>. Each Dockerfile instruction creates a new layer. Unchanged layers are cached — only changed layers and those below them rebuild. Click a layer to inspect it.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 pb-2">Dockerfile Layers (top = built last)</p>
          {[...layers].reverse().map(layer => {
            const tc = typeColor[layer.type as keyof typeof typeColor]
            const cc = colorCls[tc]
            return (
              <button key={layer.id} onClick={() => setActiveLayer(layer.id)}
                className={cn("w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                  activeLayer === layer.id ? `${cc}` : "bg-white/3 border-white/5 hover:border-white/10"
                )}>
                <div className={cn("w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black shrink-0",
                  activeLayer === layer.id ? cc.split(" ").slice(0, 2).join(" ") : "bg-white/5"
                )}>{layer.id}</div>
                <code className="text-[11px] font-mono flex-1 truncate text-left">{layer.cmd}</code>
                <span className="text-[9px] text-gray-600 font-mono shrink-0">{layer.size}</span>
              </button>
            )
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeLayer} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="glass p-6 rounded-[32px] border-white/5 space-y-3">
              {(() => {
                const layer = layers[activeLayer]
                const tc = typeColor[layer.type as keyof typeof typeColor]
                const cc = colorCls[tc]
                return (
                  <>
                    <div className="flex items-center gap-3">
                      <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border", cc)}>{layer.type.toUpperCase()}</span>
                      <span className="text-[10px] text-gray-600 font-mono">Layer {layer.id}</span>
                    </div>
                    <pre className={cn("p-4 rounded-xl border text-xs font-mono whitespace-pre-wrap", cc)}>{layer.cmd}</pre>
                    <p className="text-sm text-gray-400 leading-relaxed">{layer.desc}</p>
                    <div className="flex gap-4 pt-2">
                      <div><p className="text-[9px] text-gray-600 uppercase font-black">Size Delta</p><p className="font-mono text-sm font-bold">{layer.size}</p></div>
                      <div><p className="text-[9px] text-gray-600 uppercase font-black">Cacheable</p><p className="font-mono text-sm font-bold">{layer.type === "meta" || layer.type === "cmd" ? "N/A" : "Yes"}</p></div>
                    </div>
                  </>
                )
              })()}
            </div>
            <div className="glass p-5 rounded-[24px] border-cyan-500/15 bg-cyan-500/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">Layer Cache Tip</p>
              <p className="text-[12px] text-gray-400 leading-relaxed">
                When a layer changes, ALL subsequent layers must rebuild. Place frequently-changing layers (like COPY . .) as late as possible. Copy dependency files (package.json) before source code, so npm install is cached when only source changes.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ════════ SIMULATOR ════════ */
type Container = { id: string; name: string; status: "running" | "stopped"; ip: string; network: string; hasVolume: boolean; data: string | null }

function SimulatorTab() {
  const [containers, setContainers] = useState<Container[]>([])
  const [useVolume, setUseVolume] = useState(false)
  const [volumeData, setVolumeData] = useState<string | null>(null)
  const [network, setNetwork] = useState("bridge-net")
  const [logs, setLogs] = useState<string[]>([])
  const addLog = (msg: string) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p].slice(0, 8))

  const deploy = () => {
    const id = Math.random().toString(36).slice(2, 7).toUpperCase()
    const c: Container = { id, name: `app_${id.toLowerCase()}`, status: "running", ip: `172.18.0.${containers.length + 2}`, network, hasVolume: useVolume, data: useVolume ? volumeData : "Temp data (no volume)" }
    setContainers(p => [...p, c])
    addLog(`Container ${c.name} started on ${network} (${c.ip})`)
  }

  const writeData = (id: string) => {
    const data = `session_${Math.random().toString(36).slice(2, 8)}`
    if (useVolume) { setVolumeData(data); addLog(`Volume write: /data/state.txt = "${data}"`) }
    else { addLog(`In-container write: /data/state.txt = "${data}" (ephemeral!)`) }
    setContainers(p => p.map(c => c.id === id ? { ...c, data } : c))
  }

  const remove = (id: string) => {
    const c = containers.find(c => c.id === id)!
    if (c.hasVolume) addLog(`Container ${id} removed — volume data preserved on host`)
    else addLog(`Container ${id} removed — all in-container data LOST`)
    setContainers(p => p.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Config */}
        <div className="space-y-4">
          <div className="glass p-6 rounded-[32px] border-white/5 space-y-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Docker Run Config</p>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase text-gray-700">Network Name</label>
              <div className="bg-black/40 border border-white/10 p-3 rounded-xl flex items-center gap-2">
                <Network className="w-3.5 h-3.5 text-blue-500" />
                <input value={network} onChange={e => setNetwork(e.target.value)} className="bg-transparent outline-none text-xs font-mono w-full" />
              </div>
            </div>
            <button onClick={() => setUseVolume(!useVolume)} className={cn("w-full flex justify-between items-center p-3 rounded-xl border transition-all",
              useVolume ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-white/5 border-white/5 text-gray-600 hover:border-white/10"
            )}>
              <div className="flex items-center gap-2"><HardDrive className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">Mount Volume (-v)</span></div>
              <div className={cn("w-2 h-2 rounded-full", useVolume ? "bg-blue-500 animate-pulse" : "bg-gray-800")} />
            </button>
            {useVolume && (
              <div className="p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl text-[10px] font-mono text-blue-400">
                -v /host/data:/container/data<br />
                <span className="text-gray-600">Host data: {volumeData ?? "empty"}</span>
              </div>
            )}
            <button onClick={deploy} className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> docker run
            </button>
          </div>

          <div className="glass p-5 rounded-[24px] border-white/5 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2"><Terminal className="w-3 h-3" />Docker Daemon</p>
            <div className="h-44 overflow-y-auto font-mono text-[9px] space-y-1">
              {logs.map((l, i) => <div key={i} className="text-gray-600 leading-tight">{l}</div>)}
              {!logs.length && <p className="text-gray-800 italic text-center mt-12">Listening...</p>}
            </div>
          </div>
        </div>

        {/* Container grid */}
        <div className="lg:col-span-3 space-y-4">
          {!containers.length && (
            <div className="glass p-16 rounded-[32px] border-white/5 flex flex-col items-center gap-4 opacity-20">
              <Boxes className="w-16 h-16" />
              <p className="text-sm font-black uppercase tracking-widest">No containers running</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {containers.map(c => (
              <motion.div key={c.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass p-5 rounded-[24px] border-blue-500/20 bg-blue-500/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-[11px] font-black text-blue-400">{c.name}</p>
                    </div>
                    <p className="text-[9px] font-mono text-gray-600">{c.ip} · {c.network}</p>
                  </div>
                  <button onClick={() => remove(c.id)} className="text-gray-700 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => writeData(c.id)} className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold hover:border-white/20 transition-colors flex items-center justify-center gap-1">
                    <FileCode className="w-3 h-3" /> Write Data
                  </button>
                  <div className={cn("flex-1 p-2 rounded-xl border text-[9px] font-mono text-center", c.hasVolume ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/5 border-red-500/15 text-red-500/70")}>
                    {c.hasVolume ? "📦 Volume" : "⚠ Ephemeral"}<br />
                    <span className="text-[8px]">{c.data ? c.data.slice(0, 12) + "..." : "no data"}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {containers.length > 0 && (
            <div className="glass p-5 rounded-[24px] border-white/5 grid grid-cols-3 gap-4 text-center">
              <div><p className="text-[9px] text-gray-600 uppercase font-black">Running</p><p className="text-2xl font-black text-blue-400">{containers.filter(c => c.status === "running").length}</p></div>
              <div><p className="text-[9px] text-gray-600 uppercase font-black">Network</p><p className="text-sm font-black">{network}</p></div>
              <div><p className="text-[9px] text-gray-600 uppercase font-black">Volume Data</p><p className="text-sm font-black font-mono">{volumeData ? volumeData.slice(0, 8) + "..." : "None"}</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ════════ COMPOSE ════════ */
function ComposeTab() {
  const [active, setActive] = useState("networking")
  const topics = [
    {
      id: "networking", name: "Services & Networking", color: "blue",
      desc: "Docker Compose defines multi-container applications in a single YAML file. All services in one Compose file automatically share a network and can reach each other by service name.",
      code: `# docker-compose.yml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"     # host:container
    environment:
      - DATABASE_URL=postgres://db:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data  # named volume!

  cache:
    image: redis:alpine
    command: redis-server --maxmemory 256mb

volumes:
  postgres_data:  # persists across container restarts

# 'web' can reach 'db' at hostname 'db' port 5432
# Because they share the default Compose network`,
      insight: "Service names become DNS hostnames on the shared network. 'web' reaches 'db' at host='db', no IPs needed. Named volumes persist data even when containers are rebuilt.",
    },
    {
      id: "health", name: "Health Checks & Depends On", color: "emerald",
      desc: "depends_on only waits for a container to start, not for the service inside to be ready. Use health checks to properly sequence startup — wait for postgres to accept connections before starting the app.",
      code: `services:
  web:
    build: .
    depends_on:
      db:
        condition: service_healthy  # wait for healthy!
      cache:
        condition: service_started  # just started is fine

  db:
    image: postgres:14
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s      # check every 5 seconds
      timeout: 3s       # fail if no response in 3s
      retries: 5        # fail after 5 consecutive failures
      start_period: 10s # don't check for first 10s (startup time)

  # Your app should still handle connection retries!
  # postgres might restart mid-run. Retry logic:
  # while True:
  #   try: db.connect(); break
  #   except: sleep(2)`,
      insight: "Even with health check-based depends_on, always implement retry logic in your application. Postgres can restart, failover, or be temporarily unavailable even after initial startup.",
    },
    {
      id: "volumes", name: "Volumes vs Bind Mounts", color: "amber",
      desc: "Two ways to persist data outside containers: named volumes (Docker managed) and bind mounts (directly maps host directory into container). Each has different use cases.",
      code: `services:
  app:
    volumes:
      # Bind mount: maps host directory into container
      # Use for dev — live code reloading!
      - ./src:/app/src              # host:container

      # Named volume: Docker manages storage location
      # Use for databases — portable, Docker-managed
      - postgres_data:/var/lib/postgresql/data

      # Anonymous volume: temporary, discarded on rm
      - /app/node_modules           # just a path = anonymous

  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:                    # declare the named volume

# $ docker volume ls               # list all volumes
# $ docker volume inspect postgres_data  # inspect
# $ docker volume rm postgres_data  # delete (data gone!)`,
      insight: "For production databases: always use named volumes. For local development with hot-reload: use bind mounts for source code. Named volumes are faster on macOS/Windows than bind mounts because they use Linux VMs.",
    },
    {
      id: "scaling", name: "Scaling & Production", color: "violet",
      desc: "Docker Compose can scale services horizontally. For production, Compose is often replaced by Kubernetes or Docker Swarm for orchestration at scale.",
      code: `# Scale a service:
docker compose up --scale web=3 -d
# Creates web_1, web_2, web_3

# But you need a load balancer:
services:
  lb:
    image: nginx:alpine
    ports: ["80:80"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on: [web]

  web:
    build: .
    # No port mapping — only lb receives external traffic
    expose: ["3000"]  # within Docker network only

# Production: use --env-file for secrets
docker compose --env-file .env.production up -d

# Graceful rolling update:
docker compose pull
docker compose up -d --no-deps --build web`,
      insight: "Compose is great for local dev and simple deployments. For production at scale, look at Docker Swarm (built-in) for multi-host deployments, or migrate to Kubernetes for full orchestration.",
    },
  ]
  const p = topics.find(t => t.id === active)!
  const colorMap: Record<string, string> = { blue: "text-blue-400 bg-blue-500/5 border-blue-500/20", emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20", amber: "text-amber-400 bg-amber-500/5 border-amber-500/20", violet: "text-violet-400 bg-violet-500/5 border-violet-500/20" }
  const c = colorMap[p.color]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {topics.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold border transition-all",
            active === t.id ? colorMap[t.color] : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
          )}>{t.name}</button>
        ))}
      </div>
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
