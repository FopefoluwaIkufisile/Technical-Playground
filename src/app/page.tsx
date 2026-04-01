"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Binary, RefreshCw, Zap, Layers, Network, Key, Shield, Globe, Router, Wifi, Box, Radio, Cpu, Target, Lock, Database, GitBranch, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

type Category = "All" | "Systems" | "Networking" | "Frontend" | "Security"

const projects = [
  {
    id: "recursion",
    title: "Lenticular",
    category: "Systems",
    description: "Visualizing the call stack and memory allocation in code terms.",
    icon: <Binary className="w-6 h-6 text-blue-400" />,
    path: "/recursion",
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "group-hover:border-blue-500/50"
  },
  {
    id: "pulse",
    title: "Pulse",
    category: "Networking",
    description: "Visualizing network latency, jitter, and packet loss impact.",
    icon: <Wifi className="w-6 h-6 text-indigo-400" />,
    path: "/pulse",
    color: "from-indigo-500/20 to-indigo-600/20",
    borderColor: "group-hover:border-indigo-500/50"
  },
  {
    id: "kernel",
    title: "Kernel",
    category: "Systems",
    description: "Low-level OS boot sequences and process management.",
    icon: <Cpu className="w-6 h-6 text-rose-400" />,
    path: "/kernel",
    color: "from-rose-500/20 to-rose-600/20",
    borderColor: "group-hover:border-rose-500/50"
  },
  {
    id: "regex",
    title: "Pattern",
    category: "Frontend",
    description: "Interactive regex laboratory with live token highlighting.",
    icon: <Target className="w-6 h-6 text-emerald-400" />,
    path: "/regex",
    color: "from-emerald-500/20 to-emerald-600/20",
    borderColor: "group-hover:border-emerald-500/50"
  },
  {
    id: "collector",
    title: "Collector",
    category: "Systems",
    description: "Deep-dive into garbage collection and memory sweep logic.",
    icon: <RefreshCw className="w-6 h-6 text-purple-400" />,
    path: "/collector",
    color: "from-purple-500/20 to-purple-600/20",
    borderColor: "group-hover:border-purple-500/50"
  },
  {
    id: "cipher",
    title: "Cipher",
    category: "Security",
    description: "Visualizing bit-level encryption and security algorithms.",
    icon: <Lock className="w-6 h-6 text-amber-400" />,
    path: "/cipher",
    color: "from-amber-500/20 to-amber-600/20",
    borderColor: "group-hover:border-amber-500/50"
  },
  {
    id: "indexdb",
    title: "IndexedDB",
    category: "Systems",
    description: "Comparing B-Tree search efficiency against full scans.",
    icon: <Database className="w-6 h-6 text-cyan-400" />,
    path: "/indexdb",
    color: "from-cyan-500/20 to-cyan-600/20",
    borderColor: "group-hover:border-cyan-500/50"
  },
  {
    id: "balance",
    title: "Balance",
    category: "Networking",
    description: "Simulating traffic distribution and load balancing strategies.",
    icon: <Globe className="w-6 h-6 text-orange-400" />,
    path: "/balance",
    color: "from-orange-500/20 to-orange-600/20",
    borderColor: "group-hover:border-orange-500/50"
  },
  {
    id: "version",
    title: "GitCore",
    category: "Systems",
    description: "Visualizing the Directed Acyclic Graph of Git branching.",
    icon: <GitBranch className="w-6 h-6 text-rose-400" />,
    path: "/version",
    color: "from-rose-500/20 to-rose-600/20",
    borderColor: "group-hover:border-rose-500/50"
  },
  {
    id: "event-loop",
    title: "Cycle",
    category: "Frontend",
    description: "Interactive simulation of the JavaScript Event Loop engine.",
    icon: <RefreshCw className="w-6 h-6 text-purple-400" />,
    path: "/event-loop",
    color: "from-purple-500/20 to-purple-600/20",
    borderColor: "group-hover:border-purple-500/50"
  },
  {
    id: "cors",
    title: "Bridges",
    category: "Security",
    description: "Exploring Cross-Origin Resource Sharing and Security.",
    icon: <Network className="w-6 h-6 text-emerald-400" />,
    path: "/cors",
    color: "from-emerald-500/20 to-emerald-600/20",
    borderColor: "group-hover:border-emerald-500/50"
  },
  {
    id: "closures",
    title: "Bubble",
    category: "Frontend",
    description: "Mapping lexical scope and variable capture in real-time.",
    icon: <Layers className="w-6 h-6 text-orange-400" />,
    path: "/closures",
    color: "from-orange-500/20 to-orange-600/20",
    borderColor: "group-hover:border-orange-500/50"
  },
  {
    id: "async",
    title: "Sync",
    category: "Frontend",
    description: "Comparing Promises, Callbacks, and Async/Await patterns.",
    icon: <Zap className="w-6 h-6 text-cyan-400" />,
    path: "/async",
    color: "from-cyan-500/20 to-cyan-600/20",
    borderColor: "group-hover:border-cyan-500/50"
  },
  {
    id: "jwt",
    title: "Lifecycle",
    category: "Security",
    description: "Visualizing the handoff between Access and Refresh tokens.",
    icon: <Key className="w-6 h-6 text-indigo-400" />,
    path: "/jwt",
    color: "from-indigo-500/20 to-indigo-600/20",
    borderColor: "group-hover:border-indigo-500/50"
  },
  {
    id: "storage-security",
    title: "Vulnerability",
    category: "Security",
    description: "Testing LocalStorage vs HttpOnly cookies against XSS/CSRF.",
    icon: <Shield className="w-6 h-6 text-rose-400" />,
    path: "/storage-security",
    color: "from-rose-500/20 to-rose-600/20",
    borderColor: "group-hover:border-rose-500/50"
  },
  {
    id: "dns",
    title: "Atlas",
    category: "Networking",
    description: "Tracing the global recursive lookup of domain names.",
    icon: <Globe className="w-6 h-6 text-blue-400" />,
    path: "/dns",
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "group-hover:border-blue-500/50"
  },
  {
    id: "ips",
    title: "Gateway",
    category: "Networking",
    description: "Visualizing NAT tables and Public vs Private IP routing.",
    icon: <Router className="w-6 h-6 text-indigo-400" />,
    path: "/ips",
    color: "from-indigo-500/20 to-indigo-600/20",
    borderColor: "group-hover:border-indigo-500/50"
  },
  {
    id: "dhcp",
    title: "Beacon",
    category: "Networking",
    description: "Automating IP assignment through the DORA handshake.",
    icon: <Wifi className="w-6 h-6 text-emerald-400" />,
    path: "/dhcp",
    color: "from-emerald-500/20 to-emerald-600/20",
    borderColor: "group-hover:border-emerald-500/50"
  },
  {
    id: "docker",
    title: "Shipyard",
    category: "Systems",
    description: "Exploring Image Layers and Container isolation mechanics.",
    icon: <Box className="w-6 h-6 text-cyan-400" />,
    path: "/docker",
    color: "from-cyan-500/20 to-cyan-600/20",
    borderColor: "group-hover:border-cyan-500/50"
  },
  {
    id: "protocols",
    title: "Packet",
    category: "Networking",
    description: "Comparing reliability (TCP) vs speed (UDP) data transfers.",
    icon: <Radio className="w-6 h-6 text-rose-400" />,
    path: "/protocols",
    color: "from-rose-500/20 to-rose-600/20",
    borderColor: "group-hover:border-rose-500/50"
  }
]

