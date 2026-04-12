"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Cpu, Layers, Power, HardDrive, Server, Terminal, Trash2, ShieldCheck, Monitor, ChevronRight, Info } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "boot" | "processes" | "deepdive"
type OS = "linux" | "macos" | "windows"

const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "boot", label: "⚡ Boot Sequence" },
  { id: "processes", label: "Process Tree" },
  { id: "deepdive", label: "Deep Dive" },
]

const bootSequences: Record<OS, { id: string; label: string; desc: string; detail: string; type: string }[]> = {
  linux: [
    { id: "L1", label: "BIOS / UEFI", desc: "Power-On Self-Test (POST). CPU wakes, checks RAM, initializes hardware.", detail: "Firmware scans PCI/PCIe buses, enumerates devices, configures interrupts. Reads boot device from NVRAM. UEFI Secure Boot verifies bootloader signature against Platform Key database.", type: "firmware" },
    { id: "L2", label: "GRUB 2", desc: "Grand Unified Bootloader loads and presents OS menu.", detail: "GRUB reads /boot/grub/grub.cfg. Presents boot menu. Loads compressed kernel image (vmlinuz) and initial RAM disk (initrd/initramfs) into RAM. Transfers control to kernel.", type: "bootloader" },
    { id: "L3", label: "vmlinuz", desc: "Kernel decompresses itself, initializes CPU, memory, and drivers.", detail: "Kernel runs head.S setup in assembly. Decompresses itself (zlib/lzma). Sets up virtual memory (paging), x86 long mode. Mounts initramfs as temporary root, loads essential drivers. Finds real root partition, pivots root, unmounts initramfs.", type: "kernel" },
    { id: "L4", label: "systemd (PID 1)", desc: "Init system manages all services and the user session.", detail: "systemd reads unit files from /etc/systemd/system/. Parallelizes service startup using socket activation. Mounts filesystems, starts network, logging (journald). Spawns login manager (getty/GDM). First and last process to run.", type: "userspace" },
  ],
  macos: [
    { id: "M1", label: "BootROM / SecureROM", desc: "Apple Silicon's immutable ROM verifies boot chain.", detail: "Burned into die at manufacture time, cannot be updated. Authenticates boot.efi using hardware public keys. Apple's Secure Boot chain: ROM → BPR → iBoot (Apple Silicon). T2 chip handles attestation on Intel Macs.", type: "firmware" },
    { id: "M2", label: "iBoot / boot.efi", desc: "Bootloader locates and validates the macOS system volume.", detail: "Reads Signed System Volume (SSV) cryptographic hash from APFS seal. Validates entire system volume tree against stored hash. System Integrity Protection (SIP) begins enforcement here. Launches XNU kernel with initial device tree.", type: "bootloader" },
    { id: "M3", label: "XNU Kernel (Mach + BSD)", desc: "Hybrid kernel initializes the Mach microkernel and BSD layer.", detail: "XNU = X is Not Unix. Mach layer: manages virtual memory, IPC, task/thread abstraction. BSD layer: POSIX APIs, file systems (APFS, HFS+), networking stack. IOKit: C++ framework for device drivers in user space. Rosetta 2 starts here for x86→ARM translation.", type: "kernel" },
    { id: "M4", label: "launchd (PID 1)", desc: "Service management framework spawns all daemons and agents.", detail: "Reads LaunchDaemons (root) and LaunchAgents (per-user) plist files. Implements socket activation and on-demand service loading. Manages XPC services for app sandbox IPC. Equivalent to systemd on Linux.", type: "userspace" },
  ],
  windows: [
    { id: "W1", label: "UEFI & Secure Boot", desc: "Firmware validates Windows boot manager signature.", detail: "UEFI replaces legacy BIOS. Reads Boot Configuration Database (BCD) via EFI variables. Secure Boot: validates bootmgr.efi against key whitelist in UEFI db (Canonical/Microsoft keys). TPM records boot measurements for Remote Attestation.", type: "firmware" },
    { id: "W2", label: "bootmgr.exe → winload.efi", desc: "Boot manager reads BCD store, presents OS selection.", detail: "Reads \\EFI\\Microsoft\\Boot\\BCD from EFI System Partition. If BitLocker is active, unseals Volume Master Key from TPM using boot measurements. winload.efi unpacks ntoskrnl.exe and HAL into memory.", type: "bootloader" },
    { id: "W3", label: "ntoskrnl.exe + HAL.dll", desc: "NT Executive kernel initializes hardware and Executive Services.", detail: "HAL (Hardware Abstraction Layer) decouples kernel from hardware specifics. NT Executive: Object Manager, I/O Manager, Security Reference Monitor, Process Manager, Memory Manager (VM), Registry. PatchGuard (KPP) starts protecting kernel integrity.", type: "kernel" },
    { id: "W4", label: "smss.exe → winlogon", desc: "Session Manager creates user sessions, starts Win32 subsystem.", detail: "smss.exe: first user-mode process. Creates system sessions, starts csrss.exe (Win32 subsystem). winlogon.exe: handles user authentication, Ctrl+Alt+Del SAM. LSA (lsass.exe): Local Security Authority, validates credentials, issues tokens.", type: "userspace" },
  ],
}

