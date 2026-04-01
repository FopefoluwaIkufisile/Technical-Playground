"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Server, Zap, Activity, ShieldCheck, Info, BarChart3, ChevronRight, Share2, Terminal, Globe, HardDrive, Layout, RefreshCw, Cpu, GitBranch, ArrowDownRight, User, Settings, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Algorithm = "round-robin" | "least-connections" | "consistent-hashing"

interface BackendNode {
  id: string
  activeConnections: number
  isHealthy: boolean
  labels: string[]
}

interface RequestPacket {
  id: string
  userId: string
  targetNodeId?: string
  status: "pending" | "processing" | "completed"
}

export default function BalancePage() {
  const [algo, setAlgo] = useState<Algorithm>("round-robin")
  const [nodes, setNodes] = useState<BackendNode[]>([
    { id: "NODE_01", activeConnections: 0, isHealthy: true, labels: ["EU-WEST-1"] },
    { id: "NODE_02", activeConnections: 0, isHealthy: true, labels: ["EU-WEST-1"] },
    { id: "NODE_03", activeConnections: 0, isHealthy: true, labels: ["EU-WEST-1"] }
  ])
  const [requests, setRequests] = useState<RequestPacket[]>([])
  const [stickySessions, setStickySessions] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const rrIndexRef = useRef(0)

  const addLog = (msg: string) => setLogs(p => [`[LB] ${msg}`, ...p].slice(0, 10))

  const spawnRequest = useCallback(() => {
    const userId = ["User_A", "User_B", "User_C"][Math.floor(Math.random() * 3)]
    const newReq: RequestPacket = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      userId,
      status: "pending"
    }
    
    // Choose Node logic
    let targetNode: BackendNode | undefined
    const healthyNodes = nodes.filter(n => n.isHealthy)
    
    if (healthyNodes.length === 0) {
       addLog("CRITICAL: No healthy backends available. HTTP 503 Service Unavailable.")
       return
    }

    if (algo === "round-robin") {
       targetNode = healthyNodes[rrIndexRef.current % healthyNodes.length]
       rrIndexRef.current++
    } else if (algo === "least-connections") {
       targetNode = healthyNodes.reduce((prev, curr) => prev.activeConnections < curr.activeConnections ? prev : curr)
    } else {
       // Consistent Hashing (Simplified)
       const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
       targetNode = healthyNodes[hash % healthyNodes.length]
    }

    newReq.targetNodeId = targetNode.id
    setRequests(prev => [...prev, newReq])
    setNodes(prev => prev.map(n => n.id === targetNode?.id ? { ...n, activeConnections: n.activeConnections + 1 } : n))
    addLog(`ROUTING: ${newReq.id} -> ${targetNode.id} (${userId})`)

    // Simulate completion
    setTimeout(() => {
       setRequests(prev => prev.filter(r => r.id !== newReq.id))
       setNodes(prev => prev.map(n => n.id === targetNode?.id ? { ...n, activeConnections: Math.max(0, n.activeConnections - 1) } : n))
    }, 2000)
  }, [algo, nodes])

  const toggleNodeHealth = (id: string) => {
     setNodes(prev => prev.map(n => n.id === id ? { ...n, isHealthy: !n.isHealthy, activeConnections: 0 } : n))
     addLog(`HEALTH MONITOR: ${id} status changed.`)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-amber-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Infrastructure Lab: Balance
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Load Balancer Controls */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase whitespace-normal">Balance</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">L7 Reverse Proxy</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-700 tracking-widest">Routing Algorithm</label>
                    <div className="flex flex-col gap-2">
                       {["round-robin", "least-connections", "consistent-hashing"].map(a => (
                          <button 
                            key={a} onClick={() => setAlgo(a as Algorithm)}
                            className={cn("py-3 px-4 rounded-xl border text-[10px] font-black transition-all text-left uppercase flex justify-between items-center", algo === a ? "bg-amber-500/10 border-amber-500/40 text-amber-500" : "bg-white/5 border-white/5 text-gray-700")}
                          >
                             {a.replace('-', ' ')}
                             {algo === a && <ChevronRight className="w-3 h-3" />}
                          </button>
                       ))}
                    </div>
                 </div>

                 <button 
                   onClick={spawnRequest}
                   className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-amber-500/20"
                 >
                   SPAWN REQUEST
                 </button>

                 <div className="pt-4 border-t border-white/5 space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-700 tracking-widest">Global Health Status</label>
                    <div className="flex items-center gap-4">
                       <span className={cn("w-2 h-2 rounded-full", nodes.every(n => n.isHealthy) ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
                       <span className="text-xs font-black italic tracking-tight">{nodes.filter(n => n.isHealthy).length} / {nodes.length} Upstream Healthy</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-amber-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Reverse Proxy Access Log</h3>
              </div>
              <div className="space-y-1 h-36 overflow-y-auto custom-scrollbar font-mono text-[9px] text-gray-500 pr-2">
                 {logs.map((l, i) => (
                    <div key={i} className="py-1 border-b border-white/5 opacity-80 leading-none truncate italic">{l}</div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-12 lowercase text-[10px]">awaiting traffic...</p>}
              </div>
           </div>
        </section>

        {/* Traffic Visualizer View */}
        <section className="lg:col-span-3 space-y-6">
           <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 md:p-12 min-h-[500px] relative flex flex-col gap-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Globe className="w-64 h-64 text-amber-500" />
              </div>

              {/* LB Node Overlay */}
              <div className="relative z-10 flex flex-col h-full gap-10">
                 
                 {/* The Proxy Box */}
                 <div className="flex flex-col items-center gap-10 relative">
                    <div className="px-10 py-6 bg-black rounded-[32px] border border-amber-500/30 flex flex-col items-center gap-2 shadow-[0_0_50px_rgba(245,158,11,0.1)] relative z-20">
                       <ShieldCheck className="w-8 h-8 text-amber-500" />
                       <h3 className="text-xs font-black tracking-[0.3em] uppercase italic">Load Balancer</h3>
                       <p className="text-[9px] font-bold text-gray-700 uppercase">{algo.toUpperCase()} ACTIVE</p>
                    </div>

                    {/* Backend Node Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-10">
                       {nodes.map(node => (
                          <div key={node.id} className={cn(
                             "relative p-8 rounded-[38px] border bg-black/40 flex flex-col items-center gap-6 group transition-all duration-500",
                             node.isHealthy ? "border-white/5 hover:border-amber-500/20" : "border-rose-500/30 opacity-40 grayscale"
                          )}>
                             <div className={cn("w-16 h-16 rounded-full flex items-center justify-center relative", node.isHealthy ? "bg-amber-500/5 text-amber-500" : "bg-rose-500/10 text-rose-500")}>
                                <Server className="w-8 h-8" />
                                {node.activeConnections > 0 && (
                                   <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]" />
                                )}
                             </div>
                             <div className="text-center">
                                <h4 className="text-[10px] font-black italic uppercase tracking-tighter text-white">{node.id}</h4>
                                <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">{node.labels[0]}</p>
                             </div>
                             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${(node.activeConnections / 10) * 100}%` }} className="h-full bg-amber-500" />
                             </div>
                             <div className="grid grid-cols-2 gap-2 w-full">
                                <div className="text-center">
                                   <p className="text-[8px] font-black italic text-gray-700 uppercase">Load</p>
                                   <p className="text-lg font-black italic text-white leading-none">{node.activeConnections}</p>
                                </div>
                                <button onClick={() => toggleNodeHealth(node.id)} className={cn("text-center py-2 rounded-xl transition-all", node.isHealthy ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" : "bg-emerald-500/10 text-emerald-500")}>
                                   <AlertTriangle className="w-3 h-3 mx-auto" />
                                </button>
                             </div>
                          </div>
                       ))}
                    </div>

                    {/* Incoming Traffic (Floating Packets) */}
                    <AnimatePresence>
                       {requests.map(req => (
                          <motion.div 
                            key={req.id} 
                            initial={{ y: -100, opacity: 0, x: 0 }}
                            animate={{ 
                               y: 100, 
                               opacity: 1,
                               x: typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : 
                                  (req.targetNodeId === "NODE_01" ? -200 : req.targetNodeId === "NODE_03" ? 200 : 0)
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute z-50 p-3 bg-amber-500 rounded-2xl shadow-xl shadow-amber-500/20"
                          >
                             <Zap className="w-4 h-4 text-black fill-current" />
                             <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black font-mono text-amber-500 uppercase italic opacity-50">{req.id}</span>
                          </motion.div>
                       ))}
                    </AnimatePresence>
                 </div>
              </div>

              {/* Informational Footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10 items-center">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-500">
                       <User className="w-6 h-6 border-none" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">Sticky Session Context</h4>
                       <p className="text-[10px] text-gray-600 font-light italic leading-snug">
                          **Consistent Hashing** ensures that requests from the same User ID always route to the same backend node, allowing for local cache persistence.
                       </p>
                    </div>
                 </div>

                 <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex gap-6">
                    <Layout className="w-8 h-8 text-amber-500 shrink-0" />
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase text-white tracking-widest leading-none mt-1">L7 vs L4 Balancing</p>
                       <p className="text-[10px] text-gray-600 font-light italic leading-relaxed font-sans">
                          A layer-7 balancer (like NGINX/HAProxy) can read HTTP headers to make routing decisions, unlike layer-4 which only sees IP/Port.
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
