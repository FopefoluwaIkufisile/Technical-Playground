"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Box, Plus, Minus, Layers, Zap, Database, Trash2, GitFork, Key, Eye, EyeOff, Search } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type ClosureInstance = {
  id: string
  count: number
  secretKey: string
  color: string
  createdAt: string
}

export default function ClosuresPage() {
  const [instances, setInstances] = useState<ClosureInstance[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)

  const createCounter = () => {
    const colors = ["emerald", "blue", "purple", "orange", "cyan"]
    const color = colors[Math.floor(Math.random() * colors.length)]
    const newInstance: ClosureInstance = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      count: 0,
      secretKey: Math.random().toString(36).substr(2, 8),
      color,
      createdAt: new Date().toLocaleTimeString()
    }
    setInstances([newInstance, ...instances])
    setSelectedId(newInstance.id)
  }

  const updateCount = (id: string, delta: number) => {
    setInstances(instances.map(inst => 
      inst.id === id ? { ...inst, count: inst.count + delta } : inst
    ))
  }

  const removeInstance = (id: string) => {
    setInstances(instances.filter(inst => inst.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const selectedInstance = instances.find(inst => inst.id === selectedId)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-orange-500/30">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-4">
           <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium flex items-center gap-2">
            <Layers className="w-3 h-3" />
            Independent Environments: {instances.length}
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Memory Creation Panel */}
        <section className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
            <header className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Bubble</h1>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Visualizing how lexical environments capture state.
              </p>
            </header>

            <button 
              onClick={createCounter}
              className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium flex items-center justify-center gap-2 transition-all active:scale-95 glow-orange shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-4 h-4" />
              New Closure Instance
            </button>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Active Instances</label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {instances.map(inst => (
                  <button 
                    key={inst.id}
                    onClick={() => setSelectedId(inst.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl border flex items-center justify-between transition-all group",
                      selectedId === inst.id ? "bg-white/10 border-orange-500/50" : "bg-white/5 border-white/5 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                       <div className={cn("w-2 h-2 rounded-full", `bg-${inst.color}-500 shadow-lg`)} />
                       <div className="text-left">
                          <p className="text-[11px] font-bold">ENV_{inst.id}</p>
                          <p className="text-[9px] text-gray-600 font-mono italic">{inst.createdAt}</p>
                       </div>
                    </div>
                    <Trash2 
                      className="w-3 h-3 text-gray-700 hover:text-red-500 transition-colors" 
                      onClick={(e) => { e.stopPropagation(); removeInstance(inst.id); }} 
                    />
                  </button>
                ))}
                {instances.length === 0 && <p className="text-center p-8 text-[10px] text-gray-700 italic border border-dashed border-white/5 rounded-2xl">No environments found in memory...</p>}
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
             <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Persistent Scopes</h3>
             </div>
             <p className="text-[11px] text-gray-500 leading-relaxed font-light italic">
                A closure allows a function to <span className="text-orange-400">remember</span> its parent scope even after the parent function has finished executing. 
                Each bubble above is a separate piece of memory that <span className="text-emerald-400">cannot</span> be garbage collected while the instance exists.
             </p>
          </div>
        </section>

        {/* Scope Explorer & Bubble Area */}
        <section className="lg:col-span-3 flex flex-col gap-6">
           <div className="flex-1 glass rounded-[40px] border-white/5 relative overflow-hidden flex flex-col lg:flex-row items-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(249,115,22,0.05),transparent)] pointer-events-none" />
              
              {/* The Bubble */}
              <div className="flex-1 h-full flex flex-col items-center justify-center p-12 relative">
                <AnimatePresence mode="wait">
                  {selectedInstance ? (
                    <motion.div
                      key={selectedInstance.id}
                      initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                      className="relative group"
                    >
                       <div className={cn(
                         "w-48 h-48 sm:w-72 sm:h-72 rounded-full flex items-center justify-center relative transition-all duration-700",
                         `bg-${selectedInstance.color}-500/10 border-2 border-${selectedInstance.color}-500/20 shadow-2xl`
                       )}>
                          <div className={cn("absolute -inset-8 rounded-full blur-3xl opacity-20", `bg-${selectedInstance.color}-500`)} />
                          
                          <div className="flex flex-col items-center gap-1 z-10">
                             <motion.div 
                                key={selectedInstance.count}
                                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                className="text-5xl sm:text-7xl font-bold font-mono tracking-tighter text-white"
                             >
                                {selectedInstance.count}
                             </motion.div>
                             <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Local State</div>
                          </div>
                          
                          {/* Inner particles */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-40">
                            {[...Array(8)].map((_, i) => (
                              <motion.div 
                                key={i} animate={{ x: [0, Math.random()*60-30, 0], y: [0, Math.random()*60-30, 0] }}
                                transition={{ duration: 3 + i, repeat: Infinity }}
                                className={cn("absolute w-1.5 h-1.5 rounded-full blur-[1px]", `bg-${selectedInstance.color}-400`)} 
                              />
                            ))}
                          </div>
                       </div>
                       
                       {/* Floating Methods */}
                       <div className="absolute -left-12 sm:-left-20 top-1/2 -translate-y-1/2 flex flex-col gap-6 scale-90 sm:scale-100">
                          <CircleBtn icon={<Plus />} onClick={() => updateCount(selectedInstance.id, 1)} color="emerald" title="inc()" />
                       </div>
                       <div className="absolute -right-12 sm:-right-20 top-1/2 -translate-y-1/2 flex flex-col gap-6 scale-90 sm:scale-100">
                          <CircleBtn icon={<Minus />} onClick={() => (selectedInstance.count > 0 && updateCount(selectedInstance.id, -1))} color="rose" title="dec()" />
                       </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 text-gray-800">
                       <GitFork className="w-24 h-24 opacity-5" />
                       <p className="text-xs uppercase tracking-[0.5em] font-black italic">Select Lexical Scope</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Scope Explorer Sidebar */}
              <div className="w-full lg:w-80 h-full bg-black/20 border-l border-white/5 p-8 flex flex-col gap-8">
                 <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500">Scope Explorer</h3>
                    <p className="text-[10px] text-gray-600 font-light leading-relaxed italic">Peek inside the private lexer memory of this instance.</p>
                 </div>

                 <AnimatePresence mode="wait">
                    {selectedInstance ? (
                       <motion.div 
                         key={selectedInstance.id}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="space-y-6"
                       >
                          <ExplorerItem label="Identifier" value={`instance_${selectedInstance.id}`} />
                          <ExplorerItem label="Variable: count" value={selectedInstance.count.toString()} highlight />
                          
                          <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <label className="text-[9px] font-bold uppercase tracking-tighter text-gray-600">Variable: secretKey</label>
                                <button onClick={() => setShowSecret(!showSecret)} className="text-emerald-500 hover:text-emerald-400">
                                   {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </button>
                             </div>
                             <div className="bg-white/5 p-3 rounded-xl border border-white/5 font-mono text-[11px] text-indigo-400">
                                {showSecret ? selectedInstance.secretKey : "••••••••••••"}
                             </div>
                          </div>

                          <div className="pt-4 border-t border-white/5">
                             <div className="flex items-center gap-2 mb-2">
                                <Search className="w-3 h-3 text-orange-400" />
                                <span className="text-[9px] font-bold uppercase text-gray-500">Access Policy</span>
                             </div>
                             <p className="text-[10px] text-orange-200/50 font-light leading-relaxed">
                                This memory environment is <span className="text-white font-bold">PRIVATE</span>. 
                                The global scope cannot see <span className="font-mono">secretKey</span>. 
                                Only the returned methods (INC/DEC) have the closure required to see it.
                             </p>
                          </div>
                       </motion.div>
                    ) : (
                       <div className="h-64 flex items-center justify-center text-center opacity-20">
                          <p className="text-[10px] uppercase font-bold tracking-widest leading-loose">Waiting for<br/>Active Scope...</p>
                       </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           <div className="h-auto sm:h-32 glass rounded-[40px] border-white/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                 <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                 <h4 className="text-sm font-bold uppercase tracking-tight">Theory: Independent State</h4>
                 <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Notice how each instance carries its own unique <span className="text-orange-400">secretKey</span> and <span className="text-orange-400">count</span>. 
                    Adding a new environment does not affect existing ones, proving that closures preserve <span className="text-blue-400">separate clones</span> of the lexical environment.
                 </p>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}

function ExplorerItem({ label, value, highlight }: any) {
  return (
    <div className="space-y-2">
       <label className="text-[9px] font-bold uppercase tracking-tighter text-gray-600">{label}</label>
       <div className={cn(
         "bg-white/5 p-3 rounded-xl border border-white/5 font-mono text-[11px]",
         highlight ? "text-orange-400 border-orange-500/20" : "text-gray-400"
       )}>
          {value}
       </div>
    </div>
  )
}

function CircleBtn({ icon, onClick, color, title }: any) {
  return (
    <div className="flex flex-col items-center gap-2 group/btn">
      <button 
        onClick={onClick}
        className={cn(
          "w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-all active:scale-90 bg-[#0a0a0a] shadow-xl",
          color === "emerald" ? "hover:border-emerald-500/50 hover:text-emerald-400 hover:shadow-emerald-500/10" : "hover:border-rose-500/50 hover:text-rose-400 hover:shadow-rose-500/10"
        )}
      >
        {icon}
      </button>
      <span className="text-[9px] font-bold font-mono text-gray-700 opacity-0 group-hover/btn:opacity-100 transition-opacity uppercase tracking-widest">{title}</span>
    </div>
  )
}
