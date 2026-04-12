"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Router, Send,
  Plus, Trash2, Info, ChevronRight, Network
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "🌐 NAT Lab" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

type NATEntry = { id: string; localIp: string; localPort: number; publicIp: string; publicPort: number; type: "SNAT" | "DNAT"; time: string }
type Rule = { id: string; extPort: number; intIp: string; intPort: number }

const PUBLIC_IP = "203.0.113.45"
const DEVICES = [
  { id: "laptop", name: "Laptop", ip: "192.168.1.10", icon: "💻" },
  { id: "phone", name: "Phone", ip: "192.168.1.11", icon: "📱" },
  { id: "server", name: "Backend", ip: "192.168.1.50", icon: "🖥️" },
]

export default function IPsPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-indigo-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Router className="w-3 h-3" /> IP & NAT · Networking
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-indigo-400 bg-clip-text text-transparent">IP & NAT</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">How private networks share a single public IPv4 address — SNAT for outbound traffic, DNAT for port forwarding, IPv4 exhaustion, and why NAT matters for security.</p>
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
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Network className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Private vs Public IP Space</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            IPv4 has ~4.3 billion addresses — exhausted since 2011. <strong className="text-white">NAT (Network Address Translation)</strong> solves this by allowing thousands of devices to share a single public IP using private address ranges reserved by RFC 1918.
          </p>
          <div className="space-y-3">
            {[
              { range: "10.0.0.0/8", count: "16.7 million", use: "Large enterprises, cloud VPCs, Kubernetes pods", color: "indigo" },
              { range: "172.16.0.0/12", count: "1 million", use: "Medium enterprises, Docker default bridge network", color: "blue" },
              { range: "192.168.0.0/16", count: "65,536", use: "Home routers, small offices — most common", color: "violet" },
              { range: "127.0.0.0/8", count: "loopback", use: "Localhost only — packets never leave the host", color: "gray" },
            ].map(r => (
              <div key={r.range} className={cn("p-4 rounded-2xl border",
                r.color === "indigo" ? "bg-indigo-500/5 border-indigo-500/20" : r.color === "blue" ? "bg-blue-500/5 border-blue-500/20" : r.color === "violet" ? "bg-violet-500/5 border-violet-500/20" : "bg-white/3 border-white/10"
              )}>
                <div className="flex justify-between items-center mb-1">
                  <code className="text-[11px] font-mono font-black text-white">{r.range}</code>
                  <span className="text-[9px] text-gray-600">{r.count} addresses</span>
                </div>
                <p className="text-[10px] text-gray-500">{r.use}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">SNAT vs DNAT — Two sides of NAT</h3>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
              <p className="text-indigo-400 font-black text-sm">SNAT — Source NAT (Outbound)</p>
              <p className="text-[12px] text-gray-400 leading-relaxed">When a private device makes a request, the router replaces the <strong className="text-white">source IP</strong> (192.168.1.10) with its own public IP (203.0.113.45) and a unique port. The router records this mapping so return traffic reaches the right internal host.</p>
              <div className="bg-black/40 p-3 rounded-xl font-mono text-[10px] space-y-1">
                <p><span className="text-gray-600">Original:  </span> 192.168.1.10:54321 → 8.8.8.8:443</p>
                <p><span className="text-gray-600">After SNAT:</span> <span className="text-indigo-400">203.0.113.45:41293</span> → 8.8.8.8:443</p>
                <p className="text-gray-700">{"// Router remembers: 41293 maps to 192.168.1.10:54321"}</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
              <p className="text-emerald-400 font-black text-sm">DNAT — Destination NAT (Port Forwarding)</p>
              <p className="text-[12px] text-gray-400 leading-relaxed">For inbound traffic (servers behind NAT), the router replaces the <strong className="text-white">destination IP:port</strong> based on a static rule. This is &quot;port forwarding&quot; — must be explicitly configured. Without it, external traffic is dropped.</p>
              <div className="bg-black/40 p-3 rounded-xl font-mono text-[10px] space-y-1">
                <p><span className="text-gray-600">Incoming:  </span> Internet → 203.0.113.45:80</p>
                <p><span className="text-gray-600">Rule:      </span> Port 80 → 192.168.1.50:80</p>
                <p><span className="text-gray-600">After DNAT:</span> → <span className="text-emerald-400">192.168.1.50:80</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [natTable, setNatTable] = useState<NATEntry[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [dir, setDir] = useState<"out" | "in">("out")
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const addLog = useCallback((msg: string) => setLogs(p => [msg, ...p].slice(0, 5)), [])

  const sendOutbound = useCallback(async (dev: typeof DEVICES[0]) => {
    if (running) return
    setRunning(true); setDir("out"); setActive(dev.id)
    const port = Math.floor(Math.random() * 10000) + 30000
    addLog(`${dev.ip}:443 → Internet (initiating)`)
    await new Promise(r => setTimeout(r, 800))
    const entry: NATEntry = { id: Math.random().toString(36).slice(2, 6).toUpperCase(), localIp: dev.ip, localPort: 443, publicIp: PUBLIC_IP, publicPort: port, type: "SNAT", time: new Date().toLocaleTimeString() }
    setNatTable(p => [entry, ...p].slice(0, 8))
    addLog(`SNAT: ${dev.ip}:443 → ${PUBLIC_IP}:${port}`)
    await new Promise(r => setTimeout(r, 600))
    setRunning(false); setActive(null)
  }, [running, addLog])

  const testInbound = useCallback(async (rule: Rule) => {
    if (running) return
    setRunning(true); setDir("in")
    addLog(`Internet → ${PUBLIC_IP}:${rule.extPort}`)
    await new Promise(r => setTimeout(r, 800))
    const entry: NATEntry = { id: Math.random().toString(36).slice(2, 6).toUpperCase(), localIp: rule.intIp, localPort: rule.intPort, publicIp: PUBLIC_IP, publicPort: rule.extPort, type: "DNAT", time: new Date().toLocaleTimeString() }
    setNatTable(p => [entry, ...p].slice(0, 8))
    setActive(DEVICES.find(d => d.ip === rule.intIp)?.id ?? null)
    addLog(`DNAT: ${PUBLIC_IP}:${rule.extPort} → ${rule.intIp}:${rule.intPort}`)
    await new Promise(r => setTimeout(r, 600))
    setRunning(false); setActive(null)
  }, [running, addLog])

  const testUnforwarded = async () => {
    if (running) return
    setRunning(true); setDir("in")
    const port = 9999
    addLog(`Internet → ${PUBLIC_IP}:${port} (no rule)`)
    await new Promise(r => setTimeout(r, 1000))
    addLog(`DROP: No port-forwarding rule for :${port} — packet discarded`)
    setRunning(false)
  }

  const addRule = () => {
    if (rules.length >= 3) return
    setRules(p => [...p, { id: Math.random().toString(), extPort: 8080 + p.length, intIp: "192.168.1.50", intPort: 80 }])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-[32px] border-white/5 space-y-4">
            <p className="text-[9px] uppercase font-black text-gray-600">LAN Devices (SNAT)</p>
            {DEVICES.map(dev => (
              <button key={dev.id} onClick={() => sendOutbound(dev)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-all group",
                active === dev.id && dir === "out" ? "bg-indigo-500/10 border-indigo-500/40" : "bg-white/3 border-white/5 hover:border-white/10"
              )}>
                <span className="text-xl">{dev.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-[11px] font-black">{dev.name}</p>
                  <p className="text-[9px] font-mono text-gray-600">{dev.ip}</p>
                </div>
                <Send className={cn("w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500", active === dev.id && "opacity-100 animate-pulse")} />
              </button>
            ))}
          </div>
          <div className="glass p-5 rounded-[32px] border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-[9px] uppercase font-black text-gray-600">Port Forwarding (DNAT)</p>
              <button onClick={addRule} className="text-indigo-400 hover:text-indigo-300"><Plus className="w-4 h-4" /></button>
            </div>
            {rules.map(rule => (
              <div key={rule.id} className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-2">
                <code className="text-[9px] font-mono text-gray-500 flex-1">:{rule.extPort} → {rule.intIp}:{rule.intPort}</code>
                <button onClick={() => testInbound(rule)} className="text-[9px] font-black text-emerald-400 hover:text-white transition-colors">TEST</button>
                <button onClick={() => setRules(p => p.filter(r => r.id !== rule.id))} className="text-gray-700 hover:text-red-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            {!rules.length && <p className="text-[9px] text-gray-800 italic text-center py-3">No rules — Internet traffic dropped</p>}
            <button onClick={testUnforwarded} className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-bold hover:bg-red-500/20 transition-all uppercase">Test Blocked Traffic</button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="glass p-6 rounded-[32px] border-white/5">
            <div className="flex gap-6 items-center justify-between mb-6">
              {[{ label: "LAN (Private)", sub: "192.168.1.0/24", icon: "🏠", col: "indigo" },
                { label: "NAT GATEWAY", sub: PUBLIC_IP, icon: "🔀", col: "white", center: true },
                { label: "Internet", sub: "Public", icon: "🌐", col: "emerald" }].map((z, i) => (
                <div key={i} className={cn("flex flex-col items-center gap-2 flex-1", z.center && "scale-110")}>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-xl border",
                    z.center ? "bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10"
                  )}>{z.icon}</div>
                  <div className="text-center">
                    <p className="text-[10px] font-black">{z.label}</p>
                    <p className="text-[8px] text-gray-600 font-mono">{z.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <AnimatePresence>
              {running && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center mb-4">
                  <div className={cn("px-4 py-2 rounded-full text-[10px] font-mono font-black border",
                    dir === "out" ? "border-indigo-500/40 text-indigo-400 bg-indigo-500/10" : "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                  )}>{dir === "out" ? "→ SNAT: Rewriting source IP..." : "← DNAT: Rewriting destination IP..."}</div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="glass rounded-2xl border-white/5 overflow-hidden">
              <div className="grid grid-cols-4 text-[8px] font-black uppercase text-gray-600 tracking-widest p-3 border-b border-white/5">
                <span>Private (Internal)</span><span>Public (External)</span><span>Type</span><span>Time</span>
              </div>
              <div className="divide-y divide-white/3 max-h-56 overflow-y-auto">
                {natTable.map(e => (
                  <motion.div key={e.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-4 p-3 text-[10px] font-mono hover:bg-white/3 transition-colors">
                    <span className="text-indigo-400 font-black">{e.localIp}:{e.localPort}</span>
                    <span className="text-gray-400">{e.publicIp}:{e.publicPort}</span>
                    <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded w-fit", e.type === "SNAT" ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-500/10 text-emerald-400")}>{e.type}</span>
                    <span className="text-gray-700">{e.time}</span>
                  </motion.div>
                ))}
                {!natTable.length && <div className="p-8 text-center text-[10px] text-gray-800 italic">Awaiting traffic...</div>}
              </div>
            </div>
          </div>
          <div className="glass p-5 rounded-[24px] border-white/5">
            <p className="text-[9px] uppercase font-black text-indigo-500 mb-2">Event Log</p>
            {logs.map((l, i) => <div key={i} className={cn("text-[9px] font-mono py-1 border-b border-white/3", l.includes("DROP") ? "text-red-400" : l.includes("SNAT") ? "text-indigo-400" : l.includes("DNAT") ? "text-emerald-400" : "text-gray-600")}>{l}</div>)}
            {!logs.length && <p className="text-[9px] text-gray-800 italic">Send traffic to see logs</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function DeepDiveTab() {
  const [active, setActive] = useState("ipv6")
  const topics = [
    { id: "ipv6", name: "IPv4 Exhaustion & IPv6", color: "indigo",
      desc: "IPv4's 4.3 billion addresses are exhausted. IPv6 provides 2^128 addresses — enough for every atom on Earth to have its own IP. Adoption has been slow but is accelerating.",
      code: `// IPv4: 32-bit = 2^32 = ~4.3 billion addresses
// First allocated by IANA: 1981
// Exhausted (IANA level): February 4, 2011

// Private ranges saved us temporarily (via NAT):
// RFC 1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
// But NAT breaks end-to-end connectivity model of the internet

// IPv6: 128-bit = 2^128 = 340 undecillion addresses
// 340,282,366,920,938,463,463,374,607,431,768,211,456

// IPv6 address format (128-bit, 8 groups of 16-bit hex):
2001:0db8:85a3:0000:0000:8a2e:0370:7334
// Compressed (leading zeros, consecutive zeroes as ::):
2001:db8:85a3::8a2e:370:7334  

// IPv6 features:
// ✓ No NAT needed — every device gets unique global IP
// ✓ SLAAC (Stateless Address Autoconfiguration) — no DHCP needed!
// ✓ IPSec built-in (not optional like IPv4)
// ✓ NDP (Neighbor Discovery Protocol) replaces ARP
// ✓ Larger headers but simpler (no checksums, no fragmentation by routers)

// Current adoption (2024): ~45% of Google traffic is IPv6
// Major holdback: IPv6 is not backward compatible with IPv4`,
      insight: "SLAAC (Stateless Address Autoconfiguration) lets IPv6 devices generate their own global IP from their MAC address + router prefix — no DHCP server needed at all. The router just advertises its prefix via ICMPv6 Router Advertisement.",
    },
    { id: "cgnat", name: "CGNAT & Double NAT", color: "violet",
      desc: "ISPs are running out of public IPv4 addresses for customers. Carrier-Grade NAT (CGNAT) adds ANOTHER layer of NAT at the ISP level — your public IP is still shared with hundreds of other customers.",
      code: `// Your home network without CGNAT:
[Your device] ─── [Home Router] ─── [ISP] ─── [Internet]
192.168.1.10       203.0.113.45
                   (your true public IP)

// With CGNAT (DS-Lite, NAT444):
[Your device] ─── [Home Router] ─── [CGNAT at ISP] ─── [Internet]
192.168.1.10       100.64.0.1        203.0.113.45
  (private)     (RFC 6598 shared)    (shared with 500 customers)

// CGNAT range (RFC 6598): 100.64.0.0/10
// Reserved specifically for ISP CGNAT use

// Problems with CGNAT:
// ❌ Port forwarding impossible (can't configure ISP's NAT)
// ❌ Incoming connections blocked (gaming servers, self-hosting)
// ❌ IP reputation shared — one bad actor affects all 500 customers
// ❌ VPN protocols (IPSec, L2TP) may break (need ALG)
// ❌ Diagnostic tools (traceroute) show confusing internal IPs

// Detect CGNAT: 
// curl ifconfig.me   ← your WAN IP (may be CGNAT)
// traceroute 8.8.8.8 ← if 100.64.x.x appears, you're behind CGNAT`,
      insight: "If your ISP gives you a 100.64.0.0/10 address or you can't port-forward despite configuring your router, you're behind CGNAT. The only solutions: IPv6 (addresses the root cause) or paying for a dedicated static IP.",
    },
  ]
  const p = topics.find(t => t.id === active)!
  const c = p.color === "indigo" ? "text-indigo-400 bg-indigo-500/5 border-indigo-500/20" : "text-violet-400 bg-violet-500/5 border-violet-500/20"
  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">{topics.map(t => (<button key={t.id} onClick={() => setActive(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold border transition-all", active === t.id ? c : "bg-white/5 border-white/10 text-gray-500 hover:text-white")}>{t.name}</button>))}</div>
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
  const [expanded, setExpanded] = useState<string | null>("hairpin")
  const pitfalls = [
    { id: "hairpin", severity: "MEDIUM", color: "yellow", title: "NAT Hairpinning (Loopback) — Can't Reach Own Server",
      summary: "A device on the LAN tries to access a service (e.g., web server) using the public IP or domain name. The packet goes to the router but many routers can't route it back to the LAN — the request is dropped.",
      bad: `// Setup: web server on 192.168.1.50
// Port forwarding: 203.0.113.45:80 → 192.168.1.50:80

// ❌ Problem: from inside the LAN:
curl http://203.0.113.45   ← uses public IP
// Packet reaches router
// Router sees: dest = 203.0.113.45:80 (its own public IP)
// Many consumer routers: DROP (can't hairpin back to LAN)
// Result: timeout, even though server is online and accessible from outside

// Symptoms:
// - Your site works for external users but not from home
// - API call to your public domain fails from your dev machine
// - docker compose services that reference the public URL fail
// - "Connection refused" only on your own network`,
      good: `// ✅ Fixes in order of preference:

// 1. Use private IP directly (simplest):
curl http://192.168.1.50   ← bypass public IP entirely

// 2. Add hosts file entry (dev convenience):
# /etc/hosts on your machine
192.168.1.50  myapp.example.com  ← resolves to LAN IP for you

// 3. Split-horizon DNS (enterprise scale):
// Internal DNS server: myapp.example.com → 192.168.1.50
// External DNS:        myapp.example.com → 203.0.113.45
// Clients inside LAN get private IP, outside get public

// 4. Enable NAT Loopback in router settings (if supported):
// Asus/NETGEAR: "NAT Loopback" or "Hairpin NAT" in advanced
// This lets the router handle the U-turn packet

// 5. On servers: listen on 0.0.0.0, not just external IP`,
    },
  ]
  const badge = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">NAT solves IPv4 exhaustion but introduces subtle connectivity issues. Understanding the direction of translation (SNAT=outbound, DNAT=inbound) is essential for debugging network problems.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className="glass rounded-[24px] border border-yellow-500/20 hover:border-yellow-500/40 overflow-hidden transition-colors">
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0", badge)}>{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
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
