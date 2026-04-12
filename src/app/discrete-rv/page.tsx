"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Target, Calculator, Database, BookOpen, Settings2, ChevronRight, Info, BarChart3 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { discrete } from "@/lib/probability"
import MathRenderer from "@/components/Math"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "📊 PMF Chart" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

type DistributionType = "bernoulli" | "binomial" | "poisson" | "geometric" | "hypergeometric"
const DIST_CONFIGS: Record<DistributionType, { name: string; params: Record<string, { min: number; max: number; step: number; default: number; label: string }>; description: string; formula: string; realWorld: string }> = {
  bernoulli: { name: "Bernoulli", params: { p: { min: 0, max: 1, step: 0.05, default: 0.5, label: "Success prob (p)" } }, formula: "P(X=1) = p,\\; P(X=0) = 1-p", description: "Single binary trial — success (1) or failure (0). p is the probability of success. E[X] = p, Var(X) = p(1-p).", realWorld: "Coin flip, single click converts or doesn't, packet transmitted successfully or dropped." },
  binomial: { name: "Binomial", params: { n: { min: 1, max: 50, step: 1, default: 10, label: "Trials (n)" }, p: { min: 0, max: 1, step: 0.05, default: 0.5, label: "Success prob (p)" } }, formula: "P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}", description: "Number of successes in n independent Bernoulli trials. Each trial has the same success probability p. E[X] = np, Var(X) = np(1-p).", realWorld: "# of defective items in a batch, # correct answers guessing on a quiz, # of servers that fail in a data center in a month." },
  poisson: { name: "Poisson", params: { lambda: { min: 0.1, max: 20, step: 0.1, default: 4, label: "Rate (λ)" } }, formula: "P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}", description: "Number of events in a fixed time/space interval when events occur at constant rate λ. No theoretical upper bound. E[X] = Var(X) = λ.", realWorld: "Server requests per second, customer arrivals per hour, emails per day, defects per square meter of fabric." },
  geometric: { name: "Geometric", params: { p: { min: 0.05, max: 1, step: 0.05, default: 0.3, label: "Success prob (p)" } }, formula: "P(X=k) = (1-p)^{k-1} p", description: "Number of trials until the first success. 'Memory-less' in discrete space — past failures don't make success more likely. E[X] = 1/p.", realWorld: "# of attempts until first correct password, # of calls until first sale, # of dice rolls until first six." },
  hypergeometric: { name: "Hypergeometric", params: { N: { min: 10, max: 100, step: 1, default: 50, label: "Population (N)" }, K: { min: 1, max: 50, step: 1, default: 10, label: "Successes K" }, n: { min: 1, max: 50, step: 1, default: 10, label: "Sample size" } }, formula: "P(X=k) = \\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}}", description: "Sampling WITHOUT replacement. Unlike Binomial, trials are not independent — each draw changes the remaining pool. E[X] = nK/N.", realWorld: "Quality control: # defective in a sampled batch. Card games: # aces in a hand. Audit sampling: # non-compliant entries." },
}

