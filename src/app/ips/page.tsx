"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Laptop, Smartphone, Tablet, Router, Globe, Send, History, Info, ChevronRight, Share2, Lock, Plus, Trash2, Server, BarChart3, Gamepad } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type NATEntry = {
  id: string
  localIp: string
  localPort: number
  publicIp: string
  publicPort: number
  timestamp: string
  type: "SNAT" | "DNAT"
}

type ForwardingRule = {
  id: string
  externalPort: number
  internalIp: string
  internalPort: number
}

const devices = [
  { id: "laptop", name: "Laptop", ip: "192.168.1.10", icon: <Laptop /> },
  { id: "phone", name: "Phone", ip: "192.168.1.11", icon: <Smartphone /> },
  { id: "server", name: "Back-end", ip: "192.168.1.50", icon: <Server /> }
]

export default function IPsPage() {
  const publicIP = "203.0.113.45"
  const [natTable, setNatTable] = useState<NATEntry[]>([])
  const [rules, setRules] = useState<ForwardingRule[]>([])
  const [isTraffic, setIsTraffic] = useState(false)
  const [trafficDir, setTrafficDir] = useState<"in" | "out">("out")
  const [activeDevice, setActiveDevice] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => setLogs(p => [msg, ...p].slice(0, 5))

  const sendOutbound = (deviceId: string) => {
    if (isTraffic) return
    setIsTraffic(true)
    setTrafficDir("out")
    setActiveDevice(deviceId)
    
    const device = devices.find(d => d.id === deviceId)!
    const localPort = 443
    const publicPort = Math.floor(Math.random() * 10000) + 30000
    
    addLog(`Outbound from ${device.ip}: ${localPort} -> Gateway`)
    
    const newEntry: NATEntry = {
       id: Math.random().toString(36).substr(2, 5).toUpperCase(),
       localIp: device.ip,
       localPort,
       publicIp: publicIP,
       publicPort,
       timestamp: new Date().toLocaleTimeString().split(' ')[0],
       type: "SNAT"
    }

    setNatTable(prev => [newEntry, ...prev].slice(0, 10))
    
    setTimeout(() => {
       addLog(`Router translated to ${publicIP}:${publicPort}`)
       setTimeout(() => {
          setIsTraffic(false)
          setActiveDevice(null)
       }, 1000)
    }, 1000)
  }

  const sendInbound = (port: number) => {
    if (isTraffic) return
    setIsTraffic(true)
    setTrafficDir("in")
    addLog(`External request hitting ${publicIP}:${port}`)

    const rule = rules.find(r => r.externalPort === port)
    
    setTimeout(() => {
       if (rule) {
          addLog(`Rule match found! Forwarding to ${rule.internalIp}:${rule.internalPort}`)
          setActiveDevice(devices.find(d => d.ip === rule.internalIp)?.id || null)
          
          const newEntry: NATEntry = {
            id: Math.random().toString(36).substr(2, 5).toUpperCase(),
            localIp: rule.internalIp,
            localPort: rule.internalPort,
            publicIp: publicIP,
            publicPort: port,
            timestamp: new Date().toLocaleTimeString().split(' ')[0],
            type: "DNAT"
          }
          setNatTable(prev => [newEntry, ...prev].slice(0, 10))
       } else {
          addLog(`DROP: No Port Forwarding rule for port ${port}. Request blocked.`)
       }
       
       setTimeout(() => {
          setIsTraffic(false)
          setActiveDevice(null)
       }, 1500)
    }, 1000)
  }

  const addRule = () => {
     if (rules.length >= 3) return
     const newRule: ForwardingRule = {
        id: Math.random().toString(),
        externalPort: 8080 + rules.length,
        internalIp: "192.168.1.50",
        internalPort: 80
     }
     setRules([...rules, newRule])
     addLog(`Configured rule: Public ${newRule.externalPort} -> ${newRule.internalIp}:80`)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-indigo-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium flex items-center gap-2">
            <Router className="w-3 h-3 animate-pulse" />
            Infrastructure Lab: NAT
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Network & Rules */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Gateway</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">IP Translation Lab</p>
              </header>

              <div className="space-y-3">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Private LAN Devices</label>
                 {devices.map(device => (
                    <button 
                       key={device.id} 
                       onClick={() => sendOutbound(device.id)}
                       className={cn(
                          "w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98] group",
                          activeDevice === device.id && trafficDir === "out" ? "bg-indigo-500/20 border-indigo-500/50" : "bg-white/5 border-white/5 hover:border-white/20"
                       )}
                    >
                       <div className="flex items-center gap-4">
                          <div className={cn("p-2 rounded-lg bg-black/20 text-indigo-400", activeDevice === device.id && "animate-pulse")}>
                             {device.icon}
                          </div>
                          <div className="text-left">
                             <p className="text-xs font-bold">{device.name}</p>
                             <p className="text-[9px] font-mono text-gray-500 italic uppercase">{device.ip}</p>
                          </div>
                       </div>
                       <Send className="w-3 h-3 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                 ))}
              </div>
           </div>

           {/* Port Forwarding Section */}
           <div className="glass p-6 rounded-3xl border-indigo-500/10 space-y-4">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <History className="w-3 h-3 text-indigo-400" />
                    <h3 className="text-[10px] font-bold uppercase text-gray-500">Port Forwarding (DNAT)</h3>
                 </div>
                 <button onClick={addRule} className="text-indigo-400 hover:text-indigo-300"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                 {rules.map(rule => (
                    <div key={rule.id} className="p-3 bg-white/5 border border-indigo-500/20 rounded-xl flex justify-between items-center">
                       <span className="text-[10px] font-mono text-gray-400">P:{rule.externalPort} → {rule.internalIp}:80</span>
                       <button onClick={() => sendInbound(rule.externalPort)} className="text-[10px] font-bold text-indigo-400 hover:text-white transition-colors">TEST</button>
                    </div>
                 ))}
                 {rules.length === 0 && <p className="text-center py-4 text-[9px] text-gray-800 italic uppercase font-bold tracking-widest">No Inbound Rules</p>}
              </div>
           </div>
        </section>

        {/* Visualizer */}
        <section className="lg:col-span-3 space-y-6">
            <div className="flex-1 glass rounded-[40px] border-white/5 relative p-6 sm:p-10 md:p-12 overflow-hidden flex flex-col gap-12 min-h-[400px] sm:min-h-[500px]">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Share2 className="w-64 h-64" />
              </div>

              {/* Network Topology */}
              <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-0 relative z-10">
                 <div className={cn(
                    "w-full lg:basis-1/3 p-6 sm:p-8 rounded-[32px] border transition-all duration-700",
                    activeDevice && trafficDir === "out" ? "bg-indigo-500/10 border-indigo-500/50" : "bg-white/5 border-white/5"
                 )}>
                    <History className="w-8 h-8 text-indigo-400 mb-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">LAN Infrastructure</h3>
                    <p className="text-[10px] font-mono text-indigo-500/70">PRIVATE: 192.168.1.0/24</p>
                 </div>

                 <div className="w-full lg:basis-1/3 flex flex-col items-center gap-6">
                    <motion.div 
                       animate={{ 
                          scale: isTraffic ? 1.05 : 1,
                          rotate: isTraffic ? 360 : 0
                       }}
                       className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-600 shadow-[0_0_50px_rgba(79,70,229,0.2)] flex items-center justify-center relative border-t border-white/20"
                    >
                       <Router className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </motion.div>
                    <div className="text-center">
                       <p className="text-[10px] font-black uppercase text-white tracking-widest italic leading-none">NAT GATEWAY</p>
                       <p className="text-[11px] font-bold text-indigo-400 mt-1">{publicIP}</p>
                    </div>
                 </div>

                 <div className="w-full lg:basis-1/3 p-6 sm:p-8 rounded-[32px] border border-white/5 bg-white/5 flex flex-col items-center lg:items-end text-center lg:text-right">
                    <Globe className="w-8 h-8 text-emerald-400 mb-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Public Internet</h3>
                    <button onClick={() => sendInbound(8080)} className="mt-2 text-[9px] font-black text-emerald-400 hover:text-white transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">SEND EXT REQ (8080)</button>
                 </div>

                 {/* Packet Animation */}
                 <AnimatePresence>
                    {isTraffic && (
                       <motion.div 
                         initial={{ x: trafficDir === "out" ? -150 : 150, opacity: 0 }}
                         animate={{ x: trafficDir === "out" ? 150 : -150, opacity: [0, 1, 1, 0] }}
                         transition={{ duration: 2 }}
                         className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none"
                       >
                          <div className={cn(
                             "px-4 py-2 rounded-2xl glass border font-mono text-[9px] flex items-center gap-2",
                             trafficDir === "out" ? "border-indigo-500/50 text-indigo-400" : "border-emerald-500/50 text-emerald-400"
                          )}>
                             <Laptop className="w-3 h-3 animate-pulse" />
                             {trafficDir === "out" ? "OUTBOUND PKT" : "INBOUND PKT"}
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

               {/* Translation Table */}
               <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 flex flex-col overflow-hidden relative z-10 overflow-x-auto no-scrollbar">
                 <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <BarChart3 className="w-3 h-3 text-indigo-400" />
                       <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">NAT Mapping Table</h3>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 ring-1 ring-white/5 px-2 py-1 rounded bg-black/40"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> <span className="text-[8px] font-bold text-indigo-400">SNAT</span></div>
                       <div className="flex items-center gap-1.5 ring-1 ring-white/5 px-2 py-1 rounded bg-black/40"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <span className="text-[8px] font-bold text-emerald-400">DNAT</span></div>
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px]">
                    <table className="w-full text-left">
                       <thead className="text-[9px] text-gray-700 uppercase border-b border-white/5">
                          <tr>
                             <th className="p-4 font-black">Private Internal Addr</th>
                             <th className="p-4 font-black">Public Translated Addr</th>
                             <th className="p-4 font-black">Type</th>
                          </tr>
                       </thead>
                       <tbody>
                          {natTable.map((entry, i) => (
                             <motion.tr key={entry.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="border-b border-white/5 text-[11px] group">
                                <td className="p-4 font-bold"><span className="text-indigo-400">{entry.localIp}</span><span className="text-gray-600">:</span><span className="text-gray-500">{entry.localPort}</span></td>
                                <td className="p-4 font-bold text-white"><span className="text-gray-400">{entry.publicIp}</span><span className="text-gray-600">:</span><span className="text-indigo-500">{entry.publicPort}</span></td>
                                <td className="p-4">
                                   <span className={cn(
                                      "px-2 py-0.5 rounded-lg text-[8px] font-black tracking-widest",
                                      entry.type === "SNAT" ? "bg-indigo-500/10 text-indigo-500" : "bg-emerald-500/10 text-emerald-500"
                                   )}>{entry.type}</span>
                                </td>
                             </motion.tr>
                          ))}
                          {natTable.length === 0 && <tr><td colSpan={3} className="p-12 text-center text-gray-800 italic uppercase font-bold tracking-widest text-[10px]">Awaiting Packet Traffic...</td></tr>}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* Informational HUD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5 mt-auto">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Info className="w-4 h-4 text-indigo-400" />
                       <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Architectural Insight</h4>
                    </div>
                    <p className="text-[11px] text-gray-600 font-light italic leading-relaxed">
                       Notice how <span className="text-indigo-400">SNAT</span> (Source NAT) happens automatically for outbound traffic, while <span className="text-emerald-400">DNAT</span> (Destination NAT / Port Forwarding) must be manually configured to allow access from the outside.
                    </p>
                 </div>
                 
                 <div className="bg-indigo-500/5 rounded-3xl border border-indigo-500/10 p-6 flex gap-4">
                    <Gamepad className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div className="space-y-1 h-20 overflow-y-auto custom-scrollbar">
                       {logs.map((log, i) => (
                          <div key={i} className="text-[9px] font-mono text-gray-500">
                             <span className="text-indigo-500/50 mr-2">LOG::</span> {log}
                          </div>
                       ))}
                       {logs.length === 0 && <p className="text-[9px] text-gray-800 uppercase font-black italic mt-4">Waiting for Event...</p>}
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function CircleBtn({ icon, onClick, color, title }: any) {
  return (
    <div className="flex flex-col items-center gap-2 group/btn">
      <button onClick={onClick} className={cn(
          "w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-all active:scale-90 bg-[#0a0a0a] shadow-xl",
          color === "emerald" ? "hover:border-emerald-500/50 hover:text-emerald-400" : "hover:border-rose-500/50 hover:text-rose-400"
      )}>
        {icon}
      </button>
      <span className="text-[9px] font-bold font-mono text-gray-700 opacity-0 group-hover/btn:opacity-100 transition-opacity uppercase tracking-widest">{title}</span>
    </div>
  )
}
