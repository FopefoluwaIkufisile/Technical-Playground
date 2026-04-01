"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, GitBranch, GitCommit, GitPullRequest, GitMerge, Zap, Activity, Info, BarChart3, ChevronRight, Share2, Terminal, HardDrive, Layout, RefreshCw, Cpu, Database, Server, Globe, Search, Command, CheckCircle2, AlertTriangle, Layers, ArrowDownRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Commit {
  id: string
  message: string
  parents: string[]
  branch: string
  timestamp: number
}

interface Ref {
  name: string
  commitId: string
}

export default function VersionPage() {
  const [commits, setCommits] = useState<Commit[]>([
    { id: "a1b2c", message: "Initial commit", parents: [], branch: "main", timestamp: Date.now() }
  ])
  const [refs, setRefs] = useState<Ref[]>([
    { name: "main", commitId: "a1b2c" },
    { name: "HEAD", commitId: "a1b2c" }
  ])
  const [currentBranch, setCurrentBranch] = useState("main")
  const [logs, setLogs] = useState<string[]>([])
  const [prOpen, setPrOpen] = useState(false)

  const addLog = (msg: string) => setLogs(p => [`[GIT] ${msg}`, ...p].slice(0, 10))

  const commit = (msg: string) => {
    const id = Math.random().toString(36).substr(2, 5)
    const headCommit = refs.find(r => r.name === "HEAD")?.commitId
    const newCommit: Commit = {
       id,
       message: msg,
       parents: headCommit ? [headCommit] : [],
       branch: currentBranch,
       timestamp: Date.now()
    }
    setCommits(prev => [...prev, newCommit])
    setRefs(prev => prev.map(r => r.name === "HEAD" || r.name === currentBranch ? { ...r, commitId: id } : r))
    addLog(`COMMIT: ${id} - ${msg}`)
  }

  const branch = (name: string) => {
     if (refs.some(r => r.name === name)) return
     const headCommit = refs.find(r => r.name === "HEAD")?.commitId || ""
     setRefs(prev => [...prev, { name, commitId: headCommit }])
     addLog(`BRANCH: ${name} created at ${headCommit}`)
  }

  const checkout = (name: string) => {
     const ref = refs.find(r => r.name === name)
     if (!ref) return
     setCurrentBranch(name)
     setRefs(prev => prev.map(r => r.name === "HEAD" ? { ...r, commitId: ref.commitId } : r))
     addLog(`CHECKOUT: Switched to ${name}`)
  }

  const merge = (source: string, target: string) => {
     const sourceRef = refs.find(r => r.name === source)
     const targetRef = refs.find(r => r.name === target)
     if (!sourceRef || !targetRef) return

     // Check if Fast-Forward is possible (simplified)
     const id = Math.random().toString(36).substr(2, 5)
     const mergeCommit: Commit = {
        id,
        message: `Merge ${source} into ${target}`,
        parents: [targetRef.commitId, sourceRef.commitId],
        branch: target,
        timestamp: Date.now()
     }
     setCommits(prev => [...prev, mergeCommit])
     setRefs(prev => prev.map(r => r.name === target || r.name === "HEAD" ? { ...r, commitId: id } : r))
     addLog(`MERGE: ${source} -> ${target} (Merge Commit: ${id})`)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-orange-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium flex items-center gap-2">
            <GitBranch className="w-3 h-3 animate-pulse" />
            Theory Lab: Version (Git)
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Git Shell Controls */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase whitespace-normal">GitCore</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">VCS Engine Visualization</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-4">
                    <button 
                      onClick={() => commit("Update files")}
                      className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-orange-500/20"
                    >
                       <GitCommit className="w-4 h-4" />
                       GIT COMMIT
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                       <button onClick={() => branch("feature")} className="py-3 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black hover:border-orange-500/30 transition-all uppercase">NEW_BRANCH</button>
                       <button onClick={() => setPrOpen(true)} className="py-3 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black hover:border-orange-500/30 transition-all uppercase">OPEN_PR</button>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-white/5 space-y-3">
                    <label className="text-[9px] font-black uppercase text-gray-700 tracking-widest">Active Refs</label>
                    {refs.map(ref => (
                       <div key={ref.name} className={cn(
                          "px-4 py-3 rounded-xl border flex items-center justify-between transition-all",
                          currentBranch === ref.name ? "bg-orange-500/10 border-orange-500/50 text-orange-400" : "bg-white/5 border-white/5 text-gray-800"
                       )}>
                          <div className="flex items-center gap-3">
                             {ref.name === "HEAD" ? <Layers className="w-3 h-3 opacity-50" /> : <GitBranch className="w-3 h-3" />}
                             <span className="text-[10px] font-black uppercase italic">{ref.name}</span>
                          </div>
                          <span className="text-[9px] font-mono opacity-50">@{ref.commitId}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-orange-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Git Event Stream</h3>
              </div>
              <div className="space-y-1 h-36 overflow-y-auto custom-scrollbar font-mono text-[9px] text-gray-500 pr-2">
                 {logs.map((l, i) => (
                    <div key={i} className="py-1 border-b border-white/5 opacity-80 leading-none truncate italic">{l}</div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-12 lowercase text-[10px]">waiting for commits...</p>}
              </div>
           </div>
        </section>

        {/* DAG Visualization View */}
        <section className="lg:col-span-3 space-y-6">
           <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 md:p-12 min-h-[500px] relative flex flex-col gap-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <GitMerge className="w-64 h-64 text-orange-500" />
              </div>

              {/* Commit Graph Overlay */}
              <div className="relative z-10 flex flex-col h-full gap-10">
                 <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
                    <div className="flex gap-4 items-center">
                       <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                          <GitCommit className="w-6 h-6 border-none" />
                       </div>
                       <div>
                          <h3 className="text-sm font-black italic uppercase tracking-[0.2em]">Commit Topology Graph</h3>
                          <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest italic leading-none mt-1">Ref Pointers: {currentBranch.toUpperCase()}</p>
                       </div>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto justify-end">
                       <MetricBox label="Commit Count" value={commits.length} color="text-orange-500" />
                       <MetricBox label="Branch Depth" value={new Set(commits.map(c => c.branch)).size} color="text-amber-500" />
                    </div>
                 </div>

                 {/* The DAG (Directed Acyclic Graph) */}
                 <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-6 sm:p-10 relative overflow-x-auto no-scrollbar flex flex-col-reverse justify-start gap-12 pt-20">
                    <AnimatePresence>
                       {commits.map((commit, i) => (
                          <motion.div 
                            key={commit.id} 
                            initial={{ opacity: 0, x: -50 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-8 relative"
                          >
                             {/* Commit Node */}
                             <div className={cn(
                                "w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-20 shadow-xl shadow-black shrink-0",
                                commit.branch === "main" ? "border-orange-500 bg-orange-500/10" : "border-amber-500 bg-amber-500/10"
                             )}>
                                <span className="text-[8px] sm:text-[9px] font-black font-mono">{commit.id}</span>
                                {refs.some(r => r.commitId === commit.id) && (
                                   <div className="absolute -top-10 flex flex-col gap-1 items-center">
                                      {refs.filter(r => r.commitId === commit.id).map(r => (
                                         <span key={r.name} className={cn(
                                            "px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest shadow-lg",
                                            r.name === "HEAD" ? "bg-white text-black" : "bg-orange-600 text-white"
                                         )}>
                                            {r.name}
                                         </span>
                                      ))}
                                      <ArrowDownRight className="w-3 h-3 text-orange-500 opacity-50" />
                                   </div>
                                )}
                             </div>

                             {/* Metadata */}
                             <div className="flex flex-col gap-1 min-w-0">
                                <p className="text-[9px] sm:text-[10px] font-black italic uppercase text-white tracking-widest truncate">{commit.message}</p>
                                <div className="flex items-center gap-3">
                                   <span className="text-[7px] sm:text-[8px] font-mono text-gray-700 uppercase">SHA1_{commit.id}</span>
                                   <div className={cn("px-2 py-0.5 rounded bg-white/5 text-gray-700 text-[7px] font-black uppercase")}>{commit.branch}</div>
                                </div>
                             </div>

                             {/* Parent Connection Line */}
                             {i > 0 && (
                                <div className="absolute -bottom-12 left-5 sm:left-6 w-0.5 h-12 bg-white/5 -z-10" />
                             )}
                          </motion.div>
                       ))}
                    </AnimatePresence>
                 </div>
              </div>

              {/* Git Internals Insight Footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10 items-center">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center text-orange-500">
                       <Zap className="w-6 h-6 border-none" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Snapshot Content-Addressing</h4>
                       <p className="text-[10px] text-gray-600 font-light italic leading-snug">
                          Git doesn't store diffs; it stores **Snapshots**. Every "commit" is a pointer to a **Tree** of objects, unique by their SHA-1 hash.
                       </p>
                    </div>
                 </div>

                 <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex gap-6">
                    <GitMerge className="w-8 h-8 text-orange-500 shrink-0" />
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase text-white tracking-widest leading-none mt-1">Branches as Pointers</p>
                       <p className="text-[10px] text-gray-600 font-light italic leading-relaxed font-sans">
                          A "branch" in Git is simply a 40-character file containing the OID of the latest commit. Deleting a branch is instant.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>

      {/* PR Tooltip simulation */}
      <AnimatePresence>
         {prOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
               <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="glass p-10 rounded-[40px] border-orange-500/20 max-w-lg w-full space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="p-4 rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                        <GitPullRequest className="w-8 h-8 border-none" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black italic uppercase tracking-widest">Pull Request #101</h3>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Sync feature -&gt; main</p>
                     </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed italic">
                     A Pull Request is a request to merge one branch into another. In a production workflow, this triggers **CI/CD Pipelines** and **Code Reviews**.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => { merge("feature", "main"); setPrOpen(false); }} className="py-4 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all">Merge PR</button>
                     <button onClick={() => setPrOpen(false)} className="py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Close</button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </main>
  )
}

function MetricBox({ label, value, color }: any) {
  return (
    <div className="text-right space-y-1">
       <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">{label}</p>
       <p className={cn("text-3xl font-black italic tracking-tighter leading-none", color)}>{value}</p>
    </div>
  )
}
