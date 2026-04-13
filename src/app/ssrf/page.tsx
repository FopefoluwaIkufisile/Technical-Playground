"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Network, Shield, ShieldAlert, ArrowRightLeft, Globe, Search, Database, Terminal, Server, CheckCircle2, AlertTriangle, Key
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "impact" | "simulator" | "remediation"

const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "impact", label: "Impact & Targets" },
  { id: "simulator", label: "🔗 Simulator" },
  { id: "remediation", label: "Remediation" },
]

export default function SSRFPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-orange-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Network className="w-3 h-3" /> SSRF · Security
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-orange-400 bg-clip-text text-transparent">
            Server-Side Request Forgery
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            Explore how attackers manipulate applications to make unintended HTTP requests to internal systems, bypassing firewalls and exposing cloud metadata, databases, or admin panels.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "impact" && <ImpactTab />}
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
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">The SSRF Mechanism</h2>
            <p className="text-sm text-gray-400 mt-1">Abusing server trust and network placement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-widest text-[#fff]">The Vulnerability</h3>
             <p className="text-sm text-gray-400 leading-relaxed">
               SSRF arises whenever a web application is fetching a remote resource based on a user-controllable URL, without validating or restricting the destination. Examples include webhook integrations, PDF generators, or pulling a profile avatar from a third party.
             </p>
             <p className="text-sm text-gray-400 leading-relaxed">
               The core issue is <strong className="text-orange-400">Trust Placement</strong>. The backend server sits *behind* the DMZ/Firewall. Internally, it is trusted to communicate with databases, admin panels, or internal APIs. If an attacker controls the URL the server fetches, they can puppet the server to attack the internal network.
             </p>
          </div>
          
          <div className="space-y-4">
             <div className="bg-black/40 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] pointer-events-none" />
                <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">SSRF Topologies</h3>
                
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center justify-between text-xs text-gray-300">
                      <Terminal className="w-4 h-4" />
                      <div className="h-px bg-white/20 flex-1 mx-3 relative">
                         <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-2 bg-[#111] text-[9px] uppercase tracking-wider text-green-400">Expected Flow</div>
                      </div>
                      <Globe className="w-4 h-4 text-blue-400" />
                   </div>
                   
                   <div className="flex items-center justify-between text-xs text-red-300">
                      <Terminal className="w-4 h-4" />
                      <div className="h-px bg-red-500/40 flex-1 mx-3 relative">
                         <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-2 bg-[#111] text-[9px] uppercase tracking-wider text-red-400">SSRF Attack Flow</div>
                      </div>
                      <Server className="w-4 h-4 text-orange-400" />
                   </div>
                   
                   <p className="text-[10px] text-gray-500 font-mono text-center">Server fetches internal IP (e.g., 10.0.0.5) instead of public API</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════ IMPACT ════════ */
function ImpactTab() {
  const targets = [
    {
      id: "cloud-metadata",
      name: "Cloud Metadata APIs",
      icon: <Database className="w-6 h-6" />,
      color: "orange",
      desc: "Cloud providers (AWS, GCP, Azure) maintain a special IP address (169.254.169.254) accessible only by the virtual machine itself. An SSRF can fetch this IP to extract highly privileged IAM tokens.",
      urls: ["http://169.254.169.254/latest/meta-data/iam/security-credentials/"]
    },
    {
      id: "loopback",
      name: "Localhost Services",
      icon: <Server className="w-6 h-6" />,
      color: "blue",
      desc: "Services bound to the loopback interface (127.0.0.1 or localhost) are normally protected from the outside. SSRF allows attackers to access local Redis, Memcached, or internal admin endpoints.",
      urls: ["http://localhost:8080/admin", "http://127.0.0.1:6379", "dict://127.0.0.1:11211/"]
    },
    {
      id: "internal-network",
      name: "Intranet Port Scanning",
      icon: <Network className="w-6 h-6" />,
      color: "emerald",
      desc: "By measuring response times or observing error messages, an attacker can use the server to map out internal IPs and find open ports inside the safe corporate network.",
      urls: ["http://10.0.0.5:22", "http://192.168.1.100:3306"]
    }
  ]

  const colorCls: Record<string, string> = {
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {targets.map(t => (
        <div key={t.id} className={cn("glass p-6 rounded-[24px] border space-y-4 hover:-translate-y-1 transition-transform", colorCls[t.color].replace("text-", "border-").replace("20", "10").replace("bg-", "hover:bg-").replace("10", "5"))}>
          <div className="flex items-center gap-3">
             <div className={cn("p-3 rounded-xl border", colorCls[t.color])}>{t.icon}</div>
             <h3 className="text-lg font-black text-white leading-tight">{t.name}</h3>
          </div>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed h-20">{t.desc}</p>
          
          <div className="pt-4 border-t border-white/5 space-y-2">
             <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Example Payloads</span>
             <ul className="space-y-1.5">
               {t.urls.map((url, i) => (
                 <li key={i} className="text-[10px] text-gray-300 font-mono bg-black/40 px-2 py-1.5 rounded truncate border border-white/5">{url}</li>
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
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<{ status: number, data: any, isInternal: boolean } | null>(null)
  const [isProtected, setIsProtected] = useState(false)

  const handleFetch = () => {
    if (!url) return
    setLoading(true)
    setResponse(null)

    setTimeout(() => {
      let isInternal = false
      let data: any = ""
      let status = 200

      const rawUrl = url.toLowerCase()
      const blockedPattern = /localhost|127\.0\.0\.1|169\.254\.169\.254|10\.|192\.168\./

      if (isProtected && blockedPattern.test(rawUrl)) {
        status = 403
        data = "Error: Access to internal IP addresses is forbidden by security policies."
      } else {
        if (rawUrl.includes("169.254.169.254/latest/meta-data")) {
          isInternal = true
          data = "{\n  \"AccessKeyId\": \"ASIAV3U...\",\n  \"SecretAccessKey\": \"kL8+p...\",\n  \"Token\": \"IQoJb3JpZ2luX2VjEJ...\"\n}"
        } else if (rawUrl.includes("localhost/admin") || rawUrl.includes("127.0.0.1/admin")) {
          isInternal = true
          data = "<h1>SuperSecret Internal Admin Panel v2.1</h1>\n<p>Welcome root.</p>\n<button>Reset Production Database</button>"
        } else if (rawUrl.includes("example.com")) {
          data = "<!DOCTYPE html>\n<html>\n<body>\n<h1>Example Domain</h1>\n</body>\n</html>"
        } else if (rawUrl.includes("internal")) {
            isInternal = true
            data = "Internal Employee Intranet Directory."
        } else {
          status = 404
          data = "Cannot resolve host or public resource not found."
        }
      }

      setResponse({ status, data, isInternal })
      setLoading(false)
    }, 800)
  }

  const examples = [
    "https://example.com/api/avatar",
    "http://169.254.169.254/latest/meta-data/",
    "http://localhost/admin/delete",
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Fetcher Form */}
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
           <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h3 className="text-xl font-black flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-orange-400" />
                Webhook Previewer (Server)
              </h3>
           </div>
           <p className="text-sm text-gray-400">Enter a URL to preview. Our backend server will fetch it and return the content to you.</p>

           <div className="space-y-2">
             <label className="text-[10px] font-bold uppercase tracking-widest text-[#fff]">Target URL</label>
             <div className="flex gap-2">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                 <input 
                   value={url} onChange={e => setUrl(e.target.value)} 
                   placeholder="https://example.com"
                   className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-mono focus:outline-none focus:border-white/30 text-white"
                   onKeyDown={e => e.key === 'Enter' && handleFetch()}
                 />
               </div>
               <button onClick={handleFetch} disabled={loading} className="bg-orange-600 hover:bg-orange-500 text-white px-6 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors disabled:opacity-50">
                 {loading ? "Fetching..." : "Fetch"}
               </button>
             </div>
           </div>

           <div className="space-y-2 pt-4">
             <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Try it out</span>
             <div className="flex flex-wrap gap-2">
               {examples.map((ex, i) => (
                 <button key={i} onClick={() => setUrl(ex)} className="px-3 py-1.5 text-[10px] font-mono rounded bg-white/5 border border-white/10 hover:border-white/30 text-gray-300">
                    {ex}
                 </button>
               ))}
             </div>
           </div>
        </div>

        <button onClick={() => setIsProtected(!isProtected)} className={cn("w-full py-3 rounded-xl border transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2",
          isProtected ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/5 border-red-500/30 text-red-500"
        )}>
           <Shield className="w-4 h-4" /> {isProtected ? "Patch Applied (Internal Blocking Enabled)" : "Vulnerable (No Filtering)"}
        </button>
      </div>

      {/* Response Panel */}
      <div className="glass p-6 rounded-[32px] border-white/5 flex flex-col h-full bg-[#0a0a0a]">
         <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Server className="w-5 h-5 text-gray-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">Server Response</h3>
         </div>
         
         <div className="flex-1 relative mt-4">
           {!response && !loading && (
             <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs uppercase font-bold tracking-widest">
               Awaiting request...
             </div>
           )}
           
           {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-orange-400 opacity-50">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                 <ArrowRightLeft className="w-8 h-8" />
               </motion.div>
               <p className="text-[10px] font-mono tracking-widest uppercase">Proxying Request...</p>
             </div>
           )}

           {response && !loading && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className={cn("px-2 py-1 rounded text-[10px] font-black", response.status === 200 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                      HTTP {response.status}
                   </div>
                   {response.isInternal && response.status === 200 && (
                      <div className="px-2 py-1 rounded bg-red-500 text-white flex items-center gap-1 text-[10px] font-black uppercase tracking-wider animate-pulse">
                         <Key className="w-3 h-3" /> EXFILTRATION DETECTED
                      </div>
                   )}
                </div>
                
                <pre className={cn("bg-black p-4 rounded-xl text-xs font-mono whitespace-pre-wrap overflow-auto max-h-[300px] border", response.isInternal && response.status === 200 ? "border-red-500/50 text-red-100" : "border-white/10 text-gray-300")}>
                   {response.data}
                </pre>
             </motion.div>
           )}
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
             <h2 className="text-xl font-black text-emerald-400">Mitigating SSRF</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">Fixing SSRF requires strict control over what the backend application is allowed to fetch.</p>
          
          <div className="space-y-3 pt-4">
             <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1.5">1. URL Allow-listing</h3>
                <p className="text-[11px] text-gray-400">If the application only ever needs to fetch resources from known partners, strictly enforce an allow-list of domains. Block everything else.</p>
             </div>
             
             <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1.5">2. Safe URL Resolution/IP Blocking</h3>
                <p className="text-[11px] text-gray-400">If fetching arbitrary external URLs is required (e.g. RSS reader), you must resolve the domain to an IP *before* fetching, and ensure the IP is not in 127.0.0.0/8, 10.0.0.0/8, or 169.254.169.254.</p>
             </div>

             <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1.5">3. Network Layer Egress Policing</h3>
                <p className="text-[11px] text-gray-400">Configure firewall rules so the web server cannot communicate natively with the internal database or AWS metadata service directly unless strictly required.</p>
             </div>
          </div>
        </div>

        <div className="space-y-4 flex flex-col">
          <div className="glass p-6 rounded-[24px] border-white/5 space-y-3 flex-1">
             <h3 className="text-sm font-black uppercase tracking-widest">Insecure Code</h3>
             <pre className="bg-black/50 border border-red-500/20 p-4 rounded-xl text-[11px] font-mono text-red-300 overflow-auto">
               {`app.post('/fetch-image', async (req, res) => {
  const url = req.body.url;
  
  // VULNERABLE: Direct fetch! 
  // Attacker sends http://169.254.169.254/latest/meta-data/
  const imageResp = await fetch(url);
  const data = await imageResp.text();
  
  res.send(data);
});`}
             </pre>
          </div>
          
          <div className="glass p-6 rounded-[24px] border-white/5 space-y-3 flex-1">
             <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400">Secure Implementation Concept</h3>
             <pre className="bg-black/50 border border-emerald-500/20 p-4 rounded-xl text-[11px] font-mono text-emerald-300 overflow-auto">
               {`const isInternalIP = (ip) => {
  return ip.startsWith('127.') || 
         ip.startsWith('10.') || 
         ip === '169.254.169.254';
};

app.post('/fetch', async (req, res) => {
  const url = new URL(req.body.url);
  const ip = await dnsResolve(url.hostname);
  
  // Protection logic
  if (isInternalIP(ip)) {
     return res.status(403).send('Forbidden IP');
  }
  
  const data = await fetch(url.href);
  res.send(data);
});`}
             </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
