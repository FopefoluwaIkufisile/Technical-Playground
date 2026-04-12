"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Target, Code2, Info, AlertCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "concepts" | "playground" | "patterns" | "pitfalls"
const TABS: { id: Tab; label: string }[] = [
  { id: "concepts", label: "Concepts" },
  { id: "playground", label: "🔍 Playground" },
  { id: "patterns", label: "Patterns" },
  { id: "pitfalls", label: "Pitfalls" },
]

export default function RegexPage() {
  const [tab, setTab] = useState<Tab>("concepts")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-rose-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Target className="w-3 h-3" /> Regex · Pattern Matching
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-rose-400 bg-clip-text text-transparent">Regular Expressions</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">Patterns, quantifiers, groups, lookaheads — how regex engines work, common patterns, and the catastrophic backtracking pitfalls that can halt your server.</p>
        </motion.div>
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", tab === t.id ? "bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>{t.label}</button>))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "concepts" && <ConceptsTab />}
            {tab === "playground" && <PlaygroundTab />}
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
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20"><Code2 className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Regex Building Blocks</h2>
          </div>
          <div className="space-y-2">
            {[
              { token: ".", desc: "Any character except newline", ex: "a.c → 'abc', 'a1c', 'a c'" },
              { token: "\\d", desc: "Any digit [0-9]", ex: "\\d+ → '123', '0', '42'" },
              { token: "\\w", desc: "Word char [a-zA-Z0-9_]", ex: "\\w+ → 'hello_world2'" },
              { token: "\\s", desc: "Whitespace (space, tab, newline)", ex: "\\s+ → '  \\t\\n'" },
              { token: "[abc]", desc: "Character class — any of a, b, or c", ex: "[aeiou] → vowels" },
              { token: "[^abc]", desc: "Negated class — NOT a, b, or c", ex: "[^\\d] → non-digits" },
              { token: "(abc)", desc: "Capturing group — also creates $1 reference", ex: "(\\d+)-(\\d+) → two groups" },
              { token: "(?:abc)", desc: "Non-capturing group — groups without capture", ex: "(?:Mr|Ms)\\.\\s(\\w+)" },
              { token: "a|b", desc: "Alternation — a or b", ex: "cat|dog → 'cat' or 'dog'" },
              { token: "^", desc: "Anchors to start of string (or line with m flag)", ex: "^Error → starts with Error" },
              { token: "$", desc: "Anchors to end of string (or line with m flag)", ex: "\\.js$ → ends in .js" },
            ].map(r => (
              <div key={r.token} className="grid grid-cols-3 gap-2 py-2 border-b border-white/5">
                <code className="text-rose-400 font-mono text-[11px] font-black">{r.token}</code>
                <span className="text-[10px] text-gray-500 col-span-1">{r.desc}</span>
                <span className="text-[9px] text-gray-700 font-mono">{r.ex}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Quantifiers</h3>
            <div className="space-y-2">
              {[
                { q: "*", desc: "0 or more (greedy)", greedy: true },
                { q: "+", desc: "1 or more (greedy)", greedy: true },
                { q: "?", desc: "0 or 1 (optional)", greedy: true },
                { q: "{3}", desc: "Exactly 3", greedy: true },
                { q: "{2,5}", desc: "Between 2 and 5", greedy: true },
                { q: "*?", desc: "0 or more (lazy) — stops as soon as possible", greedy: false },
                { q: "+?", desc: "1 or more (lazy) — finds shortest match", greedy: false },
              ].map(q => (
                <div key={q.q} className="flex items-center gap-3 py-1.5 border-b border-white/5">
                  <code className={cn("font-mono text-[11px] font-black w-12", q.greedy ? "text-rose-400" : "text-amber-400")}>{q.q}</code>
                  <span className="text-[10px] text-gray-500 flex-1">{q.desc}</span>
                  <span className={cn("text-[8px] font-black px-2 py-0.5 rounded uppercase", q.greedy ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500")}>{q.greedy ? "greedy" : "lazy"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Lookahead & Lookbehind (Zero-Width Assertions)</h3>
            <div className="space-y-2">
              {[
                { syn: "(?=...)", name: "Positive lookahead", ex: "\\w+(?=\\s)", desc: "Match word followed by space, don't include space" },
                { syn: "(?!...)", name: "Negative lookahead", ex: "\\d+(?!\\.)", desc: "Match digits NOT followed by dot" },
                { syn: "(?<=...)", name: "Positive lookbehind", ex: "(?<=\\$)\\d+", desc: "Match digits preceded by $" },
                { syn: "(?<!...)", name: "Negative lookbehind", ex: "(?<!\\d)\\d+", desc: "Match digits NOT preceded by another digit" },
              ].map(l => (
                <div key={l.syn} className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-1">
                  <div className="flex gap-2 items-center">
                    <code className="text-rose-400 font-mono text-[10px] font-black">{l.syn}</code>
                    <span className="text-[9px] text-gray-600 uppercase font-black">{l.name}</span>
                  </div>
                  <code className="text-[9px] text-gray-500 font-mono block">{l.ex} — {l.desc}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaygroundTab() {
  const [regex, setRegex] = useState("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})")
  const [input, setInput] = useState("Contact us at support@example.com or admin@internal.co.uk for help. Invalid: @nodomain.com, user@.com")
  const [flags, setFlags] = useState("gi")

  const { matches, error } = useMemo(() => {
    if (!regex) return { matches: [], highlighted: input, error: null }
    try {
      const results: RegExpExecArray[] = []
      let m: RegExpExecArray | null
      const safeFlags = flags.includes("g") ? flags : flags + "g"
      const re2 = new RegExp(regex, safeFlags)
      while ((m = re2.exec(input)) !== null) {
        results.push(m)
        if (m.index === re2.lastIndex) re2.lastIndex++
      }
      return { matches: results, highlighted: input, error: null }
    } catch (e: unknown) {
      return { matches: [], highlighted: input, error: (e as Error).message }
    }
  }, [regex, input, flags])

  const renderHighlighted = () => {
    if (!matches.length) return <span className="text-gray-400">{input}</span>
    const spans: React.ReactElement[] = []
    let lastEnd = 0
    matches.forEach((m, idx) => {
      if (m.index > lastEnd) spans.push(<span key={`t${idx}`} className="text-gray-400">{input.slice(lastEnd, m.index)}</span>)
      spans.push(<mark key={`m${idx}`} className="bg-rose-500/25 text-rose-300 rounded px-0.5 font-bold not-italic">{m[0]}</mark>)
      lastEnd = m.index + m[0].length
    })
    if (lastEnd < input.length) spans.push(<span key="tail" className="text-gray-400">{input.slice(lastEnd)}</span>)
    return spans
  }

  const PRESETS = [
    { label: "Email", re: "([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})" },
    { label: "IPv4", re: "\\b((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b" },
    { label: "URL", re: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)" },
    { label: "Date MM/DD", re: "(0?[1-9]|1[012])\\/(0?[1-9]|[12]\\d|3[01])\\/(\\d{4})" },
    { label: "Hex Color", re: "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-[24px] border-white/5 space-y-4">
            <p className="text-[9px] uppercase font-black text-gray-600">Presets</p>
            {PRESETS.map(p => (<button key={p.label} onClick={() => setRegex(p.re)} className={cn("w-full py-2 px-3 rounded-xl border text-left text-[10px] font-bold transition-all", regex === p.re ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-white/3 border-white/5 text-gray-600 hover:border-white/10 hover:text-white")}>{p.label}</button>))}
          </div>
          <div className="glass p-5 rounded-[24px] border-white/5 space-y-3">
            <p className="text-[9px] uppercase font-black text-gray-600">Flags</p>
            <div className="grid grid-cols-3 gap-2">
              {(["g", "i", "m"] as const).map(f => (
                <button key={f} onClick={() => setFlags(flags.includes(f) ? flags.replace(f, "") : flags + f)}
                  className={cn("py-2 rounded-lg text-[9px] font-black uppercase border transition-all", flags.includes(f) ? "bg-rose-500/20 border-rose-500 text-rose-400" : "bg-white/5 border-white/5 text-gray-700")}>{f}</button>
              ))}
            </div>
            <div className="pt-2 border-t border-white/5">
              <p className="text-[9px] text-gray-600 uppercase font-black">Matches</p>
              <p className="text-3xl font-black text-rose-400 font-mono">{matches.length}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="glass p-5 rounded-[32px] border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-rose-500 font-mono font-black text-xl">/</span>
              <input value={regex} onChange={e => setRegex(e.target.value)}
                className={cn("flex-1 bg-black/40 border rounded-xl px-4 py-3 font-mono text-sm outline-none transition-all", error ? "border-red-500/50" : "border-white/10 focus:border-rose-500/40")} placeholder="Enter regex..." />
              <span className="text-rose-500 font-mono font-black text-xl">/{flags}</span>
            </div>
            {error && <p className="text-[11px] text-red-400 font-mono animate-pulse">Error: {error}</p>}
            <div className="bg-black/40 rounded-2xl border border-white/5 p-5 min-h-[120px]">
              <p className="text-[9px] font-black uppercase text-gray-600 mb-3">Test String</p>
              <div className="relative">
                <div className="font-mono text-sm leading-8 whitespace-pre-wrap pointer-events-none absolute inset-0 p-0 break-all">{renderHighlighted()}</div>
                <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full bg-transparent font-mono text-sm leading-8 text-transparent caret-white outline-none resize-none min-h-[100px] whitespace-pre-wrap break-all" />
              </div>
            </div>
          </div>
          <div className="glass p-5 rounded-[32px] border-white/5 space-y-3">
            <p className="text-[9px] uppercase font-black text-gray-600">Match Results</p>
            <div className="flex gap-3 flex-wrap overflow-auto max-h-60">
              <AnimatePresence>
                {matches.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="min-w-[180px] p-4 bg-white/5 border border-rose-500/10 rounded-2xl space-y-2 shrink-0">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black text-rose-400">Match #{i+1}</span>
                      <span className="text-[8px] font-mono text-gray-700">idx:{m.index}</span>
                    </div>
                    <p className="font-mono text-sm font-bold truncate" title={m[0]}>{m[0]}</p>
                    {m.slice(1).map((g, gi) => (
                      <div key={gi} className="px-2 py-1 bg-rose-500/5 border border-rose-500/10 rounded-lg">
                        <p className="text-[8px] text-rose-500/60 font-black uppercase">Group {gi+1}</p>
                        <p className="text-[10px] font-mono text-rose-400 font-bold">{g ?? "undefined"}</p>
                      </div>
                    ))}
                  </motion.div>
                ))}
                {!matches.length && <div className="w-full py-12 text-center text-gray-800 text-sm italic font-black flex items-center justify-center gap-3"><AlertCircle className="w-5 h-5" /> No matches found</div>}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PatternsTab() {
  const [active, setActive] = useState("email")
  const patterns = [
    { id: "email", name: "Email Validation", color: "rose",
      regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`,
      desc: "The anatomy of a complete, practical email regex. Note: truly validating email requires sending a confirmation link — regex can only check format.",
      code: `// Practical email regex (not RFC 5322 compliant — too complex):
const EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
//            ↑ local part           ↑ domain         ↑ TLD 2+ chars

// Breaking it down:
// ^                    → anchor to start (no leading text)
// [a-zA-Z0-9._%+-]+    → local part: alphanumeric + . _ % + -
// @                    → literal @
// [a-zA-Z0-9.-]+       → domain: alphanumeric + . and -
// \\.                  → escaped dot (literal .)
// [a-zA-Z]{2,}         → TLD: 2+ letters (com, uk, io, museum)
// $                    → anchor to end (no trailing text)

// Real RFC 5322 email is ~6,000 chars. This works for 99.9%:
EMAIL.test('user@example.com')    // true ✓
EMAIL.test('user+tag@sub.co.uk')  // true ✓
EMAIL.test('user@')               // false ✓
EMAIL.test('@domain.com')         // false ✓`,
      insight: "The 'correct' RFC 5322 email regex is 6 KB long and unmaintainable. The 99.9% solution above is fine for UX validation. Always send a confirmation email — regex can't tell if the mailbox actually exists.",
    },
    { id: "url", name: "URL Parsing", color: "rose",
      regex: `/^(https?:\\/\\/)([\\w-]+\\.)+[\\w-]+(:\\d+)?(\\/[^\\s]*)?$/`,
      desc: "URLs have complex structure. Named groups can extract components. The URL constructor is often better than regex for real URL parsing.",
      code: `// Named capture groups for URL parsing:
const URL_RE = /^(?<protocol>https?:\\/\\/)(?<host>[\\w.-]+)(?::(?<port>\\d+))?(?<path>\\/[^\\s]*)?(?:\\?(?<query>[^#]*))?(?:#(?<hash>.*))?$/;

const m = URL_RE.exec('https://api.example.com:8080/users?page=2#section');
m.groups.protocol  // 'https://'
m.groups.host      // 'api.example.com'
m.groups.port      // '8080'
m.groups.path      // '/users'
m.groups.query     // 'page=2'
m.groups.hash      // 'section'

// Better alternative — the URL API:
const url = new URL('https://api.example.com:8080/users?page=2');
url.hostname  // 'api.example.com'
url.port      // '8080'
url.pathname  // '/users'
url.searchParams.get('page')  // '2'
// Use URL() when possible — regex can't handle all edge cases`,
      insight: "Use the URL constructor instead of regex for URL parsing. It handles percent-encoding, punycode (international domains), port defaults, and relative URLs correctly. Regex is appropriate only for simple pattern checking, not full parsing.",
    },
    { id: "lookahead", name: "Password Validation", color: "rose",
      regex: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/`,
      desc: "Multiple lookaheads validate different requirements simultaneously. Each (?=...) asserts a condition at the same position without consuming characters.",
      code: `// Password: 8+ chars, uppercase, lowercase, digit, special
const STRONG_PW = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;

// How lookaheads work:
// ^ anchors to start
// (?=.*[a-z]) — from here, somewhere ahead must be a lowercase
// (?=.*[A-Z]) — from here, somewhere ahead must be uppercase  
// (?=.*\\d)   — from here, somewhere ahead must be a digit
// (?=.*[...]) — somewhere ahead must be a special char
// All four run at position 0 simultaneously
// Then [A-Za-z\\d@$!%*?&]{8,} consumes 8+ valid chars
// $ anchors to end

// Test:
STRONG_PW.test('abc')          // false — no uppercase/digit
STRONG_PW.test('Abcdefgh1!')   // true ✓

// Better UX: test each requirement separately and show live feedback:
const checks = {
  minLength: (pw) => pw.length >= 8,
  hasLower:  (pw) => /[a-z]/.test(pw),
  hasUpper:  (pw) => /[A-Z]/.test(pw),
  hasDigit:  (pw) => /\\d/.test(pw),
  hasSpec:   (pw) => /[@$!%*?&]/.test(pw),
};`,
      insight: "Lookaheads let you validate multiple independent constraints at the same position. This is more readable than a single complex alternation. But for password validation, individual checks with live feedback UI is far better UX than a single regex.",
    },
  ]
  const p = patterns.find(x => x.id === active)!
  const c = "text-rose-400 bg-rose-500/5 border-rose-500/20"
  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">{patterns.map(pat => (<button key={pat.id} onClick={() => setActive(pat.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold border transition-all", active === pat.id ? c : "bg-white/5 border-white/10 text-gray-500 hover:text-white")}>{pat.name}</button>))}</div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass p-6 rounded-[32px] border-white/5 space-y-4">
            <code className="text-rose-400 font-mono text-xs break-all">{p.regex}</code>
            <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
            <pre className={cn("p-5 rounded-2xl border text-xs font-mono leading-6 whitespace-pre-wrap overflow-auto", c)}>{p.code}</pre>
          </div>
          <div className={cn("glass p-6 rounded-[24px] border space-y-3", c)}>
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Key Insight</p>
            <p className="text-sm text-gray-400 leading-relaxed">{p.insight}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function PitfallsTab() {
  const [expanded, setExpanded] = useState<string | null>("redos")
  const pitfalls = [
    { id: "redos", severity: "CRITICAL", title: "ReDoS — Catastrophic Backtracking",
      summary: "Certain regex patterns have exponential worst-case complexity. A malicious input can freeze server threads for hours. This is a real denial-of-service attack vector.",
      bad: `// ❌ Vulnerable to ReDoS (catastrophic backtracking):
const VULN = /^(a+)+$/;
// For input "aaaaaaaaaaaaaaaaab" (18 a's + b):
// Engine tries every combination of groupings
// 2^18 = 262,144 attempts before declaring no match!
// With 30 chars: 2^30 ≈ 1 BILLION attempts = server freeze

// Real CVE examples:
// CVE-2019-10744 — lodash isMatch() ReDoS
// CVE-2020-7692 — node-fetch ReDoS
// Express.js path-to-regexp had ReDoS (used in routing!)

// Other vulnerable patterns:
/(a|a)+$/        // alternation with overlap
/(\\w+\\.){2,}/  // nested quantifier on same chars
/(.+?,)+/        // lazy quantifier in repetition`,
      good: `// ✅ Safe alternatives:
// 1. Atomic groups (possessive quantifiers) — not in JS:
//    Use a library: 're2' (Google's RE2 engine, O(N) guaranteed)
const RE2 = require('re2');
const safe = new RE2('^(a+)+$');  // RE2 is always O(N)

// 2. Rewrite to linear:
//    Instead of: ^(a+)+$
//    Use:        ^a+$   ← same match, no backtracking

// 3. Set timeouts for user-supplied regex:
//    Use vm.runInNewContext with timeout
//    Or use a worker thread with AbortController

// 4. Never pass user input as regex without sanitization:
const safeRegex = require('safe-regex');
safeRegex(/^(a+)+$/) // returns false — not safe!

// 5. Run regex on max N chars:
const limited = input.slice(0, 1000);
if (PATTERN.test(limited)) { ... }`,
    },
    { id: "greedy", severity: "HIGH", title: "Greedy vs Lazy — Wrong Matches",
      summary: "By default, quantifiers are greedy — they match as much as possible. This causes unexpected over-matching in HTML parsing and other scenarios.",
      bad: `// ❌ Greedy quantifier over-matches:
const HTML = '<b>bold</b> text <b>more bold</b>';
const GREEDY = /<b>(.+)<\\/b>/;

GREEDY.exec(HTML)[1];
// Returns: 'bold</b> text <b>more bold'
// Greedy .+ consumed '<b>' in the middle!
// Match: <b>bold</b> text <b>more bold</b>
// ↑ entire string, not first tag!`,
      good: `// ✅ Lazy quantifier matches minimum:
const LAZY = /<b>(.+?)<\\/b>/g;
// .+? stops at FIRST </b> found

let m;
while ((m = LAZY.exec(HTML)) !== null) {
  console.log(m[1]);
}
// 'bold'      ← first match ✓
// 'more bold' ← second match ✓

// Better yet: don't parse HTML with regex!
// Use DOMParser:
const doc = new DOMParser().parseFromString(HTML, 'text/html');
const bolds = [...doc.querySelectorAll('b')].map(el => el.textContent);`,
    },
  ]
  const badge = (s: string) => s === "CRITICAL" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-orange-500/20 text-orange-400 border-orange-500/30"
  const border = (s: string) => s === "CRITICAL" ? "border-red-500/20 hover:border-red-500/40" : "border-orange-500/20 hover:border-orange-500/40"
  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-4">
        <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed"><strong className="text-white">ReDoS is not theoretical</strong> — it has taken down production services including Cloudflare, Stack Overflow, and many npm packages. Never run untrusted regex patterns in your app.</p>
      </div>
      {pitfalls.map(p => (
        <motion.div key={p.id} layout className={cn("glass rounded-[24px] border overflow-hidden transition-colors", border(p.severity))}>
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0", badge(p.severity))}>{p.severity}</span>
            <div className="flex-1"><h3 className="text-sm font-bold mb-1">{p.title}</h3><p className="text-[12px] text-gray-500 leading-relaxed">{p.summary}</p></div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform", expanded === p.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 pt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Vulnerable</p><pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{p.bad}</pre></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Safe</p><pre className="bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">{p.good}</pre></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
