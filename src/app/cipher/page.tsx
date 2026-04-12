"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Lock, Key, Hash, Shield, ShieldAlert, ChevronRight,
  Info, CheckCircle2, AlertTriangle, RefreshCw, Zap, Eye, EyeOff,
  Binary, Copy
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "overview" | "symmetric" | "asymmetric" | "hashing" | "modern"

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "symmetric", label: "Symmetric (AES)" },
  { id: "asymmetric", label: "Asymmetric (RSA)" },
  { id: "hashing", label: "Hashing" },
  { id: "modern", label: "Modern Crypto" },
]

export default function CipherPage() {
  const [tab, setTab] = useState<Tab>("overview")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-emerald-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Lock className="w-3 h-3" /> Cryptography · Applied Security
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-emerald-400 bg-clip-text text-transparent">
            Cipher
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            The cryptographic primitives that secure the internet — AES, RSA, elliptic curves, hashing, and how they combine to protect every HTTPS connection you make.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "overview" && <OverviewTab />}
            {tab === "symmetric" && <SymmetricTab />}
            {tab === "asymmetric" && <AsymmetricTab />}
            {tab === "hashing" && <HashingTab />}
            {tab === "modern" && <ModernTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/* ════════ OVERVIEW ════════ */
function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Lock className="w-5 h-5" /></div>
            <h2 className="text-xl font-black">Cryptographic Primitives</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Every time you see a padlock in your browser, cryptography is working to keep your data safe. Modern cryptography uses three fundamental building blocks: <span className="text-emerald-400 font-semibold">symmetric encryption</span>, <span className="text-blue-400 font-semibold">asymmetric encryption</span>, and <span className="text-violet-400 font-semibold">cryptographic hashing</span>.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            These aren&apos;t used in isolation. TLS (HTTPS) uses all three: RSA/ECDH to exchange a secret, AES to encrypt the actual data, and HMAC-SHA256 to verify integrity. Understanding each piece reveals how the larger system works.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { name: "Symmetric Encryption", desc: "Same key for encrypt and decrypt. Fast. Used for bulk data.", eg: "AES-256-GCM, ChaCha20", color: "emerald" },
              { name: "Asymmetric Encryption", desc: "Public key encrypts, private key decrypts. Solves key distribution.", eg: "RSA-2048, RSA-4096", color: "blue" },
              { name: "Cryptographic Hashing", desc: "One-way transformation. Same input → same hash. Cannot reverse.", eg: "SHA-256, SHA-3, bcrypt", color: "violet" },
              { name: "Key Exchange", desc: "Establish shared secret over insecure channel. No key transmission.", eg: "ECDH, Diffie-Hellman", color: "amber" },
            ].map(item => (
              <div key={item.name} className={cn("p-4 rounded-2xl border",
                item.color === "emerald" ? "bg-emerald-500/5 border-emerald-500/20" :
                item.color === "blue" ? "bg-blue-500/5 border-blue-500/20" :
                item.color === "violet" ? "bg-violet-500/5 border-violet-500/20" :
                "bg-amber-500/5 border-amber-500/20"
              )}>
                <div className="flex justify-between items-start">
                  <p className={cn("text-[11px] font-black uppercase tracking-widest", item.color === "emerald" ? "text-emerald-400" : item.color === "blue" ? "text-blue-400" : item.color === "violet" ? "text-violet-400" : "text-amber-400")}>{item.name}</p>
                  <code className="text-[9px] text-gray-600">{item.eg}</code>
                </div>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">How TLS 1.3 Uses All Three</h3>
            <div className="space-y-2">
              {[
                { step: 1, label: "Key Exchange", desc: "Client and server use ECDH to derive a shared secret. Zero private key transmission.", color: "blue" },
                { step: 2, label: "Authentication", desc: "Server sends certificate with RSA/ECDSA signature. Client verifies the server is genuine.", color: "violet" },
                { step: 3, label: "Session Encryption", desc: "All data encrypted with AES-256-GCM using the shared ECDH secret. Fast symmetric crypto.", color: "emerald" },
                { step: 4, label: "Integrity", desc: "HMAC-SHA-256 appended to every message. Any tampering is immediately detectable.", color: "amber" },
              ].map(s => (
                <div key={s.step} className="flex gap-3 items-start">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5",
                    s.color === "blue" ? "bg-blue-500/20 text-blue-400" : s.color === "violet" ? "bg-violet-500/20 text-violet-400" :
                    s.color === "emerald" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                  )}>{s.step}</div>
                  <div>
                    <p className="text-sm font-bold">{s.label}</p>
                    <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-6 rounded-[24px] border-emerald-500/10 bg-emerald-500/5 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Key Insight: The Hybrid Approach</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Asymmetric crypto (RSA/ECDH) is used to <strong className="text-white">establish a shared key</strong>, then symmetric crypto (AES) encrypts the actual data. This is because RSA is ~1000x slower than AES for bulk data — so you only use RSA for key exchange, then switch to AES.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════ SYMMETRIC ════════ */
function SymmetricTab() {
  const [showKey, setShowKey] = useState(false)
  const [plaintext, setPlaintext] = useState("HELLO WORLD")
  const [phase, setPhase] = useState(-1)
  const [running, setRunning] = useState(false)

  const AES_ROUNDS = [
    { name: "KeyExpansion", desc: "Derive 11 round keys from the 128-bit secret key using the AES key schedule (Rijndael key schedule). Each round uses a different subkey." },
    { name: "AddRoundKey", desc: "XOR the 4×4 byte state matrix with the first round key. This \"seeds\" the state with the secret before any transformations." },
    { name: "SubBytes", desc: "Replace each byte with its value from the AES S-Box (a non-linear substitution table). This provides confusion — obscures relationship between key and ciphertext." },
    { name: "ShiftRows", desc: "Cyclically shift each row of the state matrix by different offsets (0,1,2,3). Spreads bytes across columns — provides diffusion." },
    { name: "MixColumns", desc: "Multiply each column by a fixed matrix in GF(2^8). Mixes bytes within columns — ensures avalanche effect. Skipped in final round." },
    { name: "AddRoundKey", desc: "XOR state with the current round key. Repeat SubBytes→ShiftRows→MixColumns→AddRoundKey for 9 rounds (10 for AES-128), then final round without MixColumns." },
  ]

  const run = async () => {
    if (running) return
    setRunning(true)
    for (let i = 0; i < AES_ROUNDS.length; i++) {
      setPhase(i)
      await new Promise(r => setTimeout(r, 1100))
    }
    setRunning(false)
    setPhase(-1)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h2 className="text-xl font-black text-emerald-400">Symmetric Encryption (AES)</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            <strong className="text-white">Advanced Encryption Standard (AES)</strong> is the gold standard for symmetric encryption. One key is shared between sender and receiver. AES is a <em>block cipher</em> — it processes data in 128-bit (16-byte) blocks.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Key Size", values: ["128 bits (10 rounds)", "192 bits (12 rounds)", "256 bits (14 rounds)"], color: "emerald" },
              { label: "Block Size", values: ["Fixed: 128 bits (16 bytes)", "Padding added for smaller data", "Larger data = chained blocks"], color: "blue" },
            ].map(item => (
              <div key={item.label} className={cn("p-4 rounded-2xl border space-y-1.5",
                item.color === "emerald" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-blue-500/5 border-blue-500/20"
              )}>
                <p className={cn("text-[10px] font-black uppercase", item.color === "emerald" ? "text-emerald-400" : "text-blue-400")}>{item.label}</p>
                {item.values.map(v => <p key={v} className="text-[11px] text-gray-500">{v}</p>)}
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">AES-256-GCM Encryption</p>
              <button onClick={() => setShowKey(!showKey)} className="text-[10px] text-gray-600 hover:text-white transition-colors flex items-center gap-1">
                {showKey ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {showKey ? "Hide" : "Show"} key
              </button>
            </div>
            <div className="font-mono text-xs space-y-1.5">
              <p><span className="text-gray-600">plaintext: </span><span className="text-white">&quot;{plaintext}&quot;</span></p>
              <p><span className="text-gray-600">key:       </span><span className={showKey ? "text-emerald-400" : "text-gray-700"}>{showKey ? "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" : "••••••••••••••••••••••••••••••••"}</span></p>
              <p><span className="text-gray-600">iv/nonce:  </span><span className="text-violet-400">3f8a1b2c4d5e6f7a</span> <span className="text-gray-700">(random, 96-bit)</span></p>
              <p><span className="text-gray-600">ciphertext:</span><span className="text-amber-400">8a3f1b9c2d4e5f6a7b8c9d0e1f2a3b4c...</span></p>
              <p><span className="text-gray-600">auth_tag:  </span><span className="text-rose-400">1a2b3c4d5e6f7a8b</span> <span className="text-gray-700">(GCM integrity)</span></p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-[12px] text-amber-300/70 leading-relaxed">Never reuse IV/nonces! Each encryption must use a fresh random nonce. Reusing nonces with AES-GCM completely breaks both confidentiality and integrity.</p>
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black">AES Round Simulation</h3>
            <button onClick={run} disabled={running} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[11px] font-black transition-all">
              {running ? "Running..." : "▶ Simulate"}
            </button>
          </div>
          <div className="space-y-2">
            {AES_ROUNDS.map((r, i) => (
              <motion.div key={r.name + i} animate={{ opacity: running ? (phase === i ? 1 : phase > i ? 0.7 : 0.3) : 1 }}
                className={cn("p-4 rounded-2xl border transition-all duration-500 flex gap-3",
                  phase === i ? "bg-emerald-500/15 border-emerald-500/40" : "bg-white/3 border-white/5"
                )}>
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                  phase > i ? "bg-emerald-500 text-white" : phase === i ? "bg-emerald-500/30 text-emerald-400 animate-pulse" : "bg-white/5 text-gray-700"
                )}>{phase > i ? "✓" : i + 1}</div>
                <div>
                  <p className={cn("text-[11px] font-black", phase === i ? "text-emerald-400" : "text-gray-400")}>{r.name}</p>
                  <p className="text-[10px] text-gray-600 leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Block Cipher Modes of Operation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { mode: "ECB", name: "Electronic Codebook", desc: "Each block encrypted independently with same key. NEVER USE — identical plaintext blocks produce identical ciphertext. The 'ECB penguin' attack.", danger: true, use: "❌ Never use" },
            { mode: "CBC", name: "Cipher Block Chaining", desc: "XOR plaintext with previous ciphertext block before encrypting. Requires IV. No parallelism. Vulnerable to padding oracle attacks if not implemented carefully.", danger: false, use: "Legacy TLS (avoid if possible)" },
            { mode: "CTR", name: "Counter Mode", desc: "Turns block cipher into stream cipher. Encrypt counter values, XOR with plaintext. Parallelizable. Do NOT reuse counter values.", danger: false, use: "High-performance encryption" },
            { mode: "GCM", name: "Galois/Counter Mode", desc: "CTR mode + GHASH authentication. Provides both confidentiality AND integrity (AEAD). The current gold standard. Requires unique 96-bit nonce.", danger: false, use: "✅ TLS 1.3, modern default" },
          ].map(m => (
            <div key={m.mode} className={cn("p-5 rounded-2xl border space-y-2", m.danger ? "bg-red-500/5 border-red-500/20" : "bg-emerald-500/5 border-emerald-500/10")}>
              <div className="flex justify-between items-start">
                <code className={cn("text-sm font-black", m.danger ? "text-red-400" : "text-emerald-400")}>{m.mode}</code>
                {m.danger && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
              </div>
              <p className="text-[10px] font-bold text-white">{m.name}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{m.desc}</p>
              <p className={cn("text-[10px] font-bold", m.danger ? "text-red-400" : "text-emerald-400")}>{m.use}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════ ASYMMETRIC ════════ */
function AsymmetricTab() {
  const [showPrivate, setShowPrivate] = useState(false)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h2 className="text-xl font-black text-blue-400">Asymmetric Encryption (RSA)</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            RSA uses a <strong className="text-white">mathematically linked key pair</strong>: a public key that anyone can have, and a private key that only the owner holds. Data encrypted with the public key can only be decrypted with the private key, and vice versa.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            The security of RSA relies on the <strong className="text-white">integer factorization problem</strong>: it&apos;s easy to multiply two huge prime numbers together, but computationally infeasible to factor the product back into those primes. A 2048-bit RSA key would take all computers on Earth billions of years to break.
          </p>
          <div className="bg-black/40 p-5 rounded-2xl border border-blue-500/10 font-mono text-xs leading-7">
            <p className="text-gray-600">// RSA key generation (simplified):</p>
            <p><span className="text-blue-400">p, q</span> = two_large_random_primes()   <span className="text-gray-600">// e.g., 512-bit each</span></p>
            <p><span className="text-blue-400">n</span> = p × q                          <span className="text-gray-600">// modulus (public)</span></p>
            <p><span className="text-blue-400">e</span> = 65537                           <span className="text-gray-600">// public exponent</span></p>
            <p><span className="text-violet-400">d</span> = modular_inverse(e, φ(n))       <span className="text-gray-600">// private exponent</span></p>
            <div className="mt-3 pt-3 border-t border-white/5">
              <p><span className="text-emerald-400">Public  Key</span> = {'{'}<span className="text-blue-400">n</span>, <span className="text-blue-400">e</span>{'}'} <span className="text-gray-600">← share freely</span></p>
              <p><span className="text-red-400">Private Key</span> = {'{'}<span className="text-violet-400">n</span>, <span className="text-violet-400">d</span>{'}'} <span className="text-gray-600">← never expose</span></p>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">The Two Uses of Asymmetric Crypto</h3>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
              <p className="text-blue-400 font-black text-sm">1. Encryption (Sender → Receiver)</p>
              <div className="font-mono text-[11px] space-y-1">
                <p className="text-gray-500">ciphertext = ENCRYPT(plaintext, <span className="text-emerald-400">recipient_PUBLIC_key</span>)</p>
                <p className="text-gray-500">plaintext  = DECRYPT(ciphertext, <span className="text-red-400">recipient_PRIVATE_key</span>)</p>
              </div>
              <p className="text-[12px] text-gray-400 leading-relaxed">Anyone can send encrypted messages using the public key. Only the private key holder can decrypt. This is how PGP email encryption and RSA key exchange work.</p>
            </div>
            <div className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/20 space-y-3">
              <p className="text-violet-400 font-black text-sm">2. Digital Signatures (Authenticity Proof)</p>
              <div className="font-mono text-[11px] space-y-1">
                <p className="text-gray-500">signature = SIGN(hash(message), <span className="text-red-400">sender_PRIVATE_key</span>)</p>
                <p className="text-gray-500">valid     = VERIFY(signature, <span className="text-emerald-400">sender_PUBLIC_key</span>)</p>
              </div>
              <p className="text-[12px] text-gray-400 leading-relaxed">The private key creates a signature only the owner could produce. Anyone with the public key can verify the signature — proving the message came from and wasn&apos;t modified by the owner. Used in TLS certificates, code signing, JWTs.</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex gap-3">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-[12px] text-amber-300/70 leading-relaxed">RSA is ~1000x slower than AES for the same data size. Never encrypt large data with RSA directly — use it to exchange an AES key, then use AES for the data (hybrid encryption).</p>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Elliptic Curve Cryptography (ECC) — Why RSA is Being Replaced</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-gray-600 font-black uppercase tracking-widest">Security Level</th>
                    <th className="text-left py-2 text-blue-400 font-black uppercase tracking-widest">RSA Key Size</th>
                    <th className="text-left py-2 text-emerald-400 font-black uppercase tracking-widest">ECC Key Size</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {[["80-bit", "1024-bit", "160-bit"], ["112-bit", "2048-bit", "224-bit"], ["128-bit", "3072-bit", "256-bit (P-256)"], ["192-bit", "7680-bit", "384-bit (P-384)"], ["256-bit", "15360-bit", "521-bit (P-521)"]].map(r => (
                    <tr key={r[0]} className="border-b border-white/5">
                      <td className="py-2 text-gray-500">{r[0]}</td>
                      <td className="py-2 text-blue-300">{r[1]}</td>
                      <td className="py-2 text-emerald-300">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-400 leading-relaxed">ECC provides the same cryptographic strength with <strong className="text-white">much smaller keys</strong>. A 256-bit ECC key (P-256) has the same security level as a 3072-bit RSA key.</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "Faster computation", desc: "Smaller keys → less math → faster handshakes", color: "emerald" },
                { label: "Less bandwidth", desc: "Smaller signatures → faster TLS connections", color: "blue" },
                { label: "Less battery power", desc: "Critical for mobile and IoT devices", color: "violet" },
                { label: "Common curves: P-256, P-384, Curve25519", desc: "Curve25519 is used in Signal, WireGuard, SSH", color: "amber" },
              ].map(i => (
                <div key={i.label} className="flex gap-2 p-3 rounded-xl bg-white/3 border border-white/5">
                  <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", i.color === "emerald" ? "text-emerald-400" : i.color === "blue" ? "text-blue-400" : i.color === "violet" ? "text-violet-400" : "text-amber-400")} />
                  <div><p className="text-[11px] font-bold">{i.label}</p><p className="text-[10px] text-gray-600">{i.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════ HASHING ════════ */
function HashingTab() {
  const [input, setInput] = useState("hello world")
  const [showDetail, setShowDetail] = useState("sha256")

  const SIMULATED_HASHES: Record<string, string> = {
    "hello world": {
      "sha256": "b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576f7f1e67a41d15b4",
      "sha512": "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f",
      "md5": "5eb63bbbe01eeed093cb22bb8f5acdc3",
    },
    "Hello World": {
      "sha256": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
      "sha512": "2c74fd17edafd80e8447b0d46741ee243b7eb74dd2149a0ab1b9246fb30382f27e853d8585719e0e67cbda0daa8f51671064615d645ae27acb15bfb1447f459b",
      "md5": "e59ff97941044f85df5297e1c302d260",
    }
  }

  const getHash = (algo: string) => SIMULATED_HASHES[input]?.[algo] ?? `[sha-${algo} of "${input.substring(0, 10)}..."]`

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h2 className="text-xl font-black text-violet-400">Cryptographic Hashing</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            A hash function takes arbitrary input and produces a fixed-length output (<strong className="text-white">digest</strong>). Cryptographic hash functions have additional properties: they&apos;re one-way (can&apos;t reverse), deterministic (same input → same hash), and exhibit the <strong className="text-white">avalanche effect</strong> — changing one bit completely changes the output.
          </p>
          <div className="space-y-3">
            <div className="flex gap-2">
              {["hello world", "Hello World"].map(v => (
                <button key={v} onClick={() => setInput(v)} className={cn("px-4 py-2 rounded-xl text-[10px] font-mono border transition-all",
                  input === v ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : "bg-white/5 border-white/10 text-gray-600 hover:text-white"
                )}>{v}</button>
              ))}
            </div>
            <div className="space-y-2">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <p className="text-[9px] text-gray-600 uppercase font-black mb-1">Input</p>
                <p className="font-mono text-sm text-white">&quot;{input}&quot;</p>
              </div>
              {["sha256", "sha512", "md5"].map(algo => (
                <div key={algo} className={cn("p-4 rounded-xl border", algo === "md5" ? "bg-red-500/5 border-red-500/20" : "bg-violet-500/5 border-violet-500/20")}>
                  <p className={cn("text-[9px] font-black uppercase mb-1", algo === "md5" ? "text-red-400" : "text-violet-400")}>{algo.toUpperCase()} Output</p>
                  <p className={cn("font-mono text-[10px] break-all", algo === "md5" ? "text-red-300" : "text-violet-300")}>{getHash(algo)}</p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
              <p className="text-[11px] text-violet-300/80 leading-relaxed">Notice: &quot;hello world&quot; vs &quot;Hello World&quot; — just one capital letter — produces a completely different SHA-256 hash. This is the avalanche effect.</p>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">4 Key Properties</h3>
          <div className="space-y-3">
            {[
              { name: "Pre-image Resistance", desc: "Given a hash H, it's computationally infeasible to find any input M such that hash(M) = H. You can't reverse a hash.", icon: <Lock className="w-4 h-4" />, color: "violet" },
              { name: "Second Pre-image Resistance", desc: "Given M1 and hash(M1), it's infeasible to find a different M2 where hash(M2) = hash(M1). Can't find a different input with the same hash.", icon: <RefreshCw className="w-4 h-4" />, color: "blue" },
              { name: "Collision Resistance", desc: "It's infeasible to find ANY two different inputs M1 ≠ M2 where hash(M1) = hash(M2). This is why MD5 is broken — collisions have been found.", icon: <ShieldAlert className="w-4 h-4" />, color: "red" },
              { name: "Avalanche Effect", desc: "A tiny change in input causes a completely different output (~50% of bits change). hash('A') and hash('B') share no recognizable relationship.", icon: <Zap className="w-4 h-4" />, color: "amber" },
            ].map(p => (
              <div key={p.name} className={cn("p-4 rounded-2xl border flex gap-3",
                p.color === "violet" ? "bg-violet-500/5 border-violet-500/20" :
                p.color === "blue" ? "bg-blue-500/5 border-blue-500/20" :
                p.color === "red" ? "bg-red-500/5 border-red-500/20" :
                "bg-amber-500/5 border-amber-500/20"
              )}>
                <span className={cn("shrink-0 mt-0.5", p.color === "violet" ? "text-violet-400" : p.color === "blue" ? "text-blue-400" : p.color === "red" ? "text-red-400" : "text-amber-400")}>{p.icon}</span>
                <div>
                  <p className="text-[11px] font-black mb-1">{p.name}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Password Hashing — Why SHA-256 is Wrong for Passwords</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2">
              <p className="text-red-400 font-black text-xs uppercase flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" />Wrong: SHA-256 for Passwords</p>
              <div className="font-mono text-[11px] text-gray-400 space-y-1">
                <p>hash = SHA256(&quot;password123&quot;)</p>
                <p className="text-gray-600">// GPU can compute ~10 BILLION SHA-256 per second</p>
                <p className="text-gray-600">// Entire rockyou.txt (~14M passwords) checked in 1.4ms!</p>
                <p className="text-gray-600">// SHA-256 is designed to be FAST — wrong for passwords</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <p className="text-emerald-400 font-black text-xs uppercase flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" />Correct: bcrypt / Argon2 / scrypt</p>
              <div className="font-mono text-[11px] text-gray-400 space-y-1">
                <p>hash = bcrypt(&quot;password123&quot;, cost=12)</p>
                <p className="text-gray-600">// bcrypt: ~250ms per hash (intentionally slow)</p>
                <p className="text-gray-600">// GPU: only ~20K bcrypt/sec (1000x harder to crack)</p>
                <p className="text-gray-600">// Built-in salt prevents rainbow table attacks</p>
                <p className="text-gray-600">// Cost factor is tunable as hardware improves</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-400 leading-relaxed">Password hashing algorithms are <strong className="text-white">deliberately slow</strong>. This is the opposite of what you normally want in crypto! The goal is to make brute-force attacks computationally expensive.</p>
            <div className="space-y-2">
              {[
                { algo: "bcrypt", year: "1999", notes: "Still widely used. Max 72-byte passwords. BCrypt-Ada. Cost factor = work.", recommended: true },
                { algo: "scrypt", year: "2009", notes: "Memory-hard. Resists GPU/ASIC attacks. Used in Litecoin, some password managers.", recommended: true },
                { algo: "Argon2id", year: "2015", notes: "PHC winner. Combines memory-hardness and time-hardness. Current recommendation.", recommended: true },
                { algo: "MD5/SHA-256", year: "1992-2001", notes: "Cryptographic hash, NOT password hash. Orders of magnitude too fast.", recommended: false },
              ].map(a => (
                <div key={a.algo} className={cn("flex gap-3 items-center p-3 rounded-xl border",
                  a.recommended ? "bg-emerald-500/5 border-emerald-500/15" : "bg-red-500/5 border-red-500/15"
                )}>
                  <code className={cn("text-[11px] font-black w-16 shrink-0", a.recommended ? "text-emerald-400" : "text-red-400")}>{a.algo}</code>
                  <p className="text-[11px] text-gray-500 flex-1">{a.notes}</p>
                  {!a.recommended && <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════ MODERN ════════ */
function ModernTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h2 className="text-xl font-black text-amber-400">Forward Secrecy & Key Exchange</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            <strong className="text-white">Perfect Forward Secrecy (PFS)</strong> means that even if the server&apos;s private key is compromised later, past recorded sessions cannot be decrypted. This is achieved by deriving a new, ephemeral key for each session.
          </p>
          <div className="bg-black/40 p-5 rounded-2xl border border-amber-500/10 font-mono text-xs leading-7">
            <p className="text-gray-600">// ECDH Key Exchange (used in TLS 1.3):</p>
            <p className="text-gray-600">// Both parties agree on a curve (e.g., X25519)</p>
            <p className="mt-2"><span className="text-blue-400">Alice: </span><span className="text-white">private_a = random()</span></p>
            <p><span className="text-blue-400">Alice: </span><span className="text-white">public_A = G × private_a</span> <span className="text-gray-600">(G = generator point)</span></p>
            <p className="mt-2"><span className="text-emerald-400">Bob:   </span><span className="text-white">private_b = random()</span></p>
            <p><span className="text-emerald-400">Bob:   </span><span className="text-white">public_B = G × private_b</span></p>
            <p className="mt-2 text-gray-600">// They exchange public keys over the network</p>
            <p><span className="text-blue-400">Alice: </span><span className="text-amber-400">shared = public_B × private_a</span></p>
            <p><span className="text-emerald-400">Bob:   </span><span className="text-amber-400">shared = public_A × private_b</span></p>
            <p className="text-gray-600">// Mathematically: G×a×b = G×b×a ✓</p>
            <p className="text-gray-600">// Neither transmitted the shared secret!</p>
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 space-y-5">
          <h2 className="text-xl font-black text-rose-400">Post-Quantum Cryptography</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            A sufficiently powerful quantum computer running <strong className="text-white">Shor&apos;s algorithm</strong> could factor RSA keys and solve the discrete log problem (breaking ECC) in polynomial time. This would break most current public-key cryptography.
          </p>
          <div className="space-y-3">
            {[
              { algo: "RSA / ECC", status: "Broken by quantum", detail: "Shor's algorithm solves factoring and discrete log in polynomial time on quantum hardware.", color: "red" },
              { algo: "AES-256", status: "Safe (weakened)", detail: "Grover's algorithm halves key security. AES-256 becomes ~AES-128 strength. Still secure.", color: "amber" },
              { algo: "SHA-256 / SHA-3", status: "Safe (weakened)", detail: "Grover's algorithm attacks. SHA-256 provides ~128-bit quantum security — sufficient.", color: "amber" },
              { algo: "CRYSTALS-Kyber", status: "Quantum-safe", detail: "NIST PQC standardized 2024. Lattice-based key encapsulation. Replacing RSA/ECDH.", color: "emerald" },
              { algo: "CRYSTALS-Dilithium", status: "Quantum-safe", detail: "NIST PQC digital signatures. Lattice-based. Replacing RSA/ECDSA for code signing.", color: "emerald" },
            ].map(a => (
              <div key={a.algo} className={cn("flex gap-3 p-3 rounded-xl border",
                a.color === "red" ? "bg-red-500/5 border-red-500/20" :
                a.color === "amber" ? "bg-amber-500/5 border-amber-500/20" :
                "bg-emerald-500/5 border-emerald-500/20"
              )}>
                <code className={cn("text-[11px] font-black w-36 shrink-0", a.color === "red" ? "text-red-400" : a.color === "amber" ? "text-amber-400" : "text-emerald-400")}>{a.algo}</code>
                <div>
                  <p className={cn("text-[10px] font-bold mb-0.5", a.color === "red" ? "text-red-400" : a.color === "amber" ? "text-amber-400" : "text-emerald-400")}>{a.status}</p>
                  <p className="text-[10px] text-gray-500">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
