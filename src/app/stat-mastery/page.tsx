"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Brain, Target, BookOpen, GraduationCap, ClipboardCheck, Timer, Zap, Lightbulb, HelpCircle, ChevronRight, Calculator, RefreshCw, AlertCircle, CheckCircle2, Sigma, Database } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import MathRenderer from "@/components/Math"

type Tab = "concepts" | "trainer" | "practice" | "test"

export default function StatMasteryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("concepts")

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-indigo-500/30 font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-500/5">
            <GraduationCap className="w-3.5 h-3.5 animate-bounce" />
            STAT 2400 Mastery Suite
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="max-w-6xl mx-auto w-full mb-12 space-y-6">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <header className="space-y-2">
               <motion.h1 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-4xl sm:text-6xl font-black italic tracking-tighter leading-none"
               >
                 TEST 3 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-600">PREPARER.</span>
               </motion.h1>
               <p className="text-xs uppercase font-bold tracking-[0.3em] text-gray-600 pl-1">Comprehensive Theory & Logic Drills</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex p-1 bg-white/5 border border-white/5 rounded-2xl md:w-auto h-fit">
               {(["concepts", "trainer", "practice", "test"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      activeTab === tab ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20" : "text-gray-500 hover:text-white"
                    )}
                  >
                    {tab}
                  </button>
               ))}
            </div>
         </div>
         <div className="h-[1px] w-full bg-gradient-to-r from-indigo-500/50 via-white/5 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full flex-1 relative min-h-[600px]">
         <AnimatePresence mode="wait">
            {activeTab === "concepts" && <ConceptSection key="concepts" />}
            {activeTab === "trainer" && <TrainerSection key="trainer" />}
            {activeTab === "practice" && <PracticeSection key="practice" />}
            {activeTab === "test" && <MockTestSection key="test" />}
         </AnimatePresence>
      </div>
    </main>
  )
}

/* --- SECTIONS --- */

function ConceptSection() {
    return (
        <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
        >
            <ConceptCard 
                title="Hypergeometric"
                icon={<Target className="text-rose-400" />}
                intuition="Sampling without replacement from a finite population."
                trigger="Check if the population size changes as you pick items."
                formula="P(X=k) = \frac{\binom{K}{k}\binom{N-K}{n-k}}{\binom{N}{n}}"
                examples={["Picking card hands", "Selecting defective bulbs from a batch"]}
            />
            <ConceptCard 
                title="Bernoulli / Binomial"
                icon={<Zap className="text-indigo-400" />}
                intuition="Counting successes in 'n' independent, identical yes/no trials."
                trigger="Fixed number of trials, constant probability, independent."
                formula="P(X=k) = \binom{n}{k} p^k q^{n-k}"
                examples={["Flipping a coin 10 times", "Passing rate of 100 students"]}
            />
            <ConceptCard 
                title="Geometric"
                icon={<RefreshCw className="text-cyan-400" />}
                intuition="Number of trials needed to get the FIRST success."
                trigger="Wait for the first... (e.g. roll until you get a 6)."
                formula="P(X=k) = (1-p)^{k-1} p"
                examples={["Rolling a die until a 6", "Buying lottery tickets until you win"]}
            />
            <ConceptCard 
                title="Poisson"
                icon={<Timer className="text-amber-400" />}
                intuition="Counting random events over a fixed interval of time or space."
                trigger="Look for a rate (λ) like '3 calls per hour'."
                formula="P(X=k) = \frac{e^{-\lambda} \lambda^k}{k!}"
                examples={["Website traffic", "Customer arrivals", "Typos per page"]}
            />
            <ConceptCard 
                title="Normal (Continuous)"
                icon={<Sigma className="text-sky-400" />}
                intuition="The 'Bell Curve' that many natural phenomena follow. Symmetric."
                trigger="Central Limit Theorem, heights, test scores, measurement errors."
                formula="f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}"
                examples={["IQ scores", "Adult heights", "Filling machines variation"]}
                type="Continuous"
            />
            <ConceptCard 
                title="Exponential (Continuous)"
                icon={<Timer className="text-orange-400" />}
                intuition="The amount of time BETWEEN Poisson events. Memoryless."
                trigger="Time until next... Wait times. Radioactive decay."
                formula="f(x) = \lambda e^{-\lambda x}"
                examples={["Time between customer arrivals", "Life of an electronic part"]}
                type="Continuous"
            />
            <ConceptCard 
                title="Transformation"
                icon={<RefreshCw className="text-emerald-400" />}
                intuition="Finding the distribution of a variable Y derived from X (e.g., Y = X²)."
                trigger="Formula Y = g(X) given, need to find fY(y)."
                formula="f_Y(y) = f_X(g^{-1}(y)) \cdot \left| \frac{d}{dy} g^{-1}(y) \right|"
                examples={["Area of a circle given radius distribution", "Profit from sales X"]}
            />
            <ConceptCard 
                title="CDF & PDF"
                icon={<Database className="text-violet-400" />}
                intuition="PDF is the slope; CDF is the running total area (accumulated prob)."
                trigger="P(a < X < b) = F(b) - F(a). PDF is the derivative of CDF."
                formula="F(x) = \int_{-\infty}^{x} f(t) dt"
                examples={["Finding percentiles", "Calculating median", "Finding P(X < 5)"]}
                type="Fundamental"
            />
            {/* Quick Recall Section */}
            <div className="lg:col-span-3 pt-12 border-t border-white/5 space-y-8">
                <header className="text-center space-y-1">
                    <h3 className="text-2xl font-black italic tracking-tighter">QUICK RECALL</h3>
                    <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Flash Drills</p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <RecallCard q="When is Hypergeometric used?" a="Sampling without replacement from a finite pool." />
                    <RecallCard q="What does λ represent in Poisson?" a="The average rate of events per interval." />
                    <RecallCard q="What is the key property of Exponential?" a="Memoryless property: P(X > s+t | X > s) = P(X > t)." />
                    <RecallCard q="What happens to Binomial as n -> ∞?" a="It converges to Normal (if np/nq > 5) or Poisson (if p is small)." />
                </div>
            </div>
        </motion.section>
    )
}

