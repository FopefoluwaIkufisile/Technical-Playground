"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Shield, Key, Smartphone, Fingerprint, Lock, AlertTriangle, EyeOff, MapPin, TabletSmartphone, CheckCircle2, RotateCcw, MonitorSmartphone, XCircle
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "factors" | "forms" | "vulnerabilities" | "simulator"

const TABS: { id: Tab; label: string }[] = [
  { id: "factors", label: "Auth Factors" },
  { id: "forms", label: "MFA Forms" },
  { id: "vulnerabilities", label: "Vulnerabilities" },
  { id: "simulator", label: "📱 Simulator" },
]

export default function MFAPage() {
  const [tab, setTab] = useState<Tab>("factors")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-rose-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-3 h-3" /> MFA · Security
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-rose-400 bg-clip-text text-transparent">
            MFA Shield
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            Multi-Factor Authentication (MFA) explained: what you know, what you have, and who you are. Understand common implementations and deep-dive into critical vulnerabilities like OTP leakage and insecure coding.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "factors" && <FactorsTab />}
            {tab === "forms" && <FormsTab />}
            {tab === "vulnerabilities" && <VulnerabilitiesTab />}
            {tab === "simulator" && <SimulatorTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/* ════════ FACTORS ════════ */
function FactorsTab() {
  const factors = [
    {
      id: "knowledge",
      title: "What You Know",
      subtitle: "Knowledge Factor",
      icon: <Key className="w-6 h-6" />,
      color: "blue",
      desc: "Information that theoretically only the user should know. The most common and oldest form of authentication.",
      examples: ["Passwords & Passphrases", "PIN numbers (Personal Identification Number)", "Answers to security questions (e.g., 'Mother's maiden name')"]
    },
    {
      id: "possession",
      title: "What You Have",
      subtitle: "Possession Factor",
      icon: <Smartphone className="w-6 h-6" />,
      color: "emerald",
      desc: "A physical or digital item in the user's possession. Often used as the second factor in a 2FA workflow.",
      examples: ["Mobile phone (for SMS or Authenticator apps)", "Hardware tokens (YubiKey, RSA SecurID)", "Smart cards or employee badges"]
    },
    {
      id: "inherence",
      title: "Who You Are",
      subtitle: "Inherence Factor",
      icon: <Fingerprint className="w-6 h-6" />,
      color: "violet",
      desc: "Biometric characteristics unique to the individual. Extremely hard to forge but also impossible to change if compromised.",
      examples: ["Fingerprint scans", "Facial recognition (FaceID)", "Iris or retina scans", "Voice recognition"]
    },
    {
      id: "location",
      title: "Where You Are",
      subtitle: "Location & Context",
      icon: <MapPin className="w-6 h-6" />,
      color: "amber",
      desc: "Sometimes considered a fourth factor. Uses contextual data to permit or block access based on usual behavior.",
      examples: ["GPS location data", "Recognized IP addresses", "Time of day (e.g., restricting access outside business hours)", "Trusted devices (MAC addresses)"]
    }
  ]

  const colorCls: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400"
  }

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
          Multi-Factor Authentication (MFA) requires users to provide two or more verification factors to gain access to a resource. True MFA must combine factors from <strong className="text-white">different categories</strong>. Using two passwords is NOT multi-factor (it's double single-factor). Combining a password (knowledge) with a phone notification (possession) is true MFA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {factors.map(f => (
          <div key={f.id} className={cn("glass p-8 rounded-[32px] border space-y-5 transition-transform hover:scale-[1.01]", colorCls[f.color].replace("text-", "border-").replace("20", "10").replace("bg-", "hover:bg-").replace("10", "5"))}>
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl border", colorCls[f.color])}>{f.icon}</div>
              <div>
                <p className={cn("text-[9px] font-black uppercase tracking-widest", colorCls[f.color].split(" ")[2])}>{f.subtitle}</p>
                <h2 className="text-2xl font-black text-white">{f.title}</h2>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            <div className="space-y-2 pt-2 border-t border-white/5">
              {f.examples.map((ex, i) => (
                <div key={i} className="flex flex-start gap-2 items-center text-xs text-gray-300">
                  <div className={cn("w-1 h-1 rounded-full", colorCls[f.color].split(" ")[2].replace("text", "bg"))} />
                  <span>{ex}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════ FORMS ════════ */
function FormsTab() {
  const forms = [
    {
      id: "totp",
      title: "Authenticator Apps (TOTP)",
      security: "High",
      securityColor: "text-emerald-400",
      desc: "Time-based One-Time Passwords. A shared secret seed is generated initially. Both the server and the app use the current time (+ seed) to generate the same 6-digit code every 30 seconds.",
      pros: ["Works offline", "No cellular network needed", "Relatively phishing-resistant"],
      cons: ["Can be stolen via malware/screencapture on the device", "Inconvenient if phone is lost"]
    },
    {
      id: "sms",
      title: "SMS / Text Message",
      security: "Low",
      securityColor: "text-red-400",
      desc: "A one-time code is sent to the user's registered phone number via the SS7 telecom network. Previously the standard, now frowned upon by security professionals.",
      pros: ["Zero setup required", "Extremely familiar to almost all users"],
      cons: ["Vulnerable to SIM swapping attacks", "SS7 network is fundamentally interceptable", "Messages can be viewed on locked screens"]
    },
    {
      id: "push",
      title: "Push Notifications",
      security: "Medium",
      securityColor: "text-amber-400",
      desc: "A prompt is sent to a trusted device asking 'Is this you?'. User simply taps 'Approve' or 'Deny'. Often includes context like location or device OS.",
      pros: ["Frictionless user experience", "No typing codes needed"],
      cons: ["MFA Fatigue attacks (attacker spams requests until user accidentally taps 'Approve')", "Requires internet connection on device"]
    },
    {
      id: "fido",
      title: "Hardware Security Keys (WebAuthn / FIDO2)",
      security: "Very High",
      securityColor: "text-blue-400",
      desc: "Physical devices like YubiKeys that use public key cryptography. Browser challenges the key, and the key signs the challenge if the origin matches.",
      pros: ["Completely immune to phishing (origin binding)", "Cannot be intercepted over the network"],
      cons: ["Cost upfront for physical hardware", "Risk of losing the physical key"]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forms.map(form => (
          <div key={form.id} className="glass p-8 rounded-[32px] border-white/5 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-black text-white">{form.title}</h3>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Security Level</span>
                <span className={cn("text-xs font-black uppercase tracking-wider", form.securityColor)}>{form.security}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed bg-white/5 p-4 rounded-2xl">{form.desc}</p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Strengths</span>
                <ul className="space-y-1.5">
                  {form.pros.map((pro, i) => (
                    <li key={i} className="text-[11px] text-gray-400 flex items-start gap-1.5 leading-snug">
                       <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                       <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Weaknesses</span>
                <ul className="space-y-1.5">
                  {form.cons.map((con, i) => (
                    <li key={i} className="text-[11px] text-gray-400 flex items-start gap-1.5 leading-snug">
                       <XCircle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                       <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════ VULNERABILITIES ════════ */
function VulnerabilitiesTab() {
  const [activeVuln, setActiveVuln] = useState("otp-leak")
  
  const vulns = [
    {
      id: "otp-leak",
      name: "OTP Leakage",
      color: "red",
      desc: "Information disclosure where the backend accidentally reflects the generated OTP code back to the client in the API response. The attacker requests an OTP for a victim, reads the response packet, and uses the code immediately without needing the victim's device.",
      code: `// ❌ INSECURE: Returning the OTP in the API response 
app.post("/api/mfa/send", (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  sendSms(req.user.phone, otp);
  
  // VULNERABILITY: Code is leaked to the client!
  return res.json({ 
    success: true, 
    msg: "Code sent", 
    debug_otp: otp // Attacker sees this in network tab
  }); 
});`,
      fix: `// ✅ SECURE: Only send a success boolean, store OTP in DB/Cache
app.post("/api/mfa/send", (req, res) => {
  const otp = generateSecureRandom();
  redis.setex(\`otp:\${req.user.id}\`, 300, otp); // Expires in 5m
  sendSms(req.user.phone, otp);
  
  return res.json({ success: true, msg: "Code sent" });
});`
    },
    {
      id: "insecure-coding",
      name: "Insecure Code Logic",
      color: "amber",
      desc: "Flaws in the MFA validation logic backend. Often involves not validating the session properly, allowing attackers to replay old OTPs, brute-force OTPs (no rate limiting), or simply bypassing the MFA step entirely by manually navigating to authenticated routes.",
      code: `// ❌ INSECURE MFA Validation
app.post("/api/mfa/verify", (req, res) => {
  const { otp, userId } = req.body;
  const storedOtp = db.get("otp", userId);
  
  if (otp === storedOtp) {
    // VULNERABILITIES:
    // 1. We didn't clear the OTP after use (Replay Attack)
    // 2. We trust the userId from the client body (IDOR)
    // 3. No brute-force protection
    return res.json({ token: generateJWT(userId) });
  }
});`,
      fix: `// ✅ SECURE Validation
app.post("/api/mfa/verify", (req, res) => {
  // Use session/cookie, don't trust client IDs
  const session = getSession(req); 
  rateLimiter.consume(session.userId); // Prevents brute-forcing
  
  const isValid = verifyOTP(session.userId, req.body.otp);
  if (isValid) {
    db.deleteOTP(session.userId); // Invalidate immediately
    session.mfa_verified = true;
    return res.json({ success: true });
  }
});`
    },
    {
      id: "autologout",
      name: "Lack of Auto-Logout",
      color: "violet",
      desc: "Failing to automatically terminate idle sessions or enforce strict re-authentication for sensitive actions. If a session is left open or an attacker hijacks a valid session cookie, the MFA barrier is completely bypassed since the session was already verified.",
      code: `// ❌ INSECURE: Infinite Sessions
const session = {
  id: "sess_123",
  user: "admin",
  mfa_passed: true,
  // No expiration. Session remains valid forever unless
  // the user explicitly clicks "Logout".
}

// Sensitive action with no re-auth
app.post("/api/transfer-funds", (req, res) => {
  if (req.session.mfa_passed) {
     doTransfer(); // Attacker accessing an unlocked PC can do this
  }
});`,
      fix: `// ✅ SECURE: Timeouts and Step-up Auth
const session = {
  mfa_passed: true,
  expires_at: Date.now() + 15 * 60 * 1000, // 15 min idle timeout
}

app.post("/api/transfer-funds", (req, res) => {
  // Step-up Auth: Demand a fresh MFA code for critical actions
  // regardless of existing session state.
  if (!req.body.fresh_otp || !verifySecure(req.body.fresh_otp)) {
    return res.status(401).json({ error: "Re-auth required" });
  }
  doTransfer();
});`
    }
  ]

  const active = vulns.find(v => v.id === activeVuln)!
  const colorMap: Record<string, string> = { 
    red: "text-red-400 bg-red-500/5 border-red-500/20", 
    amber: "text-amber-400 bg-amber-500/5 border-amber-500/20", 
    violet: "text-violet-400 bg-violet-500/5 border-violet-500/20" 
  }
  const c = colorMap[active.color]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {vulns.map(v => (
          <button key={v.id} onClick={() => setActiveVuln(v.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold border transition-all",
            activeVuln === v.id ? colorMap[v.color] : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
          )}>{v.name}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeVuln} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
            <div className="flex items-center gap-3">
               <AlertTriangle className={cn("w-5 h-5", c.split(" ")[0])} />
               <h2 className="text-xl font-black">{active.name}</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pb-4">{active.desc}</p>
            
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Vulnerable Implementation</span>
              <pre className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-[11px] font-mono whitespace-pre-wrap text-red-200">
                {active.code}
              </pre>
            </div>
          </div>
          <div className="glass p-6 rounded-[32px] border-emerald-500/10 bg-emerald-500/5 space-y-4">
            <h2 className="text-xl font-black text-emerald-400 pt-1">Secure Remediation</h2>
            <p className="text-sm text-emerald-400/80 leading-relaxed pb-4">
              Proper implementation enforces server-side limits, strips debug data from production APIs, and explicitly invalidates sensitive tokens.
            </p>
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Patched Implementation</span>
              <pre className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-[11px] font-mono whitespace-pre-wrap text-emerald-200">
                {active.fix}
              </pre>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ════════ SIMULATOR ════════ */
function SimulatorTab() {
  const [step, setStep] = useState<"login" | "mfa" | "success">("login")
  const [mfaCode, setMfaCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("---")
  const [error, setError] = useState(false)
  const [isLeaked, setIsLeaked] = useState(false)

  const handleLogin = () => {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedCode(code)
    setStep("mfa")
  }

  const verifyMfa = () => {
    if (mfaCode === generatedCode) {
      setStep("success")
      setError(false)
    } else {
      setError(true)
    }
  }

  const reset = () => {
    setStep("login")
    setMfaCode("")
    setGeneratedCode("---")
    setError(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto py-8">
      {/* Desktop App View */}
      <div className="glass p-8 rounded-[36px] border-white/5 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500 opacity-50" />
        
        <div className="flex items-center gap-3 border-b border-white/10 pb-6">
          <MonitorSmartphone className="w-6 h-6 text-rose-400" />
          <h2 className="text-xl font-black">Secure Portal</h2>
        </div>

        <div className="min-h-[250px] flex flex-col justify-center">
          {step === "login" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">Username</label>
                <input disabled value="admin@system.local" className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm font-mono text-gray-400 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">Password</label>
                <input type="password" disabled value="••••••••••••" className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm font-mono text-gray-400 focus:outline-none" />
              </div>
              <button onClick={handleLogin} className="w-full py-3.5 rounded-xl bg-white text-black font-black text-sm transition-all hover:bg-gray-200 mt-2">
                Log In
              </button>
            </motion.div>
          )}

          {step === "mfa" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
              <Shield className="w-12 h-12 text-rose-400 mx-auto" />
              <div>
                <h3 className="text-lg font-bold">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-400 mt-1">Enter the 6-digit code sent to your device.</p>
              </div>
              
              <div className="space-y-2 mt-4">
                <input 
                  type="text" 
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => { setMfaCode(e.target.value); setError(false); }}
                  placeholder="000000"
                  className={cn("w-32 mx-auto text-center bg-black/50 border px-4 py-3 rounded-xl text-2xl tracking-[0.2em] font-mono focus:outline-none focus:border-rose-500/50 transition-colors", error ? "border-red-500 text-red-400" : "border-white/10 text-white")}
                />
                <AnimatePresence>
                  {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-400 uppercase font-black tracking-widest mt-2">Invalid Code</motion.p>}
                </AnimatePresence>
              </div>

              <button onClick={verifyMfa} className="w-full py-3.5 rounded-xl bg-rose-600 text-white font-black text-sm transition-all hover:bg-rose-500">
                Verify Identity
              </button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                 <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-emerald-400">Authenticated</h3>
                <p className="text-sm text-gray-400 mt-2">Welcome to your secure dashboard.</p>
              </div>
              <button onClick={reset} className="flex items-center justify-center gap-2 mx-auto text-xs text-gray-500 hover:text-white transition-colors">
                 <RotateCcw className="w-3 h-3" /> Start Over
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Attacker View / Phone View */}
      <div className="space-y-6">
        {step !== "success" && (
          <div className="glass p-6 rounded-[32px] border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center space-y-4">
             <div className="flex items-center gap-2 self-start pb-4 border-b border-emerald-500/10 w-full text-emerald-400">
               <Smartphone className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Trusted Device</span>
             </div>
             
             {step === "login" ? (
               <div className="flex flex-col items-center justify-center h-32 opacity-30 gap-2">
                 <EyeOff className="w-8 h-8" />
                 <p className="text-[10px] font-bold uppercase tracking-wider">Awaiting Auth Request</p>
               </div>
             ) : (
               <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full">
                 <div className="bg-[#111] p-5 rounded-2xl border border-emerald-500/30 text-center shadow-2xl shadow-emerald-900/20">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Your Login Code Is</p>
                    <p className="text-4xl font-mono tracking-[0.2em] text-white">{generatedCode}</p>
                 </div>
               </motion.div>
             )}
          </div>
        )}

        {/* Network Sniffer Panel to demo OTP Leakage */}
        <div className="glass p-6 rounded-[32px] border-red-500/20 bg-red-500/5 space-y-4 relative overflow-hidden group">
          <div className="flex justify-between items-center pb-4 border-b border-red-500/10">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Network Inspector</span>
            </div>
            <button onClick={() => setIsLeaked(!isLeaked)} className={cn("text-[9px] px-2 py-1 rounded border font-black uppercase tracking-wider transition-colors", isLeaked ? "bg-red-500 text-white border-red-400" : "bg-transparent text-red-500 border-red-500/30 hover:bg-red-500/10")}>
              Toggle Vulnerability
            </button>
          </div>
          
          <div className="h-32 bg-black/40 p-4 rounded-xl font-mono text-[10px] overflow-auto border border-red-500/10">
             {step === "login" && <span className="text-gray-600">Waiting for network traffic...</span>}
             {step === "mfa" && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                 <p className="text-blue-400">POST /api/mfa/send HTTP/1.1</p>
                 <p className="text-emerald-400">HTTP/1.1 200 OK</p>
                 <p className="text-white">{"{"}</p>
                 <p className="pl-4 text-gray-300">"success": true,</p>
                 <p className="pl-4 text-gray-300">"message": "SMS sent to device."</p>
                 
                 <AnimatePresence>
                   {isLeaked && (
                     <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pl-4 text-red-400 font-bold bg-red-400/10 rounded px-1 -ml-1">
                        "debug_otp": "{generatedCode}" // VULNERABILITY!
                     </motion.p>
                   )}
                 </AnimatePresence>
                 
                 <p className="text-white">{"}"}</p>
                 
                 {isLeaked && <p className="mt-2 text-red-400 animate-pulse">// Attacker can now read the OTP without the device!</p>}
               </motion.div>
             )}
             {step === "success" && <p className="text-emerald-400">POST /api/mfa/verify ✔ 200 OK</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
