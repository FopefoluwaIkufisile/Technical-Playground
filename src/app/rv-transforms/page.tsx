"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ChevronRight, Info, ArrowRightLeft, FunctionSquare } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { continuous } from "@/lib/probability"
import MathRenderer from "@/components/Math"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "🔀 Transform Lab" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

type TransformType = "linear" | "square" | "exponential" | "log"
type BaseDist = "uniform" | "normal" | "exponential"

const MORPH_CONFIGS: Record<TransformType, { name: string; g: (x: number) => number; g_inv: (y: number) => number[]; deriv_inv: (y: number) => number; label: string; formula: string; intuition: string }> = {
  linear: { name: "Linear", g: x => 2 * x + 1, g_inv: y => [(y - 1) / 2], deriv_inv: () => 0.5, label: "Y = 2X + 1", formula: "f_Y(y) = f_X\\!\\left(\\frac{y-1}{2}\\right) \\cdot \\frac{1}{2}", intuition: "Linear transforms stretch/shift the distribution. Multiplying by 2 stretches density, dividing by 2 (derivative of inverse). The shape changes linearly." },
  square: { name: "Quadratic", g: x => x * x, g_inv: y => y < 0 ? [] : [Math.sqrt(y), -Math.sqrt(y)], deriv_inv: y => y <= 0 ? 0 : 1 / (2 * Math.sqrt(y)), label: "Y = X^2", formula: "f_Y(y) = [f_X(\\sqrt{y}) + f_X(-\\sqrt{y})] \\cdot \\frac{1}{2\\sqrt{y}}", intuition: "Non-monotone: two x values map to the same y. The density folds — contributions from both √y and -√y are summed. This creates 'heaping' near zero." },
  exponential: { name: "Exponential", g: x => Math.exp(x), g_inv: y => y <= 0 ? [] : [Math.log(y)], deriv_inv: y => y <= 0 ? 0 : 1 / y, label: "Y = e^X", formula: "f_Y(y) = f_X(\\ln y) \\cdot \\frac{1}{y}", intuition: "Exponential transform creates a log-normal distribution from a normal. The 1/y factor compresses high-y density (the tail is wide but thin)." },
  log: { name: "Logarithmic", g: x => x <= 0 ? -20 : Math.log(x), g_inv: y => [Math.exp(y)], deriv_inv: y => Math.exp(y), label: "Y = \\ln(X)", formula: "f_Y(y) = f_X(e^y) \\cdot e^y", intuition: "Log transform pulls right-skewed data toward symmetry. e^y factor stretches density on the left (small x) and compresses on the right." },
}

