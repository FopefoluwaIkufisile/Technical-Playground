"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Shield, ShieldAlert, ShieldCheck, Globe, Server, Send, Info, Lock, Share2, Cookie, Fingerprint, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type RequestStatus = "idle" | "preflight" | "fetching" | "success" | "blocked"

export default function CORSPage() {
  const [originA] = useState("https://client.app")
  const [originB] = useState("https://api.service.io")
  const [method, setMethod] = useState("GET")
  const [allowOrigin, setAllowOrigin] = useState("*")
  const [allowCredentials, setAllowCredentials] = useState(false)
  const [sendCredentials, setSendCredentials] = useState(false)
  const [hasCustomHeader, setHasCustomHeader] = useState(false)
  
  const [status, setStatus] = useState<RequestStatus>("idle")
  const [logs, setLogs] = useState<{ type: "req" | "res" | "err" | "info" | "opt", msg: string, headers?: any }[]>([])

  const addLog = (type: any, msg: string, headers?: any) => setLogs(p => [{ type, msg, headers }, ...p].slice(0, 10))

  const handleFetch = async () => {
    setStatus("preflight")
    setLogs([])
    
    const needsPreflight = method !== "GET" || hasCustomHeader
    
    if (needsPreflight) {
       addLog("info", "Browser identifies this as a 'Complex Request'.")
       addLog("opt", `OPTIONS /data (Origin: ${originA})`, {
         "Access-Control-Request-Method": method,
         "Access-Control-Request-Headers": hasCustomHeader ? "x-technical-lab" : "none"
       })
       await new Promise(r => setTimeout(r, 1500))
       
       // Server logic for preflight
       const preflightMatch = allowOrigin === "*" || allowOrigin === originA
       if (!preflightMatch) {
          addLog("err", "Preflight Failed: Origin not allowed.")
          setStatus("blocked")
          return
       }
       addLog("res", "Preflight Success: 204 No Content")
    }

    setStatus("fetching")
    await new Promise(r => setTimeout(r, 1200))

    // Final Request Validation
    const isOriginMatch = allowOrigin === "*" || allowOrigin === originA
    const credentialConflict = sendCredentials && allowOrigin === "*"
    const credentialMatch = !sendCredentials || (sendCredentials && allowCredentials)

    if (credentialConflict) {
       addLog("err", "CORS Error: Cannot use Wildcard (*) when credentials are true.")
       setStatus("blocked")
    } else if (!isOriginMatch) {
       addLog("err", `CORS Error: Origin ${originA} not in Allow-List.`)
       setStatus("blocked")
    } else if (!credentialMatch) {
       addLog("err", "CORS Error: Access-Control-Allow-Credentials: false.")
       setStatus("blocked")
    } else {
       addLog("res", "200 OK - Access Granted.", {
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials.toString()
       })
       setStatus("success")
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-emerald-500/30">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className={cn(
             "px-4 py-1 rounded-full border text-xs font-bold flex items-center gap-2 transition-all duration-500",
             status === "idle" ? "bg-white/5 border-white/10 text-gray-500" :
             status === "success" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" :
             status === "blocked" ? "bg-red-500/20 border-red-500/50 text-red-500" : "bg-blue-500/20 border-blue-500/50 text-blue-400"
           )}>
            {status === "idle" && <Shield className="w-3 h-3" />}
            {status === "success" && <ShieldCheck className="w-3 h-3 animate-bounce" />}
            {status === "blocked" && <ShieldAlert className="w-3 h-3 animate-pulse" />}
            {(status === "preflight" || status === "fetching") && <Share2 className="w-3 h-3 animate-spin" />}
            {status.toUpperCase()}
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Origin: Client App */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8 relative overflow-hidden">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tighter">CLIENT</h3>
                  <code className="text-[10px] text-blue-500/70 font-mono italic">{originA}</code>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Method</label>
                   <div className="grid grid-cols-2 gap-2">
                     {["GET", "POST", "PUT", "DELETE"].map(m => (
                       <button key={m} onClick={() => setMethod(m)} className={cn(
                          "py-2 rounded-xl text-[10px] font-bold border transition-all",
                          method === m ? "bg-blue-600 border-blue-400 text-white" : "bg-white/5 border-white/5 text-gray-600 hover:border-white/20"
                       )}>{m}</button>
                     ))}
                   </div>
                 </div>

                 <div className="space-y-3 pt-4 border-t border-white/5">
                    <Toggle label="Include Cookies" sub="withCredentials: true" active={sendCredentials} onClick={() => setSendCredentials(!sendCredentials)} icon={<Cookie className="w-3 h-3" />} />
                    <Toggle label="Custom Header" sub="X-Technical-Lab" active={hasCustomHeader} onClick={() => setHasCustomHeader(!hasCustomHeader)} icon={<Fingerprint className="w-3 h-3" />} />
                 </div>
                 
                 <button 
                   onClick={handleFetch} disabled={status === "preflight" || status === "fetching"}
                   className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all active:scale-95 shadow-xl shadow-emerald-500/20 mt-4"
                 >
                   <Send className="w-4 h-4 mr-2 inline-block transition-transform group-active:translate-x-1" />
                   Execute Request
                 </button>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4 h-[330px] flex flex-col">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 flex items-center gap-2">
                 <Server className="w-3 h-3" /> Network Trace
              </h3>
              <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[9px] custom-scrollbar pr-2">
                 {logs.map((l, i) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className={cn(
                       "p-2 rounded-lg border-l-2",
                       l.type === "req" ? "bg-blue-500/5 border-blue-500/40 text-blue-300" :
                       l.type === "opt" ? "bg-amber-500/5 border-amber-500/40 text-amber-300" :
                       l.type === "res" ? "bg-emerald-500/5 border-emerald-500/40 text-emerald-300" :
                       l.type === "err" ? "bg-red-500/10 border-red-500/40 text-red-400" : "bg-white/5 border-white/5 text-gray-600"
                    )}>
                       <div className="font-bold flex justify-between items-center mb-1">
                          <span>{l.msg}</span>
                          <span className="opacity-30">[{l.type.toUpperCase()}]</span>
                       </div>
                       {l.headers && (
                          <pre className="text-[8px] opacity-60 bg-black/20 p-2 rounded mt-1 border border-white/5">
                             {JSON.stringify(l.headers, null, 2)}
                          </pre>
                       )}
                    </motion.div>
                 ))}
                 {logs.length === 0 && <p className="text-center italic opacity-20 mt-32 leading-relaxed">No active traffic monitored...</p>}
              </div>
           </div>
        </section>

        {/* Traffic Center Visualization */}
        <section className="lg:col-span-2 flex flex-col gap-6 items-center justify-center relative min-h-[300px] sm:min-h-[500px] border-y lg:border-none border-white/5 py-12 lg:py-0">
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
              <div className="w-0.5 h-full bg-gradient-to-b from-transparent via-white to-transparent" />
           </div>

           <div className="z-10 flex flex-col items-center gap-8">
              <AnimatePresence mode="wait">
                 {status === "preflight" ? (
                    <motion.div key="pre" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="flex flex-col items-center gap-4">
                       <div className="w-24 h-24 rounded-full border-4 border-amber-500/20 flex items-center justify-center relative">
                          <Share2 className="w-10 h-10 text-amber-500 animate-spin" />
                          <div className="absolute -inset-4 border-2 border-amber-500/50 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                       </div>
                       <p className="text-xs font-bold text-amber-500 uppercase tracking-widest animate-pulse">Preflight: OPTIONS check</p>
                    </motion.div>
                 ) : (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn(
                      "w-32 h-32 rounded-full border-2 flex items-center justify-center relative transition-all duration-700",
                      status === "success" ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]" :
                      status === "blocked" ? "bg-red-500/10 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]" : "bg-white/5 border-white/10"
                    )}>
                       {status === "blocked" ? <Lock className="w-12 h-12 text-red-500" /> : <Shield className={cn("w-12 h-12 transition-colors", status === "success" ? "text-emerald-500" : "text-gray-800")} />}
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
           
           <div className="mt-8 text-center space-y-4">
              <h3 className="text-xs sm:text-sm font-black italic tracking-widest text-gray-500 uppercase">CORS Boundary Bridge</h3>
              <p className="text-[10px] text-gray-700 max-w-xs leading-relaxed uppercase font-bold tracking-tighter">
                 The browser security policy prevents cross-origin reads unless specifically permitted by the server's Access-Control response headers.
              </p>
           </div>
        </section>

        {/* Right Origin: API Server */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-emerald-500/10 space-y-8 relative overflow-hidden">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tighter">SERVER</h3>
                  <code className="text-[10px] text-emerald-500/70 font-mono italic">{originB}</code>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Access-Control-Allow-Origin</label>
                    <select 
                       value={allowOrigin} onChange={(e) => setAllowOrigin(e.target.value)}
                       className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-emerald-500 outline-none transition-colors cursor-pointer text-emerald-400"
                    >
                       <option value="*">allow all wildcard (*)</option>
                       <option value={originA}>allow client.app</option>
                       <option value="https://malicious.evil">allow malicious.evil</option>
                       <option value="NONE">deny all</option>
                    </select>
                 </div>

                 <div className="space-y-3 pt-4 border-t border-white/5">
                    <Toggle label="Allow Credentials" sub="Allow-Credentials: true" active={allowCredentials} onClick={() => setAllowCredentials(!allowCredentials)} icon={<Cookie className="w-3 h-3" />} server />
                 </div>

                 <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4">
                    <Info className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-bold uppercase text-emerald-200">Security Rule</h4>
                       <p className="text-[9px] text-emerald-500/60 leading-relaxed italic">
                          Wait—if <span className="font-bold text-white">Include Cookies</span> is checked, the server CANNOT use a wildcard (*) for Allow-Origin. Try it to see the browser block the request for safety.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           <section className="glass p-8 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <ChevronRight className="w-4 h-4 text-emerald-500" />
                 <h4 className="text-[10px] font-bold uppercase text-gray-500">Why Preflight?</h4>
              </div>
              <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                 Simple requests (GET/POST with basic headers) are sent immediately. 
                 But <span className="font-bold text-emerald-400">Complex Requests</span> or those with custom headers could be destructive. 
                 The browser "pre-clears" them via OPTIONS to protect the server and your data.
              </p>
           </section>
        </section>
      </div>
    </main>
  )
}

function Toggle({ label, sub, active, onClick, icon, server }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
        active 
          ? server ? "bg-emerald-500/10 border-emerald-500/50" : "bg-blue-500/10 border-blue-500/50"
          : "bg-white/5 border-white/5 hover:border-white/10"
      )}
    >
       <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded-lg", active ? server ? "text-emerald-400" : "text-blue-400" : "text-gray-700")}>{icon}</div>
          <div className="text-left">
             <p className="text-[11px] font-bold">{label}</p>
             <p className="text-[9px] text-gray-500 font-mono italic">{sub}</p>
          </div>
       </div>
       <div className={cn("w-2 h-2 rounded-full", active ? server ? "bg-emerald-500" : "bg-blue-500" : "bg-gray-800")} />
    </button>
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
