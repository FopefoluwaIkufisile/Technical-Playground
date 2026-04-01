"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Target, Info, AreaChart, Calculator, Database, BookOpen, Settings2, Sigma, ArrowRightLeft, MoveRight, FunctionSquare } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { continuous } from "@/lib/probability"
import MathRenderer from "@/components/Math"

type TransformType = "linear" | "square" | "exponential" | "log"
type BaseDist = "uniform" | "normal" | "exponential"

interface MorphConfig {
  name: string
  g: (x: number) => number
  g_inv: (y: number) => number[] // Array because non-monotone (like x^2) can have 2 roots
  deriv_inv: (y: number) => number
  label: string
  formula: string
}

const MORPH_CONFIGS: Record<TransformType, MorphConfig> = {
  linear: {
    name: "Linear",
    g: (x) => 2 * x + 1,
    g_inv: (y) => [(y - 1) / 2],
    deriv_inv: (y) => 0.5,
    label: "Y = 2X + 1",
    formula: "f_Y(y) = f_X\\left(\\frac{y-1}{2}\\right) \\cdot \\left|\\frac{1}{2}\\right|"
  },
  square: {
    name: "Quadratic",
    g: (x) => x * x,
    g_inv: (y) => y < 0 ? [] : [Math.sqrt(y), -Math.sqrt(y)],
    deriv_inv: (y) => y <= 0 ? 0 : 1 / (2 * Math.sqrt(y)),
    label: "Y = X^2",
    formula: "f_Y(y) = \\left[f_X(\\sqrt{y}) + f_X(-\\sqrt{y})\\right] \\cdot \\left|\\frac{1}{2\\sqrt{y}}\\right|"
  },
  exponential: {
    name: "Exponential",
    g: (x) => Math.exp(x),
    g_inv: (y) => y <= 0 ? [] : [Math.log(y)],
    deriv_inv: (y) => y <= 0 ? 0 : 1 / y,
    label: "Y = e^X",
    formula: "f_Y(y) = f_X(\\ln y) \\cdot \\left|\\frac{1}{y}\\right|"
  },
  log: {
    name: "Logarithmic",
    g: (x) => x <= 0 ? -10 : Math.log(x),
    g_inv: (y) => [Math.exp(y)],
    deriv_inv: (y) => Math.exp(y),
    label: "Y = \\ln(X)",
    formula: "f_Y(y) = f_X(e^y) \\cdot |e^y|"
  }
}

