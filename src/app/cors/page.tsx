"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Shield, ShieldAlert, ShieldCheck, Globe, Server, Send, Info, ChevronRight, Share2, Lock, Cookie, Fingerprint } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "🔐 CORS Lab" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

type RequestStatus = "idle" | "preflight" | "fetching" | "success" | "blocked"

export default function CORSPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-emerald-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-3 h-3" /> CORS · Security
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-emerald-400 bg-clip-text text-transparent">CORS</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">Cross-Origin Resource Sharing — why the browser enforces it, what triggers preflight, how credentials interact with wildcards, and how to configure it correctly without destroying security.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "simulator" && <SimulatorTab />}
            {tab === "deepdive" && <DeepDiveTab />}
            {tab === "pitfalls" && <PitfallsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

function ConceptsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Shield className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">The Same-Origin Policy</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Browsers enforce the <strong className="text-white">Same-Origin Policy (SOP)</strong> — a security model that prevents JavaScript on <code className="text-emerald-400 text-xs">https://evil.com</code> from reading responses from <code className="text-emerald-400 text-xs">https://yourbank.com</code>.
          </p>
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
            <p className="text-[10px] font-black text-emerald-400 uppercase">Origin = Protocol + Host + Port</p>
            <div className="space-y-1.5 font-mono text-[10px]">
              {[
                { a: "https://app.com/page", b: "https://app.com/api", same: true, why: "same protocol, host, port" },
                { a: "https://app.com", b: "http://app.com", same: false, why: "different protocol" },
                { a: "https://app.com", b: "https://api.app.com", same: false, why: "different subdomain" },
                { a: "https://app.com", b: "https://app.com:3000", same: false, why: "different port" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={cn("w-4 h-4 rounded text-[8px] flex items-center justify-center font-black shrink-0", r.same ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>{r.same ? "✓" : "✗"}</span>
                  <code className="text-gray-500 flex-1">{r.a} → {r.b}</code>
                  <span className="text-gray-700 text-[9px]">{r.why}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            <strong className="text-white">CORS is opt-in relaxation</strong>, not a new restriction. The browser blocks cross-origin reads by default. CORS headers from the server tell the browser &quot;it&apos;s OK to expose this response to that origin.&quot;
          </p>
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
            <p className="text-[10px] font-black text-amber-400 mb-1">Critical Misconception</p>
            <p className="text-[11px] text-gray-500">CORS is enforced by the <strong className="text-white">browser only</strong>. curl, Postman, and server-to-server requests are never blocked by CORS — only browser JavaScript is. CORS is not a security barrier against attackers.</p>
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Simple vs Preflighted Requests</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <p className="text-[10px] font-black text-emerald-400">Simple Request — No Preflight</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Method is GET, HEAD, or POST. No custom headers. Content-Type is application/x-www-form-urlencoded, multipart/form-data, or text/plain. Browser sends request directly and checks CORS headers on response.</p>
              <div className="bg-black/40 rounded-xl p-3 font-mono text-[9px] space-y-1 text-gray-500">
                <p>→ GET /api/data HTTP/1.1</p>
                <p className="text-blue-400">→ Origin: https://client.app</p>
                <p className="text-gray-700">— browser sends, waits for response —</p>
                <p className="text-emerald-400">← Access-Control-Allow-Origin: https://client.app</p>
                <p className="text-gray-500">← 200 OK {"{ data: ... }"}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <p className="text-[10px] font-black text-amber-400">Complex Request — Requires Preflight</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Method is PUT, DELETE, PATCH. Custom headers like Authorization or Content-Type: application/json. Browser sends an OPTIONS preflight first to ask permission.</p>
              <div className="bg-black/40 rounded-xl p-3 font-mono text-[9px] space-y-1 text-gray-500">
                <p className="text-amber-400">→ OPTIONS /api/data HTTP/1.1</p>
                <p className="text-amber-400">→ Access-Control-Request-Method: DELETE</p>
                <p className="text-amber-400">→ Access-Control-Request-Headers: Authorization</p>
                <p className="text-gray-700">— server responds with permissions —</p>
                <p className="text-emerald-400">← Access-Control-Allow-Methods: DELETE</p>
                <p className="text-emerald-400">← Access-Control-Max-Age: 86400</p>
                <p className="text-gray-700">— now browser sends actual request —</p>
                <p>→ DELETE /api/data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [method, setMethod] = useState("GET")
  const [allowOrigin, setAllowOrigin] = useState("*")
  const [allowCredentials, setAllowCredentials] = useState(false)
  const [sendCredentials, setSendCredentials] = useState(false)
  const [hasCustomHeader, setHasCustomHeader] = useState(false)
  const [status, setStatus] = useState<RequestStatus>("idle")
  const [logs, setLogs] = useState<{ type: "req" | "res" | "err" | "info" | "opt"; msg: string; headers?: Record<string, string> }[]>([])
  const originA = "https://client.app"

  const addLog = (type: any, msg: string, headers?: any) => setLogs(p => [{ type, msg, headers }, ...p].slice(0, 10))

  const handleFetch = async () => {
    setStatus("preflight"); setLogs([])
    const needsPreflight = method !== "GET" || hasCustomHeader
    if (needsPreflight) {
      addLog("info", "Browser: complex request detected → sending OPTIONS preflight first")
      addLog("opt", `OPTIONS /api/data (Origin: ${originA})`, { "Access-Control-Request-Method": method, "Access-Control-Request-Headers": hasCustomHeader ? "authorization" : "none" })
      await new Promise(r => setTimeout(r, 1500))
      const preflightMatch = allowOrigin === "*" || allowOrigin === originA
      if (!preflightMatch) { addLog("err", "Preflight blocked: Origin not in allow-list → browser aborts"); setStatus("blocked"); return }
      addLog("res", "Preflight OK: 204 No Content", { "Access-Control-Allow-Methods": method, "Access-Control-Max-Age": "86400" })
    }
    setStatus("fetching")
    await new Promise(r => setTimeout(r, 1200))
    const isOriginMatch = allowOrigin === "*" || allowOrigin === originA
    const credentialConflict = sendCredentials && allowOrigin === "*"
    const credentialMatch = !sendCredentials || (sendCredentials && allowCredentials)
    if (credentialConflict) { addLog("err", 'CORS Error: Cannot use wildcard (*) when credentials: true — RFC requires explicit origin'); setStatus("blocked") }
    else if (!isOriginMatch) { addLog("err", `CORS Error: Origin "${originA}" not in Allow-Origin → response blocked`); setStatus("blocked") }
    else if (!credentialMatch) { addLog("err", "CORS Error: Allow-Credentials not set → cookies/auth headers stripped"); setStatus("blocked") }
    else { addLog("res", "200 OK — response accessible to JavaScript", { "Access-Control-Allow-Origin": allowOrigin, "Access-Control-Allow-Credentials": allowCredentials.toString() }); setStatus("success") }
  }

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-[24px] border-white/5 flex gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Configure the client request and server CORS headers. Experiment with credentials, wildcards, and complex methods to see exactly what the browser allows and why.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400"><Globe className="w-4 h-4" /></div>
            <div><p className="font-black">CLIENT</p><code className="text-[9px] text-blue-400/70">https://client.app</code></div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[9px] font-black uppercase text-gray-600 mb-2">HTTP Method</p>
              <div className="grid grid-cols-2 gap-2">
                {["GET", "POST", "DELETE", "PUT"].map(m => (<button key={m} onClick={() => setMethod(m)} className={cn("py-2 rounded-xl text-[10px] font-black border transition-all", method === m ? "bg-blue-600 border-blue-400 text-white" : "bg-white/3 border-white/5 text-gray-600 hover:text-white")}>{m}</button>))}
              </div>
            </div>
            <div className="space-y-2 pt-3 border-t border-white/5">
              {[
                { label: "Send Cookies", sub: "withCredentials: true", active: sendCredentials, toggle: () => setSendCredentials(!sendCredentials), icon: <Cookie className="w-3 h-3" /> },
                { label: "Custom Header", sub: "Authorization: Bearer ...", active: hasCustomHeader, toggle: () => setHasCustomHeader(!hasCustomHeader), icon: <Fingerprint className="w-3 h-3" /> },
              ].map(t => (
                <button key={t.label} onClick={t.toggle} className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left", t.active ? "bg-blue-500/10 border-blue-500/30" : "bg-white/3 border-white/5")}>
                  <span className={cn("p-1.5 rounded-lg", t.active ? "text-blue-400" : "text-gray-700")}>{t.icon}</span>
                  <div><p className="text-[10px] font-black">{t.label}</p><p className="text-[9px] text-gray-600 font-mono">{t.sub}</p></div>
                  <div className={cn("w-2 h-2 rounded-full ml-auto", t.active ? "bg-blue-400" : "bg-gray-800")} />
                </button>
              ))}
            </div>
            <button onClick={handleFetch} disabled={status === "preflight" || status === "fetching"} className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs transition-all active:scale-95">
              <Send className="w-3 h-3 inline-block mr-2" />Execute Request
            </button>
          </div>
        </div>

        <div className="glass p-6 rounded-[32px] border-white/5 space-y-4 flex flex-col">
          <p className="text-[9px] uppercase font-black text-gray-600 text-center">REQUEST FLOW</p>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <AnimatePresence mode="wait">
              {status === "preflight" ? (
                <motion.div key="pre" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-500/40 flex items-center justify-center relative">
                    <Share2 className="w-7 h-7 text-amber-500 animate-spin" />
                    <div className="absolute -inset-3 border border-amber-500/20 rounded-full border-dashed animate-[spin_6s_linear_infinite]" />
                  </div>
                  <p className="text-xs font-black text-amber-400 animate-pulse">OPTIONS Preflight...</p>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn("w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                  status === "success" ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]" :
                  status === "blocked" ? "bg-red-500/10 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]" :
                  status === "fetching" ? "bg-blue-500/10 border-blue-500" : "bg-white/5 border-white/10"
                )}>
                  {status === "blocked" ? <Lock className="w-10 h-10 text-red-500" /> : <Shield className={cn("w-10 h-10 transition-colors", status === "success" ? "text-emerald-500" : status === "fetching" ? "text-blue-400 animate-pulse" : "text-gray-800")} />}
                </motion.div>
              )}
            </AnimatePresence>
            <div className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase border transition-all",
              status === "success" ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" :
              status === "blocked" ? "bg-red-500/10 border-red-500/40 text-red-400" :
              status === "fetching" ? "bg-blue-500/10 border-blue-500/40 text-blue-400" : "bg-white/5 border-white/10 text-gray-600"
            )}>{status.toUpperCase()}</div>
          </div>
          <div className="h-40 overflow-y-auto space-y-1.5">
            {logs.map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={cn("p-2 rounded-lg text-[9px] font-mono border-l-2 leading-relaxed",
                l.type === "opt" ? "border-amber-500/50 bg-amber-500/5 text-amber-300" :
                l.type === "res" ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-300" :
                l.type === "err" ? "border-red-500/50 bg-red-500/5 text-red-400" : "border-white/10 bg-white/3 text-gray-500"
              )}>
                <p className="font-bold">{l.msg}</p>
                {l.headers && <pre className="text-[8px] opacity-60 mt-1">{JSON.stringify(l.headers, null, 2)}</pre>}
              </motion.div>
            ))}
            {!logs.length && <p className="text-center text-gray-800 italic text-[9px] mt-12">No traffic yet</p>}
          </div>
        </div>

        <div className="glass p-6 rounded-[32px] border-emerald-500/10 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><Server className="w-4 h-4" /></div>
            <div><p className="font-black">SERVER</p><code className="text-[9px] text-emerald-400/70">https://api.service.io</code></div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[9px] font-black uppercase text-gray-600 mb-2">Access-Control-Allow-Origin</p>
              <select value={allowOrigin} onChange={e => setAllowOrigin(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-emerald-400 focus:border-emerald-500 outline-none">
                <option value="*">Wildcard (*)</option>
                <option value="https://client.app">https://client.app (specific)</option>
                <option value="https://malicious.evil">https://malicious.evil (wrong)</option>
                <option value="NONE">No header (deny)</option>
              </select>
            </div>
            <button onClick={() => setAllowCredentials(!allowCredentials)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left", allowCredentials ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/3 border-white/5")}>
              <Cookie className={cn("w-3.5 h-3.5", allowCredentials ? "text-emerald-400" : "text-gray-700")} />
              <div className="flex-1"><p className="text-[10px] font-black">Allow-Credentials: true</p><p className="text-[9px] text-gray-600">Allow cookies + auth headers</p></div>
              <div className={cn("w-2 h-2 rounded-full", allowCredentials ? "bg-emerald-400" : "bg-gray-800")} />
            </button>
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-[9px] font-black text-amber-400 mb-1">⚠ Key Rule</p>
              <p className="text-[10px] text-gray-500">If cookies are sent (<code>withCredentials: true</code>), the server <strong className="text-white">cannot</strong> use wildcard (*) — it must echo the specific origin. Try it!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeepDiveTab() {
  const [active, setActive] = useState("headers")
  const topics = [
    { id: "headers", name: "All CORS Headers Explained", color: "emerald",
      desc: "CORS uses a family of HTTP response headers to selectively relax the Same-Origin Policy. Each header has a specific role and security implication.",
      code: `// SERVER RESPONSE HEADERS:

Access-Control-Allow-Origin: https://client.app
// Which origin can read the response
// "*" = any origin (but breaks with credentials)
// Specific origin = most secure, required for credentialed requests

Access-Control-Allow-Methods: GET, POST, DELETE
// Allowed HTTP methods for cross-origin requests
// Returned in preflight response, applies for max-age duration

Access-Control-Allow-Headers: Authorization, Content-Type, X-Custom
// Allowed request headers
// Must list every non-simple header the client sends
// "*" wildcard allowed since 2020 (but not universally supported)

Access-Control-Max-Age: 86400
// How long (seconds) the browser can cache preflight result
// = 24 hours here → no preflight needed for 24h for this endpoint
// Default if omitted: 5 seconds (Chrome) — lots of preflights!

Access-Control-Allow-Credentials: true
// Allow cookies, HTTP auth, TLS client certs
// Requires: Access-Control-Allow-Origin = specific origin (not *)
// Client must also set: fetch(url, { credentials: 'include' })

Access-Control-Expose-Headers: X-RateLimit-Remaining, X-Request-Id
// Headers the browser will expose to JavaScript
// By default only "simple" headers exposed (Content-Type, etc.)
// Custom headers MUST be listed here to be readable via JS`,
      insight: "Access-Control-Max-Age is the most overlooked performance optimization. Each preflight is an extra HTTP round-trip. Setting it to 86400 (24h) dramatically reduces preflight overhead for frequently-called APIs.",
    },
    { id: "bypass", name: "CORS Bypass Patterns", color: "red",
      desc: "CORS stops malicious browser JavaScript from reading another origin's data, but it doesn't protect against all attack vectors. Understanding what CORS does and doesn't protect is critical.",
      code: `// ❌ MISCONCEPTION 1: CORS protects against all cross-origin attacks
// CORS does NOT protect against CSRF (Cross-Site Request Forgery)
// A <form> submit is a simple request — no CORS check on write!
// POST to https://bank.com/transfer from evil.com:
// Browser sends the request (with cookies!), bank processes it
// CORS only stops JavaScript from READING the response
// Defense: CSRF tokens, SameSite=Strict cookies, double-submit

// ❌ MISCONCEPTION 2: "Allow all origins" is fine for public APIs
Access-Control-Allow-Origin: *  // seems harmless for public data
Access-Control-Allow-Credentials: true  // ← NEVER combine these!
// This exposes authenticated user data to any site

// ❌ MISCONCEPTION 3: CORS stops server-to-server attacks
// curl bypasses CORS entirely — CORS is browser-only
// Attacker writes a server-side script → no CORS enforcement
// Defense: authentication, rate limiting, IP allowlisting

// ✅ Correct public API with auth:
Access-Control-Allow-Origin: *           // public read OK
// Access-Control-Allow-Credentials NOT set  // no cookie access
// Auth via Bearer token in Authorization header (not cookies)`,
      insight: "CORS prevents cross-origin reads by browser JavaScript — that's all it does. For write protection (mutation attacks), use CSRF tokens or SameSite cookies. For API access control, use authentication.",
    },
  ]
  const p = topics.find(t => t.id === active)!
  const c = p.color === "emerald" ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/20" : "text-red-400 bg-red-500/5 border-red-500/20"
  return (
    <div className="space-y-6">
      <div className="flex gap-2">{topics.map(t => (<button key={t.id} onClick={() => setActive(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold border transition-all", active === t.id ? c : "bg-white/5 border-white/10 text-gray-500 hover:text-white")}>{t.name}</button>))}</div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass p-6 rounded-[32px] border-white/5 space-y-4">
            <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
            <pre className={cn("p-5 rounded-2xl border text-xs font-mono leading-6 whitespace-pre-wrap overflow-auto", c)}>{p.code}</pre>
          </div>
          <div className={cn("glass p-6 rounded-[24px] border space-y-3", c)}>
            <p className={cn("text-[10px] font-black uppercase tracking-widest", c.split(" ")[0])}>Key Insight</p>
            <p className="text-sm text-gray-400 leading-relaxed">{p.insight}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("wildcard")
  const pitfalls = [
    { id: "wildcard", severity: "CRITICAL", title: "Echoing Request Origin Blindly",
      summary: "Some backends read the Origin header and reflect it back in Access-Control-Allow-Origin. This effectively whitelists every origin on the internet — defeating CORS entirely.",
      bad: `// ❌ VERY DANGEROUS — wildcard via reflection:
app.use((req, res, next) => {
  // Dangerous: echoes whatever origin sent the request
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Credentials', 'true')
  // Now ANY website can make credentialed cross-origin requests
  // to your API and read the response — including:
  // - Your users' auth tokens
  // - Their private data
  // - Account details
  next()
})

// Why people do this: "it fixes CORS errors in dev"
// Why it's catastrophic: it's * + credentials combined`,
      good: `// ✅ Explicit allowlist:
const ALLOWED_ORIGINS = [
  'https://app.company.com',
  'https://staging.company.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean)

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Vary', 'Origin')  // ← tell CDNs to vary cache by Origin
    if (needsCredentials) {
      res.header('Access-Control-Allow-Credentials', 'true')
    }
  }
  // If origin not in list: no header → browser blocks
  next()
})

// Always add Vary: Origin when dynamically setting Allow-Origin
// Without it, CDNs may cache the origin-A response and serve
// it to origin-B requests (leaking data!)`,
    },
  ]
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">CORS misconfigurations are in the OWASP Top 10 for API security. The most dangerous pattern is dynamically reflecting any origin — avoid it at all costs.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className="glass rounded-[24px] border border-red-500/20 hover:border-red-500/40 overflow-hidden transition-colors">
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black border bg-red-500/20 text-red-400 border-red-500/30 shrink-0">{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Danger</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Fix</p><pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
