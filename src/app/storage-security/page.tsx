"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Shield, ShieldCheck, ShieldAlert, Database, ShieldX, Terminal, Lock, Send, Ghost, Trash2, Layers, Cpu, Fingerprint, Info, AlertTriangle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type SameSite = "strict" | "lax" | "none"

export default function StorageSecurityPage() {
  const [inputValue, setInputValue] = useState("secret_session_token_123")
  const [localData, setLocalData] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<string | null>(null)
  const [cookieValue, setCookieValue] = useState<string | null>(null)
  const [isHttpOnly, setIsHttpOnly] = useState(true)
  const [sameSite, setSameSite] = useState<SameSite>("strict")
  const [isCspEnabled, setIsCspEnabled] = useState(false)
  const [logs, setLogs] = useState<{ msg: string; type: "info" | "success" | "warning" | "error" | "attack"; time: string }[]>([])

  const addLog = useCallback((msg: string, type: "info" | "success" | "warning" | "error" | "attack" = "info") => {
    const time = new Date().toLocaleTimeString().split(' ')[0]
    setLogs((prev) => [{ msg, type, time }, ...prev].slice(0, 10))
  }, [])

  const refreshState = useCallback(async () => {
    setLocalData(localStorage.getItem("token"))
    setSessionData(sessionStorage.getItem("token"))
    try {
      const res = await fetch("/api/storage-security/check-cookie")
      const data = await res.json()
      setCookieValue(data.hasCookie ? data.value : null)
    } catch {
      setCookieValue(null)
    }
  }, [])

  useEffect(() => { refreshState() }, [refreshState])

  const saveToLocal = () => {
    localStorage.setItem("token", inputValue)
    addLog(`LocalStorage updated. Read/Write allowed from JS.`, "success")
    refreshState()
  }

  const saveToSession = () => {
    sessionStorage.setItem("token", inputValue)
    addLog(`SessionStorage updated. Tab-scoped memory established.`, "success")
    refreshState()
  }

  const saveToCookie = async () => {
    addLog("Requesting server-side SET-COOKIE header...", "info")
    await fetch("/api/storage-security/set-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: inputValue, httpOnly: isHttpOnly, sameSite })
    })
    addLog(`Cookie attached via response header. HttpOnly=${isHttpOnly}, SameSite=${sameSite}`, "success")
    refreshState()
  }

  const clearAll = async () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    await fetch("/api/storage-security/check-cookie", { method: "POST" })
    addLog("Storage buffers cleared.", "info")
    refreshState()
  }

  const simulateXSS = () => {
    addLog("🚨 STARTING XSS ATTACK: Injecting <script>...", "attack")
    
    if (isCspEnabled) {
       addLog("🛑 CSP BLOCKED: Content-Security-Policy header prevented inline script execution.", "success")
       return
    }

    const stolenLocal = localStorage.getItem("token")
    const stolenSession = sessionStorage.getItem("token")
    const jsCookies = document.cookie // JS can only see cookies without HttpOnly flag

    if (stolenLocal) addLog(`❌ XSS SUCCESS: Stole Local: "${stolenLocal}"`, "error")
    if (stolenSession) addLog(`❌ XSS SUCCESS: Stole Session: "${stolenSession}"`, "error")
    
    if (jsCookies.includes("secure_auth_token")) {
       addLog(`❌ XSS SUCCESS: Stole Cookie: "${jsCookies.split('token=')[1]?.substring(0, 5)}..."`, "error")
    } else {
       addLog("✅ XSS PROTECTION: HttpOnly flag successfully hid the cookie from JavaScript.", "success")
    }
  }

  const simulateCSRF = async () => {
    addLog("🚨 STARTING CSRF ATTACK: Cross-Site Request Forgery...", "attack")
    
    // Simulate a Cross-Origin Request
    if (sameSite === "strict") {
       addLog("✅ CSRF BLOCKED: sameSite='Strict' prevented the browser from sending the cookie cross-origin.", "success")
       return
    }

    const res = await fetch("/api/storage-security/transfer", { method: "POST" })
    const data = await res.json()
    
    if (res.ok) {
       addLog(`❌ CSRF SUCCESS: ${data.message}. The browser sent your session cookie automatically!`, "error")
    } else {
       addLog(`✅ CSRF MITIGATED: No credential cookie was sent.`, "success")
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-rose-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
            <Lock className="w-3 h-3" />
            Security Lab: Storage
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Memory Config */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Vulnerability</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Storage Security Test</p>
              </header>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Sensitive Data</label>
                    <input 
                      type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-rose-500 outline-none transition-colors"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2">
                    <StorageBtn onClick={saveToLocal} label="Local" color="blue" />
                    <StorageBtn onClick={saveToSession} label="Session" color="amber" />
                 </div>
                 
                 <div className="pt-4 border-t border-white/5 space-y-3">
                    <ConfigToggle active={isHttpOnly} onClick={() => setIsHttpOnly(!isHttpOnly)} label="HttpOnly" sub="JS Invisible" />
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold uppercase text-gray-700">SameSite Policy</label>
                       <div className="grid grid-cols-3 gap-1">
                          {(["strict", "lax", "none"] as SameSite[]).map(s => (
                             <button key={s} onClick={() => setSameSite(s)} className={cn(
                               "py-1.5 rounded-lg text-[9px] font-bold border transition-all uppercase",
                               sameSite === s ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-white/5 border-white/5 text-gray-700"
                             )}>{s}</button>
                          ))}
                       </div>
                    </div>
                    <button onClick={saveToCookie} className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-emerald-500/20">SAVE SERVER COOKIE</button>
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-rose-500" />
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Security Events</h3>
              </div>
              <div className="space-y-2 font-mono text-[9px] h-44 overflow-y-auto custom-scrollbar pr-2">
                 {logs.map((l, i) => (
                    <div key={i} className={cn(
                      "p-2 rounded border-l-2 bg-white/5",
                      l.type === "attack" ? "border-red-500 text-red-400 bg-red-500/5" :
                      l.type === "success" ? "border-emerald-500 text-emerald-400" :
                      l.type === "error" ? "border-red-500 text-red-500 font-bold" : "border-gray-700 text-gray-600"
                    )}>
                       {l.msg}
                    </div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-12">Idle Monitor...</p>}
              </div>
           </div>
        </section>

        {/* Visualizer */}
        <section className="lg:col-span-2 space-y-6">
           <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 flex flex-col gap-6 relative overflow-hidden h-auto lg:h-[480px]">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Database className="w-64 h-64" />
              </div>

              <VizCard title="LocalStorage" icon={<Layers className="text-blue-400" />} value={localData} sub="Persistent across reloads" />
              <VizCard title="SessionStorage" icon={<Layers className="text-amber-400" />} value={sessionData} sub="Destroyed when tab closes" />
              <VizCard title="Response Cookie" icon={<Fingerprint className="text-emerald-400" />} value={cookieValue ? `•••••••• (JS: ${document.cookie.includes('secure_auth_token') ? 'Readable' : 'BLIND'})` : null} sub={`Flags: HttpOnly=${isHttpOnly}, SameSite=${sameSite}`} highlight />
              
              <div className="mt-8 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                 <Info className="w-5 h-5 text-blue-500 shrink-0" />
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-blue-300">Stateless Protection</p>
                    <p className="text-[9px] text-gray-500 leading-relaxed max-w-md">
                       While JS-accessible storage is convenient, it can be dumped by one XSS exploit. <span className="text-emerald-400 font-bold">HttpOnly</span> flips the script, making the token unreadable to even the most malicious scripts.
                    </p>
                 </div>
              </div>
           </div>
           
           <div className="glass p-8 rounded-[40px] border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    <div>
                       <h4 className="text-sm font-bold tracking-tight">Active Defenses</h4>
                       <p className="text-[10px] text-gray-600 uppercase font-black">Mitigation Strategy</p>
                    </div>
                 </div>
                 <button onClick={() => setIsCspEnabled(!isCspEnabled)} className={cn(
                    "px-4 py-2 rounded-xl border text-[10px] font-black tracking-widest transition-all",
                    isCspEnabled ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-white/5 border-white/5 text-gray-700"
                 )}>
                    {isCspEnabled ? "CSP ENABLED" : "ENABLE CSP"}
                 </button>
              </div>
           </div>
        </section>

        {/* Attack Simulator */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-red-500/10 space-y-8 relative overflow-hidden h-full">
              <div className="absolute top-0 inset-x-0 h-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)] animate-pulse" />
              
              <header className="flex items-center gap-3">
                 <Ghost className="w-8 h-8 text-red-500" />
                 <div>
                    <h3 className="text-xl font-bold tracking-tighter text-red-500 uppercase italic">Threat Zone</h3>
                    <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">Offensive Simulation</p>
                 </div>
              </header>

              <div className="space-y-12">
                 <div className="space-y-4">
                    <AttackBtn onClick={simulateXSS} icon={<Cpu />} label="Cross-Site Scripting" sub="Steal from document.cookie" color="red" />
                    <p className="text-[9px] text-gray-700 font-light italic leading-relaxed text-center px-4">
                       XSS mimics a script that was illegally injected into your page. It checks every JS-visible buffer.
                    </p>
                 </div>

                 <div className="space-y-4">
                    <AttackBtn onClick={simulateCSRF} icon={<Layers />} label="CSRF Attack" sub="Cross-Origin Request" color="rose" />
                    <p className="text-[9px] text-gray-700 font-light italic leading-relaxed text-center px-4">
                       CSRF tricks your browser into sending cookies to a foreign endpoint. Prevented by <span className="font-bold text-emerald-600">SameSite</span> policies.
                    </p>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                 <button onClick={() => setLogs([])} className="w-full p-2 text-[9px] font-bold text-gray-800 uppercase tracking-widest hover:text-white transition-colors">Flush Threat Logs</button>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function StorageBtn({ onClick, label, color }: any) {
  return (
    <button onClick={onClick} className={cn(
      "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
      color === "blue" ? "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20" : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
    )}>SAVE {label}</button>
  )
}

function ConfigToggle({ active, onClick, label, sub }: any) {
  return (
    <button onClick={onClick} className={cn(
      "w-full p-3 rounded-2xl border flex items-center justify-between transition-all",
      active ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/5"
    )}>
       <div className="text-left">
          <p className="text-[10px] font-bold leading-none">{label}</p>
          <p className="text-[8px] text-gray-600 font-mono italic">{sub}</p>
       </div>
       <div className={cn("w-2 h-2 rounded-full", active ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-gray-800")} />
    </button>
  )
}

function VizCard({ title, icon, value, sub, highlight }: any) {
  return (
    <div className={cn(
      "p-6 rounded-[28px] border flex justify-between items-center transition-all",
      value ? highlight ? "bg-emerald-500/5 border-emerald-500/20 shadow-xl" : "bg-white/5 border-white/10" : "bg-white/5 border-white/5 opacity-30"
    )}>
       <div className="flex gap-4 items-center">
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5">{icon}</div>
          <div>
             <h4 className="text-[11px] font-bold tracking-tight text-white/90">{title}</h4>
             <p className="text-[9px] text-gray-600 font-mono italic uppercase">{sub}</p>
          </div>
       </div>
       <div className="font-mono text-[11px] text-indigo-400 max-w-[180px] truncate">
          {value ? `"${value}"` : "NULL"}
       </div>
    </div>
  )
}

function AttackBtn({ onClick, icon, label, sub, color }: any) {
  return (
    <button onClick={onClick} className={cn(
       "w-full p-4 rounded-2xl border flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group",
       color === "red" ? "bg-red-500 border-red-400 shadow-lg shadow-red-500/20" : "bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold"
    )}>
       <div className={cn("p-2 rounded-lg bg-black/20 group-hover:rotate-12 transition-transform", color === "red" ? "text-white" : "text-rose-400")}>
          {icon}
       </div>
       <div className="text-left">
          <p className="text-[11px] font-black uppercase tracking-tight">{label}</p>
          <p className={cn("text-[9px] font-bold italic", color === "red" ? "text-white/50" : "text-rose-600")}>{sub}</p>
       </div>
    </button>
  )
}
