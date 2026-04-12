"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Database, Search, Plus, Trash2, Info, Server, HardDrive, BarChart3, ChevronRight, Zap, Terminal, Activity } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "btree" | "patterns" | "pitfalls"

const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "btree", label: "🌳 B-Tree Viz" },
  { id: "patterns", label: "Index Patterns" },
  { id: "pitfalls", label: "Pitfalls" },
]

interface BNode { id: string; keys: number[]; children?: BNode[]; isLeaf: boolean }

const BTREE: BNode = {
  id: "root", keys: [50], isLeaf: false,
  children: [
    { id: "left", keys: [20, 35], isLeaf: false, children: [
      { id: "L1", keys: [10, 15], isLeaf: true },
      { id: "L2", keys: [25, 30], isLeaf: true },
      { id: "L3", keys: [40, 45], isLeaf: true },
    ]},
    { id: "right", keys: [70, 85], isLeaf: false, children: [
      { id: "R1", keys: [60, 65], isLeaf: true },
      { id: "R2", keys: [75, 80], isLeaf: true },
      { id: "R3", keys: [90, 95], isLeaf: true },
    ]},
  ],
}

export default function IndexDBPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-amber-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Database className="w-3 h-3" /> Database Indexing
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-amber-400 bg-clip-text text-transparent">Database Indexing</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">How databases find rows in milliseconds across billions of records — B-Trees, index strategies, EXPLAIN plans, and the pitfalls of over-indexing.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "btree" && <BTreeTab />}
            {tab === "patterns" && <PatternsTab />}
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
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><Search className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Why Indexes Exist</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">With 1 billion rows and no index, finding a user requires a <strong className="text-white">Full Table Scan</strong> — reading every row until the match is found. That&apos;s O(N), or potentially millions of disk reads. A B-Tree index reduces this to <strong className="text-white">O(log N)</strong> — roughly 30 disk reads for 1 billion rows.</p>
          <div className="space-y-3">
            {[
              { label: "Full Table Scan", complexity: "O(N)", example: "SELECT * FROM users WHERE email='x'  — no index", reads: "1,000,000 pages", color: "red" },
              { label: "B-Tree Index Seek", complexity: "O(log N)", example: "Index on email → B-Tree traversal", reads: "~30 page reads", color: "emerald" },
              { label: "Hash Index", complexity: "O(1) avg", example: "Memory-only, no range queries", reads: "1-2 page reads", color: "blue" },
            ].map(s => (
              <div key={s.label} className={cn("p-4 rounded-2xl border", s.color === "red" ? "bg-red-500/5 border-red-500/20" : s.color === "emerald" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-blue-500/5 border-blue-500/20")}>
                <div className="flex justify-between items-start mb-1">
                  <p className={cn("text-[11px] font-black uppercase", s.color === "red" ? "text-red-400" : s.color === "emerald" ? "text-emerald-400" : "text-blue-400")}>{s.label}</p>
                  <span className="font-mono text-[10px] text-gray-500">{s.complexity}</span>
                </div>
                <code className="text-[9px] text-gray-600 block">{s.example}</code>
                <p className="text-[10px] text-gray-500 mt-1">Disk I/O: {s.reads}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">B+ Tree — How Databases Actually Store Indexes</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Most databases (MySQL InnoDB, PostgreSQL, SQLite) use <strong className="text-white">B+ Trees</strong> (not plain B-Trees). The difference: in a B+ Tree, all data lives in leaf nodes; internal nodes only hold keys for navigation. Leaf nodes are linked in a doubly-linked list for range scans.</p>
          <div className="bg-black/40 p-5 rounded-2xl border border-amber-500/10 font-mono text-xs leading-7">
            <p className="text-amber-400">// B+ Tree properties:</p>
            <p className="text-gray-500">Order m = max children per node</p>
            <p className="text-gray-500">Each internal node has ceil(m/2) to m children</p>
            <p className="text-gray-500">All data at leaf level (uniform access time)</p>
            <p className="text-gray-500">Leaves linked → efficient range queries</p>
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-amber-400">// Height = O(log_m(N)):</p>
              <p className="text-gray-500">m=100, N=1,000,000,000</p>
              <p className="text-gray-500">Height = ⌈log_100(1B)⌉ = 5 levels</p>
              <p className="text-gray-500">→ Only 5 disk reads to find ANY row!</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
            <p className="text-[11px] text-amber-300/80">InnoDB stores the whole row in the B+ tree leaf (clustered index). Non-clustered indexes store (key, PK) and require a second lookup into the clustered index — called a &quot;double lookup&quot; or &quot;bookmark lookup&quot;.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function BTreeTab() {
  const [target, setTarget] = useState(42)
  const [searching, setSearching] = useState(false)
  const [path, setPath] = useState<string[]>([])
  const [scanIdx, setScanIdx] = useState(-1)
  const [reads, setReads] = useState({ index: 0, scan: 0 })
  const [logs, setLogs] = useState<string[]>([])
  const addLog = (msg: string) => setLogs(p => [`[DB] ${msg}`, ...p].slice(0, 8))

  const runSearch = async () => {
    if (searching) return
    setSearching(true); setPath([]); setScanIdx(-1); setReads({ index: 0, scan: 0 }); setLogs([])
    addLog(`Query: WHERE pk = ${target}`)
    addLog("PHASE 1: Full Table Scan (no index)...")
    for (let i = 0; i < 20; i++) {
      setScanIdx(i); setReads(r => ({ ...r, scan: r.scan + 1 }))
      await new Promise(r => setTimeout(r, 90))
      if (i * 5 === target) break
    }
    setScanIdx(-1)
    addLog("PHASE 2: B-Tree Index Traversal...")
    let curr: BNode | undefined = BTREE; let r = 0
    while (curr) {
      r++; setPath(p => [...p, curr!.id]); setReads(prev => ({ ...prev, index: r }))
      addLog(`↳ Node ${curr.id} [${curr.keys.join(",")}]`)
      await new Promise(x => setTimeout(x, 700))
      if (curr.isLeaf) break
      if (target < curr.keys[0]) curr = curr.children![0]
      else if (curr.keys.length > 1 && target < curr.keys[1]) curr = curr.children![1]
      else curr = curr.children![curr.children!.length - 1]
    }
    setSearching(false)
    addLog(`✓ Found. Index reads: ${r} vs scan reads: 20`)
  }

  function TreeNode({ node, activePath }: { node: BNode; activePath: string[] }) {
    const isActive = activePath.includes(node.id)
    const isHead = activePath[activePath.length - 1] === node.id
    return (
      <div className="flex flex-col items-center gap-6">
        <motion.div animate={{ borderColor: isHead ? "#f59e0b" : isActive ? "#f59e0b50" : "rgba(255,255,255,0.05)", backgroundColor: isActive ? "#f59e0b10" : "transparent" }}
          className={cn("px-4 py-2 rounded-xl border bg-black/40 flex flex-col items-center gap-1 min-w-[72px]")}>
          <div className="flex gap-2">
            {node.keys.map(k => <span key={k} className={cn("text-xs font-black font-mono", isHead ? "text-white" : isActive ? "text-amber-400" : "text-gray-700")}>{k}</span>)}
          </div>
          <span className="text-[7px] font-mono text-gray-800 uppercase">{node.id}</span>
        </motion.div>
        {node.children && (
          <div className="flex gap-4 relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-white/5" />
            {node.children.map(c => <TreeNode key={c.id} node={c} activePath={activePath} />)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-[24px] border-white/5 flex gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Watch the B-Tree traversal vs full table scan. The index reads only <strong className="text-white">3 nodes (log N)</strong> while the scan reads every record sequentially.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-[24px] border-white/5 space-y-4">
            <p className="text-[9px] uppercase font-black text-gray-600">Search Key</p>
            <div className="flex justify-between text-sm font-black font-mono"><span className="text-gray-600">PK =</span><span className="text-amber-400">{target}</span></div>
            <input type="range" min="10" max="95" step="5" value={target} onChange={e => setTarget(+e.target.value)} className="w-full accent-amber-500" />
            <button onClick={runSearch} disabled={searching} className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-black text-sm transition-all active:scale-95">
              {searching ? "Querying..." : "EXECUTE QUERY"}
            </button>
            <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-3 text-center">
              <div><p className="text-[9px] text-amber-500 uppercase font-black">Index Reads</p><p className="text-3xl font-black font-mono text-amber-400">{reads.index}</p></div>
              <div><p className="text-[9px] text-red-500 uppercase font-black">Scan Reads</p><p className="text-3xl font-black font-mono text-red-400">{reads.scan}</p></div>
            </div>
          </div>
          <div className="glass p-4 rounded-xl border-white/5">
            <p className="text-[9px] text-amber-500 uppercase font-black mb-2 flex items-center gap-1"><Terminal className="w-3 h-3" /> Query Plan</p>
            <div className="space-y-1">
              {logs.map((l, i) => <div key={i} className="text-[9px] font-mono text-gray-700 truncate">{l}</div>)}
              {!logs.length && <p className="text-[9px] text-gray-800 italic text-center mt-4">Execute a query</p>}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="glass p-6 rounded-[32px] border-white/5 overflow-x-auto">
            <p className="text-[9px] uppercase font-black text-gray-600 mb-6">B+ Tree Index Structure</p>
            <div className="flex flex-col items-center py-4 min-w-[480px]">
              <TreeNode node={BTREE} activePath={path} />
            </div>
          </div>
          <div className="glass p-5 rounded-[24px] border-white/5">
            <p className="text-[9px] uppercase font-black text-gray-600 mb-3">Full Table Scan (Heap)</p>
            <div className="flex gap-1 h-3 bg-white/5 rounded-full overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={cn("flex-1 transition-colors duration-200",
                  scanIdx === i ? "bg-red-500 animate-pulse" : scanIdx > i ? "bg-red-900/40" : "bg-white/5"
                )} />
              ))}
            </div>
            <div className="flex justify-between text-[8px] text-gray-700 mt-1 font-mono"><span>Row 1</span><span>Row 20</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PatternsTab() {
  const [active, setActive] = useState("composite")
  const patterns = [
    {
      id: "composite", name: "Composite Indexes", color: "amber",
      desc: "An index on multiple columns. Order matters: a composite index on (last_name, first_name) can satisfy queries on last_name alone, but NOT first_name alone. This is called the leftmost prefix rule.",
      code: `-- Composite index: (last_name, first_name, email)
CREATE INDEX idx_user_name ON users(last_name, first_name, email);

-- ✅ Uses index: leftmost prefix
SELECT * FROM users WHERE last_name = 'Smith';
SELECT * FROM users WHERE last_name = 'Smith' AND first_name = 'Alice';
SELECT * FROM users WHERE last_name = 'Smith' AND first_name = 'Alice' AND email = 'x';

-- ❌ Cannot use index: skips leading column
SELECT * FROM users WHERE first_name = 'Alice';
SELECT * FROM users WHERE email = 'alice@x.com';

-- ✅ Can still use partial index (last_name + email = skip):
SELECT * FROM users WHERE last_name = 'Smith' AND email = 'x';
-- Uses index scan on last_name, then filters email in memory

-- Rule of thumb: put highest-cardinality, most-filtered
-- columns first. Put range conditions last.`,
      insight: "The leftmost prefix rule means one composite index can serve many query patterns. Think about your query patterns before creating individual single-column indexes — one composite often beats three singles.",
    },
    {
      id: "covering", name: "Covering Indexes", color: "emerald",
      desc: "A covering index includes ALL columns referenced in a query. The database can answer the entire query from the index alone — no need to touch the main table. This eliminates the 'double lookup'.",
      code: `-- Table: orders(id, user_id, status, amount, created_at)
-- Query: get all PENDING orders for a user with amount
SELECT user_id, status, amount
FROM orders
WHERE user_id = 42 AND status = 'PENDING';

-- Non-covering index: (user_id, status)
-- 1. Scan index for user_id=42, status='PENDING'
-- 2. For each match, go back to heap table to fetch 'amount'
-- → Double lookup, potentially 1000s of random I/Os

-- Covering index: (user_id, status, amount)
-- 1. Scan index for user_id=42, status='PENDING'
-- 2. Return 'amount' directly from index leaf!
-- → Zero heap lookups!

-- PostgreSQL: EXPLAIN shows "Index Only Scan"
-- MySQL: EXPLAIN shows "Using index" in Extra column
EXPLAIN SELECT user_id, status, amount 
FROM orders WHERE user_id = 42 AND status = 'PENDING';`,
      insight: "A covering index is the most powerful optimization for read-heavy queries. Adding a few extra columns to an index can turn a query from 10,000 random I/Os to a pure sequential index scan. The tradeoff: larger index, slower writes.",
    },
    {
      id: "partial", name: "Partial & Filtered Indexes", color: "violet",
      desc: "A partial index only covers a subset of rows matching a WHERE condition. Perfect for sparse data patterns like 'active users' or 'unprocessed orders' — dramatically smaller index, much faster queries.",
      code: `-- Real scenario: 10M orders, only 50K are 'PENDING'
-- Full index on (status) covers all 10M rows
-- Partial index only covers the 50K PENDING rows

-- PostgreSQL partial index:
CREATE INDEX idx_pending_orders 
ON orders(created_at) 
WHERE status = 'PENDING';  -- ← only index PENDING rows!

-- This index is 200x smaller than a full index
-- And it covers the most common real-time query

-- MySQL doesn't support partial indexes natively
-- Workaround: use a generated column + regular index
ALTER TABLE orders
  ADD COLUMN is_pending TINYINT(1) 
  GENERATED ALWAYS AS (IF(status='PENDING', 1, NULL)) VIRTUAL;
CREATE INDEX idx_pending ON orders(is_pending);
-- NULL values aren't indexed → same effect!

-- Expression index (PostgreSQL):
-- For case-insensitive email lookup:
CREATE INDEX idx_email_lower ON users(LOWER(email));
SELECT * FROM users WHERE LOWER(email) = 'alice@x.com';`,
      insight: "Partial indexes are underused. For a 'soft delete' pattern with a 'deleted_at' column, create a partial index WHERE deleted_at IS NULL — this index only covers active rows, making it tiny and fast for your 99% case.",
    },
  ]
  const p = patterns.find(x => x.id === active)!
  const cMap: Record<string, string> = { amber: "text-amber-400 bg-amber-500/5 border-amber-500/20", emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20", violet: "text-violet-400 bg-violet-500/5 border-violet-500/20" }
  const c = cMap[p.color]
  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">{patterns.map(pat => (<button key={pat.id} onClick={() => setActive(pat.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold border transition-all", active === pat.id ? cMap[pat.color] : "bg-white/5 border-white/10 text-gray-500 hover:text-white")}>{pat.name}</button>))}</div>
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

function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("over")
  const pitfalls = [
    { id: "over", severity: "HIGH", color: "orange", title: "Over-Indexing — Slow Writes",
      summary: "Every index you create must be updated on INSERT/UPDATE/DELETE. A table with 20 indexes can have 20x slower writes. Index on what you query, not on everything.",
      bad: `-- ❌ Over-indexed tables are slow to write:
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,         -- ← auto index
  user_id INT,
  status VARCHAR(20),
  amount DECIMAL,
  note TEXT,
  ...
);
CREATE INDEX idx_user ON orders(user_id);
CREATE INDEX idx_status ON orders(status);  
CREATE INDEX idx_amount ON orders(amount);
CREATE INDEX idx_note ON orders(note(100));  -- rarely queried!
CREATE INDEX idx_user_status ON orders(user_id, status);
-- Each INSERT must update 6 B-Trees!
-- Write amplification: 6x the I/O`,
      good: `-- ✅ Create indexes for your actual queries:
-- Identify slow queries first (pg_stat_statements / slow query log)
-- EXPLAIN ANALYZE each slow query
-- Only then create targeted indexes

-- PostgreSQL: find unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;  -- ← never used! DROP these

-- MySQL: find missing index opportunities
SELECT * FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE INDEX_NAME IS NULL AND COUNT_READ > 0;
-- "No index used" reads — candidates for indexing`,
    },
    { id: "null", severity: "MEDIUM", color: "yellow", title: "NULL Values and Index Behavior",
      summary: "Different databases handle NULL in indexes differently. Some skip NULLs entirely (Oracle), some include them (PostgreSQL, MySQL). Queries using IS NULL may not use your index.",
      bad: `-- ❌ Assuming IS NULL uses an index:
CREATE INDEX idx_deleted_at ON users(deleted_at);

-- PostgreSQL: IS NULL DOES use the index ✓
SELECT * FROM users WHERE deleted_at IS NULL;      -- uses index!

-- But Oracle and SQL Server may NOT index NULLs:
-- "Index skip scan" needed, or NULL values just aren't indexed

-- MySQL: NULLs ARE indexed, but:
-- "= NULL" never matches anything (use IS NULL!)
SELECT * FROM users WHERE deleted_at = NULL; -- 0 rows, wrong!

-- ❌ Assuming COUNT(*) matches COUNT(column)
SELECT COUNT(*) FROM users;         -- counts all rows
SELECT COUNT(deleted_at) FROM users; -- skips NULLs!`,
      good: `-- ✅ Use IS NULL / IS NOT NULL correctly:
SELECT * FROM users WHERE deleted_at IS NULL;   -- correct
SELECT * FROM users WHERE deleted_at IS NOT NULL; -- correct

-- ✅ Partial index for NULL pattern (PostgreSQL):
CREATE INDEX idx_active_users ON users(email)
WHERE deleted_at IS NULL;  -- only index non-deleted users

-- ✅ Count properly:
SELECT COUNT(*) FROM users;           -- all rows  
SELECT COUNT(NULLIF(deleted_at, '')) -- count non-null/non-empty
FROM users;`,
    },
  ]
  const badge = (s: string) => s === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  const border = (c: string) => c === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-yellow-500/20 hover:border-yellow-500/40"
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Index pitfalls are some of the most impactful production issues — invisible in development (small data) but catastrophic at scale. Always use EXPLAIN ANALYZE to verify your indexes are actually being used.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className={cn("glass rounded-[24px] border overflow-hidden transition-colors", border(p.color))}>
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0", badge(p.severity))}>{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Anti-pattern</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Fix</p><pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
