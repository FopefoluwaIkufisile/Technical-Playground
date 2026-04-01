"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Globe, Server, Database, Search, Activity, ChevronRight, Zap, Cloud, ShieldCheck, Clock, Trash2, Info, AlertCircle, Layers } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type DNSStep = {
  id: string
  name: string
  type: "resolver" | "root" | "tld" | "auth"
  description: string
  response: string
}

type CacheEntry = {
  domain: string
  ip: string
  ttl: number
  expiresAt: number
}

const steps: DNSStep[] = [
  { id: "resolver", name: "Recursive Resolver", type: "resolver", description: "Your ISP's server. It starts the hunt.", response: "Looking up origin..." },
  { id: "root", name: "Root Server", type: "root", description: "The top of the hierarchy. Points to TLDs.", response: "Check the TLD server." },
  { id: "tld", name: "TLD Server", type: "tld", description: "Manages specific extensions (e.g. .com, .org).", response: "Check the Google NS." },
  { id: "auth", name: "Authoritative NS", type: "auth", description: "The final source of truth for the domain.", response: "Resolved to 142.250.190.46" }
]

export default function DNSPage() {
  const [domain, setDomain] = useState("google.com")
  const [activeStep, setActiveStep] = useState<number>(-1)
  const [isResolving, setIsResolving] = useState(false)
  const [logs, setLogs] = useState<{ msg: string; type: "outgoing" | "incoming" | "cache"; time: string }[]>([])
  const [cache, setCache] = useState<CacheEntry[]>([])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now()
      setNow(currentTime)
      setCache(prev => prev.filter(item => item.expiresAt > currentTime))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const addLog = useCallback((msg: string, type: "outgoing" | "incoming" | "cache" = "outgoing") => {
    const time = new Date().toLocaleTimeString().split(' ')[0]
    setLogs(prev => [{ msg, type, time }, ...prev].slice(0, 10))
  }, [])

  const resolve = async () => {
    if (isResolving || !domain) return
    
    // 1. Check Cache
    const cached = cache.find(c => c.domain.toLowerCase() === domain.toLowerCase())
    if (cached) {
       addLog(`CACHE HIT: Found ${domain} in local DNS cache.`, "cache")
       addLog(`Result: ${cached.ip} (TTL: ${Math.round((cached.expiresAt - now) / 1000)}s remaining)`, "incoming")
       return
    }

    setIsResolving(true)
    setActiveStep(-1)
    setLogs([])
    addLog(`Initiating recursive lookup for ${domain}...`, "outgoing")

    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i)
      addLog(`Querying ${steps[i].name}...`, "outgoing")
      await new Promise(r => setTimeout(r, 1200))
      addLog(`${steps[i].name} responded.`, "incoming")
      await new Promise(r => setTimeout(r, 400))
    }

    // 4. Add to Cache
    const ip = `142.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.46`
    setCache(prev => [...prev, {
       domain,
       ip,
       ttl: 60,
       expiresAt: Date.now() + 60000
    }])
    addLog(`L-CACHE: Storing ${domain} -> ${ip} (TTL: 60s)`, "cache")

    setIsResolving(false)
    setActiveStep(-1)
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
            <Globe className="w-3 h-3 animate-pulse" />
            Infrastructure Lab: DNS
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls & Cache */}
        <section className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[32px] border-white/5 space-y-6">
            <header className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Atlas</h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Recursive Resolver</p>
            </header>

            <div className="space-y-4">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" value={domain} onChange={(e) => setDomain(e.target.value.toLowerCase())}
                    placeholder="google.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs focus:border-blue-500 outline-none transition-colors"
                  />
               </div>
               <button 
                  onClick={resolve} disabled={isResolving}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-blue-500/20"
               >
                 {isResolving ? "Resolving Tree..." : "Execute Lookup"}
               </button>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Clock className="w-3 h-3 text-blue-400" />
                   <h3 className="text-[10px] font-bold uppercase text-gray-500">Local Cache (TTL)</h3>
                </div>
                <button onClick={() => setCache([])} className="text-gray-700 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
             </div>
             <div className="space-y-2 max-h-44 overflow-y-auto custom-scrollbar pr-2">
                {cache.map((entry, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center group">
                     <div>
                        <p className="text-[11px] font-bold text-blue-300">{entry.domain}</p>
                        <p className="text-[9px] text-gray-600 font-mono">{entry.ip}</p>
                     </div>
                     <div className="text-[9px] font-mono text-gray-700 border border-white/5 px-2 py-1 rounded-lg">
                        {Math.max(0, Math.round((entry.expiresAt - now) / 1000))}s
                     </div>
                  </div>
                ))}
                {cache.length === 0 && <p className="text-center py-8 text-[10px] text-gray-800 italic uppercase font-bold tracking-widest leading-none">Cache Purged</p>}
             </div>
          </div>
        </section>

        {/* Visualizer Trace Area */}
        <section className="lg:col-span-3 space-y-6">
           <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 md:p-12 relative min-h-[500px] flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Zap className="w-64 h-64" />
              </div>

              {/* Server Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 relative z-10">
                 {steps.map((step, i) => (
                   <motion.div 
                     key={step.id}
                     animate={{ 
                        scale: activeStep === i ? 1.05 : 1,
                        opacity: isResolving ? (activeStep === i ? 1 : 0.4) : 1
                     }}
                     className={cn(
                        "relative flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all duration-500",
                        activeStep === i ? "bg-blue-600/10 border-blue-500/40 shadow-[0_0_40px_rgba(37,99,235,0.1)]" : "bg-white/5 border-white/5"
                     )}
                   >
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center border transition-colors",
                        activeStep === i ? "bg-blue-500/20 border-blue-500/30 text-blue-400" : "bg-black/40 border-white/5 text-gray-700"
                      )}>
                         {i === 0 ? <Server className="w-8 h-8" /> : 
                          i === 1 ? <Cloud className="w-8 h-8" /> :
                          i === 2 ? <Database className="w-8 h-8" /> :
                          <ShieldCheck className="w-8 h-8" />}
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{step.name}</p>
                         <p className="text-[9px] text-gray-700 font-mono italic">{step.id}.root</p>
                      </div>

                      {activeStep === i && (
                         <motion.div 
                           layoutId="pulse"
                           className="absolute -inset-1 rounded-[30px] border border-blue-500/50 blur-sm"
                         />
                      )}
                   </motion.div>
                 ))}
                 
                 {/* Connection Cable */}
                 <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 -z-10" />
              </div>

              {/* Informational HUD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-white/5 relative z-10">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Activity className="w-4 h-4 text-blue-400" />
                       <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Active Resolution insight</h3>
                    </div>
                    <AnimatePresence mode="wait">
                       {activeStep >= 0 ? (
                         <motion.div 
                           key={activeStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                           className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl space-y-2"
                         >
                            <p className="text-base sm:text-lg font-black italic tracking-tight">{steps[activeStep].name}</p>
                            <p className="text-sm text-gray-500 font-light leading-relaxed">{steps[activeStep].description}</p>
                            <div className="pt-2 font-mono text-[10px] text-blue-400">RES: {steps[activeStep].response}</div>
                         </motion.div>
                       ) : (
                         <div className="h-24 flex items-center justify-center border border-dashed border-white/5 rounded-3xl">
                            <p className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">Waiting for query...</p>
                         </div>
                       )}
                    </AnimatePresence>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Layers className="w-4 h-4 text-emerald-400" />
                       <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Resolver Telemetry</h3>
                    </div>
                    <div className="bg-black/40 rounded-3xl border border-white/5 p-6 h-36 overflow-y-auto custom-scrollbar font-mono text-[9px] space-y-1">
                       {logs.map((l, i) => (
                          <div key={i} className={cn(
                             "p-2 rounded border-l-2",
                             l.type === "cache" ? "bg-emerald-500/5 border-emerald-500/40 text-emerald-400" :
                             l.type === "incoming" ? "bg-blue-500/5 border-blue-500/40 text-blue-300" : 
                             "bg-white/5 border-white/5 text-gray-600"
                          )}>
                             <span className="opacity-30 mr-2">[{l.time}]</span> {l.msg}
                          </div>
                       ))}
                       {logs.length === 0 && <p className="italic opacity-10 text-center mt-12">No recent queries</p>}
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass p-6 sm:p-8 rounded-[40px] border-white/5 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                 <Info className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                 <h4 className="text-sm font-bold tracking-tight">The "Infinite" Hierarchy</h4>
                 <p className="text-xs text-gray-600 font-light leading-relaxed italic">
                    DNS isn't just one server. It's a distributed database. The <span className="text-blue-400">Recursive Resolver</span> (usually your ISP or Google/Cloudflare) traverses multiple layers to find the final IP. Without <span className="text-emerald-400">Caching</span>, the internet would slow to a crawl from billions of repeat lookups.
                 </p>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}
