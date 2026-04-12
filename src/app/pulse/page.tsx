"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Activity, Wifi, Zap, AlertCircle, BarChart3, ChevronRight, Terminal, Gamepad2, SignalHigh, Info, Globe } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "📡 Live Lab" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

interface DataPoint { time: number; ping: number; isLost: boolean }

export default function PulsePage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-indigo-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-3 h-3" /> Network Latency
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-indigo-400 bg-clip-text text-transparent">Network Pulse</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">Latency, jitter, packet loss, and their real effects on user experience — RTT mechanics, TCP congestion, BBR, and why gaming and video calls fail differently.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
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
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Activity className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Latency vs Jitter vs Loss</h2>
          </div>
          <div className="space-y-3">
            {[
              { term: "Latency (RTT)", label: "Round-Trip Time", color: "indigo", desc: "Time for a packet to travel from sender to receiver and back. Determined by physical distance, number of hops, and queuing. Speed of light in fibre: ~200,000 km/s. NYC→London minimum: ~35ms." },
              { term: "Jitter", label: "Latency Variance", color: "blue", desc: "Inconsistency in packet arrival times. A 20ms average ping with ±15ms jitter means some packets take 5ms and some take 35ms. Jitter is often worse than high stable latency for real-time apps." },
              { term: "Packet Loss", label: "% Dropped Packets", color: "red", desc: "Percentage of packets that never arrive. Even 1% loss can cause significant TCP throughput degradation (TCP interprets loss as congestion). UDP apps (gaming, VoIP) experience stutters/artifacts." },
            ].map(k => (
              <div key={k.term} className={cn("p-4 rounded-2xl border", k.color === "indigo" ? "bg-indigo-500/5 border-indigo-500/20" : k.color === "blue" ? "bg-blue-500/5 border-blue-500/20" : "bg-red-500/5 border-red-500/20")}>
                <div className="flex items-center gap-2 mb-1">
                  <code className={cn("text-[10px] font-black px-2 py-0.5 rounded", k.color === "indigo" ? "bg-indigo-500/20 text-indigo-400" : k.color === "blue" ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400")}>{k.term}</code>
                  <span className="text-[9px] text-gray-600 uppercase font-black">{k.label}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Application Sensitivity Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead><tr className="border-b border-white/5 text-[8px] text-gray-600 uppercase font-black">
                <th className="py-2 text-left">App Type</th><th className="py-2">Latency</th><th className="py-2">Jitter</th><th className="py-2">Loss</th><th className="py-2 text-left">Protocol</th>
              </tr></thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { app: "Competitive FPS", lat: "CRITICAL", jit: "HIGH", loss: "HIGH", proto: "UDP (custom)" },
                  { app: "Video Call (Zoom)", lat: "HIGH", jit: "CRITICAL", loss: "MED", proto: "SRTP/UDP" },
                  { app: "Live Streaming", lat: "LOW", jit: "MED", loss: "MED", proto: "RTMP/HLS" },
                  { app: "File Download", lat: "LOW", jit: "LOW", loss: "LOW", proto: "TCP" },
                  { app: "Stock Trading", lat: "CRITICAL", jit: "HIGH", loss: "CRITICAL", proto: "TCP" },
                  { app: "DNS Query", lat: "HIGH", jit: "LOW", loss: "MED", proto: "UDP (retry)" },
                ].map(r => {
                  const c = (v: string) => v === "CRITICAL" ? "text-red-400 font-black" : v === "HIGH" ? "text-amber-400 font-bold" : v === "MED" ? "text-yellow-400" : "text-emerald-400"
                  return (
                    <tr key={r.app}>
                      <td className="py-2.5 pr-2 font-bold text-white">{r.app}</td>
                      <td className={cn("py-2.5 text-center", c(r.lat))}>{r.lat}</td>
                      <td className={cn("py-2.5 text-center", c(r.jit))}>{r.jit}</td>
                      <td className={cn("py-2.5 text-center", c(r.loss))}>{r.loss}</td>
                      <td className="py-2.5 text-gray-600 font-mono">{r.proto}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 text-[11px] text-indigo-300/70">
            <strong className="text-white">Why jitter kills video calls:</strong> Your Zoom client uses a jitter buffer to smooth playback. High jitter forces a larger buffer → more delay. If packets arrive too out-of-order, they get dropped causing voice artifacts.
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">How Latency Works — The Journey of a Packet</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { phase: "Transmission", desc: "Time to push the bits onto the wire. For 1500-byte frame at 1Gbps: 12 microseconds. Negligible at modern speeds.", time: "~μs", color: "indigo" },
            { phase: "Propagation", desc: "Speed-of-light delay through the medium. Fibre is ~67% speed of light. NYC→LA=~26ms minimum, NYC→London=~35ms minimum — physics, not fixable.", time: "~ms", color: "blue" },
            { phase: "Processing", desc: "Time at each router hop to inspect headers, make forwarding decisions, apply ACLs. Modern routers: ~1μs–1ms per hop. Traceroute shows this per-hop.", time: "~μs-ms", color: "violet" },
            { phase: "Queuing", desc: "Waiting in router/switch buffers when links are congested. This is the variable part — can spike from 0 to hundreds of ms under load. Bufferbloat is excess queuing delay.", time: "0–∞ms", color: "amber" },
          ].map(p => (
            <div key={p.phase} className={cn("p-4 rounded-2xl border space-y-2",
              p.color === "indigo" ? "bg-indigo-500/5 border-indigo-500/20" : p.color === "blue" ? "bg-blue-500/5 border-blue-500/20" : p.color === "violet" ? "bg-violet-500/5 border-violet-500/20" : "bg-amber-500/5 border-amber-500/20"
            )}>
              <div className="flex justify-between items-center">
                <p className={cn("text-[10px] font-black uppercase", p.color === "indigo" ? "text-indigo-400" : p.color === "blue" ? "text-blue-400" : p.color === "violet" ? "text-violet-400" : "text-amber-400")}>{p.phase}</p>
                <code className="text-[8px] font-mono text-gray-600">{p.time}</code>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [ping, setPing] = useState(25)
  const [jitter, setJitter] = useState(5)
  const [lossRate, setLossRate] = useState(0.0)
  const [history, setHistory] = useState<DataPoint[]>([])
  const [isLive, setIsLive] = useState(true)
  const [logs, setLogs] = useState<string[]>([])
  const [isRubberbanding, setIsRubberbanding] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const addLog = (msg: string) => setLogs(p => [`[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`, ...p].slice(0, 8))

  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => {
        const isLost = Math.random() < lossRate
        const variation = (Math.random() - 0.5) * jitter * 2
        const currentPing = Math.max(1, ping + variation)
        setHistory(prev => [...prev, { time: Date.now(), ping: currentPing, isLost }].slice(-60))
        if (isLost) { addLog("PACKET LOSS: Timeout — no echo reply"); setIsRubberbanding(true) }
        else if (currentPing > ping * 2) addLog(`SPIKE: ${currentPing.toFixed(0)}ms (+${(currentPing - ping).toFixed(0)}ms jitter)`)
        if (!isLost) setTimeout(() => setIsRubberbanding(false), 200)
      }, 150)
    } else if (timerRef.current) clearInterval(timerRef.current)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isLive, ping, jitter, lossRate])

  const stats = useMemo(() => {
    if (!history.length) return { avg: 0, min: 0, max: 0, loss: 0, jitterVal: 0 }
    const pings = history.filter(h => !h.isLost).map(h => h.ping)
    const avg = pings.reduce((a, b) => a + b, 0) / (pings.length || 1)
    const min = Math.min(...pings)
    const max = Math.max(...pings)
    const loss = (history.filter(h => h.isLost).length / history.length) * 100
    const jitterVal = pings.length > 1 ? Math.sqrt(pings.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / pings.length) : 0
    return { avg, min, max, loss, jitterVal }
  }, [history])

  const maxPing = Math.max(...history.map(h => h.ping), ping * 2, 50)

  const qualLabel = stats.avg < 30 ? { label: "Excellent", color: "text-emerald-400" } :
    stats.avg < 60 ? { label: "Good", color: "text-green-400" } :
    stats.avg < 100 ? { label: "Fair", color: "text-yellow-400" } :
    stats.avg < 200 ? { label: "Poor", color: "text-orange-400" } :
    { label: "Terrible", color: "text-red-400" }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-[24px] border-white/5 space-y-4">
            <p className="text-[9px] uppercase font-black text-gray-600">Network Conditions</p>
            {[
              { label: "Base Latency (ms)", value: ping, min: 1, max: 300, set: setPing, icon: <SignalHigh className="w-3 h-3" />, color: "indigo" },
              { label: "Jitter (ms)", value: jitter, min: 0, max: 100, set: setJitter, icon: <Zap className="w-3 h-3" />, color: "blue" },
              { label: "Packet Loss (%)", value: lossRate * 100, min: 0, max: 50, set: (v: number) => setLossRate(v / 100), icon: <AlertCircle className="w-3 h-3" />, color: "red" },
            ].map(s => (
              <div key={s.label} className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-black text-gray-600 uppercase">
                  <div className="flex items-center gap-1.5">{s.icon}{s.label}</div>
                  <span className={cn("font-mono", s.color === "indigo" ? "text-indigo-400" : s.color === "blue" ? "text-blue-400" : "text-red-400")}>{s.value.toFixed(0)}</span>
                </div>
                <input type="range" min={s.min} max={s.max} value={s.value} onChange={e => s.set(parseFloat(e.target.value))} className={cn("w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer", s.color === "indigo" ? "accent-indigo-600" : s.color === "blue" ? "accent-blue-600" : "accent-red-600")} />
              </div>
            ))}
            <button onClick={() => setIsLive(!isLive)} className={cn("w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border", isLive ? "bg-red-500/10 border-red-500/40 text-red-500" : "bg-emerald-500/10 border-emerald-500/40 text-emerald-500")}>
              {isLive ? "Disconnect" : "Connect"}
            </button>
          </div>
          <div className="glass p-4 rounded-2xl border-white/5 space-y-2">
            <p className="text-[9px] text-indigo-500 uppercase font-black">ICMP Echo Log</p>
            <div className="h-36 overflow-y-auto space-y-1">
              {logs.map((l, i) => <div key={i} className={cn("text-[9px] font-mono py-0.5 border-b border-white/3", l.includes("LOSS") ? "text-red-400" : l.includes("SPIKE") ? "text-amber-400" : "text-gray-700")}>{l}</div>)}
              {!logs.length && <p className="text-gray-800 italic text-center mt-10 text-[9px]">Awaiting link...</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase font-black text-gray-600">Live Latency Waveform</p>
                <p className={cn("text-2xl font-black", isLive ? qualLabel.color : "text-gray-700")}>{stats.avg.toFixed(0)}ms <span className="text-sm font-black">{isLive ? qualLabel.label : "Disconnected"}</span></p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Min", value: `${stats.min.toFixed(0)}ms`, color: "text-emerald-400" },
                  { label: "Avg", value: `${stats.avg.toFixed(0)}ms`, color: "text-indigo-400" },
                  { label: "Loss", value: `${stats.loss.toFixed(1)}%`, color: "text-red-400" },
                ].map(s => <div key={s.label}><p className="text-[8px] text-gray-600 uppercase font-black">{s.label}</p><p className={cn("text-lg font-black font-mono", s.color)}>{s.value}</p></div>)}
              </div>
            </div>
            <div className="h-48 flex items-end gap-0.5">
              {history.map((p, i) => (
                <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1, backgroundColor: p.isLost ? "#ef4444" : p.ping > ping * 2 ? "#f59e0b" : "#6366f1" }}
                  style={{ height: `${Math.max(4, (p.ping / maxPing) * 100)}%` }}
                  className={cn("flex-1 min-w-[3px] rounded-t-sm origin-bottom", p.isLost && "opacity-30")} />
              ))}
              {!history.length && <div className="w-full flex items-center justify-center text-gray-800 text-sm italic font-black">Connect to see live data</div>}
            </div>
          </div>
          <div className="glass p-5 rounded-[24px] border-white/5">
            <p className="text-[9px] uppercase font-black text-gray-600 mb-3">Gaming Impact Simulation</p>
            <div className="flex items-center gap-6">
              <div className={cn("w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all",
                isRubberbanding ? "border-red-500/60 bg-red-500/10" : "border-emerald-500/30 bg-emerald-500/5"
              )}>
                <Gamepad2 className={cn("w-6 h-6", isRubberbanding ? "text-red-400 animate-bounce" : "text-emerald-400")} />
              </div>
              <div>
                <p className={cn("text-sm font-black", isRubberbanding ? "text-red-400" : "text-emerald-400")}>{isRubberbanding ? "RUBBER-BANDING" : "STABLE"}</p>
                <p className="text-[11px] text-gray-600">Packet loss causes server to snap player back to last known position</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[9px] text-gray-600 uppercase font-black">Jitter σ</p>
                <p className="text-2xl font-black font-mono text-blue-400">{stats.jitterVal.toFixed(1)}<span className="text-sm">ms</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeepDiveTab() {
  const [active, setActive] = useState("bufferbloat")
  const topics = [
    { id: "bufferbloat", name: "Bufferbloat", color: "amber",
      desc: "Large buffers in routers and home gateways seemed like a good idea — never drop packets! But excess buffering creates hidden latency that spikes when links are saturated.",
      code: `// Bufferbloat: the hidden latency killer
// Traditional queue: when full → drop packets (TD/RED)
// Bufferbloat: huge buffers → packets wait instead of drop

// Scenario: you start a large file download (TCP fills buffers)
// Your video call shares the same link
// TCP floods the buffer → video call packets queue behind
// Buffer drain time: 500MB buffer at 1Mbps = 4 seconds(!)
// Your video call "freezes" while download saturates buffer

// Measurement: run a speed test + ping simultaneously
// Ping jumps from 20ms → 500ms+ = bufferbloat

// Solutions:
// 1. CoDel (Controlled Delay) — smart queue management
//    Drops packets if sojourn time > 5ms
//    Time-based not size-based = no bufferbloat

// 2. fq_codel / cake (Linux)
//    Per-flow FIFO queues + CoDel 
//    Isolates flows → download can't starve video call

// Check your router:
tc qdisc show dev eth0
// cake = excellent, fq_codel = good, pfifo_fast = may bloat`,
      insight: "Bufferbloat is why your ping spikes when you start a download. Fix: configure your router to use fq_codel or cake as the queue discipline. Most modern OpenWrt routers support this out of the box.",
    },
    { id: "rtt", name: "RTT & CDN Strategy", color: "indigo",
      desc: "Round-trip time fundamentally limits interactive performance. CDNs solve this by moving content physically closer to users. Speed of light is the hard floor.",
      code: `// RTT is the hard limit for interactive responses
// Time-to-First-Byte (TTFB) = RTT + server processing time

// Speed of light in fibre (~200,000 km/s):
// San Francisco → New York: ~2700km → ~13ms one-way
// New York → London: ~5500km → ~27ms one-way
// RTT = 2× one-way, so NY→London TCP handshake ≥ 54ms

// CDN strategy — put servers at "PoPs" near users:
// User in Frankfurt → CDN PoP in Frankfurt: ~5ms RTT
// Without CDN: → Origin in Los Angeles: ~140ms RTT

// How CDNs reduce latency:
// DNS resolution: user → nearest PoP (Anycast routing)
// Static content: cached at edge PoP
// Dynamic content: "origin shield" caches API responses
// TLS termination: at PoP, not origin (saves 2 RTTs)

// HTTP/3 + 0-RTT:
// Repeat visitors: cached TLS session → 0-RTT handshake
// First request can be sent before handshake completes
// Saves 1 full RTT on every returning user's first request`,
      insight: "For web apps, the biggest latency win isn't faster servers — it's moving them closer to users (CDN edge) and reducing round trips (HTTP/3, connection reuse). A 100ms TTFB improvement feels faster than a 100ms render improvement.",
    },
  ]
  const p = topics.find(t => t.id === active)!
  const c = p.color === "amber" ? "text-amber-400 bg-amber-500/5 border-amber-500/20" : "text-indigo-400 bg-indigo-500/5 border-indigo-500/20"
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
  const [expanded, setExpanded] = useState<string | null>("head-of-line")
  const pitfalls = [
    { id: "head-of-line", severity: "HIGH", title: "Assuming Low Ping = Good Experience",
      summary: "Ping (ICMP echo) measures round-trip of a tiny 64-byte packet with no queueing. It tells you nothing about jitter, loss, or what happens under actual load with large TCP flows.",
      bad: `// ❌ Misleading ping-based SLA:
ping 8.8.8.8
// PING 8.8.8.8: 64 bytes, icmp_seq=0, time=12.3ms
// PING 8.8.8.8: 64 bytes, icmp_seq=1, time=11.8ms
// PING 8.8.8.8: 64 bytes, icmp_seq=2, time=12.1ms
// "Great! Only 12ms."

// But during a video call + file download:
// Your ACTUAL video packets queue behind 1MB TCP segments
// Effective latency: 12ms + 500ms bufferbloat = 512ms
// Video call breaks — your "12ms ping" was useless data

// Also: ICMP is often prioritized in routers!
// Real user traffic (TCP/UDP) may get worse treatment`,
      good: `// ✅ Use proper testing tools:
// 1. Measure jitter and under-load latency:
ping -i 0.1 8.8.8.8 | awk '/time=/{print $7}'  # rapid fire

// 2. Test bufferbloat explicitly:
# Download: wget -O /dev/null http://speedtest.net/large-file
# Simultaneously: ping -i 0.1 8.8.8.8
# If ping spikes >10× — you have bufferbloat

// 3. Better tools:
# iPerf3: bidirectional throughput + jitter
iperf3 -c speedtest.example.com -P 10 --bidir
# mtr: traceroute + continuous ping = per-hop latency
mtr --report 8.8.8.8

// 4. Application-level measurement:
// Web: Navigation Timing API, Core Web Vitals
// VoIP: MOS score (Mean Opinion Score)`,
    },
  ]
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Network performance is more nuanced than a single ping number. The triad of latency + jitter + loss interacts differently for every application type.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className="glass rounded-[24px] border border-orange-500/20 hover:border-orange-500/40 overflow-hidden transition-colors">
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black border bg-orange-500/20 text-orange-400 border-orange-500/30">{p.severity}</span>
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
