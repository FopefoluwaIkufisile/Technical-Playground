"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Target, Info, Calculator, Database, BookOpen, Layers, Zap, GitBranch, RefreshCw } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import MathRenderer from "@/components/Math"

export default function ConditionalProbPage() {
  const [probA, setProbA] = useState(0.6)
  const [probB, setProbB] = useState(0.5)
  const [intersection, setIntersection] = useState(0.3)
  const [view, setView] = useState<"venn" | "tree">("venn")

  // Ensure intersection is valid: P(A ∩ B) <= min(P(A), P(B)) and P(A ∩ B) >= P(A) + P(B) - 1
  const validIntersection = useMemo(() => {
    const min = Math.max(0, probA + probB - 1)
    const max = Math.min(probA, probB)
    return Math.min(Math.max(intersection, min), max)
  }, [probA, probB, intersection])

  const condAB = validIntersection / probB
  const condBA = validIntersection / probA

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-emerald-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <Zap className="w-3 h-3 animate-pulse" />
            Theory Lab: Bridge (Conditional)
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Conditional</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Dependent Events</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-4">
                    <ParamSlider label="P(A)" value={probA} onChange={setProbA} color="emerald" />
                    <ParamSlider label="P(B)" value={probB} onChange={setProbB} color="blue" />
                    <ParamSlider label="P(A ∩ B)" value={intersection} onChange={setIntersection} color="indigo" min={Math.max(0, probA + probB - 1)} max={Math.min(probA, probB)} />
                 </div>

                 <div className="pt-6 border-t border-white/5 flex gap-2">
                    <button 
                      onClick={() => setView("venn")}
                      className={cn("flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all", view === "venn" ? "bg-emerald-500/20 border border-emerald-500" : "bg-white/5 border border-white/5 opacity-40")}
                    >
                       <Layers className="w-4 h-4" />
                       <span className="text-[8px] font-black uppercase">Venn</span>
                    </button>
                    <button 
                      onClick={() => setView("tree")}
                      className={cn("flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all", view === "tree" ? "bg-blue-500/20 border border-blue-500" : "bg-white/5 border border-white/5 opacity-40")}
                    >
                       <GitBranch className="w-4 h-4" />
                       <span className="text-[8px] font-black uppercase">Tree</span>
                    </button>
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-[32px] border-emerald-500/10 space-y-4">
              <div className="flex items-center gap-2">
                 <Calculator className="w-3 h-3 text-emerald-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest italic">Inference Engine</h3>
              </div>
              <div className="space-y-4">
                 <FormulaItem label="P(A|B)" result={condAB} formula={`P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{${validIntersection.toFixed(2)}}{${probB.toFixed(2)}}`} />
                 <FormulaItem label="P(B|A)" result={condBA} formula={`P(B|A) = \\frac{P(A \\cap B)}{P(A)} = \\frac{${validIntersection.toFixed(2)}}{${probA.toFixed(2)}}`} />
              </div>
           </div>
        </section>

        <section className="lg:col-span-3 space-y-6">
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 min-h-[450px] relative flex flex-col gap-8 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <RefreshCw className="w-64 h-64 text-emerald-500" />
              </div>

              <div className="relative z-10 flex flex-col gap-6 h-full flex-1">
                  <header className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        <h3 className="text-sm font-black italic uppercase tracking-widest">Visual Logic Stream</h3>
                     </div>
                     <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                        {intersection === probA * probB ? "Independent" : "Dependent"}
                     </div>
                  </header>

                  <div className="flex-1 flex items-center justify-center relative min-h-[350px]">
                      {view === "venn" ? (
                        <div className="relative w-full h-full max-w-[500px] aspect-square flex items-center justify-center">
                           {/* Circle A */}
                           <motion.div 
                             animate={{ 
                               width: probA * 400, 
                               height: probA * 400,
                               x: -50 - (validIntersection / Math.min(probA, probB)) * 50
                             }}
                             className="absolute rounded-full border-2 border-emerald-500/50 bg-emerald-500/10 backdrop-blur-sm mix-blend-screen flex items-center justify-center"
                           >
                              <span className="text-[10px] font-black text-emerald-400 opacity-50">EVENT A</span>
                           </motion.div>

                           {/* Circle B */}
                           <motion.div 
                             animate={{ 
                               width: probB * 400, 
                               height: probB * 400,
                               x: 50 + (validIntersection / Math.min(probA, probB)) * 50
                             }}
                             className="absolute rounded-full border-2 border-blue-500/50 bg-blue-500/10 backdrop-blur-sm mix-blend-screen flex items-center justify-center"
                           >
                              <span className="text-[10px] font-black text-blue-400 opacity-50">EVENT B</span>
                           </motion.div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-12 w-full max-w-2xl font-mono text-[11px]">
                           <TreeNode label="ROOT (Ω)" value={1.0} color="gray" />
                           <div className="flex justify-around gap-12 relative">
                              <div className="absolute top-[-30px] left-1/4 w-[1px] h-[30px] bg-white/10 rotate-[45deg]" />
                              <div className="absolute top-[-30px] right-1/4 w-[1px] h-[30px] bg-white/10 rotate-[-45deg]" />
                              
                              <div className="flex-1 space-y-8">
                                 <TreeNode label="A occurs" value={probA} color="emerald" sub={probA.toFixed(2)} />
                                 <div className="flex justify-around gap-4 pt-4 border-t border-white/5">
                                    <TreeNode label="B|A" value={condBA} color="blue" small sub={condBA.toFixed(2)} />
                                    <TreeNode label="B'|A" value={1 - condBA} color="gray" small sub={(1-condBA).toFixed(2)} />
                                 </div>
                              </div>

                              <div className="flex-1 space-y-8">
                                 <TreeNode label="A' occurs" value={1 - probA} color="gray" sub={(1-probA).toFixed(2)} />
                                 <div className="flex justify-around gap-4 pt-4 border-t border-white/5">
                                    <TreeNode label="B|A'" value={(probB - validIntersection) / (1-probA)} color="blue" small sub={((probB - validIntersection) / (1-probA)).toFixed(2)} />
                                    <TreeNode label="B'|A'" value={1 - (probB - validIntersection) / (1-probA)} color="gray" small sub={(1 - (probB - validIntersection) / (1-probA)).toFixed(2)} />
                                 </div>
                              </div>
                           </div>
                        </div>
                      )}
                  </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-emerald-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Core Definitions</h4>
                 </div>
                 <div className="space-y-4 text-sm font-light text-gray-400">
                    <p><MathRenderer tex="\text{Intersection: } P(A \cap B)" className="text-emerald-400 font-bold mr-2" /> represents both events happening simultaneously.</p>
                    <p><MathRenderer tex="\text{Marginal: } P(A), P(B)" className="text-blue-400 font-bold mr-2" /> are the probabilities of single events regardless of others.</p>
                 </div>
              </div>

              <div className="glass p-8 rounded-[32px] border-emerald-500/20 bg-emerald-500/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5 text-emerald-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400/50">Bayes' Theorem</h4>
                 </div>
                 <div className="flex justify-center py-4">
                   <MathRenderer tex="P(A|B) = \frac{P(B|A) P(A)}{P(B)}" block className="text-emerald-300" />
                 </div>
                 <p className="text-sm font-light text-gray-300 leading-relaxed italic">
                    This fundamental law allows us to "flip" conditional probabilities. If we know P(B|A), we can find P(A|B).
                 </p>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function ParamSlider({ label, value, onChange, color, min = 0, max = 1 }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center">
          <label className="text-[9px] font-bold uppercase text-gray-700">{label}</label>
          <span className={cn("text-[10px] font-mono", color === "emerald" ? "text-emerald-400" : color === "blue" ? "text-blue-400" : "text-indigo-400")}>{value.toFixed(2)}</span>
       </div>
       <input 
         type="range" min={min} max={max} step="0.01" value={value}
         onChange={(e) => onChange(parseFloat(e.target.value))}
         className={cn("w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer", color === "emerald" ? "accent-emerald-500" : color === "blue" ? "accent-blue-500" : "accent-indigo-500")}
       />
    </div>
  )
}

