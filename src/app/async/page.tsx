"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Play, Zap, Clock, Code2, Layers, Cpu, CheckCircle2, XCircle, RefreshCw, Info, AlertCircle, Trophy } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type AsyncPattern = "sequential" | "parallel_all" | "parallel_race"

export default function AsyncPage() {
  const [activePattern, setActivePattern] = useState<AsyncPattern | null>(null)
  const [items, setItems] = useState<{ id: string, name: string, status: "idle" | "pending" | "resolved" | "rejected", progress: number, delay: number }[]>([
    { id: "1", name: "User Profile", status: "idle", progress: 0, delay: 1500 },
    { id: "2", name: "Order History", status: "idle", progress: 0, delay: 2500 },
    { id: "3", name: "Preferences", status: "idle", progress: 0, delay: 1000 },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [allowFailure, setAllowFailure] = useState(false)
  const [globalStatus, setGlobalStatus] = useState<"idle" | "running" | "success" | "failed">("idle")
  
  const resetItems = useCallback(() => {
    setItems(prev => prev.map(item => ({ ...item, status: "idle", progress: 0 })))
    setGlobalStatus("idle")
  }, [])

  const simulateItem = (id: string, delay: number) => {
    return new Promise<void>((resolve, reject) => {
      setItems(prev => prev.map(it => it.id === id ? { ...it, status: "pending" } : it))
      
      let current = 0
      const interval = setInterval(() => {
        current += 10
        setItems(prev => prev.map(it => it.id === id ? { ...it, progress: current } : it))
        
        if (current >= 100) {
          clearInterval(interval)
          const shouldFail = allowFailure && Math.random() < 0.3
          if (shouldFail) {
            setItems(prev => prev.map(it => it.id === id ? { ...it, status: "rejected" } : it))
            reject(`Failed to load ${id}`)
          } else {
            setItems(prev => prev.map(it => it.id === id ? { ...it, status: "resolved" } : it))
            resolve()
          }
        }
      }, delay / 10)
    })
  }

  const runSequential = async () => {
    setIsRunning(true)
    setGlobalStatus("running")
    try {
      for (const item of items) {
        await simulateItem(item.id, item.delay)
      }
      setGlobalStatus("success")
    } catch (e) {
      setGlobalStatus("failed")
    }
    setIsRunning(false)
  }

  const runParallelAll = async () => {
    setIsRunning(true)
    setGlobalStatus("running")
    try {
      await Promise.all(items.map(item => simulateItem(item.id, item.delay)))
      setGlobalStatus("success")
    } catch (e) {
      setGlobalStatus("failed")
    }
    setIsRunning(false)
  }

  const runParallelRace = async () => {
    setIsRunning(true)
    setGlobalStatus("running")
    try {
      await Promise.race(items.map(item => simulateItem(item.id, item.delay)))
      setGlobalStatus("success")
    } catch (e) {
      setGlobalStatus("failed")
    }
    setIsRunning(false)
  }

  const handleStart = (pattern: AsyncPattern) => {
    if (isRunning) return
    resetItems()
    setActivePattern(pattern)
    if (pattern === "sequential") runSequential()
    if (pattern === "parallel_all") runParallelAll()
    if (pattern === "parallel_race") runParallelRace()
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-cyan-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className={cn(
             "px-4 py-1 rounded-full border text-xs font-bold flex items-center gap-2 transition-all",
             globalStatus === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
             globalStatus === "failed" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
           )}>
            <Cpu className={cn("w-3 h-3", isRunning && "animate-pulse")} />
            {isRunning ? "PROCESSING..." : globalStatus.toUpperCase()}
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Strategy Control */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-2xl font-black italic tracking-tighter italic">Sync</h1>
                 <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                    Orchestrate asynchronous flows.
                 </p>
              </header>

              <div className="space-y-3">
                 <StrategyBtn 
                   active={activePattern === "sequential"} 
                   onClick={() => handleStart("sequential")}
                   label="Sequential" sub="await A; await B;" icon={<Layers />} color="orange" 
                 />
                 <StrategyBtn 
                   active={activePattern === "parallel_all"} 
                   onClick={() => handleStart("parallel_all")}
                   label="Promise.all" sub="Parallel processing" icon={<Zap />} color="cyan" 
                 />
                 <StrategyBtn 
                   active={activePattern === "parallel_race"} 
                   onClick={() => handleStart("parallel_race")}
                   label="Promise.race" sub="First win wins" icon={<Trophy />} color="purple" 
                 />
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                 <button 
                   onClick={() => setAllowFailure(!allowFailure)}
                   className={cn(
                     "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                     allowFailure ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-white/5 border-white/5 text-gray-600"
                   )}
                 >
                    <div className="flex items-center gap-3">
                       <AlertCircle className="w-4 h-4" />
                       <span className="text-[10px] font-bold uppercase">Simulate Failures</span>
                    </div>
                    <div className={cn("w-2 h-2 rounded-full", allowFailure ? "bg-red-500 animate-pulse" : "bg-gray-800")} />
                 </button>
                 
                 <button onClick={resetItems} className="w-full text-[10px] text-gray-700 uppercase font-bold tracking-widest hover:text-white transition-colors">Reset Arena</button>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5">
              <div className="flex items-center gap-2 mb-3">
                 <Info className="w-4 h-4 text-cyan-500" />
                 <h4 className="text-[10px] font-bold uppercase text-gray-500">The "Event Loop" Trap</h4>
              </div>
              <p className="text-[11px] text-gray-500 font-light italic leading-relaxed">
                 Even when running "together" with <span className="text-cyan-400">Promise.all</span>, JavaScript still only executes one instruction at a time. The browser just schedules the <span className="text-white italic">Wait periods</span> concurrently.
              </p>
           </div>
        </section>

        {/* Execution Arena */}
        <section className="lg:col-span-3 flex flex-col gap-6">
           <div className="flex-1 glass rounded-[40px] border-white/5 p-6 sm:p-10 md:p-12 relative overflow-hidden flex flex-col gap-8 sm:gap-12">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Code2 className="w-64 h-64 rotate-12" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                 {items.map((item, i) => (
                    <motion.div key={item.id} className={cn(
                       "p-8 rounded-[32px] border transition-all duration-500 flex flex-col justify-between h-56",
                       item.status === "pending" ? "bg-cyan-500/5 border-cyan-500/30 shadow-2xl" :
                       item.status === "resolved" ? "bg-emerald-500/10 border-emerald-500/50" :
                       item.status === "rejected" ? "bg-red-500/10 border-red-500/50" : "bg-white/5 border-white/5 opacity-40 shrink-95"
                    )}>
                       <div className="flex justify-between items-start">
                          <div className={cn("p-3 rounded-2xl bg-black/40", item.status === "pending" ? "text-cyan-400" : "text-gray-500")}>
                             <RefreshCw className={cn("w-5 h-5", item.status === "pending" && "animate-spin")} />
                          </div>
                          {item.status === "resolved" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          {item.status === "rejected" && <XCircle className="w-5 h-5 text-red-500" />}
                       </div>

                       <div className="space-y-4">
                          <div>
                             <h4 className="text-sm font-bold tracking-tight">{item.name}</h4>
                             <p className="text-[9px] font-mono text-gray-600 italic uppercase">EST_DELAY: {item.delay}ms</p>
                          </div>
                          
                          <div className="space-y-2">
                             <div className="flex justify-between text-[9px] font-bold text-gray-700">
                                <span>STATUS: {item.status.toUpperCase()}</span>
                                <span>{item.progress}%</span>
                             </div>
                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${item.progress}%` }} className={cn(
                                  "h-full rounded-full transition-colors",
                                  item.status === "rejected" ? "bg-red-500" : "bg-cyan-500"
                                )} />
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>

              {/* Console / Status Feed */}
              <div className="pt-8 border-t border-white/5 flex-1 flex flex-col gap-4">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Runtime Settle Logs</h3>
                 <div className="space-y-2 font-mono text-[10px] text-gray-500">
                    {activePattern === "parallel_race" && globalStatus === "success" && (
                       <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-400 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                          🏁 {items.find(i => i.status === "resolved")?.name} reached the finish line first! All other settlement results discarded.
                       </motion.p>
                    )}
                    {activePattern === "parallel_all" && globalStatus === "failed" && (
                       <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-400 bg-red-500/5 p-3 rounded-xl border border-red-500/20 text-center uppercase tracking-widest font-black">
                          ⚠️ FAIL FAST: A single rejection caused the entire Promise.all set to reject.
                       </motion.p>
                    )}
                 </div>
              </div>
           </div>

            <div className="glass p-6 sm:p-8 rounded-[40px] border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
               <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-12 h-12 rounded-full border-2 border-white/5 flex items-center justify-center text-gray-700">
                     <Code2 className="w-6 h-6" />
                  </div>
                  <div className="text-center sm:text-left">
                     <h4 className="text-sm font-bold tracking-tight">Pattern: {activePattern?.replace('_', '.').toUpperCase() || "SELECT STRATEGY"}</h4>
                     <p className="text-[10px] text-gray-600 font-light max-w-sm leading-relaxed">
                        {activePattern === "sequential" && "Each request waits for the previous one to complete. Total time = sum(delays)."}
                        {activePattern === "parallel_all" && "All requests start simultaneously. Total time = max(delay). Fails if any fail."}
                        {activePattern === "parallel_race" && "First one to settle determines the result. Competitive orchestration."}
                     </p>
                  </div>
               </div>
               <div className="text-[10px] font-black italic text-gray-800 uppercase tracking-tighter">non-blocking.io</div>
            </div>
        </section>
      </div>
    </main>
  )
}

function StrategyBtn({ active, onClick, label, sub, icon, color }: any) {
  return (
    <button onClick={onClick} className={cn(
      "w-full p-4 rounded-2xl border flex items-center gap-4 transition-all text-left group",
      active 
        ? color === "orange" ? "bg-orange-500/10 border-orange-500/50" : 
          color === "cyan" ? "bg-cyan-500/10 border-cyan-500/50" : "bg-purple-500/10 border-purple-500/50"
        : "bg-white/5 border-white/5 hover:border-white/10"
    )}>
       <div className={cn(
         "p-3 rounded-xl border border-white/5 transition-transform group-hover:scale-110",
         active ? color === "orange" ? "text-orange-400" : color === "cyan" ? "text-cyan-400" : "text-purple-400" : "text-gray-700"
       )}>{icon}</div>
       <div>
         <p className="text-[11px] font-bold">{label}</p>
         <p className="text-[9px] text-gray-500 font-mono italic">{sub}</p>
       </div>
    </button>
  )
}
