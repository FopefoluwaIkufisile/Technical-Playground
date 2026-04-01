"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Lock, Unlock, Key, Zap, Shield, Info, BarChart3, ChevronRight, Share2, Terminal, Layers, RefreshCw, Cpu, Hash, Binary } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Algorithm = "aes" | "rsa" | "hashing"

export default function CipherPage() {
  const [algo, setAlgo] = useState<Algorithm>("aes")
  const [input, setInput] = useState("SECURE_MSG")
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [phase, setPhase] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => setLogs(p => [`[CIPHER] ${msg}`, ...p].slice(0, 10))

  const runCipher = async () => {
    if (isEncrypting) return
    setIsEncrypting(true)
    setPhase(0)
    addLog(`Initiating ${algo.toUpperCase()} workflow for: ${input}`)

    const phases = algo === "aes" ? 4 : 3
    for (let i = 1; i <= phases; i++) {
       setPhase(i)
       if (algo === "aes") {
          const aesSteps = ["SubBytes", "ShiftRows", "MixColumns", "AddRoundKey"]
          addLog(`Step ${i}: ${aesSteps[i-1]} transformation applied.`)
       } else if (algo === "rsa") {
          const rsaSteps = ["Modular Exponentiation", "Prime Product Computation", "Final Encipherment"]
          addLog(`Step ${i}: ${rsaSteps[i-1]}`)
       }
       await new Promise(r => setTimeout(r, 1000))
    }
    
    setIsEncrypting(false)
    addLog(`${algo.toUpperCase()} Complete. Encrypted state persisted.`)
  }

  const binaryInput = useMemo(() => {
     return input.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
  }, [input])

  const encryptedBits = useMemo(() => {
     if (isEncrypting) return binaryInput.split('').map(() => Math.random() > 0.5 ? '1' : '0').join('')
     return binaryInput.split('').map(c => c === ' ' ? ' ' : (c === '0' ? '1' : '0')).join('')
  }, [binaryInput, isEncrypting])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-emerald-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
         <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar shrink-0">
            <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
               {["aes", "rsa", "hashing"].map(a => (
                 <button 
                   key={a} onClick={() => setAlgo(a as Algorithm)}
                   className={cn("px-2 sm:px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", algo === a ? "bg-emerald-600 shadow-lg text-white" : "text-gray-500 hover:text-gray-300")}
                 >
                   {a}
                 </button>
               ))}
            </div>
         </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Encryption Controls */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase whitespace-normal">Cipher</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Cryptographic Processor</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-700 tracking-widest">Plaintext Input</label>
                    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3 group focus-within:border-emerald-500/30 transition-all">
                       <Terminal className="w-4 h-4 text-emerald-500" />
                       <input 
                         type="text" value={input} onChange={(e) => setInput(e.target.value.toUpperCase())}
                         className="bg-transparent border-none outline-none text-xs font-mono w-full uppercase"
                       />
                    </div>
                 </div>

                 <button 
                   onClick={runCipher} disabled={isEncrypting}
                   className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
                 >
                   {isEncrypting ? "COMPUTING ROUNDS..." : "CIPHER_BLOCK_CHAIN"}
                 </button>

                 <div className="pt-4 space-y-3 border-t border-white/5">
                    <label className="text-[9px] font-black uppercase text-gray-700 tracking-widest">S-Box Rounds</label>
                    {(algo === "aes" ? ["Substitution", "Permutation", "Diffusion", "AddKey"] : ["Expon", "Primes", "Keys"]).map((s, i) => (
                       <div key={s} className={cn(
                          "px-4 py-3 rounded-xl border flex items-center justify-between transition-all duration-300",
                          phase === i + 1 ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-lg" : "bg-white/5 border-white/5 text-gray-800"
                       )}>
                          <span className="text-[10px] font-black uppercase italic tracking-tighter">{i+1}. {s}</span>
                          <div className={cn("w-1.5 h-1.5 rounded-full", phase === i + 1 ? "bg-emerald-500 animate-pulse" : "bg-gray-900")} />
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Hash className="w-3 h-3 text-emerald-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Security Entropy Log</h3>
              </div>
              <div className="space-y-1 h-36 overflow-y-auto custom-scrollbar font-mono text-[9px] text-gray-500 pr-2">
                 {logs.map((l, i) => (
                    <div key={i} className="py-1 border-b border-white/5 opacity-80 leading-none truncate">{l}</div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-12 lowercase text-[10px]">generating prime bits...</p>}
              </div>
           </div>
        </section>

        {/* Bit-level Visualization View */}
        <section className="lg:col-span-3 space-y-6">
            <div className="glass rounded-[40px] border-white/5 p-6 sm:p-10 min-h-[500px] relative flex flex-col gap-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Shield className="w-64 h-64 text-emerald-500" />
              </div>

              {/* Statistics Overlay */}
               <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
                  <div className="flex gap-4 items-center">
                     <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Lock className="w-6 h-6 border-none" />
                     </div>
                     <div>
                        <h3 className="text-sm font-black italic uppercase tracking-[0.2em]">Quantum-Ready Binary Logic</h3>
                        <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest italic leading-none mt-1">Symmetric Block Cipher: 128-bit Keyspace</p>
                     </div>
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto justify-end">
                     <MetricBox label="Entropy" value={isEncrypting ? "8.0" : "4.2"} color="text-emerald-500" />
                     <MetricBox label="Rounds" value={phase} color="text-indigo-400" />
                  </div>
               </div>

              {/* Bit Grid Visualization */}
               <div className="relative z-10 flex-1 bg-black/40 rounded-[32px] border border-white/5 p-6 sm:p-10 flex flex-col gap-10">
                 <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase text-gray-700 tracking-widest">Symmetric Plaintext Bits (Source)</p>
                    <div className="flex flex-wrap gap-2">
                       {binaryInput.split("").map((bit, i) => (
                          <div key={i} className={cn(
                             "w-4 h-6 rounded flex items-center justify-center font-mono text-[10px]",
                             bit === " " ? "w-4 opacity-0" : bit === "1" ? "bg-white/5 text-emerald-400" : "bg-white/5 text-gray-700"
                          )}>
                             {bit}
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex justify-center">
                    <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-4 text-emerald-500 animate-pulse">
                       <RefreshCw className="w-4 h-4" />
                       <span className="text-[10px] font-black tracking-widest">{algo.toUpperCase()} KERNEL DIFFUSION</span>
                       <RefreshCw className="w-4 h-4" />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase text-gray-700 tracking-widest text-right">Encrypted Ciphertext Bits (Sink)</p>
                    <div className="flex flex-wrap gap-2 justify-end">
                       {encryptedBits.split("").map((bit, i) => (
                          <motion.div 
                            key={i} 
                            animate={{ 
                               scale: isEncrypting ? [1, 1.2, 1] : 1,
                               backgroundColor: bit === " " ? "transparent" : i < phase * 16 ? "#10b98120" : "rgba(255, 255, 255, 0.05)",
                               color: bit === " " ? "transparent" : i < phase * 16 ? "#10b981" : "rgba(255, 255, 255, 0.1)"
                            }}
                            className="w-4 h-6 rounded flex items-center justify-center font-mono text-[10px]"
                          >
                             {bit}
                          </motion.div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Informational Footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10 items-center">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-500">
                       <Binary className="w-6 h-6 border-none" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Avalanche Effect Insight</h4>
                       <p className="text-[10px] text-gray-600 font-light italic leading-snug">
                          A secure cipher ensures that changing just one bit in the plaintext flips approximately 50% of the bits in the ciphertext.
                       </p>
                    </div>
                 </div>

                 <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex gap-6">
                    <Key className="w-8 h-8 text-emerald-500 shrink-0" />
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase text-white tracking-widest leading-none mt-1">Entropy & Security</p>
                       <p className="text-[10px] text-gray-600 font-light italic leading-relaxed font-sans">
                          Modern 256-bit encryption has more combinations than there are atoms in the observable universe.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function MetricBox({ label, value, color }: any) {
  return (
    <div className="text-right space-y-1">
       <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">{label}</p>
       <p className={cn("text-3xl font-black italic tracking-tighter leading-none", color)}>{value}</p>
    </div>
  )
}
