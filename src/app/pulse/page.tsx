"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Activity, Wifi, Zap, AlertCircle, BarChart3, ChevronRight, Terminal, Gamepad2, SignalHigh } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DataPoint {
  time: number
  ping: number
  isLost: boolean
}

export default function PulsePage() {
  const [ping, setPing] = useState(25)
  const [jitter, setJitter] = useState(2)
  const [lossRate, setLossRate] = useState(0.0)
  const [history, setHistory] = useState<DataPoint[]>([])
  const [isLive, setIsLive] = useState(true)
  const [logs, setLogs] = useState<string[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const addLog = (msg: string) => setLogs(p => [`[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`, ...p].slice(0, 8))

  // Character State (Rubberbanding)
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 })
  const [lastServerPos, setLastServerPos] = useState({ x: 0, y: 0 })
  const [isRubberbanding, setIsRubberbanding] = useState(false)

  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => {
        const isLost = Math.random() < lossRate
        const basePing = ping
        const variation = (Math.random() - 0.5) * jitter * 2
        const currentPing = Math.max(1, basePing + variation)

        setHistory(prev => {
          const newHistory = [...prev, { time: Date.now(), ping: currentPing, isLost }]
          return newHistory.slice(-50)
        })

        if (isLost) {
          addLog("PACKET LOSS: Destination unreachable.")
        } else if (currentPing > 100) {
          addLog(`LATENCY SPIKE: ${currentPing.toFixed(0)}ms`)
        }

        // Move Player (Simulate Server-side movement)
        setLastServerPos(prev => ({
           x: prev.x + (Math.random() - 0.5) * 50,
           y: prev.y + (Math.random() - 0.5) * 50
        }))

      }, 100)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isLive, ping, jitter, lossRate])

  // Sync Player with Server Pos (Delayed by Ping)
  useEffect(() => {
    const delay = history[history.length - 1]?.ping || 0
    const isLost = history[history.length - 1]?.isLost

    if (isLost) {
       setIsRubberbanding(true)
       return
    }

    const t = setTimeout(() => {
      setIsRubberbanding(false)
      setPlayerPos(lastServerPos)
    }, delay)

    return () => clearTimeout(t)
  }, [lastServerPos, history])

  const stats = useMemo(() => {
     if (history.length === 0) return { avg: 0, jitter: 0, loss: 0 }
     const pings = history.filter(h => !h.isLost).map(h => h.ping)
     const avg = pings.reduce((a, b) => a + b, 0) / (pings.length || 1)
     const loss = (history.filter(h => h.isLost).length / history.length) * 100
     return { avg, loss }
  }, [history])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-indigo-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium flex items-center gap-2">
            <Wifi className="w-3 h-3 animate-pulse" />
            Networking Lab: Pulse
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Network Conditions */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Pulse</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Telemetry Laboratory</p>
              </header>

              <div className="space-y-6">
                 <ControlSlider label="Base Latency (ms)" value={ping} min={1} max={300} onChange={setPing} icon={<SignalHigh className="w-3 h-3" />} />
                 <ControlSlider label="Jitter (Variance)" value={jitter} min={0} max={100} onChange={setJitter} icon={<Zap className="w-3 h-3" />} />
                 <ControlSlider label="Packet Loss (%)" value={lossRate * 100} min={0} max={50} onChange={(v: number) => setLossRate(v / 100)} icon={<AlertCircle className="w-3 h-3" />} />
                 
                 <button 
                   onClick={() => setIsLive(!isLive)}
                   className={cn(
                     "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                     isLive ? "bg-rose-500/10 border border-rose-500/40 text-rose-500" : "bg-emerald-500/10 border border-emerald-500/40 text-emerald-500"
                   )}
                 >
                   {isLive ? "Disconnect Session" : "Establish Link"}
                 </button>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-indigo-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">ICMP Echo Request Log</h3>
              </div>
              <div className="space-y-1 h-44 overflow-y-auto custom-scrollbar font-mono text-[9px] text-gray-500">
                 {logs.map((log, i) => (
                    <div key={i} className="py-1 border-b border-white/5 opacity-80 italic">{log}</div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-12 lowercase">Awaiting Ping...</p>}
              </div>
           </div>
        </section>

        {/* Real-time Visualization */}
        <section className="lg:col-span-3 space-y-6">
           <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 h-[450px] relative flex flex-col overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                 <Activity className="w-64 h-64" />
              </div>

              {/* Ping Chart Overlay */}
              <div className="flex-1 flex flex-col gap-6 relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
                     <div className="flex gap-4 items-center">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                           <BarChart3 className="w-6 h-6 border-none" />
                        </div>
                        <div>
                           <h3 className="text-sm font-black italic uppercase tracking-tight">Latency Flux Graph</h3>
                           <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest italic">Live Network Throughput</p>
                        </div>
                     </div>
                     <div className="flex gap-4 w-full sm:w-auto justify-end">
                        <Stat label="Average Ping" value={`${stats.avg.toFixed(0)} ms`} color="text-emerald-400" />
                        <Stat label="Packet Loss" value={`${stats.loss.toFixed(1)}%`} color="text-rose-400" />
                     </div>
                  </div>

                 {/* The Chart */}
                 <div className="flex-1 flex items-end gap-1 px-4 pb-8 overflow-hidden">
                    {history.map((point, i) => (
                       <motion.div 
                         key={point.time}
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ 
                            height: point.isLost ? "100%" : `${Math.max(5, (point.ping / 300) * 100)}%`,
                            opacity: 1,
                            backgroundColor: point.isLost ? "#ef4444" : point.ping > 120 ? "#facc15" : "#4f46e5"
                         }}
                         className={cn(
                            "flex-1 min-w-[2px] rounded-t-sm transition-colors duration-300",
                            point.isLost && "opacity-20 animate-pulse"
                         )}
                       />
                    ))}
                 </div>
              </div>
           </div>

           {/* Gaming Impact Simulation */}
           <div className="glass rounded-[40px] border-white/5 p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-center overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0 relative">
                 <Gamepad2 className={cn("w-10 h-10", isRubberbanding && "text-rose-500 animate-bounce")} />
                 {isRubberbanding && (
                    <motion.div 
                      key="warn" initial={{ scale: 0 }} animate={{ scale: 1.2 }}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full border-2 border-black"
                    >
                       <AlertCircle className="w-4 h-4" />
                    </motion.div>
                 )}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-white tracking-widest italic leading-none">Netcode Logic Test</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-light font-sans">
                       Notice the "Server" vs "Client" position. High <span className="text-indigo-400">Jitter</span> makes movement unpredictable, while <span className="text-rose-400">Packet Loss</span> causes <b>Rubber-banding</b> as the client force-syncs with stale server data.
                    </p>
                 </div>
                 
                 <div className="flex gap-4 items-center justify-end">
                    <div className="space-y-1 text-right">
                       <p className="text-[8px] font-black uppercase text-gray-700 tracking-widest">Client Sync</p>
                       <p className={cn("text-sm font-black italic tracking-tighter", isRubberbanding ? "text-rose-500" : "text-emerald-500")}>
                          {isRubberbanding ? "OUT OF SYNC" : "STABLE"}
                       </p>
                    </div>
                    <div className="w-20 h-10 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                       <motion.div 
                         animate={{ 
                            x: isRubberbanding ? [0, 5, -5, 0] : 0,
                            translateY: isRubberbanding ? -5 : 0
                         }}
                         transition={{ repeat: isRubberbanding ? Infinity : 0, duration: 0.2 }}
                         className="w-4 h-4 bg-indigo-500 rounded-lg shadow-[0_0_15px_#4f46e5]"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function ControlSlider({ label, value, min, max, onChange, icon }: any) {
  return (
    <div className="space-y-3">
       <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          <div className="flex items-center gap-2">{icon} {label}</div>
          <span className="text-indigo-400 font-mono italic">{value.toFixed(0)}</span>
       </div>
       <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-indigo-600 cursor-pointer" />
    </div>
  )
}

function Stat({ label, value, color }: any) {
  return (
    <div className="text-right">
       <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">{label}</p>
       <p className={cn("text-2xl font-black italic tracking-tighter leading-none", color)}>{value}</p>
    </div>
  )
}
