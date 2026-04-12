"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Play, Clock, Cpu, CheckCircle2,
  XCircle, RefreshCw, Info, ChevronRight
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "simulator" | "patterns" | "pitfalls"

const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "⚡ Simulator" },
  { id: "patterns", label: "Patterns" },
  { id: "pitfalls", label: "Pitfalls" },
]

export default function AsyncPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-cyan-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Cpu className="w-3 h-3" /> Async · JavaScript
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-cyan-400 bg-clip-text text-transparent">
            Async / Await
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            Promises, async/await, and orchestration patterns — sequential vs parallel execution, error handling, and the common pitfalls that cause slow or broken async code.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "simulator" && <SimulatorTab />}
            {tab === "patterns" && <PatternsTab />}
            {tab === "pitfalls" && <PitfallsTab />}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Clock className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">The Evolution of Async</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            JavaScript is single-threaded — it can&apos;t truly do two things at once. But it can <strong className="text-white">delegate</strong> waiting to the browser (network, timers, file I/O) and continue executing other code. Async patterns evolved to make this delegation readable.
          </p>
          <div className="space-y-3">
            {[
              { gen: "Gen 1: Callbacks (2009)", prob: "Callback hell, no chaining, error handling is manual per-callback", code: "fs.readFile(f, (err, data) => { if (err) ... })", color: "red" },
              { gen: "Gen 2: Promises (2015, ES6)", prob: "Chainable, composable, but .then() chains get verbose", code: "fetch(url).then(r => r.json()).then(data => ...)", color: "amber" },
              { gen: "Gen 3: async/await (2017, ES8)", prob: "Reads like sync code, but still non-blocking. Current standard.", code: "const data = await fetch(url).then(r => r.json())", color: "emerald" },
            ].map(item => (
              <div key={item.gen} className={cn("p-4 rounded-2xl border",
                item.color === "red" ? "bg-red-500/5 border-red-500/20" :
                item.color === "amber" ? "bg-amber-500/5 border-amber-500/20" :
                "bg-emerald-500/5 border-emerald-500/20"
              )}>
                <p className={cn("text-[10px] font-black uppercase mb-1", item.color === "red" ? "text-red-400" : item.color === "amber" ? "text-amber-400" : "text-emerald-400")}>{item.gen}</p>
                <code className="text-[10px] text-gray-500 font-mono">{item.code}</code>
                <p className="text-[11px] text-gray-600 mt-1">{item.prob}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">How async/await Works</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            <code className="text-cyan-300">async/await</code> is <strong className="text-white">syntactic sugar over Promises</strong>. Under the hood, an <code>async</code> function always returns a Promise, and <code>await</code> suspends the function, yielding control to the event loop until the awaited Promise settles.
          </p>
          <div className="bg-black/40 p-5 rounded-2xl border border-cyan-500/10 font-mono text-xs leading-7">
            <p className="text-gray-600">{"// These are exactly equivalent:"}</p>
            <div className="mt-2">
              <p className="text-cyan-400">{"// Promise chain:"}</p>
              <p>fetch(<span className="text-emerald-400">&apos;/api/user&apos;</span>).then(r =&gt; r.json()).then(user =&gt; {"{"}</p>
              <p className="pl-4">console.log(user);</p>
              <p>{"}"}).catch(err =&gt; console.error(err));</p>
            </div>
            <div className="mt-3">
              <p className="text-cyan-400">{"// async/await:"}</p>
              <p>async function getUser() {"{"}</p>
              <p className="pl-4">try {"{"}</p>
              <p className="pl-8">const res = <span className="text-cyan-400">await</span> fetch(<span className="text-emerald-400">&apos;/api/user&apos;</span>);</p>
              <p className="pl-8">const user = <span className="text-cyan-400">await</span> res.json();</p>
              <p className="pl-8">console.log(user);</p>
              <p className="pl-4">{"}"} catch (err) {"{ console.error(err); }"}</p>
              <p>{"}"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "await suspends...", desc: "...the current async function. Not the entire thread! Other code can run.", color: "cyan" },
              { label: "async returns...", desc: "...a Promise. Always. Even if you return a plain value.", color: "blue" },
              { label: "Top-level await", desc: "Available in ES2022 modules. No wrapper async function needed.", color: "violet" },
              { label: "await in loops", desc: "Be careful! await in a for loop is sequential. Use Promise.all for parallel.", color: "amber" },
            ].map(i => (
              <div key={i.label} className={cn("p-3 rounded-2xl border text-[11px] space-y-1",
                i.color === "cyan" ? "bg-cyan-500/5 border-cyan-500/20" :
                i.color === "blue" ? "bg-blue-500/5 border-blue-500/20" :
                i.color === "violet" ? "bg-violet-500/5 border-violet-500/20" :
                "bg-amber-500/5 border-amber-500/20"
              )}>
                <p className={cn("font-black text-[10px]", i.color === "cyan" ? "text-cyan-400" : i.color === "blue" ? "text-blue-400" : i.color === "violet" ? "text-violet-400" : "text-amber-400")}>{i.label}</p>
                <p className="text-gray-500">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Promise States & Settled Values</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { state: "Pending", symbol: "⏳", desc: "Initial state. The async work hasn't completed yet. A pending Promise can transition to either Fulfilled or Rejected.", color: "amber", code: "const p = new Promise((res, rej) => /* still running */)" },
            { state: "Fulfilled", symbol: "✅", desc: "The operation completed successfully. resolve() was called. Chained .then() handlers will receive the resolved value.", color: "emerald", code: "resolve('user data')  // p is now fulfilled with 'user data'" },
            { state: "Rejected", symbol: "❌", desc: "The operation failed. reject() was called or an exception was thrown. .catch() or the second .then() argument handles this.", color: "red", code: "reject(new Error('404'))  // p is now rejected" },
          ].map(s => (
            <div key={s.state} className={cn("p-5 rounded-2xl border space-y-3",
              s.color === "amber" ? "bg-amber-500/5 border-amber-500/20" :
              s.color === "emerald" ? "bg-emerald-500/5 border-emerald-500/20" :
              "bg-red-500/5 border-red-500/20"
            )}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.symbol}</span>
                <p className={cn("text-sm font-black", s.color === "amber" ? "text-amber-400" : s.color === "emerald" ? "text-emerald-400" : "text-red-400")}>{s.state}</p>
              </div>
              <p className="text-[12px] text-gray-400 leading-relaxed">{s.desc}</p>
              <code className="text-[10px] text-gray-600 font-mono block">{s.code}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════ SIMULATOR ════════ */
type AsyncPattern = "sequential" | "parallel_all" | "parallel_race" | "allSettled"

function SimulatorTab() {
  const [pattern, setPattern] = useState<AsyncPattern>("parallel_all")
  type ItemStatus = "idle" | "pending" | "resolved" | "rejected"
  type Item = { id: string; name: string; status: ItemStatus; progress: number; delay: number }
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "User Profile", status: "idle", progress: 0, delay: 1500 },
    { id: "2", name: "Order History", status: "idle", progress: 0, delay: 2500 },
    { id: "3", name: "Preferences", status: "idle", progress: 0, delay: 1000 },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [allowFailure, setAllowFailure] = useState(false)
  const [globalStatus, setGlobalStatus] = useState<"idle" | "running" | "success" | "failed">("idle")
  const [elapsed, setElapsed] = useState<number | null>(null)

  const reset = () => {
    setItems(p => p.map(i => ({ ...i, status: "idle" as ItemStatus, progress: 0 })))
    setGlobalStatus("idle"); setElapsed(null)
  }

  const simulateItem = (id: string, delay: number) =>
    new Promise<void>((resolve, reject) => {
      setItems(p => p.map(i => i.id === id ? { ...i, status: "pending" as ItemStatus } : i))
      let current = 0
      const interval = setInterval(() => {
        current += 10
        setItems(p => p.map(i => i.id === id ? { ...i, progress: current } : i))
        if (current >= 100) {
          clearInterval(interval)
          const fail = allowFailure && Math.random() < 0.4
          setItems(p => p.map(i => i.id === id ? { ...i, status: (fail ? "rejected" : "resolved") as ItemStatus } : i))
          if (fail) reject(`${id} failed`); else resolve()
        }
      }, delay / 10)
    })

  const run = async (ptn: AsyncPattern) => {
    if (isRunning) return
    reset()
    setIsRunning(true); setGlobalStatus("running")
    const start = Date.now()
    try {
      if (ptn === "sequential") {
        for (const item of items) await simulateItem(item.id, item.delay)
      } else if (ptn === "parallel_all") {
        await Promise.all(items.map(i => simulateItem(i.id, i.delay)))
      } else if (ptn === "parallel_race") {
        await Promise.race(items.map(i => simulateItem(i.id, i.delay)))
      } else {
        await Promise.allSettled(items.map(i => simulateItem(i.id, i.delay)))
      }
      setGlobalStatus("success")
    } catch { setGlobalStatus("failed") }
    setElapsed(Math.round((Date.now() - start) / 100) / 10)
    setIsRunning(false)
  }

  const PATTERNS = [
    { id: "sequential" as const, label: "Sequential", desc: "await one, then the next", time: "Sum of all delays", code: "for (const item of items) { await fetch(item); }" },
    { id: "parallel_all" as const, label: "Promise.all", desc: "All parallel, fails if any fail", time: "Max of delays", code: "await Promise.all(items.map(i => fetch(i)))" },
    { id: "parallel_race" as const, label: "Promise.race", desc: "First settled wins, rest ignored", time: "Min of delays", code: "await Promise.race(items.map(i => fetch(i)))" },
    { id: "allSettled" as const, label: "Promise.allSettled", desc: "All parallel, never fails", time: "Max of delays", code: "await Promise.allSettled(items.map(i => fetch(i)))" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {PATTERNS.map(p => (
          <button key={p.id} onClick={() => { setPattern(p.id); reset() }}
            className={cn("px-4 py-2 rounded-full text-[11px] font-bold border transition-all",
              pattern === p.id ? "bg-cyan-600 border-cyan-400 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
            )}>{p.label}</button>
        ))}
      </div>

      {(() => {
        const p = PATTERNS.find(p => p.id === pattern)!
        return (
          <div className="glass p-5 rounded-[24px] border-cyan-500/20 bg-cyan-500/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><p className="text-[9px] text-gray-600 uppercase font-black">Pattern</p><p className="text-sm font-bold text-cyan-400">{p.desc}</p></div>
            <div><p className="text-[9px] text-gray-600 uppercase font-black">Total Time</p><p className="text-sm font-bold">{p.time}</p></div>
            <div><p className="text-[9px] text-gray-600 uppercase font-black">Code</p><code className="text-[10px] text-cyan-300 font-mono">{p.code}</code></div>
          </div>
        )
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-3">
          <button onClick={() => run(pattern)} disabled={isRunning}
            className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />{isRunning ? "Running..." : "Run Pattern"}
          </button>
          <button onClick={reset} className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors">Reset</button>
          <button onClick={() => setAllowFailure(!allowFailure)}
            className={cn("w-full flex justify-between items-center p-3 rounded-xl border transition-all",
              allowFailure ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/5 border-white/5 text-gray-600 hover:border-white/10"
            )}>
            <span className="text-[10px] font-bold uppercase">Simulate Failures</span>
            <div className={cn("w-2 h-2 rounded-full", allowFailure ? "bg-red-500 animate-pulse" : "bg-gray-800")} />
          </button>
          <div className="glass p-4 rounded-xl border-white/5 space-y-2">
            <p className="text-[10px] text-gray-600 uppercase font-black">Result</p>
            <p className={cn("text-sm font-black uppercase",
              globalStatus === "success" ? "text-emerald-400" : globalStatus === "failed" ? "text-red-400" :
              globalStatus === "running" ? "text-cyan-400" : "text-gray-700"
            )}>{globalStatus}</p>
            {elapsed !== null && <p className="text-[10px] text-gray-600 font-mono">Elapsed: {elapsed}s</p>}
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className={cn("glass p-6 rounded-[24px] border flex flex-col justify-between transition-all duration-500",
              item.status === "pending" ? "border-cyan-500/30 bg-cyan-500/5" :
              item.status === "resolved" ? "border-emerald-500/30 bg-emerald-500/5" :
              item.status === "rejected" ? "border-red-500/30 bg-red-500/5" :
              "border-white/5"
            )}>
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2 rounded-xl", item.status === "pending" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-gray-700")}>
                  <RefreshCw className={cn("w-4 h-4", item.status === "pending" && "animate-spin")} />
                </div>
                {item.status === "resolved" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {item.status === "rejected" && <XCircle className="w-5 h-5 text-red-400" />}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-[9px] text-gray-600 font-mono">{item.delay}ms delay</p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] text-gray-700 font-bold">
                    <span>{item.status.toUpperCase()}</span><span>{item.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${item.progress}%` }}
                      className={cn("h-full rounded-full", item.status === "rejected" ? "bg-red-500" : "bg-cyan-500")} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════ PATTERNS ════════ */
function PatternsTab() {
  const [active, setActive] = useState("parallel")
  const patterns = [
    {
      id: "parallel", name: "Parallel vs Sequential", color: "cyan",
      desc: "The most impactful optimization. Sequential awaiting adds delays together. Parallel execution takes the maximum — often 5-10x faster for independent operations.",
      code: `// ❌ Slow: sequential (sum of delays = 5s total)
async function loadDashboard() {
  const user    = await fetchUser();     // 1s
  const orders  = await fetchOrders();  // 2s  
  const prefs   = await fetchPrefs();   // 2s
  // Total: 5 seconds (each waits for previous)
}

// ✅ Fast: parallel (max of delays = 2s total)
async function loadDashboard() {
  const [user, orders, prefs] = await Promise.all([
    fetchUser(),     // ← all start simultaneously
    fetchOrders(),
    fetchPrefs(),
  ]);
  // Total: 2 seconds (limited by slowest)
}`,
      insight: "If operations are independent (no result feeds into another), always use Promise.all. This is the single most common async performance bug.",
    },
    {
      id: "error-handling", name: "Error Handling", color: "red",
      desc: "Proper async error handling requires care — unhandled rejections crash Node.js and silently fail in browsers. Always wrap await calls in try/catch.",
      code: `// ❌ Missing error handling:
async function getUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);  // can throw!
  return res.json();  // can throw on non-JSON response
}

// ✅ Complete error handling:
async function getUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch user:', err);
    throw err;  // re-throw if caller should handle it
  }
}

// ✅ Promise.allSettled — get results even when some fail:
const results = await Promise.allSettled([
  fetchUser(), fetchOrders(), fetchPrefs()
]);
const succeeded = results.filter(r => r.status === 'fulfilled');
const failed    = results.filter(r => r.status === 'rejected');`,
      insight: "Promise.allSettled is underused. Unlike Promise.all which fails fast on the first rejection, allSettled always waits for all promises and gives you individual results — perfect for dashboard data loading.",
    },
    {
      id: "timeout", name: "Timeout & Abort", color: "amber",
      desc: "Network requests can hang forever. Always implement timeouts using AbortController or Promise.race. The browser's fetch API has no built-in timeout.",
      code: `// ✅ Timeout with AbortController (AbortSignal.timeout in modern browsers):
async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);  // cancel timeout if successful
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(\`Request timed out after \${ms}ms\`);
    }
    throw err;
  }
}

// ✅ Modern: AbortSignal.timeout() (2022+)
const res = await fetch(url, {
  signal: AbortSignal.timeout(5000)  // auto-aborts after 5s
});`,
      insight: "Without timeouts, a slow or dead server leaves your users waiting indefinitely. AbortController also works for cancelling fetch requests when users navigate away (React router pattern).",
    },
    {
      id: "retry", name: "Retry with Backoff", color: "violet",
      desc: "Transient network failures are common. Implementing automatic retries with exponential backoff makes applications resilient without hammering a failing server.",
      code: `// Retry with exponential backoff
async function fetchWithRetry(url, { retries = 3, baseDelay = 1000 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok && res.status >= 500) {
        throw new Error(\`Server error: \${res.status}\`);
      }
      return await res.json();
    } catch (err) {
      const isLast = attempt === retries;
      if (isLast) throw err;
      
      const delay = baseDelay * Math.pow(2, attempt);  // 1s, 2s, 4s
      const jitter = Math.random() * delay * 0.1;      // ±10% jitter
      console.log(\`Attempt \${attempt + 1} failed, retrying in \${delay}ms\`);
      await new Promise(r => setTimeout(r, delay + jitter));
    }
  }
}`,
      insight: "Jitter prevents thundering herd problems where thousands of clients retry simultaneously. The small random delay spreads load across time, preventing server overload during recovery.",
    },
  ]

  const p = patterns.find(p => p.id === active)!
  const colorMap: Record<string, string> = { cyan: "text-cyan-400 bg-cyan-500/5 border-cyan-500/20", red: "text-red-400 bg-red-500/5 border-red-500/20", amber: "text-amber-400 bg-amber-500/5 border-amber-500/20", violet: "text-violet-400 bg-violet-500/5 border-violet-500/20" }
  const c = colorMap[p.color]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {patterns.map(pat => (
          <button key={pat.id} onClick={() => setActive(pat.id)} className={cn(
            "px-5 py-2 rounded-full text-[11px] font-bold border transition-all",
            active === pat.id ? colorMap[pat.color] : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
          )}>{pat.name}</button>
        ))}
      </div>
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

/* ════════ PITFALLS ════════ */
function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("sequential-loop")
  const pitfalls = [
    {
      id: "sequential-loop", severity: "HIGH", color: "orange",
      title: "await in a for...of Loop (Accidental Sequential)",
      summary: "Using await inside a regular for loop makes each iteration wait for the previous one to complete. For independent async operations, this is almost always wrong and 5-10x slower.",
      bad: `// ❌ Sequential — takes sum(delays) time:
async function loadAllUsers(ids) {
  const users = [];
  for (const id of ids) {
    const user = await fetchUser(id);  // waits for each!
    users.push(user);
  }
  return users;
  // 100 users × 200ms = 20 seconds total!
}`,
      good: `// ✅ Parallel — takes max(delays) time:
async function loadAllUsers(ids) {
  return Promise.all(ids.map(id => fetchUser(id)));
  // 100 users, still only ~200ms!
}

// ✅ Parallel with rate limiting (if needed):
async function loadAllUsers(ids, concurrency = 10) {
  const results = [];
  for (let i = 0; i < ids.length; i += concurrency) {
    const chunk = ids.slice(i, i + concurrency);
    results.push(...await Promise.all(chunk.map(fetchUser)));
  }
  return results;
}`,
    },
    {
      id: "forgotten-await", severity: "HIGH", color: "orange",
      title: "Forgotten await — Treating a Promise as Its Value",
      summary: "Forgetting await means you get a Promise object instead of its resolved value. TypeScript often catches this, but in JS it silently returns [object Promise].",
      bad: `// ❌ No await — 'user' is a Promise object!
async function showUser() {
  const user = fetchUser();  // ← missing await!
  console.log(user.name);   // undefined — 'user' is a Promise
  console.log(\`Hello, \${user}\`); // "Hello, [object Promise]"
}

// ❌ Async function not awaited in caller:
async function getData() { return fetch('/api'); }
const data = getData();  // Promise, not the data!
console.log(data.json); // undefined`,
      good: `// ✅ Always await async functions:
async function showUser() {
  const user = await fetchUser();  // ← await the Promise
  console.log(user.name);          // 'Alice' ✓
}

// ✅ Await at every level:
const data   = await getData();
const result = await data.json();

// ✅ TypeScript helps: enable strict mode and 
// @typescript-eslint/no-floating-promises rule`,
    },
    {
      id: "error-swallowing", severity: "MEDIUM", color: "yellow",
      title: "Swallowing Errors with Empty catch",
      summary: "An empty catch block silently discards errors. The function appears to succeed, but actually returned undefined. This is one of the hardest bugs to debug.",
      bad: `// ❌ Empty catch — errors disappear silently!
async function saveData(data) {
  try {
    await db.save(data);
    return 'saved';
  } catch (err) {
    // ← Nothing here! err is swallowed.
  }
  // If save fails, function returns undefined
  // Caller has no idea something went wrong!
}

// ❌ Same problem with .catch(() => {}):
fetchUser().catch(() => {});  // silently fails`,
      good: `// ✅ Always handle or re-throw errors:
async function saveData(data) {
  try {
    await db.save(data);
    return 'saved';
  } catch (err) {
    console.error('Save failed:', err);  // at minimum: log it!
    throw err;  // let the caller decide how to handle it
    // OR: return { success: false, error: err.message }
  }
}

// ✅ Global unhandled rejection handler (Node.js):
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});`,
    },
  ]
  const badge = (s: string) => s === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  const border = (c: string) => c === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-yellow-500/20 hover:border-yellow-500/40"

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-6">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Most async bugs fall into two buckets: accidentally making things sequential when they should be parallel, or not handling errors properly. Both are invisible until production.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className={cn("glass rounded-[24px] border overflow-hidden transition-colors", border(p.color))}>
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0", badge(p.severity))}>{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Anti-pattern</p>
                    <pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Fix</p>
                    <pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre>
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