export default function MorphPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-teal-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <FunctionSquare className="w-3 h-3" /> RV Transforms · Statistics
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-teal-400 bg-clip-text text-transparent">RV Transforms</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">When you apply a function g(X) to a random variable, how does the probability density transform? The change-of-variables theorem, Jacobians, and why log-Normal arises from Normal.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-teal-600 border-teal-400 text-white shadow-lg shadow-teal-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
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
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20"><ArrowRightLeft className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Change of Variables</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">Given a random variable X with known PDF f_X(x), and a function Y = g(X), what is the PDF f_Y(y)? The change-of-variables theorem handles this via the Jacobian (derivative) of the inverse.</p>
          <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/15 space-y-3">
            <p className="text-[10px] font-black text-teal-400 uppercase">Monotone Case (g is strictly increasing/decreasing)</p>
            <MathRenderer tex="f_Y(y) = f_X(g^{-1}(y)) \cdot \left|\frac{d}{dy} g^{-1}(y)\right|" block className="text-teal-300" />
            <p className="text-[10px] text-gray-500">The absolute derivative term is the <strong className="text-white">Jacobian</strong> — it accounts for the stretching or compressing of probability mass by the transformation.</p>
          </div>
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/15 space-y-2">
            <p className="text-[10px] font-black text-violet-400 uppercase">Non-Monotone Case (e.g., Y = X²)</p>
            <MathRenderer tex="f_Y(y) = \sum_i f_X(x_i) \cdot |J_i|, \quad \text{where } x_i = g^{-1}_i(y)" block className="text-violet-300 text-[9px]" />
            <p className="text-[10px] text-gray-500">Sum over all x values that map to the same y. For Y=X², both +√y and -√y contribute.</p>
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">The Log-Normal Distribution</h3>
          <p className="text-sm text-gray-400 leading-relaxed">If X ~ N(μ, σ²), then Y = e^X follows a <strong className="text-white">Log-Normal</strong> distribution. This is one of the most practically important transforms because many real-world multiplicative processes produce log-normal data.</p>
          <div className="bg-black/40 p-4 rounded-2xl border border-teal-500/10 space-y-2">
            <MathRenderer tex="X \sim N(\mu, \sigma^2) \implies Y = e^X \sim \text{LogNormal}(\mu, \sigma^2)" block className="text-teal-300 text-[10px]" />
            <MathRenderer tex="f_Y(y) = \frac{1}{y\sigma\sqrt{2\pi}} e^{-\frac{(\ln y - \mu)^2}{2\sigma^2}},\quad y > 0" block className="text-gray-500 text-[9px]" />
          </div>
          <div className="space-y-2">
            {[
              "Income distribution (multiplicative shocks to wages)",
              "Stock prices (returns are Normal; prices are log-Normal)",
              "City population sizes",
              "Particle sizes in grinding processes",
            ].map((ex, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-gray-500">
                <div className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />
                {ex}
              </div>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-[10px] font-black text-amber-400 mb-1">Key Insight: Tail Behavior</p>
            <p className="text-[10px] text-gray-500">The exponential transform inflates the right tail dramatically. Log-Normal is right-skewed even when the underlying Normal is symmetric. This is why wealth, city sizes, and many natural phenomena have fat right tails.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [baseDist, setBaseDist] = useState<BaseDist>("normal")
  const [transType, setTransType] = useState<TransformType>("square")

  const chartData = useMemo(() => {
    const xPoints: { x: number; y: number }[] = []; const yPoints: { x: number; y: number }[] = []
    let minX = -4, maxX = 4
    if (baseDist === "exponential") { minX = 0; maxX = 5 }
    if (baseDist === "uniform") { minX = -1.5; maxX = 1.5 }
    for (let i = 0; i <= 100; i++) {
      const x = minX + (i / 100) * (maxX - minX)
      let fy = 0
      switch (baseDist) { case "uniform": fy = continuous.uniform(x, -1, 1); break; case "normal": fy = continuous.normal(x, 0, 1); break; case "exponential": fy = continuous.exponential(x, 1); break }
      xPoints.push({ x, y: fy })
    }
    const config = MORPH_CONFIGS[transType]; const yStart = -2, yEnd = 8
    for (let i = 0; i <= 100; i++) {
      const y = yStart + (i / 100) * (yEnd - yStart)
      const roots = config.g_inv(y); let fy = 0
      roots.forEach(root => {
        let fx = 0
        switch (baseDist) { case "uniform": fx = continuous.uniform(root, -1, 1); break; case "normal": fx = continuous.normal(root, 0, 1); break; case "exponential": fx = continuous.exponential(root, 1); break }
        fy += fx * Math.abs(config.deriv_inv(y))
      })
      yPoints.push({ x: y, y: fy })
    }
    return { xPoints, yPoints }
  }, [baseDist, transType])

  const renderPath = (points: { x: number; y: number }[], minX: number, maxX: number) => {
    const range = maxX - minX; const maxY = Math.max(...points.map(p => p.y), 0.01)
    return points.map((p, i) => { const x = ((p.x - minX) / range) * 1000; const y = 180 - (p.y / maxY) * 160; return `${i === 0 ? "M" : "L"} ${x} ${y}` }).join(" ")
  }

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-[24px] border-white/5 flex gap-3">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400">Choose a source distribution X and a transformation g(X). See how the PDF morphs in real time. Hover over the source PDF to see the corresponding transformed value.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-[28px] border-white/5 space-y-4">
            <div>
              <p className="text-[9px] uppercase font-black text-gray-600 mb-2">Source X</p>
              {(["normal", "uniform", "exponential"] as BaseDist[]).map(d => (
                <button key={d} onClick={() => setBaseDist(d)} className={cn("w-full px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase mb-1.5 transition-all text-left", baseDist === d ? "bg-teal-500/20 border-teal-500 text-teal-400" : "bg-white/3 border-white/5 text-gray-600 hover:text-white")}>{d}</button>
              ))}
            </div>
            <div>
              <p className="text-[9px] uppercase font-black text-gray-600 mb-2">Transform g(X)</p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(MORPH_CONFIGS).map(([id, cfg]) => (
                  <button key={id} onClick={() => setTransType(id as TransformType)} className={cn("py-2.5 rounded-xl border text-[9px] font-black uppercase transition-all", transType === id ? "bg-teal-500/20 border-teal-500 text-teal-400" : "bg-white/3 border-white/5 text-gray-600 hover:text-white")}>
                    <MathRenderer tex={cfg.label} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="glass p-5 rounded-[24px] border-teal-500/10 space-y-3">
            <p className="text-[9px] uppercase font-black text-gray-600">Theorem</p>
            <div className="bg-black/40 p-3 rounded-xl"><MathRenderer tex={MORPH_CONFIGS[transType].formula} block className="text-[9px] text-teal-400" /></div>
            <p className="text-[10px] text-gray-500 leading-relaxed">{MORPH_CONFIGS[transType].intuition}</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {[
            { label: `Source PDF: f_X(x) — ${baseDist}`, points: chartData.xPoints, minX: -4, maxX: 4, color: "#2dd4bf" },
            { label: `Result PDF: f_Y(y) — after ${transType} transform`, points: chartData.yPoints, minX: -2, maxX: 8, color: "#a78bfa" },
          ].map(chart => (
            <div key={chart.label} className="glass p-5 rounded-[24px] border-white/5">
              <p className="text-[9px] uppercase font-black text-gray-600 mb-3"><MathRenderer tex={chart.label} /></p>
              <svg viewBox="0 0 1000 200" className="w-full overflow-visible">
                <motion.path d={renderPath(chart.points, chart.minX, chart.maxX)} fill="none" stroke={chart.color} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
                <path d={renderPath(chart.points, chart.minX, chart.maxX) + " L 1000 180 L 0 180 Z"} fill={`${chart.color}15`} />
                {[0, 500, 1000].map(x => (
                  <text key={x} x={x} y={195} textAnchor="middle" fill="#4b5563" fontSize="22">
                    {(chart.minX + (x / 1000) * (chart.maxX - chart.minX)).toFixed(1)}
                  </text>
                ))}
              </svg>
            </div>
          ))}
          <div className="glass p-4 rounded-[24px] border-white/5 flex items-center justify-center gap-4">
            <div className="w-4 h-0.5 bg-teal-400" /><span className="text-[10px] text-gray-500">Source f_X(x)</span>
            <ArrowRightLeft className="w-4 h-4 text-gray-700" />
            <div className="w-4 h-0.5 bg-violet-400" /><span className="text-[10px] text-gray-500">Transformed f_Y(y)</span>
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
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Multivariate Transforms & Jacobians</h3>
        <p className="text-sm text-gray-400 leading-relaxed">The change-of-variables principle extends to multiple random variables. The Jacobian becomes a matrix determinant, measuring how the transformation stretches volume in probability space.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black/40 p-5 rounded-2xl border border-teal-500/10 space-y-3">
            <p className="text-[10px] font-black text-teal-400">Bivariate Transform</p>
            <MathRenderer tex="\text{Given } (X_1, X_2) \text{ with joint PDF } f_{X_1 X_2}" block className="text-[9px] text-gray-500" />
            <MathRenderer tex="Y_1 = g_1(X_1, X_2), \quad Y_2 = g_2(X_1, X_2)" block className="text-[9px] text-gray-500" />
            <MathRenderer tex="f_{Y_1 Y_2}(y_1, y_2) = f_{X_1 X_2}(x_1, x_2) \cdot |J|" block className="text-teal-300" />
            <MathRenderer tex="|J| = \left|\frac{\partial(x_1, x_2)}{\partial(y_1, y_2)}\right| = \left|\det\begin{pmatrix} \partial x_1/\partial y_1 & \partial x_1/\partial y_2 \\ \partial x_2/\partial y_1 & \partial x_2/\partial y_2\end{pmatrix}\right|" block className="text-[9px] text-gray-600" />
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
              <p className="text-[10px] font-black text-teal-400">Box-Muller Transform</p>
              <p className="text-[10px] text-gray-500">Generate two standard Normal RVs from two Uniform RVs — used in simulation:</p>
              <MathRenderer tex="U_1, U_2 \sim U(0,1)" block className="text-[9px] text-gray-600" />
              <MathRenderer tex="Z_1 = \sqrt{-2\ln U_1}\cos(2\pi U_2) \sim N(0,1)" block className="text-[9px] text-gray-500" />
              <MathRenderer tex="Z_2 = \sqrt{-2\ln U_1}\sin(2\pi U_2) \sim N(0,1)" block className="text-[9px] text-gray-500" />
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-[10px] font-black text-amber-400 mb-1">Simulation via Inverse CDF</p>
              <p className="text-[10px] text-gray-500">Generate U ~ Uniform(0,1), then X = F⁻¹(U) has CDF F. This is the most general simulation method — works for any distribution with an invertible CDF.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("log-linear")
  const pitfalls = [
    { id: "log-linear", severity: "HIGH", title: "Forgetting the Jacobian After Log-Transforming",
      summary: "When you fit a model to log(Y) and transform predictions back, the mean of exp(log(Y)) ≠ exp(mean of log(Y)). The Jacobian correction is required.",
      bad: `// ❌ Common mistake in regression with log-transform:
// Model: log(price) ~ features  
// Prediction: log_pred = model.predict(X_test)

// Wrong: naive back-transform
pred_price = np.exp(log_pred)
# This gives the MEDIAN of price, not the MEAN
# E[e^Y] ≠ e^{E[Y]} due to Jensen's inequality

// Especially bad when:
// - σ² is large (high variance → big smearing factor)
// - You're reporting average predicted price
// - Decision-making based on expected profit`,
      good: `// ✅ Correct back-transform with smearing correction:
# For log-normal model: E[Y] = exp(μ + σ²/2)
sigma_sq = np.var(log_pred)  # or from model residuals
pred_price = np.exp(log_pred + sigma_sq / 2)

# Duan's smearing estimator (model-free):
residuals = log_y_train - log_pred_train
smearing = np.mean(np.exp(residuals))
pred_price = np.exp(log_pred) * smearing  # corrects for skew

# In scikit-learn: TransformedTargetRegressor handles this
from sklearn.compose import TransformedTargetRegressor
model = TransformedTargetRegressor(
    regressor=LinearRegression(),
    func=np.log, inverse_func=np.exp
)
# Note: still gives median, not mean — use smearing for mean`,
    },
  ]
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Transformations change not just the distribution shape but also how summary statistics (mean, variance) behave. Always account for the Jacobian when back-transforming.</p>
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
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Problem</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Fix</p><pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
