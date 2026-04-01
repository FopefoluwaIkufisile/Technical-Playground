"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Target, Info, BarChart3, Calculator, Database, BookOpen, Settings2, Sigma, ArrowRightLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { discrete, continuous } from "@/lib/probability"
import MathRenderer from "@/components/Math"

type ComparisonType = "poisson-binomial" | "normal-binomial" | "normal-poisson"

interface CompareConfig {
  name: string
  base: string
  target: string
  params: { [key: string]: { min: number, max: number, step: number, default: number, label: string } }
  description: string
  rule: string
}

const COMPARE_CONFIGS: Record<ComparisonType, CompareConfig> = {
  "poisson-binomial": {
    name: "Poisson on Binomial",
    base: "X \\sim \\text{Binomial}(n, p)",
    target: "X \\approx \\text{Poisson}(\\lambda = np)",
    params: {
      n: { min: 10, max: 200, step: 1, default: 50, label: "Trials (n)" },
      p: { min: 0.01, max: 0.5, step: 0.01, default: 0.05, label: "Probability (p)" }
    },
    rule: "n \\ge 20, p \\le 0.05",
    description: "The Poisson distribution can approximate the Binomial when trials are many but success is rare."
  },
  "normal-binomial": {
    name: "Normal on Binomial",
    base: "X \\sim \\text{Binomial}(n, p)",
    target: "X \\approx N(\\mu=np, \\sigma=\\sqrt{npq})",
    params: {
      n: { min: 10, max: 100, step: 1, default: 40, label: "Trials (n)" },
      p: { min: 0.1, max: 0.9, step: 0.05, default: 0.5, label: "Probability (p)" }
    },
    rule: "np > 5, n(1-p) > 5",
    description: "As n increases, the discrete Binomial 'shape' converges to the continuous Normal bell curve."
  },
  "normal-poisson": {
    name: "Normal on Poisson",
    base: "X \\sim \\text{Poisson}(\\lambda)",
    target: "X \\approx N(\\mu=\\lambda, \\sigma=\\sqrt{\\lambda})",
    params: {
      lambda: { min: 1, max: 50, step: 1, default: 10, label: "Rate (λ)" }
    },
    rule: "\\lambda > 10",
    description: "For large rates, the Poisson distribution becomes symmetric and matches the Normal distribution."
  }
}

