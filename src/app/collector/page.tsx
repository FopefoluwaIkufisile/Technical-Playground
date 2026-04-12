"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trash2, Plus, RefreshCw, Info, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "simulator" | "patterns" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "🗑️ GC Simulator" },
  { id: "patterns", label: "Strategies" },
  { id: "pitfalls", label: "Pitfalls" },
]

interface MemNode { id: string; size: number; reachable: boolean; marked: boolean; gen: "young" | "old"; type: "object" | "array" | "closure" }

export default function CollectorPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-purple-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <RefreshCw className="w-3 h-3" /> Garbage Collection
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-purple-400 bg-clip-text text-transparent">Garbage Collector</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">How runtimes automatically reclaim unused memory — mark-and-sweep, generational collection, reference counting, and the traps that cause memory leaks despite a GC.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
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

function ConceptsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20"><Trash2 className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">What is Garbage Collection?</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Garbage Collection (GC) automatically identifies and reclaims <strong className="text-white">heap memory that is no longer reachable</strong> from the program&apos;s root set. Without GC, developers must manually free memory — forgetting to do so causes memory leaks; freeing too early causes use-after-free bugs.
          </p>
          <div className="bg-black/40 p-5 rounded-2xl border border-purple-500/10 font-mono text-xs leading-7">
            <p className="text-purple-400">{`// The reachability definition of "garbage":`}</p>
            <p className="text-gray-500">Root Set = {`{`}</p>
            <p className="pl-4 text-gray-500">global variables,</p>
            <p className="pl-4 text-gray-500">local variables (on stack),</p>
            <p className="pl-4 text-gray-500">CPU registers,</p>
            <p className="pl-4 text-gray-500">closures in scope</p>
            <p className="text-gray-500">{`}`}</p>
            <p className="mt-2 text-gray-700">{"// Object is LIVE if reachable from Root Set (directly or transitively)"}</p>
            <p className="text-gray-700">{"// Object is GARBAGE if NOT reachable — can be safely collected"}</p>
            <p className="mt-2 text-gray-600">{"// Example:"}</p>
            <p>let obj1 = {`{}`}  <span className="text-gray-700">{"// reachable via 'obj1' reference"}</span></p>
            <p>obj1 = null    <span className="text-gray-700">{"// reference dropped → obj1 becomes garbage"}</span></p>
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">How Reference Counting Works</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Every object tracks how many references point to it. When the count reaches zero, memory is immediately freed. Used by Python, Swift, Rust (Rc), C++ (shared_ptr). Fatal weakness: <strong className="text-white">circular references</strong>.</p>
          <div className="bg-black/40 p-5 rounded-2xl border border-purple-500/10 font-mono text-xs leading-7">
            <p className="text-purple-400">{"// Python CPython uses reference counting:"}</p>
            <p>a = [1, 2, 3]   <span className="text-gray-700">{"// refcount([1,2,3]) = 1"}</span></p>
            <p>b = a           <span className="text-gray-700">{"// refcount([1,2,3]) = 2"}</span></p>
            <p>del a           <span className="text-gray-700">{"// refcount([1,2,3]) = 1"}</span></p>
            <p>del b           <span className="text-gray-700">{"// refcount([1,2,3]) = 0 → freed!"}</span></p>
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-red-400">{"// FATAL: Circular reference — never freed!"}</p>
              <p>a = {`{}`}; b = {`{}`}</p>
              <p>a.ref = b  <span className="text-gray-700">{"// refcount(b) = 2"}</span></p>
              <p>b.ref = a  <span className="text-gray-700">{"// refcount(a) = 2"}</span></p>
              <p>del a; del b  <span className="text-gray-700">{"// refcount(a)=1, refcount(b)=1"}</span></p>
              <p className="text-gray-700">{"// Neither reaches 0! Both objects leak!"}</p>
              <p className="text-gray-700">{"// Python's cycle detector runs periodically to fix this"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Mark-and-Sweep — The Foundation of Most GCs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { phase: "Mark", icon: "🔍", desc: "Start from root set. Traverse all reachable objects, marking each as 'live'. This is a graph traversal (DFS or BFS) following all references.", color: "blue", detail: "Tri-color marking (white=unseen, gray=seen, black=fully traced) allows concurrent marking without stopping the world completely." },
            { phase: "Sweep", icon: "🧹", desc: "Scan the entire heap. Any object NOT marked as live is garbage and its memory is returned to the free list for reuse.", color: "purple", detail: "Simple but causes fragmentation — live objects may be scattered with gaps between them. Compaction addresses this." },
            { phase: "Compact", icon: "📦", desc: "Move surviving objects together, eliminating fragmentation. Updates all references to relocated objects. Expensive but essential for long-running programs.", color: "emerald", detail: "JVM G1GC, Go, .NET compact differently. JavaScript V8 uses Scavenge for young gen (semi-space copy) instead of compacting." },
          ].map(p => (
            <div key={p.phase} className={cn("p-5 rounded-2xl border space-y-3",
              p.color === "blue" ? "bg-blue-500/5 border-blue-500/20" : p.color === "purple" ? "bg-purple-500/5 border-purple-500/20" : "bg-emerald-500/5 border-emerald-500/20"
            )}>
              <div className="flex items-center gap-2"><span className="text-2xl">{p.icon}</span><p className={cn("font-black text-sm", p.color === "blue" ? "text-blue-400" : p.color === "purple" ? "text-purple-400" : "text-emerald-400")}>{p.phase}</p></div>
              <p className="text-[12px] text-gray-400 leading-relaxed">{p.desc}</p>
              <p className="text-[10px] text-gray-600 leading-relaxed italic">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [heap, setHeap] = useState<MemNode[]>([])
  const [gcPhase, setGcPhase] = useState<"idle" | "marking" | "sweeping" | "compacting">("idle")
  const [isGC, setIsGC] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [gcCount, setGcCount] = useState(0)
  const addLog = useCallback((msg: string) => setLogs(p => [`[GC] ${msg}`, ...p].slice(0, 8)), [])

  const allocate = useCallback(() => {
    if (heap.length >= 48) { addLog("OOM: Heap full! Triggering emergency GC."); return }
    const types: MemNode["type"][] = ["object", "array", "closure"]
    const id = Math.random().toString(36).slice(2, 5).toUpperCase()
    const node: MemNode = { id, size: Math.floor(Math.random() * 4) + 1, reachable: Math.random() > 0.35, marked: false, gen: "young", type: types[Math.floor(Math.random() * 3)] }
    setHeap(p => [...p, node])
    addLog(`Alloc ${node.type} 0x${id} (${node.reachable ? "reachable" : "orphaned"})`)
  }, [heap.length, addLog])

  const runGC = async () => {
    if (isGC) return
    setIsGC(true); setGcCount(p => p + 1)
    setGcPhase("marking"); addLog("MARK: Tracing from root set...")
    await new Promise(r => setTimeout(r, 1200))
    setHeap(p => p.map(n => ({ ...n, marked: n.reachable })))
    setGcPhase("sweeping"); addLog("SWEEP: Freeing unreachable objects...")
    await new Promise(r => setTimeout(r, 1200))
    setHeap(p => p.filter(n => n.marked).map(n => ({ ...n, marked: false, gen: "old" as const })))
    setGcPhase("compacting"); addLog("COMPACT: Defragmenting heap...")
    await new Promise(r => setTimeout(r, 900))
    setGcPhase("idle"); setIsGC(false)
    addLog("GC cycle complete ✓")
  }

  const typeColor = { object: "bg-purple-500", array: "bg-blue-500", closure: "bg-emerald-500" }
  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-[24px] border-white/5 flex gap-3">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Allocate objects — some are reachable (live), some are orphaned (garbage). Run GC to watch the mark-and-sweep-compact cycle. Old generation (survived GC) objects are promoted.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <button onClick={allocate} disabled={isGC} className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Allocate Object
          </button>
          <button onClick={runGC} disabled={isGC} className="w-full py-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-black text-[11px] transition-all active:scale-95 flex items-center justify-center gap-2">
            <RefreshCw className={cn("w-3.5 h-3.5", isGC && "animate-spin")} /> {isGC ? gcPhase.toUpperCase() + "..." : "Force Major GC"}
          </button>
          <button onClick={() => setHeap([])} className="w-full py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] text-gray-600 hover:text-white transition-colors">Clear Heap</button>

          <div className="glass p-4 rounded-2xl border-white/5 space-y-3">
            <p className="text-[9px] uppercase font-black text-gray-600">GC Pipeline</p>
            {(["marking", "sweeping", "compacting"] as const).map((ph, i) => (
              <div key={ph} className={cn("px-3 py-2 rounded-xl border flex justify-between items-center transition-all", gcPhase === ph ? "bg-purple-500/10 border-purple-500/40 text-purple-400" : "bg-white/3 border-white/5 text-gray-800")}>
                <span className="text-[10px] font-black uppercase">{i+1}. {ph}</span>
                {gcPhase === ph && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
              </div>
            ))}
          </div>
          <div className="glass p-4 rounded-xl border-white/5 space-y-2">
            <p className="text-[9px] uppercase font-black text-gray-600 flex items-center gap-1">GC Log</p>
            <div className="h-40 overflow-y-auto font-mono text-[9px] space-y-1">
              {logs.map((l, i) => <div key={i} className="text-gray-600 truncate">{l}</div>)}
              {!logs.length && <p className="text-gray-800 italic text-center mt-12">Heap empty</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="glass p-6 rounded-[32px] border-white/5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Live Heap ({heap.length}/48 objects)</p>
                <div className={cn("text-sm font-black mt-0.5", gcPhase === "idle" ? "text-gray-600" : "text-purple-400 animate-pulse")}>{gcPhase === "idle" ? "Idle" : gcPhase.charAt(0).toUpperCase() + gcPhase.slice(1) + " Phase"}</div>
              </div>
              <div className="flex gap-4 text-center">
                <div><p className="text-[8px] text-gray-600 uppercase font-black">Objects</p><p className="text-2xl font-black text-purple-400">{heap.length}</p></div>
                <div><p className="text-[8px] text-gray-600 uppercase font-black">GC Runs</p><p className="text-2xl font-black text-indigo-400">{gcCount}</p></div>
              </div>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              <AnimatePresence>
                {heap.map(node => (
                  <motion.div key={node.id} initial={{ scale: 0, rotate: -10 }} animate={{
                    scale: 1, rotate: 0,
                    backgroundColor: node.marked && gcPhase === "marking" ? "#a855f740" : node.gen === "old" ? "#6366f115" : "rgba(255,255,255,0.03)",
                    borderColor: node.marked && gcPhase === "marking" ? "#a855f7" : node.gen === "old" ? "#6366f150" : "rgba(255,255,255,0.05)"
                  }} exit={{ scale: 0, opacity: 0, filter: "blur(8px)" }}
                    className="h-14 rounded-xl border relative flex items-center justify-center group">
                    <div className={cn("w-3 h-3 rounded-full", typeColor[node.type], node.reachable ? "opacity-70" : "opacity-20")} />
                    <span className="absolute text-[6px] font-mono text-gray-800 bottom-1">{node.id}</span>
                    <div className="absolute opacity-0 group-hover:opacity-100 -top-8 bg-black border border-white/10 px-2 py-1 rounded text-[7px] font-mono z-10 whitespace-nowrap pointer-events-none">
                      {node.type} · {node.gen} · {node.reachable ? "✓live" : "✗dead"}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!heap.length && <div className="col-span-8 py-16 text-center text-gray-800 italic text-sm font-black">Heap empty</div>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Young Gen", color: "purple", count: heap.filter(n => n.gen === "young").length },
              { label: "Old Gen", color: "indigo", count: heap.filter(n => n.gen === "old").length },
              { label: "Unreachable", color: "red", count: heap.filter(n => !n.reachable).length },
            ].map(s => (
              <div key={s.label} className={cn("glass p-4 rounded-2xl border text-center",
                s.color === "purple" ? "border-purple-500/20 bg-purple-500/5" : s.color === "indigo" ? "border-indigo-500/20 bg-indigo-500/5" : "border-red-500/20 bg-red-500/5"
              )}>
                <p className={cn("text-[9px] uppercase font-black", s.color === "purple" ? "text-purple-400" : s.color === "indigo" ? "text-indigo-400" : "text-red-400")}>{s.label}</p>
                <p className={cn("text-2xl font-black font-mono", s.color === "purple" ? "text-purple-400" : s.color === "indigo" ? "text-indigo-400" : "text-red-400")}>{s.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PatternsTab() {
  const [active, setActive] = useState("generational")
  const strats = [
    { id: "generational", name: "Generational GC", color: "purple",
      desc: "The Generational Hypothesis: most objects die young. By dividing the heap into young and old generations, GC can collect short-lived objects frequently (cheap) and rarely touch long-lived objects (expensive).",
      code: `// V8 JavaScript Engine (Node.js / Chrome) Memory Layout:

// Young Generation (~16MB by default)
// ┌─ Semi-space A (nursery) ─┐┌─ Semi-space B ─┐
// │ New allocations go here  ││ Scavenge target │
// └──────────────────────────┘└─────────────────┘
// When A fills: Scavenge = copy live objects from A→B
// Objects that survive 2 scavenges → promoted to Old Gen

// Old Generation (~1.4GB by default)
// Objects that "graduated" from Young Gen
// Major GC (Mark-Compact) runs infrequently here
// Much more expensive: large heap, more live objects

// Why this works:
// >90% of objects in A die before first Scavenge
// Scavenge only processes live objects → fast!
// Major GC rarely needed → long pauses are rare

// Performance insight:
// Object lifespan bimodal: very short (<1 GC) or very long
// Create objects in hot paths: likely short-lived → fine
// Closures in module scope: old gen → careful with size`,
      insight: "V8's Young Gen Scavenge is a 'stop-the-world' pause of ~1ms. Old Gen Mark-Compact can pause 10-100ms. This is why React, Vue, etc. try to minimize heap allocation in render functions — fewer objects → fewer GC pauses.",
    },
    { id: "concurrent", name: "Concurrent & Incremental GC", color: "blue",
      desc: "Stop-the-world GC pauses are unacceptable for interactive applications. Modern GCs use concurrent and incremental marking to do most GC work while the program continues running.",
      code: `// Tri-Color Marking (enables incremental GC):
// White: not yet visited
// Gray:  discovered but children not yet traced  
// Black: fully traced (live)

// Invariant: no black object may point to white object
// This allows the GC to pause/resume safely

// V8 Orinoco GC (concurrent marking):
// Main thread: continues running JS code
// GC thread:   marks concurrently in background
// Write barrier: if JS creates reference during marking,
//               barrier ensures new reference is not missed:
//   object.field = new_value → GC.gray(new_value)

// Go's GC (tricolor, concurrent):
// 1. STW: enable write barriers, scan goroutine stacks
// 2. Concurrent mark: all goroutines + GC goroutines
// 3. Mark termination: STW, re-scan changed stacks  
// 4. Concurrent sweep: reclaim white objects
// GC pause: <1ms in modern Go (1.14+)
// GOGC=100: trigger GC when heap doubles (default)`,
      insight: "The biggest GC engineering challenge is the write barrier. When the mutator (your code) changes references during concurrent marking, the GC must be notified to avoid collecting live objects prematurely. Write barriers add overhead to every pointer write.",
    },
  ]
  const p = strats.find(s => s.id === active)!
  const cMap: Record<string, string> = { purple: "text-purple-400 bg-purple-500/5 border-purple-500/20", blue: "text-blue-400 bg-blue-500/5 border-blue-500/20" }
  const c = cMap[p.color]
  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">{strats.map(s => (<button key={s.id} onClick={() => setActive(s.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold border transition-all", active === s.id ? cMap[s.color] : "bg-white/5 border-white/10 text-gray-500 hover:text-white")}>{s.name}</button>))}</div>
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
  const [expanded, setExpanded] = useState<string | null>("eventlistener")
  const pitfalls = [
    { id: "eventlistener", severity: "HIGH", color: "orange", title: "Forgotten Event Listeners — The Classic Leak",
      summary: "Event listeners hold references to their closures. If you add a listener to a long-lived DOM element and never remove it, both the listener function and everything it closes over stay in memory forever.",
      bad: `// ❌ Leak: listener added but never removed
class Dashboard {
  constructor() {
    this.data = new Float64Array(10_000_000); // ~80MB
    this.handleResize = () => {
      // Closes over 'this' → closes over this.data!
      console.log(window.innerWidth);  
    };
    window.addEventListener('resize', this.handleResize);
  }
}

// Every new Dashboard() adds another listener
// Even when dashboard object is "discarded"
// window holds reference to listener 
// listener closes over 'this' (Dashboard instance)
// Dashboard.data never collected = 80MB leak per instance!`,
      good: `// ✅ Always clean up listeners in destructors/useEffect:

// Vanilla JS:
class Dashboard {
  constructor() {
    this.data = new Float64Array(10_000_000);
    this.handleResize = () => console.log(window.innerWidth);
    window.addEventListener('resize', this.handleResize);
  }
  destroy() {
    window.removeEventListener('resize', this.handleResize); // ←!
    this.data = null; // allow GC
  }
}

// React (useEffect cleanup):
useEffect(() => {
  const handler = () => doSomething();
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler); // ←!
}, []);`,
    },
    { id: "closure-leak", severity: "HIGH", color: "orange", title: "Closures Retaining Large Objects",
      summary: "A closure captures variables from its outer scope. If a small frequently-invoked closure accidentally captures a large object, that object lives as long as the closure — even if you only use a tiny field.",
      bad: `// ❌ Closure captures entire huge object:
function processReport(report) {
  const hugeData = loadAllHistoricalData(); // 500MB object
  
  const timer = setInterval(() => {
    // timer callback closes over 'hugeData' entire object!
    updateStatus(hugeData.lastModified); // only using 1 field
  }, 1000);
  
  // hugeData = 500MB stays in memory for timer's lifetime!
}`,
      good: `// ✅ Extract only what you need before closing:
function processReport(report) {
  const hugeData = loadAllHistoricalData();
  const lastModified = hugeData.lastModified; // extract the field
  hugeData = null; // ← allow the rest to be collected!
  
  const timer = setInterval(() => {
    updateStatus(lastModified); // now closes over only a Date
  }, 1000);
  
  // Only the small field persists, not 500MB
}

// WeakRef for optional retention:
const weakRef = new WeakRef(largeObject);
largeObject = null;
// Later: const obj = weakRef.deref(); // may be undefined`,
    },
  ]
  const badge = (severity: string) => severity === "critical" ? "bg-red-500/20 text-red-400 border-red-500/30" : severity === "high" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">GC myths: a GC runtime doesn&apos;t prevent memory leaks — it prevents <em>dangling pointer</em> bugs. You can still leak memory by holding unnecessary references. The tools: Chrome DevTools heap snapshots, Node.js <code>--expose-gc</code>, and <code>WeakRef</code>.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className="glass rounded-[24px] border border-orange-500/20 hover:border-orange-500/40 overflow-hidden transition-colors">
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0", badge(p.severity))}>{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Leak</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
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
