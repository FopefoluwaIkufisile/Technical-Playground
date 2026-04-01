"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Cpu, Activity, Database, Server, ChevronRight, Info, Terminal, Monitor, Power, Zap, Share2, Layers, Search, Trash2, ShieldCheck, HardDrive, Layout, Command } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type OS = "linux" | "macos" | "windows"

interface BootStep {
  id: string
  label: string
  description: string
  subText: string
}

const bootSequences: Record<OS, BootStep[]> = {
  linux: [
    { id: "L1", label: "BIOS / UEFI", description: "Hardware initialization & POST (Power-On Self-Test).", subText: "CPU -> Motherboard -> I/O" },
    { id: "L2", label: "GRUB 2", description: "The Grand Unified Bootloader. Loading Kernel image.", subText: "Reading /boot/vmlinuz" },
    { id: "L3", label: "vmlinuz", description: "Linux Kernel decompression & hardware driver loading.", subText: "Kernel Mode Initialized" },
    { id: "L4", label: "systemd", description: "The Init system. Spawning first user-space processes.", subText: "PID 1 Started" }
  ],
  macos: [
    { id: "M1", label: "BootROM", description: "Apple Silicon / T2 Security Chip identity verification.", subText: "Secure Boot Chain" },
    { id: "M2", label: "boot.efi", description: "macOS Bootloader searching for the APFS system volume.", subText: "Core Storage Lookup" },
    { id: "M3", label: "XNU Kernel", description: "Hybrid Kernel (Mach + BSD) initializing the Mach trap.", subText: "BSD Layer Active" },
    { id: "M4", label: "launchd", description: "Service management framework spawning Daemons.", subText: "User Session Ready" }
  ],
  windows: [
    { id: "W1", label: "UEFI / Secure Boot", description: "Firmware handoff to the Windows Boot Manager.", subText: "TPM Hash Verified" },
    { id: "W2", label: "bootmgr.exe", description: "Reads the Boot Configuration Database (BCD).", subText: "Menu Selection" },
    { id: "W3", label: "ntoskrnl.exe", description: "The Windows NT Executive. Loading Executive Services.", subText: "HAL.dll Initialized" },
    { id: "W4", label: "smss.exe", description: "Session Manager Subsystem. Starting Winlogon.", subText: "User Shell Loading" }
  ]
}

interface ProcessNode {
  pid: number
  ppid: number
  name: string
  state: "running" | "sleeping" | "zombie" | "orphan"
  priority: number
}

const initialProcesses: ProcessNode[] = [
  { pid: 1, ppid: 0, name: "systemd / launchd", state: "running", priority: 0 },
  { pid: 212, ppid: 1, name: "sshd", state: "sleeping", priority: 19 },
  { pid: 450, ppid: 1, name: "Xorg / Window Server", state: "running", priority: -5 },
  { pid: 890, ppid: 450, name: "Terminal / iTerm", state: "sleeping", priority: 0 },
  { pid: 1024, ppid: 890, name: "bash / zsh", state: "running", priority: 0 },
  { pid: 2048, ppid: 1024, name: "node / python", state: "running", priority: 10 }
]

