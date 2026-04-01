"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Key, RefreshCcw, ShieldCheck, Terminal, Clock, Activity, Lock, Unlock, AlertCircle, Edit3, Fingerprint, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type TokenPart = "header" | "payload" | "signature"

function decodeJwt(token: string) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function JWTPage() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [logs, setLogs] = useState<{ msg: string; type: "info" | "success" | "warning" | "error"; time: string }[]>([]);
  const [now, setNow] = useState(Date.now());
  const [tampering, setTampering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const addLog = useCallback((msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    const time = new Date().toLocaleTimeString().split(' ')[0];
    setLogs((prev) => [{ msg, type, time }, ...prev].slice(0, 8));
  }, []);

  const login = async () => {
    addLog("Initiating Login...", "info");
    const res = await fetch("/api/jwt/login");
    const data = await res.json();
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    addLog("✅ Login Success!", "success");
    setTampering(false);
  };

  const callProtected = async () => {
    addLog("Sending Token to Protected API...", "info");
    let res = await fetch("/api/jwt/protected", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.status === 401) {
      if (tampering) {
         addLog("🚫 ACCESS DENIED! Invalid Signature detected.", "error");
         return;
      }
      addLog("⚠️ Token Expired. Attempting auto-refresh...", "warning");
      const refreshRes = await fetch("/api/jwt/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        addLog("❌ Session Expired. Please Login again.", "error");
        setAccessToken("");
        return;
      }

      const data = await refreshRes.json();
      setAccessToken(data.accessToken);
      addLog("🔄 Refresh Success! Retrying...", "success");
      res = await fetch("/api/jwt/protected", {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
    }

    const data = await res.json();
    if (res.ok) {
       addLog(`🎉 SUCCESS: ${data.message}`, "success");
    } else {
       addLog(`❌ FAILED: ${data.error || "Unknown Error"}`, "error");
    }
  };

  const tamperToken = () => {
     if (!accessToken) return;
     const parts = accessToken.split(".");
     const payload = JSON.parse(atob(parts[1]));
     // Malicious edit
     payload.role = "admin";
     payload.tampered = true;
     const newPayload = btoa(JSON.stringify(payload)).replace(/=/g, "");
     const tamperedToken = `${parts[0]}.${newPayload}.${parts[2]}`;
     setAccessToken(tamperedToken);
     setTampering(true);
     addLog("🕵️ PAYLOAD TAMPERED! Role changed to 'admin'.", "warning");
     addLog("⚠️ Note: The signature still belongs to the OLD payload.", "info");
  };

  const decodedAccess = decodeJwt(accessToken);
  const decodedRefresh = decodeJwt(refreshToken);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-indigo-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className={cn(
             "px-4 py-1 rounded-full border text-xs font-bold flex items-center gap-2 transition-all duration-500",
             tampering ? "bg-red-500/10 border-red-500 text-red-500" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
           )}>
            {tampering ? <ShieldAlert className="w-3 h-3 animate-pulse" /> : <ShieldCheck className="w-3 h-3" />}
            SYSTEM STATUS: {tampering ? "SECURITY BREACH DETECTED" : "ENCRYPTED"}
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Actions */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-6">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Lifecycle</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">JWT Token Security</p>
              </header>

              <div className="space-y-3">
                 <ActionBtn onClick={login} icon={<Unlock />} label="1. Authenticate" sub="Mint Refresh + Access" color="indigo" />
                 <ActionBtn onClick={callProtected} icon={<Lock />} label="2. Request Data" sub="Verify Access Token" color="blue" />
                 <div className="pt-4 border-t border-white/5">
                    <button 
                      onClick={tamperToken} disabled={!accessToken || tampering}
                      className="w-full py-4 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-600/20 transition-all flex items-center justify-center gap-2"
                    >
                       <Edit3 className="w-4 h-4" />
                       Tamper with Payload
                    </button>
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-indigo-500" />
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Security Logs</h3>
              </div>
              <div className="space-y-2 font-mono text-[9px] h-56 overflow-y-auto custom-scrollbar pr-2">
                 {logs.map((l, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={cn(
                       "p-2 rounded border-l-2 bg-white/5",
                       l.type === "success" ? "border-emerald-500 text-emerald-400" :
                       l.type === "error" ? "border-red-500 text-red-400" :
                       l.type === "warning" ? "border-amber-500 text-amber-300" : "border-indigo-500 text-gray-500"
                    )}>
                       <span className="opacity-30 mr-1">[{l.time}]</span> {l.msg}
                    </motion.div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-20 text-center mt-12">Awaiting Auth...</p>}
              </div>
           </div>
        </section>

        {/* Token Breakdown Visualizer */}
        <section className="lg:col-span-3">
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 space-y-8 sm:space-y-10 relative overflow-hidden flex flex-col min-h-[500px] sm:min-h-[600px]">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Fingerprint className="w-64 h-64" />
              </div>

              {!accessToken ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                    <Activity className="w-16 h-16 animate-pulse" />
                    <p className="text-sm font-bold uppercase tracking-[0.3em]">No Active Session</p>
                 </div>
              ) : (
                 <div className="space-y-12">
                    {/* The 3-Part Token Bar */}
                    <div className="space-y-3">
                       <div className="flex justify-between items-end">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Stateless Token Structure</label>
                          <span className="text-[9px] font-mono text-indigo-400 italic">HMAC-SHA256 Encoded</span>
                       </div>
                       <div className="flex w-full h-2 rounded-full overflow-hidden border border-white/5">
                          <div className="w-[20%] bg-rose-500" />
                          <div className="w-1 bg-black/40" />
                          <div className="w-[50%] bg-purple-500" />
                          <div className="w-1 bg-black/40" />
                          <div className="w-[30%] bg-blue-500" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <PartBox color="text-rose-400" label="Header" desc="Alg & Token Type" content={accessToken.split(".")[0]} />
                       <PartBox color="text-purple-400" label="Payload" desc="Claims & Data" content={accessToken.split(".")[1]} highlight={tampering} />
                       <PartBox color="text-blue-400" label="Signature" desc="Cryptographic Proof" content={accessToken.split(".")[2]} />
                    </div>

                    {/* Detailed Inspector */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                       <div className="space-y-4">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-purple-500" />
                             <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Payload Inspector</h4>
                          </div>
                          <div className="bg-black/40 rounded-[24px] border border-white/5 p-6 font-mono text-xs leading-relaxed">
                             <pre className="text-indigo-300">
                                {JSON.stringify(decodeJwt(accessToken), null, 2)}
                             </pre>
                             {tampering && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] flex items-center gap-2">
                                   <AlertCircle className="w-3 h-3" />
                                   MANUAL EDIT: Claims no longer match signature!
                                </motion.div>
                             )}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-blue-500" />
                             <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Verification Logic</h4>
                          </div>
                          <div className="bg-blue-500/5 rounded-[24px] border border-blue-500/10 p-6 space-y-4">
                             <div className="space-y-2">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">The "Proof" Formula</p>
                                <div className="bg-[#0a0a0a] p-3 rounded-xl border border-white/5 font-mono text-[9px] text-gray-400 break-all leading-relaxed">
                                   HMACSHA256(<br/>
                                   &nbsp;&nbsp;base64(header) + "." + <br/>
                                   &nbsp;&nbsp;base64(payload), <br/>
                                   &nbsp;&nbsp;<span className="text-blue-400">SECRET_KEY</span><br/>
                                   )
                                </div>
                             </div>
                             <p className="text-[11px] text-gray-500 leading-relaxed font-light italic">
                                If the user changes even one character in the <span className="text-purple-400">Payload</span>, the result of this formula will not match the <span className="text-blue-400">Signature</span> provided in the token.
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </section>
      </div>
    </main>
  )
}

function ActionBtn({ onClick, icon, label, sub, color }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-left group">
       <div className={cn(
         "p-3 rounded-xl border border-white/5 transition-transform group-hover:scale-110 shadow-lg",
         color === "indigo" ? "text-indigo-400 bg-indigo-500/10" : "text-blue-400 bg-blue-500/10"
       )}>{icon}</div>
       <div>
         <p className="text-[11px] font-bold">{label}</p>
         <p className="text-[9px] text-gray-500 font-mono italic">{sub}</p>
       </div>
    </button>
  )
}

function PartBox({ color, label, desc, content, highlight }: any) {
  return (
    <div className={cn(
      "space-y-3 p-6 rounded-[24px] border transition-all duration-700",
      highlight ? "border-red-500/50 bg-red-500/5" : "border-white/5 bg-white/5"
    )}>
       <div className="flex justify-between items-center">
          <h4 className={cn("text-[10px] font-bold uppercase tracking-widest", color)}>{label}</h4>
          {highlight && <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
       </div>
       <div className="bg-black/20 p-3 rounded-xl border border-white/5 font-mono text-[9px] break-all h-20 overflow-y-auto leading-relaxed text-gray-600 custom-scrollbar">
          {content}
       </div>
       <p className="text-[9px] text-gray-700 font-light italic">{desc}</p>
    </div>
  )
}
