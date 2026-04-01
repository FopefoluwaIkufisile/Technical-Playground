"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Box, Boxes, Database, HardDrive, Layout, Plus, Play, Trash2, Cpu, Info, CheckCircle2, Network, Terminal, Share2, Zap, Server, Globe, Settings, FileCode } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Container = {
  id: string
  name: string
  status: "running" | "stopped"
  ip: string
  network: string
  hasVolume: boolean
  persistentData: string | null
}

const initialLayers = [
  { id: "L1", name: "Alpine Linux", size: "5.5MB", cmd: "FROM alpine:latest" },
  { id: "L2", name: "Node.js Runtime", size: "120MB", cmd: "RUN apk add nodejs" },
  { id: "L3", name: "Dependencies", size: "45MB", cmd: "COPY package.json ." },
  { id: "L4", name: "Application code", size: "2MB", cmd: "COPY . ." }
]

export default function DockerPage() {
  const [containers, setContainers] = useState<Container[]>([])
  const [volumeData, setVolumeData] = useState<string | null>(null)
  const [useVolume, setUseVolume] = useState(false)
  const [networkName, setNetworkName] = useState("bridge-01")
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => setLogs(p => [msg, ...p].slice(0, 5))

  const deployContainer = () => {
     const id = Math.random().toString(36).substr(2, 5).toUpperCase()
     const newContainer: Container = {
        id,
        name: `web_app_${id.toLowerCase()}`,
        status: "running",
        ip: `172.17.0.${containers.length + 2}`,
        network: networkName,
        hasVolume: useVolume,
        persistentData: useVolume ? volumeData : "Initialized local fs..."
     }
     setContainers(prev => [...prev, newContainer])
     addLog(`Docker: Container ${newContainer.name} started on ${newContainer.network}`)
  }

  const deleteContainer = (id: string) => {
     const container = containers.find(c => c.id === id)
     if (container?.hasVolume) {
        // Data stays in volumeData state (Host-managed)
        addLog(`Docker: Container ${id} removed. Volume preserved on host.`)
     } else {
        addLog(`Docker: Container ${id} removed. All local data WIPED.`)
     }
     setContainers(prev => prev.filter(c => c.id !== id))
  }

  const writeData = (id: string) => {
     const text = "SESS_AUTH_" + Math.random().toString(36).substr(2, 4)
     if (useVolume) {
        setVolumeData(text)
     }
     setContainers(prev => prev.map(c => c.id === id ? { ...c, persistentData: text } : c))
     addLog(`FS: Wrote '${text}' to /app/data.txt`)
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
            <Box className="w-3 h-3 animate-pulse" />
            Infrastructure Lab: Docker
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Orchestration Panel */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Shipyard</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Container Runtime</p>
              </header>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest">Network Config</label>
                    <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                       <Network className="w-4 h-4 text-blue-500" />
                       <input 
                         type="text" value={networkName} onChange={(e) => setNetworkName(e.target.value)}
                         className="bg-transparent border-none outline-none text-[11px] font-mono w-full"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <button 
                      onClick={() => setUseVolume(!useVolume)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                        useVolume ? "bg-blue-500/10 border-blue-500/40 text-blue-400" : "bg-white/5 border-white/5 text-gray-600"
                      )}
                    >
                       <div className="flex items-center gap-3">
                          <HardDrive className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">Mount Host Volume</span>
                       </div>
                       <div className={cn("w-1.5 h-1.5 rounded-full", useVolume ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]" : "bg-gray-800")} />
                    </button>
                    {useVolume && (
                       <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-blue-400/50">host:/var/lib/docker</span>
                          <span className="text-[10px] font-bold text-white tracking-widest">{volumeData ? "DATA: PERSISTED" : "EMPTY"}</span>
                       </div>
                    )}
                 </div>

                 <button 
                   onClick={deployContainer}
                   className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-blue-500/20 mt-4"
                 >
                   <Plus className="w-4 h-4 mr-2 inline-block" />
                   UP Instance
                 </button>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-blue-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500">Daemon Logs</h3>
              </div>
              <div className="space-y-1 h-36 overflow-y-auto custom-scrollbar font-mono text-[9px] text-gray-400">
                 {logs.map((l, i) => (
                    <div key={i} className="p-1 border-b border-white/5 leading-tight opacity-80">{l}</div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-12">Listening...</p>}
              </div>
           </div>
        </section>

        {/* Visual Layer Stack */}
        <section className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex-1 glass rounded-[40px] border-white/5 p-6 sm:p-10 md:p-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px]">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Boxes className="w-64 h-64" />
              </div>

              {/* 3D Stack Visualization */}
              <div className="relative perspective-1000">
                 <div className="flex flex-col-reverse gap-[-10px] items-center -rotate-x-[25deg] rotate-z-[5deg]">
                    
                    {/* Read-Only Image Layers */}
                    {initialLayers.map((layer, i) => (
                        <motion.div 
                          key={layer.id}
                          style={{ transform: typeof window !== 'undefined' && window.innerWidth < 640 ? 'none' : `translateZ(${i * 20}px)` }}
                          className="w-48 sm:w-64 h-10 sm:h-12 bg-white/5 border border-white/10 rounded-xl relative flex items-center justify-start px-4 transition-all hover:bg-white/10 group mb-[-15px] sm:mb-[-20px]"
                        >
                          <div className="flex items-center gap-3">
                             <Layout className="w-3 h-3 text-gray-700" />
                             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{layer.name}</span>
                          </div>
                          <div className="absolute right-4 text-[7px] font-mono text-gray-800 uppercase tracking-tighter">Read Only</div>
                       </motion.div>
                    ))}

                    {/* Writable Container Layers */}
                    <AnimatePresence>
                       {containers.map((c, i) => (
                           <motion.div 
                             key={c.id} 
                             initial={{ opacity: 0, y: -100, scale: 0.9 }} 
                             animate={{ opacity: 1, y: 0, scale: 1 }} 
                             exit={{ opacity: 0, scale: 1.1 }}
                             className="w-56 sm:w-72 h-14 sm:h-16 bg-blue-600/20 border-2 border-blue-500/50 rounded-2xl relative flex items-center justify-between px-4 sm:px-6 z-50 shadow-2xl backdrop-blur-md mb-2 group"
                           >
                             <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-blue-400">{c.name}</span>
                                <span className="text-[8px] font-mono text-gray-500 uppercase italic">{c.ip}</span>
                             </div>
                             <div className="flex gap-3">
                                <button onClick={() => writeData(c.id)} title="Write Data" className="text-blue-400 hover:text-white transition-colors">
                                   <FileCode className="w-4 h-4 cursor-pointer" />
                                </button>
                                <button onClick={() => deleteContainer(c.id)} title="Rm Container" className="text-red-400 hover:text-white transition-colors">
                                   <Trash2 className="w-4 h-4 cursor-pointer" />
                                </button>
                             </div>
                             
                             {/* Persistent Data Visualizer */}
                              {c.persistentData && (
                                 <motion.div 
                                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                   className="absolute -bottom-16 sm:bottom-auto sm:-right-48 p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-[8px] text-emerald-400 flex flex-col gap-1 w-40 z-50"
                                 >
                                    <span className="text-gray-600 uppercase font-black tracking-widest">In-Memory FS</span>
                                    <span className="truncate">data: "{c.persistentData}"</span>
                                 </motion.div>
                              )}
                          </motion.div>
                       ))}
                    </AnimatePresence>

                    {containers.length === 0 && (
                       <div className="h-20 flex items-center justify-center">
                          <p className="text-[10px] text-gray-800 uppercase font-black italic tracking-widest animate-pulse">Waiting for instances...</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Metrics Grid */}
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-8 flex flex-col xl:flex-row items-center justify-between gap-8 sm:gap-12">
               <div className="flex items-center gap-6 w-full xl:basis-1/3">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                     <Share2 className="w-7 h-7" />
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black uppercase text-gray-600 tracking-widest italic">Shared Image Disk</h4>
                     <p className="text-sm font-bold tracking-tight">172.5 MB (Baseline)</p>
                  </div>
               </div>

               <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 border-t xl:border-t-0 xl:border-l border-white/5 pt-8 xl:pt-0 xl:pl-12">
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold uppercase text-gray-700">Storage Strategy</p>
                     <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                        Un-mounted containers use <b>OverlayFS</b>. If the container is deleted, all writes are lost forever. 
                        <span className="text-blue-400"> Volumes</span> bypass the tiered FS to store data directly on the host disk.
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold uppercase text-gray-700">Network Topology</p>
                     <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                        Docker creates virtual <b>Bridge Networks</b>. Containers on the same bridge can resolve each other by name via a built-in resolver.
                     </p>
                  </div>
               </div>
            </div>
        </section>
      </div>
      <style jsx global>{`
        .perspective-1000 { perspective: 1200px; }
        .-rotate-x-\[25deg\] { transform: rotateX(35deg) scale(0.9); }
      `}</style>
    </main>
  )
}
