"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Target, Info, BarChart3, Calculator, Database, BookOpen, Settings2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { discrete, factorial } from "@/lib/probability"
import MathRenderer from "@/components/Math"

type DistributionType = "bernoulli" | "binomial" | "poisson" | "geometric" | "hypergeometric"

interface DistConfig {
  name: string
  params: { [key: string]: { min: number, max: number, step: number, default: number, label: string } }
  description: string
  formula: string
}

const DIST_CONFIGS: Record<DistributionType, DistConfig> = {
  bernoulli: {
    name: "Bernoulli",
    params: { p: { min: 0, max: 1, step: 0.05, default: 0.5, label: "Probability (p)" } },
    formula: "P(X=1) = p, P(X=0) = 1-p",
    description: "The simplest discrete distribution: a single trial with two possible outcomes (success or failure)."
  },
  binomial: {
    name: "Binomial",
    params: { 
      n: { min: 1, max: 50, step: 1, default: 10, label: "Trials (n)" },
      p: { min: 0, max: 1, step: 0.05, default: 0.5, label: "Probability (p)" }
    },
    formula: "P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}",
    description: "Models the number of successes in n independent Bernoulli trials."
  },
  poisson: {
    name: "Poisson",
    params: { lambda: { min: 0.1, max: 20, step: 0.1, default: 4, label: "Rate (λ)" } },
    formula: "P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}",
    description: "Expresses the probability of a given number of events occurring in a fixed interval of time or space."
  },
  geometric: {
    name: "Geometric",
    params: { p: { min: 0.05, max: 1, step: 0.05, default: 0.3, label: "Probability (p)" } },
    formula: "P(X=k) = (1-p)^{k-1} p",
    description: "The number of trials needed to get the first success."
  },
  hypergeometric: {
    name: "Hypergeometric",
    params: {
      N: { min: 10, max: 100, step: 1, default: 50, label: "Population (N)" },
      K: { min: 1, max: 50, step: 1, default: 10, label: "Successes in Pop (K)" },
      n: { min: 1, max: 50, step: 1, default: 10, label: "Sample Size (n)" }
    },
    formula: "P(X=k) = \\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}}",
    description: "Sampling successes from a population without replacement."
  }
}

