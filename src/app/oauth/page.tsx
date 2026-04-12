"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Shield, Users, Globe, Server, Lock, Key, ArrowRight,
  ChevronRight, ShieldAlert, AlertTriangle, CheckCircle2, Copy,
  RefreshCw, Eye, Info, Zap, ExternalLink
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "actors" | "flow" | "concepts" | "vulnerabilities"

const TABS: { id: Tab; label: string }[] = [
  { id: "actors", label: "Actors" },
  { id: "flow", label: "Flow Simulator" },
  { id: "concepts", label: "Concepts" },
  { id: "vulnerabilities", label: "Vulnerabilities" },
]

export default function OAuthPage() {
  const [tab, setTab] = useState<Tab>("actors")
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-amber-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-3 h-3" /> OAuth 2.0 · RFC 6749
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-amber-400 bg-clip-text text-transparent">
            OAuth 2.0
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            The authorization framework that powers &quot;Login with Google&quot; — actors, flows, tokens, grant types, and attack vectors, all explained.
          </p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
              tab === t.id ? "bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200"
            )}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {tab === "actors" && <ActorsTab />}
            {tab === "flow" && <FlowTab />}
            {tab === "concepts" && <ConceptsTab />}
            {tab === "vulnerabilities" && <VulnerabilitiesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/* ════════════════════ ACTORS ════════════════════ */
function ActorsTab() {
  const actors = [
    {
      id: "owner",
      title: "Resource Owner",
      subtitle: "The User",
      icon: <Users className="w-8 h-8" />,
      color: "emerald",
      desc: "The human user who owns the data and must grant (or deny) access to it. The Resource Owner is the only one who decides what the Client is allowed to access.",
      examples: ["You, when you click 'Allow' on a permissions screen", "A company admin authorizing a third-party app"],
      responsibilities: ["Authenticates with the Authorization Server", "Reviews and grants the requested scopes", "Can revoke access at any time"],
    },
    {
      id: "client",
      title: "Client",
      subtitle: "The Application",
      icon: <Globe className="w-8 h-8" />,
      color: "blue",
      desc: "The application that wants to access the Resource Owner's data on their behalf. The Client must be registered with the Authorization Server before it can participate.",
      examples: ["A web app like bistro.thm wanting access to coffee.thm data", "A mobile app wanting your Google contacts", "A CLI tool accessing GitHub"],
      responsibilities: ["Initiates the OAuth flow", "Holds client_id (public) and client_secret (private)", "Exchanges authorization code for tokens", "Uses access token to call Resource Server"],
    },
    {
      id: "authserver",
      title: "Authorization Server",
      subtitle: "The Gatekeeper",
      icon: <Lock className="w-8 h-8" />,
      color: "violet",
      desc: "The trusted authority that authenticates the Resource Owner, verifies their consent, and issues tokens to the Client. This is often operated by the platform (Google, GitHub, etc.).",
      examples: ["Google OAuth (accounts.google.com)", "GitHub OAuth (github.com/login/oauth)", "coffee.thm/accounts/login in the bistro example"],
      responsibilities: ["Authenticates the Resource Owner", "Manages consent screens", "Issues authorization codes", "Exchanges codes for access + refresh tokens", "Validates tokens on resource server request"],
    },
    {
      id: "resourceserver",
      title: "Resource Server",
      subtitle: "The API",
      icon: <Server className="w-8 h-8" />,
      color: "rose",
      desc: "The API that hosts the protected resources (data). It accepts access tokens and returns the appropriate data. It trusts the Authorization Server to have validated the token.",
      examples: ["Google's People API (contacts data)", "GitHub API (/user/repos)", "coffee.thm's REST API"],
      responsibilities: ["Validates incoming access tokens", "Checks token scopes against requested resource", "Returns 401 if token is invalid/expired", "Returns protected data if token is valid"],
    },
  ]

  const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", icon: "bg-emerald-500/20 text-emerald-400" },
    blue: { bg: "bg-blue-500/5", border: "border-blue-500/20", text: "text-blue-400", icon: "bg-blue-500/20 text-blue-400" },
    violet: { bg: "bg-violet-500/5", border: "border-violet-500/20", text: "text-violet-400", icon: "bg-violet-500/20 text-violet-400" },
    rose: { bg: "bg-rose-500/5", border: "border-rose-500/20", text: "text-rose-400", icon: "bg-rose-500/20 text-rose-400" },
  }

  return (
    <div className="space-y-6">
      {/* Overview diagram */}
      <div className="glass p-6 rounded-[32px] border-white/5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4">OAuth 2.0 Trust Relationships</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
          {[
            { label: "Resource Owner", sub: "User", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
            { label: "→ authorizes →", color: "text-gray-700", bg: "", nobox: true },
            { label: "Client", sub: "App", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
            { label: "→ requests from →", color: "text-gray-700", bg: "", nobox: true },
            { label: "Authorization Server", sub: "Gatekeeper", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/30" },
            { label: "→ token used on →", color: "text-gray-700", bg: "", nobox: true },
            { label: "Resource Server", sub: "API", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30" },
          ].map((item, i) => item.nobox ? (
            <p key={i} className={`text-[11px] font-mono ${item.color} sm:mx-2 text-center`}>{item.label}</p>
          ) : (
            <div key={i} className={`px-5 py-3 rounded-2xl border text-center ${item.bg}`}>
              <p className={`text-[11px] font-black ${item.color}`}>{item.label}</p>
              {item.sub && <p className="text-[9px] text-gray-600 font-mono">{item.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {actors.map(a => {
          const c = colorMap[a.color]
          return (
            <div key={a.id} className={cn("glass p-7 rounded-[32px] border space-y-5", c.bg, c.border)}>
              <div className="flex items-start gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", c.icon)}>{a.icon}</div>
                <div>
                  <h3 className={cn("text-lg font-black", c.text)}>{a.title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">{a.subtitle}</p>
                </div>
              </div>
              <p className="text-[13px] text-gray-400 leading-relaxed">{a.desc}</p>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Real examples</p>
                <ul className="space-y-1">
                  {a.examples.map(e => <li key={e} className="text-[12px] text-gray-500 flex gap-2"><span className={c.text}>→</span>{e}</li>)}
                </ul>
              </div>
              <div className="space-y-2 pt-3 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Responsibilities</p>
                <ul className="space-y-1">
                  {a.responsibilities.map(r => <li key={r} className="text-[12px] text-gray-500 flex gap-2"><CheckCircle2 className={cn("w-3 h-3 shrink-0 mt-0.5", c.text)} />{r}</li>)}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════ FLOW SIMULATOR ════════════════════ */
const FLOW_STEPS = [
  {
    id: 1,
    title: "Client builds authorization URL",
    who: "Client App",
    whoColor: "blue",
    desc: "The Client constructs a URL and redirects the user's browser to the Authorization Server's /authorize endpoint. This URL contains everything the auth server needs to know about the request.",
    url: "http://coffee.thm:8000/accounts/login/?next=/o/authorize/%3Fclient_id%3DzlurqApp123%26response_type%3Dcode%26redirect_uri%3Dhttp%3A//bistro.thm%3A8000/oauthdemo/callback%26scope%3Dread%3Aprofile+email%26state%3DxyzSecure123",
    urlParts: [
      { label: "Base URL", value: "https://coffee.thm/o/authorize/", color: "text-gray-400" },
      { label: "client_id", value: "zlurqApp123", color: "text-amber-400" },
      { label: "response_type", value: "code", color: "text-blue-400" },
      { label: "redirect_uri", value: "https://bistro.thm/callback", color: "text-emerald-400" },
      { label: "scope", value: "read:profile email", color: "text-violet-400" },
      { label: "state", value: "xyzSecure123", color: "text-rose-400" },
    ],
    detail: "The state parameter is a random value generated by the client to prevent CSRF attacks. It must be validated when the authorization code arrives back. The redirect_uri must exactly match a URI pre-registered when the client was created.",
  },
  {
    id: 2,
    title: "Resource Owner authenticates",
    who: "Resource Owner (User)",
    whoColor: "emerald",
    desc: "The user's browser is redirected to the Authorization Server's login page. The user enters their credentials for that service (not the Client application — this is the key separation).",
    url: "https://coffee.thm/accounts/login/\n  → User submits credentials to coffee.thm's own login form\n  → coffee.thm validates against its own user database",
    urlParts: [],
    detail: "This is the crucial privacy benefit of OAuth: the Client app NEVER sees the user's password. The user is authenticating directly with the Authorization Server (coffee.thm), which the user already trusts.",
  },
  {
    id: 3,
    title: "Resource Owner grants consent",
    who: "Resource Owner (User)",
    whoColor: "emerald",
    desc: "After logging in, the user sees a consent screen listing exactly which permissions the Client is requesting. The user explicitly approves or denies.",
    url: 'Bistro App is requesting permission to:\n  ✓ View your coffee.thm profile\n  ✓ Read your email address\n\n  [ Allow Access ]   [ Deny ]',
    urlParts: [],
    detail: "Scopes define exactly what data/actions the Client can access. The user can often selectively grant or deny individual scopes. This principle of minimal permission is called the Principle of Least Privilege.",
  },
  {
    id: 4,
    title: "Authorization Code issued",
    who: "Authorization Server",
    whoColor: "violet",
    desc: "If the user approves, the Authorization Server redirects the browser back to the Client's redirect_uri with a short-lived, single-use authorization code.",
    url: "https://bistro.thm:8000/callback?code=AuthCode123456&state=xyzSecure123",
    urlParts: [
      { label: "redirect_uri", value: "https://bistro.thm/callback", color: "text-emerald-400" },
      { label: "code", value: "AuthCode123456", color: "text-amber-400" },
      { label: "state", value: "xyzSecure123", color: "text-rose-400" },
    ],
    detail: "The code is single-use and short-lived (typically 10 minutes). The client must immediately verify the state parameter matches what it sent in Step 1 — if not, abort (CSRF attack). The code itself is useless without the client_secret.",
  },
  {
    id: 5,
    title: "Client exchanges code for tokens",
    who: "Client App (Back-channel)",
    whoColor: "blue",
    desc: "The Client makes a server-to-server POST request to the Authorization Server's /token endpoint, trading the authorization code for access and refresh tokens. This happens on the server, never in the browser.",
    url: "POST https://coffee.thm/o/token/\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=authorization_code\n&code=AuthCode123456\n&client_id=zlurqApp123\n&client_secret=SUPER_SECRET_NEVER_IN_BROWSER\n&redirect_uri=https://bistro.thm/callback",
    urlParts: [
      { label: "grant_type", value: "authorization_code", color: "text-amber-400" },
      { label: "code", value: "AuthCode123456", color: "text-blue-400" },
      { label: "client_id", value: "zlurqApp123", color: "text-violet-400" },
      { label: "client_secret", value: "SUPER_SECRET_***", color: "text-rose-400" },
    ],
    detail: "The client_secret is the most sensitive credential in OAuth. It must NEVER appear in frontend JavaScript, mobile apps, or anywhere a user can extract it. Server-side only. This back-channel exchange is what makes the Authorization Code grant secure.",
  },
  {
    id: 6,
    title: "Authorization Server returns tokens",
    who: "Authorization Server",
    whoColor: "violet",
    desc: "The Authorization Server validates the code + client_secret combination and returns the access token, its expiry, and optionally a refresh token.",
    url: 'HTTP 200 OK\n{\n  "access_token": "eyJhbGciOiJSUzI1NiJ9...",\n  "token_type":   "Bearer",\n  "expires_in":   3600,\n  "refresh_token": "8xLOxBtZp8",\n  "scope": "read:profile email"\n}',
    urlParts: [
      { label: "access_token", value: "Short-lived (1hr). Used for API calls.", color: "text-amber-400" },
      { label: "refresh_token", value: "Long-lived. Get new access tokens without re-auth.", color: "text-emerald-400" },
      { label: "expires_in", value: "3600 seconds (1 hour)", color: "text-blue-400" },
      { label: "scope", value: "Confirmed granted scopes", color: "text-violet-400" },
    ],
    detail: "The access token is what the Client will use for all future API calls. The refresh token enables silent renewal. Some authorization servers return JWTs as access tokens; others return opaque random strings.",
  },
  {
    id: 7,
    title: "Client accesses Resource Server",
    who: "Client App",
    whoColor: "blue",
    desc: "The Client uses the access token to make authenticated API requests to the Resource Server. The token goes in the Authorization header.",
    url: "GET https://coffee.thm/api/user/profile\nAuthorization: Bearer eyJhbGciOiJSUzI1NiJ9...\n\nHTTP 200 OK\n{\n  \"id\": 42,\n  \"name\": \"Alice\",\n  \"email\": \"alice@coffee.thm\"\n}",
    urlParts: [],
    detail: "The Resource Server validates the access token — either by verifying the JWT signature locally, or by calling the Authorization Server's introspection endpoint. If valid, it checks that the token's scopes permit the requested action.",
  },
]

function FlowTab() {
  const [step, setStep] = useState(0)
  const current = FLOW_STEPS[step]
  const [copied, setCopied] = useState(false)

  const whoColors: Record<string, string> = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    violet: "text-violet-400",
    rose: "text-rose-400",
  }

  const copy = () => {
    navigator.clipboard.writeText(current.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-[32px] border-white/5 space-y-4">
        <div className="flex gap-1">
          {FLOW_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setStep(i)} className={cn("flex-1 h-1.5 rounded-full transition-all", i === step ? "bg-amber-500" : i < step ? "bg-amber-500/40" : "bg-white/10")} />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Step {step + 1}/{FLOW_STEPS.length}  </span>
            <span className={cn("text-[10px] font-black uppercase tracking-widest", whoColors[current.whoColor])}>{current.who}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-500 hover:text-white disabled:opacity-30 transition-all">← Prev</button>
            <button onClick={() => setStep(s => Math.min(FLOW_STEPS.length - 1, s + 1))} disabled={step === FLOW_STEPS.length - 1} className="px-4 py-1.5 rounded-full bg-amber-600 border border-amber-400 text-xs text-white hover:bg-amber-500 transition-all disabled:opacity-30">Next →</button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 glass p-6 rounded-[32px] border-white/5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black tracking-tight mb-1">{current.title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Actor: <span className={whoColors[current.whoColor]}>{current.who}</span></p>
                </div>
                <button onClick={copy} className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-white transition-colors shrink-0">
                  <Copy className="w-3 h-3" />{copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{current.desc}</p>

              {/* URL / Payload display */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Request / Response</p>
                <pre className="bg-black/60 border border-white/5 rounded-2xl p-4 text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">{current.url}</pre>
              </div>

              {current.urlParts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Parameter Breakdown</p>
                  <div className="space-y-2">
                    {current.urlParts.map(p => (
                      <div key={p.label} className="flex gap-3 items-start p-3 rounded-xl bg-black/30 border border-white/5">
                        <code className={cn("text-xs font-black font-mono shrink-0 w-32", p.color)}>{p.label}</code>
                        <p className="text-[12px] text-gray-400">{p.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="glass p-6 rounded-[24px] border-amber-500/10 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Technical Detail</p>
                <p className="text-sm text-gray-400 leading-relaxed">{current.detail}</p>
              </div>

              {/* Mini flow diagram */}
              <div className="glass p-5 rounded-[24px] border-white/5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Flow Position</p>
                <div className="space-y-2">
                  {FLOW_STEPS.map((s, i) => (
                    <button key={s.id} onClick={() => setStep(i)} className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all",
                      i === step ? "bg-amber-500/10 border border-amber-500/20" : "hover:bg-white/5"
                    )}>
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0",
                        i < step ? "bg-amber-500/40 text-amber-300" : i === step ? "bg-amber-500 text-white" : "bg-white/10 text-gray-600"
                      )}>{s.id}</div>
                      <p className={cn("text-[11px] font-medium", i === step ? "text-white" : "text-gray-600")}>{s.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════ CONCEPTS ════════════════════ */
function ConceptsTab() {
  const concepts = [
    {
      term: "client_id",
      color: "amber",
      summary: "Public identifier for the Client application registered with the Authorization Server.",
      detail: "Every OAuth client is assigned a client_id when registered. It is public — it appears in authorization URLs in the browser. Think of it like a username. It identifies which application is making the request. The Authorization Server uses it to look up the registered redirect_uri, name, and allowed scopes.",
      example: 'client_id=zlurq9lseKqvHabNqOc2DkjChC000QJP',
    },
    {
      term: "client_secret",
      color: "rose",
      summary: "Private password for the Client, used to prove its identity when exchanging codes for tokens.",
      detail: "The client_secret is analogous to a password. It must be stored server-side only and never exposed in frontend code, mobile apps, or URLs. It is sent with the authorization code in the back-channel token exchange. If leaked, attackers can impersonate your application.",
      example: 'client_secret=SUPER_SECRET_NEVER_IN_BROWSER',
    },
    {
      term: "scope",
      color: "violet",
      summary: "Defines exactly which resources or actions the Client is requesting permission to access.",
      detail: "Scopes are space-separated identifiers declared by the Resource Server. Common examples: read:profile, email, openid, repo, write:calendar. The user sees them on the consent screen. The issued access token's scopes are limited to what the user approved — even if the Client requested more.",
      example: 'scope=read:profile email openid',
    },
    {
      term: "state",
      color: "emerald",
      summary: "A random value generated by the Client to prevent CSRF attacks on the OAuth callback.",
      detail: "Before redirecting to the Authorization Server, the Client generates a cryptographically random value and stores it in session. It sends this as the state parameter. When the auth code arrives at the redirect_uri, the Client verifies the returned state matches what it stored. If it doesn't match, a CSRF attack is in progress — abort immediately.",
      example: 'state=xyzSecure123ABC (must be random & unpredictable)',
    },
    {
      term: "Authorization Code Grant",
      color: "blue",
      summary: "The most secure and recommended grant type for server-side web applications.",
      detail: "The full flow simulated above. Works by having the Authorization Server issue a short-lived authorization code to the browser, which the server then exchanges back-channel for tokens using the client_secret. The access token never touches the browser. Best for: traditional web apps with a backend.",
      example: 'response_type=code (in the authorization URL)',
    },
    {
      term: "PKCE (Proof Key for Code Exchange)",
      color: "indigo",
      summary: "Extension to Authorization Code Grant for public clients (mobile/SPA) that can't securely hold a client_secret.",
      detail: "PKCE (pronounced 'pixie') allows public clients to use the Authorization Code flow securely without a client_secret. The client generates a code_verifier (random string) and sends its hash (code_challenge) with the auth request. When exchanging the code, it sends the original verifier — the server hashes it and compares. No secret needed.",
      example: 'code_challenge=BASE64URL(SHA256(code_verifier))',
    },
    {
      term: "Client Credentials Grant",
      color: "cyan",
      summary: "Machine-to-machine grant where no user is involved — the client authenticates as itself.",
      detail: "Used for server-to-server communication where there is no Resource Owner. The client sends its client_id + client_secret directly to the token endpoint. Returns an access token. Used for: background jobs, microservices, API daemons. Not suitable for user data — there is no aud or sub representing a user.",
      example: 'grant_type=client_credentials',
    },
    {
      term: "refresh_token",
      color: "teal",
      summary: "A long-lived token used to silently obtain new access tokens without the user re-authenticating.",
      detail: "Access tokens expire quickly. When one expires, the client sends the refresh token to the token endpoint to get a new access token — no user interaction needed. Refresh tokens should be stored securely (HttpOnly cookie) as they are long-lived and can be used to generate many access tokens. They can be revoked by the Authorization Server.",
      example: 'grant_type=refresh_token&refresh_token=8xLOxBtZp8',
    },
    {
      term: "redirect_uri",
      color: "orange",
      summary: "The URL where the Authorization Server sends the authorization code after user consent.",
      detail: "The redirect_uri must match exactly what was pre-registered when the client was created (the Authorization Server checks this). This prevents redirect attacks where an attacker tricks the auth server into sending the code to an attacker-controlled URL. Some servers allow wildcard matching — this is dangerous.",
      example: 'redirect_uri=https://bistro.thm/oauthdemo/callback',
    },
  ]

  const [expanded, setExpanded] = useState<string | null>("client_id")

  const colorMap: Record<string, { text: string; badge: string; bg: string }> = {
    amber: { text: "text-amber-400", badge: "bg-amber-500/20 border-amber-500/30 text-amber-400", bg: "bg-amber-500/5 border-amber-500/20" },
    rose: { text: "text-rose-400", badge: "bg-rose-500/20 border-rose-500/30 text-rose-400", bg: "bg-rose-500/5 border-rose-500/20" },
    violet: { text: "text-violet-400", badge: "bg-violet-500/20 border-violet-500/30 text-violet-400", bg: "bg-violet-500/5 border-violet-500/20" },
    emerald: { text: "text-emerald-400", badge: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400", bg: "bg-emerald-500/5 border-emerald-500/20" },
    blue: { text: "text-blue-400", badge: "bg-blue-500/20 border-blue-500/30 text-blue-400", bg: "bg-blue-500/5 border-blue-500/20" },
    indigo: { text: "text-indigo-400", badge: "bg-indigo-500/20 border-indigo-500/30 text-indigo-400", bg: "bg-indigo-500/5 border-indigo-500/20" },
    cyan: { text: "text-cyan-400", badge: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400", bg: "bg-cyan-500/5 border-cyan-500/20" },
    teal: { text: "text-teal-400", badge: "bg-teal-500/20 border-teal-500/30 text-teal-400", bg: "bg-teal-500/5 border-teal-500/20" },
    orange: { text: "text-orange-400", badge: "bg-orange-500/20 border-orange-500/30 text-orange-400", bg: "bg-orange-500/5 border-orange-500/20" },
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-6">Click any concept to expand. These are the building blocks of every OAuth 2.0 implementation.</p>
      {concepts.map(c => {
        const col = colorMap[c.color]
        return (
          <motion.div key={c.term} layout className="glass rounded-[24px] border border-white/5 overflow-hidden hover:border-white/10 transition-colors">
            <button onClick={() => setExpanded(expanded === c.term ? null : c.term)} className="w-full p-5 flex items-start gap-4 text-left">
              <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black border shrink-0 font-mono", col.badge)}>{c.term}</span>
              <p className="text-[13px] text-gray-400 flex-1 leading-relaxed">{c.summary}</p>
              <ChevronRight className={cn("w-4 h-4 text-gray-600 shrink-0 mt-0.5 transition-transform", expanded === c.term && "rotate-90")} />
            </button>
            <AnimatePresence>
              {expanded === c.term && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className={cn("mx-5 mb-5 p-5 rounded-2xl border space-y-3", col.bg)}>
                    <p className="text-sm text-gray-300 leading-relaxed">{c.detail}</p>
                    <div className="bg-black/40 px-4 py-3 rounded-xl border border-white/5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Example</p>
                      <code className={cn("text-xs font-mono", col.text)}>{c.example}</code>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ════════════════════ VULNERABILITIES ════════════════════ */
const VULNS = [
  {
    id: "csrf-state", severity: "HIGH", color: "orange",
    title: "Missing state Parameter (CSRF)",
    summary: "Without the state parameter, an attacker can trick a victim into completing an OAuth flow that connects the attacker's account to the victim's session.",
    attack: `// Attacker starts OAuth flow, gets authorization URL:\nhttps://auth.server.com/authorize?client_id=app&redirect_uri=...\n\n// Attacker stops the flow and sends this URL to victim.\n// Victim clicks → authenticates → grants consent.\n// The authorization code goes to attacker's session.\n\n// If state is missing OR not validated:\n// Victim's account is now linked to attacker's identity.`,
    mitigation: "Generate a cryptographically random state value before redirecting. Store it in session. Validate it on callback — reject if missing or mismatched.",
  },
  {
    id: "open-redirect", severity: "HIGH", color: "orange",
    title: "Open Redirect / Unvalidated redirect_uri",
    summary: "If the Authorization Server doesn't strictly validate redirect_uri, an attacker can steal authorization codes by redirecting them to an attacker-controlled server.",
    attack: `// Registered redirect: https://bistro.thm/callback\n\n// Attacker crafts malicious URL:\nhttps://auth.server.com/authorize?\n  client_id=app&\n  redirect_uri=https://bistro.thm/callback?next=https://evil.com\n\n// If server allows open redirect or path traversal:\n// ?code=AuthCode123 → https://evil.com\n// Attacker exchanges code for tokens.`,
    mitigation: "Authorization server must exactly match the registered redirect_uri with no partial matching or open redirects. Clients must register exact URIs, not wildcard patterns.",
  },
  {
    id: "token-leak", severity: "MEDIUM", color: "yellow",
    title: "Access Token in URL (Implicit Flow)",
    summary: "The now-deprecated OAuth Implicit flow returned access tokens directly in the URL fragment — exposing them to browser history, referrer headers, and server logs.",
    attack: `// Implicit flow (response_type=token):\nhttps://app.com/callback\n  #access_token=eyJhbGci...     ← IN THE URL!\n\n// Access token appears in:\n// - Browser history\n// - Server access logs (Referer header)\n// - Shoulder surfing\n// - Browser extensions`,
    mitigation: "Never use the Implicit flow. Use Authorization Code + PKCE for public clients (SPAs, mobile). The access token should only exist in memory, never in a URL.",
  },
  {
    id: "scope-escalation", severity: "HIGH", color: "orange",
    title: "Insufficient Scope Validation",
    summary: "If the Resource Server doesn't validate that the access token's scopes permit the requested action, an attacker with a limited token can access resources beyond their authorization.",
    attack: `// Attacker obtains token with scope=read:profile\n// Access token: { scope: "read:profile", sub: "attacker" }\n\n// Attempts to use it for a write operation:\nPOST /api/user/delete\nAuthorization: Bearer <read-only token>\n\n// If Resource Server only checks\n// "is token valid?" but not "does scope allow this?"\n// → DELETE operation succeeds!`,
    mitigation: "Every API endpoint must check that the token has the required scope for that operation. Define granular scopes (read:profile, write:posts) rather than a single catch-all.",
  },
  {
    id: "client-secret-leak", severity: "CRITICAL", color: "red",
    title: "Exposed client_secret",
    summary: "If the client_secret is embedded in frontend JavaScript, a mobile APK, or committed to a public repository, attackers can impersonate the application and exchange stolen authorization codes for tokens.",
    attack: `// Developer accidentally commits to GitHub:\nconst CLIENT_SECRET = "sk_live_abc123def456"\n\n// Or bakes it into a React bundle:\nconst config = { clientSecret: "sk_live_abc123def456" }\n\n// Attacker:\n// 1. Finds secret in public repo or bundle\n// 2. Intercepts any authorization code\n// 3. Exchanges code for token using stolen secret\n// 4. Has full OAuth access as the legitimate app`,
    mitigation: "client_secret must only live in server-side environment variables. Never in frontend code, mobile APKs, or version control. For public clients (SPA/mobile), use PKCE — no secret needed.",
  },
]

function VulnerabilitiesTab() {
  const [expanded, setExpanded] = useState<string | null>("csrf-state")
  const severityBadge = (s: string) => s === "CRITICAL" ? "bg-red-500/20 text-red-400 border-red-500/30" : s === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  const border = (c: string) => c === "red" ? "border-red-500/20 hover:border-red-500/40" : c === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-yellow-500/20 hover:border-yellow-500/40"

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-2xl border-white/5 flex gap-3 mb-6">
        <ShieldAlert className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-400 leading-relaxed">
          OAuth 2.0 is a framework, not a protocol — implementation details matter enormously. These vulnerabilities arise from common mistakes in how OAuth is deployed, not from flaws in the standard itself, but they are <strong className="text-white">extremely common in the wild</strong>.
        </p>
      </div>
      {VULNS.map(v => (
        <motion.div key={v.id} layout className={cn("glass rounded-[24px] border overflow-hidden transition-colors", border(v.color))}>
          <button onClick={() => setExpanded(expanded === v.id ? null : v.id)} className="w-full p-5 flex items-start gap-4 text-left">
            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border shrink-0", severityBadge(v.severity))}>{v.severity}</span>
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
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-[13px] text-emerald-300/80 leading-relaxed h-full">{v.mitigation}</div>
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
