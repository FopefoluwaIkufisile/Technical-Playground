"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Play, RotateCcw, Box, Terminal, Clock, Zap, Cpu,
  Pointer, AlertTriangle, Info, ChevronRight, CheckCircle2,
  Layers, Code2, RefreshCw, Eye
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "simulator" | "order" | "pitfalls"

const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "⚡ Simulator" },
  { id: "order", label: "Execution Order" },
  { id: "pitfalls", label: "Pitfalls" },
]

export default function EventLoopPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-purple-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Cpu className="w-3 h-3" /> JavaScript Runtime
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-purple-400 bg-clip-text text-transparent">
            Event Loop
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            How JavaScript manages asynchronous code on a single thread — call stack, microtasks, macrotasks, and the event loop that orchestrates them all.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "simulator" && <SimulatorTab />}
            {tab === "order" && <OrderTab />}
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
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20"><Cpu className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Single-Threaded But Async</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            JavaScript has <strong className="text-white">one call stack</strong> — it can only do one thing at a time. Yet it handles network requests, timers, and user interactions without freezing. How? The <span className="text-purple-400 font-semibold">Event Loop</span>.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            The browser (or Node.js) hands off async work like <code className="text-purple-300">setTimeout</code> and <code className="text-purple-300">fetch()</code> to <strong className="text-white">Web APIs</strong> — separate threads outside JavaScript. When they finish, their callbacks queue up. The Event Loop moves them onto the call stack only when it's empty.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Call Stack", desc: "Where JS code runs. LIFO. One frame at a time.", color: "blue" },
              { label: "Web APIs", desc: "Browser-managed threads for timers, network, DOM.", color: "orange" },
              { label: "Microtask Queue", desc: "High priority. Promise callbacks, queueMicrotask.", color: "emerald" },
              { label: "Macrotask Queue", desc: "Lower priority. setTimeout, setInterval callbacks.", color: "purple" },
            ].map(item => (
              <div key={item.label} className={cn("p-4 rounded-2xl border space-y-1",
                item.color === "blue" ? "bg-blue-500/5 border-blue-500/20" :
                item.color === "orange" ? "bg-orange-500/5 border-orange-500/20" :
                item.color === "emerald" ? "bg-emerald-500/5 border-emerald-500/20" :
                "bg-purple-500/5 border-purple-500/20"
              )}>
                <p className={cn("text-[10px] font-black uppercase tracking-widest",
                  item.color === "blue" ? "text-blue-400" : item.color === "orange" ? "text-orange-400" :
                  item.color === "emerald" ? "text-emerald-400" : "text-purple-400"
                )}>{item.label}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">The Runtime Architecture</h3>
          <div className="space-y-3">
            {[
              { zone: "V8 Engine", items: ["Call Stack — executes one frame at a time", "Memory Heap — object/closure storage"], color: "blue", icon: <Cpu className="w-4 h-4" /> },
              { zone: "Web APIs (Browser)", items: ["setTimeout / setInterval timers", "fetch() / XHR network requests", "DOM event listeners", "requestAnimationFrame"], color: "orange", icon: <Zap className="w-4 h-4" /> },
              { zone: "Task Queues", items: ["Microtask Queue (Promise.then, queueMicrotask)", "Macrotask Queue (setTimeout, I/O callbacks)", "Animation Queue (requestAnimationFrame)"], color: "purple", icon: <Box className="w-4 h-4" /> },
              { zone: "Event Loop", items: ["Checks: is the call stack empty?", "If yes: drain ALL microtasks first", "Then: run one macrotask", "Then: optionally render, repeat"], color: "emerald", icon: <RefreshCw className="w-4 h-4" /> },
            ].map(z => (
              <div key={z.zone} className={cn("p-4 rounded-2xl border",
                z.color === "blue" ? "bg-blue-500/5 border-blue-500/20" :
                z.color === "orange" ? "bg-orange-500/5 border-orange-500/20" :
                z.color === "purple" ? "bg-purple-500/5 border-purple-500/20" :
                "bg-emerald-500/5 border-emerald-500/20"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(z.color === "blue" ? "text-blue-400" : z.color === "orange" ? "text-orange-400" : z.color === "purple" ? "text-purple-400" : "text-emerald-400")}>{z.icon}</span>
                  <p className={cn("text-[11px] font-black uppercase tracking-widest", z.color === "blue" ? "text-blue-400" : z.color === "orange" ? "text-orange-400" : z.color === "purple" ? "text-purple-400" : "text-emerald-400")}>{z.zone}</p>
                </div>
                <ul className="space-y-1">
                  {z.items.map(item => <li key={item} className="text-[11px] text-gray-500 flex gap-2"><span className="text-white/20">→</span>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Microtasks vs Macrotasks</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs leading-7">
              <p className="text-gray-600">// What order does this print?</p>
              <p><span className="text-white">console</span><span className="text-gray-500">.log(</span><span className="text-emerald-400">&apos;1 - sync&apos;</span><span className="text-gray-500">)</span></p>
              <p><span className="text-purple-400">setTimeout</span><span className="text-gray-500">(() =&gt; console.log(</span><span className="text-orange-400">&apos;2 - macro&apos;</span><span className="text-gray-500">), 0)</span></p>
              <p><span className="text-blue-400">Promise</span><span className="text-gray-500">.resolve().then(() =&gt; console.log(</span><span className="text-emerald-400">&apos;3 - micro&apos;</span><span className="text-gray-500">))</span></p>
              <p><span className="text-white">console</span><span className="text-gray-500">.log(</span><span className="text-emerald-400">&apos;4 - sync&apos;</span><span className="text-gray-500">)</span></p>
              <div className="mt-4 pt-3 border-t border-white/5">
                <p className="text-gray-600">// Output:</p>
                <p className="text-emerald-400">1 - sync</p>
                <p className="text-emerald-400">4 - sync</p>
                <p className="text-blue-400">3 - micro    ← Promise runs before timeout!</p>
                <p className="text-orange-400">2 - macro    ← setTimeout runs last</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <p className="text-[10px] font-black uppercase text-emerald-400">Microtasks (High Priority)</p>
              <ul className="space-y-1 text-[11px] text-gray-400">
                <li>• Promise.then / .catch / .finally</li>
                <li>• queueMicrotask()</li>
                <li>• MutationObserver callbacks</li>
                <li>• await in async functions</li>
              </ul>
              <p className="text-[11px] text-emerald-300/70 mt-2">ALL microtasks drain before any macrotask runs. No exceptions.</p>
            </div>
            <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
              <p className="text-[10px] font-black uppercase text-purple-400">Macrotasks (Lower Priority)</p>
              <ul className="space-y-1 text-[11px] text-gray-400">
                <li>• setTimeout / setInterval callbacks</li>
                <li>• I/O callbacks (Node.js)</li>
                <li>• MessageChannel.postMessage</li>
                <li>• DOM event handlers (click, input...)</li>
              </ul>
              <p className="text-[11px] text-purple-300/70 mt-2">One macrotask per event loop tick. Then microtasks drain again.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════ SIMULATOR ════════ */
type Task = { id: string; name: string; type: "sync" | "macro" | "micro" | "render" }

function SimulatorTab() {
  const [stack, setStack] = useState<Task[]>([])
  const [microQueue, setMicroQueue] = useState<Task[]>([])
  const [macroQueue, setMacroQueue] = useState<Task[]>([])
  const [webApis, setWebApis] = useState<Task[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [loopState, setLoopState] = useState<"idle" | "stack" | "micro" | "macro" | "frozen">("idle")
  const [frozen, setFrozen] = useState(false)

  const addLog = (msg: string) => setLogs(p => [msg, ...p].slice(0, 12))

  const pushSync = () => {
    const task: Task = { id: Math.random().toString(36).slice(2), name: "console.log()", type: "sync" }
    setStack(p => [...p, task])
    addLog("→ Pushed sync task to Call Stack")
  }
  const pushMicro = () => {
    const task: Task = { id: Math.random().toString(36).slice(2), name: "Promise.then()", type: "micro" }
    setMicroQueue(p => [...p, task])
    addLog("→ Pushed Promise callback to Microtask Queue")
  }
  const pushMacro = () => {
    const id = Math.random().toString(36).slice(2)
    const task: Task = { id, name: "setTimeout(cb)", type: "macro" }
    setWebApis(p => [...p, { ...task, name: "setTimeout — 1.5s" }])
    addLog("→ Handed setTimeout to Web API (1.5s)")
    setTimeout(() => {
      setWebApis(p => p.filter(t => t.id !== id))
      setMacroQueue(p => [...p, { ...task, name: "cb: timeout" }])
      addLog("✓ Web API done — callback moved to Macrotask Queue")
    }, 1500)
  }
  const freezeMain = () => {
    setFrozen(true); setLoopState("frozen")
    addLog("🚨 while(true){} — Main thread blocked!")
    setTimeout(() => { setFrozen(false); setLoopState("idle"); addLog("✅ Thread unblocked.") }, 4000)
  }
  const flush = () => { setStack([]); setMicroQueue([]); setMacroQueue([]); setWebApis([]); setLogs([]) }

  useEffect(() => {
    if (frozen) return
    const t = setInterval(() => {
      if (stack.length > 0) {
        setLoopState("stack")
        const task = stack[0]
        addLog(`⚙ Executing: ${task.name}`)
        setStack(p => p.slice(1))
      } else if (microQueue.length > 0) {
        setLoopState("micro")
        setStack([microQueue[0]])
        setMicroQueue(p => p.slice(1))
      } else if (macroQueue.length > 0) {
        setLoopState("macro")
        setStack([macroQueue[0]])
        setMacroQueue(p => p.slice(1))
      } else { setLoopState("idle") }
    }, 900)
    return () => clearInterval(t)
  }, [stack, microQueue, macroQueue, frozen])

  const stateColor = { idle: "text-gray-600", stack: "text-blue-400", micro: "text-emerald-400", macro: "text-purple-400", frozen: "text-red-400" }[loopState]
  const stateLabel = { idle: "IDLE", stack: "EXECUTING STACK", micro: "DRAINING MICROTASKS", macro: "RUNNING MACROTASK", frozen: "FROZEN — BLOCKED" }[loopState]

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-[24px] border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", loopState === "frozen" ? "bg-red-500" : loopState === "idle" ? "bg-gray-700" : "bg-emerald-500")} />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Loop State: <span className={stateColor}>{stateLabel}</span></p>
        </div>
        <button onClick={flush} className="text-[10px] text-gray-600 hover:text-white transition-colors font-bold uppercase tracking-widest">Flush All</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="glass p-5 rounded-[24px] border-white/5 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Add Tasks</p>
            <button onClick={pushSync} className="w-full py-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[11px] font-black uppercase hover:bg-blue-600/30 transition-all">+ Sync Task</button>
            <button onClick={pushMicro} className="w-full py-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase hover:bg-emerald-600/30 transition-all">+ Promise (Micro)</button>
            <button onClick={pushMacro} className="w-full py-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 text-[11px] font-black uppercase hover:bg-purple-600/30 transition-all">+ setTimeout (Macro)</button>
            <div className="pt-2 border-t border-white/5">
              <button onClick={freezeMain} disabled={frozen} className="w-full py-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 text-[11px] font-black uppercase hover:bg-red-600/20 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Freeze Thread (4s)
              </button>
            </div>
          </div>
          <div className="glass p-5 rounded-[24px] border-white/5 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-purple-500 flex items-center gap-2"><Terminal className="w-3 h-3" />Console</p>
            <div className="space-y-1 h-44 overflow-y-auto font-mono text-[9px] text-gray-500">
              {logs.map((l, i) => <div key={i} className={cn("py-1 border-b border-white/5 leading-tight", i === 0 && "text-white")}>{l}</div>)}
              {!logs.length && <p className="text-gray-800 italic text-center mt-12">No output yet...</p>}
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-4 relative">
          {frozen && (
            <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm z-50 rounded-[32px] flex flex-col items-center justify-center gap-4 border border-red-500/20">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-red-500 uppercase tracking-tight">Main Thread Frozen</h3>
              <p className="text-sm text-gray-500 text-center max-w-xs">A synchronous loop is blocking all queues. No callbacks can run. UI is completely unresponsive.</p>
            </div>
          )}
          {[
            { title: "Call Stack", desc: "LIFO — top executes", color: "blue", tasks: [...stack].reverse(), icon: <Zap className="w-4 h-4 text-blue-400" /> },
            { title: "Web APIs", desc: "Browser threads", color: "orange", tasks: webApis, icon: <Cpu className="w-4 h-4 text-orange-400" /> },
            { title: "Microtask Queue", desc: "Promise.then, await", color: "emerald", tasks: microQueue, icon: <Box className="w-4 h-4 text-emerald-400" /> },
            { title: "Macrotask Queue", desc: "setTimeout callbacks", color: "purple", tasks: macroQueue, icon: <Clock className="w-4 h-4 text-purple-400" /> },
          ].map(q => (
            <div key={q.title} className={cn("glass p-5 rounded-[24px] border flex flex-col gap-3 min-h-[180px]",
              q.color === "blue" ? "border-blue-500/20" : q.color === "orange" ? "border-orange-500/20" :
              q.color === "emerald" ? "border-emerald-500/20" : "border-purple-500/20"
            )}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">{q.icon}<div><p className="text-[10px] font-black uppercase">{q.title}</p><p className="text-[9px] text-gray-700">{q.desc}</p></div></div>
                <span className="font-mono text-[9px] text-gray-700">{q.tasks.length}</span>
              </div>
              <div className="flex-1 flex flex-col justify-end gap-1.5 overflow-hidden">
                <AnimatePresence>
                  {q.tasks.map((t) => (
                    <motion.div key={t.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 20 }}
                      className={cn("px-3 py-2 rounded-xl text-[10px] font-mono border",
                        t.type === "sync" ? "bg-blue-500/10 border-blue-500/30 text-blue-300" :
                        t.type === "micro" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" :
                        t.type === "render" ? "bg-orange-500/10 border-orange-500/30 text-orange-300" :
                        "bg-purple-500/10 border-purple-500/30 text-purple-300"
                      )}>{t.name}</motion.div>
                  ))}
                </AnimatePresence>
                {q.tasks.length === 0 && <p className="text-[9px] text-gray-800 text-center uppercase font-bold tracking-wider">Empty</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════ EXECUTION ORDER ════════ */
const SCENARIOS = [
  {
    title: "Promises vs setTimeout",
    code: `console.log('A');          // 1. Sync
setTimeout(() => {
  console.log('B');          // 4. Macro (setTimeout)
}, 0);
Promise.resolve().then(() => {
  console.log('C');          // 3. Micro (Promise)
});
console.log('D');            // 2. Sync`,
    output: ["A — sync, runs immediately", "D — sync, runs immediately", "C — microtask, before any macrotask", "B — macrotask, runs last"],
    outputColors: ["text-white", "text-white", "text-emerald-400", "text-purple-400"],
    explanation: "Even with setTimeout(fn, 0), the Promise callback runs first. The '0ms' means 'add to macrotask queue as soon as possible' — but microtasks always run before the next macrotask."
  },
  {
    title: "Nested Promises (Microtask Chaining)",
    code: `Promise.resolve()
  .then(() => {
    console.log('A');        // Micro 1
    return Promise.resolve()
  })
  .then(() => console.log('B'))  // Micro 2

Promise.resolve()
  .then(() => console.log('C'))  // Micro 3
  .then(() => console.log('D'))  // Micro 4`,
    output: ["A — first .then() of chain 1", "C — first .then() of chain 2", "B — second .then() of chain 1", "D — second .then() of chain 2"],
    outputColors: ["text-emerald-400", "text-emerald-400", "text-blue-400", "text-blue-400"],
    explanation: "Microtasks interleave! When chain 1's .then() runs and returns a Promise, chain 2's microtasks get to run before chain 1's next .then(). This is often surprising."
  },
  {
    title: "async/await Under the Hood",
    code: `async function foo() {
  console.log('A');           // Sync inside async fn
  await Promise.resolve();    // Suspends foo()
  console.log('B');           // Resumes as microtask
}

foo();                        // Call foo
console.log('C');             // Continues sync execution`,
    output: ["A — sync, foo() starts executing", "C — sync, outer code runs after await suspends foo", "B — microtask, foo() resumes after C"],
    outputColors: ["text-white", "text-white", "text-emerald-400"],
    explanation: "async/await is syntactic sugar for Promises. The 'await' suspends the function and the code after the await runs as a microtask when the awaited value resolves. Outer sync code runs first."
  },
  {
    title: "UI Rendering Between Macrotasks",
    code: `// Heavy sync loop — blocks UI for 2 seconds!
for (let i = 0; i < 1_000_000_000; i++) {}
console.log('Sync done'); // Renders AFTER this

// Split with setTimeout — UI can breathe:
setTimeout(() => processChunk(1), 0);
setTimeout(() => processChunk(2), 0);
// Browser can render between each setTimeout!`,
    output: ["Sync loop completes (UI frozen for 2s)", "Browser renders the frame", "processChunk(1) runs", "Browser renders frame again", "processChunk(2) runs"],
    outputColors: ["text-red-400", "text-orange-400", "text-emerald-400", "text-orange-400", "text-emerald-400"],
    explanation: "The browser only renders after the call stack is empty and before the next macrotask. Heavy sync code prevents rendering. Splitting work with setTimeout(fn, 0) yields control back to the browser between chunks."
  },
]

function OrderTab() {
  const [scenario, setScenario] = useState(0)
  const s = SCENARIOS[scenario]
  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {SCENARIOS.map((sc, i) => (
          <button key={i} onClick={() => setScenario(i)} className={cn(
            "px-4 py-2 rounded-full text-[11px] font-bold border transition-all",
            i === scenario ? "bg-purple-600 border-purple-400 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
          )}>{sc.title}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={scenario} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Code</p>
            <pre className="bg-black/60 border border-white/5 rounded-2xl p-5 text-xs font-mono text-gray-300 leading-7 whitespace-pre-wrap">{s.code}</pre>
          </div>
          <div className="space-y-4">
            <div className="glass p-6 rounded-[32px] border-white/5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Output Order</p>
              <div className="space-y-2">
                {s.output.map((o, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{i + 1}</div>
                    <p className={cn("text-sm font-mono", s.outputColors[i])}>{o}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass p-6 rounded-[24px] border-purple-500/10 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-500">Why?</p>
              <p className="text-sm text-gray-400 leading-relaxed">{s.explanation}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ════════ PITFALLS ════════ */
const PITFALLS = [
  {
    id: "blocking", color: "red", severity: "CRITICAL",
    title: "Blocking the Main Thread",
    summary: "Any synchronous code that takes a long time (heavy loops, sync file I/O) freezes the UI completely — the event loop cannot process any callbacks or render frames.",
    bad: `// ❌ Never do this on the main thread:
for (let i = 0; i < 5_000_000_000; i++) {
  // CPU spinning — UI completely frozen
  // No events, no renders, no callbacks
}`,
    good: `// ✅ Use Web Workers for heavy computation:
const worker = new Worker('heavy.js');
worker.postMessage({ data: bigArray });
worker.onmessage = (e) => console.log(e.data);

// Or break work into chunks with setTimeout:
function processChunk(items) {
  const chunk = items.splice(0, 100);
  chunk.forEach(processItem);
  if (items.length) setTimeout(() => processChunk(items), 0);
}`,
  },
  {
    id: "microtask-storm", color: "orange", severity: "HIGH",
    title: "Microtask Queue Starvation",
    summary: "Continuously adding microtasks prevents macrotasks from ever running. The event loop drains ALL microtasks before touching the macrotask queue.",
    bad: `// ❌ Infinite microtask loop:
function scheduleForever() {
  Promise.resolve().then(scheduleForever);
}
scheduleForever();
// setTimeout callbacks NEVER run
// Browser rendering NEVER happens`,
    good: `// ✅ Use macrotasks to yield control:
function scheduleInChunks() {
  setTimeout(() => {
    doSomeWork();
    scheduleInChunks(); // yields to browser
  }, 0);
}
// Or use requestAnimationFrame for render-tied work`,
  },
  {
    id: "promise-mistake", color: "orange", severity: "HIGH",
    title: "Forgetting to Return Promises",
    summary: "Forgetting to return a Promise in a .then() chain breaks chain propagation — the next .then() runs with undefined instead of waiting for the async result.",
    bad: `// ❌ Missing return — chain broken:
fetchUser()
  .then(user => {
    fetchPosts(user.id)  // ← not returned!
    // Returns undefined, next .then runs immediately
  })
  .then(posts => {
    console.log(posts) // undefined!
  })`,
    good: `// ✅ Return the Promise to chain properly:
fetchUser()
  .then(user => {
    return fetchPosts(user.id) // ← returned!
  })
  .then(posts => {
    console.log(posts) // actual posts ✓
  })
// Or use async/await for cleaner flow`,
  },
  {
    id: "unhandled-rejection", color: "yellow", severity: "MEDIUM",
    title: "Unhandled Promise Rejections",
    summary: "Rejected Promises without .catch() or try/catch swallow errors silently in older environments and crash Node.js processes in newer ones.",
    bad: `// ❌ No error handling:
fetch('https://api.example.com/data')
  .then(r => r.json())
  .then(data => processData(data))
  // No .catch() — network errors vanish!

async function load() {
  const data = await fetch('/api'); // throws!
  // Exception propagates up as unhandled rejection
}
load(); // ← not awaited, rejection not caught`,
    good: `// ✅ Always handle rejections:
fetch('/api/data')
  .then(r => r.json())
  .catch(err => console.error('Fetch failed:', err));

async function load() {
  try {
    const res = await fetch('/api');
    return await res.json();
  } catch (err) {
    console.error('Load failed:', err);
  }
}`,
  },
]

function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("blocking")
  const badge = (s: string) => s === "CRITICAL" ? "bg-red-500/20 text-red-400 border-red-500/30" : s === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  const border = (c: string) => c === "red" ? "border-red-500/20 hover:border-red-500/40" : c === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-yellow-500/20 hover:border-yellow-500/40"

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-6">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">The event loop is powerful but unforgiving. These are the most common mistakes developers make when working with async JavaScript.</p>
      </div>
      {PITFALLS.map(p => (
        <motion.div key={p.id} layout className={cn("glass rounded-[24px] border overflow-hidden transition-colors", border(p.color))}>
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0", badge(p.severity))}>{p.severity}</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold mb-1">{p.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p>
            </div>
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Solution</p>
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