const categories: Category[] = ["All", "Systems", "Networking", "Frontend", "Security"]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 sm:p-12 md:p-24 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <header className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tight"
          >
            Technical Playgrounds
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            A high-fidelity implementation of core JavaScript and web engineering concepts. 
            Deep-dive into the mechanics of the web through interactive visualizations.
          </motion.p>
        </header>

        {/* Filter Bar */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                    activeCategory === cat 
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                      : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full sm:w-64 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600 group-focus-within:text-white transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search labs..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-[10px] font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700"
               />
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link href={project.path} className="group block h-full">
                  <div className={cn(
                    "relative h-full p-6 sm:p-8 rounded-[32px] border border-white/5 bg-gradient-to-br transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1 glass backdrop-blur-xl flex flex-col",
                    project.color,
                    project.borderColor
                  )}>
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                         {project.icon}
                       </div>
                       <div className="px-2 py-1 rounded bg-white/5 text-[8px] font-black uppercase text-gray-600 tracking-widest border border-white/5">
                          {project.category}
                       </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-white transition-colors tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 font-light leading-relaxed mb-6 flex-1 opacity-80 group-hover:opacity-100">
                      {project.description}
                    </p>
                    
                    {/* Subtle decorative arrow */}
                    <div className="flex items-center gap-2 text-white/30 group-hover:text-white transition-colors">
                       <span className="text-[10px] font-black uppercase tracking-tighter">Enter Lab</span>
                       <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                       </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto opacity-20">
                 <Filter className="w-6 h-6" />
              </div>
              <p className="text-gray-600 italic text-sm">No engineering patterns match your query.</p>
           </motion.div>
        )}

        {/* Footer */}
        <footer className="pt-16 border-t border-white/5 text-gray-600 text-[10px] flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="font-medium tracking-widest uppercase">© 2026 Technical Playgrounds Lab</p>
          <div className="flex gap-8 items-center uppercase font-black tracking-tighter">
            <span className="opacity-50">VIRTUALIZED EXPERIMENTS</span>
            <div className="flex items-center gap-2">
               <span className="text-blue-500">SYSTEM READY</span>
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