type ProcessNode = { pid: number; ppid: number; name: string; state: "running" | "sleeping" | "zombie" | "orphan"; priority: number; cpu: string }
const initialProcs: ProcessNode[] = [
  { pid: 1, ppid: 0, name: "systemd / launchd", state: "running", priority: 0, cpu: "0.1" },
  { pid: 212, ppid: 1, name: "sshd", state: "sleeping", priority: 19, cpu: "0.0" },
  { pid: 450, ppid: 1, name: "Xorg / WindowServer", state: "running", priority: -5, cpu: "2.3" },
  { pid: 890, ppid: 450, name: "Terminal / iTerm2", state: "sleeping", priority: 0, cpu: "0.1" },
  { pid: 1024, ppid: 890, name: "bash / zsh", state: "running", priority: 0, cpu: "0.0" },
  { pid: 2048, ppid: 1024, name: "node / python3", state: "running", priority: 10, cpu: "12.4" },
  { pid: 3100, ppid: 1, name: "nginx / apache", state: "sleeping", priority: 0, cpu: "0.5" },
]

export default function KernelPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-indigo-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Cpu className="w-3 h-3" /> Kernel · OS Architecture
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-indigo-400 bg-clip-text text-transparent">Kernel Engine</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">How operating systems boot, manage processes, and abstract hardware — from BIOS/UEFI all the way to PID 1 and user-space programs.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "boot" && <BootTab />}
            {tab === "processes" && <ProcessesTab />}
            {tab === "deepdive" && <DeepDiveTab />}
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
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Layers className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Ring Architecture</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">Hardware enforces privilege separation using <strong className="text-white">protection rings</strong>. Modern x86 uses Ring 0 (kernel mode) and Ring 3 (user mode). User programs can&apos;t directly touch hardware — they must ask the kernel via system calls.</p>
          <div className="space-y-2">
            {[
              { ring: "Ring 0", label: "Kernel Mode", desc: "Full hardware access. Manages memory, CPU scheduling, interrupts, I/O. Bugs here crash the whole system.", color: "red" },
              { ring: "Ring 1-2", label: "Driver Mode (rarely used)", desc: "Originally for device drivers. Modern OSes run drivers in Ring 0 (Windows) or user-space (macOS DriverKit).", color: "amber" },
              { ring: "Ring 3", label: "User Mode", desc: "Where all applications run. No direct hardware access. Asks kernel via syscall instruction. Faults here just kill the process.", color: "emerald" },
            ].map(r => (
              <div key={r.ring} className={cn("p-4 rounded-2xl border",
                r.color === "red" ? "bg-red-500/5 border-red-500/20" : r.color === "amber" ? "bg-amber-500/5 border-amber-500/20" : "bg-emerald-500/5 border-emerald-500/20"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-[9px] font-black px-2 py-0.5 rounded uppercase font-mono", r.color === "red" ? "bg-red-500/20 text-red-400" : r.color === "amber" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400")}>{r.ring}</span>
                  <p className="text-[11px] font-black">{r.label}</p>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">System Calls — Crossing the Boundary</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Every time your code reads a file, allocates memory, or creates a network socket, it triggers a <strong className="text-white">system call</strong> — a controlled gateway from Ring 3 to Ring 0. The CPU switches context, runs kernel code, then returns.</p>
          <div className="bg-black/40 p-5 rounded-2xl border border-indigo-500/10 font-mono text-xs leading-7">
            <p className="text-indigo-400">// strace -p $(pgrep node) — watch syscalls live:</p>
            <p className="text-gray-500">read(5, "", 16384) = 0  <span className="text-gray-700">// file read → kernel reads disk</span></p>
            <p className="text-gray-500">write(1, "Hello\n", 6) = 6  <span className="text-gray-700">// stdout → kernel writes to TTY</span></p>
            <p className="text-gray-500">mmap(NULL, 65536, ...)  <span className="text-gray-700">// allocate memory pages</span></p>
            <p className="text-gray-500">socket(AF_INET, ...) = 3  <span className="text-gray-700">// create TCP socket</span></p>
            <p className="text-gray-500">clone(...)  <span className="text-gray-700">// fork() → new process</span></p>
            <p className="mt-3 text-gray-700">// Each call: userspace → syscall instruction → kernel → return</p>
            <p className="text-gray-700">// Context switch: ~100-300 nanoseconds overhead each</p>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15">
            <p className="text-[11px] text-indigo-300/80 leading-relaxed">Linux has ~400 system calls. glibc wraps them in C functions (open(), read(), malloc()). malloc() calls mmap() or brk() for memory — you never touch the MMU directly.</p>
          </div>
        </div>
      </div>
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Kernel Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { type: "Monolithic Kernel", ex: "Linux, Windows NT", desc: "All OS services (fs, networking, drivers) run in kernel space (Ring 0). Fast IPC (function calls). One kernel bug can crash everything. Linux loadable modules extend without recompiling.", color: "indigo" },
            { type: "Microkernel", ex: "L4, MINIX, QNX, seL4", desc: "Minimal kernel (IPC, address spaces, scheduling only). OS services run in user space. Slowler IPC (crossing ring boundary). Extremely reliable — used in safety-critical systems.", color: "violet" },
            { type: "Hybrid Kernel", ex: "XNU (macOS), Windows", desc: "Monolithic base with some microkernel principles. macOS XNU: Mach microkernel + BSD layer in same Ring 0 space. Windows NT: designed as microkernel but drivers run in Ring 0 for performance.", color: "blue" },
          ].map(k => (
            <div key={k.type} className={cn("p-5 rounded-2xl border space-y-2",
              k.color === "indigo" ? "bg-indigo-500/5 border-indigo-500/20" : k.color === "violet" ? "bg-violet-500/5 border-violet-500/20" : "bg-blue-500/5 border-blue-500/20"
            )}>
              <p className={cn("text-[11px] font-black uppercase", k.color === "indigo" ? "text-indigo-400" : k.color === "violet" ? "text-violet-400" : "text-blue-400")}>{k.type}</p>
              <p className="text-[9px] text-gray-600 font-mono">{k.ex}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{k.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BootTab() {
  const [os, setOs] = useState<OS>("linux")
  const [booting, setBooting] = useState(false)
  const [step, setStep] = useState(-1)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const addLog = (msg: string) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p].slice(0, 10))

  const runBoot = async () => {
    if (booting) return
    setBooting(true); setStep(-1); setLogs([])
    addLog(`Initiating ${os.toUpperCase()} cold boot...`)
    await new Promise(r => setTimeout(r, 300))
    for (let i = 0; i < bootSequences[os].length; i++) {
      setStep(i)
      addLog(`LOAD: ${bootSequences[os][i].label}`)
      await new Promise(r => setTimeout(r, 1400))
    }
    setBooting(false)
    addLog("Boot complete. User session ready.")
  }

  const typeColor = { firmware: "blue", bootloader: "violet", kernel: "red", userspace: "emerald" }
  const cc = (t: string) => ({ firmware: "text-blue-400 bg-blue-500/10 border-blue-500/30", bootloader: "text-violet-400 bg-violet-500/10 border-violet-500/30", kernel: "text-red-400 bg-red-500/10 border-red-500/30", userspace: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" }[t] ?? "text-gray-400 bg-white/5 border-white/10")

  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-center flex-wrap">
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {(["linux", "macos", "windows"] as OS[]).map(o => (
            <button key={o} onClick={() => { setOs(o); setStep(-1); setLogs([]) }} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", os === o ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-white")}>{o}</button>
          ))}
        </div>
        <button onClick={runBoot} disabled={booting} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
          <Power className="w-3.5 h-3.5" />{booting ? "Booting..." : "Power Cycle"}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Boot Stages</p>
          {bootSequences[os].map((s, i) => (
            <motion.div key={s.id} animate={{ opacity: step >= i ? 1 : 0.25 }}
              className={cn("border rounded-2xl overflow-hidden transition-all", step === i ? `${cc(s.type)} shadow-lg` : "bg-white/3 border-white/5")}>
              <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="w-full p-4 flex items-center gap-3 text-left">
                <span className={cn("w-5 h-5 rounded-lg flex items-center justify-center text-[8px] font-black shrink-0 border", cc(s.type))}>{i+1}</span>
                <div className="flex-1">
                  <p className="text-[11px] font-black">{s.label}</p>
                  <p className="text-[9px] text-gray-600 leading-tight mt-0.5">{s.desc}</p>
                </div>
                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", step === i ? "animate-pulse bg-white" : "bg-gray-800")} />
              </button>
              <AnimatePresence>
                {expanded === s.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 border-t border-white/5 pt-3">
                      <p className="text-[10px] text-gray-500 leading-relaxed">{s.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
          <p className="text-[9px] text-indigo-500 uppercase font-black tracking-widest flex items-center gap-2"><Terminal className="w-3 h-3" /> Kernel Log (dmesg)</p>
          <div className="h-80 overflow-y-auto font-mono text-[9px] space-y-1">
            {logs.map((l, i) => <div key={i} className="text-gray-600 leading-tight py-0.5 border-b border-white/3">{l}</div>)}
            {!logs.length && <p className="text-gray-800 italic text-center mt-32">Awaiting power...</p>}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Privilege Transitions</p>
          <div className="space-y-2">
            {[
              { from: "BIOS/UEFI", to: "Bootloader", mode: "Real → Protected Mode", color: "blue" },
              { from: "Bootloader", to: "Kernel", mode: "Protected → Long Mode (64-bit)", color: "violet" },
              { from: "Kernel", to: "Init (PID 1)", mode: "Ring 0 → Ring 3", color: "red" },
              { from: "PID 1", to: "All Services", mode: "fork() + exec()", color: "emerald" },
            ].map((t, i) => (
              <div key={i} className={cn("p-3 rounded-xl border flex items-center gap-3",
                t.color === "blue" ? "bg-blue-500/5 border-blue-500/15" : t.color === "violet" ? "bg-violet-500/5 border-violet-500/15" : t.color === "red" ? "bg-red-500/5 border-red-500/15" : "bg-emerald-500/5 border-emerald-500/15"
              )}>
                <div className="flex-1">
                  <p className="text-[10px] font-mono">{t.from} → {t.to}</p>
                  <p className="text-[9px] text-gray-600">{t.mode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProcessesTab() {
  const [procs, setProcs] = useState<ProcessNode[]>(initialProcs)
  const [logs, setLogs] = useState<string[]>([])
  const addLog = (msg: string) => setLogs(p => [`[SYS] ${msg}`, ...p].slice(0, 8))
  const kill = (pid: number) => {
    addLog(`SIGKILL → PID ${pid}`)
    setProcs(p => {
      const target = p.find(x => x.pid === pid)
      if (!target) return p
      if (Math.random() > 0.4) return p.map(x => x.pid === pid ? { ...x, state: "zombie" as const } : x)
      return p.filter(x => x.pid !== pid).map(x => x.ppid === pid ? { ...x, state: "orphan" as const } : x)
    })
    addLog(`PID ${pid} terminated`)
  }
  const spawn = () => {
    const pid = Math.max(...procs.map(p => p.pid)) + 100
    const parent = procs[Math.floor(Math.random() * procs.length)]
    const names = ["grep", "curl", "wget", "python3", "ruby", "go"]
    setProcs(p => [...p, { pid, ppid: parent.pid, name: names[Math.floor(Math.random() * names.length)], state: "running", priority: 0, cpu: "0.0" }])
    addLog(`Spawned PID ${pid} (parent: ${parent.pid})`)
  }

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-[24px] border-white/5 flex gap-3">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Every process has a PID (Process ID) and PPID (Parent PID). The kernel maintains process state (running, sleeping, zombie). <strong className="text-white">Zombies</strong> are processes that finished but whose parent hasn&apos;t called wait() to collect the exit code. <strong className="text-white">Orphans</strong> are adopted by PID 1.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-3">
          <button onClick={spawn} className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm transition-all active:scale-95">Spawn Process</button>
          <button onClick={() => setProcs(initialProcs)} className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-[11px] font-bold hover:text-white transition-colors">Reset Tree</button>
          <div className="glass p-4 rounded-xl border-white/5 space-y-2">
            <p className="text-[9px] uppercase font-black text-gray-600">Signal Log</p>
            {logs.map((l, i) => <div key={i} className="text-[9px] font-mono text-gray-700 truncate">{l}</div>)}
            {!logs.length && <p className="text-[9px] text-gray-800 italic">No signals sent</p>}
          </div>
          <div className="space-y-2 pt-2">
            <p className="text-[9px] uppercase font-black text-gray-600">Legend</p>
            {[{ state: "running", color: "bg-emerald-500" }, { state: "sleeping", color: "bg-amber-500/50" }, { state: "zombie", color: "bg-red-500" }, { state: "orphan", color: "bg-orange-500" }].map(l => (
              <div key={l.state} className="flex items-center gap-2 text-[9px] text-gray-600 font-bold uppercase">
                <div className={cn("w-2 h-2 rounded-full", l.color)} />{l.state}
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="glass rounded-[32px] border-white/5 overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/5 grid grid-cols-5 text-[9px] font-black text-gray-600 uppercase tracking-widest">
              <span className="col-span-2">PROCESS</span><span>PID</span><span>STATE</span><span className="text-right">CPU%</span>
            </div>
            <div className="overflow-y-auto max-h-96">
              <AnimatePresence>
                {procs.map(p => (
                  <motion.div key={p.pid} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className={cn("p-5 border-b border-white/5 grid grid-cols-5 items-center hover:bg-white/5 transition-colors group", p.state === "zombie" && "opacity-40")}>
                    <div className="col-span-2 flex items-center gap-3">
                      <div className={cn("w-1 h-6 rounded-full", p.state === "running" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : p.state === "zombie" ? "bg-red-500" : p.state === "orphan" ? "bg-orange-500" : "bg-gray-800")} />
                      <div>
                        <p className="text-[11px] font-black">{p.name}</p>
                        <p className="text-[9px] text-gray-700 font-mono">PPID: {p.ppid}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-400 font-black">{p.pid}</span>
                    <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-lg w-fit",
                      p.state === "running" ? "bg-emerald-500/10 text-emerald-400" : p.state === "zombie" ? "bg-red-500/10 text-red-400" : p.state === "orphan" ? "bg-orange-500/10 text-orange-400" : "bg-amber-500/10 text-amber-400"
                    )}>{p.state}</span>
                    <div className="flex justify-end items-center gap-3">
                      <span className="text-[10px] font-mono text-gray-500">{p.cpu}%</span>
                      <button onClick={() => kill(p.pid)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeepDiveTab() {
  const [active, setActive] = useState("vm")
  const topics = [
    { id: "vm", name: "Virtual Memory", color: "indigo",
      desc: "Every process believes it owns the entire 64-bit address space (128TB on x86-64). The MMU and kernel translate virtual addresses to physical RAM using page tables.",
      code: `// Process virtual address space (64-bit Linux, simplified):
// 0xFFFFFFFF_FFFFFFFF  ┐
//                      │ Kernel space (1TB) — shared, Ring 0 only
// 0xFFFF8000_00000000  ┘
//
// 0x00007FFF_FFFFFFFF  ┐
//    Stack (grows down) │
//    Memory-mapped files│ User space (128TB per process)
//    Heap (grows up)    │
//    BSS (zeroed data)  │
//    Data segment       │
//    Text (code)        │
// 0x00000000_00400000  ┘

// Page Table Translation:
// Virtual addr (48 bits): [PML4(9)][PDP(9)][PD(9)][PT(9)][offset(12)]
// 4KB pages = 2^12 bytes
// TLB (Translation Lookaside Buffer) caches recent translations
// TLB miss → 4 memory walks → ~100 cycles overhead
// Context switch: TLB flush (ASID for mitigation)

// mmap vs malloc:
// malloc < 128KB → brk() — extends heap
// malloc > 128KB → mmap() — anonymous mapping
// Files → mmap() — maps file to virtual address space`,
      insight: "Copy-on-Write makes fork() O(1): the child gets a read-only copy of the parent's page table. Physical pages are shared until either process writes, triggering a page fault that creates a real private copy. This is how shells spawn processes instantly.",
    },
    { id: "scheduler", name: "CPU Scheduler", color: "violet",
      desc: "The kernel scheduler decides which process runs next. Linux uses CFS (Completely Fair Scheduler) — it aims to give each process a fair share of CPU time weighted by nice value.",
      code: `// Linux CFS Scheduler (kernel/sched/fair.c)
// Tracks 'virtual runtime' (vruntime) per task
// Task with smallest vruntime runs next
// This is a red-black tree sorted by vruntime

// Priority (nice values) -20 to +19
//   nice -20 (highest): vruntime accumulates slower → runs more
//   nice +19 (lowest):  vruntime accumulates faster → runs less
// Root can set nice < 0; users can only increase nice

// Real-Time Scheduling (for time-critical work):
// SCHED_FIFO: real-time, first-in-first-out, no preemption
// SCHED_RR:   real-time, round-robin with time slice
// SCHED_NORMAL: CFS for regular processes

// Context Switch (what actually happens):
// 1. save registers → task struct (kernel stack)
// 2. switch page tables (CR3 register = new PGDT)
// 3. restore registers from next task
// ~1-10 microseconds total
// ~100 switches/second per core is typical

// Tickless kernel (NO_HZ): no periodic interrupt when idle
// Prevents waking CPUs just to tick — huge mobile battery win`,
      insight: "Completely Fair Scheduler doesn't mean each process gets equal time — it means each process runs for intervals proportional to their weight. A nice=-10 process gets ~10x more CPU than nice=0. Real-time SCHED_FIFO can starve normal processes entirely.",
    },
  ]
  const p = topics.find(t => t.id === active)!
  const cMap: Record<string, string> = { indigo: "text-indigo-400 bg-indigo-500/5 border-indigo-500/20", violet: "text-violet-400 bg-violet-500/5 border-violet-500/20" }
  const c = cMap[p.color]
  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">{topics.map(t => (<button key={t.id} onClick={() => setActive(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold border transition-all", active === t.id ? cMap[t.color] : "bg-white/5 border-white/10 text-gray-500 hover:text-white")}>{t.name}</button>))}</div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass p-6 rounded-[32px] border-white/5 space-y-4">
            <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
            <pre className={cn("p-5 rounded-2xl border text-xs font-mono leading-6 whitespace-pre-wrap overflow-auto", c)}>{p.code}</pre>
          </div>
          <div className={cn("glass p-6 rounded-[24px] border space-y-3", c)}>
            <p className={cn("text-[10px] font-black uppercase tracking-widest", c.split(" ")[0])}>Key Insight</p>
            <p className="text-sm text-gray-400 leading-relaxed">{p.insight}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
