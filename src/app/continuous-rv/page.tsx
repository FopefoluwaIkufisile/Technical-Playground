"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Target, ChevronRight, Info, BookOpen } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { continuous } from "@/lib/probability"
import MathRenderer from "@/components/Math"

type Tab = "concepts" | "cdflab" | "scenarioguide" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "cdflab", label: "📈 PDF vs CDF Lab" },
  { id: "scenarioguide", label: "🔍 Find the PDF" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

type DistributionType = "uniform" | "exponential" | "normal"

function normalPDF(x: number, mu: number, sigma: number) { return continuous.normal(x, mu, sigma) }
function normalCDF(x: number, mu: number, sigma: number) { return continuous.normalCDF(x, mu, sigma) }
function expPDF(x: number, lambda: number) { return x < 0 ? 0 : lambda * Math.exp(-lambda * x) }
function expCDF(x: number, lambda: number) { return x < 0 ? 0 : 1 - Math.exp(-lambda * x) }
function unifPDF(x: number, a: number, b: number) { return (x >= a && x <= b) ? 1 / (b - a) : 0 }
function unifCDF(x: number, a: number, b: number) { if (x < a) return 0; if (x > b) return 1; return (x - a) / (b - a) }

export default function ContinuousRVPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-indigo-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Target className="w-3 h-3" /> Continuous RV · STAT 2400
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-indigo-400 bg-clip-text text-transparent">Continuous RV's</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">PDF, CDF, the relationship between them, how to find a PDF from a scenario, and the three key continuous distributions from STAT 2400 — Uniform, Exponential, Normal.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "cdflab" && <CDFLabTab />}
            {tab === "scenarioguide" && <ScenarioGuideTab />}
            {tab === "deepdive" && <DeepDiveTab />}
            {tab === "pitfalls" && <PitfallsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/* ─── CONCEPTS ─── */
function ConceptsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF */}
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Target className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">PDF — Probability Density Function</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A continuous RV satisfies <strong className="text-white">P(X = x) = 0</strong> for every single point. Instead of point probabilities we work with <strong className="text-white">density</strong>. The PDF f(x) describes how likelihood is spread across the number line.
          </p>
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 space-y-2">
            <p className="text-[10px] font-black text-indigo-400 uppercase">Two Requirements for a Valid PDF</p>
            <MathRenderer tex="1.\quad f(x) \ge 0 \text{ for all } x" block className="text-indigo-300 text-sm" />
            <MathRenderer tex="2.\quad \int_{-\infty}^{\infty} f(x)\,dx = 1" block className="text-indigo-300 text-sm" />
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 space-y-2">
            <p className="text-[10px] font-black text-indigo-400 uppercase">Probability = Area Under Curve</p>
            <MathRenderer tex="P(a \le X \le b) = \int_a^b f(x)\,dx" block className="text-indigo-300" />
            <p className="text-[10px] text-gray-500 mt-1">The PDF value f(x) is NOT a probability. It is a density — it can exceed 1! Only integrals (areas) give probabilities.</p>
          </div>
          <div className="space-y-2">
            {[
              { label: "P(X = a)", res: "= 0 always (single point has zero width, zero area)" },
              { label: "P(a ≤ X ≤ b)", res: "= P(a < X < b) = P(a ≤ X < b) (endpoints don't matter)" },
            ].map(r => (
              <div key={r.label} className="flex gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                <code className="text-indigo-400 text-[10px] font-mono font-black w-28 shrink-0">{r.label}</code>
                <p className="text-[10px] text-gray-500">{r.res}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CDF */}
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20"><BookOpen className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">CDF — Cumulative Distribution Function</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            The CDF F(x) accumulates all probability to the left of x. It works for <strong className="text-white">any</strong> random variable — discrete, continuous, or mixed. It completely determines the distribution.
          </p>
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/15 space-y-2">
            <MathRenderer tex="F_X(x) = P(X \le x) = \int_{-\infty}^{x} f(t)\,dt" block className="text-violet-300" />
            <p className="text-[10px] text-gray-500">The CDF is the antiderivative of the PDF. F'(x) = f(x) wherever f is continuous.</p>
          </div>
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/15 space-y-2">
            <p className="text-[10px] font-black text-violet-400 uppercase">4 Properties of Every CDF (Prop 5.3)</p>
            {[
              "F is non-decreasing: x₁ < x₂ ⇒ F(x₁) ≤ F(x₂)",
              "F is right-continuous: F(x) = lim_{h↓0} F(x+h)",
              "lim_{x→-∞} F(x) = 0",
              "lim_{x→+∞} F(x) = 1",
            ].map((p, i) => (
              <div key={i} className="flex gap-2 text-[10px] text-gray-500">
                <span className="text-violet-400 font-black shrink-0">{i + 1}.</span> {p}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { formula: "P(X > a)", equiv: "1 - F(a)" },
              { formula: "P(a < X ≤ b)", equiv: "F(b) - F(a)" },
              { formula: "P(X = a)", equiv: "F(a) - F(a⁻) = 0 for continuous" },
              { formula: "P(X < a)", equiv: "F(a⁻) = F(a) for continuous" },
            ].map(r => (
              <div key={r.formula} className="flex gap-3 p-2.5 bg-white/3 rounded-xl border border-white/5">
                <code className="text-violet-400 text-[10px] font-mono font-black w-28 shrink-0">{r.formula}</code>
                <code className="text-[10px] text-gray-500">= {r.equiv}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution table */}
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">STAT 2400 Key Continuous Distributions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead><tr className="border-b border-white/5 text-[8px] text-gray-600 uppercase font-black">
              <th className="py-2 text-left">Distribution</th>
              <th className="py-2 text-left">PDF f(x)</th>
              <th className="py-2 text-left">CDF F(x)</th>
              <th className="py-2">E[X]</th>
              <th className="py-2">Var(X)</th>
              <th className="py-2 text-left">When to use</th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 font-black text-indigo-400">Uniform(a,b)</td>
                <td className="py-3 font-mono text-gray-400">1/(b−a), a≤x≤b</td>
                <td className="py-3 font-mono text-gray-400">(x−a)/(b−a)</td>
                <td className="py-3 text-center font-mono">(a+b)/2</td>
                <td className="py-3 text-center font-mono">(b−a)²/12</td>
                <td className="py-3 text-gray-500">Equal likelihood everywhere in interval</td>
              </tr>
              <tr>
                <td className="py-3 font-black text-amber-400">Exponential(λ)</td>
                <td className="py-3 font-mono text-gray-400">λe^(−λx), x≥0</td>
                <td className="py-3 font-mono text-gray-400">1 − e^(−λx)</td>
                <td className="py-3 text-center font-mono">1/λ</td>
                <td className="py-3 text-center font-mono">1/λ²</td>
                <td className="py-3 text-gray-500">Time between Poisson events; memoryless</td>
              </tr>
              <tr>
                <td className="py-3 font-black text-emerald-400">Normal(μ,σ²)</td>
                <td className="py-3 font-mono text-gray-400">bell curve formula</td>
                <td className="py-3 font-mono text-gray-400">Φ((x−μ)/σ)</td>
                <td className="py-3 text-center font-mono">μ</td>
                <td className="py-3 text-center font-mono">σ²</td>
                <td className="py-3 text-gray-500">CLT, heights, measurement errors</td>
              </tr>
              <tr>
                <td className="py-3 font-black text-rose-400">Gamma(α,λ)</td>
                <td className="py-3 font-mono text-gray-400">λ(λx)^(α-1)e^(-λx)/Γ(α)</td>
                <td className="py-3 font-mono text-gray-400">incomplete gamma</td>
                <td className="py-3 text-center font-mono">α/λ</td>
                <td className="py-3 text-center font-mono">α/λ²</td>
                <td className="py-3 text-gray-500">Sum of α exponentials; wait for αth event</td>
              </tr>
              <tr>
                <td className="py-3 font-black text-teal-400">Beta(a,b)</td>
                <td className="py-3 font-mono text-gray-400">x^(a-1)(1-x)^(b-1)/B(a,b)</td>
                <td className="py-3 font-mono text-gray-400">regularized inc. beta</td>
                <td className="py-3 text-center font-mono">a/(a+b)</td>
                <td className="py-3 text-center font-mono">ab/((a+b)²(a+b+1))</td>
                <td className="py-3 text-gray-500">Proportions in [0,1]; Bayesian priors</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-[10px] font-black text-amber-400 mb-1">Memoryless Property — Exponential only</p>
          <MathRenderer tex="P(X > s + t \mid X > s) = P(X > t)" block className="text-[9px] text-gray-400" />
          <p className="text-[10px] text-gray-500 mt-1">Past waiting time gives NO information about future waiting time. A server that has been running for 5 years is equally likely to fail next hour as a brand-new server. Only the Exponential has this property among continuous distributions.</p>
        </div>
      </div>
    </div>
  )
}

/* ─── PDF vs CDF LAB ─── */
function CDFLabTab() {
  const [distType, setDistType] = useState<DistributionType>("normal")
  const [mu, setMu] = useState(0)
  const [sigma, setSigma] = useState(2)
  const [lambda, setLambda] = useState(1)
  const [a, setA] = useState(0)
  const [b, setB] = useState(6)
  const [rangeA, setRangeA] = useState(-1)
  const [rangeB, setRangeB] = useState(1)

  const { pdfPoints, cdfPoints, minX, maxX } = useMemo(() => {
    let mn = -8, mx = 8
    if (distType === "exponential") { mn = 0; mx = 6 / lambda }
    if (distType === "uniform") { mn = a - 2; mx = b + 2 }
    if (distType === "normal") { mn = mu - 4 * sigma; mx = mu + 4 * sigma }
    const steps = 200
    const ppts: { x: number; y: number }[] = []
    const cpts: { x: number; y: number }[] = []
    for (let i = 0; i <= steps; i++) {
      const x = mn + (i / steps) * (mx - mn)
      let py = 0, cy = 0
      if (distType === "normal") { py = normalPDF(x, mu, sigma); cy = normalCDF(x, mu, sigma) }
      if (distType === "exponential") { py = expPDF(x, lambda); cy = expCDF(x, lambda) }
      if (distType === "uniform") { py = unifPDF(x, a, b); cy = unifCDF(x, a, b) }
      ppts.push({ x, y: py })
      cpts.push({ x, y: cy })
    }
    return { pdfPoints: ppts, cdfPoints: cpts, minX: mn, maxX: mx }
  }, [distType, mu, sigma, lambda, a, b])

  // Probability P(rangeA <= X <= rangeB)
  const prob = useMemo(() => {
    const lo = Math.max(rangeA, minX), hi = Math.min(rangeB, maxX)
    if (hi <= lo) return 0
    if (distType === "normal") return normalCDF(hi, mu, sigma) - normalCDF(lo, mu, sigma)
    if (distType === "exponential") return expCDF(Math.max(lo, 0), lambda) === expCDF(Math.max(hi, 0), lambda) ? 0 : expCDF(Math.max(hi, 0), lambda) - expCDF(Math.max(lo, 0), lambda)
    if (distType === "uniform") return unifCDF(hi, a, b) - unifCDF(lo, a, b)
    return 0
  }, [distType, rangeA, rangeB, mu, sigma, lambda, a, b, minX, maxX])

  const range = maxX - minX
  const maxPDF = Math.max(...pdfPoints.map(p => p.y), 0.01)

  const toSVG = (x: number, y: number, h: number, maxY: number) => ({
    sx: ((x - minX) / range) * 960 + 20,
    sy: h - 10 - (y / maxY) * (h - 20),
  })

  const mkPath = (pts: { x: number; y: number }[], h: number, maxY: number) =>
    pts.map((p, i) => { const s = toSVG(p.x, p.y, h, maxY); return `${i === 0 ? "M" : "L"}${s.sx},${s.sy}` }).join(" ")

  const shadedPDF = (() => {
    const s = pdfPoints.filter(p => p.x >= rangeA && p.x <= rangeB)
    if (!s.length) return ""
    const path = s.map((p, i) => { const sv = toSVG(p.x, p.y, 180, maxPDF); return `${i === 0 ? "M" : "L"}${sv.sx},${sv.sy}` }).join(" ")
    const first = toSVG(s[0].x, 0, 180, maxPDF)
    const last = toSVG(s[s.length - 1].x, 0, 180, maxPDF)
    return `${path} L${last.sx},${last.sy} L${first.sx},${first.sy} Z`
  })()

  const shadedCDF = (() => {
    const loSV = toSVG(rangeA, expCDF(rangeA, lambda), 180, 1)
    const hiSV = toSVG(rangeB, 1, 180, 1)
    const fA_sv = toSVG(rangeA, distType === "normal" ? normalCDF(rangeA, mu, sigma) : distType === "exponential" ? expCDF(Math.max(rangeA, 0), lambda) : unifCDF(rangeA, a, b), 180, 1)
    const fB_sv = toSVG(rangeB, distType === "normal" ? normalCDF(rangeB, mu, sigma) : distType === "exponential" ? expCDF(Math.max(rangeB, 0), lambda) : unifCDF(rangeB, a, b), 180, 1)
    return { fA: fA_sv, fB: fB_sv }
  })()

  const xLabels = [0, 0.25, 0.5, 0.75, 1].map(t => (minX + t * range).toFixed(1))

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">The <strong className="text-white">top chart</strong> is the PDF f(x) — shaded area = P(a ≤ X ≤ b). The <strong className="text-white">bottom chart</strong> is the CDF F(x) — the vertical gap between F(b) and F(a) equals the same probability. Both always agree.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="glass p-5 rounded-[24px] border-white/5 space-y-4">
            <p className="text-[9px] uppercase font-black text-gray-600">Distribution</p>
            <div className="flex flex-col gap-1.5">
              {(["normal", "exponential", "uniform"] as DistributionType[]).map(d => (
                <button key={d} onClick={() => setDistType(d)} className={cn("px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wide text-left transition-all", distType === d ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "bg-white/3 border-white/5 text-gray-600 hover:text-white")}>{d === "normal" ? "Normal(μ,σ²)" : d === "exponential" ? "Exponential(λ)" : "Uniform(a,b)"}</button>
              ))}
            </div>
            {distType === "normal" && (<>
              {[{ label: "μ (mean)", v: mu, set: setMu, min: -5, max: 5 }, { label: "σ (std dev)", v: sigma, set: setSigma, min: 0.5, max: 5, step: "0.5" }].map(s => (
                <div key={s.label} className="space-y-1"><div className="flex justify-between text-[9px] font-black uppercase text-gray-600"><span>{s.label}</span><span className="text-indigo-400">{s.v}</span></div><input type="range" min={s.min} max={s.max} step={s.step ?? "1"} value={s.v} onChange={e => s.set(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-600" /></div>
              ))}</>)}
            {distType === "exponential" && (
              <div className="space-y-1"><div className="flex justify-between text-[9px] font-black uppercase text-gray-600"><span>λ (rate)</span><span className="text-indigo-400">{lambda}</span></div><input type="range" min={0.2} max={3} step={0.1} value={lambda} onChange={e => setLambda(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-600" /></div>
            )}
            {distType === "uniform" && (<>
              {[{ label: "a (lower)", v: a, set: setA, min: -5, max: 5 }, { label: "b (upper)", v: b, set: (v: number) => { if (v > a) setB(v) }, min: -4, max: 10 }].map(s => (
                <div key={s.label} className="space-y-1"><div className="flex justify-between text-[9px] font-black uppercase text-gray-600"><span>{s.label}</span><span className="text-indigo-400">{s.v}</span></div><input type="range" min={s.min} max={s.max} step={1} value={s.v} onChange={e => s.set(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-600" /></div>
              ))}</>)}

            <div className="pt-2 border-t border-white/5 space-y-2">
              <p className="text-[9px] uppercase font-black text-gray-600">Shade: P(a ≤ X ≤ b)</p>
              <div className="grid grid-cols-2 gap-2">
                {[{ label: "a", v: rangeA, set: setRangeA }, { label: "b", v: rangeB, set: setRangeB }].map(i => (
                  <div key={i.label} className="space-y-0.5">
                    <p className="text-[8px] text-gray-700 font-black uppercase">{i.label}</p>
                    <input type="number" step="0.5" value={i.v} onChange={e => i.set(parseFloat(e.target.value))} className="w-full bg-black/60 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] font-mono text-indigo-300 focus:border-indigo-500/40 outline-none" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-5 rounded-[24px] border-indigo-500/10 space-y-3">
            <div className="text-center py-2">
              <p className="text-[8px] text-gray-700 uppercase font-black">P({rangeA} ≤ X ≤ {rangeB})</p>
              <p className="text-4xl font-black text-indigo-400 font-mono">{(prob * 100).toFixed(2)}%</p>
            </div>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between p-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                <span className="text-gray-600">F({rangeB})</span>
                <span className="font-mono text-indigo-400">{(distType === "normal" ? normalCDF(rangeB, mu, sigma) : distType === "exponential" ? expCDF(Math.max(rangeB, 0), lambda) : unifCDF(rangeB, a, b)).toFixed(4)}</span>
              </div>
              <div className="flex justify-between p-2 bg-red-500/5 rounded-lg border border-red-500/10">
                <span className="text-gray-600">F({rangeA})</span>
                <span className="font-mono text-red-400">{(distType === "normal" ? normalCDF(rangeA, mu, sigma) : distType === "exponential" ? expCDF(Math.max(rangeA, 0), lambda) : unifCDF(rangeA, a, b)).toFixed(4)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-[8px] px-2">
                <div className="flex-1 h-px bg-white/5" />Gap = P(a≤X≤b)<div className="flex-1 h-px bg-white/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-3 space-y-4">
          {/* PDF */}
          <div className="glass p-5 rounded-[28px] border-white/5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black uppercase text-gray-600">PDF f(x) — density curve</p>
              <div className="flex items-center gap-2 text-[8px] text-gray-700 uppercase font-black">
                <div className="w-3 h-3 bg-indigo-500/30 border border-indigo-500/40 rounded-sm" /><span>Shaded area = probability</span>
              </div>
            </div>
            <svg viewBox="0 0 1000 190" className="w-full overflow-visible">
              {shadedPDF && <path d={shadedPDF} fill="rgba(99,102,241,0.25)" />}
              <motion.path d={mkPath(pdfPoints, 180, maxPDF)} fill="none" stroke="#6366f1" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} key={distType + mu + sigma + lambda + a + b} />
              {xLabels.map((xl, i) => <text key={i} x={i * 240 + 20} y={188} fill="#4b5563" fontSize="18" textAnchor="middle">{xl}</text>)}
            </svg>
          </div>

          {/* CDF */}
          <div className="glass p-5 rounded-[28px] border-white/5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black uppercase text-gray-600">CDF F(x) = P(X ≤ x) — running total area</p>
              <div className="flex items-center gap-2 text-[8px] text-gray-700 uppercase font-black">
                <div className="w-3 h-0.5 border-t-2 border-dashed border-violet-500" /><span>F(b)−F(a) = shaded area above</span>
              </div>
            </div>
            <svg viewBox="0 0 1000 190" className="w-full overflow-visible">
              {/* dashed lines from F(a) to F(b) */}
              {shadedCDF.fA && shadedCDF.fB && (<>
                <line x1={shadedCDF.fA.sx} y1={shadedCDF.fA.sy} x2={shadedCDF.fA.sx} y2={175} stroke="#6366f1" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
                <line x1={shadedCDF.fB.sx} y1={shadedCDF.fB.sy} x2={shadedCDF.fB.sx} y2={175} stroke="#6366f1" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
                <line x1={20} y1={shadedCDF.fA.sy} x2={shadedCDF.fA.sx} y2={shadedCDF.fA.sy} stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
                <line x1={20} y1={shadedCDF.fB.sy} x2={shadedCDF.fB.sx} y2={shadedCDF.fB.sy} stroke="#6366f1" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
                <rect x={2} y={shadedCDF.fB.sy} width={16} height={shadedCDF.fA.sy - shadedCDF.fB.sy} fill="rgba(99,102,241,0.3)" rx={2} />
              </>)}
              <motion.path d={mkPath(cdfPoints, 180, 1)} fill="none" stroke="#8b5cf6" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} key={"cdf" + distType + mu + sigma + lambda + a + b} />
              {xLabels.map((xl, i) => <text key={i} x={i * 240 + 20} y={188} fill="#4b5563" fontSize="18" textAnchor="middle">{xl}</text>)}
              <text x={8} y={10} fill="#4b5563" fontSize="14" textAnchor="middle">1</text>
              <text x={8} y={95} fill="#4b5563" fontSize="14" textAnchor="middle">0.5</text>
              <text x={8} y={178} fill="#4b5563" fontSize="14" textAnchor="middle">0</text>
            </svg>
          </div>

          <div className="glass p-4 rounded-2xl border-white/5 text-[10px] text-gray-500 leading-relaxed">
            <strong className="text-white">How to read together: </strong>The shaded area under the PDF curve (top) equals exactly the vertical gap on the CDF (bottom) — the bar on the left of the CDF chart shows F(b)−F(a). Drag the range sliders to see this relationship live.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── SCENARIO → PDF GUIDE ─── */
function ScenarioGuideTab() {
  const [step, setStep] = useState<number | null>(null)
  const steps = [
    {
      title: "Step 1 — Read for the support (range of X)",
      content: "Identify what values X can actually take. This gives the 'support' — where f(x) > 0. Outside the support, f(x) = 0.",
      example: `Scenario: "A number is chosen uniformly at random from (0, 5)."
Support: X ∈ (0, 5) → f(x) = 0 for x ≤ 0 or x ≥ 5.`,
      formula: "R_X = \\{x : f(x) > 0\\}",
    },
    {
      title: "Step 2 — The word 'uniform' / 'equally likely'",
      content: "If every point in an interval [a,b] is equally likely, f(x) must be constant. The PDF must integrate to 1 → f(x) = 1/(b−a).",
      example: `"Uniformly distributed on (0,5)" → f(x) = 1/5 for 0 < x < 5.`,
      formula: "f(x) = \\frac{1}{b-a}, \\quad a \\le x \\le b",
    },
    {
      title: "Step 3 — Given a formula, verify it is a valid PDF",
      content: "Always check: (1) f(x) ≥ 0 everywhere, (2) integral over support = 1. If not 1, find the normalizing constant c.",
      example: `Given f(x) = c·x² for 0 < x < 3.
∫₀³ cx² dx = c·[x³/3]₀³ = 9c = 1 → c = 1/9
∴ f(x) = x²/9 for 0 < x < 3.`,
      formula: "\\int_{-\\infty}^{\\infty} f(x)\\,dx = 1",
    },
    {
      title: "Step 4 — Find the CDF from the PDF",
      content: "Integrate f(x) from −∞ to x. Always write piecewise: F(x) = 0 before the support, integral inside, and 1 after.",
      example: `f(x) = x²/9 for 0 < x < 3.
F(x) = 0 for x ≤ 0
F(x) = ∫₀ˣ t²/9 dt = x³/27 for 0 < x < 3
F(x) = 1 for x ≥ 3`,
      formula: "F(x) = \\int_{-\\infty}^{x} f(t)\\,dt",
    },
    {
      title: "Step 5 — Find probabilities using the CDF",
      content: "Use F(b) − F(a) for interval probabilities. For continuous RVs, P(X = a) = 0, and endpoints don't matter.",
      example: `P(1 < X ≤ 2) = F(2) − F(1) = 8/27 − 1/27 = 7/27`,
      formula: "P(a < X \\le b) = F(b) - F(a)",
    },
    {
      title: "Step 6 — 'Time between / until' → Exponential",
      content: "Key words: 'time between events', 'waiting time', 'lifetime', 'rate λ'. Use Exponential(λ). The memoryless property often appears in exam questions.",
      example: `"Customers arrive at rate λ = 3/hour. X = time until next customer."
X ~ Exp(3). f(x) = 3e^{-3x} x > 0. E[X] = 1/3 hour.`,
      formula: "X \\sim \\text{Exp}(\\lambda): \\quad f(x) = \\lambda e^{-\\lambda x},\\; x > 0",
    },
    {
      title: "Step 7 — Find PDF of Y = g(X) (Transformation)",
      content: "Use the Change-of-Variables Theorem. Find the inverse x = g⁻¹(y), differentiate it, and apply the Jacobian formula.",
      example: `X ~ Unif(0,1), Y = X².
g⁻¹(y) = √y, (d/dy)√y = 1/(2√y).
f_Y(y) = f_X(√y)·|1/(2√y)| = 1/(2√y) for 0 < y < 1.`,
      formula: "f_Y(y) = f_X(g^{-1}(y)) \\cdot \\left|\\frac{d}{dy}g^{-1}(y)\\right|",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3">
        <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400">This is a step-by-step framework for every continuous RV scenario question on your exam. Click each step to expand it.</p>
      </div>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <motion.div key={i} layout className={cn("glass rounded-[24px] border overflow-hidden transition-colors", step === i ? "border-indigo-500/30" : "border-white/5 hover:border-white/10")}>
            <button onClick={() => setStep(step === i ? null : i)} className="w-full p-5 flex items-center gap-4 text-left">
              <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-black shrink-0 transition-colors", step === i ? "border-indigo-500 bg-indigo-500/20 text-indigo-400" : "border-white/10 bg-white/3 text-gray-600")}>{i + 1}</div>
              <p className={cn("font-bold text-sm transition-colors", step === i ? "text-white" : "text-gray-400")}>{s.title}</p>
              <ChevronRight className={cn("w-4 h-4 text-gray-600 ml-auto transition-transform", step === i && "rotate-90")} />
            </button>
            <AnimatePresence>
              {step === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-5 pb-6 pt-2 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400 leading-relaxed">{s.content}</p>
                      <div className="bg-black/40 p-3 rounded-xl border border-indigo-500/10">
                        <MathRenderer tex={s.formula} block className="text-indigo-300" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-black text-gray-700 mb-2">Example</p>
                      <pre className="bg-black/60 border border-white/5 rounded-xl p-4 text-[11px] font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{s.example}</pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* CDF properties reference */}
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">CDF Reading Rules (from a given graph)</h3>
        <p className="text-sm text-gray-400 leading-relaxed">On the exam, you are often given a piecewise CDF and asked to compute probabilities. Here is the complete rule set:</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { rule: "P(X = a)", how: "Jump size at a. For continuous RV: always 0. For discrete: difference F(a) − F(a⁻)." },
            { rule: "P(X ≤ a)", how: "Read F(a) directly from the graph." },
            { rule: "P(X < a)", how: "Left-hand limit: F(a⁻). Same as F(a) for continuous RVs." },
            { rule: "P(X > a)", how: "1 − F(a)." },
            { rule: "P(X ≥ a)", how: "1 − F(a⁻) = 1 − F(a) for continuous." },
            { rule: "P(a < X ≤ b)", how: "F(b) − F(a)." },
            { rule: "P(a ≤ X ≤ b)", how: "F(b) − F(a⁻) = F(b) − F(a) for continuous." },
            { rule: "Is X continuous?", how: "F must be continuous everywhere (no jumps). If piecewise, check continuity at the breakpoints." },
          ].map(r => (
            <div key={r.rule} className="p-3 rounded-xl bg-white/3 border border-white/5 flex gap-3">
              <code className="text-indigo-400 text-[10px] font-mono font-black w-28 shrink-0">{r.rule}</code>
              <p className="text-[10px] text-gray-500">{r.how}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── DEEP DIVE ─── */
function DeepDiveTab() {
  return (
    <div className="space-y-6">
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Central Limit Theorem (CLT)</h3>
        <p className="text-sm text-gray-400 leading-relaxed">The CLT is arguably the most important theorem in statistics. It states that the standardized sample mean converges in distribution to N(0,1) regardless of the original distribution.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black/40 p-5 rounded-2xl border border-indigo-500/10 space-y-3">
            <MathRenderer tex="X_1,\ldots,X_n \overset{iid}{\sim} F,\; E[X]=\mu,\;\text{Var}(X)=\sigma^2" block className="text-[9px] text-gray-500" />
            <MathRenderer tex="\frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} \xrightarrow{d} N(0,1)" block className="text-indigo-300" />
            <p className="text-[10px] text-gray-600">Rule of thumb: n ≥ 30 usually sufficient. For skewed distributions, you may need larger n.</p>
          </div>
          <div className="space-y-3">
            {[
              { t: "Standard Error", d: "The std. deviation of the sample mean: σ/√n. Quadrupling n halves the standard error." },
              { t: "Use for inference", d: "Allows construction of confidence intervals and t-tests for population means without knowing the distribution." },
              { t: "Normal approximation to Binomial", d: "X~Bin(n,p): use N(np, np(1-p)) when np>5 and n(1-p)>5." },
            ].map(t => (
              <div key={t.t} className="p-3 rounded-xl bg-white/3 border border-white/5"><p className="text-[10px] font-black text-indigo-400">{t.t}</p><p className="text-[10px] text-gray-500 mt-1">{t.d}</p></div>
            ))}
          </div>
        </div>
      </div>
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Finding E[X] for Continuous RV — Complete Method</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <MathRenderer tex="E[X] = \int_{-\infty}^{\infty} x\,f(x)\,dx" block className="text-indigo-300" />
            <MathRenderer tex="E[g(X)] = \int_{-\infty}^{\infty} g(x)\,f(x)\,dx \quad \text{(LOTUS)}" block className="text-[10px] text-gray-400" />
            <MathRenderer tex="\text{Var}(X) = E[X^2] - (E[X])^2" block className="text-[10px] text-gray-400" />
          </div>
          <div className="bg-black/40 p-5 rounded-2xl border border-indigo-500/10 space-y-2">
            <p className="text-[10px] font-black text-indigo-400">Example: f(x) = 2x for 0 &lt; x &lt; 1</p>
            <MathRenderer tex="E[X] = \int_0^1 x \cdot 2x\,dx = 2\int_0^1 x^2\,dx = \tfrac{2}{3}" block className="text-[10px] text-gray-400" />
            <MathRenderer tex="E[X^2] = \int_0^1 x^2 \cdot 2x\,dx = \tfrac{1}{2}" block className="text-[10px] text-gray-400" />
            <MathRenderer tex="\text{Var}(X) = \tfrac{1}{2} - \left(\tfrac{2}{3}\right)^2 = \tfrac{1}{18}" block className="text-[10px] text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── PITFALLS ─── */
function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("cdf-piecewise")
  const pitfalls = [
    {
      id: "cdf-piecewise", severity: "HIGH", title: "Not Checking Continuity of a Piecewise CDF",
      summary: "On exams you find a and b from a given piecewise CDF. F must be continuous (no jumps) if X is continuous — this gives you the equations.",
      bad: `// Question: F(x) = ax for 0≤x<1, bx+1/2 for 1≤x<2, 1 for x≥2
// ❌ Ignoring continuity conditions
// Just setting F(2-) = 1: b(2) + 1/2 = 1 → b = 1/4
// Forgot to check at x=1! Also F(0)=0 check is skipped`,
      good: `// ✅ Apply all conditions systematically:
// 1. F must start at 0: F(0) = a(0) = 0 ✓ (automatic)
// 2. F must end at 1: F(2) = b(2) + 1/2 = 1 → b = 1/4
// 3. Continuous at x=1: lim F from left = lim F from right
//    a(1) = b(1) + 1/2 → a = 1/4 + 1/2 = 3/4
// Verify: F is differentiable everywhere inside pieces?
//   f(x) = a = 3/4 on (0,1): valid PDF (positive)
//   f(x) = b = 1/4 on (1,2): valid PDF (positive)
// Total integral: 3/4·1 + 1/4·1 = 1 ✓`,
    },
    {
      id: "pdf-not-prob", severity: "MED", title: "Treating PDF Values as Probabilities",
      summary: "f(x) is a density — it can exceed 1. Only integrals give probabilities. P(X = x) = 0 always.",
      bad: `// f(x) = 3x² for 0 < x < 1
// ❌ Wrong: "P(X = 0.5) = f(0.5) = 3(0.25) = 0.75"
// This is WRONG. f(0.5) is a density, not a probability.`,
      good: `// ✅ Correct: use integration for any probability
P(0.4 ≤ X ≤ 0.6) = ∫₀.₄^0.6 3x² dx = [x³]₀.₄^0.6
                  = 0.216 - 0.064 = 0.152
// P(X = 0.5) = 0 exactly (continuous RV)
// f(x) > 1 is fine! E.g., Uniform(0, 0.5): f(x) = 2`,
    },
  ]
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400">The most common errors on continuous RV exam questions — all fixable with a systematic approach.</p>
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
                  <div><p className="text-[10px] font-black uppercase text-red-500 mb-2">Problem</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
                  <div><p className="text-[10px] font-black uppercase text-emerald-500 mb-2">Fix</p><pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
