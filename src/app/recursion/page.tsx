"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Play, RotateCcw, ChevronRight, Activity, Cpu, Layers, Info, Trash2, Database, Box, Terminal, Code2, Zap, FastForward, SkipBack } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type ViewMode = "fractal" | "memory"
type FractalType = "tree" | "sierpinski"
type Algorithm = "factorial" | "fibonacci"

interface StackFrame {
  id: string
  name: string
  params: Record<string, any>
  returnValue?: any
  isReturning: boolean
  depth: number
}

export default function RecursionPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("memory")
  
  // Fractal State
  const [fractalType, setFractalType] = useState<FractalType>("tree")
  const [depth, setDepth] = useState(8)
  const [angle, setAngle] = useState(25)
  const [branching, setBranching] = useState(0.7)
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Memory State
  const [algo, setAlgo] = useState<Algorithm>("factorial")
  const [n, setN] = useState(5)
  const [isExecuting, setIsExecuting] = useState(false)
  const [stack, setStack] = useState<StackFrame[]>([])
  const [heap, setHeap] = useState<Record<string, any>>({})
  const [stepIndex, setStepIndex] = useState(-1)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => setLogs(p => [`[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`, ...p].slice(0, 10))

  // --- Fractal Logic ---
  const drawTimeoutRef = useRef<NodeJS.Timeout[]>([])
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawTimeoutRef.current.forEach(clearTimeout)
    drawTimeoutRef.current = []
    setIsDrawing(false)
  }, [])

  const drawTree = (ctx: CanvasRenderingContext2D, x: number, y: number, len: number, ang: number, d: number) => {
    if (d === 0) return
    const x2 = x + Math.cos(ang * Math.PI / 180) * len
    const y2 = y - Math.sin(ang * Math.PI / 180) * len
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2)
    ctx.strokeStyle = `rgba(59, 130, 246, ${d / depth})`; ctx.lineWidth = d; ctx.stroke()
    const t1 = setTimeout(() => drawTree(ctx, x2, y2, len * branching, ang - angle, d - 1), 100)
    const t2 = setTimeout(() => drawTree(ctx, x2, y2, len * branching, ang + angle, d - 1), 200)
    drawTimeoutRef.current.push(t1, t2)
  }

  const startFractal = () => {
    clearCanvas()
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    setIsDrawing(true)
    if (fractalType === "tree") drawTree(ctx, canvasRef.current!.width / 4, canvasRef.current!.height / 2 - 50, 100, 90, depth)
  }

  // --- Memory Model Logic ---
  const runMemorySim = async () => {
    if (isExecuting) return
    setIsExecuting(true)
    setStack([])
    setHeap({})
    addLog(`Starting ${algo}(${n})...`)

    const pushFrame = (name: string, params: Record<string, any>, d: number): string => {
       const id = Math.random().toString(36).substr(2, 5)
       setStack(prev => [...prev, { id, name, params, isReturning: false, depth: d }])
       return id
    }

    const popFrame = (id: string, val: any) => {
       setStack(prev => prev.map(f => f.id === id ? { ...f, isReturning: true, returnValue: val } : f))
    }

    const factorial = async (num: number, d: number): Promise<number> => {
       const id = pushFrame("factorial", { n: num }, d)
       addLog(`PUSH: factorial(${num}) at depth ${d}`)
       await new Promise(r => setTimeout(r, 800))
       
       let res: number
       if (num <= 1) {
          addLog(`BASE CASE: Returning 1`)
          res = 1
       } else {
          res = num * await factorial(num - 1, d + 1)
       }
       
       popFrame(id, res)
       addLog(`POP: ${id} returned ${res}`)
       await new Promise(r => setTimeout(r, 600))
       setStack(prev => prev.filter(f => f.id !== id))
       return res
    }

    const fib = async (num: number, d: number): Promise<number> => {
       const id = pushFrame("fibonacci", { n: num }, d)
       addLog(`PUSH: fib(${num}) at depth ${d}`)
       await new Promise(r => setTimeout(r, 800))
       
       let res: number
       if (num <= 1) {
          res = num
       } else {
          res = await fib(num - 1, d + 1) + await fib(num - 2, d + 1)
       }
       
       popFrame(id, res)
       await new Promise(r => setTimeout(r, 600))
       setStack(prev => prev.filter(f => f.id !== id))
       return res
    }

    if (algo === "factorial") await factorial(n, 1)
    else await fib(n, 1)
    
    setIsExecuting(false)
    addLog("Execution Completed.")
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-blue-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
              <button 
                onClick={() => setViewMode("memory")}
                className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", viewMode === "memory" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300")}
              >
                Memory Model
              </button>
              <button 
                onClick={() => setViewMode("fractal")}
                className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", viewMode === "fractal" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300")}
              >
                Fractal Engine
              </button>
           </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
        {/* Sidebar Controls */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-2xl font-black italic tracking-tighter">Lenticular</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Recursive Architect</p>
              </header>

              {viewMode === "memory" ? (
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest">Algorithm Selection</label>
                       <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => setAlgo("factorial")} className={cn("py-3 rounded-xl border text-[10px] font-black transition-all", algo === "factorial" ? "bg-blue-500/10 border-blue-500/50 text-blue-400" : "bg-white/5 border-white/5 text-gray-700 hover:border-white/10")}>FACTORIAL</button>
                          <button onClick={() => setAlgo("fibonacci")} className={cn("py-3 rounded-xl border text-[10px] font-black transition-all", algo === "fibonacci" ? "bg-blue-500/10 border-blue-500/50 text-blue-400" : "bg-white/5 border-white/5 text-gray-700 hover:border-white/10")}>FIBONACCI</button>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest">Input (N)</label>
                          <span className="text-sm font-black text-blue-500 italic">{n}</span>
                       </div>
                       <input type="range" min="1" max="8" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-blue-600" />
                    </div>
                    <button 
                       onClick={runMemorySim} disabled={isExecuting}
                       className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-blue-500/20"
                    >
                       EXECUTE CALL STACK
                    </button>
                 </div>
              ) : (
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest">Depth (Limit)</label>
                       <input type="range" min="1" max="10" value={depth} onChange={(e) => setDepth(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-blue-600" />
                    </div>
                    <button onClick={startFractal} className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-blue-500/20">DRAW FRACTAL</button>
                 </div>
              )}
           </div>

           {/* Logs Overlay */}
           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-blue-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Runtime Console</h3>
              </div>
              <div className="space-y-1 h-44 overflow-y-auto custom-scrollbar font-mono text-[9px] text-gray-500">
                 {logs.map((log, i) => (
                    <div key={i} className="py-1 border-b border-white/5 opacity-80 leading-tight truncate">{log}</div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-16 font-sans">Awaiting Instruction...</p>}
              </div>
           </div>
        </section>

        {/* Dynamic Visualizer View */}
        <section className="lg:col-span-3 flex flex-col gap-6">
           <div className="flex-1 glass rounded-[40px] border-white/5 relative p-10 overflow-hidden flex flex-col">
              
              {viewMode === "memory" ? (
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Stack View */}
                    <div className="bg-black/40 rounded-[32px] border border-white/5 flex flex-col overflow-hidden">
                       <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <Layers className="w-3 h-3 text-blue-500" />
                             <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Call Stack (LIFO)</h3>
                          </div>
                          <span className="text-[9px] font-bold text-blue-400/50 uppercase italic">Stack Limit: 1 MB</span>
                       </div>
                       <div className="flex-1 p-6 flex flex-col-reverse gap-3 overflow-y-auto custom-scrollbar">
                          <AnimatePresence>
                             {stack.map((frame, i) => (
                                <motion.div 
                                  key={frame.id} 
                                  initial={{ opacity: 0, scale: 0.9, y: 50 }} 
                                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                                  exit={{ opacity: 0, x: 50 }}
                                  className={cn(
                                    "p-4 rounded-2xl border flex justify-between items-center transition-all",
                                    frame.isReturning ? "bg-emerald-500/20 border-emerald-500/40" : "bg-blue-500/10 border-blue-500/20 shadow-xl"
                                  )}
                                >
                                   <div className="flex items-center gap-4">
                                      <div className={cn("w-2 h-2 rounded-full", frame.isReturning ? "bg-emerald-500" : "bg-blue-500 animate-pulse")} />
                                      <div className="flex flex-col gap-1">
                                         <p className="text-[10px] font-black uppercase italic tracking-tighter text-white">
                                            {frame.name}<span className="text-blue-400">({Object.values(frame.params).join(', ')})</span>
                                         </p>
                                         <p className="text-[8px] font-mono text-gray-500">ID: {frame.id} | ADDR: 0x{i.toString(16).padStart(4, '0')}</p>
                                      </div>
                                   </div>
                                   {frame.returnValue !== undefined && (
                                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-3 py-1 bg-emerald-500 rounded-lg text-white font-black text-[10px] italic">
                                         RET: {frame.returnValue}
                                      </motion.div>
                                   )}
                                </motion.div>
                             ))}
                             {stack.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                   <Layers className="w-64 h-64" />
                                </div>
                             )}
                          </AnimatePresence>
                       </div>
                    </div>

                    {/* Heap/Code Context */}
                    <div className="flex flex-col gap-6">
                       <div className="bg-white/5 rounded-[32px] border border-white/5 p-8 flex flex-col gap-6 h-1/2">
                          <div className="flex items-center gap-2 mb-4">
                             <Database className="w-4 h-4 text-purple-500" />
                             <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Managed Heap</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                                <p className="text-[9px] font-bold text-gray-600 uppercase">Young Gen</p>
                                <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden">
                                   <motion.div animate={{ width: `${stack.length * 10}%` }} className="h-full bg-blue-500" />
                                </div>
                             </div>
                             <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                                <p className="text-[9px] font-bold text-gray-600 uppercase">Old Gen</p>
                                <div className="h-1 bg-purple-500/20 rounded-full overflow-hidden">
                                   <div className="h-full bg-purple-500 w-[20%]" />
                                </div>
                             </div>
                          </div>
                          <p className="text-[10px] text-gray-600 leading-relaxed italic">
                             Heap space is used for objects, closures, and long-lived data. Recursive frames however live on the **Stack**, which is much smaller and strictly ordered.
                          </p>
                       </div>

                       <div className="bg-black p-8 rounded-[32px] border border-white/5 font-mono text-[11px] text-gray-300 relative h-1/2 overflow-hidden">
                          <Code2 className="absolute top-8 right-8 w-12 h-12 text-blue-500/10" />
                          <p className="text-blue-500 mb-4 font-bold tracking-widest italic uppercase">Source::{algo}.ts</p>
                          {algo === "factorial" ? (
                             <pre className="space-y-1">
                                <div className={cn(stack.length > 0 && "text-blue-400 bg-blue-500/5")}>function factorial(n) {"{"}</div>
                                <div className={cn(stack.some(f => f.params.n <= 1) && "text-emerald-400 bg-emerald-500/5")}>  if (n {"<="} 1) return 1;</div>
                                <div className={cn(stack.length > 0 && !stack.some(f => f.params.n <= 1) && "text-blue-400")}>  return n * factorial(n - 1);</div>
                                <div>{"}"}</div>
                             </pre>
                          ) : (
                             <pre className="space-y-1">
                                <div className={cn(stack.length > 0 && "text-blue-400 bg-blue-500/5")}>function fib(n) {"{"}</div>
                                <div className={cn(stack.some(f => f.params.n <= 1) && "text-emerald-400 bg-emerald-500/5")}>  if (n {"<="} 1) return n;</div>
                                <div className="text-blue-400">  return fib(n-1) + fib(n-2);</div>
                                <div>{"}"}</div>
                             </pre>
                          )}
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <canvas ref={canvasRef} className="w-full h-full max-h-[500px]" style={{ filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.2))" }} />
                 </div>
              )}

              {/* Bottom HUD */}
              <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-end">
                 <div className="space-y-4 max-w-xl">
                    <div className="flex items-center gap-2">
                       <Zap className="w-4 h-4 text-amber-500" />
                       <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Architectural Insight</h4>
                    </div>
                    <p className="text-[11px] text-gray-600 font-light italic leading-relaxed">
                       {viewMode === "memory" 
                          ? "Every recursive call creates a new Execution Context Frame. Values like 'n' are locally scoped to each frame. The 'return' phase (Rewind) passes computed values from the innermost frame back up the stack until the root call finishes."
                          : "Fractals are visual proof of recursion. Each branch is a sub-problem identical to the whole, terminating only when the 'depth' (base case) limit is reached to prevent a stack overflow."
                       }
                    </p>
                 </div>
                 
                 <div className="flex gap-4">
                    <Metric label="Stack Depth" value={stack.length} color="text-blue-500" />
                    <Metric label="Allocations" value={stack.reduce((acc, f) => acc + (f.isReturning ? 0 : 1), 0)} color="text-emerald-500" />
                 </div>
              </div>
           </div>
        </section>
      </div>
      <style jsx global>{`
        canvas { width: 100% !important; height: 100% !important; }
      `}</style>
    </main>
  )
}

function Metric({ label, value, color }: any) {
  return (
    <div className="text-right">
       <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">{label}</p>
       <p className={cn("text-3xl font-black italic tracking-tighter leading-none", color)}>{value}</p>
    </div>
  )
}
