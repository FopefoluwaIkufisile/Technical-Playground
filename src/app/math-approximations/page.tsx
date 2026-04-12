"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Sigma, Calculator, ChevronRight, Info } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { discrete, continuous } from "@/lib/probability"
import MathRenderer from "@/components/Math"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "📊 Convergence" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

type ComparisonType = "poisson-binomial" | "normal-binomial" | "normal-poisson"
const COMPARE_CONFIGS: Record<ComparisonType, { name: string; base: string; target: string; params: Record<string, { min: number; max: number; step: number; default: number; label: string }>; rule: string; description: string; condition: string }> = {
  "poisson-binomial": {
    name: "Poisson on Binomial",
    base: "X \\sim \\text{Binomial}(n, p)", target: "X \\approx \\text{Poisson}(\\lambda = np)",
    params: { n: { min: 10, max: 200, step: 1, default: 50, label: "Trials (n)" }, p: { min: 0.01, max: 0.5, step: 0.01, default: 0.05, label: "P(success)" } },
    rule: "n \\ge 20, \\; p \\le 0.05",
    description: "When n is large and p is small, the Binomial is well-approximated by Poisson. The mean λ = np captures the average number of successes.",
    condition: "Rare events in many trials (e.g., defects in a large factory, rare disease in population screening).",
  },
  "normal-binomial": {
    name: "Normal on Binomial",
    base: "X \\sim \\text{Binomial}(n, p)", target: "X \\approx N(\\mu=np,\\; \\sigma=\\sqrt{npq})",
    params: { n: { min: 10, max: 100, step: 1, default: 40, label: "Trials (n)" }, p: { min: 0.1, max: 0.9, step: 0.05, default: 0.5, label: "P(success)" } },
    rule: "np > 5, \\; n(1-p) > 5",
    description: "As n increases, the Binomial histogram converges to a bell curve shape — a direct consequence of the Central Limit Theorem applied to Bernoulli sums.",
    condition: "The Normal is better than Poisson when p is moderate (not too small). Use continuity correction for best accuracy.",
  },
  "normal-poisson": {
    name: "Normal on Poisson",
    base: "X \\sim \\text{Poisson}(\\lambda)", target: "X \\approx N(\\mu=\\lambda,\\; \\sigma=\\sqrt{\\lambda})",
    params: { lambda: { min: 1, max: 50, step: 1, default: 10, label: "Rate (λ)" } },
    rule: "\\lambda > 10",
    description: "For large λ, Poisson becomes symmetric (skewness = 1/√λ → 0) and approximates Normal. E[X] = Var(X) = λ, so σ = √λ.",
    condition: "High-rate processes where the Normal approximation allows using z-tables instead of summing Poisson PMFs.",
  },
}