function TrainerSection() {
    const scenarios = [
        {
            text: "A bowl contains 10 blue and 5 red marbles. You select 3 marbles at random WITHOUT replacement. What is the probability of getting exactly 2 blue marbles?",
            q1: "Is the sample selection with or without replacement?",
            choices1: ["With Replacement", "Without Replacement"],
            ans1: "Without Replacement",
            q2: "Given the population is finite (15 marbles) and we sample without replacement, which model applies?",
            choices2: ["Binomial", "Hypergeometric", "Poisson"],
            ans2: "Hypergeometric",
            hint: "When population size decreases with every selection, the trials are NOT independent."
        },
        {
            text: "A call center receives an average of 12 calls per hour. What is the probability that they receive more than 3 calls in the next 15 minutes?",
            q1: "Are we counting successes in trials or events over a time interval?",
            choices1: ["Trials (n)", "Time/Space Interval"],
            ans1: "Time/Space Interval",
            q2: "What is the appropriate rate (λ) for the 15-minute interval?",
            choices2: ["λ = 12", "λ = 3", "λ = 1.5"],
            ans2: "λ = 3",
            hint: "Divide the hourly rate by 4 to get the 15-minute rate."
        }
    ]

    const [currentStep, setCurrentStep] = useState(0)
    const [subStep, setSubStep] = useState(1)
    const [feedback, setFeedback] = useState<string | null>(null)

    const handleChoice = (choice: string) => {
        const scenario = scenarios[currentStep]
        const correct = subStep === 1 ? scenario.ans1 : scenario.ans2
        
        if (choice === correct) {
            setFeedback("✅ INTEGRITY CHECK: PASS. You correctly identified the logic.")
            setTimeout(() => {
                if (subStep === 1) setSubStep(2)
                else {
                    setFeedback(null)
                    setSubStep(1)
                    setCurrentStep((prev) => (prev + 1) % scenarios.length)
                }
            }, 1000)
        } else {
            setFeedback(`❌ MISTAKE DETECTED: ${scenario.hint}`)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8 max-w-4xl mx-auto"
        >
            <div className="glass p-10 rounded-[40px] border-white/5 space-y-8 relative overflow-hidden w-full">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 pointer-events-none">
                    <Target className="w-64 h-64" />
                </div>

                <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                             <Target className="w-5 h-5" />
                         </div>
                         <h2 className="text-xl font-bold tracking-tight">Scenario Drill</h2>
                    </div>
                    <p className="text-lg font-light leading-relaxed text-gray-300 italic">
                       "{scenarios[currentStep].text}"
                    </p>
                </div>

                <div className="space-y-8 pt-8 border-t border-white/5">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Decision Point {subStep}</label>
                        <h4 className="text-lg font-bold">{subStep === 1 ? scenarios[currentStep].q1 : scenarios[currentStep].q2}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(subStep === 1 ? scenarios[currentStep].choices1 : scenarios[currentStep].choices2).map((choice) => (
                            <button
                                key={choice}
                                onClick={() => handleChoice(choice)}
                                className="group relative p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold">{choice}</span>
                                    <ChevronRight className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {feedback && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "p-4 rounded-2xl border text-[11px] font-black uppercase tracking-widest",
                            feedback.includes("✅") ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        )}
                    >
                        {feedback}
                    </motion.div>
                )}
            </div>

            <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Logic Flow: Active</p>
            </div>
        </motion.div>
    )
}

