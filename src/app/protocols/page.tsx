"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Zap, Shield, RotateCcw, Play, CheckCircle2, XCircle, Send, Radio, Activity, Terminal, Info, ChevronRight, Share2, AlertCircle, BarChart3 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Packet = { id: string, status: "pending" | "sent" | "acked" | "lost", type: "data" | "syn" | "ack" | "syn-ack" }

export default function ProtocolsPage() {
  const [tcpPackets, setTcpPackets] = useState<Packet[]>([])
  const [udpPackets, setUdpPackets] = useState<Packet[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [lossRate, setLossRate] = useState(0.2)
  const [cwnd, setCwnd] = useState(1) // Congestion Window
  const [tcpHandshake, setTcpHandshake] = useState<"idle" | "syn" | "syn-ack" | "ack" | "established">("idle")
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => setLogs(p => [msg, ...p].slice(0, 5))

  const reset = () => {
    setTcpPackets([])
    setUdpPackets([])
    setIsRunning(false)
    setCwnd(1)
    setTcpHandshake("idle")
    setLogs([])
  }

  const startHandshake = async () => {
     if (tcpHandshake !== "idle") return
     setTcpHandshake("syn")
     addLog("TCP: Sending SYN (Synchronize)...")
     await new Promise(r => setTimeout(r, 1000))
     setTcpHandshake("syn-ack")
     addLog("TCP: Received SYN-ACK from Server.")
     await new Promise(r => setTimeout(r, 1000))
     setTcpHandshake("ack")
     addLog("TCP: Sending final ACK. Connection established.")
     await new Promise(r => setTimeout(r, 800))
     setTcpHandshake("established")
  }

  const runSimulation = async () => {
     if (isRunning) return
     if (tcpHandshake !== "established") {
        addLog("ERROR: TCP connection not established. Perform handshake first.")
        return
     }
     setIsRunning(true)
     setTcpPackets([])
     setUdpPackets([])

     const totalPackets = 12
     
     // UDP Flow: Blast everything.
     const runUdp = async () => {
        addLog("UDP: Starting fire-and-forget stream.")
        for (let i = 0; i < totalPackets; i++) {
           const id = Math.random().toString()
           const isLost = Math.random() < lossRate
           setUdpPackets(prev => [...prev, { id, status: "pending", type: "data" }])
           await new Promise(r => setTimeout(r, 150))
           setUdpPackets(prev => prev.map(p => p.id === id ? { ...p, status: isLost ? "lost" : "sent" } : p))
        }
     }

     // TCP Flow: Window-based with retransmission.
     const runTcp = async () => {
        let sentCount = 0
        let currentCwnd = 1
        setCwnd(currentCwnd)
        addLog("TCP: Starting Slow-Start (Congestion Window = 1)")

        while (sentCount < totalPackets) {
           const batchSize = Math.min(currentCwnd, totalPackets - sentCount)
           const currentBatchIds: string[] = []

           // Send batch
           for (let i = 0; i < batchSize; i++) {
              const id = Math.random().toString()
              currentBatchIds.push(id)
              setTcpPackets(prev => [...prev.map(p => ({...p})), { id, status: "sent", type: "data" }])
           }

           await new Promise(r => setTimeout(r, 1000))

           // Resolve batch
           let allAcked = true
           for (const id of currentBatchIds) {
              const isLost = Math.random() < lossRate
              if (isLost) {
                 allAcked = false
                 setTcpPackets(prev => prev.map(p => p.id === id ? { ...p, status: "lost" } : p))
              } else {
                 setTcpPackets(prev => prev.map(p => p.id === id ? { ...p, status: "acked" } : p))
              }
           }

           if (allAcked) {
              sentCount += batchSize
              currentCwnd = Math.min(currentCwnd * 2, 8) // Exponential growth
              addLog(`TCP: Batch ACKED. CWND grew to ${currentCwnd}.`)
           } else {
              currentCwnd = 1 // Panic: back to slow start
              addLog(`TCP: Packet LOSS! MD triggered. CWND reset to 1.`)
           }
           setCwnd(currentCwnd)
           await new Promise(r => setTimeout(r, 800))
        }
        setIsRunning(false)
     }

     Promise.all([runUdp(), runTcp()])
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-blue-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-2">
            <Radio className="w-3 h-3 animate-pulse" />
            Infrastructure Lab: Wire
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Network Parameters */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Wire</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Transport Layer Conflict</p>
              </header>

              <div className="space-y-4">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-gray-700">Network Congestion (Loss)</label>
                       <span className="text-[10px] font-mono text-red-500 font-bold">{(lossRate * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="0.5" step="0.1" value={lossRate} onChange={(e) => setLossRate(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none accent-red-500 cursor-pointer"
                    />
                 </div>

                 <div className="pt-4 border-t border-white/5 space-y-3">
                    <button 
                      onClick={startHandshake} disabled={tcpHandshake !== "idle"}
                      className={cn(
                        "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border",
                        tcpHandshake === "established" ? "bg-blue-500/10 border-blue-500/40 text-blue-400" : "bg-white/5 border-white/5 hover:border-white/20 text-gray-400"
                      )}
                    >
                       {tcpHandshake === "established" ? "✓ CONNECTION READY" : "1. TCP HANDSHAKE"}
                    </button>
                    
                    <button 
                       onClick={runSimulation} disabled={isRunning || tcpHandshake !== "established"}
                       className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                    >
                       <Play className="w-4 h-4 mr-2 inline-block fill-current" />
                       Start Data Stream
                    </button>
                    <button onClick={reset} className="w-full py-2 text-[9px] text-gray-800 hover:text-white transition-colors font-black uppercase tracking-widest">Flush Buffer</button>
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-indigo-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500">Socket Telemetry</h3>
              </div>
              <div className="space-y-1 h-36 overflow-y-auto custom-scrollbar font-mono text-[9px] text-gray-500 px-2">
                 {logs.map((l, i) => (
                    <div key={i} className="py-1 border-b border-white/5 opacity-80 italic leading-none">{l}</div>
                 ))}
                 {logs.length === 0 && <p className="text-center italic opacity-10 mt-12">Listening for frames...</p>}
              </div>
           </div>
        </section>

        {/* Visualizer Tracks */}
        <section className="lg:col-span-3 space-y-6">
           {/* TCP Visualization */}
           <div className="glass rounded-[40px] border-white/5 p-10 flex flex-col gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                 <Shield className="w-64 h-64" />
              </div>

               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 relative z-10">
                  <div className="flex gap-4 items-center">
                     <div className="w-12 h-12 rounded-2xl border border-white/5 bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Activity className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-sm font-black italic tracking-tighter uppercase">TCP: Controlled Stream</h3>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-700">Sequence Integrity & Flow Control</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-4 w-full sm:w-auto justify-end">
                     <MetricBox label="CWND (Window)" value={cwnd} sub="Slow Start Active" color="text-blue-400" />
                     <MetricBox label="Status" value={tcpHandshake === "established" ? "CON_EST" : "CLOSED"} sub="Handshake Flag" color="text-white" />
                  </div>
               </div>

              {/* TCP Handshake Status Bar */}
              {tcpHandshake !== "established" && tcpHandshake !== "idle" && (
                  <div className="py-2 px-4 sm:px-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-between text-[8px] sm:text-[10px] font-mono">
                    <div className={cn("flex items-center gap-2", tcpHandshake === "syn" && "text-white")}>
                       <span className={cn("w-2 h-2 rounded-full", tcpHandshake === "syn" ? "bg-blue-500 animate-ping" : "bg-gray-800")} />
                       SYN
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-20" />
                    <div className={cn("flex items-center gap-2", tcpHandshake === "syn-ack" && "text-white")}>
                       <span className={cn("w-2 h-2 rounded-full", tcpHandshake === "syn-ack" ? "bg-blue-500 animate-ping" : "bg-gray-800")} />
                       SYN-ACK
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-20" />
                    <div className={cn("flex items-center gap-2", tcpHandshake === "ack" && "text-white")}>
                       <span className={cn("w-2 h-2 rounded-full", tcpHandshake === "ack" ? "bg-blue-500 animate-ping" : "bg-gray-800")} />
                       ACK
                    </div>
                 </div>
              )}

              <div className="flex-1 min-h-[140px] bg-black/40 rounded-[32px] p-8 flex items-center gap-4 relative overflow-x-auto custom-scrollbar">
                 <AnimatePresence>
                    {tcpPackets.map((p, i) => (
                       <motion.div 
                          key={p.id}
                          initial={{ scale: 0, x: -50 }}
                          animate={{ scale: 1, x: 0 }}
                          className={cn(
                             "w-12 h-16 rounded-xl border flex flex-col items-center justify-center gap-2 shadow-2xl relative transition-colors duration-500 flex-shrink-0",
                             p.status === "acked" ? "bg-emerald-500 border-emerald-400" :
                             p.status === "lost" ? "bg-red-500 border-red-400" : "bg-blue-600 border-blue-400"
                          )}
                       >
                          {p.status === "acked" ? <CheckCircle2 className="w-4 h-4 text-white" /> : 
                           p.status === "lost" ? <XCircle className="w-4 h-4 text-white" /> : 
                           <Zap className="w-4 h-4 text-white animate-pulse" />}
                          <span className="text-[7px] font-black uppercase text-white/50">{p.status}</span>
                       </motion.div>
                    ))}
                    {tcpPackets.length === 0 && (
                       <p className="absolute inset-x-0 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-800 italic">Stateful Connection Buffer</p>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* UDP Visualization */}
           <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 flex flex-col gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                 <Radio className="w-64 h-64" />
              </div>

               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 relative z-10">
                  <div className="flex gap-4 items-center">
                     <div className="w-12 h-12 rounded-2xl border border-white/5 bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <Zap className="w-6 h-6 border-none" />
                     </div>
                     <div>
                        <h3 className="text-sm font-black italic tracking-tighter uppercase">UDP: Stateless Blast</h3>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-700">Fire-and-forget / Unordered</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-4 w-full sm:w-auto justify-end">
                     <MetricBox label="Reliability" value="0%" sub="No Retransmission" color="text-orange-400" />
                     <MetricBox label="Latency" value="ULTRA-LOW" sub="No overhead ACKs" color="text-emerald-400" />
                  </div>
               </div>

              <div className="flex-1 min-h-[140px] bg-black/40 rounded-[32px] p-8 flex items-center gap-3 relative overflow-x-auto custom-scrollbar">
                 <AnimatePresence>
                    {udpPackets.map((p, i) => (
                       <motion.div 
                          key={p.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                             "w-10 h-14 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors duration-300 flex-shrink-0 shadow-lg",
                             p.status === "lost" ? "bg-red-500 border-red-400" : "bg-orange-600 border-orange-400"
                          )}
                       >
                          {p.status === "lost" ? <AlertCircle className="w-4 h-4 text-white" /> : <Send className="w-3.5 h-3.5 text-white/50" />}
                          <span className="text-[6px] font-black uppercase text-white/40">{p.status === "lost" ? "DROPPED" : "FIRE"}</span>
                       </motion.div>
                    ))}
                    {udpPackets.length === 0 && (
                       <p className="absolute inset-x-0 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-800 italic">Unordered Datagram Stream</p>
                    )}
                 </AnimatePresence>
              </div>

              <div className="pt-2 flex gap-6 items-center">
                 <Info className="w-5 h-5 text-gray-700 shrink-0" />
                 <p className="text-[10px] text-gray-600 leading-relaxed font-light italic">
                    Note how <b>UDP</b> immediately fires packets without checking if the server is ready. If one is dropped, it's <span className="text-red-500 font-bold uppercase">gone forever</span>, which is ideal for real-time video/gaming.
                 </p>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function MetricBox({ label, value, sub, color }: any) {
  return (
    <div className="text-right space-y-1">
       <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">{label}</p>
       <p className={cn("text-lg font-black italic tracking-tighter leading-none", color)}>{value}</p>
       <p className="text-[7px] text-gray-800 font-bold uppercase tracking-tighter">{sub}</p>
    </div>
  )
}