export default function ConvergePage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-violet-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Sigma className="w-3 h-3" /> Approximations · Statistics
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-violet-400 bg-clip-text text-transparent">Distribution Limits</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">Why and when one distribution approximates another — the Binomial→Poisson limit, the Normal approximation, continuity correction, and the mathematics of convergence in distribution.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "simulator" && <SimulatorTab />}
            {tab === "deepdive" && <DeepDiveTab />}
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
            <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20"><Sigma className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Why Approximate?</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Computing exact probabilities for large-n Binomial or large-λ Poisson requires calculating enormous factorials. For example, <code className="text-violet-400 text-xs">C(1000, 500)</code> is computationally impractical by hand. Approximating with Normal or Poisson allows using simple formulas and Z-tables.
          </p>
          <div className="space-y-3">
            {Object.entries(COMPARE_CONFIGS).map(([id, cfg]) => (
              <div key={id} className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/15 space-y-2">
                <p className="text-[10px] font-black text-violet-400 uppercase">{cfg.name}</p>
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg">
                  <MathRenderer tex={cfg.rule} className="text-[9px] text-violet-300" />
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{cfg.condition}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Continuity Correction</h3>
          <p className="text-sm text-gray-400 leading-relaxed">When approximating a <strong className="text-white">discrete</strong> distribution (Binomial, Poisson) with a <strong className="text-white">continuous</strong> one (Normal), a continuity correction significantly improves accuracy. A discrete P(X=k) maps to continuous P(k-0.5 ≤ Y ≤ k+0.5).</p>
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/15 space-y-3">
            <p className="text-[10px] font-black text-violet-400 uppercase">Correction Rules</p>
            {[
              { exact: "P(X = k)", corrected: "P(k - 0.5 \\le Y \\le k + 0.5)" },
              { exact: "P(X \\le k)", corrected: "P(Y \\le k + 0.5)" },
              { exact: "P(X \\ge k)", corrected: "P(Y \\ge k - 0.5)" },
              { exact: "P(X < k)", corrected: "P(Y < k - 0.5)" },
            ].map(r => (
              <div key={r.exact} className="flex items-center gap-3 text-[9px]">
                <div className="bg-black/40 px-3 py-1.5 rounded-lg min-w-[90px]"><MathRenderer tex={r.exact} className="text-gray-400" /></div>
                <span className="text-gray-700">→</span>
                <div className="bg-violet-500/10 px-3 py-1.5 rounded-lg"><MathRenderer tex={r.corrected} className="text-violet-300" /></div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-[10px] font-black text-amber-400 mb-1">Why it helps</p>
            <p className="text-[10px] text-gray-500 leading-relaxed">Without correction, P(X≤10) in Normal uses a point-value boundary. With correction, it includes the full probability mass at k=10 (from 9.5 to 10.5). This reduces approximation error by up to 50% for small n.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [compType, setCompType] = useState<ComparisonType>("normal-binomial")
  const [params, setParams] = useState<Record<string, number>>({ n: 40, p: 0.5 })
  const [useCC, setUseCC] = useState(true)

  const handleCompChange = (type: ComparisonType) => {
    setCompType(type)
    const np: Record<string, number> = {}
    Object.entries(COMPARE_CONFIGS[type].params).forEach(([k, v]) => np[k] = v.default)
    setParams(np)
  }

  const chartData = useMemo(() => {
    const data: { k: number; exact: number; approx: number }[] = []
    let range = 50
    if (compType === "normal-binomial") range = params.n
    if (compType === "poisson-binomial") range = params.n
    if (compType === "normal-poisson") range = Math.max(30, params.lambda * 2)

    for (let k = 0; k <= range; k++) {
      let exact = 0, approx = 0
      if (compType === "poisson-binomial") {
        exact = discrete.binomial(k, params.n, params.p)
        approx = discrete.poisson(k, params.n * params.p)
      } else if (compType === "normal-binomial") {
        exact = discrete.binomial(k, params.n, params.p)
        const mu = params.n * params.p, sigma = Math.sqrt(params.n * params.p * (1 - params.p))
        approx = useCC ? continuous.normalCDF(k + 0.5, mu, sigma) - continuous.normalCDF(k - 0.5, mu, sigma) : continuous.normal(k, mu, sigma)
      } else if (compType === "normal-poisson") {
        exact = discrete.poisson(k, params.lambda)
        const mu = params.lambda, sigma = Math.sqrt(params.lambda)
        approx = useCC ? continuous.normalCDF(k + 0.5, mu, sigma) - continuous.normalCDF(k - 0.5, mu, sigma) : continuous.normal(k, mu, sigma)
      }
      data.push({ k, exact, approx })
    }
    const threshold = 0.001
    const first = data.findIndex(d => d.exact > threshold || d.approx > threshold)
    const last = [...data].reverse().findIndex(d => d.exact > threshold || d.approx > threshold)
    return data.slice(Math.max(0, first - 2), Math.max(0, data.length - last + 2))
  }, [compType, params, useCC])

  const metrics = useMemo(() => {
    const errors = chartData.map(d => Math.abs(d.exact - d.approx))
    return { max: Math.max(...errors).toFixed(4), avg: (errors.reduce((a, b) => a + b, 0) / errors.length).toFixed(4) }
  }, [chartData])

  const maxVal = Math.max(...chartData.map(d => Math.max(d.exact, d.approx)), 0.01)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-[28px] border-white/5 space-y-4">
            <select value={compType} onChange={e => handleCompChange(e.target.value as ComparisonType)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-violet-400 focus:border-violet-500 outline-none">
              {Object.entries(COMPARE_CONFIGS).map(([id, c]) => <option key={id} value={id}>{c.name}</option>)}
            </select>
            {Object.entries(COMPARE_CONFIGS[compType].params).map(([key, cfg]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-black uppercase text-gray-600"><span>{cfg.label}</span><span className="text-violet-400 font-mono">{params[key]}</span></div>
                <input type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={params[key]} onChange={e => setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-violet-600" />
              </div>
            ))}
            {(compType === "normal-binomial" || compType === "normal-poisson") && (
              <button onClick={() => setUseCC(!useCC)} className={cn("w-full flex items-center justify-between p-3 rounded-xl border transition-all", useCC ? "bg-violet-500/10 border-violet-500/30" : "bg-white/3 border-white/5 opacity-60")}>
                <div><p className="text-[10px] font-black text-left">Continuity Correction</p><p className="text-[8px] text-gray-600 font-mono">P(k-0.5 &lt; Y &lt; k+0.5)</p></div>
                <div className={cn("w-2 h-2 rounded-full", useCC ? "bg-violet-400" : "bg-gray-800")} />
              </button>
            )}
          </div>
          <div className="glass p-4 rounded-2xl border-violet-500/10 space-y-3">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-gray-600"><Calculator className="w-3 h-3 text-violet-400" />Error Metrics</div>
            {[{ label: "Max |exact - approx|", value: metrics.max, color: "text-red-400" }, { label: "Mean Abs Error", value: metrics.avg, color: "text-violet-400" }].map(s => (
              <div key={s.label}><p className="text-[8px] text-gray-700 uppercase font-black">{s.label}</p><p className={cn("text-lg font-black font-mono", s.color)}>{s.value}</p></div>
            ))}
          </div>
          <div className="glass p-4 rounded-2xl border-white/5">
            <p className="text-[9px] uppercase font-black text-gray-600 mb-2">Rule</p>
            <div className="bg-black/40 p-2.5 rounded-lg"><MathRenderer tex={COMPARE_CONFIGS[compType].rule} className="text-violet-300 text-[9px]" /></div>
            <p className="text-[10px] text-gray-500 leading-relaxed mt-2">{COMPARE_CONFIGS[compType].description}</p>
          </div>
        </div>

        <div className="lg:col-span-3 glass p-6 rounded-[32px] border-white/5 space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-black">{COMPARE_CONFIGS[compType].name}</p>
              <p className="text-[9px] text-gray-600 mt-0.5">Watch how the bars align — lower error = better approximation</p>
            </div>
            <div className="flex gap-4">
              {[{ color: "bg-white/20 border-white/40", label: "Exact" }, { color: "bg-violet-500/40 border-t-2 border-violet-400", label: "Approx" }].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 border", l.color)} />
                  <span className="text-[8px] uppercase font-black text-gray-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end justify-between gap-0.5 h-64 px-2">
            {chartData.map((d, i) => {
              return (
                <div key={i} className="flex-1 flex flex-col items-center group max-w-[40px]">
                  <div className="w-full relative h-52 flex items-end">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(d.exact / maxVal) * 100}%` }} transition={{ type: "spring", stiffness: 100, delay: i * 0.01 }} className="w-[70%] mx-auto bg-white/20 border-x border-t border-white/40 rounded-t-sm z-10" />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(d.approx / maxVal) * 100}%` }} transition={{ type: "spring", stiffness: 100, delay: i * 0.01 }} className="absolute inset-x-0 bottom-0 bg-violet-500/40 border-t-2 border-violet-400 rounded-t-sm z-0" />
                  </div>
                  <span className="mt-1.5 text-[8px] font-mono text-gray-700 group-hover:text-white">{d.k}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function DeepDiveTab() {
  return (
    <div className="space-y-6">
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Convergence in Distribution</h3>
        <p className="text-sm text-gray-400 leading-relaxed">The formal mathematical framework behind distribution approximations is <strong className="text-white">convergence in distribution</strong> (also called weak convergence). A sequence of random variables X_n converges in distribution to X if the CDFs converge at every continuity point.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black/40 p-5 rounded-2xl border border-violet-500/10 space-y-3">
            <p className="text-[10px] font-black text-violet-400">Formal Definition</p>
            <MathRenderer tex="X_n \xrightarrow{d} X \iff F_{X_n}(x) \to F_X(x)" block className="text-[9px] text-gray-400" />
            <MathRenderer tex="\text{for all } x \text{ where } F_X \text{ is continuous}" block className="text-[9px] text-gray-600" />
            <p className="text-[10px] text-gray-500 mt-2">The Binomial→Normal convergence is just the CLT applied to sums of Bernoulli(p) variables: by CLT, (X - np)/√(np(1-p)) → N(0,1).</p>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
              <p className="text-[10px] font-black text-violet-400">Poisson Limit Theorem</p>
              <p className="text-[10px] text-gray-500">As n→∞ and p→0 with np=λ (constant):</p>
              <MathRenderer tex="\binom{n}{k}p^k(1-p)^{n-k} \to \frac{e^{-\lambda}\lambda^k}{k!}" block className="text-[9px] text-gray-400" />
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
              <p className="text-[10px] font-black text-amber-400">Rate of Convergence</p>
              <p className="text-[10px] text-gray-500">Berry-Esseen theorem: the error in Normal approx to Binomial is O(1/√n). For Poisson→Normal, error is O(1/√λ). These bounds tell you how big n (or λ) needs to be for a given precision.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("wrong-direction")
  const pitfalls = [
    { id: "wrong-direction", severity: "MED", title: "Using the Wrong Approximation Direction",
      summary: "Using Poisson to approximate Binomial when p is large (not small), or Normal for Poisson when λ is small (skewed). The approximations work in specific parameter regimes.",
      bad: `// ❌ Poisson approximation when p is large:
// Binomial(n=50, p=0.4) — p is NOT small
X ~ Poisson(λ=20)  // Wrong! Poisson is skewed; Binomial here is symmetric
// Error is large — shapes don't match

// ❌ Normal approximation with small n or extreme p:
// Binomial(n=10, p=0.05): np = 0.5 << 5
// np > 5 condition VIOLATED
// Normal gives negative probability for low values — absurd!
X ~ Normal(0.5, 0.475)  // P(X < -0.5) > 0 in Normal — impossible for Binomial`,
      good: `// ✅ Check conditions BEFORE approximating:
n, p = 50, 0.4
np = n * p  # = 20
nq = n * (1-p)  # = 30

// Poisson valid? p=0.4 >> 0.05 → NO, use Normal instead
// Normal valid? np=20>5, nq=30>5 → YES ✓

// ✅ Small n, extreme p → exact Binomial
n, p = 10, 0.05
np = 0.5  # << 5 → Normal fails
// Use exact Binomial or scipy.stats.binom.pmf

// Decision flowchart:
// n small (< 20): use Exact Binomial
// n large, p small (np < 5): use Poisson  
// n large, p moderate (np>5, nq>5): use Normal + continuity correction`,
    },
  ]
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Approximations are tools of last resort for large-n calculations. Always verify the conditions — applying the wrong approximation gives confidently wrong answers.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className="glass rounded-[24px] border border-orange-500/20 hover:border-orange-500/40 overflow-hidden transition-colors">
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black border bg-orange-500/20 text-orange-400 border-orange-500/30">{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Wrong</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Correct</p><pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
