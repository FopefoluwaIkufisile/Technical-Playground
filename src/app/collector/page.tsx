"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trash2, Database, Zap, Activity, Info, BarChart3, ChevronRight, Share2, Plus, Terminal, Layout, Layers, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MemoryNode {
  id: string
  size: number
  isReachable: boolean
  isMarked: boolean
  generation: "young" | "old"
  type: "object" | "array" | "closure"
}

export default function GarbageCollectionPage() {
  const [heap, setHeap] = useState<MemoryNode[]>([])
  const [isGCing, setIsGCing] = useState(false)
  const [phase, setPhase] = useState<"allocation" | "marking" | "sweeping" | "compacting">("allocation")
  const [logs, setLogs] = useState<string[]>([])
  const [metrics, setMetrics] = useState({ used: 0, total: 200, collections: 0 })

  const addLog = (msg: string) => setLogs(p => [`[GC] ${msg}`, ...p].slice(0, 10))

  const allocate = () => {
    if (heap.length >= 60) {
       addLog("CRITICAL: Out of Memory. Triggering Emergency GC.")
       runGC()
       return
    }
    const id = Math.random().toString(36).substr(2, 5).toUpperCase()
    const newNode: MemoryNode = {
      id,
      size: Math.floor(Math.random() * 5) + 1,
      isReachable: Math.random() > 0.4, // Randomly mark some as unreachable for simulation
      isMarked: false,
      generation: "young",
      type: ["object", "array", "closure"][Math.floor(Math.random() * 3)] as any
    }
    setHeap(prev => [...prev, newNode])
    addLog(`Allocated ${newNode.type} at 0x${id}`)
  }

  const runGC = async () => {
    if (isGCing) return
    setIsGCing(true)
    setMetrics(prev => ({ ...prev, collections: prev.collections + 1 }))

    // 1. MARKING
    setPhase("marking")
    addLog("PHASE: Mark (Tracing reachable nodes from Root Set)...")
    await new Promise(r => setTimeout(r, 1500))
    setHeap(prev => prev.map(n => ({ ...n, isMarked: n.isReachable })))

    // 2. SWEEPING
    setPhase("sweeping")
    addLog("PHASE: Sweep (Freeing unmarked memory blocks)...")
    await new Promise(r => setTimeout(r, 1500))
    setHeap(prev => prev.filter(n => n.isMarked).map(n => ({ ...n, isMarked: false, generation: "old" })))

    // 3. COMPACTING (Optional visual pause)
    setPhase("compacting")
    addLog("PHASE: Compaction (Defragmenting memory space)...")
    await new Promise(r => setTimeout(r, 1000))
    
    setPhase("allocation")
    setIsGCing(false)
    addLog("GC CYCLE COMPLETE.")
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-purple-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium flex items-center gap-2">
            <RefreshCw className={cn("w-3 h-3", isGCing && "animate-spin")} />
            Advanced Lab: Collector
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Memory Pressure Controls */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Collector</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Garbage Collection Engine</p>
              </header>

              <div className="space-y-4">
                 <button 
                   onClick={allocate} disabled={isGCing}
                   className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-purple-500/20"
                 >
                   <Plus className="w-4 h-4 mr-2 inline-block" />
                   ALLOCATE OBJECT
                 </button>

                 <button 
                   onClick={runGC} disabled={isGCing}
                   className="w-full py-4 rounded-2xl border border-purple-500/40 bg-purple-500/10 text-purple-400 font-black text-xs transition-all active:scale-95"
                 >
                   {isGCing ? "GC IN PROGRESS..." : "FORCE MAJOR GC"}
                 </button>

                 <div className="pt-6 border-t border-white/5 space-y-3">
                    <label className="text-[9px] font-black uppercase text-gray-700 tracking-widest leading-none">V8 Scavenger Pipeline</label>
                    {["marking", "sweeping", "compacting"].map((p, i) => (
                       <div key={p} className={cn(
                          "px-4 py-3 rounded-xl border flex items-center justify-between transition-all duration-300",
                          phase === p ? "bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-lg" : "bg-white/5 border-white/5 text-gray-800"
                       )}>
                          <span className="text-[10px] font-black uppercase italic tracking-tighter">{i+1}. {p}</span>
                          <div className={cn("w-1.5 h-1.5 rounded-full", phase === p ? "bg-purple-500 animate-pulse" : "bg-gray-900")} />
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-purple-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Heap Tracker Console</h3>
              </div>
              <div className="space-y-1 h-36 overflow-y-auto custom-scrollbar font-mono text-[9px] text-gray-500 pr-2">
                 {logs.map((l, i) => (
                    <div key={i} className="py-1 border-b border-white/5 opacity-80 leading-none truncate">{l}</div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-12 lowercase text-[10px]">awaiting load...</p>}
              </div>
           </div>
        </section>

        {/* Heap Visualizer View */}
        <section className="lg:col-span-3 space-y-6">
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 min-h-[450px] relative flex flex-col gap-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Database className="w-64 h-64 text-purple-500" />
              </div>

              {/* Statistics Overlay */}
               <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
                  <div className="flex gap-4 items-center">
                     <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <BarChart3 className="w-6 h-6 border-none" />
                     </div>
                     <div>
                        <h3 className="text-sm font-black italic uppercase tracking-[0.2em]">Live Memory Managed Heap</h3>
                        <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest italic leading-none mt-1">Allocation Strategy: Generational scavenge</p>
                     </div>
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto justify-end">
                     <StatBox label="Heap Objects" value={heap.length} color="text-purple-400" />
                     <StatBox label="GC Cycles" value={metrics.collections} color="text-indigo-400" />
                  </div>
               </div>

              {/* Grid Heap Visualization */}
               <div className="relative z-10 flex-1 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 p-6 sm:p-8 bg-black/40 rounded-[32px] border border-white/5 overflow-y-auto custom-scrollbar">
                 <AnimatePresence>
                    {heap.map((node, i) => (
                       <motion.div 
                         key={node.id} 
                         initial={{ scale: 0, rotate: -20 }} 
                         animate={{ 
                            scale: 1, 
                            rotate: 0,
                            backgroundColor: node.isMarked && phase === "marking" ? "#a855f7" : 
                                            node.generation === "old" ? "#6366f120" : "rgba(255, 255, 255, 0.05)",
                            borderColor: node.isMarked ? "#a855f7" : "rgba(255, 255, 255, 0.05)"
                         }}
                         exit={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                         className={cn(
                            "group h-16 rounded-xl border relative flex items-center justify-center transition-all duration-700",
                            node.generation === "old" && "border-indigo-500/30"
                         )}
                       >
                          <div className={cn(
                             "w-4 h-4 rounded-full opacity-[0.15] absolute",
                             node.type === "object" ? "bg-purple-500" : node.type === "array" ? "bg-blue-500" : "bg-emerald-500"
                          )} />
                          <span className="text-[7px] font-mono font-black text-gray-700 group-hover:text-white transition-colors">{node.id}</span>
                          
                          {/* Tooltip Simulation */}
                          <div className="absolute opacity-0 group-hover:opacity-100 -top-8 bg-black border border-white/10 px-2 py-1 rounded text-[8px] font-bold pointer-events-none z-50 whitespace-nowrap">
                             GEN: {node.generation.toUpperCase()} | REFS: {node.isReachable ? "YES" : "NO"}
                          </div>
                       </motion.div>
                    ))}
                    {heap.length === 0 && (
                       <div className="absolute inset-0 flex items-center justify-center text-gray-800 opacity-20 italic">
                          <p className="text-2xl font-black italic uppercase tracking-[0.3em]">Heap Virginis (Pure)</p>
                       </div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Legend & Details */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5 relative z-10 items-center">
                  <div className="flex gap-4 items-center">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                        <Layers className="w-6 h-6 border-none" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Fragmentation Strategy</h4>
                        <p className="text-[10px] text-gray-600 font-light italic leading-snug">
                           Objects surviving multiple cycles are promoted to the **Old Generation**, where GC runs less frequently to optimize throughput.
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-4 sm:gap-6 justify-start md:justify-end items-center">
                     <Legend icon={<div className="w-2 h-2 rounded-full bg-purple-500" />} label="Young Gen" />
                     <Legend icon={<div className="w-2 h-2 border border-indigo-500/50 bg-indigo-500/10 rounded-full" />} label="Old Gen" />
                     <Legend icon={<div className="w-2 h-2 rounded-full bg-white/5 border border-white/20" />} label="Unmarked" />
                  </div>
               </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function StatBox({ label, value, color }: any) {
  return (
    <div className="text-right space-y-1">
       <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">{label}</p>
       <p className={cn("text-3xl font-black italic tracking-tighter leading-none", color)}>{value}</p>
    </div>
  )
}

function Legend({ icon, label }: any) {
  return (
    <div className="flex items-center gap-2">
       {icon}
       <span className="text-[9px] font-black uppercase tracking-widest text-gray-700">{label}</span>
    </div>
  )
}