export default function MorphPage() {
  const [baseDist, setBaseDist] = useState<BaseDist>("normal")
  const [transType, setTransType] = useState<TransformType>("square")
  const [hoverX, setHoverX] = useState<number | null>(null)

  const chartData = useMemo(() => {
    const xPoints: { x: number, y: number }[] = []
    const yPoints: { x: number, y: number }[] = []
    const steps = 120
    
    // Config range for X
    let minX = -4, maxX = 4
    if (baseDist === "exponential") { minX = 0; maxX = 5 }
    if (baseDist === "uniform") { minX = -2; maxX = 2 }

    const xStep = (maxX - minX) / steps
    for (let i = 0; i <= steps; i++) {
        const x = minX + i * xStep
        let fy = 0
        switch(baseDist) {
            case "uniform": fy = continuous.uniform(x, -1, 1); break
            case "normal": fy = continuous.normal(x, 0, 1); break
            case "exponential": fy = continuous.exponential(x, 1); break
        }
        xPoints.push({ x, y: fy })
    }

    // Config range for Y based on transformation
    const config = MORPH_CONFIGS[transType]
    const yStart = -2, yEnd = 8
    const yStep = (yEnd - yStart) / steps

    for (let i = 0; i <= steps; i++) {
        const y = yStart + i * yStep
        const roots = config.g_inv(y)
        let fy = 0
        roots.forEach(root => {
            let fx = 0
            switch(baseDist) {
                case "uniform": fx = continuous.uniform(root, -1, 1); break
                case "normal": fx = continuous.normal(root, 0, 1); break
                case "exponential": fx = continuous.exponential(root, 1); break
            }
            fy += fx * Math.abs(config.deriv_inv(y))
        })
        yPoints.push({ x: y, y: fy })
    }

    return { xPoints, yPoints }
  }, [baseDist, transType])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-teal-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium flex items-center gap-2">
            <FunctionSquare className="w-3 h-3 animate-pulse" />
            Theory Lab: Morph
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter">Morph</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Density Transformation</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest italic">Input Variable (X)</label>
                       <div className="grid grid-cols-1 gap-1">
                          {(["normal", "uniform", "exponential"] as BaseDist[]).map(d => (
                              <button 
                                key={d} onClick={() => setBaseDist(d)}
                                className={cn(
                                    "px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all text-left",
                                    baseDist === d ? "bg-teal-500 text-white border-teal-400" : "bg-white/5 border-white/5 text-gray-600 hover:text-white"
                                )}
                              >
                                {d}
                              </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-bold uppercase text-gray-700 tracking-widest italic">Transformation g(X)</label>
                       <div className="grid grid-cols-2 gap-1">
                          {Object.entries(MORPH_CONFIGS).map(([id, config]) => (
                                <button 
                                    key={id} onClick={() => setTransType(id as TransformType)}
                                    className={cn(
                                        "px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                        transType === id ? "bg-teal-500/20 border-teal-500 text-teal-400" : "bg-white/5 border-white/5 text-gray-700 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <MathRenderer tex={config.label} />
                                </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-[32px] border-teal-500/10 space-y-4">
              <div className="flex items-center gap-2">
                 <BookOpen className="w-3 h-3 text-teal-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest italic">Transfer Theorem</h3>
              </div>
              <div className="bg-black/40 p-4 rounded-xl flex justify-center py-6">
                <MathRenderer tex={MORPH_CONFIGS[transType].formula} block />
              </div>
              <p className="text-[9px] text-gray-500 italic leading-relaxed">
                 Probability mass is neither created nor destroyed; it is stretched or squeezed by the absolute derivative of the inverse mapping.
              </p>
           </div>
        </section>

        {/* Dual View Visualization */}
        <section className="lg:col-span-3 grid grid-rows-2 gap-6 h-full min-h-[700px]">
           {/* Top: X PDF */}
           <div className="glass rounded-[40px] border-white/5 p-8 relative flex flex-col gap-4">
               <div className="flex justify-between items-center relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-500">Source PDF: <MathRenderer tex="f_X(x)" /></h3>
                  <span className="text-[10px] font-mono text-gray-700 italic">Domain: (-∞, ∞)</span>
               </div>
               <div className="flex-1 relative x-chart mt-4">
                 <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible" onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = ((e.clientX - rect.left) / rect.width) * 8 - 4
                    setHoverX(x)
                 }}>
                    {renderPath(chartData.xPoints, -4, 4, "#2dd4bf")}
                 </svg>
                 {hoverX !== null && (
                    <motion.div 
                        initial={false}
                        animate={{ left: `${((hoverX + 4) / 8) * 100}%` }}
                        className="absolute inset-y-0 w-[1px] bg-teal-400/50 shadow-[0_0_10px_#2dd4bf] z-10"
                    />
                 )}
               </div>
           </div>

           {/* Transfer Animation */}
           <div className="flex items-center justify-center -my-3 group relative pointer-events-none">
              <div className="w-24 h-24 rounded-full bg-teal-500/5 border border-teal-500/20 flex flex-col items-center justify-center text-teal-500 gap-1 hover:scale-110 transition-transform">
                 <ArrowRightLeft className="w-8 h-8 animate-pulse" />
                 <span className="text-[8px] font-black uppercase tracking-[0.2em]">{transType}</span>
              </div>
              <div className="absolute inset-x-32 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
           </div>

           {/* Bottom: Y PDF */}
           <div className="glass rounded-[40px] border-white/5 p-8 relative flex flex-col gap-4">
               <div className="flex justify-between items-center relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-500">Result PDF: <MathRenderer tex="f_Y(y)" /></h3>
                  <span className="text-[10px] font-mono text-gray-700 italic">Transformed Range</span>
               </div>
               <div className="flex-1 relative y-chart mt-4">
                 <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible">
                    {renderPath(chartData.yPoints, -2, 8, "#2dd4bf", true)}
                 </svg>
                 {hoverX !== null && (
                    <AnimatePresence>
                        {(() => {
                            const valY = MORPH_CONFIGS[transType].g(hoverX)
                            if (valY < -2 || valY > 8) return null
                            return (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, left: `${((valY + 2) / 10) * 100}%` }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-y-0 w-2 bg-teal-400/20 shadow-[0_0_20px_#2dd4bf20] z-10 rounded-full"
                                />
                            )
                        })()}
                    </AnimatePresence>
                 )}
               </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function renderPath(points: { x: number, y: number }[], minX: number, maxX: number, color: string, isArea = false) {
    if (points.length < 2) return null
    const range = maxX - minX
    const maxY = Math.max(...points.map(p => p.y), 0.01)
    
    const pathData = points.map((p, i) => {
        const x = ((p.x - minX) / range) * 1000
        const y = 200 - (p.y / maxY) * 180
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    return (
        <g>
            <motion.path d={pathData} fill="none" stroke={color} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
            {isArea && <motion.path d={pathData + " L 1000 200 L 0 200 Z"} fill={`${color}10`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}
        </g>
    )
}
