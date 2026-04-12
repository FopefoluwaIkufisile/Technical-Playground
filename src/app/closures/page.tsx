"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Box, Plus, Minus, Layers, Zap, Database, Trash2,
  GitFork, Key, Eye, EyeOff, ChevronRight, Info, CheckCircle2,
  Code2, Lock, AlertTriangle, BookOpen
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "demo" | "patterns" | "pitfalls"

const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "demo", label: "🫧 Live Demo" },
  { id: "patterns", label: "Patterns" },
  { id: "pitfalls", label: "Pitfalls" },
]

export default function ClosuresPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-orange-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Layers className="w-3 h-3" /> Closures · JavaScript
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-orange-400 bg-clip-text text-transparent">
            Closures
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            How JavaScript functions remember the environment they were created in — lexical scope, the closure mechanism, private state, and the module pattern that powers modern JS.
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
            {tab === "demo" && <DemoTab />}
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
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20"><GitFork className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">What is a Closure?</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A <strong className="text-white">closure</strong> is a function that retains access to variables from its <span className="text-orange-400 font-semibold">outer (lexical) scope</span> even after the outer function has finished executing. The inner function &quot;closes over&quot; those variables — they&apos;re kept alive in memory as long as the inner function exists.
          </p>
          <div className="bg-black/40 p-5 rounded-2xl border border-orange-500/10 font-mono text-xs leading-7">
            <p className="text-gray-600">// makeCounter returns a function, not a value</p>
            <p className="text-orange-400">function makeCounter() {"{"}</p>
            <p className="pl-4 text-violet-300">let count = 0;  <span className="text-gray-600">// local variable in outer scope</span></p>
            <p className="pl-4 text-orange-400">return function() {"{"}</p>
            <p className="pl-8 text-white">count++;  <span className="text-gray-600">// accesses outer 'count'</span></p>
            <p className="pl-8 text-white">return count;</p>
            <p className="pl-4 text-orange-400">{"}"};</p>
            <p className="text-orange-400">{"}"}</p>
            <div className="mt-3 pt-3 border-t border-white/5">
              <p><span className="text-blue-400">const</span> counter = makeCounter();</p>
              <p className="text-gray-600">// makeCounter() has FINISHED. 'count' should be gone...</p>
              <p><span className="text-blue-400">console</span>.log(counter()); <span className="text-gray-600">// 1 — count is remembered!</span></p>
              <p><span className="text-blue-400">console</span>.log(counter()); <span className="text-gray-600">// 2</span></p>
              <p><span className="text-blue-400">console</span>.log(counter()); <span className="text-gray-600">// 3 — persists!</span></p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15">
            <p className="text-[12px] text-orange-300/80 leading-relaxed">The variable <code>count</code> lives inside the closure&apos;s scope record. It&apos;s not accessible from outside, but the returned function holds a reference to it — preventing garbage collection.</p>
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Lexical Scope — The Foundation</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            JavaScript uses <strong className="text-white">lexical (static) scope</strong>: a function&apos;s scope is determined by where it&apos;s <em>written</em> in the source code, not where it&apos;s called from. This is what makes closures predictable.
          </p>
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5 font-mono text-xs leading-7">
            <p className="text-gray-600">// Scope chains: inner → outer → global</p>
            <p className="text-white">const x = <span className="text-emerald-400">&apos;global&apos;</span>;</p>
            <p className="text-orange-400">function outer() {"{"}</p>
            <p className="pl-4 text-white">const x = <span className="text-blue-400">&apos;outer&apos;</span>;</p>
            <p className="pl-4 text-orange-400">function inner() {"{"}</p>
            <p className="pl-8 text-white">const x = <span className="text-violet-400">&apos;inner&apos;</span>;</p>
            <p className="pl-8 text-gray-500">console.log(x); <span className="text-gray-600">// 'inner' — nearest scope wins</span></p>
            <p className="pl-4 text-orange-400">{"}"}</p>
            <p className="pl-4 text-white">inner();</p>
            <p className="text-orange-400">{"}"}</p>
          </div>
          <div className="space-y-3">
            {[
              { name: "Scope Chain", desc: "When a variable is referenced, JS looks in the current scope, then the enclosing scope, then its enclosing scope, all the way up to global.", color: "orange" },
              { name: "Lexical Binding", desc: "The scope is determined at write-time (where the function is defined), not at call-time. This makes scope analysis possible without running the code.", color: "blue" },
              { name: "Environment Record", desc: "Each function scope has an Environment Record — a map of variable names to values. Closures hold a reference to the outer function's Environment Record.", color: "violet" },
            ].map(item => (
              <div key={item.name} className={cn("p-4 rounded-2xl border",
                item.color === "orange" ? "bg-orange-500/5 border-orange-500/20" :
                item.color === "blue" ? "bg-blue-500/5 border-blue-500/20" :
                "bg-violet-500/5 border-violet-500/20"
              )}>
                <p className={cn("text-[11px] font-black mb-1", item.color === "orange" ? "text-orange-400" : item.color === "blue" ? "text-blue-400" : "text-violet-400")}>{item.name}</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Two Environments: Each Instance is Independent</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5 font-mono text-xs leading-7">
            <p className="text-gray-600">// Each call to makeCounter() creates a NEW scope</p>
            <p><span className="text-orange-400">const</span> counter1 = makeCounter(); <span className="text-gray-600">// scope A: count=0</span></p>
            <p><span className="text-orange-400">const</span> counter2 = makeCounter(); <span className="text-gray-600">// scope B: count=0</span></p>
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-blue-400">counter1(); <span className="text-gray-600">// A: count=1</span></p>
              <p className="text-blue-400">counter1(); <span className="text-gray-600">// A: count=2</span></p>
              <p className="text-emerald-400">counter2(); <span className="text-gray-600">// B: count=1 — INDEPENDENT!</span></p>
              <p className="text-blue-400">counter1(); <span className="text-gray-600">// A: count=3 — unaffected by counter2</span></p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-400 leading-relaxed">Each call to <code className="text-orange-400">makeCounter()</code> creates a fresh execution context with its own <strong className="text-white">independent Environment Record</strong>. The two closures share the same code but have separate closed-over variable bindings.</p>
            <p className="text-sm text-gray-400 leading-relaxed">This is the foundation of <strong className="text-white">object-oriented programming via closures</strong> — each &quot;instance&quot; has its own private state, just like a class instance would.</p>
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-[12px] text-emerald-300/80">Memory implication: both closures are kept alive in memory (scope records are not GC&apos;d) as long as counter1 and counter2 exist.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════ DEMO ════════ */
type ClosureInstance = { id: string; count: number; secretKey: string; color: string; createdAt: string }

function DemoTab() {
  const [instances, setInstances] = useState<ClosureInstance[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)

  const COLORS = ["orange", "blue", "violet", "emerald", "rose", "cyan"]
  const create = () => {
    const color = COLORS[instances.length % COLORS.length]
    const id = Math.random().toString(36).slice(2, 6).toUpperCase()
    const inst: ClosureInstance = { id, count: 0, secretKey: Math.random().toString(36).slice(2, 10), color, createdAt: new Date().toLocaleTimeString() }
    setInstances(p => [inst, ...p])
    setSelectedId(inst.id)
  }
  const updateCount = (id: string, delta: number) => setInstances(p => p.map(i => i.id === id ? { ...i, count: i.count + delta } : i))
  const remove = (id: string) => { setInstances(p => p.filter(i => i.id !== id)); if (selectedId === id) setSelectedId(null) }
  const selected = instances.find(i => i.id === selectedId)
  const colorClass = (c: string, type: "bg" | "border" | "text") => ({
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400" },
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
  }[c]?.[type] ?? "bg-white/5")

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-[24px] border-white/5 flex gap-3 items-start">
        <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Each bubble below represents an independent closure instance — its own <strong className="text-white">lexical environment</strong> with private <code className="text-orange-400">count</code> and <code className="text-orange-400">secretKey</code>. Increment/decrement one without affecting others. This is exactly how the factory function pattern works.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Instance list */}
        <div className="space-y-3">
          <button onClick={create} className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> New Closure Scope
          </button>
          <div className="space-y-2">
            {instances.map(inst => (
              <button key={inst.id} onClick={() => setSelectedId(inst.id)}
                className={cn("w-full p-3 rounded-xl border flex items-center justify-between transition-all",
                  selectedId === inst.id ? `${colorClass(inst.color, "bg")} ${colorClass(inst.color, "border")}` : "bg-white/3 border-white/5 hover:border-white/10"
                )}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", colorClass(inst.color, "bg").replace("bg-", "bg-").replace("/10", ""))} style={{ backgroundColor: { orange: "#f97316", blue: "#3b82f6", violet: "#8b5cf6", emerald: "#10b981", rose: "#f43f5e", cyan: "#06b6d4" }[inst.color] }} />
                  <div className="text-left">
                    <p className="text-[10px] font-black font-mono">ENV_{inst.id}</p>
                    <p className="text-[9px] text-gray-700">{inst.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-black font-mono", colorClass(inst.color, "text"))}>{inst.count}</span>
                  <Trash2 className="w-3 h-3 text-gray-700 hover:text-red-400 transition-colors" onClick={e => { e.stopPropagation(); remove(inst.id) }} />
                </div>
              </button>
            ))}
            {!instances.length && <div className="p-6 border border-dashed border-white/5 rounded-xl text-center text-[10px] text-gray-800 italic font-bold">No active closures</div>}
          </div>
          <div className="glass p-4 rounded-xl border-white/5 text-[10px] text-gray-600 leading-relaxed">
            Created: <span className="text-orange-400 font-bold">{instances.length}</span> independent scopes<br />
            Total variables tracked: <span className="text-orange-400 font-bold">{instances.length * 2}</span>
          </div>
        </div>

        {/* Scope inspector */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="glass p-8 rounded-[32px] border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", colorClass(selected.color, "text"))}>Closure Scope ENV_{selected.id}</p>
                    <h3 className="text-2xl font-black font-mono">makeCounter() Instance</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-600 uppercase font-black">Current Count</p>
                    <motion.p key={selected.count} initial={{ scale: 0.7 }} animate={{ scale: 1 }} className={cn("text-5xl font-black font-mono", colorClass(selected.color, "text"))}>{selected.count}</motion.p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Private Scope Variables</p>
                    <div className={cn("p-4 rounded-2xl border space-y-2 font-mono text-xs", colorClass(selected.color, "bg"), colorClass(selected.color, "border"))}>
                      <div className="flex justify-between">
                        <span className="text-gray-500">let count</span>
                        <motion.span key={selected.count} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={colorClass(selected.color, "text")}>{selected.count}</motion.span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">const secretKey</span>
                        <button onClick={() => setShowSecret(!showSecret)} className="flex items-center gap-1 text-gray-600 hover:text-white transition-colors text-[10px]">
                          {showSecret ? selected.secretKey : "••••••••"} {showSecret ? <Eye className="w-3 h-3 ml-1" /> : <EyeOff className="w-3 h-3 ml-1" />}
                        </button>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/15 text-[11px] text-red-300/70">
                      <p className="font-black text-red-400 mb-1 text-[10px] uppercase">External Access Attempt:</p>
                      <code>scope.count // undefined ❌</code><br />
                      <code>scope.secretKey // undefined ❌</code><br />
                      <span className="text-gray-600">// Can ONLY be accessed via the returned functions</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Exposed Methods (Closure Functions)</p>
                    <div className="space-y-2">
                      <button onClick={() => updateCount(selected.id, 1)} className={cn("w-full py-4 rounded-xl font-black transition-all active:scale-95 border", colorClass(selected.color, "bg"), colorClass(selected.color, "border"), colorClass(selected.color, "text"))}>
                        increment() → count = {selected.count + 1}
                      </button>
                      <button onClick={() => updateCount(selected.id, -1)} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 font-black transition-all active:scale-95 text-gray-400">
                        decrement() → count = {selected.count - 1}
                      </button>
                      <button className="w-full py-3 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-gray-600">
                        getCount() → {selected.count} (read-only)
                      </button>
                    </div>
                  </div>
                </div>

                {instances.length > 1 && (
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">All Active Scopes — Proof of Independence</p>
                    <div className="flex flex-wrap gap-2">
                      {instances.map(inst => (
                        <div key={inst.id} className={cn("px-3 py-2 rounded-xl border text-[10px] font-mono", colorClass(inst.color, "bg"), colorClass(inst.color, "border"))}>
                          <span className="text-gray-600">ENV_{inst.id}.count = </span>
                          <span className={colorClass(inst.color, "text")}>{inst.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass p-16 rounded-[32px] border-white/5 flex flex-col items-center justify-center gap-4 opacity-30 min-h-[400px]">
                <GitFork className="w-16 h-16" />
                <p className="text-sm uppercase font-black tracking-widest">Create a closure scope to inspect it</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ════════ PATTERNS ════════ */
function PatternsTab() {
  const [active, setActive] = useState("module")
  const patterns = [
    {
      id: "module", name: "Module Pattern", color: "orange",
      desc: "Use closures to create modules with public APIs and private state. The IIFE (Immediately Invoked Function Expression) creates a scope that runs once, exposing only what you return.",
      code: `// The Module Pattern — private state, public API
const bankAccount = (() => {
  let balance = 1000;       // private — not accessible outside
  const history = [];       // private — inaccessible

  return {
    deposit(amount) {         // public method
      balance += amount;
      history.push(\`+\${amount}\`);
    },
    withdraw(amount) {        // public method
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      history.push(\`-\${amount}\`);
    },
    getBalance() { return balance; },  // read-only access
    getHistory() { return [...history]; } // defensive copy
  };
})();

bankAccount.deposit(500);     // balance = 1500
bankAccount.withdraw(200);    // balance = 1300
console.log(bankAccount.balance); // undefined! Private!
console.log(bankAccount.getBalance()); // 1300`,
      insight: "The IIFE runs once, creating a scope. 'balance' and 'history' can only be accessed through the returned methods. This is equivalent to private class fields — without any special syntax.",
    },
    {
      id: "factory", name: "Factory Functions", color: "blue",
      desc: "Instead of using classes and 'new', factory functions return objects. Each call creates a new closure scope — effectively a new instance with independent private state.",
      code: `// Factory vs Class — both create instances
// Factory (closure-based):
function createUser(name, role) {
  let loginCount = 0;            // private
  const createdAt = new Date();  // private

  return {
    name,  // public
    login() {
      loginCount++;
      console.log(\`\${name} logged in (\${loginCount}x)\`);
    },
    isAdmin: () => role === 'admin',  // closure over 'role'
    getStats: () => ({ loginCount, createdAt })  // controlled access
  };
}

const alice = createUser('Alice', 'admin');
const bob   = createUser('Bob', 'user');

alice.login();          // Alice logged in (1x)
alice.login();          // Alice logged in (2x)
bob.login();            // Bob logged in (1x) — independent!
alice.loginCount;       // undefined — private!
alice.getStats();       // { loginCount: 2, createdAt: ... }`,
      insight: "Unlike classes, factory functions don't need 'new', 'this', or prototype chains. They're simpler, safer (no accidental 'this' binding issues), and naturally support private state through closures.",
    },
    {
      id: "partial", name: "Partial Application & Currying", color: "violet",
      desc: "Closures enable partial application — fix some arguments of a function and return a new function that accepts the rest. This is the foundation of currying and functional programming.",
      code: `// Partial Application: fix some args, return a function
function multiply(a, b) { return a * b; }

function partial(fn, ...args) {
  return (...moreArgs) => fn(...args, ...moreArgs);  // closure!
}

const double  = partial(multiply, 2);  // 'a' is closed over
const triple  = partial(multiply, 3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Currying: transform f(a, b, c) → f(a)(b)(c)
const curry = fn => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...moreArgs) => curried(...args, ...moreArgs); // ← closure
  };
};

const add3 = curry((a, b, c) => a + b + c);
add3(1)(2)(3);   // 6
add3(1, 2)(3);   // 6 — can partially apply any combination`,
      insight: "Each intermediate function in a curried chain closes over the accumulated arguments. This allows powerful function composition without mutating state.",
    },
    {
      id: "memoization", name: "Memoization with Closures", color: "emerald",
      desc: "Closures naturally store a cache that persists between function calls, making them perfect for memoization — storing computed results to avoid redundant computation.",
      code: `// Memoize: cache results using closure
function memoize(fn) {
  const cache = new Map();  // closed over — persists between calls!
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Cache hit!', key);
      return cache.get(key);  // O(1) lookup
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return expensiveFib(n-1) + expensiveFib(n-2);
});

expensiveFib(40);  // computed
expensiveFib(40);  // instant — cache hit!
expensiveFib(41);  // only computes fib(41), reuses fib(40)`,
      insight: "The 'cache' Map is private to the memoized function — external code can't corrupt or access it. This is a real production pattern used in React (useMemo), libraries, and API clients.",
    },
  ]

  const p = patterns.find(p => p.id === active)!
  const colorMap: Record<string, string> = { orange: "text-orange-400 bg-orange-500/5 border-orange-500/20", blue: "text-blue-400 bg-blue-500/5 border-blue-500/20", violet: "text-violet-400 bg-violet-500/5 border-violet-500/20", emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20" }
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
          <div className="lg:col-span-2">
            <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
              <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              <pre className={cn("p-5 rounded-2xl border text-xs font-mono leading-6 whitespace-pre-wrap overflow-auto", c)}>{p.code}</pre>
            </div>
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
  const [expanded, setExpanded] = useState<string | null>("loop")
  const pitfalls = [
    {
      id: "loop", severity: "HIGH", color: "orange",
      title: "The Classic Loop Closure Bug",
      summary: "One of the most famous JS bugs. Using 'var' in a loop creates only one shared binding — all callbacks close over the same variable and see its final value.",
      bad: `// ❌ Classic bug with var:
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);  // Expected: 0,1,2,3,4
  }, 100);           // Actual:   5,5,5,5,5
}
// 'var' is function-scoped, not block-scoped
// All 5 callbacks share the SAME 'i'
// When they run, the loop has finished: i = 5`,
      good: `// ✅ Fix 1: Use 'let' (block-scoped — new binding per iteration)
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100); // 0,1,2,3,4 ✓
}

// ✅ Fix 2: Capture with an IIFE
for (var i = 0; i < 5; i++) {
  ((capturedI) => {
    setTimeout(() => console.log(capturedI), 100);
  })(i);  // invoke immediately with current i
}

// ✅ Fix 3: Use bind or Array methods
[0,1,2,3,4].forEach(i => setTimeout(() => console.log(i), 100));`,
    },
    {
      id: "memory", severity: "MEDIUM", color: "yellow",
      title: "Memory Leaks via Retained References",
      summary: "Closures prevent garbage collection of their closed-over variables. If you close over large objects unintentionally, they stay in memory forever — even if never used.",
      bad: `// ❌ Unintentional large object retention:
function setup() {
  const hugeData = fetchAllUserData(); // 50MB object
  
  document.querySelector('#btn').addEventListener('click', () => {
    // This closure closes over 'hugeData'
    // Even though it only uses userId!
    doSomething(hugeData.userId);
  });
  // hugeData can NEVER be GC'd while btn exists
}`,
      good: `// ✅ Extract only what you need before closing over it:
function setup() {
  const hugeData = fetchAllUserData();
  const userId = hugeData.userId;  // only extract what's needed
  hugeData = null;                  // allow GC of the rest
  
  document.querySelector('#btn').addEventListener('click', () => {
    doSomething(userId);  // closes over only the small primitive
  });
}

// ✅ Also: remove event listeners when done
function cleanup() {
  btn.removeEventListener('click', handler);  // allows GC
}`,
    },
    {
      id: "this", severity: "HIGH", color: "orange",
      title: "Closure vs 'this' — They're Different",
      summary: "Closures capture variables from their lexical scope, but 'this' is dynamic — it depends on how a function is called, not where it's defined. Arrow functions fix this.",
      bad: `// ❌ Regular function — 'this' is lost:
const counter = {
  count: 0,
  start() {
    setInterval(function() {
      this.count++;  // 'this' is undefined (strict) or window!
    }, 1000);
  }
};
counter.start(); // counter.count stays 0!`,
      good: `// ✅ Arrow function — captures lexical 'this':
const counter = {
  count: 0,
  start() {
    setInterval(() => {
      this.count++;  // 'this' refers to counter ✓
    }, 1000);
  }  
};

// ✅ Or use closure to capture 'this':
const counter = {
  count: 0,
  start() {
    const self = this;  // capture 'this' into a closure variable
    setInterval(function() {
      self.count++;  // 'self' is closed over, reliable ✓
    }, 1000);
  }
};`,
    },
  ]
  const badge = (s: string) => s === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  const border = (c: string) => c === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-yellow-500/20 hover:border-yellow-500/40"

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-6">
        <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Closures are powerful but the gotchas are subtle. The loop closure bug has tripped up nearly every JavaScript developer at least once.</p>
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Bug</p>
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