export default function DiscreteRVPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-blue-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Target className="w-3 h-3" /> Discrete RV · Statistics
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-blue-400 bg-clip-text text-transparent">Discrete Distributions</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">Bernoulli, Binomial, Poisson, Geometric, Hypergeometric — when to use each, what their shapes mean, and how E[X] and Var(X) summarize the full distribution.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
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
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><Target className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">What is a Discrete RV?</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A <strong className="text-white">random variable</strong> X maps outcomes of a random experiment to numbers. <strong className="text-white">Discrete</strong> means X can only take countable values (0, 1, 2, 3...). Its distribution is described by a <strong className="text-white">PMF (Probability Mass Function)</strong>.
          </p>
          <div className="space-y-3">
            {[
              { label: "PMF", desc: "P(X=k) gives the probability of exactly k." },
              { label: "E[X]", desc: "Expected value (mean): weighted average of all possible values." },
              { label: "Var(X)", desc: "Variance: expected squared deviation from mean. σ = √Var." },
              { label: "CDF", desc: "F(k) = P(X ≤ k): cumulative probability up to k." },
            ].map(r => (
              <div key={r.label} className="flex gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                <code className="text-[10px] font-mono font-black text-blue-400 w-14 shrink-0">{r.label}</code>
                <p className="text-[10px] text-gray-500">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Distribution Cheat Sheet</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead><tr className="border-b border-white/5 text-[8px] text-gray-600 uppercase font-black">
                <th className="py-2 text-left">Distribution</th><th className="py-2">E[X]</th><th className="py-2">Var(X)</th><th className="py-2 text-left">Key Condition</th>
              </tr></thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: "Bernoulli(p)", ex: "p", vx: "p(1-p)", cond: "Single trial" },
                  { name: "Binomial(n,p)", ex: "np", vx: "np(1-p)", cond: "n independent trials" },
                  { name: "Poisson(λ)", ex: "λ", vx: "λ", cond: "Constant rate, independent" },
                  { name: "Geometric(p)", ex: "1/p", vx: "(1-p)/p²", cond: "Until first success" },
                  { name: "Hypergeom(N,K,n)", ex: "nK/N", vx: "complex", cond: "No replacement" },
                ].map(r => (
                  <tr key={r.name}>
                    <td className="py-2 font-mono font-black text-blue-400">{r.name}</td>
                    <td className="py-2 text-center font-mono">{r.ex}</td>
                    <td className="py-2 text-center font-mono">{r.vx}</td>
                    <td className="py-2 text-gray-600">{r.cond}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
            <p className="text-[10px] font-black text-blue-400 mb-1">Key Difference: Binomial vs Poisson</p>
            <p className="text-[10px] text-gray-500">Both count events, but Binomial has a fixed n. Poisson is the limit as n→∞ and p→0 with np=λ. Use Poisson when n is large and p is small (rare events).</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [distType, setDistType] = useState<DistributionType>("binomial")
  const [params, setParams] = useState<Record<string, number>>(() => {
    const p: Record<string, number> = {}
    Object.entries(DIST_CONFIGS.binomial.params).forEach(([k, v]) => p[k] = v.default)
    return p
  })

  const handleDistChange = (type: DistributionType) => {
    setDistType(type)
    const newParams: Record<string, number> = {}
    Object.entries(DIST_CONFIGS[type].params).forEach(([k, v]) => newParams[k] = v.default)
    setParams(newParams)
  }

  const chartData = useMemo(() => {
    const data: { k: number; prob: number }[] = []
    let range = 20
    if (distType === "binomial") range = params.n
    if (distType === "bernoulli") range = 1
    if (distType === "hypergeometric") range = Math.min(params.n, params.K)
    if (distType === "poisson") range = Math.max(20, params.lambda * 2)
    for (let k = 0; k <= range; k++) {
      let prob = 0
      switch (distType) {
        case "bernoulli": prob = discrete.bernoulli(k, params.p); break
        case "binomial": prob = discrete.binomial(k, params.n, params.p); break
        case "poisson": prob = discrete.poisson(k, params.lambda); break
        case "geometric": prob = k === 0 ? 0 : discrete.geometric(k, params.p); break
        case "hypergeometric": prob = discrete.hypergeometric(k, params.N, params.K, params.n); break
      }
      data.push({ k, prob })
    }
    return data
  }, [distType, params])

  const stats = useMemo(() => {
    let mean = 0, variance = 0
    switch (distType) {
      case "bernoulli": mean = params.p; variance = params.p * (1 - params.p); break
      case "binomial": mean = params.n * params.p; variance = params.n * params.p * (1 - params.p); break
      case "poisson": mean = params.lambda; variance = params.lambda; break
      case "geometric": mean = 1 / params.p; variance = (1 - params.p) / (params.p ** 2); break
      case "hypergeometric": { const { n, K, N } = params; mean = n * (K / N); variance = n * (K / N) * ((N - K) / N) * ((N - n) / (N - 1)); break }
    }
    return { mean: mean.toFixed(3), variance: variance.toFixed(3), std: Math.sqrt(variance).toFixed(3) }
  }, [distType, params])

  const maxProb = Math.max(...chartData.map(d => d.prob), 0.01)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-[28px] border-white/5 space-y-4">
            <p className="text-[9px] uppercase font-black text-gray-600">Distribution</p>
            <select value={distType} onChange={e => handleDistChange(e.target.value as DistributionType)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-blue-400 focus:border-blue-500 outline-none">
              {Object.entries(DIST_CONFIGS).map(([id, c]) => <option key={id} value={id}>{c.name}</option>)}
            </select>
            {Object.entries(DIST_CONFIGS[distType].params).map(([key, cfg]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-black uppercase text-gray-600">
                  <span>{cfg.label}</span><span className="text-blue-400 font-mono">{params[key]}</span>
                </div>
                <input type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={params[key]} onChange={e => setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-600" />
              </div>
            ))}
          </div>
          <div className="glass p-5 rounded-[24px] border-blue-500/10 space-y-3">
            {[{ label: "E[X]", value: stats.mean, color: "text-blue-400" }, { label: "Var(X)", value: stats.variance, color: "text-indigo-400" }, { label: "σ", value: stats.std, color: "text-violet-400" }].map(s => (
              <div key={s.label} className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-600 uppercase">{s.label}</span>
                <span className={cn("text-xl font-black font-mono", s.color)}>{s.value}</span>
              </div>
            ))}
          </div>
          <div className="glass p-4 rounded-2xl border-white/5">
            <p className="text-[9px] uppercase font-black text-gray-600 mb-2">Real-world Use</p>
            <p className="text-[10px] text-gray-500 leading-relaxed">{DIST_CONFIGS[distType].realWorld}</p>
          </div>
        </div>

        <div className="lg:col-span-3 glass p-6 rounded-[32px] border-white/5">
          <div className="flex justify-between items-center mb-5">
            <div><p className="text-sm font-black">{DIST_CONFIGS[distType].name} — PMF</p></div>
            <div className="bg-blue-500/5 border border-blue-500/15 p-3 rounded-xl"><MathRenderer tex={DIST_CONFIGS[distType].formula} className="text-[10px] text-blue-400" /></div>
          </div>
          <div className="flex items-end gap-0.5 h-64 px-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group max-w-[36px]">
                <div className="w-full relative flex items-end h-52">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(d.prob / maxProb) * 100}%` }} transition={{ type: "spring", stiffness: 120, delay: i * 0.015 }}
                    className="w-[80%] mx-auto rounded-t-sm bg-blue-500/40 border-t border-x border-blue-500/30 group-hover:bg-blue-400/60 transition-colors relative">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[8px] font-mono opacity-0 group-hover:opacity-100 z-10 whitespace-nowrap pointer-events-none">{(d.prob * 100).toFixed(2)}%</div>
                  </motion.div>
                </div>
                <span className="mt-1.5 text-[8px] font-mono text-gray-700 group-hover:text-white">{d.k}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-2xl bg-white/3 border border-white/5">
            <p className="text-[10px] text-gray-500 leading-relaxed italic">{DIST_CONFIGS[distType].description}</p>
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
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Binomial → Poisson Limit</h3>
        <p className="text-sm text-gray-400 leading-relaxed">The Poisson distribution emerges as the limit of the Binomial when n is very large and p is very small, with the product λ = np staying constant. This explains why Poisson models rare events over large populations.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-black/40 p-5 rounded-2xl border border-blue-500/10 space-y-3">
              <p className="text-[10px] font-black text-blue-400">The Derivation</p>
              <MathRenderer tex="X \sim \text{Bin}(n, p), \quad \lambda = np" block className="text-[10px] text-gray-400" />
              <MathRenderer tex="\text{As } n \to \infty, p \to 0, np = \lambda:" block className="text-[9px] text-gray-600" />
              <MathRenderer tex="P(X=k) = \binom{n}{k}p^k(1-p)^{n-k} \to \frac{\lambda^k e^{-\lambda}}{k!}" block className="text-blue-300" />
            </div>
            <div className="p-4 rounded-2xl bg-white/3 border border-white/5">
              <p className="text-[10px] font-black text-white mb-2">Practical rule: Use Poisson when</p>
              <ul className="space-y-1 text-[10px] text-gray-500">
                <li>• n ≥ 20 and p ≤ 0.05 (or n ≥ 100 and np ≤ 10)</li>
                <li>• Events occur independently in time/space</li>
                <li>• Rate λ is roughly constant</li>
              </ul>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
            <p className="text-[10px] font-black text-blue-400">Moment Generating Functions</p>
            <p className="text-[10px] text-gray-500 leading-relaxed">The MGF M_X(t) = E[e^tX] uniquely characterizes a distribution and lets us derive all moments: E[X] = M'(0), E[X²] = M''(0), etc.</p>
            <MathRenderer tex="M_X(t) = (1-p+pe^t)^n \quad \text{(Binomial)}" block className="text-[10px] text-gray-400" />
            <MathRenderer tex="M_X(t) = e^{\lambda(e^t - 1)} \quad \text{(Poisson)}" block className="text-[10px] text-gray-400" />
            <p className="text-[10px] text-gray-600 mt-2">As n→∞, the Binomial MGF converges to the Poisson MGF — confirming the distributional limit.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("replacement")
  const pitfalls = [
    { id: "replacement", severity: "HIGH", title: "Binomial vs Hypergeometric — With vs Without Replacement",
      summary: "Using Binomial when sampling without replacement from a small population introduces error. The Hypergeometric is the correct model when the population is small.",
      bad: `// Factory has 50 items, 10 defective  
// You sample 10 items — are they defective?

// ❌ Wrong: using Binomial
// Binomial assumes each trial is INDEPENDENT
// Assumption: p = 10/50 = 0.2 stays constant
X ~ Binomial(n=10, p=0.2)
// But once you draw a defective item (without replacement)...
// The probability for the NEXT draw changes!
// If 1st draw defective: p = 9/49 ≠ 0.2 anymore`,
      good: `// ✅ Correct: Hypergeometric  
// Without replacement → trials are NOT independent
X ~ Hypergeometric(N=50, K=10, n=10)
P(X=k) = C(10,k) * C(40, 10-k) / C(50,10)

// Rule of thumb: if sample is > 5% of population,
// use Hypergeometric, not Binomial

// When is Binomial OK?
// - Sampling WITH replacement (each draw resets)
// - Sample size < 5% of population (independence approximates well)
// - n ≥ 20, p ≤ 0.05 → Poisson is even simpler

// Variance difference shows the impact:
// Binomial: Var = np(1-p) = 10*0.2*0.8 = 1.6
// Hypergeo:  Var = n(K/N)(1-K/N)*(N-n)/(N-1) = 1.224
// Hypergeometric has less variance (finite population correction)`,
    },
  ]
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Choosing the wrong distribution model leads to systematically incorrect probabilities. The key is matching the model assumptions to the real process.</p>
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
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Wrong Model</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Correct Model</p><pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