export default function DiscreteRVPage() {
  const [distType, setDistType] = useState<DistributionType>("binomial")
  const [params, setParams] = useState<Record<string, number>>(() => {
    const p: Record<string, number> = {}
    Object.entries(DIST_CONFIGS[distType].params).forEach(([k, v]) => p[k] = v.default)
    return p
  })
  const [customData, setCustomData] = useState<string>("")
  const [isSandboxMode, setIsSandboxMode] = useState(false)

  const handleDistChange = (type: DistributionType) => {
    setDistType(type)
    const newParams: Record<string, number> = {}
    Object.entries(DIST_CONFIGS[type].params).forEach(([k, v]) => newParams[k] = v.default)
    setParams(newParams)
  }

  const chartData = useMemo(() => {
    const data: { k: number, prob: number }[] = []
    
    if (isSandboxMode && customData) {
        const values = customData.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
        if (values.length > 0) {
            const counts: Record<number, number> = {}
            values.forEach(v => counts[v] = (counts[v] || 0) + 1)
            const min = Math.min(...values)
            const max = Math.max(...values)
            for (let i = min; i <= max; i++) {
                data.push({ k: i, prob: (counts[i] || 0) / values.length })
            }
            return data
        }
    }

    let range = 20
    if (distType === "binomial") range = params.n
    if (distType === "bernoulli") range = 1
    if (distType === "hypergeometric") range = Math.min(params.n, params.K)
    if (distType === "poisson") range = Math.max(20, params.lambda * 2)
    if (distType === "geometric") range = 20

    for (let k = 0; k <= range; k++) {
      let prob = 0
      switch(distType) {
        case "bernoulli": prob = discrete.bernoulli(k, params.p); break
        case "binomial": prob = discrete.binomial(k, params.n, params.p); break
        case "poisson": prob = discrete.poisson(k, params.lambda); break
        case "geometric": prob = k === 0 ? 0 : discrete.geometric(k, params.p); break
        case "hypergeometric": prob = discrete.hypergeometric(k, params.N, params.K, params.n); break
      }
      data.push({ k, prob })
    }
    return data
  }, [distType, params, customData, isSandboxMode])

  const stats = useMemo(() => {
    let mean = 0, variance = 0
    if (isSandboxMode && customData) {
        const values = customData.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
        if (values.length > 0) {
            mean = values.reduce((a, b) => a + b, 0) / values.length
            variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
        }
    } else {
        switch(distType) {
          case "bernoulli": mean = params.p; variance = params.p * (1 - params.p); break
          case "binomial": mean = params.n * params.p; variance = params.n * params.p * (1 - params.p); break
          case "poisson": mean = params.lambda; variance = params.lambda; break
          case "geometric": mean = 1 / params.p; variance = (1 - params.p) / (params.p ** 2); break
          case "hypergeometric": 
            const { n, K, N } = params
            mean = n * (K / N)
            variance = n * (K / N) * ((N - K) / N) * ((N - n) / (N - 1))
            break
        }
    }
    return { mean: mean.toFixed(3), variance: variance.toFixed(3), std: Math.sqrt(variance).toFixed(3) }
  }, [distType, params, customData, isSandboxMode])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-blue-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-2">
            <Target className="w-3 h-3 animate-pulse" />
            Theory Lab: Discrete RV
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls Sidebar */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Discrete</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Distribution Logic</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
                        <button 
                          onClick={() => setIsSandboxMode(false)}
                          className={cn("flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all", !isSandboxMode ? "bg-blue-500 text-white" : "text-gray-500 hover:text-white")}
                        >Theoretical</button>
                        <button 
                          onClick={() => setIsSandboxMode(true)}
                          className={cn("flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all", isSandboxMode ? "bg-blue-500 text-white" : "text-gray-500 hover:text-white")}
                        >Sandbox</button>
                    </div>

                    {!isSandboxMode ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest italic">Model Type</label>
                          <select 
                            value={distType}
                            onChange={(e) => handleDistChange(e.target.value as DistributionType)}
                            className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl font-sans text-xs outline-none focus:border-blue-500/40 transition-all appearance-none cursor-pointer"
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
                                  <span className="text-[10px] font-mono text-blue-400">{params[key]}</span>
                                </div>
                                <input 
                                  type="range" min={config.min} max={config.max} step={config.step}
                                  value={params[key]}
                                  onChange={(e) => setParams(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                                  className="w-full accent-blue-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest italic">Input Data</label>
                        <textarea 
                          value={customData}
                          onChange={(e) => setCustomData(e.target.value)}
                          placeholder="e.g. 1, 2, 2, 3, 4, 1, 5"
                          className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl font-mono text-xs outline-none focus:border-blue-500/40 transition-all min-h-[120px] resize-none"
                        />
                        <p className="text-[8px] text-gray-600 italic">Separate values by commas to build an empirical PMF.</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <BookOpen className="w-3 h-3 text-blue-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Logic Breakdown</h3>
              </div>
              <div className="space-y-3">
                 <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex flex-col items-center gap-3">
                    <MathRenderer tex={isSandboxMode ? "\\text{Empirical PMF}" : DIST_CONFIGS[distType].formula} className="text-blue-400 font-bold" />
                    <p className="text-[9px] text-gray-400 italic leading-snug text-center">{isSandboxMode ? "Calculated from your raw input data stream." : DIST_CONFIGS[distType].description}</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Main Visualization Grid */}
        <section className="lg:col-span-3 space-y-6">
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 min-h-[450px] relative flex flex-col gap-8">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <BarChart3 className="w-64 h-64 text-blue-500" />
              </div>

              <div className="relative z-10 flex flex-col gap-6 h-full flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                        <Calculator className="w-4 h-4 text-blue-500" />
                        <h3 className="text-sm font-black italic uppercase tracking-widest">
                            {isSandboxMode ? "Data Snapshot" : `${DIST_CONFIGS[distType].name} PMF`}
                        </h3>
                     </div>
                     <div className="grid grid-cols-3 gap-6">
                        <StatItem label="E[X]" value={stats.mean} />
                        <StatItem label="Var(X)" value={stats.variance} />
                        <StatItem label="σ" value={stats.std} />
                     </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="flex-1 min-h-[300px] w-full relative group">
                      <div className="absolute inset-0 flex items-end justify-between px-2 sm:px-6">
                          {chartData.map((d, i) => {
                             const maxProb = Math.max(...chartData.map(cd => cd.prob), 0.1)
                             const height = (d.prob / maxProb) * 100
                             return (
                                <div key={i} className="flex-1 flex flex-col items-center group/bar max-w-[40px]">
                                   <div className="w-full relative h-[250px] flex items-end">
                                      <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.02 }}
                                        className={cn(
                                            "w-[85%] mx-auto rounded-t-lg relative group-hover/bar:bg-blue-400 transition-colors",
                                            d.prob > 0 ? "bg-blue-500/40 border-t border-x border-white/10" : "bg-transparent"
                                        )}
                                      >
                                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[8px] font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity z-20 pointer-events-none">
                                            {(d.prob * 100).toFixed(1)}%
                                         </div>
                                      </motion.div>
                                   </div>
                                   <span className="mt-4 text-[9px] font-mono text-gray-700 group-hover/bar:text-white transition-colors">{d.k}</span>
                                </div>
                             )
                          })}
                      </div>
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.05]">
                         {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-white" />)}
                      </div>
                  </div>
              </div>
           </div>

           {/* Scenario / Info Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Example Scenario</h4>
                 </div>
                 <p className="text-sm font-light leading-relaxed text-gray-300 italic">
                    {getScenarioText(distType, params)}
                 </p>
              </div>

              <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Settings2 className="w-5 h-5 text-blue-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Insight Hub</h4>
                 </div>
                 <div className="space-y-2">
                    <InsightItem label="Shape" text={getShapeText(distType, params)} />
                    <InsightItem label="Range" text={`Valuated from 0 to ${chartData.length - 1}`} />
                 </div>
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
       <p className="text-xl font-black italic tracking-tighter leading-none text-blue-400">{value}</p>
    </div>
  )
}

function InsightItem({ label, text }: { label: string, text: string }) {
  return (
    <div className="flex items-start gap-4">
       <span className="text-[8px] font-black uppercase text-blue-500 w-12 pt-1">{label}</span>
       <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{text}</p>
    </div>
  )
}

function getScenarioText(type: DistributionType, params: Record<string, number>) {
  switch(type) {
    case "bernoulli": return `A single coin flip where the probability of heads is ${params.p}. Expected value is ${params.p}.`
    case "binomial": return `Flipping a coin ${params.n} times. What is the probability of exactly k heads?`
    case "poisson": return `An average of ${params.lambda} users hit your server every minute. What are the odds of 0, 1, 2...?`
    case "geometric": return `How many sales calls do you need to make until the first person says "yes", given a ${params.p} success rate?`
    case "hypergeometric": return `Drawing from a deck of ${params.N} cards containing ${params.K} red cards. In a sample of ${params.n}, how many red cards appear?`
    default: return ""
  }
}

function getShapeText(type: DistributionType, params: Record<string, number>) {
  if (type === "poisson") return params.lambda > 10 ? "Approaches a Symmetric Normal Curve" : "Right-skewed"
  if (type === "binomial") return params.p === 0.5 ? "Symmetric" : params.p > 0.5 ? "Left-skewed" : "Right-skewed"
  return "Discrete intervals"
}