function PracticeSection() {
    const [currentProblem, setCurrentProblem] = useState<any>(null)
    const [revealSteps, setRevealSteps] = useState(0)

    const generateProblem = (type?: string) => {
        const types = ["hyper", "poisson", "binomial", "transform"]
        const selectedType = type?.toLowerCase() || types[Math.floor(Math.random() * types.length)]
        setRevealSteps(0)

        if (selectedType.includes("hyper")) {
            const N = 20 + Math.floor(Math.random() * 30)
            const K = 5 + Math.floor(Math.random() * 10)
            const n = 3 + Math.floor(Math.random() * 5)
            const k = 1 + Math.floor(Math.random() * 2)
            setCurrentProblem({
                title: "Hypergeometric (Item Selection)",
                text: `A warehouse has ${N} units, ${K} of which are slightly defective. If you select ${n} units at random without replacement, what is the probability that exactly ${k} are defective?`,
                steps: [
                    { t: "Identify Parameters", d: `N=${N}, K=${K}, n=${n}, k=${k}.` },
                    { t: "Set up Formula", d: `P(X=k) = \\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}}` },
                    { t: "Plug in Values", d: `P(X=${k}) = \\frac{\\binom{${K}}{${k}}\\binom{${N-K}}{${n-k}}}{\\binom{${N}}{${n}}}` },
                    { t: "Final Calculation", d: "Calculate the combinations and divide. Ensure k \\le K and n-k \\le N-K." }
                ]
            })
        } else if (selectedType.includes("poisson")) {
            const rate = 2 + Math.floor(Math.random() * 8)
            const time = 2 + Math.floor(Math.random() * 3)
            const k = 1 + Math.floor(Math.random() * 3)
            setCurrentProblem({
                title: "Poisson (Time Intervals)",
                text: `Customers arrive at a shop at a rate of ${rate} per hour. What is the probability that exactly ${k} customers arrive in the next ${time} hours?`,
                steps: [
                    { t: "Adjust Rate (λ)", d: `\\lambda = ${rate} \\times ${time} = ${rate * time}.` },
                    { t: "Set up Formula", d: `P(X=k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}` },
                    { t: "Plug in Values", d: `P(X=${k}) = \\frac{e^{-${rate * time}} ${rate * time}^{k}}{${k}!}` },
                    { t: "Final Calculation", d: "Compute the exponential and factorial components." }
                ]
            })
        } else if (selectedType.includes("transform")) {
            const mult = 2 + Math.floor(Math.random() * 3)
            const add = 1 + Math.floor(Math.random() * 5)
            setCurrentProblem({
                title: "Transformation (Y=g(X))",
                text: `Let X be a continuous RV with PDF fX(x). Find the PDF of Y = ${mult}X + ${add}.`,
                steps: [
                    { t: "Find Inverse Mapping", d: `y = ${mult}x + ${add} \\implies x = \\frac{y - ${add}}{${mult}}` },
                    { t: "Calculate Derivative", d: `\\frac{dx}{dy} = \\frac{d}{dy} \\left[ \\frac{y - ${add}}{${mult}} \\right] = \\frac{1}{${mult}}` },
                    { t: "Transformation Theorem", d: `f_Y(y) = f_X\\left( \\frac{y - ${add}}{${mult}} \\right) \\cdot \\left| \\frac{1}{${mult}} \\right|` },
                    { t: "Conclusion", d: "Plug the inverse into the original fX and multiply by the Jacobian." }
                ]
            })
        } else if (selectedType.includes("binomial")) {
            const n = 5 + Math.floor(Math.random() * 10)
            const p = (0.1 + Math.random() * 0.4).toFixed(2)
            const k = 2 + Math.floor(Math.random() * 2)
            setCurrentProblem({
                title: "Binomial (Independent Trials)",
                text: `The probability that a seed germinates is ${p}. If you plant ${n} independent seeds, what is the probability that exactly ${k} germinate?`,
                steps: [
                    { t: "Identify Parameters", d: `n=${n}, p=${p}, k=${k}.` },
                    { t: "Set up Formula", d: `P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}` },
                    { t: "Plug in Values", d: `P(X=${k}) = \\binom{${n}}{${k}} (${p})^${k} (1-${p})^{${n-k}}` },
                    { t: "Final Calculation", d: "Calculate the combination coefficient and exponents." }
                ]
            })
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
            <div className="glass p-10 rounded-[40px] border-white/5 space-y-6 h-fit">
                <header className="space-y-1">
                    <h3 className="text-xl font-bold">Infinite Practice</h3>
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Procedural Generation</p>
                </header>
                
                <div className="space-y-4">
                    <PracticeBtn onClick={() => generateProblem("hyper")} type="Hypergeometric" icon={<Database />} count={14} />
                    <PracticeBtn onClick={() => generateProblem("poisson")} type="Poisson Intervals" icon={<Timer />} count={8} />
                    <PracticeBtn onClick={() => generateProblem("binomial")} type="Binomial Trials" icon={<Zap />} count={12} />
                    <PracticeBtn onClick={() => generateProblem("transform")} type="Transformations" icon={<RefreshCw />} count={11} />
                </div>

                <div className="pt-8 border-t border-white/5">
                    <button 
                        onClick={() => generateProblem()}
                        className="group w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20"
                    >
                        <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        GENERATE RANDOM PROBLEM
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {currentProblem ? (
                    <motion.div 
                        key="active-prob"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass p-10 rounded-[40px] border border-white/10 space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 pointer-events-none">
                            <Brain className="w-64 h-64" />
                        </div>

                        <header className="space-y-2 relative z-10">
                            <h4 className="text-2xl font-black italic tracking-tighter text-indigo-400">{currentProblem.title}</h4>
                            <p className="text-lg font-light leading-relaxed text-gray-200">
                                {currentProblem.text}
                            </p>
                        </header>

                        <div className="space-y-4 pt-8 border-t border-white/5 relative z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Step-by-Step Solver</h5>
                                <span className="text-[10px] font-mono text-indigo-500">{revealSteps} / {currentProblem.steps.length} Revealed</span>
                            </div>

                            <div className="space-y-3">
                                {currentProblem.steps.slice(0, revealSteps).map((s: any, i: number) => (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={i} 
                                        className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2"
                                    >
                                        <p className="text-[9px] font-black uppercase text-indigo-400">{s.t}</p>
                                        <MathRenderer tex={s.d} className="text-[11px] font-mono text-gray-400" />
                                    </motion.div>
                                ))}
                            </div>

                            {revealSteps < currentProblem.steps.length && (
                                <button 
                                    onClick={() => setRevealSteps(prev => prev + 1)}
                                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    REVEAL NEXT STEP <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-indigo-600/10 rounded-[40px] border border-indigo-500/20 p-10 flex flex-col justify-center gap-6"
                    >
                        <Lightbulb className="w-12 h-12 text-indigo-400" />
                        <h4 className="text-2xl font-black italic">Tip: The "Step Solver"</h4>
                        <p className="text-sm font-light leading-relaxed text-gray-400">
                            When you generate a problem, use the <span className="text-white font-bold">Step Solver</span> mode. It won't just give you the answer—it will explain the calculus or algebra logic used to get there.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function MockTestSection() {
    const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle")
    const [currentIdx, setCurrentIdx] = useState(0)
    const [score, setScore] = useState(0)
    const [questions, setQuestions] = useState<any[]>([])
    const [timer, setTimer] = useState(300) // 5 minutes for demo test
    
    const startTest = () => {
        const pool = [
            { q: "You pick 2 cards from a deck of 52. What distribution models the number of Aces?", a: "Hypergeometric", options: ["Binomial", "Hypergeometric", "Poisson"] },
            { q: "Y = 2X + 5. If X is Normal(0,1), what is the mean of Y?", a: "5", options: ["0", "5", "10"] },
            { q: "Events occur at rate λ=4/hr. What is the expected time between events?", a: "15 mins", options: ["15 mins", "4 mins", "60 mins"] },
            { q: "A process has constant prob 'p' of success. You want the prob of the 10th trial being the 1st success. Use:", a: "Geometric", options: ["Binomial", "Geometric", "Negative Binomial"] },
            { q: "Is the CDF always non-decreasing?", a: "Yes", options: ["Yes", "No", "Only for Discrete"] }
        ]
        setQuestions(pool.sort(() => Math.random() - 0.5))
        setGameState("playing")
        setScore(0)
        setCurrentIdx(0)
    }

    const handleAnswer = (ans: string) => {
        if (ans === questions[currentIdx].a) setScore(s => s + 1)
        if (currentIdx < questions.length - 1) setCurrentIdx(c => c + 1)
        else setGameState("finished")
    }

    if (gameState === "finished") {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[500px] glass rounded-[40px] border-white/5 space-y-8 text-center p-12">
                <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center border-4 border-indigo-500/50">
                    <span className="text-3xl font-black italic">{Math.round((score/questions.length)*100)}%</span>
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white">Simulation Complete</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Score: {score} / {questions.length} Correct</p>
                </div>
                <button onClick={() => setGameState("idle")} className="px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest">RETREAT & STUDY</button>
            </motion.div>
        )
    }

    if (gameState === "playing") {
        return (
            <motion.div key="test-play" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto w-full glass p-12 rounded-[40px] border-white/10 space-y-10">
                <div className="flex justify-between items-center">
                    <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black tracking-widest uppercase">
                        Question {currentIdx + 1} of {questions.length}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold leading-tight">{questions[currentIdx].q}</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {questions[currentIdx].options.map((opt: string) => (
                            <button 
                                key={opt} onClick={() => handleAnswer(opt)}
                                className="w-full text-left p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all font-bold text-sm"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-[500px] glass rounded-[40px] border-white/5 p-12 text-center space-y-8">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30">
                <ClipboardCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter">Test 3 Simulation</h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">10 random questions covering Hypergeometric, Poisson, transformations, and normal approximations. Timed mode.</p>
            </div>
            <button onClick={startTest} className="px-10 py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                START SIMULATION
            </button>
        </div>
    )
}

function RecallCard({ q, a }: { q: string, a: string }) {
    const [flipped, setFlipped] = useState(false)
    return (
        <button 
            onClick={() => setFlipped(!flipped)}
            className="h-32 perspective-1000 relative group"
        >
            <AnimatePresence mode="wait">
                {!flipped ? (
                    <motion.div 
                        key="q"
                        initial={{ rotateY: -90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: 90, opacity: 0 }}
                        className="absolute inset-0 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-center"
                    >
                        <p className="text-[10px] font-black uppercase text-gray-500">{q}</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="a"
                        initial={{ rotateY: -90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: 90, opacity: 0 }}
                        className="absolute inset-0 p-4 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl flex items-center justify-center text-center shadow-lg shadow-indigo-500/20"
                    >
                        <p className="text-[10px] font-bold text-indigo-300 leading-relaxed italic">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    )
}

/* --- COMPONENTS --- */

function ConceptCard({ title, icon, intuition, trigger, formula, examples, type = "Discrete" }: any) {
    const [isExpanded, setIsExpanded] = useState(false)
    return (
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-6 hover:translate-y-[-4px] transition-all cursor-default">
            <div className="flex justify-between items-start">
               <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                  {icon}
               </div>
               <div className={cn(
                   "px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-bold uppercase",
                   type === "Discrete" ? "text-indigo-400" : type === "Continuous" ? "text-emerald-400" : "text-gray-600"
               )}>
                  {type}
               </div>
            </div>
            <div className="space-y-1">
                <h4 className="text-xl font-bold tracking-tight">{title}</h4>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Intuition</p>
                <p className="text-sm font-light text-gray-400 leading-relaxed italic">"{intuition}"</p>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Recognition Hook</p>
                    <p className="text-xs font-bold text-indigo-400">{trigger}</p>
                </div>
                
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-center py-6">
                    <MathRenderer tex={formula} block />
                </div>
            </div>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[9px] font-black uppercase tracking-widest text-gray-700 hover:text-white flex items-center gap-1 transition-colors"
            >
                {isExpanded ? "Show Less" : "View Examples"}
                <ChevronRight className={cn("w-3 h-3 transition-transform", isExpanded && "rotate-90")} />
            </button>
            
            <AnimatePresence>
                {isExpanded && (
                    <motion.ul 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 overflow-hidden"
                    >
                        {examples.map((ex: string, i: number) => (
                            <li key={i} className="text-[10px] text-gray-500 decimal-list flex gap-2">
                                <span className="text-indigo-500">●</span> {ex}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}

function PracticeBtn({ type, icon, count }: any) {
    return (
        <button className="w-full group p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-black/40 text-gray-500 group-hover:text-indigo-400 transition-colors">
                    {icon}
                </div>
                <div className="text-left">
                    <p className="text-xs font-bold">{type}</p>
                    <p className="text-[9px] text-teal-500 font-black tracking-widest uppercase">Available: {count} cases</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-800 group-hover:text-white transition-colors" />
        </button>
    )
}
