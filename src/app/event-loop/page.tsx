"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Play, RotateCcw, Box, Terminal, Clock, Zap, Cpu, Pointer, AlertTriangle, Infinity as InfinityIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Task = {
  id: string
  name: string
  type: "sync" | "macro" | "micro" | "render"
  delay?: number
}

export default function EventLoopPage() {
  const [stack, setStack] = useState<Task[]>([])
  const [microQueue, setMicroQueue] = useState<Task[]>([])
  const [macroQueue, setMacroQueue] = useState<Task[]>([])
  const [renderQueue, setRenderQueue] = useState<Task[]>([])
  const [webApis, setWebApis] = useState<Task[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [loopState, setLoopState] = useState<"idle" | "checking-stack" | "checking-micro" | "checking-macro" | "rendering" | "frozen">("idle")
  const [isStarving, setIsStarving] = useState(false)

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 8))

  const pushSync = useCallback(() => {
    const task: Task = { id: Math.random().toString(), name: "console.log()", type: "sync" }
    setStack(prev => [...prev, task])
  }, [])

  const pushMicro = useCallback(() => {
    const task: Task = { id: Math.random().toString(), name: "Promise.then()", type: "micro" }
    setMicroQueue(prev => [...prev, task])
  }, [])

  const pushMacro = useCallback(() => {
    const id = Math.random().toString()
    const task: Task = { id, name: "setTimeout()", type: "macro", delay: 1500 }
    setWebApis(prev => [...prev, task])
    
    setTimeout(() => {
      setWebApis(prev => prev.filter(t => t.id !== id))
      setMacroQueue(prev => [...prev, { ...task, name: "cb: timeout" }])
    }, 1500)
  }, [])

  const pushRender = useCallback(() => {
    const task: Task = { id: Math.random().toString(), name: "rAF()", type: "render" }
    setRenderQueue(prev => [...prev, task])
  }, [])

  const simulateStarvation = () => {
     setIsStarving(true)
     setLoopState("frozen")
     addLog("🚨 STARTING SYNC BLOCK: while(true) { ... }")
     setTimeout(() => {
        setIsStarving(false)
        addLog("✅ MAIN THREAD UNBLOCKED.")
     }, 4000)
  }

  const runScript = async () => {
     addLog("🚀 Running Mixed Script...")
     pushSync()
     pushMacro()
     pushMicro()
     pushRender()
  }

  // Event Loop Logic
  useEffect(() => {
    if (isStarving) return

    const timer = setInterval(() => {
      if (stack.length > 0) {
        setLoopState("checking-stack")
        const task = stack[0]
        addLog(`Executing: ${task.name}`)
        setStack(prev => prev.slice(1))
      } else if (microQueue.length > 0) {
        setLoopState("checking-micro")
        const task = microQueue[0]
        setStack([task])
        setMicroQueue(prev => prev.slice(1))
      } else if (renderQueue.length > 0) {
        setLoopState("rendering")
        const task = renderQueue[0]
        setStack([task])
        setRenderQueue(prev => prev.slice(1))
      } else if (macroQueue.length > 0) {
        setLoopState("checking-macro")
        const task = macroQueue[0]
        setStack([task])
        setMacroQueue(prev => prev.slice(1))
      } else {
        setLoopState("idle")
      }
    }, 800)

    return () => clearInterval(timer)
  }, [stack, microQueue, macroQueue, renderQueue, isStarving])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-purple-500/30">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className={cn(
             "px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-2 transition-colors",
             isStarving ? "bg-red-500/10 border-red-500 text-red-500" : "bg-purple-500/10 border-purple-500/20 text-purple-400"
           )}>
            <Cpu className={cn("w-3 h-3", !isStarving && "animate-pulse")} />
            Loop State: {loopState.toUpperCase()}
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls */}
        <div className="space-y-6 lg:col-span-1">
          <section className="glass p-6 rounded-2xl border-white/5 space-y-4">
            <header className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Cycle</h1>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                JavaScript is single-threaded. Watch the browser manage its priorities.
              </p>
            </header>

            <div className="space-y-2">
               <div className="flex gap-2">
                  <ControlBtn onClick={pushSync} color="bg-blue-600" icon={<Zap />} label="Sync" />
                  <ControlBtn onClick={pushMicro} color="bg-emerald-600" icon={<Box />} label="Micro" />
               </div>
               <div className="flex gap-2">
                  <ControlBtn onClick={pushMacro} color="bg-purple-600" icon={<Clock />} label="Macro" />
                  <ControlBtn onClick={pushRender} color="bg-orange-600" icon={<Play />} label="rAF" />
               </div>
               <button onClick={runScript} className="w-full py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-[10px] uppercase font-bold tracking-widest text-gray-500 transition-all">Execute Complex Script</button>
            </div>

            <div className="pt-4 border-t border-white/5">
               <button 
                  onClick={simulateStarvation} disabled={isStarving}
                  className="w-full py-4 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-600/20 transition-all flex items-center justify-center gap-2"
               >
                 <AlertTriangle className="w-4 h-4" />
                 Simulate Main Thread Freeze
               </button>
            </div>
            
            <button 
              onClick={() => { setStack([]); setMicroQueue([]); setMacroQueue([]); setRenderQueue([]); setWebApis([]); setLogs([]); }}
              className="w-full py-2 text-[10px] uppercase font-bold text-gray-700 hover:text-white transition-colors"
            >
              Flush All Queues
            </button>
          </section>

          <section className="glass p-6 rounded-2xl border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Terminal className="w-3 h-3 text-purple-500" /> Console Output
            </h3>
            <div className="space-y-2 font-mono text-[9px] text-gray-500 h-44 overflow-y-auto custom-scrollbar">
                {logs.map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={cn(
                    "p-2 rounded bg-white/5 border-l-2",
                    log.includes("🚨") ? "border-red-500 bg-red-500/5 text-red-500" : i === 0 ? "border-purple-500 text-white" : "border-white/10"
                  )}>
                    {log}
                  </motion.div>
                ))}
            </div>
          </section>
        </div>

        {/* Queues Visualizer */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
           {isStarving && (
              <div className="absolute inset-x-0 -inset-y-4 bg-[#0a0a0a]/60 backdrop-blur-sm z-50 flex items-center justify-center p-12 text-center rounded-[40px]">
                 <div className="space-y-4">
                    <InfinityIcon className="w-16 h-16 text-red-600 mx-auto animate-spin" />
                    <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter">Main Thread Deadlocked</h2>
                    <p className="text-sm text-gray-400 max-w-xs">The synchronous while loop is blocking the Event Loop. No queues can be processed. UI is frozen.</p>
                 </div>
              </div>
           )}

           <QueueBox title="Call Stack" icon={<Zap className="text-blue-400" />} tasks={stack} reversed />
           <QueueBox title="Web APIs" icon={<Cpu className="text-orange-400" />} tasks={webApis} desc="Timer threads, Network hooks" />
           <QueueBox title="Microtasks (LIFO)" icon={<Box className="text-emerald-400" />} tasks={microQueue} desc="Promise.then, MutationObserver" />
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
              <QueueBox title="Rendering" icon={<Play className="text-orange-400" />} tasks={renderQueue} desc="rAF Callbacks" />
              <QueueBox title="Macrotasks" icon={<Clock className="text-purple-400" />} tasks={macroQueue} desc="setTimeout, setInterval" />
           </div>
        </div>
      </div>
      
      <div className="fixed bottom-4 right-4 sm:bottom-12 sm:right-12 flex flex-col items-center gap-4 z-50">
        <motion.div 
          animate={{ rotate: isStarving ? 0 : 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-2 border-dashed border-purple-500/30 flex items-center justify-center relative"
        >
          <Pointer className={cn("w-8 h-8 text-purple-500", !isStarving && "animate-pulse")} />
        </motion.div>
        <div className="text-[10px] font-bold uppercase tracking-tighter text-gray-600">Loop Heartbeat</div>
      </div>
    </main>
  )
}

function ControlBtn({ onClick, color, icon, label }: any) {
  return (
    <button onClick={onClick} className="flex-1 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center gap-2 group">
       <div className={cn("p-2 rounded-lg text-white transition-transform group-hover:scale-110 shadow-lg", color)}>
          {icon}
       </div>
       <span className="text-[10px] font-bold uppercase text-gray-500">{label}</span>
    </button>
  )
}

function QueueBox({ title, icon, tasks, reversed = false, desc }: any) {
  const displayTasks = reversed ? [...tasks].reverse() : tasks
  return (
    <div className="glass rounded-[32px] border-white/5 p-6 flex flex-col gap-4 min-h-[220px]">
       <div className="flex justify-between items-start border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
             <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300">{title}</h4>
                {desc && <p className="text-[9px] text-gray-600 italic leading-none mt-1">{desc}</p>}
             </div>
          </div>
          <span className="font-mono text-[10px] text-gray-700">LEN: {tasks.length}</span>
       </div>
       <div className="flex-1 flex flex-col justify-end gap-2 pr-2 overflow-y-auto custom-scrollbar">
          <AnimatePresence>
             {displayTasks.map((t: any) => (
                <motion.div key={t.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }} className={cn(
                  "p-2 rounded-lg border text-[10px] font-mono flex justify-between items-center",
                  t.type === "sync" ? "bg-blue-500/10 border-blue-500/30 text-blue-300" :
                  t.type === "micro" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" :
                  t.type === "render" ? "bg-orange-500/10 border-orange-500/30 text-orange-300" : "bg-purple-500/10 border-purple-500/30 text-purple-300"
                )}>
                   <span>{t.name}</span>
                   {t.delay && <span className="opacity-40">{t.delay}ms</span>}
                </motion.div>
             ))}
          </AnimatePresence>
          {tasks.length === 0 && <div className="text-[9px] text-gray-800 text-center uppercase tracking-tighter self-center mb-8">Idle Queue</div>}
       </div>
    </div>
  )
}