export default function KernelPage() {
  const [os, setOs] = useState<OS>("linux")
  const [booting, setBooting] = useState(false)
  const [bootStep, setBootStep] = useState(0)
  const [processes, setProcesses] = useState<ProcessNode[]>(initialProcesses)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => setLogs(p => [`[SYS] ${msg}`, ...p].slice(0, 10))

  const runBoot = async () => {
     if (booting) return
     setBooting(true)
     setBootStep(-1)
     addLog(`INITIATING ${os.toUpperCase()} COLD BOOT...`)
     
     for (let i = 0; i < bootSequences[os].length; i++) {
        setBootStep(i)
        addLog(`LOAD: ${bootSequences[os][i].label}`)
        await new Promise(r => setTimeout(r, 1200))
     }
     
     setBooting(false)
     addLog("BOOT SEQUENCE COMPLETE.")
  }

  const killProcess = (pid: number) => {
     addLog(`SIGKILL SENT TO PID ${pid}`)
     setProcesses(prev => {
        const target = prev.find(p => p.pid === pid)
        if (!target) return prev
        
        // Mark as zombie or remove
        if (Math.random() > 0.5) {
           return prev.map(p => p.pid === pid ? { ...p, state: "zombie" as const } : p)
        } else {
           // If parent dies, children become orphans
           return prev.filter(p => p.pid !== pid).map(p => p.ppid === pid ? { ...p, state: "orphan" as const } : p)
        }
     })
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col selection:bg-indigo-500/30 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
         <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex shrink-0">
               {["linux", "macos", "windows"].map(o => (
                 <button 
                   key={o} onClick={() => setOs(o as OS)}
                   className={cn("px-2 sm:px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", os === o ? "bg-indigo-600 shadow-lg text-white" : "text-gray-500 hover:text-gray-300")}
                 >
                   {o}
                 </button>
               ))}
            </div>
         </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Boot Sequence Panel */}
        <section className="lg:col-span-1 space-y-6">
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              <header className="space-y-1">
                 <h1 className="text-2xl font-black italic tracking-tighter uppercase whitespace-normal">Kernel Engine</h1>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Low-Level Orchestrator</p>
              </header>

              <div className="space-y-4">
                 <button 
                   onClick={runBoot} disabled={booting}
                   className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                 >
                   {booting ? "COLD BOOT ACTIVE..." : "TRIGGER POWER CYCLE"}
                 </button>

                 <div className="pt-6 border-t border-white/5 space-y-3">
                    <label className="text-[9px] font-black uppercase text-gray-700 tracking-widest">Bootloader Progress</label>
                    {bootSequences[os].map((step, i) => (
                       <div key={step.id} className={cn(
                          "px-4 py-3 rounded-xl border flex flex-col gap-1 transition-all duration-500",
                          bootStep === i ? "bg-indigo-500/20 border-indigo-500/50 shadow-lg" : 
                          bootStep > i ? "bg-white/5 border-indigo-500/20 opacity-50" : "bg-black/20 border-white/5 opacity-20"
                       )}>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black">{step.label}</span>
                             <span className="text-[8px] font-mono text-gray-600">0x{i}</span>
                          </div>
                          <p className="text-[8px] text-gray-500 italic leading-tight uppercase font-bold tracking-widest">{step.subText}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3 h-3 text-indigo-500" />
                 <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Kmsg / System Logs</h3>
              </div>
              <div className="space-y-1 h-36 overflow-y-auto custom-scrollbar font-mono text-[9px] text-gray-500">
                 {logs.map((l, i) => (
                    <div key={i} className="py-1 border-b border-white/5 opacity-80 leading-none truncate">{l}</div>
                 ))}
                 {logs.length === 0 && <p className="italic opacity-10 text-center mt-12 lowercase">awaiting power...</p>}
              </div>
           </div>
        </section>

        {/* Dynamic Visualizer View */}
        <section className="lg:col-span-3 flex flex-col gap-6">
           <div className="flex-1 glass rounded-[40px] border-white/5 relative p-6 sm:p-10 md:p-12 overflow-hidden flex flex-col min-h-[500px]">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                 <Cpu className="w-64 h-64" />
              </div>

              {/* Task/Process Visualizer */}
              <div className="relative z-10 flex flex-col h-full gap-10">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                          <Share2 className="w-6 h-6 border-none" />
                       </div>
                       <div>
                          <h3 className="text-sm font-black italic uppercase tracking-[0.2em]">Process Scheduler Tree</h3>
                          <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest italic leading-none mt-1">Managed by Virtual Memory Manager</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <MetricBox label="Running Tasks" value={processes.filter(p => p.state === "running").length} color="text-emerald-500" />
                       <MetricBox label="Zombies" value={processes.filter(p => p.state === "zombie").length} color="text-rose-500" />
                    </div>
                 </div>

                 {/* Process Tree List */}
                 <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 overflow-hidden flex flex-col">
                     <div className="p-4 bg-white/5 border-b border-white/5 grid grid-cols-4 sm:grid-cols-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                        <span className="col-span-2">NAME/PPID</span>
                        <span className="hidden sm:inline">PID</span>
                        <span>TASK_STATE</span>
                        <span className="hidden sm:inline">PRIO</span>
                        <span className="text-right">OPS</span>
                     </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                       <AnimatePresence>
                          {processes.map((proc) => (
                             <motion.div 
                                key={proc.pid} 
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, scale: 0.95 }}
                                 className={cn(
                                    "p-4 sm:p-6 border-b border-white/5 grid grid-cols-4 sm:grid-cols-6 items-center hover:bg-white/5 transition-colors group",
                                    proc.state === "zombie" && "opacity-40"
                                 )}
                             >
                                <div className="col-span-2 flex items-center gap-6">
                                   <div className={cn("w-1 h-8 rounded-full", proc.state === "running" ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-gray-800")} />
                                   <div className="flex flex-col gap-1">
                                      <p className="text-[10px] font-black italic uppercase tracking-tighter text-white">{proc.name}</p>
                                      <p className="text-[8px] font-mono text-gray-700">PARENT_LINK: {proc.ppid}</p>
                                   </div>
                                </div>
                                 <span className="hidden sm:inline text-[11px] font-mono text-indigo-500 font-black">{proc.pid}</span>
                                 <div className="flex items-center gap-2">
                                    <div className={cn(
                                       "px-2 py-0.5 rounded-lg text-[8px] font-black tracking-widest uppercase",
                                       proc.state === "running" ? "bg-emerald-500/10 text-emerald-500" :
                                       proc.state === "zombie" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                                    )}>
                                       {proc.state}
                                    </div>
                                 </div>
                                 <span className="hidden sm:inline text-[10px] font-mono text-gray-500">{proc.priority}</span>
                                <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button onClick={() => killProcess(proc.pid)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                                      <Trash2 className="w-3 h-3" />
                                   </button>
                                </div>
                             </motion.div>
                          ))}
                       </AnimatePresence>
                    </div>
                 </div>

                 {/* OS Architecture Insight */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-500" />
                          <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Ring-0 Privilege Layer</h4>
                       </div>
                       <p className="text-[11px] text-gray-600 font-light italic leading-relaxed">
                          The **Kernel** operates in the highest privilege mode. It manages the **CPU Scheduler** and **Memory Address Space**. Processes you see here are isolated userspace tasks that communicate with the kernel via **System Calls (syscalls)**.
                       </p>
                    </div>

                    <div className="bg-indigo-500/5 rounded-3xl border border-indigo-500/10 p-6 flex gap-6">
                       <HardDrive className="w-8 h-8 text-indigo-500 shrink-0" />
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-gray-400">File System Mount: RAWS</p>
                          <p className="text-[10px] text-gray-600 italic leading-snug">
                             {os === "linux" ? "Mounting EXT4 / XFS root partition with read-write journaling." :
                              os === "macos" ? "Verifying APFS seal for Signed System Volume (SSV) integrity." :
                              "Parsing NTFS Master File Table (MFT) for initial driver loading."}
                          </p>
                       </div>
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
