"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Database, Search, ZoomIn, Layers, Zap, Activity, Info, BarChart3, ChevronRight, Share2, Terminal, HardDrive, Layout, RefreshCw, Cpu, GitBranch, ArrowDownRight, Server, Globe } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Node {
  id: string
  keys: number[]
  children?: Node[]
  isLeaf: boolean
}

export default function IndexPage() {
  const [searchTarget, setSearchTarget] = useState(42)
  const [isSearching, setIsSearching] = useState(false)
  const [searchPath, setSearchPath] = useState<string[]>([])
  const [scanIndex, setScanIndex] = useState(-1)
  const [logs, setLogs] = useState<string[]>([])
  const [ioReads, setIoReads] = useState({ index: 0, scan: 0 })

  const addLog = (msg: string) => setLogs(p => [`[DB] ${msg}`, ...p].slice(0, 10))

  // Sample static B-Tree structure for visualization
  const bTree: Node = useMemo(() => ({
    id: "root",
    keys: [50],
    isLeaf: false,
    children: [
      {
        id: "left",
        keys: [20, 35],
        isLeaf: false,
        children: [
          { id: "L1", keys: [10, 15], isLeaf: true },
          { id: "L2", keys: [25, 30], isLeaf: true },
          { id: "L3", keys: [40, 45], isLeaf: true }
        ]
      },
      {
        id: "right",
        keys: [70, 85],
        isLeaf: false,
        children: [
          { id: "R1", keys: [60, 65], isLeaf: true },
          { id: "R2", keys: [75, 80], isLeaf: true },
          { id: "R3", keys: [90, 95], isLeaf: true }
        ]
      }
    ]
  }), [])

  const runSearch = async () => {
    if (isSearching) return
    setIsSearching(true)
    setSearchPath([])
    setScanIndex(-1)
    setIoReads({ index: 0, scan: 0 })
    addLog(`Initiating search for PK: ${searchTarget}`)

    // 1. FULL TABLE SCAN (Sequential)
    addLog("PHASE 1: Full Table Scan (O[N]) starting...")
    for (let i = 0; i < 20; i++) {
       setScanIndex(i)
       setIoReads(prev => ({ ...prev, scan: prev.scan + 1 }))
       await new Promise(r => setTimeout(r, 100))
       if (i * 5 === searchTarget) break
    }
    setScanIndex(-1)

    // 2. B-TREE INDEX SEARCH (O[log N])
    addLog("PHASE 2: B-Tree Index Traversal (O[log N]) starting...")
    let curr: Node | undefined = bTree
    let reads = 0
    while (curr) {
       reads++
       setSearchPath(prev => [...prev, curr!.id])
       setIoReads(prev => ({ ...prev, index: reads }))
       addLog(`IO_READ: Node ${curr.id} at PageBoundary 0x${reads.toString(16)}`)
       await new Promise(r => setTimeout(r, 800))
       
       if (curr.isLeaf) break
       
       // Simple navigation logic
       if (searchTarget < curr.keys[0]) curr = curr.children![0]
       else if (curr.keys.length > 1 && searchTarget < curr.keys[1]) curr = curr.children![1]
       else curr = curr.children![curr.children!.length - 1]
    }

    setIsSearching(false)
    addLog(`Data located. Index Efficiency: ${(1 - reads/20)*100}% gain.`)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-amber-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-2">
            <Database className="w-3 h-3 animate-pulse" />
            Infrastructure Lab: Indexing
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Storage Engine Controls */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase whitespace-normal">IndexedDB</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Storage Optimization Lab</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-black uppercase text-gray-700 tracking-widest">Search Primary Key</label>
                       <span className="text-sm font-black text-amber-500 italic">{searchTarget}</span>
                    </div>
                    <input type="range" min="10" max="95" step="5" value={searchTarget} onChange={(e) => setSearchTarget(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-amber-600" />
                 </div>

                 <button 
                   onClick={runSearch} disabled={isSearching}
                   className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-amber-500/20"
                 >
                   EXECUTE QUERY
                 </button>

                 <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                    <StatMinimal label="INDEX READS" value={ioReads.index} color="text-amber-500" />
                    <StatMinimal label="SCAN READS" value={ioReads.scan} color="text-rose-500" />
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-amber-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">VFS Buffer Log</h3>
              </div>
              <div className="space-y-1 h-36 overflow-y-auto custom-scrollbar font-mono text-[9px] text-gray-500 pr-2">
                 {logs.map((l, i) => (
                    <div key={i} className={cn("py-1 border-b border-white/5 opacity-80 leading-none truncate", l.includes("reads/20") && "text-emerald-500")}>{l}</div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-12 lowercase text-[10px]">waiting for query...</p>}
              </div>
           </div>
        </section>

        {/* Tree Visualizer View */}
        <section className="lg:col-span-3 space-y-6">
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 md:p-12 min-h-[450px] relative flex flex-col gap-12 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <HardDrive className="w-64 h-64 text-amber-500" />
              </div>

              {/* Tree Topology Overlay */}
              <div className="relative z-10 flex flex-col h-full gap-10 items-center">
                 
                 {/* B-Tree Visualization (Recursive Nodes) */}
                  <div className="flex flex-col gap-12 items-center w-full overflow-x-auto no-scrollbar py-4 scale-90 sm:scale-100">
                     <TreeNode node={bTree} activeId={searchPath[searchPath.length - 1]} path={searchPath} />
                  </div>

                 {/* Sequential Scan Progress (Heap Table) */}
                 <div className="w-full pt-10 border-t border-white/5 space-y-4">
                    <p className="text-[9px] font-black uppercase text-gray-700 tracking-widest">Raw Heap Table (Full Scan Mode)</p>
                    <div className="flex gap-1 h-3 bg-white/5 rounded-full overflow-hidden">
                       {Array.from({ length: 20 }).map((_, i) => (
                          <div key={i} className={cn(
                             "flex-1 transition-colors duration-200",
                             scanIndex === i ? "bg-rose-500 animate-pulse" : 
                             scanIndex > i ? "bg-rose-900/50" : "bg-white/5"
                          )} />
                       ))}
                    </div>
                 </div>
              </div>

              {/* Complexity Insight Footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10 items-center">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500">
                       <Zap className="w-6 h-6 border-none" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">I/O Amplitude Reduction</h4>
                       <p className="text-[10px] text-gray-600 font-light italic leading-snug">
                          A B-Tree index minimizes physical disk reads by narrowing the search space exponentially per page read.
                       </p>
                    </div>
                 </div>

                 <div className="bg-amber-500/5 rounded-3xl p-6 border border-amber-500/10 flex gap-6">
                    <BarChart3 className="w-8 h-8 text-amber-500 shrink-0" />
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase text-white tracking-widest leading-none mt-1">Algorithm Efficiency</p>
                       <p className="text-[10px] text-gray-600 font-light italic leading-relaxed font-sans">
                          Searching 1 Billion records without an index takes ~1 Million seconds. With a B-Tree, it takes &lt; 30 IO reads.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function TreeNode({ node, activeId, path }: { node: Node, activeId?: string, path: string[] }) {
  const isActive = path.includes(node.id)
  const isSelected = activeId === node.id

  return (
    <div className={cn("flex flex-col items-center gap-8 sm:gap-12")}>
       <motion.div 
         animate={{ 
            scale: isSelected ? 1.05 : 1,
            borderColor: isSelected ? "#f59e0b" : isActive ? "#f59e0b20" : "rgba(255, 255, 255, 0.05)"
         }}
         className={cn(
            "p-3 rounded-2xl border bg-black/40 shadow-xl flex flex-col gap-2 min-w-[70px] sm:min-w-[80px]",
            isActive && "bg-amber-500/10"
         )}
       >
          <div className="flex gap-2 justify-center">
             {node.keys.map(k => (
                <span key={k} className={cn("text-[10px] sm:text-xs font-black italic", isSelected ? "text-white" : "text-gray-700")}>{k}</span>
             ))}
          </div>
          <span className="text-[6px] sm:text-[7px] font-mono text-gray-800 uppercase italic text-center">PAGE_{node.id}</span>
       </motion.div>

       {node.children && (
          <div className="flex gap-4 sm:gap-8 relative items-start">
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-white/5 -z-10" />
             {node.children.map(child => (
                <TreeNode key={child.id} node={child} activeId={activeId} path={path} />
             ))}
          </div>
       )}
    </div>
  )
}

function StatMinimal({ label, value, color }: any) {
  return (
    <div className="space-y-1">
       <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">{label}</p>
       <p className={cn("text-xl font-black italic tracking-tighter leading-none", color)}>{value}</p>
    </div>
  )
}
