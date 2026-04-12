"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Target, Calculator, Database, BookOpen, Layers, GitBranch, RefreshCw, ChevronRight, Info } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import MathRenderer from "@/components/Math"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "📊 Interactive" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

export default function ConditionalProbPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-emerald-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Target className="w-3 h-3" /> Conditional Probability · Statistics
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-emerald-400 bg-clip-text text-transparent">Conditional Probability</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">P(A|B), Bayes&apos; Theorem, independence, and the probability tree — understanding when events influence each other and how to update beliefs with new evidence.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
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
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Target className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Conditional Probability</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            The probability of A <em>given</em> B has already occurred. Knowledge of B restricts our sample space — we only consider outcomes where B is true, and ask what fraction of those also include A.
          </p>
          <div className="flex justify-center py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/15">
            <MathRenderer tex="P(A|B) = \frac{P(A \cap B)}{P(B)}, \quad P(B) > 0" block className="text-emerald-300" />
          </div>
          <div className="space-y-3">
            {[
              { title: "Independence", desc: "A and B are independent if P(A|B) = P(A) — knowing B tells you nothing new about A. Equivalently: P(A∩B) = P(A)·P(B).", formula: "P(A|B) = P(A) \\Leftrightarrow \\text{independent}" },
              { title: "Multiplication Rule", desc: "Derived from the conditional definition — the probability that both A and B occur.", formula: "P(A \\cap B) = P(A|B) \\cdot P(B) = P(B|A) \\cdot P(A)" },
              { title: "Total Probability", desc: "If {B₁,B₂,...,Bₙ} partition the sample space, any event A can be decomposed across those partitions.", formula: "P(A) = \\sum_i P(A|B_i)P(B_i)" },
            ].map(k => (
              <div key={k.title} className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
                <p className="text-[10px] font-black text-emerald-400 uppercase">{k.title}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed">{k.desc}</p>
                <div className="bg-black/40 p-2 rounded-lg"><MathRenderer tex={k.formula} className="text-[9px] text-gray-500" /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Bayes&apos; Theorem — Updating Beliefs</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Bayes&apos; Theorem lets us &ldquo;flip&rdquo; a conditional probability. If we know P(B|A) and want P(A|B), we can compute it. This is the foundation of probabilistic reasoning and machine learning.
          </p>
          <div className="flex justify-center py-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
            <MathRenderer tex="P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}" block className="text-emerald-300" />
          </div>
          <div className="space-y-3">
            {[
              { term: "P(A)", name: "Prior", desc: "Initial belief in A before seeing evidence B. How likely is disease before testing?" },
              { term: "P(B|A)", name: "Likelihood", desc: "How likely is evidence B if A is true? Test sensitivity — how often does the test detect real disease?" },
              { term: "P(B)", name: "Marginal", desc: "Total probability of observing B across all scenarios. Base rate of a positive test result." },
              { term: "P(A|B)", name: "Posterior", desc: "Updated belief in A after observing B. Probability of disease given a positive test." },
            ].map(t => (
              <div key={t.term} className="p-3 rounded-xl bg-white/3 border border-white/5 flex gap-3">
                <code className="text-[10px] font-mono font-black text-emerald-400 shrink-0 w-14">{t.term}</code>
                <div>
                  <p className="text-[10px] font-black text-white">{t.name}</p>
                  <p className="text-[10px] text-gray-600">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-[10px] font-black text-amber-400 mb-1">Classic Example: Medical Test</p>
            <p className="text-[10px] text-gray-500 leading-relaxed">Disease prevalence 1%, test sensitivity 99%, specificity 99%. P(disease|positive) = only <strong className="text-white">~50%</strong> — even with a great test, rare diseases cause many false positives. This is why doctors order confirmatory tests.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [probA, setProbA] = useState(0.6)
  const [probB, setProbB] = useState(0.5)
  const [intersection, setIntersection] = useState(0.3)
  const [view, setView] = useState<"venn" | "tree">("venn")

  const validIntersection = useMemo(() => {
    const min = Math.max(0, probA + probB - 1)
    const max = Math.min(probA, probB)
    return Math.min(Math.max(intersection, min), max)
  }, [probA, probB, intersection])

  const condAB = validIntersection / probB
  const condBA = validIntersection / probA
  const isIndependent = Math.abs(validIntersection - probA * probB) < 0.001

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-[28px] border-white/5 space-y-4">
            <p className="text-[9px] uppercase font-black text-gray-600">Parameters</p>
            {[
              { label: "P(A)", value: probA, set: setProbA, min: 0, max: 1, color: "emerald" },
              { label: "P(B)", value: probB, set: setProbB, min: 0, max: 1, color: "blue" },
              { label: "P(A ∩ B)", value: intersection, set: setIntersection, min: Math.max(0, probA + probB - 1), max: Math.min(probA, probB), color: "indigo" },
            ].map(s => (
              <div key={s.label} className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-black uppercase text-gray-600">
                  <span>{s.label}</span>
                  <span className={s.color === "emerald" ? "text-emerald-400" : s.color === "blue" ? "text-blue-400" : "text-indigo-400"}>{s.value.toFixed(2)}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step="0.01" value={s.value} onChange={e => s.set(parseFloat(e.target.value))} className={cn("w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer", s.color === "emerald" ? "accent-emerald-500" : s.color === "blue" ? "accent-blue-500" : "accent-indigo-500")} />
              </div>
            ))}
            <div className={cn("px-3 py-2 rounded-xl text-[10px] font-black uppercase text-center", isIndependent ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20")}>
              {isIndependent ? "Independent" : "Dependent"}
            </div>
            <div className="flex gap-2">
              {(["venn", "tree"] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className={cn("flex-1 py-2 rounded-xl text-[10px] font-black uppercase border transition-all", view === v ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-white/3 border-white/5 text-gray-600")}>
                  {v === "venn" ? <Layers className="w-3 h-3 mx-auto" /> : <GitBranch className="w-3 h-3 mx-auto" />}
                  <span className="block">{v}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="glass p-5 rounded-[24px] border-emerald-500/10 space-y-3">
            <div className="flex items-center gap-2"><Calculator className="w-3 h-3 text-emerald-500" /><p className="text-[9px] uppercase font-black text-gray-600">Results</p></div>
            {[
              { label: "P(A|B)", value: condAB, formula: `\\frac{${validIntersection.toFixed(2)}}{${probB.toFixed(2)}}` },
              { label: "P(B|A)", value: condBA, formula: `\\frac{${validIntersection.toFixed(2)}}{${probA.toFixed(2)}}` },
            ].map(r => (
              <div key={r.label} className="p-3 bg-white/3 border border-white/5 rounded-xl space-y-1">
                <div className="flex justify-between"><span className="text-[10px] font-black text-emerald-400">{r.label}</span><span className="text-base font-black font-mono">{(r.value * 100).toFixed(1)}%</span></div>
                <MathRenderer tex={r.formula} className="text-[8px] text-gray-600" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 glass p-6 rounded-[32px] border-white/5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] uppercase font-black text-gray-600">{view === "venn" ? "Venn Diagram" : "Probability Tree"}</p>
          </div>
          {view === "venn" ? (
            <div className="relative h-72 flex items-center justify-center overflow-hidden">
              <motion.div animate={{ width: probA * 340, height: probA * 340, x: -60 - validIntersection * 80 }} className="absolute rounded-full border-2 border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center">
                <span className="text-[11px] font-black text-emerald-400">A = {(probA * 100).toFixed(0)}%</span>
              </motion.div>
              <motion.div animate={{ width: probB * 340, height: probB * 340, x: 60 + validIntersection * 80 }} className="absolute rounded-full border-2 border-blue-500/50 bg-blue-500/10 flex items-center justify-center">
                <span className="text-[11px] font-black text-blue-400">B = {(probB * 100).toFixed(0)}%</span>
              </motion.div>
              <div className="absolute text-center z-10">
                <p className="text-[9px] text-white/30 uppercase font-black">A∩B</p>
                <p className="text-sm font-black text-white">{(validIntersection * 100).toFixed(0)}%</p>
              </div>
            </div>
          ) : (
            <div className="h-72 flex flex-col gap-6 font-mono text-[10px] justify-center px-4">
              <div className="flex justify-center"><div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400">ROOT Ω = 1.00</div></div>
              <div className="flex justify-around">
                {[
                  { label: "A", prob: probA, color: "emerald", children: [
                    { label: "B|A", prob: condBA, color: "blue" },
                    { label: "B'|A", prob: 1 - condBA, color: "gray" },
                  ]},
                  { label: "A'", prob: 1 - probA, color: "gray", children: [
                    { label: "B|A'", prob: (probB - validIntersection) / (1 - probA), color: "blue" },
                    { label: "B'|A'", prob: 1 - (probB - validIntersection) / (1 - probA), color: "gray" },
                  ]},
                ].map(branch => (
                  <div key={branch.label} className="flex flex-col items-center gap-4">
                    <div className={cn("px-4 py-2 rounded-xl border", branch.color === "emerald" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-gray-500")}>
                      {branch.label} = {branch.prob.toFixed(2)}
                    </div>
                    <div className="flex gap-3">
                      {branch.children.map(ch => (
                        <div key={ch.label} className={cn("px-3 py-1.5 rounded-lg border text-[9px]", ch.color === "blue" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white/3 border-white/5 text-gray-600")}>
                          {ch.label}: {isNaN(ch.prob) ? "—" : ch.prob.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DeepDiveTab() {
  return (
    <div className="space-y-6">
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Bayes&apos; Theorem — The Medical Test Example</h3>
        <p className="text-sm text-gray-400 leading-relaxed">The most illuminating application of Bayes&apos; Theorem is the medical testing paradox — even a highly accurate test can produce mostly false positives for rare conditions.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {[
              { label: "Disease prevalence", sym: "P(D)", val: "0.01", note: "1% of population has disease" },
              { label: "Test sensitivity", sym: "P(+|D)", val: "0.99", note: "99% of sick people test positive" },
              { label: "Test specificity", sym: "P(-|¬D)", val: "0.99", note: "99% of healthy people test negative" },
              { label: "False positive rate", sym: "P(+|¬D)", val: "0.01", note: "" },
            ].map(r => (
              <div key={r.sym} className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5">
                <div><p className="text-[10px] font-black text-white">{r.label}</p>{r.note && <p className="text-[9px] text-gray-600">{r.note}</p>}</div>
                <div className="text-right"><code className="text-[9px] text-emerald-400 font-mono">{r.sym} = {r.val}</code></div>
              </div>
            ))}
          </div>
          <div className="bg-black/40 p-5 rounded-2xl border border-emerald-500/10 space-y-3">
            <p className="text-[10px] font-black text-emerald-400 uppercase">Calculation via Bayes</p>
            <div className="space-y-2">
              <MathRenderer tex="P(+) = P(+|D)P(D) + P(+|\neg D)P(\neg D)" block className="text-[9px] text-gray-500" />
              <MathRenderer tex="= (0.99)(0.01) + (0.01)(0.99) = 0.0198" block className="text-[9px] text-gray-500" />
              <MathRenderer tex="P(D|+) = \frac{P(+|D) \cdot P(D)}{P(+)} = \frac{0.0099}{0.0198} = 0.5" block className="text-emerald-400" />
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] font-black text-amber-400 mb-1">Result: 50% chance of disease given positive test!</p>
              <p className="text-[10px] text-gray-500">The low base rate (1%) overwhelms the test accuracy. For every 10,000 people: 99 true positives, but also 99 false positives. Half of positive results are wrong.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("base-rate")
  const pitfalls = [
    { id: "base-rate", severity: "HIGH", title: "The Base Rate Fallacy",
      summary: "Ignoring P(A) — the prior — when interpreting conditional probabilities. Even accurate tests produce misleading results when the base rate is very low.",
      bad: `// ❌ Bad reasoning (base rate neglect):
// "Our spam filter is 99% accurate"
// "This email triggered the filter"
// "Therefore there's a 99% chance it's spam"
// WRONG — ignores that only 2% of emails are actually spam

// 99% accurate → detects real spam (sensitivity)
//              → correctly identifies ham (specificity)
// But if base rate of spam is only 2%:
// Of 10,000 emails: 200 spam, 9800 ham
// Filter catches: 198 spam (correctly)
// But also flags: 98 ham emails as spam (false positives)
// P(actually spam | flagged) = 198/(198+98) ≈ 67%
// Not 99%!`,
      good: `// ✅ Always account for the base rate (prior):
// Given: sensitivity=99%, specificity=99%, prevalence=2%
P_spam = 0.02
P_spam_given_flagged = 
  (0.99 * P_spam) / 
  (0.99 * P_spam + 0.01 * (1 - P_spam))
= 0.0198 / (0.0198 + 0.0098)
= 0.0198 / 0.0296
≈ 0.669  // 67%, not 99%

// Applications of base rate awareness:
// - Medical tests: use pre-test probability
// - Security alerts: high FP when attacks are rare
// - A/B testing: consider prior conversion rate
// - ML classification: class imbalance problem`,
    },
  ]
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Conditional probability is frequently misapplied in real-world reasoning. The base rate fallacy and confusion of P(A|B) with P(B|A) are extremely common — even among experts.</p>
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
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Fallacy</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Correct Approach</p><pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
