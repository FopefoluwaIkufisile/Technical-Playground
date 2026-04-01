"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { discrete } from "@/lib/probability"

type ApproxMode = "binomial-poisson" | "binomial-normal" | "hypergeometric-binomial"

export default function MathApproximationsPage() {
  const [mode, setMode] = useState<ApproxMode>("binomial-poisson")
  const [n, setN] = useState(40)
  const [p, setP] = useState(0.08)
  const [kMin, setKMin] = useState(0)
  const [kMax, setKMax] = useState(4)
  const [N, setPopulation] = useState(500)
  const [K, setSuccesses] = useState(70)
  const [sampleSize, setSampleSize] = useState(20)

  const result = useMemo(() => {
    const lo = Math.min(kMin, kMax)
    const hi = Math.max(kMin, kMax)
    let exact = 0
    let approx = 0
    let note = ""

    for (let k = lo; k <= hi; k++) {
      if (mode === "binomial-poisson") {
        exact += discrete.binomial(k, n, p)
        approx += discrete.poisson(k, n * p)
        note = `Good when n is large and p is small (here np^2 = ${(n * p * p).toFixed(3)}).`
      } else if (mode === "binomial-normal") {
        exact += discrete.binomial(k, n, p)
        approx += normalCDF((k + 0.5 - n * p) / Math.sqrt(n * p * (1 - p))) - normalCDF((k - 0.5 - n * p) / Math.sqrt(n * p * (1 - p)))
        note = "Using continuity correction for a better normal approximation."
      } else {
        exact += discrete.hypergeometric(k, N, K, sampleSize)
        approx += discrete.binomial(k, sampleSize, K / N)
        note = `Good when sampling fraction n/N is small (here ${(sampleSize / N).toFixed(3)}).`
      }
    }

    return {
      lo,
      hi,
      exact,
      approx,
      absError: Math.abs(exact - approx),
      note
    }
  }, [mode, n, p, kMin, kMax, N, K, sampleSize])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <nav>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </nav>

        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Converge</h1>
          <p className="text-gray-400">Exact vs approximation lab for Unit 4 and Unit 5 limit ideas.</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <label className="block text-xs uppercase text-gray-400">Approximation type</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ApproxMode)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm"
            >
              <option value="binomial-poisson">Binomial ~ Poisson</option>
              <option value="binomial-normal">Binomial ~ Normal (with continuity correction)</option>
              <option value="hypergeometric-binomial">Hypergeometric ~ Binomial</option>
            </select>

            {(mode === "binomial-poisson" || mode === "binomial-normal") && (
              <div className="grid sm:grid-cols-2 gap-4">
                <NumberField label="n (trials)" value={n} onChange={setN} step={1} />
                <NumberField label="p (success prob)" value={p} onChange={setP} step={0.01} min={0.01} max={0.99} />
              </div>
            )}

            {mode === "hypergeometric-binomial" && (
              <div className="grid sm:grid-cols-3 gap-4">
                <NumberField label="N (population)" value={N} onChange={setPopulation} step={1} min={5} />
                <NumberField label="K (success states)" value={K} onChange={setSuccesses} step={1} min={1} max={N} />
                <NumberField label="n (sample size)" value={sampleSize} onChange={setSampleSize} step={1} min={1} max={N} />
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <NumberField label="k min" value={kMin} onChange={setKMin} step={1} min={0} />
              <NumberField label="k max" value={kMax} onChange={setKMax} step={1} min={0} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <p className="text-xs uppercase text-gray-400">Probability window</p>
            <p className="text-sm text-gray-300">P({result.lo} ≤ X ≤ {result.hi})</p>
            <p className="text-sm">Exact: <span className="text-blue-300 font-mono">{result.exact.toFixed(6)}</span></p>
            <p className="text-sm">Approx: <span className="text-violet-300 font-mono">{result.approx.toFixed(6)}</span></p>
            <p className="text-sm">Abs error: <span className="text-amber-300 font-mono">{result.absError.toFixed(6)}</span></p>
            <p className="text-xs text-gray-400 pt-2 border-t border-white/10">{result.note}</p>
          </div>
        </section>
      </div>
    </main>
  )
}

function NumberField({
  label,
  value,
  onChange,
  step,
  min,
  max
}: {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
}) {
  return (
    <label className="space-y-1 block">
      <span className="text-xs uppercase text-gray-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        min={min}
        max={max}
        className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm"
      />
    </label>
  )
}

function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)))
}

function erf(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const sign = x < 0 ? -1 : 1
  const ax = Math.abs(x)
  const t = 1 / (1 + p * ax)
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-ax * ax)
  return sign * y
}
