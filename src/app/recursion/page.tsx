"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Layers, Code2, Zap, AlertTriangle, ChevronRight,
  Info, CheckCircle2, Play, RotateCcw, Terminal, GitBranch,
  RefreshCw, Database
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "callstack" | "patterns" | "pitfalls"
type Algorithm = "factorial" | "fibonacci" | "power"

const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "callstack", label: "📚 Call Stack" },
  { id: "patterns", label: "Patterns" },
  { id: "pitfalls", label: "Pitfalls" },
]

export default function RecursionPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-blue-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Layers className="w-3 h-3" /> Recursion · CS Fundamentals
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-blue-400 bg-clip-text text-transparent">
            Recursion
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            Functions that call themselves — how the call stack grows and unwinds, base cases, recursive patterns, tail recursion, and why trees are recursion in data structure form.
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
            {tab === "concepts" && <ConceptsTab />}
            {tab === "callstack" && <CallStackTab />}
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
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><RefreshCw className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">What is Recursion?</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Recursion is when a function <strong className="text-white">calls itself</strong> to solve a smaller version of the same problem. It keeps calling itself until it hits a <span className="text-blue-400 font-semibold">base case</span> — a condition that stops the recursion and begins the return journey back up the call stack.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Any loop can be written recursively, and vice versa. Recursion shines when the problem itself is naturally recursive — trees, graphs, divide-and-conquer algorithms, and any problem with a self-similar structure.
          </p>
          <div className="bg-black/40 p-5 rounded-2xl border border-blue-500/10 font-mono text-xs leading-7">
            <p className="text-gray-600">// Every recursive function needs TWO things:</p>
            <p className="text-blue-400">function factorial(n) {"{"}</p>
            <p className="pl-4"><span className="text-emerald-400">if (n {"<="} 1) return 1;</span>  <span className="text-gray-600">// 1. Base case: STOP here</span></p>
            <p className="pl-4"><span className="text-blue-300">return n * factorial(n - 1);</span>  <span className="text-gray-600">// 2. Recursive case</span></p>
            <p className="text-blue-400">{"}"}</p>
            <div className="mt-3 pt-3 border-t border-white/5 text-gray-500">
              <p>factorial(4)</p>
              <p className="pl-2">→ 4 * factorial(3)</p>
              <p className="pl-6">→ 3 * factorial(2)</p>
              <p className="pl-10">→ 2 * factorial(1)</p>
              <p className="pl-14 text-emerald-400">→ 1  ← base case!</p>
              <p className="pl-10 text-blue-300">← 2 * 1 = 2</p>
              <p className="pl-6 text-blue-300">← 3 * 2 = 6</p>
              <p className="pl-2 text-blue-300">← 4 * 6 = 24</p>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">The Anatomy of a Recursive Call</h3>
          <div className="space-y-4">
            {[
              { name: "Base Case", required: true, desc: "The termination condition. Without this, you get infinite recursion → stack overflow. Every recursive function MUST have a reachable base case.", example: "if (n <= 0) return 0;", color: "emerald" },
              { name: "Recursive Case", required: true, desc: "The function calls itself with a smaller/simpler input. Each call must work towards the base case — shrinking n, moving closer to a leaf node, etc.", example: "return n + sum(n - 1);", color: "blue" },
              { name: "Return Value", required: true, desc: "The result from a recursive call feeds back into the parent call. The return chain is what makes recursion useful — answers bubbling back up.", example: "return left + right; // combine sub-results", color: "violet" },
              { name: "Trust the Recursion", required: false, desc: "The key mental model: assume the recursive call WORKS and returns the correct answer. Then just solve one step using it. Don't trace the entire chain mentally.", example: "// If fib(n-1) gives me correct fib, then:", color: "amber" },
            ].map(item => (
              <div key={item.name} className={cn("p-4 rounded-2xl border space-y-2",
                item.color === "emerald" ? "bg-emerald-500/5 border-emerald-500/20" :
                item.color === "blue" ? "bg-blue-500/5 border-blue-500/20" :
                item.color === "violet" ? "bg-violet-500/5 border-violet-500/20" :
                "bg-amber-500/5 border-amber-500/20"
              )}>
                <div className="flex items-center justify-between">
                  <p className={cn("text-[11px] font-black uppercase tracking-widest",
                    item.color === "emerald" ? "text-emerald-400" : item.color === "blue" ? "text-blue-400" :
                    item.color === "violet" ? "text-violet-400" : "text-amber-400"
                  )}>{item.name}</p>
                  {item.required && <span className="text-[9px] text-red-400 font-black uppercase">Required</span>}
                </div>
                <p className="text-[12px] text-gray-400 leading-relaxed">{item.desc}</p>
                <code className="text-[10px] text-gray-600 font-mono">{item.example}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Recursion vs Iteration — When to Use Each</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="bg-black/40 p-5 rounded-2xl border border-blue-500/10 font-mono text-xs leading-7">
              <p className="text-blue-400 mb-1">// Recursion: elegant but has overhead</p>
              <p className="text-gray-400">function sumTo(n) {"{"}</p>
              <p className="text-gray-400 pl-4">if (n === 0) return 0;</p>
              <p className="text-gray-400 pl-4">return n + sumTo(n - 1);</p>
              <p className="text-gray-400">{"}"}</p>
              <p className="text-gray-600 mt-2">// Creates n stack frames!</p>
            </div>
            <div className="bg-black/40 p-5 rounded-2xl border border-emerald-500/10 font-mono text-xs leading-7">
              <p className="text-emerald-400 mb-1">// Iteration: more efficient for linear problems</p>
              <p className="text-gray-400">function sumTo(n) {"{"}</p>
              <p className="text-gray-400 pl-4">let result = 0;</p>
              <p className="text-gray-400 pl-4">for (let i = 1; i {"<="} n; i++) result += i;</p>
              <p className="text-gray-400 pl-4">return result;</p>
              <p className="text-gray-400">{"}"}</p>
              <p className="text-gray-600 mt-2">// O(1) stack space — no frame overhead</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-2">
              <p className="text-blue-400 font-black text-[11px] uppercase">Use Recursion When:</p>
              <ul className="space-y-1.5">
                {["The problem has natural recursive structure (trees, graphs)", "Divide and conquer — split into independent subproblems", "Backtracking — explore paths and undo choices", "Code clarity > micro-performance (e.g. tree traversals)", "Working in functional programming style"].map(i => (
                  <li key={i} className="text-[12px] text-gray-400 flex gap-2"><CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />{i}</li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
              <p className="text-emerald-400 font-black text-[11px] uppercase">Use Iteration When:</p>
              <ul className="space-y-1.5">
                {["Simple linear traversal (arrays, linked lists)", "Deep recursion would hit stack limits (n > 10,000)", "Performance-critical paths where stack overhead matters", "The iterative version is equally clear"].map(i => (
                  <li key={i} className="text-[12px] text-gray-400 flex gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════ CALL STACK SIMULATOR ════════ */
interface StackFrame { id: string; name: string; params: Record<string, number>; returnValue?: number; isReturning: boolean; depth: number }

function CallStackTab() {
  const [algo, setAlgo] = useState<Algorithm>("factorial")
  const [n, setN] = useState(5)
  const [isExecuting, setIsExecuting] = useState(false)
  const [stack, setStack] = useState<StackFrame[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [result, setResult] = useState<number | null>(null)
  const addLog = (msg: string) => setLogs(p => [`${msg}`, ...p].slice(0, 14))
  const mkId = () => Math.random().toString(36).slice(2, 6)

  const ALGO_CODE: Record<Algorithm, string> = {
    factorial: `function factorial(n) {
  if (n <= 1) return 1;   // base case
  return n * factorial(n - 1);
}`,
    fibonacci: `function fibonacci(n) {
  if (n <= 1) return n;   // base case
  return fib(n-1) + fib(n-2);
}`,
    power: `function power(base, exp) {
  if (exp === 0) return 1; // base case
  return base * power(base, exp - 1);
}`,
  }

  const runSim = async () => {
    if (isExecuting) return
    setIsExecuting(true); setStack([]); setLogs([]); setResult(null)
    addLog(`▶ Starting ${algo}(${algo === "power" ? `2, ${n}` : n})`)

    const push = (name: string, params: Record<string, number>, d: number): string => {
      const id = mkId()
      setStack(p => [...p, { id, name, params, isReturning: false, depth: d }])
      return id
    }
    const pop = (id: string, val: number) => {
      setStack(p => p.map(f => f.id === id ? { ...f, isReturning: true, returnValue: val } : f))
    }
    const rm = (id: string) => setStack(p => p.filter(f => f.id !== id))
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

    const factorial = async (num: number, d: number): Promise<number> => {
      const id = push("factorial", { n: num }, d)
      addLog(`  ${"  ".repeat(d)}PUSH factorial(${num}) — depth ${d}`)
      await delay(700)
      let res: number
      if (num <= 1) { addLog(`  ${"  ".repeat(d)}BASE CASE → return 1`); res = 1 }
      else { res = num * await factorial(num - 1, d + 1) }
      pop(id, res)
      addLog(`  ${"  ".repeat(d)}POP factorial(${num}) → ${res}`)
      await delay(500); rm(id)
      return res
    }

    const fibonacci = async (num: number, d: number): Promise<number> => {
      const id = push("fibonacci", { n: num }, d)
      addLog(`  ${"  ".repeat(d)}PUSH fib(${num}) — depth ${d}`)
      await delay(600)
      let res: number
      if (num <= 1) { addLog(`  ${"  ".repeat(d)}BASE CASE → return ${num}`); res = num }
      else { const a = await fibonacci(num - 1, d + 1); const b = await fibonacci(num - 2, d + 1); res = a + b }
      pop(id, res); addLog(`  ${"  ".repeat(d)}POP fib(${num}) → ${res}`)
      await delay(400); rm(id)
      return res
    }

    const power = async (base: number, exp: number, d: number): Promise<number> => {
      const id = push("power", { base, exp }, d)
      addLog(`  ${"  ".repeat(d)}PUSH power(${base}, ${exp}) — depth ${d}`)
      await delay(700)
      let res: number
      if (exp === 0) { addLog(`  ${"  ".repeat(d)}BASE CASE → return 1`); res = 1 }
      else { res = base * await power(base, exp - 1, d + 1) }
      pop(id, res); addLog(`  ${"  ".repeat(d)}POP power(${base},${exp}) → ${res}`)
      await delay(500); rm(id)
      return res
    }

    let finalResult = 0
    if (algo === "factorial") finalResult = await factorial(n, 1)
    else if (algo === "fibonacci") finalResult = await fibonacci(Math.min(n, 6), 1)
    else finalResult = await power(2, Math.min(n, 8), 1)
    setResult(finalResult)
    addLog(`✅ Complete: ${algo}(${n}) = ${finalResult}`)
    setIsExecuting(false)
  }

  const maxDepth = Math.max(...stack.map(f => f.depth), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config */}
        <div className="space-y-4">
          <div className="glass p-6 rounded-[32px] border-white/5 space-y-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Algorithm</p>
            <div className="space-y-2">
              {([["factorial", "n! = n × (n-1)!"], ["fibonacci", "fib(n) + fib(n-2)"], ["power", "2^n recursively"]] as const).map(([a, desc]) => (
                <button key={a} onClick={() => { setAlgo(a); setStack([]); setLogs([]); setResult(null) }}
                  className={cn("w-full flex justify-between items-center p-3 rounded-xl border text-left transition-all",
                    algo === a ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-white/3 border-white/5 text-gray-500 hover:border-white/10"
                  )}>
                  <span className="text-[11px] font-black">{a}</span>
                  <span className="text-[10px] font-mono">{desc}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">n = {n}</label>
                <span className="text-[10px] text-gray-600">{algo === "fibonacci" ? "max 6 (exponential!)" : algo === "power" ? "max 8" : "max 8"}</span>
              </div>
              <input type="range" min={1} max={algo === "fibonacci" ? 6 : 8} value={n} onChange={e => setN(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer" />
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-xs">
              <pre className="text-blue-300 leading-6 whitespace-pre-wrap">{ALGO_CODE[algo]}</pre>
            </div>
            <button onClick={runSim} disabled={isExecuting}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />{isExecuting ? "Executing..." : "Run Simulation"}
            </button>
          </div>
          {result !== null && (
            <div className="glass p-5 rounded-2xl border-emerald-500/20 bg-emerald-500/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Result</p>
              <p className="text-4xl font-black text-emerald-400 mt-1">{result}</p>
              <p className="text-[11px] text-gray-600 mt-1 font-mono">{algo}({n}) = {result}</p>
            </div>
          )}
          <div className="glass p-5 rounded-[24px] border-white/5 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2"><Terminal className="w-3 h-3" />Trace Log</p>
            <div className="h-48 overflow-y-auto font-mono text-[9px] space-y-0.5">
              {logs.map((l, i) => <div key={i} className={cn("py-0.5 leading-tight", i === 0 ? "text-blue-300" : "text-gray-600")}>{l}</div>)}
              {!logs.length && <p className="text-gray-800 italic text-center mt-12">Run a simulation...</p>}
            </div>
          </div>
        </div>

        {/* Stack Visualizer */}
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-[32px] border-white/5 h-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Call Stack (LIFO — grows down)</p>
              </div>
              <div className="flex gap-3 text-[10px]">
                <span className="text-blue-400 font-mono">Depth: {maxDepth}</span>
                <span className="text-gray-600 font-mono">Frames: {stack.length}</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col-reverse gap-2 overflow-y-auto min-h-[400px]">
              {stack.length === 0 && (
                <div className="flex-1 flex items-center justify-center opacity-10">
                  <div className="text-center space-y-2">
                    <Layers className="w-16 h-16 mx-auto" />
                    <p className="text-sm font-bold uppercase tracking-widest">Run to see the call stack</p>
                  </div>
                </div>
              )}
              <AnimatePresence>
                {stack.map((frame, i) => (
                  <motion.div key={frame.id}
                    initial={{ opacity: 0, x: -20, scaleX: 0.9 }}
                    animate={{ opacity: 1, x: 0, scaleX: 1 }}
                    exit={{ opacity: 0, x: 50 }}
                    className={cn("p-4 rounded-2xl border flex justify-between items-center",
                      frame.isReturning ? "bg-emerald-500/15 border-emerald-500/40" : "bg-blue-500/10 border-blue-500/25"
                    )}
                    style={{ marginLeft: `${(frame.depth - 1) * 16}px` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full shrink-0", frame.isReturning ? "bg-emerald-400" : "bg-blue-400 animate-pulse")} />
                      <div>
                        <p className="text-xs font-black font-mono">
                          <span className="text-blue-400">{frame.name}</span>
                          <span className="text-gray-500">(</span>
                          {Object.entries(frame.params).map(([k, v], j) => (
                            <span key={k}><span className="text-violet-300">{k}</span><span className="text-gray-500">=</span><span className="text-white">{v}</span>{j < Object.keys(frame.params).length - 1 ? <span className="text-gray-500">, </span> : null}</span>
                          ))}
                          <span className="text-gray-500">)</span>
                        </p>
                        <p className="text-[9px] text-gray-600 font-mono">Depth {frame.depth} · Frame #{i + 1}</p>
                      </div>
                    </div>
                    {frame.returnValue !== undefined && (
                      <div className="px-3 py-1 bg-emerald-500 rounded-lg text-white font-black text-[10px]">
                        → {frame.returnValue}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="border-t border-white/5 pt-3 text-center">
              <p className="text-[9px] text-gray-700 uppercase tracking-widest">Stack Bottom</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════ PATTERNS ════════ */
function PatternsTab() {
  const [active, setActive] = useState("divide-conquer")
  const patterns = [
    {
      id: "divide-conquer", name: "Divide & Conquer", color: "blue",
      description: "Split the problem into independent subproblems, solve each recursively, then combine the results. The subproblems don't overlap — this is what distinguishes it from dynamic programming.",
      example: `// Merge Sort: O(n log n)
function mergeSort(arr) {
  if (arr.length <= 1) return arr;  // base case
  
  const mid = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));   // recurse left
  const right = mergeSort(arr.slice(mid));       // recurse right
  
  return merge(left, right);  // combine
}

// Binary Search: O(log n)
function binarySearch(arr, target, lo, hi) {
  if (lo > hi) return -1;  // base case
  const mid = Math.floor((lo + hi) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearch(arr, target, mid+1, hi);
  return binarySearch(arr, target, lo, mid-1);
}`,
      uses: ["Merge Sort, Quick Sort", "Binary Search", "Fast Fourier Transform (FFT)", "Strassen's matrix multiplication"],
    },
    {
      id: "tree-traversal", name: "Tree Traversal", color: "emerald",
      description: "Trees are inherently recursive — each node is the root of a subtree. Recursive traversal is the most natural way to process tree structures. The three orders (pre/in/post) differ only in where you process the current node.",
      example: `// All three traversals differ by ONE line position:
function preOrder(node) {   // Root → Left → Right
  if (!node) return;
  process(node.val);      // ← process HERE for pre-order
  preOrder(node.left);
  preOrder(node.right);
}

function inOrder(node) {    // Left → Root → Right
  if (!node) return;
  inOrder(node.left);
  process(node.val);      // ← process HERE for in-order
  inOrder(node.right);    //   (gives sorted order in BST!)
}

function postOrder(node) {  // Left → Right → Root
  if (!node) return;
  postOrder(node.left);
  postOrder(node.right);
  process(node.val);      // ← process HERE for post-order
}`,
      uses: ["BST sorted output (in-order)", "File system traversal", "HTML/DOM parsing", "Expression tree evaluation"],
    },
    {
      id: "backtracking", name: "Backtracking", color: "violet",
      description: "Explore all possible solutions by building candidates incrementally. When a candidate violates constraints, undo the last choice (backtrack) and try a different path. Pruning invalid branches early avoids exponential blowup.",
      example: `// N-Queens: place N queens so none attack each other
function solve(board, row) {
  if (row === board.length) {
    solutions.push(board.map(r => [...r])); // found one!
    return;
  }
  
  for (let col = 0; col < board.length; col++) {
    if (isSafe(board, row, col)) {
      board[row][col] = 'Q';      // place queen
      solve(board, row + 1);       // recurse deeper
      board[row][col] = '.';       // BACKTRACK (undo)
    }
  }
}

// Same pattern: Sudoku, maze solving, 
// graph coloring, permutation generation`,
      uses: ["N-Queens problem", "Sudoku solver", "Maze/labyrinth solving", "Generating all permutations"],
    },
    {
      id: "memoization", name: "Memoization (Top-Down DP)", color: "amber",
      description: "Cache expensive recursive results so overlapping subproblems are only computed once. This transforms naive exponential recursion (like Fibonacci) into linear time. This is the top-down approach to dynamic programming.",
      example: `// Naive Fibonacci: O(2^n) — exponential!
function fib(n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);  // recomputes same values!
}

// Memoized Fibonacci: O(n) — linear!
const memo = new Map();
function fib(n) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);  // cache hit!
  
  const result = fib(n-1) + fib(n-2);
  memo.set(n, result);   // cache before returning
  return result;
}

// fib(50) without memo: ~10^10 calls
// fib(50) with memo: exactly 50 calls`,
      uses: ["Fibonacci sequence", "Longest Common Subsequence", "Coin change problem", "Shortest path in weighted graphs"],
    },
  ]
  const p = patterns.find(p => p.id === active)!
  const colorMap = { blue: "text-blue-400 bg-blue-500/5 border-blue-500/20", emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20", violet: "text-violet-400 bg-violet-500/5 border-violet-500/20", amber: "text-amber-400 bg-amber-500/5 border-amber-500/20" }
  const c = colorMap[p.color as keyof typeof colorMap]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {patterns.map(pat => (
          <button key={pat.id} onClick={() => setActive(pat.id)} className={cn(
            "px-5 py-2 rounded-full text-[11px] font-bold border transition-all",
            active === pat.id ? colorMap[pat.color as keyof typeof colorMap] : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
          )}>{pat.name}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 glass p-6 rounded-[32px] border-white/5 space-y-4">
            <div>
              <p className={cn("text-[10px] font-black uppercase tracking-widest mb-2", c.split(" ")[0])}>{p.name}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{p.description}</p>
            </div>
            <pre className={cn("p-5 rounded-2xl border text-xs font-mono leading-6 whitespace-pre-wrap", c)}>{p.example}</pre>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="glass p-6 rounded-[24px] border-white/5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Classic Problems</p>
              {p.uses.map(u => (
                <div key={u} className="flex gap-2 items-center p-3 rounded-xl bg-white/3 border border-white/5">
                  <GitBranch className={cn("w-3.5 h-3.5 shrink-0", c.split(" ")[0])} />
                  <p className="text-[12px] text-gray-400">{u}</p>
                </div>
              ))}
            </div>
            <div className={cn("glass p-6 rounded-[24px] border space-y-3", c)}>
              <p className={cn("text-[10px] font-black uppercase tracking-widest", c.split(" ")[0])}>Key Insight</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                {active === "divide-conquer" && "The key is independence: left half doesn't affect right half. This is what enables parallelism in merge sort."}
                {active === "tree-traversal" && "The recursion structure mirrors the tree structure. If you can see a 'left' and 'right' and a 'self', you can write a tree traversal."}
                {active === "backtracking" && "Think of it as a decision tree. At each node, try all valid choices. When stuck, climb back up and take a different branch."}
                {active === "memoization" && "The memo check must be BEFORE the recursive calls. Only cache after verifying the result is correct."}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ════════ PITFALLS ════════ */
function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("overflow")
  const pitfalls = [
    {
      id: "overflow", severity: "CRITICAL", color: "red",
      title: "Stack Overflow — Missing or Unreachable Base Case",
      summary: "The most common recursion bug. Without a base case, the function calls itself infinitely until the call stack's memory limit (usually ~10,000–15,000 frames) is exhausted.",
      bad: `// Missing base case — will crash!
function countdown(n) {
  console.log(n);
  return countdown(n - 1); // never stops!
}

// Unreachable base case
function fib(n) {
  if (n === 0) return 0;  // never reached if n is negative!
  return fib(n-1) + fib(n-2);
}
fib(-1); // → Uncaught RangeError: Maximum call stack exceeded`,
      good: `// Always verify: can you reach the base case from ANY input?
function countdown(n) {
  if (n <= 0) return;  // ← base case handles negatives too
  console.log(n);
  return countdown(n - 1);
}

function fib(n) {
  if (n < 0) throw new Error("Input must be non-negative");
  if (n <= 1) return n;  // handles both 0 and 1
  return fib(n-1) + fib(n-2);
}`,
    },
    {
      id: "exponential", severity: "HIGH", color: "orange",
      title: "Exponential Time — Overlapping Subproblems Without Memoization",
      summary: "Naive recursive Fibonacci recomputes fib(3) dozens of times. For n=50, it makes over 2^50 calls. Always memoize when the same inputs appear in multiple branches.",
      bad: `// fib(6) makes fib(4) computed TWICE,
// fib(3) computed THREE times, fib(2) FIVE times...
// Time complexity: O(2^n) — exponential growth!
function fib(n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}
// fib(50) → would take millions of years on CPU!`,
      good: `// Memoize: O(n) time, O(n) space
const cache = {};
function fib(n) {
  if (n <= 1) return n;
  if (cache[n]) return cache[n];  // check cache first!
  cache[n] = fib(n-1) + fib(n-2);
  return cache[n];
}
// OR use bottom-up DP: O(n) time, O(1) space
function fib(n) {
  let [a, b] = [0, 1];
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
    },
    {
      id: "deep-stack", severity: "MEDIUM", color: "yellow",
      title: "Deep Recursion in Production — Stack Depth Limits",
      summary: "JavaScript's call stack typically allows ~10,000–15,000 frames before throwing RangeError. For large inputs like processing 100K-node trees, this is a real constraint.",
      bad: `// Recursively processing a 100K item flat array:
function processAll(arr, i = 0) {
  if (i === arr.length) return [];
  return [process(arr[i]), ...processAll(arr, i + 1)];
  // → Will crash at ~10,000 items!
}

// Recursive linked list reversal on 20K list:
function reverse(node, prev = null) {
  if (!node) return prev;
  return reverse(node.next, node); // → RangeError at ~10K`,
      good: `// Trampolining — convert deep recursion to iteration:
function processAll(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(process(arr[i]));  // pure iteration
  }
  return result;
}

// Or: tail-call optimization (TCO) in environments that support it
// Node.js (with --harmony) and Safari support TCO
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc); // ← tail position!
}`,
    },
  ]
  const badge = (s: string) => s === "CRITICAL" ? "bg-red-500/20 text-red-400 border-red-500/30" : s === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  const border = (c: string) => c === "red" ? "border-red-500/20 hover:border-red-500/40" : c === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-yellow-500/20 hover:border-yellow-500/40"

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-6">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Recursion errors are among the most dangerous in production — they often cause immediate crashes (stack overflow) rather than degraded performance. Know these patterns cold.</p>
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
