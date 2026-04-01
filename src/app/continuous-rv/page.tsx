"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Target, Info, AreaChart, Calculator, Database, BookOpen, Settings2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { continuous } from "@/lib/probability"
import MathRenderer from "@/components/Math"

type DistributionType = "uniform" | "exponential" | "normal"

interface DistConfig {
  name: string
  params: { [key: string]: { min: number, max: number, step: number, default: number, label: string } }
  description: string
  formula: string
}

const DIST_CONFIGS: Record<DistributionType, DistConfig> = {
  uniform: {
    name: "Uniform",
    params: { 
      a: { min: -10, max: 10, step: 1, default: 0, label: "Lower Bound (a)" },
      b: { min: -10, max: 20, step: 1, default: 10, label: "Upper Bound (b)" }
    },
    formula: "f(x) = \\frac{1}{b-a} \\text{ for } a \\le x \\le b",
    description: "All outcomes in a finite interval [a, b] are equally likely."
  },
  exponential: {
    name: "Exponential",
    params: { lambda: { min: 0.1, max: 5, step: 0.1, default: 1, label: "Rate (λ)" } },
    formula: "f(x) = \\lambda e^{-\\lambda x} \\text{ for } x \\ge 0",
    description: "Describes the time between events in a Poisson process (events happening at a constant rate)."
  },
  normal: {
    name: "Normal (Gaussian)",
    params: { 
      mu: { min: -20, max: 20, step: 1, default: 0, label: "Mean (μ)" },
      sigma: { min: 0.5, max: 10, step: 0.5, default: 2, label: "Std Dev (σ)" }
    },
    formula: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}",
    description: "The classic bell curve. Central to the CLT and many natural phenomena."
  }
}

