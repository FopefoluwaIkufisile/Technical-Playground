"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Network, Wifi, Server, Globe, CheckCircle2, XCircle,
  ArrowRight, RefreshCw, Layers, ChevronRight, Info, AlertTriangle,
  Zap, Activity, Timer, Package, ShieldCheck
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"

const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "📡 TCP vs UDP" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

export default function ProtocolsPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-violet-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Network className="w-3 h-3" /> Protocols · Networking
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-violet-400 bg-clip-text text-transparent">
            Network Protocols
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            TCP, UDP, HTTP, TLS — how data moves across networks. Handshakes, reliability guarantees, congestion control, and when to choose each protocol.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
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

/* ════════ CONCEPTS ════════ */
function ConceptsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TCP */}
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <h2 className="text-xl font-black">TCP</h2>
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Transmission Control Protocol</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            TCP provides <strong className="text-white">reliable, ordered, connection-oriented</strong> communication. Every segment is acknowledged; lost segments are retransmitted. A connection is established via a 3-way handshake before any data flows.
          </p>
          <div className="bg-black/40 p-5 rounded-2xl border border-blue-500/10 font-mono text-xs leading-7 space-y-1">
            <p className="text-blue-400">// TCP Three-Way Handshake:</p>
            <p><span className="text-gray-500">Client → Server:</span> <span className="text-white">SYN</span> <span className="text-gray-600">(seq=0)</span></p>
            <p><span className="text-gray-500">Server → Client:</span> <span className="text-white">SYN-ACK</span> <span className="text-gray-600">(seq=0, ack=1)</span></p>
            <p><span className="text-gray-500">Client → Server:</span> <span className="text-white">ACK</span> <span className="text-gray-600">(ack=1)</span></p>
            <p className="text-gray-600">// Connection established. Data can flow.</p>
            <div className="mt-2 pt-2 border-t border-white/5">
              <p className="text-blue-400">// Teardown (4-way):</p>
              <p><span className="text-gray-500">Client → Server:</span> <span className="text-white">FIN</span></p>
              <p><span className="text-gray-500">Server → Client:</span> <span className="text-white">ACK</span> <span className="text-gray-600">(half-close)</span></p>
              <p><span className="text-gray-500">Server → Client:</span> <span className="text-white">FIN</span></p>
              <p><span className="text-gray-500">Client → Server:</span> <span className="text-white">ACK</span> <span className="text-gray-600">→ TIME_WAIT</span></p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Ordered delivery", color: "emerald" },
              { label: "Loss detection & retransmit", color: "emerald" },
              { label: "Flow control (window size)", color: "blue" },
              { label: "Congestion control (slow start)", color: "blue" },
            ].map(f => (
              <div key={f.label} className={cn("p-2.5 rounded-xl border text-[10px] font-bold", f.color === "emerald" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-blue-500/5 border-blue-500/20 text-blue-400")}>{f.label}</div>
            ))}
          </div>
        </div>

        {/* UDP */}
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><Zap className="w-5 h-5" /></div>
            <div>
              <h2 className="text-xl font-black">UDP</h2>
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">User Datagram Protocol</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            UDP is <strong className="text-white">connectionless and unreliable</strong> — it sends datagrams with no handshake, no acknowledgment, and no guarantee of ordering. What you lose in reliability you gain in <strong className="text-white">speed and simplicity</strong>.
          </p>
          <div className="bg-black/40 p-5 rounded-2xl border border-amber-500/10 font-mono text-xs leading-7">
            <p className="text-amber-400">// UDP Header — only 8 bytes:</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {["Source Port (16 bit)", "Dest Port (16 bit)", "Length (16 bit)", "Checksum (16 bit)"].map(f => (
                <div key={f} className="bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1 text-[9px] text-amber-300/70">{f}</div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-gray-600">// Compare: TCP header = 20-60 bytes minimum</p>
              <p className="text-gray-600">// No connection state → no handshake overhead</p>
              <p className="text-gray-600">// No retransmit → no head-of-line blocking</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p className="font-bold text-white text-[11px] uppercase tracking-widest">Use when:</p>
            <ul className="space-y-1 text-[12px]">
              <li className="flex items-center gap-2"><span className="text-amber-400">→</span> Latency matters more than reliability (gaming, VoIP, video calls)</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">→</span> App-level error handling is simpler than TCP's (DNS)</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">→</span> Multicast/broadcast (TCP is unicast only)</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">→</span> Streaming where stale data is worse than lost data</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Side-by-Side Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-3 pr-4 text-left text-[10px] text-gray-600 uppercase font-black tracking-widest">Property</th>
                <th className="py-3 px-4 text-left text-[10px] text-blue-500 uppercase font-black tracking-widest">TCP</th>
                <th className="py-3 px-4 text-left text-[10px] text-amber-500 uppercase font-black tracking-widest">UDP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { prop: "Connection", tcp: "Connection-oriented (3-way handshake)", udp: "Connectionless (send immediately)" },
                { prop: "Reliability", tcp: "Guaranteed delivery + ordering", udp: "Best-effort, no guarantees" },
                { prop: "Speed", tcp: "Slower (acks, retransmits, flow control)", udp: "Fast (no overhead)" },
                { prop: "Header size", tcp: "20-60 bytes", udp: "8 bytes" },
                { prop: "Order", tcp: "Guaranteed in-order delivery", udp: "Packets may arrive out of order" },
                { prop: "Use cases", tcp: "HTTP, SSH, FTP, email, databases", udp: "DNS, DHCP, VoIP, gaming, streaming" },
                { prop: "QUIC?", tcp: "QUIC runs on UDP but adds TCP-like reliability", udp: "HTTP/3 uses QUIC (= UDP + TLS + multiplexing)" },
              ].map(r => (
                <tr key={r.prop}>
                  <td className="py-3 pr-4 text-[11px] text-gray-500 font-bold">{r.prop}</td>
                  <td className="py-3 px-4 text-[11px] text-blue-300">{r.tcp}</td>
                  <td className="py-3 px-4 text-[11px] text-amber-300">{r.udp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ════════ SIMULATOR ════════ */
type PktStatus = "transit" | "delivered" | "lost"
type Packet = { id: number; status: PktStatus; seq: number; retransmitted?: boolean }

function SimulatorTab() {
  const [mode, setMode] = useState<"tcp" | "udp">("tcp")
  const [packets, setPackets] = useState<Packet[]>([])
  const [lossRate, setLossRate] = useState(30)
  const [congestion, setCongestion] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [windowSize, setWindowSize] = useState(3)
  const [stats, setStats] = useState({ sent: 0, delivered: 0, retransmitted: 0, time: 0 })
  const [logs, setLogs] = useState<string[]>([])
  const addLog = (msg: string) => setLogs(p => [msg, ...p].slice(0, 6))

  const simulate = async () => {
    if (isRunning) return
    setIsRunning(true); setPackets([]); setStats({ sent: 0, delivered: 0, retransmitted: 0, time: 0 })
    setLogs([])
    const start = Date.now()
    const totalPackets = 8
    const newPackets: Packet[] = []

    for (let i = 0; i < totalPackets; i++) {
      const p: Packet = { id: i, status: "transit", seq: i + 1 }
      newPackets.push(p)
      setPackets([...newPackets])
      setStats(s => ({ ...s, sent: s.sent + 1 }))
      await new Promise(r => setTimeout(r, 180))

      // Simulate packet loss
      const isLost = Math.random() * 100 < lossRate
      if (isLost) {
        addLog(`SEQ ${p.seq}: Packet lost in transit`)
        newPackets[i] = { ...p, status: "lost" }
        setPackets([...newPackets])

        if (mode === "tcp") {
          // TCP: retransmit
          await new Promise(r => setTimeout(r, 600))
          addLog(`SEQ ${p.seq}: TCP detected loss → retransmitting...`)
          newPackets[i] = { ...p, status: "transit", retransmitted: true }
          setPackets([...newPackets])
          await new Promise(r => setTimeout(r, 300))
          newPackets[i] = { ...p, status: "delivered", retransmitted: true }
          setStats(s => ({ ...s, delivered: s.delivered + 1, retransmitted: s.retransmitted + 1 }))
          addLog(`SEQ ${p.seq}: Retransmit ✓ delivered`)
        } else {
          addLog(`SEQ ${p.seq}: UDP — loss accepted, no retransmit`)
        }
      } else {
        await new Promise(r => setTimeout(r, 200))
        newPackets[i] = { ...p, status: "delivered" }
        setStats(s => ({ ...s, delivered: s.delivered + 1 }))
        addLog(`SEQ ${p.seq}: Delivered ✓`)
      }
      setPackets([...newPackets])
    }
    setStats(s => ({ ...s, time: Math.round((Date.now() - start) / 100) / 10 }))
    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {(["tcp", "udp"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={cn("px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
              mode === m ? m === "tcp" ? "bg-blue-600 text-white" : "bg-amber-600 text-white" : "text-gray-600 hover:text-white"
            )}>{m.toUpperCase()}</button>
          ))}
        </div>
        <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl border-white/5">
          <span className="text-[10px] text-gray-600 uppercase font-black">Loss Rate</span>
          <input type="range" min="0" max="70" value={lossRate} onChange={e => setLossRate(+e.target.value)} className="w-24 accent-violet-500" />
          <span className="text-[11px] font-mono font-bold text-violet-400 w-8">{lossRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <button onClick={simulate} disabled={isRunning}
            className={cn("w-full py-4 rounded-2xl text-white font-black text-sm transition-all active:scale-95 disabled:opacity-50",
              mode === "tcp" ? "bg-blue-600 hover:bg-blue-500" : "bg-amber-600 hover:bg-amber-500"
            )}>
            {isRunning ? "Transmitting..." : `Simulate ${mode.toUpperCase()} Stream`}
          </button>
          <div className="glass p-5 rounded-2xl border-white/5 space-y-3">
            <p className="text-[9px] uppercase font-black text-gray-600 tracking-widest">Stream Stats</p>
            {[
              { label: "Sent", value: stats.sent, color: "text-white" },
              { label: "Delivered", value: stats.delivered, color: "text-emerald-400" },
              { label: "Retransmitted (TCP)", value: stats.retransmitted, color: "text-amber-400" },
              { label: "Elapsed", value: stats.time ? `${stats.time}s` : "--", color: "text-violet-400" },
            ].map(s => (
              <div key={s.label} className="flex justify-between text-[11px]">
                <span className="text-gray-600">{s.label}</span>
                <span className={cn("font-mono font-black", s.color)}>{s.value}</span>
              </div>
            ))}
          </div>
          <div className="glass p-4 rounded-xl border-white/5 h-44 overflow-auto space-y-1">
            {logs.map((l, i) => <div key={i} className="text-[9px] font-mono text-gray-600 truncate">{l}</div>)}
            {!logs.length && <p className="text-[9px] text-gray-800 italic text-center mt-14">Awaiting transmission...</p>}
          </div>
        </div>

        <div className="lg:col-span-3 glass p-6 rounded-[32px] border-white/5 space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="text-[10px] uppercase font-black text-gray-600">Packet Stream</p>
              <p className={cn("text-lg font-black", mode === "tcp" ? "text-blue-400" : "text-amber-400")}>{mode.toUpperCase()} — {mode === "tcp" ? "Reliable" : "Unreliable"}</p>
            </div>
            <div className="flex gap-2">
              {[{ label: "In transit", color: "bg-violet-500/30" }, { label: "Delivered", color: "bg-emerald-500/30" }, { label: "Lost", color: "bg-red-500/30" }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-[9px] text-gray-600">
                  <div className={cn("w-2 h-2 rounded-sm", l.color)} />{l.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-h-[280px] justify-center">
            <div className="flex gap-2 flex-wrap">
              {packets.map(p => (
                <motion.div key={p.id} layout initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className={cn("relative w-20 h-20 rounded-2xl border flex flex-col items-center justify-center gap-1 text-[9px] font-mono transition-all",
                    p.status === "transit" ? "border-violet-500/50 bg-violet-500/10 animate-pulse" :
                    p.status === "delivered" ? "border-emerald-500/30 bg-emerald-500/10" :
                    "border-red-500/30 bg-red-500/10"
                  )}>
                  <span className={cn("text-[11px] font-black", p.status === "transit" ? "text-violet-400" : p.status === "delivered" ? "text-emerald-400" : "text-red-400")}>
                    SEQ {p.seq}
                  </span>
                  <span className="text-[8px] text-gray-700">
                    {p.status === "transit" ? "→" : p.status === "delivered" ? "✓" : "✗"}
                  </span>
                  {p.retransmitted && <span className="text-[7px] text-amber-500 uppercase font-black">RETX</span>}
                </motion.div>
              ))}
              {!packets.length && (
                <div className="w-full flex items-center justify-center py-16 text-gray-800 text-sm italic font-bold">
                  Press simulate to begin transmission
                </div>
              )}
            </div>
          </div>

          {mode === "tcp" && (
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 text-[11px] text-blue-300/70 flex gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
              TCP detects loss via missing ACKs (3 duplicate ACKs triggers fast retransmit, or retransmission timer expiry). Lost packets are retransmitted; receiver buffers out-of-order segments until the gap is filled.
            </div>
          )}
          {mode === "udp" && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-300/70 flex gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
              UDP sends and forgets. If a packet is lost, it&apos;s gone — no retransmit requests. Applications like video codecs handle this: a lost video frame just means a brief artifact, which is far better than freezing while TCP waits for retransmission.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ════════ DEEP DIVE ════════ */
function DeepDiveTab() {
  const [active, setActive] = useState("handshake")
  const topics = [
    {
      id: "handshake", name: "TCP Handshake & State Machine", color: "blue",
      desc: "TCP connection lifecycle has 11 states. The 3-way handshake establishes connection; the 4-way teardown closes it gracefully. TIME_WAIT ensures delayed packets don't corrupt new connections.",
      code: `// TCP Connection State Machine (simplified)
CLOSED → LISTEN (server calls listen())
LISTEN → SYN_RCVD (SYN received from client)
         CLIENT: SYN_SENT → ESTABLISHED (ACK received)
         SERVER: SYN_RCVD → ESTABLISHED (final ACK received)

// Established — data flows bidirectionally
ESTABLISHED → FIN_WAIT_1 (local app calls close())
FIN_WAIT_1 → FIN_WAIT_2 (ACK received for FIN)
FIN_WAIT_2 → TIME_WAIT (remote FIN received)
TIME_WAIT → CLOSED (2×MSL timer expires — ~2-4 minutes)

// Why TIME_WAIT?
// 1. Ensures remote FIN was received (last ACK might be lost)
// 2. Prevents delayed packets from a closed connection
//    from poisoning a NEW connection on the same port pair
// MSL = Maximum Segment Lifetime (typically 2 minutes)`,
      insight: "TIME_WAIT is often misdiagnosed as a bug. It's a feature. Without it, a retransmitted FIN from a dead connection could ACK data from a new one. Tools like SO_REUSEADDR and SO_LINGER control this.",
    },
    {
      id: "congestion", name: "Congestion Control", color: "violet",
      desc: "TCP has built-in algorithms to avoid overwhelming the network. It starts slow, grows exponentially until hitting the threshold, then grows linearly until loss is detected.",
      code: `// TCP Congestion Control Phases (Reno algorithm)

// 1. Slow Start
cwnd = 1 MSS                    // start small
for each ACK received:
  cwnd += 1 MSS                 // doubles per RTT (exponential)
until cwnd >= ssthresh           // threshold ~65KB default

// 2. Congestion Avoidance (AIMD — Additive Increase Multiplicative Decrease)  
for each ACK received:
  cwnd += (MSS / cwnd)          // linear ~1 MSS per RTT

// 3. Loss Detection → Reaction
if (3 duplicate ACKs) {         // fast retransmit
  ssthresh = cwnd / 2
  cwnd = ssthresh + 3 MSS      // stay in congestion avoidance
}
if (timeout) {                  // severe loss
  ssthresh = cwnd / 2
  cwnd = 1 MSS                 // back to slow start!
}

// Modern: CUBIC (Linux default), BBR (Google) use RTT
// measurement instead of loss for congestion signals`,
      insight: "BBR (Bottleneck Bandwidth Round-trip propagation) avoids the loss-based model entirely. Instead of reacting to packet loss (which might be a full buffer, not network congestion), it measures actual bandwidth. Google uses it for YouTube.",
    },
    {
      id: "http", name: "HTTP/1.1 → HTTP/3", color: "emerald",
      desc: "HTTP has evolved from text-based sequential requests to binary-multiplexed streams over QUIC/UDP. Each version solves the previous one's bottlenecks.",
      code: `// HTTP/1.1 — text protocol, one request per connection
GET /index.html HTTP/1.1
Host: example.com
Connection: keep-alive          // reuse TCP connection
// Problem: HEAD-OF-LINE BLOCKING
//   Request 2 waits for Request 1 to complete

// HTTP/2 — binary, multiplexed (2015)
// Multiple streams over ONE TCP connection
// Solves HoL blocking at application layer
// Problem: TCP HoL blocking still exists
//   One lost TCP segment stalls ALL streams

// HTTP/3 — over QUIC/UDP (2022)  
// QUIC = UDP + TLS 1.3 + stream multiplexing
// Each QUIC stream is independent:
//   Lost packet in stream 1 ≠ stall stream 2
// 0-RTT handshake: TLS + transport in one round trip
// Connection migration: IP changes don't break connection
//   (mobile users switching Wi-Fi ↔ 4G)

// Connection setup comparison:
HTTP/1.1:    TCP(1.5RTT) + TLS(2RTT)    = 3.5 RTT
HTTP/2:      TCP(1.5RTT) + TLS(2RTT)    = 3.5 RTT 
HTTP/3(new): QUIC+TLS(1RTT)             = 1 RTT
HTTP/3(0RT): QUIC+TLS(0-RTT cached)     = 0 RTT!`,
      insight: "HTTP/3 was the biggest protocol change since HTTP/2. As of 2024, ~30% of all web traffic is HTTP/3. It especially matters for mobile users, where packet loss and IP changes are common.",
    },
    {
      id: "quic", name: "QUIC & Modern Transport", color: "amber",
      desc: "QUIC was built by Google and standardized as RFC 9000 in 2021. It solves TCP's fundamental limitation: being inseparable from the OS kernel, making it nearly impossible to update.",
      code: `// Why QUIC runs in user space:

// TCP limitations:
// - Lives in OS kernel → updates require OS upgrades
// - Middle boxes (NATs, firewalls) ossified TCP protocol
// - Can't add encryption to TCP headers (inspected by middleboxes)

// QUIC advantages:
// ✓ Runs in application layer → can be updated fast
// ✓ Connection ID instead of (IP, port) tuple
//   → survives IP changes (mobile handoff!)
// ✓ Built-in TLS 1.3 — everything is encrypted
// ✓ Independent stream multiplexing (no TCP HoL)
// ✓ Packet number spaces per key phase

// QUIC Connection ID (example):
// Instead of: src_ip:src_port + dst_ip:dst_port
// QUIC uses: connection_id (64-bit random, client-chosen)
// When your IP changes (Wi-Fi → 4G):
//   Same connection_id → connection survives!
//   TCP would have to reconnect from scratch (FIN + SYN)

// WebTransport (2023):
// Bidirectional streams + unreliable datagrams over QUIC
// Replaces WebSockets for high-performance web apps`,
      insight: "Connection migration is the killer feature. When you have a video call and switch from Wi-Fi to cellular, QUIC keeps the connection alive. With TCP, the call would drop and reconnect. This is why WhatsApp calls and Chrome are moving to QUIC.",
    },
  ]
  const p = topics.find(t => t.id === active)!
  const colorMap: Record<string, string> = { blue: "text-blue-400 bg-blue-500/5 border-blue-500/20", violet: "text-violet-400 bg-violet-500/5 border-violet-500/20", emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20", amber: "text-amber-400 bg-amber-500/5 border-amber-500/20" }
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

/* ════════ PITFALLS ════════ */
function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("hol")
  const pitfalls = [
    {
      id: "hol", severity: "HIGH", color: "orange",
      title: "HTTP/1.1 Head-of-Line Blocking",
      summary: "In HTTP/1.1, a browser can only make 6 parallel TCP connections per host. Within each connection, requests are strictly sequential — one slow response blocks the entire pipeline.",
      bad: `// HTTP/1.1 — sequential within a connection:
// Browser has 6 connections to api.example.com
// Each connection can only process 1 request at a time

// Connection 1: GET /critical-data → 2000ms (DB slow)
// Connection 1: GET /user-prefs   → BLOCKED until ^^^ finishes!
// Connection 2: GET /analytics    → 50ms ✓
// Browser limit: 6 connections total — any more requests queue!

// Result: slow assets block fast ones
// Workarounds: domain sharding (api2.example.com), 
//              CSS/JS bundling, inlining critical CSS`,
      good: `// HTTP/2: multiplexing over 1 TCP connection
// All requests stream simultaneously, independent
GET /critical-data → stream 1 (takes 2000ms)
GET /user-prefs   → stream 3 (50ms, not blocked)
GET /analytics    → stream 5 (50ms, not blocked)
// 2000ms total, not 2000+50+50ms

// HTTP/3: QUIC streams — even TCP HoL is gone
// One lost UDP packet doesn't stall other QUIC streams

// Use HTTP/2 or HTTP/3. Configure Nginx/CDN to enable.
// Check: chrome://net-internals/#http2
// Check: curl -I https://example.com --http3`,
    },
    {
      id: "nagle", severity: "MEDIUM", color: "yellow",
      title: "Nagle's Algorithm vs Low Latency",
      summary: "TCP's Nagle algorithm buffers small writes into larger segments to improve efficiency. Great for bulk transfer, catastrophic for latency-sensitive apps (games, SSH, real-time).",
      bad: `// Nagle's algorithm (enabled by default in TCP):
// Buffers small writes until previous ACK is received OR
// buffer size reaches MSS (typically 1460 bytes)

// Scenario: SSH client sends one keystroke = 1 byte
// Without Nagle OFF: keystroke buffered until ACK arrives
// Round trip: 50ms → 50ms delay per keypress!

// HTTP/1.1 + Nagle: "Tinygram problem"  
// Small request + response = lots of 40-byte ACKs
// Nagle buffers them → apparent latency spike`,
      good: `// Disable Nagle's algorithm for latency-sensitive sockets:
// Node.js:
const net = require('net');
const socket = new net.Socket();
socket.setNoDelay(true);  // ← TCP_NODELAY

// Python:
import socket
s = socket.socket()
s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)

// Nginx (if you're proxying WebSockets):
# proxy_http_version 1.1;  
# proxy_set_header Connection "upgrade";
# tcp_nodelay on;  # ← already default in Nginx for websockets

// Rule of thumb:
// Bulk transfer (backups, file upload) → Nagle ON (default)
// Real-time (games, SSH, WebSocket)   → TCP_NODELAY`,
    },
    {
      id: "keepalive", severity: "MEDIUM", color: "yellow",
      title: "TCP Keep-Alive vs HTTP Keep-Alive (Completely Different!)",
      summary: "There are TWO unrelated keep-alive mechanisms with the same name. Confusing them causes subtle connection drop bugs that are extremely hard to diagnose.",
      bad: `// ❌ Confusing the two:
// TCP Keep-Alive: OS-level probes to detect dead connections
//   - Enabled with SO_KEEPALIVE socket option  
//   - Default: probe after 2 hours (basically useless!)
//   - Detects that the OTHER END has crashed/rebooted

// HTTP Keep-Alive: application-level connection reuse
//   - "Connection: keep-alive" header in HTTP/1.0
//   - Default behavior in HTTP/1.1 (persistent connections)
//   - Allows multiple HTTP requests per TCP connection

// Common mistake: setting HTTP timeout too short
// Nginx default keep-alive: 65s
// AWS ELB default keep-alive: 60s
// If Nginx sends keep-alive: 65s but ALB closes at 60s
// → ALB closes connection 5s before Nginx expects → 502 errors!`,
      good: `// ✅ Configure both correctly:

// Nginx — HTTP keep-alive timeout
keepalive_timeout 75; // must be > load balancer timeout!
keepalive_requests 100; // max requests per connection

// TCP Keep-Alive for server processes:
// (useful for long-lived connections: databases, WebSockets)
// Linux sysctl:
# net.ipv4.tcp_keepalive_time    = 60     # idle before probing
# net.ipv4.tcp_keepalive_intvl   = 10     # probe interval
# net.ipv4.tcp_keepalive_probes  = 6      # probes before reset

// Node.js server:
server.keepAliveTimeout = 75000;   // must > AWS ALB 60s!
server.headersTimeout   = 76000;   // must > keepAliveTimeout!

// Rule: keepAlive(app) > keepAlive(load balancer)`,
    },
  ]
  const badge = (s: string) => s === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  const border = (c: string) => c === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-yellow-500/20 hover:border-yellow-500/40"

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-6">
        <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Networking pitfalls are especially painful because they often only appear under load in production — never in development where you&apos;re on localhost with zero latency.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className={cn("glass rounded-[24px] border overflow-hidden transition-colors", border(p.color))}>
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0", badge(p.severity))}>{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Problem</p>
                    <pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Fix</p>
                    <pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
