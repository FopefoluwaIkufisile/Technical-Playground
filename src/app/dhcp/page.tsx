"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Wifi, XCircle, Trash2, Info, ChevronRight,
  Network
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "🌐 DORA Lab" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

interface Lease { ip: string; mac: string; expiresAt: number }

export default function DHCPPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-emerald-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Wifi className="w-3 h-3" /> DHCP · Networking
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-emerald-400 bg-clip-text text-transparent">DHCP Protocol</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">How devices automatically receive IP addresses — the DORA handshake, lease mechanics, IP pool management, and the starvation attack that can knock devices offline.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
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
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Network className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">The DORA Handshake</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">DHCP (Dynamic Host Configuration Protocol) uses a 4-step <strong className="text-white">DORA handshake</strong> to assign an IP address to a device. All initial messages are <strong className="text-white">broadcast</strong> because the client doesn&apos;t yet have an IP to use for unicast.</p>
          <div className="space-y-3">
            {[
              { step: "D — DISCOVER", from: "0.0.0.0", to: "255.255.255.255", desc: "Client broadcasts: 'I need an IP address!' No source IP yet — uses 0.0.0.0. Destination is broadcast because client doesn't know server's IP.", type: "broadcast", color: "amber" },
              { step: "O — OFFER", from: "192.168.1.1", to: "255.255.255.255", desc: "Server responds: 'Here's an offer: 192.168.1.50, for 24 hours.' Still broadcast because client has no IP yet. May contain DNS, gateway, subnet mask.", type: "broadcast", color: "blue" },
              { step: "R — REQUEST", from: "0.0.0.0", to: "255.255.255.255", desc: "Client broadcasts acceptance: 'I'm accepting the offer from server 192.168.1.1.' Broadcast tells other DHCP servers (if multiple exist) to withdraw their offers.", type: "broadcast", color: "violet" },
              { step: "A — ACKNOWLEDGE", from: "192.168.1.1", to: "192.168.1.50", desc: "Server confirms: 'IP 192.168.1.50 is yours for 24h.' NOW unicast — server knows client's IP. Lease begins. Client can now use the assigned IP.", type: "unicast", color: "emerald" },
            ].map(s => (
              <div key={s.step} className={cn("p-4 rounded-2xl border",
                s.color === "amber" ? "bg-amber-500/5 border-amber-500/20" :
                s.color === "blue" ? "bg-blue-500/5 border-blue-500/20" :
                s.color === "violet" ? "bg-violet-500/5 border-violet-500/20" :
                "bg-emerald-500/5 border-emerald-500/20"
              )}>
                <div className="flex justify-between items-center mb-2">
                  <p className={cn("text-[11px] font-black uppercase", s.color === "amber" ? "text-amber-400" : s.color === "blue" ? "text-blue-400" : s.color === "violet" ? "text-violet-400" : "text-emerald-400")}>{s.step}</p>
                  <span className={cn("text-[8px] font-black px-2 py-0.5 rounded uppercase", s.type === "broadcast" ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500")}>{s.type}</span>
                </div>
                <p className="text-[9px] font-mono text-gray-600 mb-1">{s.from} → {s.to}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">What DHCP Assigns Beyond an IP</h3>
          <p className="text-sm text-gray-400 leading-relaxed">DHCP doesn&apos;t just assign an IP address. The OFFER and ACK packets contain a rich set of <strong className="text-white">DHCP options</strong> that configure the entire network stack of the client device.</p>
          <div className="space-y-3">
            {[
              { option: "Option 1 — Subnet Mask", ex: "255.255.255.0", desc: "Defines which part of the IP is the network address and which is the host. /24 = 256 addresses." },
              { option: "Option 3 — Default Gateway", ex: "192.168.1.1", desc: "Router IP for traffic destined outside the local subnet. Without this, the client can't reach the internet." },
              { option: "Option 6 — DNS Servers", ex: "8.8.8.8, 1.1.1.1", desc: "Up to 8 DNS servers for name resolution. Providers often inject their own DNS servers here." },
              { option: "Option 51 — Lease Time", ex: "86400 seconds (24h)", desc: "How long the IP is valid before DHCP renewal is required. Home routers: 24h. ISPs: minutes to hours." },
              { option: "Option 54 — DHCP Server ID", ex: "192.168.1.1", desc: "Identifies which DHCP server made the offer. Used by client to select an offer when multiple servers respond." },
              { option: "Option 43 — Vendor Specific", ex: "Controller IP, SSID", desc: "Enterprise: used by wireless APs to receive controller address, VLAN info, and SSID configuration automatically." },
            ].map(o => (
              <div key={o.option} className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-emerald-400">{o.option}</p>
                  <code className="text-[9px] text-gray-600 font-mono">{o.ex}</code>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [leases, setLeases] = useState<Lease[]>([])
  const [step, setStep] = useState<"IDLE" | "DISCOVER" | "OFFER" | "REQUEST" | "ACKNOWLEDGE" | "FAIL">("IDLE")
  const [handshaking, setHandshaking] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [logs, setLogs] = useState<{ msg: string; type: "broadcast" | "unicast" | "system" }[]>([])

  const POOL_START = 10; const POOL_SIZE = 20
  const pool = useMemo(() => Array.from({ length: POOL_SIZE }, (_, i) => `192.168.1.${POOL_START + i}`), [])
  const available = useMemo(() => pool.filter(ip => !leases.find(l => l.ip === ip)), [leases, pool])

  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now())
      setLeases(p => p.filter(l => l.expiresAt > Date.now()))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const addLog = (msg: string, type: "broadcast" | "unicast" | "system") => setLogs(p => [{ msg, type }, ...p].slice(0, 10))

  const doDORA = async () => {
    if (handshaking) return
    setHandshaking(true); setLogs([])
    addLog("Initiating DORA handshake...", "system")
    setStep("DISCOVER"); addLog("DHCP DISCOVER: 0.0.0.0 → 255.255.255.255 (broadcast)", "broadcast")
    await new Promise(r => setTimeout(r, 1200))
    if (!available.length) { setStep("FAIL"); addLog("CRITICAL: IP pool exhausted! No offer sent.", "system"); setHandshaking(false); return }
    const ip = available[0]
    setStep("OFFER"); addLog(`DHCP OFFER: 192.168.1.1 → 255.255.255.255 | Offered: ${ip}`, "broadcast")
    await new Promise(r => setTimeout(r, 1200))
    setStep("REQUEST"); addLog(`DHCP REQUEST: 0.0.0.0 → 255.255.255.255 | Accepting: ${ip}`, "broadcast")
    await new Promise(r => setTimeout(r, 1200))
    setStep("ACKNOWLEDGE")
    const mac = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join(":")
    setLeases(p => [...p, { ip, mac: mac.toUpperCase(), expiresAt: Date.now() + 60000 }])
    addLog(`DHCP ACK: 192.168.1.1 → ${ip} (unicast) | MAC: ${mac.toUpperCase()} | Lease: 60s`, "unicast")
    await new Promise(r => setTimeout(r, 800))
    setStep("IDLE"); setHandshaking(false)
  }

  const flood = () => {
    const fakeLeases: Lease[] = available.map(ip => ({ ip, mac: Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join(":").toUpperCase(), expiresAt: Date.now() + 30000 }))
    setLeases(p => [...p, ...fakeLeases])
    addLog(`FLOOD ATTACK: ${fakeLeases.length} fake MAC addresses exhausted pool!`, "system")
  }

  const stepColor = { IDLE: "text-gray-600", DISCOVER: "text-amber-400", OFFER: "text-blue-400", REQUEST: "text-violet-400", ACKNOWLEDGE: "text-emerald-400", FAIL: "text-red-400" }

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-[24px] border-white/5 flex gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Simulate the full DORA handshake. Watch broadcast vs unicast messages. Leases expire after 60 seconds. Use <strong className="text-white">Exhaust Pool</strong> to simulate a DHCP starvation attack.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <button onClick={doDORA} disabled={handshaking} className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-sm transition-all active:scale-95">
            {handshaking ? `${step}...` : "Join Network (DORA)"}
          </button>
          <div className="space-y-2">
            {(["DISCOVER", "OFFER", "REQUEST", "ACKNOWLEDGE"] as const).map((s, i) => (
              <div key={s} className={cn("px-4 py-2.5 rounded-xl border flex justify-between items-center transition-all",
                step === s ? "bg-emerald-500/10 border-emerald-500/40" : "bg-white/3 border-white/5"
              )}>
                <span className={cn("text-[10px] font-black uppercase", step === s ? stepColor[s] : "text-gray-800")}>{i+1}. {s}</span>
                {step === s && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
              </div>
            ))}
            {step === "FAIL" && (
              <div className="px-4 py-2.5 rounded-xl border border-red-500/40 bg-red-500/10 flex justify-between">
                <span className="text-red-400 text-[10px] font-black uppercase">Pool Exhausted</span>
                <XCircle className="w-3.5 h-3.5 text-red-400" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={flood} className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-all uppercase tracking-widest">Exhaust Pool</button>
            <button onClick={() => setLeases([])} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] text-gray-600 hover:text-white transition-colors flex items-center justify-center gap-1">
              <Trash2 className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className="glass p-4 rounded-xl border-white/5">
            <p className="text-[9px] text-emerald-500 uppercase font-black mb-2">DHCP Telemetry</p>
            <div className="h-40 overflow-y-auto space-y-1">
              {logs.map((l, i) => (
                <div key={i} className={cn("text-[9px] font-mono py-1 border-b border-white/3 leading-tight",
                  l.type === "broadcast" ? "text-amber-500/70" : l.type === "unicast" ? "text-emerald-400" : "text-gray-600 italic"
                )}>{l.msg}</div>
              ))}
              {!logs.length && <p className="text-gray-800 italic text-center mt-12 text-[10px]">Awaiting frame...</p>}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="glass p-6 rounded-[32px] border-white/5">
            <div className="flex justify-between mb-5">
              <div>
                <p className="text-[10px] uppercase font-black text-gray-600">IP Address Pool</p>
                <p className="text-sm font-black">192.168.1.10 — 192.168.1.29 ({POOL_SIZE} addresses)</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-600 uppercase font-black">Available</p>
                <p className={cn("text-3xl font-black font-mono", available.length === 0 ? "text-red-400 animate-pulse" : "text-emerald-400")}>{available.length}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {pool.map(ip => {
                const lease = leases.find(l => l.ip === ip)
                const ttl = lease ? Math.max(0, Math.round((lease.expiresAt - now) / 1000)) : 0
                return (
                  <motion.div key={ip} animate={{ scale: lease ? 1.02 : 1 }}
                    className={cn("relative p-3 rounded-2xl border flex flex-col gap-1 overflow-hidden transition-all",
                      lease ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/3 border-white/5 opacity-30"
                    )}>
                    <div className={cn("w-2 h-2 rounded-full", lease ? "bg-emerald-400" : "bg-gray-800")} />
                    <p className="text-[9px] font-mono font-black text-white/80">{ip}</p>
                    <p className="text-[7px] text-gray-700 uppercase font-bold truncate">{lease ? lease.mac.slice(0, 8) + ".." : "Free"}</p>
                    {lease && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
                        <motion.div animate={{ width: `${(ttl / 60) * 100}%` }} className="h-full bg-emerald-500" />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
          {leases.length > 0 && (
            <div className="glass p-5 rounded-[24px] border-white/5">
              <p className="text-[9px] uppercase font-black text-gray-600 mb-3">Active Leases</p>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead><tr className="border-b border-white/5 text-[8px] text-gray-600 uppercase font-black">
                    <th className="py-2 text-left">IP Address</th><th className="py-2 text-left">MAC Address</th><th className="py-2 text-left">TTL</th><th className="py-2 text-left">Status</th>
                  </tr></thead>
                  <tbody>{leases.map(l => {
                    const ttl = Math.max(0, Math.round((l.expiresAt - now) / 1000))
                    return (<tr key={l.ip} className="border-b border-white/3">
                      <td className="py-2 font-mono text-emerald-400 font-black">{l.ip}</td>
                      <td className="py-2 font-mono text-gray-500">{l.mac}</td>
                      <td className="py-2 font-mono">{ttl}s</td>
                      <td className="py-2"><span className={cn("px-2 py-0.5 rounded text-[7px] font-black uppercase", ttl > 20 ? "bg-emerald-500/10 text-emerald-500" : ttl > 0 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500")}>{ttl > 0 ? "Active" : "Expired"}</span></td>
                    </tr>)
                  })}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DeepDiveTab() {
  const [active, setActive] = useState("relay")
  const topics = [
    { id: "relay", name: "DHCP Relay (Option 82)", color: "emerald",
      desc: "In enterprise networks, you don't put a DHCP server on every VLAN. A DHCP Relay Agent (usually on the router/L3 switch) forwards DISCOVER messages to a central DHCP server, even across subnets.",
      code: `// Problem: DHCP uses broadcasts (255.255.255.255)
// Broadcasts don't cross router boundaries (TTL=1 effectively)
// Solution: DHCP Relay Agent converts broadcast → unicast

// Flow with Relay Agent:
Client ──broadcast──▶ Layer 3 Switch (Relay Agent)
                           │  
                           │ Relay Agent adds:
                           │   giaddr (gateway IP = relay's interface)
                           │   Option 82 (relay info: circuit-id, remote-id)
                           │   Converts to UNICAST to DHCP server
                           ▼
                      DHCP Server (centralized, different subnet)
                           │
                           │ Uses giaddr to know which pool to use
                           │ Sends OFFER unicast back to relay
                           ▼
                      Relay Agent ──broadcast──▶ Client

// Cisco router DHCP relay:
interface GigabitEthernet0/0
  ip address 10.0.1.1 255.255.255.0
  ip helper-address 192.168.100.50  ← DHCP server IP

// Option 82 (relay information option) lets DHCP server:
// - Apply different policies per VLAN/port
// - Audit which physical port got which IP
// - Prevent rogue DHCP spoofing`,
      insight: "Option 82 is the basis for enterprise DHCP security. Some deployments use it to enforce policies: 'only assign IPs from pool X to clients connecting via port Y of switch Z'. Combined with 802.1X, ensures only authenticated devices get network access.",
    },
    { id: "renewal", name: "Lease Renewal & Rebinding", color: "blue",
      desc: "DHCP leases have a lifecycle beyond just expiry. Clients proactively attempt renewal at T1 (50% of lease time) and rebinding at T2 (87.5%) before the lease expires entirely.",
      code: `// DHCP Lease Lifecycle State Machine:

// Lease granted: IP = 192.168.1.50, Lease time = 86400s (24h)
// T1 = 43200s (50%) — RENEWING
// T2 = 75600s (87.5%) — REBINDING  

// State: BOUND (0 → T1)
//   Client is using the IP normally.

// State: RENEWING (T1 → T2)
//   Client sends DHCP REQUEST (unicast) directly to ORIGINAL server
//   Server: ACK → new lease, NAK → release and restart DORA
//   If no response by T2 → enter REBINDING

// State: REBINDING (T2 → expiry)
//   Client broadcasts DHCP REQUEST to ANY DHCP server
//   Any server can renew (if original is down)
//   If no ACK by expiry → release IP, restart DORA from DISCOVER

// State: INIT-REBOOT (client reboots)
//   Client sends REQUEST with previously-used IP (not DISCOVER)
//   Server ACKs if IP is still available → skips DISCOVER/OFFER
//   Server NAKs if IP taken → full DORA restart

// On network change (new SSID):
//   Client detects link change → releases old IP → full DORA`,
      insight: "The T1/T2 mechanism is why DHCP leases rarely actually expire in practice. A device that stays connected will silently renew every 12 hours for a 24-hour lease. You only see DORA on first connection or after a network change.",
    },
  ]
  const p = topics.find(t => t.id === active)!
  const c = p.color === "emerald" ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/20" : "text-blue-400 bg-blue-500/5 border-blue-500/20"
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
  const [expanded, setExpanded] = useState<string | null>("starvation")
  const pitfalls = [
    { id: "starvation", severity: "HIGH", color: "orange", title: "DHCP Starvation Attack",
      summary: "An attacker sends thousands of DHCP DISCOVERs with spoofed MAC addresses, exhausting the IP pool. Legitimate clients can no longer get an IP address — effectively a network-level denial of service.",
      bad: `# ❌ Unprotected DHCP server is vulnerable:
# Attacker runs a tool like 'yersinia' or writes a script:
import scapy
# Send 1000 DISCOVER messages with random MACs
for i in range(1000):
    mac = RandMAC()
    dhcp_discover = Ether(src=mac, dst="ff:ff:ff:ff:ff:ff") / \\
                    IP(src="0.0.0.0", dst="255.255.255.255") / \\
                    UDP(sport=68, dport=67) / \\
                    BOOTP(chaddr=mac) / \\
                    DHCP(options=[('message-type', 'discover')])
    sendp(dhcp_discover, iface="eth0")

# DHCP server assigns IPs to ALL of them (different MACs!)
# Pool of 254 addresses exhausted in seconds
# Real clients: "Unable to obtain IP address"`,
      good: `# ✅ DHCP Snooping — the standard defense (switch-level):
# Cisco switch configuration:
ip dhcp snooping                    # enable globally
ip dhcp snooping vlan 10,20        # on specific VLANs

interface GigabitEthernet0/1        # uplink to DHCP server
  ip dhcp snooping trust            # only trusted ports relay DHCP

interface GigabitEthernet0/2        # client ports (untrusted)
  ip dhcp snooping limit rate 15   # max 15 DHCP packets/second
  # Rate limiting defeats starvation attacks

# Dynamic ARP Inspection (DAI) — companion to DHCP Snooping:
# Records IP→MAC bindings from DHCP transactions
# Drops ARP replies that don't match DHCP snooping table
# Prevents ARP poisoning (MITM) alongside starvation defense

# Additional: 802.1X port authentication
# Require valid credentials before DHCP is even processed`,
    },
  ]
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">DHCP has no built-in authentication — any device can claim to be a DHCP server or exhaust the pool. Enterprise networks rely on <strong className="text-white">DHCP Snooping</strong> on managed switches to enforce security.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className="glass rounded-[24px] border border-orange-500/20 hover:border-orange-500/40 overflow-hidden transition-colors">
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black border bg-orange-500/20 text-orange-400 border-orange-500/30 shrink-0">{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Attack</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Defense</p><pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
