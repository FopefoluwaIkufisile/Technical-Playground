"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Search, Code2, Layers, Info, RotateCcw, Play, CheckCircle2, XCircle, AlertCircle, Terminal, HelpCircle, ChevronRight, Zap, Target, BookOpen } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function RegexPage() {
  const [regex, setRegex] = useState("(?:[a-zA-Z0-9+_.-]+)@(?:[a-zA-Z0-9.-]+)\\.([a-z]{2,})")
  const [testString, setTestString] = useState("Contact us at support@example.com or admin@internal.net")
  const [flags, setFlags] = useState("g")
  const [error, setError] = useState<string | null>(null)

  const matches = useMemo(() => {
    if (!regex) return []
    try {
      const re = new RegExp(regex, flags)
      setError(null)
      const results = []
      let match
      if (flags.includes('g')) {
        while ((match = re.exec(testString)) !== null) {
          results.push(match)
          if (match.index === re.lastIndex) re.lastIndex++ // Prevent infinite loops
        }
      } else {
        match = re.exec(testString)
        if (match) results.push(match)
      }
      return results
    } catch (e: any) {
      setError(e.message)
      return []
    }
  }, [regex, testString, flags])

  const explanation = useMemo(() => {
     if (!regex) return []
     const explained: { part: string, desc: string }[] = []
     if (regex.includes("@")) explained.push({ part: "@", desc: "Literal '@' character." })
     if (regex.includes("\\d")) explained.push({ part: "\\d", desc: "Matches any digit (0-9)." })
     if (regex.includes("+")) explained.push({ part: "+", desc: "Quantifier: matches 1 or more of the previous token." })
     if (regex.includes("*")) explained.push({ part: "*", desc: "Quantifier: matches 0 or more of the previous token." })
     if (regex.includes("(")) explained.push({ part: "(...)", desc: "Capturing group: groups multiple tokens together." })
     if (regex.includes("[")) explained.push({ part: "[...]", desc: "Character set: matches any character inside." })
     return explained
  }, [regex])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-rose-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
            <Target className="w-3 h-3 animate-pulse" />
            Theory Lab: Pattern (Regex)
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Expression Editor */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Pattern</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Regex Laboratory</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest italic">Regular Expression</label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 font-mono">/</span>
                       <input 
                         type="text" value={regex} onChange={(e) => setRegex(e.target.value)}
                         className={cn(
                            "w-full bg-black/40 border border-white/5 p-4 pl-8 rounded-2xl font-mono text-sm outline-none transition-all",
                            error ? "border-rose-500/50 shadow-[0_0_20px_#ef444410]" : "focus:border-rose-500/40"
                         )}
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 font-mono">/{flags}</span>
                    </div>
                    {error && <p className="text-[10px] text-rose-500 italic mt-2 animate-pulse">{error}</p>}
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest">Active Flags</label>
                    <div className="flex gap-2">
                       {["g", "i", "m"].map(f => (
                          <button 
                            key={f} onClick={() => setFlags(flags.includes(f) ? flags.replace(f, '') : flags + f)}
                            className={cn("px-4 py-2 rounded-xl border text-[10px] font-black transition-all", flags.includes(f) ? "bg-rose-500/10 border-rose-500/40 text-rose-500" : "bg-white/5 border-white/5 text-gray-700")}
                          >
                             {f.toUpperCase()}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <BookOpen className="w-3 h-3 text-rose-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Syntax Breakdown</h3>
              </div>
              <div className="space-y-3 h-64 overflow-y-auto custom-scrollbar pr-2">
                 {explanation.map((e, i) => (
                    <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
                       <p className="text-[11px] font-mono text-rose-400">{e.part}</p>
                       <p className="text-[9px] text-gray-600 italic leading-snug">{e.desc}</p>
                    </div>
                 ))}
                 {explanation.length === 0 && <p className="italic opacity-10 text-center mt-12 lowercase text-[10px]">waiting for tokens...</p>}
              </div>
           </div>
        </section>

        {/* Global Matcher View */}
        <section className="lg:col-span-3 space-y-6">
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 md:p-12 h-auto min-h-[350px] relative flex flex-col gap-6">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Search className="w-64 h-64 text-rose-500" />
              </div>

              <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                     <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-rose-500" />
                        <h3 className="text-sm font-black italic uppercase tracking-widest">Input Stream Matcher</h3>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="text-left sm:text-right">
                           <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 italic">Total Matches</p>
                           <p className="text-2xl font-black italic tracking-tighter leading-none text-rose-500">{matches.length}</p>
                        </div>
                     </div>
                  </div>
                                  <div className="bg-black/40 rounded-[32px] border border-white/5 p-6 sm:p-10 min-h-[180px] relative focus-within:border-rose-500/20 transition-colors">
                     <div className="absolute inset-x-6 sm:inset-x-10 top-6 sm:top-10 pointer-events-none text-transparent break-all font-mono text-sm sm:text-xl leading-[1.8] whitespace-pre-wrap">
                        {testString.split("").map((char, i) => {
                           const isMatch = matches.some(m => i >= m.index && i < m.index + m[0].length)
                           return <span key={i} className={cn(isMatch && "bg-rose-500/20 rounded shadow-[0_0_15px_#f43f5e20] text-rose-400 font-black")}>{char}</span>
                        })}
                     </div>
                     <textarea 
                       value={testString} onChange={(e) => setTestString(e.target.value)}
                       className="w-full h-full bg-transparent border-none outline-none font-mono text-sm sm:text-xl leading-[1.8] text-white/40 resize-none whitespace-pre-wrap min-h-[120px]"
                       spellCheck={false}
                     />
                  </div>
              </div>
           </div>

           {/* Match Results Grid */}
            <div className="h-auto sm:h-64 glass rounded-[40px] border-white/5 p-6 sm:p-10 flex flex-col sm:flex-row gap-6 sm:gap-10 overflow-hidden">
               <div className="w-full sm:w-24 h-24 rounded-[32px] bg-rose-500/5 border border-rose-500/20 flex sm:flex-col items-center justify-center text-rose-500 shrink-0 gap-3 sm:gap-1">
                  <Layers className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-[8px] font-black uppercase tracking-tighter opacity-50">GROUPS</span>
               </div>

               <div className="flex-1 overflow-x-auto sm:overflow-x-auto custom-scrollbar flex flex-col sm:flex-row gap-6 items-stretch sm:items-center pb-4">
                  <AnimatePresence>
                     {matches.map((m, i) => (
                        <motion.div 
                          key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          className="min-w-[200px] p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4"
                        >
                           <div className="flex justify-between items-center border-b border-white/5 pb-3">
                              <span className="text-[10px] font-black italic text-rose-500 uppercase tracking-widest">Match #{i+1}</span>
                              <span className="text-[9px] font-mono text-gray-700">INDEX: {m.index}</span>
                           </div>
                           <div className="space-y-4">
                              <div className="p-3 bg-black/40 rounded-xl">
                                 <p className="text-[8px] font-black uppercase text-gray-700 tracking-widest mb-1 leading-none">Full Value</p>
                                 <p className="text-sm font-mono text-white truncate">{m[0]}</p>
                              </div>
                              {m.slice(1).map((group, gi) => (
                                 <div key={gi} className="p-3 border border-rose-500/10 rounded-xl bg-rose-500/5">
                                    <p className="text-[8px] font-black uppercase text-rose-400/50 tracking-widest mb-1 leading-none">Capture Group {gi + 1}</p>
                                    <p className="text-[11px] font-mono text-rose-400 italic truncate font-black">{group || "null"}</p>
                                 </div>
                              ))}
                           </div>
                        </motion.div>
                     ))}
                     {matches.length === 0 && (
                        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-800 opacity-20 italic p-12">
                           <AlertCircle className="w-8 h-8" />
                           <p className="text-lg sm:text-xl font-black italic uppercase tracking-[0.2em] text-center">No Results Found</p>
                        </div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
        </section>
      </div>
    </main>
  )
}
