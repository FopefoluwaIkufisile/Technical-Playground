"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Wifi, Server, CheckCircle2, AlertCircle, RefreshCw, Send, ChevronRight, Activity, Clock, Trash2, Cpu, Database, Zap, Plus, XCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type DoraStep = "DISCOVER" | "OFFER" | "REQUEST" | "ACKNOWLEDGE" | "IDLE" | "FAIL"

interface Lease {
  ip: string
  mac: string
  expiresAt: number
}

export default function DHCPPage() {
  const [step, setStep] = useState<DoraStep>("IDLE")
  const [isHandshaking, setIsHandshaking] = useState(false)
  const [logs, setLogs] = useState<{ msg: string; from: string; to: string; type: "broadcast" | "unicast" | "system"; time: string }[]>([])
  const [leases, setLeases] = useState<Lease[]>([])
  const [poolSize] = useState(20)
  const [now, setNow] = useState(Date.now())

  // IP Pool logic: 192.168.1.10 to 192.168.1.29
  const poolStart = 10
  const availableIps = useMemo(() => {
    const all = Array.from({ length: poolSize }, (_, i) => `192.168.1.${poolStart + i}`)
    return all.filter(ip => !leases.find(l => l.ip === ip))
  }, [leases, poolSize])

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now()
      setNow(currentTime)
      setLeases(prev => prev.filter(l => l.expiresAt > currentTime))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const addLog = useCallback((msg: string, from: string, to: string, type: any = "broadcast") => {
    const time = new Date().toLocaleTimeString().split(' ')[0]
    setLogs(prev => [{ msg, from, to, type, time }, ...prev].slice(0, 10))
  }, [])

  const startDHCP = async () => {
    if (isHandshaking) return
    setIsHandshaking(true)
    setLogs([])
    
    addLog("Intiating DORA Handshake...", "Client", "Network", "system")

    // 1. DISCOVER
    setStep("DISCOVER")
    addLog("DHCP Discover: Looking for server.", "0.0.0.0", "255.255.255.255", "broadcast")
    await new Promise(r => setTimeout(r, 1200))

    // 2. OFFER
    if (availableIps.length === 0) {
       setStep("FAIL")
       addLog("CRITICAL: IP Pool Exhausted. No addresses available.", "DHCP Server", "Client", "system")
       setIsHandshaking(false)
       return
    }

    const offeredIp = availableIps[0]
    setStep("OFFER")
    addLog(`DHCP Offer: Proposed ${offeredIp}`, "192.168.1.1", "0.0.0.0", "broadcast")
    await new Promise(r => setTimeout(r, 1200))

    // 3. REQUEST
    setStep("REQUEST")
    addLog(`DHCP Request: Accepting ${offeredIp}`, "0.0.0.0", "255.255.255.255", "broadcast")
    await new Promise(r => setTimeout(r, 1200))

    // 4. ACKNOWLEDGE
    setStep("ACKNOWLEDGE")
    addLog(`DHCP ACK: Lease committed for ${offeredIp}`, "192.168.1.1", offeredIp, "unicast")
    
    setLeases(prev => [...prev, {
       ip: offeredIp,
       mac: `MAC:${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
       expiresAt: Date.now() + 60000 // 60s lease
    }])

    await new Promise(r => setTimeout(r, 800))
    setIsHandshaking(false)
    setStep("IDLE")
  }

  const floodPool = () => {
     const newLeases: Lease[] = availableIps.map(ip => ({
        ip,
        mac: `MAC:FL-00-${Math.random().toString(16).substr(2, 2).toUpperCase()}`,
        expiresAt: Date.now() + 30000
     }))
     setLeases(prev => [...prev, ...newLeases])
     addLog(`FLOOD: Occupied ${newLeases.length} additional slots.`, "Admin", "Server", "system")
  }

  const myLease = leases[leases.length - 1] // Simple tracking of the "current" client for UI

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-emerald-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className={cn(
             "px-4 py-1 rounded-full border text-xs font-bold flex items-center gap-2 transition-all duration-500",
             availableIps.length === 0 ? "bg-red-500/10 border-red-500 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
           )}>
            <Wifi className={cn("w-3 h-3", isHandshaking && "animate-pulse")} />
            POOL STATUS: {availableIps.length === 0 ? "EXHAUSTED" : `${availableIps.length} AVAILABLE`}
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls & Handshake */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Pool</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">IP Management Lab</p>
              </header>

              <div className="space-y-4">
                 <button 
                   onClick={startDHCP} disabled={isHandshaking}
                   className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
                 >
                   {isHandshaking ? "Handshaking..." : "Join Network (DORA)"}
                 </button>

                 <div className="pt-6 border-t border-white/5 space-y-3">
                    <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest">Protocol Handshake</label>
                    {(["DISCOVER", "OFFER", "REQUEST", "ACKNOWLEDGE"] as DoraStep[]).map((s, i) => (
                       <div key={s} className={cn(
                          "px-4 py-3 rounded-xl border flex items-center justify-between transition-all",
                          step === s ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-white/5 border-white/5 text-gray-800"
                       )}>
                          <span className="text-[10px] font-bold">{i+1}. {s}</span>
                          <div className={cn("w-1.5 h-1.5 rounded-full", step === s ? "bg-emerald-500 animate-ping" : "bg-gray-900")} />
                       </div>
                    ))}
                    {step === "FAIL" && (
                       <div className="px-4 py-3 rounded-xl border border-red-500 bg-red-500/10 text-red-500 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase">Pool Full: Fail</span>
                          <XCircle className="w-4 h-4" />
                       </div>
                    )}
                 </div>
                 
                 <div className="pt-4 space-y-2">
                    <button onClick={floodPool} className="w-full py-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-all uppercase tracking-widest">Exhaust IP Pool</button>
                    <button onClick={() => setLeases([])} className="w-full py-2 text-[9px] text-gray-700 hover:text-white transition-colors flex items-center justify-center gap-2 font-black">
                       <Trash2 className="w-3 h-3" /> PURGE LEASES
                    </button>
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-emerald-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500">Handshake Telemetry</h3>
              </div>
              <div className="space-y-1 h-36 overflow-y-auto custom-scrollbar font-mono text-[9px] tracking-tight">
                 {logs.map((l, i) => (
                    <div key={i} className={cn(
                       "p-2 rounded border-l-2 bg-white/5",
                       l.type === "broadcast" ? "border-amber-500/40 text-amber-500/70" : 
                       l.type === "unicast" ? "border-emerald-500 text-emerald-400" : "border-gray-700 text-gray-600 italic"
                    )}>
                       <div className="flex justify-between items-center opacity-40 mb-1">
                          <span>{l.from} → {l.to}</span>
                          <span>{l.type.toUpperCase()}</span>
                       </div>
                       {l.msg}
                    </div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-12 lowercase">awaiting frame...</p>}
              </div>
           </div>
        </section>

        {/* IP Map & Visualization */}
        <section className="lg:col-span-3 space-y-6">
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 relative flex flex-col gap-10 min-h-[450px] sm:min-h-[550px] overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Database className="w-64 h-64" />
              </div>

              {/* Pool Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 relative z-10">
                 {Array.from({ length: poolSize }).map((_, i) => {
                    const ip = `192.168.1.${poolStart + i}`
                    const lease = leases.find(l => l.ip === ip)
                    const active = lease !== undefined
                    return (
                       <motion.div 
                         key={ip} 
                         animate={{ scale: active ? 1.02 : 1, opacity: active ? 1 : 0.4 }}
                         className={cn(
                          "relative p-4 rounded-2xl border transition-all duration-500 flex flex-col justify-between h-28 overflow-hidden",
                          active ? "bg-emerald-500/10 border-emerald-500/40 shadow-xl" : "bg-white/5 border-white/5"
                        )}
                       >
                          <div className="flex justify-between items-start">
                             <div className={cn("p-1.5 rounded-lg bg-black/40", active ? "text-emerald-400" : "text-gray-800")}>
                                <Wifi className="w-3.5 h-3.5" />
                             </div>
                             {active && <span className="text-[8px] font-black text-emerald-500/50 uppercase italic tracking-tighter">LEA_ACT</span>}
                          </div>
                          
                          <div className="space-y-1">
                             <p className="text-[10px] font-mono text-white/90">{ip}</p>
                             <p className="text-[8px] text-gray-700 font-bold uppercase truncate">{active ? lease.mac : "Available"}</p>
                          </div>

                          {active && (
                             <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                                <motion.div 
                                  initial={false}
                                  animate={{ width: `${Math.max(0, (lease.expiresAt - now) / 600)}%` }}
                                  className="h-full bg-emerald-500"
                                />
                             </div>
                          )}
                       </motion.div>
                    )
                 })}
              </div>

              {/* Lease Metadata HUD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5 relative z-10">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-emerald-500" />
                       <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Lease Life-cycle (TTL)</h3>
                    </div>
                    {myLease ? (
                       <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-[32px] flex items-center justify-between">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                <CheckCircle2 className="w-6 h-6 border-none" />
                             </div>
                             <div>
                                <p className="text-sm font-black italic tracking-tight">{myLease.ip}</p>
                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Lease Active: 60s Global Default</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black italic tracking-tighter text-white">
                                {Math.max(0, Math.round((myLease.expiresAt - now) / 1000))}s
                             </p>
                             <p className="text-[8px] font-black uppercase text-gray-700 tracking-widest">Release Pending</p>
                          </div>
                       </div>
                    ) : (
                       <div className="h-24 border border-dashed border-white/10 rounded-[32px] flex items-center justify-center text-gray-700 gap-3">
                          <AlertCircle className="w-5 h-5 opacity-20" />
                          <p className="text-[10px] font-bold uppercase tracking-widest italic leading-none">Awaiting Request Frame...</p>
                       </div>
                    )}
                 </div>

                 <div className="bg-white/5 rounded-[32px] border border-white/5 p-8 flex gap-6">
                    <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center text-gray-600 border border-white/5 shrink-0">
                       <Cpu className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-xs font-black uppercase text-gray-400">Lease Collision & Pool Control</h4>
                       <p className="text-[10px] text-gray-600 leading-relaxed font-light font-sans">
                          A DHCP server maintains a stateful <b>Pool Map</b>. If multiple devices <span className="text-emerald-500">DISCOVER</span> at once, the server ensures no two devices get the same <span className="text-white italic">192.168.1.x</span> address. When a lease expires, the IP is automatically returned to the pool for the next client.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function Terminal({ className, children }: any) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex gap-1.5 mb-2 px-1">
        <div className="w-2 h-2 rounded-full bg-red-500/20" />
        <div className="w-2 h-2 rounded-full bg-amber-500/20" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
      </div>
      {children}
    </div>
  )
}