export default function ContinuousRVPage() {
  const [distType, setDistType] = useState<DistributionType>("normal")
  const [params, setParams] = useState<Record<string, number>>(() => {
    const p: Record<string, number> = {}
    Object.entries(DIST_CONFIGS[distType].params).forEach(([k, v]) => p[k] = v.default)
    return p
  })
  const [rangeA, setRangeA] = useState(-2)
  const [rangeB, setRangeB] = useState(2)

  const handleDistChange = (type: DistributionType) => {
    setDistType(type)
    const newParams: Record<string, number> = {}
    Object.entries(DIST_CONFIGS[type].params).forEach(([k, v]) => newParams[k] = v.default)
    setParams(newParams)
  }

  const chartData = useMemo(() => {
    const points: { x: number, y: number }[] = []
    const steps = 100
    let minX = -10, maxX = 10

    if (distType === "normal") { minX = params.mu - 4 * params.sigma; maxX = params.mu + 4 * params.sigma }
    if (distType === "exponential") { minX = 0; maxX = 5 / params.lambda }
    if (distType === "uniform") { minX = params.a - 2; maxX = params.b + 2 }

    const stepSize = (maxX - minX) / steps
    for (let i = 0; i <= steps; i++) {
        const x = minX + i * stepSize
        let y = 0
        switch(distType) {
            case "uniform": y = continuous.uniform(x, params.a, params.b); break
            case "exponential": y = continuous.exponential(x, params.lambda); break
            case "normal": y = continuous.normal(x, params.mu, params.sigma); break
        }
        points.push({ x, y })
    }
    return points
  }, [distType, params])

  const probability = useMemo(() => {
    switch(distType) {
        case "normal": return continuous.normalCDF(rangeB, params.mu, params.sigma) - continuous.normalCDF(rangeA, params.mu, params.sigma)
        case "uniform": 
            const uA = Math.max(rangeA, params.a), uB = Math.min(rangeB, params.b)
            return uB > uA ? (uB - uA) / (params.b - params.a) : 0
        case "exponential":
            const eCDF = (x: number) => 1 - Math.exp(-params.lambda * x)
            const eA = Math.max(0, rangeA), eB = Math.max(0, rangeB)
            return eCDF(eB) - eCDF(eA)
        default: return 0
    }
  }, [distType, params, rangeA, rangeB])

  const stats = useMemo(() => {
    let mean = 0, variance = 0
    switch(distType) {
        case "uniform": mean = (params.a + params.b) / 2; variance = Math.pow(params.b - params.a, 2) / 12; break
        case "exponential": mean = 1 / params.lambda; variance = 1 / Math.pow(params.lambda, 2); break
        case "normal": mean = params.mu; variance = Math.pow(params.sigma, 2); break
    }
    return { mean: mean.toFixed(2), variance: variance.toFixed(2), std: Math.sqrt(variance).toFixed(2) }
  }, [distType, params])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-indigo-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium flex items-center gap-2">
            <Target className="w-3 h-3 animate-pulse" />
            Theory Lab: Continuous RV
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Continuous</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Density Functions</p>
              </header>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest italic">Model Type</label>
                    <select 
                      value={distType} onChange={(e) => handleDistChange(e.target.value as DistributionType)}
                      className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl font-sans text-xs outline-none focus:border-indigo-500/40 transition-all appearance-none cursor-pointer"
                    >
                      {Object.entries(DIST_CONFIGS).map(([id, config]) => (
                          <option key={id} value={id}>{config.name}</option>
                      ))}
                    </select>
                 </div>

                 <div className="space-y-4 pt-2">
                    {Object.entries(DIST_CONFIGS[distType].params).map(([key, config]) => (
                      <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] font-bold uppercase text-gray-700">{config.label}</label>
                            <span className="text-[10px] font-mono text-indigo-400">{params[key]}</span>
                          </div>
                          <input 
                            type="range" min={config.min} max={config.max} step={config.step} value={params[key]}
                            onChange={(e) => setParams(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                            className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-[32px] border-indigo-500/10 space-y-4">
              <div className="flex items-center gap-2">
                 <Calculator className="w-3 h-3 text-indigo-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest italic">Area Integrator</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <RangeInput label="From (a)" value={rangeA} onChange={setRangeA} />
                 <RangeInput label="To (b)" value={rangeB} onChange={setRangeB} />
              </div>
              <div className="pt-4 border-t border-white/5">
                 <p className="text-[8px] font-bold text-gray-700 uppercase mb-1 italic">Probability P(a ≤ X ≤ b)</p>
                 <p className="text-3xl font-black italic text-indigo-400">{(probability * 100).toFixed(2)}%</p>
              </div>
           </div>
        </section>

        <section className="lg:col-span-3 space-y-6">
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 min-h-[450px] relative flex flex-col gap-8">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <AreaChart className="w-64 h-64 text-indigo-500" />
              </div>

              <div className="relative z-10 flex flex-col gap-6 h-full flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-sm font-black italic uppercase tracking-widest">{DIST_CONFIGS[distType].name} Density</h3>
                     </div>
                     <div className="grid grid-cols-3 gap-6">
                        <StatItem label="μ" value={stats.mean} />
                        <StatItem label="Var(X)" value={stats.variance} />
                        <StatItem label="σ" value={stats.std} />
                     </div>
                  </div>

                  {/* SVG Line Chart */}
                  <div className="flex-1 min-h-[300px] w-full relative">
                      <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible preserve-3d">
                          {/* Shaded Area */}
                          {(() => {
                             if (chartData.length < 2) return null
                             const minX = chartData[0].x, maxX = chartData[chartData.length - 1].x
                             const range = maxX - minX
                             const maxY = Math.max(...chartData.map(p => p.y), 0.01)
                             
                             const points = chartData.filter(p => p.x >= rangeA && p.x <= rangeB)
                             if (points.length < 1) return null
                             
                             const pathData = points.map((p, i) => {
                                const x = ((p.x - minX) / range) * 1000
                                const y = 400 - (p.y / maxY) * 350
                                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                             }).join(' ') + ` L ${((points[points.length-1].x - minX) / range) * 1000} 400 L ${((points[0].x - minX) / range) * 1000} 400 Z`

                             return <motion.path d={pathData} fill="rgba(99, 102, 241, 0.15)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
                          })()}

                          {/* Line Path */}
                          {(() => {
                             const minX = chartData[0].x, maxX = chartData[chartData.length - 1].x
                             const range = maxX - minX
                             const maxY = Math.max(...chartData.map(p => p.y), 0.01)

                             const pathData = chartData.map((p, i) => {
                                const x = ((p.x - minX) / range) * 1000
                                const y = 400 - (p.y / maxY) * 350
                                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                             }).join(' ')

                             return <motion.path d={pathData} fill="none" stroke="#6366f1" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
                          })()}

                          {/* X-Axis Labels */}
                          {[0, 250, 500, 750, 1000].map(xPos => {
                             const minX = chartData[0].x, maxX = chartData[chartData.length - 1].x
                             const val = (minX + (xPos / 1000) * (maxX - minX)).toFixed(1)
                             return (
                                <g key={xPos} transform={`translate(${xPos}, 420)`}>
                                   <text textAnchor="middle" fill="#475569" className="text-[10px] font-mono">{val}</text>
                                </g>
                             )
                          })}
                      </svg>
                  </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Mathematical Model</h4>
                 </div>
                  <div className="bg-black/40 p-4 rounded-xl flex justify-center py-6">
                    <MathRenderer tex={DIST_CONFIGS[distType].formula} block />
                  </div>
                 <p className="text-sm font-light leading-relaxed text-gray-300 italic">
                    {DIST_CONFIGS[distType].description}
                 </p>
              </div>

              <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Settings2 className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Theory Insight</h4>
                 </div>
                 <p className="text-sm font-light leading-relaxed text-gray-300 italic">
                    {getContinuousInsight(distType, params)}
                 </p>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-right">
       <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 italic">{label}</p>
       <p className="text-xl font-black italic tracking-tighter leading-none text-indigo-400">{value}</p>
    </div>
  )
}

function RangeInput({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
       <label className="text-[8px] font-bold text-gray-700 uppercase">{label}</label>
       <input 
         type="number" step="0.1" value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
         className="w-full bg-black/40 border border-white/5 p-2 rounded-xl font-mono text-[10px] text-indigo-300 focus:border-indigo-500/40 outline-none"
       />
    </div>
  )
}

function getContinuousInsight(type: DistributionType, params: Record<string, number>) {
  switch(type) {
    case "uniform": return `The constant density implies that the probability of falling into any sub-interval is proportional to its length. Ideal for "random point" simulations.`
    case "exponential": return `Characterized by its "memoryless" property. The time until the next event does not depend on how much time has already passed.`
    case "normal": return `Nearly 68% of the data falls within 1 standard deviation (σ) of the mean (μ), and 95% within 2σ. This is the 68-95-99.7 rule.`
    default: return ""
  }
}
