"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, GitBranch, GitCommit, GitPullRequest, GitMerge, Info, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "simulator" | "deepdive" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "simulator", label: "🌿 Git Lab" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "pitfalls", label: "Pitfalls" },
]

interface Commit { id: string; message: string; parents: string[]; branch: string; timestamp: number }
interface Ref { name: string; commitId: string }

export default function VersionPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-orange-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <GitBranch className="w-3 h-3" /> GitCore · VCS
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-orange-400 bg-clip-text text-transparent">GitCore</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">How Git actually works under the hood — content-addressable storage, the blob/tree/commit object model, branches as pointers, and what rebase vs merge actually does to your DAG.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "simulator" && <SimulatorTab />}
            {tab === "deepdive" && <DeepDiveTab />}
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
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20"><GitCommit className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Git&apos;s Object Model</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Git is a <strong className="text-white">content-addressable filesystem</strong>. Everything stored is identified by its SHA-1 hash. Git stores 4 types of objects in <code className="text-orange-400 text-xs">.git/objects/</code>.
          </p>
          <div className="space-y-3">
            {[
              { type: "blob", color: "orange", desc: "A blob is the content of a single file — raw bytes, no filename or metadata. Two files with identical content share one blob. `git hash-object file.txt` creates a blob." },
              { type: "tree", color: "amber", desc: "A tree maps names to blob/tree hashes (like a directory). Contains: permissions (100644/40000), type (blob/tree), SHA-1, and name. Equivalent to a directory snapshot at one moment." },
              { type: "commit", color: "yellow", desc: "A commit points to a tree (project state), references parent commit(s), and stores author, timestamp, and message. The SHA-1 of a commit changes if ANY parent, tree, or metadata changes." },
              { type: "tag", color: "gray", desc: "An annotated tag is an object pointing to a commit with an author, date, and message. `git tag v1.0` (lightweight) is just a ref file. `git tag -a v1.0` creates a tag object." },
            ].map(o => (
              <div key={o.type} className={cn("p-4 rounded-2xl border", o.color === "orange" ? "bg-orange-500/5 border-orange-500/20" : o.color === "amber" ? "bg-amber-500/5 border-amber-500/20" : o.color === "yellow" ? "bg-yellow-500/5 border-yellow-500/20" : "bg-white/3 border-white/10")}>
                <div className="flex items-center gap-2 mb-1">
                  <code className={cn("text-[10px] font-black px-2 py-0.5 rounded font-mono", o.color === "orange" ? "bg-orange-500/20 text-orange-400" : o.color === "amber" ? "bg-amber-500/20 text-amber-400" : o.color === "yellow" ? "bg-yellow-500/20 text-yellow-400" : "bg-white/10 text-gray-400")}>{o.type}</code>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Branches, HEAD, and Refs</h3>
          <p className="text-sm text-gray-400 leading-relaxed">A <strong className="text-white">branch in Git is just a file</strong> containing a 40-character SHA-1. That&apos;s it. Creating a branch is creating a 41-byte file. Deleting is deleting that file. There is no copying of commits.</p>
          <div className="bg-black/40 p-5 rounded-2xl font-mono text-[10px] space-y-2 border border-white/5">
            <p className="text-gray-600"># Branches are files in .git/refs/heads/</p>
            <p><span className="text-gray-600">$ cat .git/refs/heads/main</span></p>
            <p className="text-orange-400">a3f2b1c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9</p>
            <p className="text-gray-600 mt-2"># HEAD is a symref pointing to current branch</p>
            <p><span className="text-gray-600">$ cat .git/HEAD</span></p>
            <p className="text-white">ref: refs/heads/main</p>
            <p className="text-gray-600 mt-2"># When you commit: HEAD → branch file is updated</p>
            <p className="text-gray-600"># When you checkout: HEAD → points to new branch</p>
            <p className="text-gray-600"># Detached HEAD: HEAD contains a SHA-1 directly</p>
          </div>
          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 text-[11px] text-gray-400">
            <strong className="text-orange-400">Fast-forward merge:</strong> If the target branch is an ancestor of the source, Git just moves the pointer forward — no new commit created. Git only creates a merge commit when histories actually diverge.
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulatorTab() {
  const [commits, setCommits] = useState<Commit[]>(() => [
    { id: "a1b2c", message: "Initial commit", parents: [], branch: "main", timestamp: Date.now() }
  ])
  const [refs, setRefs] = useState<Ref[]>([{ name: "main", commitId: "a1b2c" }, { name: "HEAD", commitId: "a1b2c" }])
  const [currentBranch, setCurrentBranch] = useState("main")
  const [logs, setLogs] = useState<string[]>([])
  const [prOpen, setPrOpen] = useState(false)
  const [commitMsg, setCommitMsg] = useState("")

  const addLog = (msg: string) => setLogs(p => [`[git] ${msg}`, ...p].slice(0, 10))

  const makeCommit = () => {
    const id = Math.random().toString(36).substr(2, 7)
    const headCommit = refs.find(r => r.name === "HEAD")?.commitId
    const msg = commitMsg.trim() || "Update files"
    const newCommit: Commit = { id, message: msg, parents: headCommit ? [headCommit] : [], branch: currentBranch, timestamp: Date.now() }
    setCommits(p => [...p, newCommit])
    setRefs(p => p.map(r => r.name === "HEAD" || r.name === currentBranch ? { ...r, commitId: id } : r))
    addLog(`commit ${id.slice(0, 7)}: ${msg}`)
    setCommitMsg("")
  }

  const makeBranch = (name: string) => {
    if (refs.some(r => r.name === name)) { addLog(`error: branch '${name}' already exists`); return }
    const headCommit = refs.find(r => r.name === "HEAD")?.commitId || ""
    setRefs(p => [...p, { name, commitId: headCommit }])
    addLog(`branch '${name}' created from ${headCommit.slice(0, 7)}`)
  }

  const checkout = (name: string) => {
    const ref = refs.find(r => r.name === name)
    if (!ref) return
    setCurrentBranch(name)
    setRefs(p => p.map(r => r.name === "HEAD" ? { ...r, commitId: ref.commitId } : r))
    addLog(`Switched to branch '${name}'`)
  }

  const doMerge = (source: string) => {
    const sourceRef = refs.find(r => r.name === source)
    const targetRef = refs.find(r => r.name === currentBranch)
    if (!sourceRef || !targetRef) return
    const id = Math.random().toString(36).substr(2, 7)
    const mergeCommit: Commit = { id, message: `Merge '${source}' into ${currentBranch}`, parents: [targetRef.commitId, sourceRef.commitId], branch: currentBranch, timestamp: Date.now() }
    setCommits(p => [...p, mergeCommit])
    setRefs(p => p.map(r => r.name === currentBranch || r.name === "HEAD" ? { ...r, commitId: id } : r))
    addLog(`merge commit ${id.slice(0, 7)}: merged ${source} → ${currentBranch}`)
  }

  const branches = refs.filter(r => r.name !== "HEAD")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-[28px] border-white/5 space-y-4">
            <p className="text-[9px] uppercase font-black text-gray-600">Git Terminal</p>
            <div>
              <p className="text-[8px] text-gray-700 uppercase font-black mb-1">Commit Message</p>
              <input value={commitMsg} onChange={e => setCommitMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && makeCommit()} placeholder="Add feature X" className="w-full bg-black/60 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono focus:border-orange-500/40 outline-none" />
            </div>
            <button onClick={makeCommit} className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-black font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2">
              <GitCommit className="w-3.5 h-3.5" /> git commit
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => makeBranch("feature")} className="py-2.5 rounded-xl border border-white/10 bg-white/3 text-[9px] font-black hover:border-orange-500/30 hover:text-orange-400 transition-all flex items-center justify-center gap-1.5">
                <GitBranch className="w-3 h-3" /> branch
              </button>
              <button onClick={() => setPrOpen(true)} className="py-2.5 rounded-xl border border-white/10 bg-white/3 text-[9px] font-black hover:border-emerald-500/30 hover:text-emerald-400 transition-all flex items-center justify-center gap-1.5">
                <GitPullRequest className="w-3 h-3" /> PR
              </button>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-white/5">
              <p className="text-[8px] text-gray-700 uppercase font-black">Branches</p>
              {branches.map(ref => (
                <button key={ref.name} onClick={() => checkout(ref.name)} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] transition-all font-mono text-left", currentBranch === ref.name ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "bg-white/3 border-white/5 text-gray-600 hover:text-white")}>
                  <GitBranch className="w-3 h-3 shrink-0" />
                  <span className="flex-1 truncate font-black">{ref.name}</span>
                  <span className="text-[8px] opacity-40 font-mono">{ref.commitId.slice(0, 5)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="glass p-4 rounded-2xl border-white/5 h-44 overflow-y-auto">
            <p className="text-[9px] text-orange-500 uppercase font-black mb-2">Event Stream</p>
            {logs.map((l, i) => <div key={i} className="text-[9px] font-mono text-gray-600 py-0.5 border-b border-white/3 truncate">{l}</div>)}
            {!logs.length && <p className="text-gray-800 italic text-center mt-12 text-[9px]">awaiting commits...</p>}
          </div>
        </div>

        <div className="lg:col-span-3 glass p-6 rounded-[32px] border-white/5">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400"><GitCommit className="w-4 h-4" /></div>
              <div>
                <p className="text-sm font-black">Commit Graph (DAG)</p>
                <p className="text-[9px] text-gray-600 font-mono uppercase">HEAD → {currentBranch} → {refs.find(r => r.name === currentBranch)?.commitId.slice(0, 7)}</p>
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div><p className="text-[8px] text-gray-600 uppercase font-black">Commits</p><p className="text-2xl font-black text-orange-400 font-mono">{commits.length}</p></div>
              <div><p className="text-[8px] text-gray-600 uppercase font-black">Branches</p><p className="text-2xl font-black text-amber-400 font-mono">{branches.length}</p></div>
            </div>
          </div>
          <div className="bg-black/40 rounded-[24px] border border-white/5 p-6 max-h-[420px] overflow-y-auto flex flex-col-reverse gap-8 relative">
            <AnimatePresence>
              {[...commits].reverse().map((commit, i) => (
                <motion.div key={commit.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-4 relative">
                  <div className={cn("w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 relative z-20 shadow-lg shadow-black",
                    commit.parents.length > 1 ? "border-emerald-500 bg-emerald-500/10" : commit.branch === "main" ? "border-orange-500 bg-orange-500/10" : "border-amber-500 bg-amber-500/10"
                  )}>
                    <span className="text-[8px] font-black font-mono">{commit.id.slice(0, 5)}</span>
                    {refs.filter(r => r.commitId === commit.id && r.name !== "HEAD").map(r => (
                      <span key={r.name} className={cn("absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase shadow-lg whitespace-nowrap",
                        r.name === currentBranch ? "bg-orange-600 text-white" : "bg-white/10 text-gray-400"
                      )}>{r.name}{currentBranch === r.name ? " ← HEAD" : ""}</span>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-[10px] font-black uppercase tracking-wide text-white truncate">{commit.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-[8px] font-mono text-gray-700">SHA:{commit.id}</code>
                      <span className={cn("text-[7px] font-black px-1.5 py-0.5 rounded uppercase", commit.parents.length > 1 ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-gray-600")}>{commit.parents.length > 1 ? "merge" : commit.branch}</span>
                    </div>
                  </div>
                  {i < commits.length - 1 && <div className="absolute left-5 top-10 -bottom-8 w-0.5 bg-linear-to-b from-white/10 to-transparent -z-10" />}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {prOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-6">
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="glass p-8 rounded-[40px] border-orange-500/20 max-w-lg w-full space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><GitPullRequest className="w-6 h-6" /></div>
                <div><h3 className="text-lg font-black">Open Pull Request</h3><p className="text-[10px] text-gray-600">feature → main</p></div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">A PR requests review before merging. In production: triggers CI/CD pipelines, linting, tests, and code review. Protects the main branch from unreviewed changes.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { doMerge("feature"); setPrOpen(false) }} className="py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                  <GitMerge className="w-3.5 h-3.5" /> Merge PR
                </button>
                <button onClick={() => setPrOpen(false)} className="py-3 rounded-2xl bg-white/5 text-gray-500 font-black text-xs hover:text-white transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DeepDiveTab() {
  const [active, setActive] = useState("objects")
  const topics = [
    { id: "objects", name: "Object Storage Internals", color: "orange",
      desc: "Git stores all objects in .git/objects/ as zlib-compressed files. The filename is the SHA-1 hash. This content-addressable design means deduplication is automatic.",
      code: `// Git object storage — everything is a SHA-1-named file
$ git cat-file -p HEAD
tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
parent a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0
author Jane Doe <jane@example.com> 1700000000 +0000
committer Jane Doe <jane@example.com> 1700000000 +0000

Add authentication feature

// The tree object:
$ git cat-file -p HEAD^{tree}
100644 blob 8ab686eafeb1f44702738c8b0f24f2567c36da6d   README.md
100644 blob 4f2be35b64c0e4c30a4c5e78e58e4e7c0d3f2a1b   index.js
040000 tree 3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2   src/

// Every commit points to a complete tree snapshot, not a diff!
// Even if only one file changed — a new tree is created
// BUT: unchanged blobs are reused (same SHA-1 → same file)
// This is what makes git fast and storage-efficient

// Pack files: git periodically compresses objects
$ git gc        ← triggers garbage collection + packfile
$ git count-objects -vH
count: 0
size: 0
in-pack: 1847   ← all objects packed
packs: 1
size-pack: 486.23 KiB  ← compressed

// Delta compression in packfiles does store diffs
// But the object model itself is always full snapshots`,
      insight: "Git's simplicity comes from the object model: 4 types, content-addressed by SHA-1. Every 'feature' (branches, tags, stash, reflog) is built on top of these 4 primitives. Understanding them makes all git commands intuitive.",
    },
    { id: "rebase", name: "Merge vs Rebase", color: "amber",
      desc: "Both integrate changes from one branch into another, but they produce different history shapes. Choosing between them is about whether you want to preserve history or create a clean linear narrative.",
      code: `// Scenario: feature branched from main at commit C
// main has D, E added since then; feature has F, G

// GIT MERGE main → feature:
//   Creates a new merge commit M
//   M has two parents: G and E
//   Preserves complete history of both branches

      A---B---C---D---E  (main)
               \\         \\
                F---G-----M  (feature, after merge)

// GIT REBASE main → feature:
//   Rewrites F and G as new commits F' and G'
//   New commits have different SHA-1s (new parent!)
//   Appears as if you branched from E, not C
//   WARNING: never rebase shared/public branches

      A---B---C---D---E  (main)
                       \\
                        F'---G'  (feature, after rebase)

// When to use each:
// Merge:  preserving context ("this was a feature branch")
//         never rewrites history (safe on shared branches)
//         PR squash merge → clean main + feature history preserved

// Rebase: cleaning up messy local commits before PR
//         maintaining linear history in main ("bisect-friendly")
//         interactive rebase: squash, fixup, reorder commits

// Interactive rebase:
git rebase -i HEAD~4  ← rewrite last 4 commits
# pick a1b2c Add feature X
# squash b2c3d Fix typo in X    ← squash into previous
# reword c3d4e Update tests     ← change message
# drop d4e5f Remove debug log   ← delete this commit`,
      insight: "Use merge for long-lived branches or when history matters. Use rebase to clean up local work before opening a PR. The golden rule: never rebase commits that exist on a remote shared branch — it rewrites history for everyone.",
    },
  ]
  const p = topics.find(t => t.id === active)!
  const c = p.color === "orange" ? "text-orange-400 bg-orange-500/5 border-orange-500/20" : "text-amber-400 bg-amber-500/5 border-amber-500/20"
  return (
    <div className="space-y-6">
      <div className="flex gap-2">{topics.map(t => (<button key={t.id} onClick={() => setActive(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold border transition-all", active === t.id ? c : "bg-white/5 border-white/10 text-gray-500 hover:text-white")}>{t.name}</button>))}</div>
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
  const [expanded, setExpanded] = useState<string | null>("force-push")
  const pitfalls = [
    { id: "force-push", severity: "HIGH", title: "Force-Pushing a Shared Branch",
      summary: "git push --force rewrites remote history. If teammates have pulled, their local history diverges from origin. Their next push will fail and their commits may be lost.",
      bad: `// ❌ Dangerous: force-push to shared branch
git checkout main
git rebase -i HEAD~10  # rewrites local history
git push --force origin main

// What happens to your teammate:
git pull origin main
# error: diverged — can't fast-forward
git push origin main
# rejected: non-fast-forward

// Their local commits are now orphaned
// merge/rebase confusion follows
// Worst case: lost commits, duplicated commits`,
      good: `// ✅ Force-push only on YOUR OWN branches:
git checkout feature/my-branch  # only you use this
git rebase -i HEAD~5            # clean up local commits  
git push --force-with-lease     # ← safer: fails if someone else pushed

// --force-with-lease checks that remote hasn't changed
// since you last fetched — prevents overwriting others' work

// For shared branches: NEVER rebase, only merge
// To undo a bad commit on shared branch:
git revert abc123   # creates a NEW commit that undoes it
                    # safe: doesn't rewrite history

// If you must fix main (e.g., committed secrets):
// 1. Coordinate with entire team: everyone stash/push
// 2. Fix + force push
// 3. Everyone: git fetch && git reset --hard origin/main`,
    },
  ]
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">Git&apos;s flexibility is a double-edged sword — commands that work perfectly on local branches become destructive on shared ones. Understand the public/private branch distinction.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className="glass rounded-[24px] border border-orange-500/20 hover:border-orange-500/40 overflow-hidden transition-colors">
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black border bg-orange-500/20 text-orange-400 border-orange-500/30 shrink-0">{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Danger</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
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