export default function ConvergePage() {
  const [compType, setCompType] = useState<ComparisonType>("normal-binomial")
  const [params, setParams] = useState<Record<string, number>>(() => {
    const p: Record<string, number> = {}
    Object.entries(COMPARE_CONFIGS[compType].params).forEach(([k, v]) => p[k] = v.default)
    return p
  })
  const [useContinuityCorrection, setUseContinuityCorrection] = useState(true)

  const handleCompChange = (type: ComparisonType) => {
    setCompType(type)
    const newParams: Record<string, number> = {}
    Object.entries(COMPARE_CONFIGS[type].params).forEach(([k, v]) => newParams[k] = v.default)
    setParams(newParams)
  }

  const chartData = useMemo(() => {
    const data: { k: number, exact: number, approx: number }[] = []
    let range = 50
    if (compType === "normal-binomial" || compType === "poisson-binomial") range = params.n
    if (compType === "normal-poisson") range = Math.max(30, params.lambda * 2)

    for (let k = 0; k <= range; k++) {
      let exact = 0, approx = 0
      
      if (compType === "poisson-binomial") {
          exact = discrete.binomial(k, params.n, params.p)
          approx = discrete.poisson(k, params.n * params.p)
      } else if (compType === "normal-binomial") {
          exact = discrete.binomial(k, params.n, params.p)
          const mu = params.n * params.p
          const sigma = Math.sqrt(params.n * params.p * (1 - params.p))
          if (useContinuityCorrection) {
              approx = continuous.normalCDF(k + 0.5, mu, sigma) - continuous.normalCDF(k - 0.5, mu, sigma)
          } else {
              approx = continuous.normal(k, mu, sigma)
          }
      } else if (compType === "normal-poisson") {
          exact = discrete.poisson(k, params.lambda)
          const mu = params.lambda
          const sigma = Math.sqrt(params.lambda)
          if (useContinuityCorrection) {
              approx = continuous.normalCDF(k + 0.5, mu, sigma) - continuous.normalCDF(k - 0.5, mu, sigma)
          } else {
              approx = continuous.normal(k, mu, sigma)
          }
      }
      data.push({ k, exact, approx })
    }
    // Filter to visible range to avoid crowding
    const threshold = 0.001
    const firstOccur = data.findIndex(d => d.exact > threshold || d.approx > threshold)
    const lastOccur = [...data].reverse().findIndex(d => d.exact > threshold || d.approx > threshold)
    return data.slice(Math.max(0, firstOccur - 5), Math.max(0, data.length - lastOccur + 5))
  }, [compType, params, useContinuityCorrection])

  const metrics = useMemo(() => {
    const errors = chartData.map(d => Math.abs(d.exact - d.approx))
    const maxError = Math.max(...errors)
    const avgError = errors.reduce((a, b) => a + b, 0) / errors.length
    return { maxError: maxError.toFixed(4), avgError: avgError.toFixed(4) }
  }, [chartData])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-violet-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium flex items-center gap-2">
            <Sigma className="w-3 h-3 animate-pulse" />
            Theory Lab: Converge
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Converge</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Distribution Limit</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest italic">Simulation Case</label>
                       <select 
                         value={compType} onChange={(e) => handleCompChange(e.target.value as ComparisonType)}
                         className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl font-sans text-xs outline-none focus:border-violet-500/40 transition-all appearance-none cursor-pointer"
                       >
                         {Object.entries(COMPARE_CONFIGS).map(([id, config]) => (
                             <option key={id} value={id}>{config.name}</option>
                         ))}
                       </select>
                    </div>

                    <div className="space-y-4 pt-2">
                       {Object.entries(COMPARE_CONFIGS[compType].params).map(([key, config]) => (
                         <div key={key} className="space-y-2">
                             <div className="flex justify-between items-center">
                               <label className="text-[9px] font-bold uppercase text-gray-700">{config.label}</label>
                               <span className="text-[10px] font-mono text-violet-400">{params[key]}</span>
                             </div>
                             <input 
                               type="range" min={config.min} max={config.max} step={config.step} value={params[key]}
                               onChange={(e) => setParams(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                               className="w-full accent-violet-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                             />
                         </div>
                       ))}
                    </div>

                    {(compType === "normal-binomial" || compType === "normal-poisson") && (
                        <button 
                          onClick={() => setUseContinuityCorrection(!useContinuityCorrection)}
                          className={cn(
                            "w-full p-4 rounded-2xl border flex items-center justify-between transition-all group",
                            useContinuityCorrection ? "bg-violet-500/20 border-violet-500/40" : "bg-white/5 border-white/5 opacity-50"
                          )}
                        >
                           <div className="text-left">
                              <p className="text-[10px] font-black uppercase text-violet-400">Continuity Correction</p>
                              <MathRenderer tex="P(X=k) \approx P(k-0.5 < Y < k+0.5)" className="text-[8px] text-gray-600 font-mono italic" />
                           </div>
                           <div className={cn("w-2 h-2 rounded-full", useContinuityCorrection ? "bg-violet-400 shadow-[0_0_8px_#a78bfa]" : "bg-gray-800")} />
                        </button>
                    )}
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-[32px] border-violet-500/10 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <BookOpen className="w-3 h-3 text-violet-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest italic">Heuristic Rule</h3>
              </div>
              <div className="bg-black/40 p-4 rounded-xl flex justify-center py-6">
                <MathRenderer tex={COMPARE_CONFIGS[compType].rule} className="text-violet-300" />
              </div>
              <p className="text-[10px] font-light leading-relaxed text-gray-300 italic mt-2">{COMPARE_CONFIGS[compType].description}</p>
           </div>
        </section>

        {/* Visualization */}
        <section className="lg:col-span-3 space-y-6">
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 min-h-[450px] relative flex flex-col gap-8 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <ArrowRightLeft className="w-64 h-64 text-violet-500" />
              </div>

              <div className="relative z-10 flex flex-col gap-6 h-full flex-1">
                  <header className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <BarChart3 className="w-4 h-4 text-violet-500" />
                        <h3 className="text-sm font-black italic uppercase tracking-widest">Convergence Delta</h3>
                     </div>
                     <div className="grid grid-cols-2 gap-8">
                        <StatItem label="Exact" value={COMPARE_CONFIGS[compType].base} color="text-white" isMath />
                        <StatItem label="Approx" value={COMPARE_CONFIGS[compType].target} color="text-violet-400" isMath />
                     </div>
                  </header>

                  {/* Chart */}
                  <div className="flex-1 min-h-[300px] w-full relative flex items-end justify-between px-2 sm:px-10">
                      {chartData.map((d, i) => {
                         const maxVal = Math.max(...chartData.map(cd => Math.max(cd.exact, cd.approx)), 0.1)
                         return (
                            <div key={i} className="flex-1 flex flex-col items-center group max-w-[50px]">
                               <div className="w-full relative h-[250px] flex items-end">
                                  {/* Exact Bar */}
                                  <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.exact / maxVal) * 100}%` }}
                                    className="w-[70%] mx-auto bg-white/20 border-x border-t border-white/40 rounded-t-lg z-10"
                                  />
                                  {/* Approx Line/Bar Overlay */}
                                  <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.approx / maxVal) * 100}%` }}
                                    className="absolute inset-x-0 bottom-0 bg-violet-500/40 border-t-2 border-violet-400 rounded-t-lg z-0"
                                  />
                               </div>
                               <span className="mt-4 text-[9px] font-mono text-gray-700 group-hover:text-white transition-colors">{d.k}</span>
                            </div>
                         )
                      })}
                      {/* Legend Overlay */}
                      <div className="absolute top-0 right-0 p-6 flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-white/30 border border-white/50" />
                             <span className="text-[8px] font-bold text-gray-500 uppercase">Exact (Discrete)</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-violet-500/50 border-t-2 border-violet-400" />
                             <span className="text-[8px] font-bold text-gray-500 uppercase">Approx (Continuous)</span>
                         </div>
                      </div>
                  </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-violet-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Error Distribution</h4>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-gray-700">Max Delta</p>
                        <p className="text-2xl font-black italic text-violet-400">{metrics.maxError}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-gray-700">Mean Abs Error</p>
                        <p className="text-2xl font-black italic text-white/40">{metrics.avgError}</p>
                    </div>
                 </div>
              </div>

              <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Settings2 className="w-5 h-5 text-violet-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Why approximate?</h4>
                 </div>
                 <p className="text-sm font-light leading-relaxed text-gray-300 italic">
                    Exact calculations for Large Factorials (n!) are computationally expensive. These limits simplify complex probability estimates into standard Normal areas.
                 </p>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function StatItem({ label, value, color, isMath }: { label: string, value: string, color: string, isMath?: boolean }) {
  return (
    <div className="text-right">
       <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 italic">{label}</p>
       {isMath ? (
         <div className="mt-1">
           <MathRenderer tex={value} className={cn("text-[10px] font-bold leading-none", color)} />
         </div>
       ) : (
         <p className={cn("text-xs font-bold leading-none mt-1", color)}>{value}</p>
       )}
    </div>
  )
}