function FormulaItem({ label, result, formula }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1">
       <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-emerald-400">{label}</span>
          <span className="text-base font-black italic text-white">{(result * 100).toFixed(1)}%</span>
       </div>
       <div className="border-t border-white/5 pt-2 mt-1">
          <MathRenderer tex={formula} className="text-[9px] text-gray-400 italic" />
       </div>
    </div>
  )
}

function TreeNode({ label, value, color, small, sub }: any) {
  return (
    <div className={cn(
        "p-4 rounded-2xl border flex flex-col items-center justify-center transition-all",
        color === "emerald" ? "bg-emerald-500/10 border-emerald-500/20" : color === "blue" ? "bg-blue-500/10 border-blue-500/20" : "bg-white/5 border-white/10",
        small && "scale-90"
    )}>
       <span className="text-[9px] font-black uppercase text-gray-500 mb-1">{label}</span>
       <div className="flex items-center gap-2">
          <div className="h-1 bg-gray-800 rounded-full w-12 overflow-hidden">
             <motion.div 
               animate={{ width: `${value * 100}%` }}
               className={cn("h-full", color === "emerald" ? "bg-emerald-500" : color === "blue" ? "bg-blue-500" : "bg-gray-600")}
             />
          </div>
          <span className="text-[10px] font-mono font-bold">{sub || value.toFixed(2)}</span>
       </div>
    </div>
  )
}
