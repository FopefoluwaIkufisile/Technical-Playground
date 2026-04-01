"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type Base = "uniform01" | "exponential"
type Transform = "negLog" | "square" | "affine"

export default function RVTransformsPage() {
  const [base, setBase] = useState<Base>("uniform01")
  const [transform, setTransform] = useState<Transform>("negLog")
  const [lambda, setLambda] = useState(1)
  const [a, setA] = useState(2)
  const [b, setB] = useState(1)
  const [y, setY] = useState(1)

  const output = useMemo(() => {
    if (base === "uniform01" && transform === "negLog") {
      const cdf = y <= 0 ? 0 : 1 - Math.exp(-y)
      const pdf = y <= 0 ? 0 : Math.exp(-y)
      return {
        support: "y > 0",
        cdf,
        pdf,
        note: "If X ~ U(0,1), then Y=-ln(X) ~ Exp(1)."
      }
    }

    if (base === "uniform01" && transform === "square") {
      const cdf = y <= 0 ? 0 : y >= 1 ? 1 : Math.sqrt(y)
      const pdf = y <= 0 || y >= 1 ? 0 : 1 / (2 * Math.sqrt(y))
      return {
        support: "0 < y < 1",
        cdf,
        pdf,
        note: "For Y=X^2 with X~U(0,1), use inverse x=sqrt(y)."
      }
    }

    if (base === "exponential" && transform === "square") {
      const cdf = y <= 0 ? 0 : 1 - Math.exp(-lambda * Math.sqrt(y))
      const pdf = y <= 0 ? 0 : (lambda * Math.exp(-lambda * Math.sqrt(y))) / (2 * Math.sqrt(y))
      return {
        support: "y > 0",
        cdf,
        pdf,
        note: "Monotone transform Y=X^2 with X~Exp(λ)."
      }
    }

    // affine
    const mu = base === "uniform01" ? 0.5 : 1 / lambda
    const varX = base === "uniform01" ? 1 / 12 : 1 / (lambda * lambda)
    return {
      support: "depends on a and base support",
      cdf: NaN,
      pdf: NaN,
      note: `Affine moments: E[a+bX]=${(a + b * mu).toFixed(4)}, Var(a+bX)=${(b * b * varX).toFixed(4)}`
    }
  }, [base, transform, y, lambda, a, b])

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
          <h1 className="text-3xl sm:text-4xl font-bold">Morph</h1>
          <p className="text-gray-400">Function-of-RV sandbox (CDF method + transformation theorem).</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField
                label="Base random variable"
                value={base}
                onChange={setBase}
                options={[
                  { value: "uniform01", label: "X ~ Uniform(0,1)" },
                  { value: "exponential", label: "X ~ Exponential(λ)" }
                ]}
              />
              <SelectField
                label="Transformation"
                value={transform}
                onChange={setTransform}
                options={[
                  { value: "negLog", label: "Y = -ln(X)" },
                  { value: "square", label: "Y = X^2" },
                  { value: "affine", label: "Y = a + bX" }
                ]}
              />
            </div>

            {base === "exponential" && (
              <NumberField label="lambda (λ)" value={lambda} onChange={setLambda} step={0.1} min={0.1} />
            )}

            {transform === "affine" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <NumberField label="a" value={a} onChange={setA} step={0.1} />
                <NumberField label="b" value={b} onChange={setB} step={0.1} />
              </div>
            )}

            {transform !== "affine" && (
              <NumberField label="Evaluate at y" value={y} onChange={setY} step={0.1} />
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <p className="text-xs uppercase text-gray-400">Derived result</p>
            <p className="text-sm">Support: <span className="text-cyan-300 font-mono">{output.support}</span></p>
            {transform !== "affine" && (
              <>
                <p className="text-sm">F<sub>Y</sub>(y): <span className="text-blue-300 font-mono">{output.cdf.toFixed(6)}</span></p>
                <p className="text-sm">f<sub>Y</sub>(y): <span className="text-violet-300 font-mono">{output.pdf.toFixed(6)}</span></p>
              </>
            )}
            <p className="text-xs text-gray-400 pt-2 border-t border-white/10">{output.note}</p>
          </div>
        </section>
      </div>
    </main>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string
  value: string
  onChange: (v: any) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="space-y-1 block">
      <span className="text-xs uppercase text-gray-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
  step,
  min
}: {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
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
        className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm"
      />
    </label>
  )
}
