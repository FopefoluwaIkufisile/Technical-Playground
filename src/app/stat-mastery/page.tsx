"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Brain, GraduationCap, ClipboardCheck,
  RefreshCw, ChevronRight, CheckCircle2, XCircle, Lightbulb, BarChart3, Info
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import MathRenderer from "@/components/Math"

/* ─── TYPES ─── */
type Tab = "concepts" | "trainer" | "practice" | "test"
type ModuleId = "m1" | "m2" | "m3" | "m4" | "m5" | "m6"

/* ─── MODULE CONCEPTS DATA ─── */
const MODULES: { id: ModuleId; label: string; title: string; color: string; topics: { name: string; summary: string; formulas: { tex: string; note: string }[] }[] }[] = [
  {
    id: "m1", label: "Module 1", title: "Set Theory & Probability Axioms", color: "indigo",
    topics: [
      {
        name: "Set Operations", summary: "Sets, complements, unions, intersections, De Morgan's laws, partitions.",
        formulas: [
          { tex: "P(A^c) = 1 - P(A)", note: "Complementation Rule (Prop 1.11)" },
          { tex: "(A \\cup B)^c = A^c \\cap B^c", note: "De Morgan's Law" },
          { tex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", note: "General Addition Rule (Prop 1.13)" },
          { tex: "P(A^c B) = P(B) - P(A \\cap B)", note: "Useful identity from proof of addition rule" },
        ],
      },
      {
        name: "Kolmogorov's Axioms & Models", summary: "Three axioms define a probability measure. Equal-likelihood model: P(E)=N(E)/N(Ω).",
        formulas: [
          { tex: "P(E) \\ge 0,\\quad P(\\Omega) = 1", note: "Nonnegativity + Certainty" },
          { tex: "P\\!\\left(\\bigcup_{i} A_i\\right) = \\sum_i P(A_i) \\text{ (mutually exclusive)}", note: "Additivity Axiom" },
          { tex: "P(E) = \\frac{N(E)}{N(\\Omega)}", note: "Classical model with equally likely outcomes" },
        ],
      },
      {
        name: "Inclusion-Exclusion", summary: "For three events: P(A∪B∪C) = P(A)+P(B)+P(C)−P(AB)−P(AC)−P(BC)+P(ABC).",
        formulas: [
          { tex: "P\\!\\left(\\bigcup_{i=1}^n A_i\\right) = \\sum P(A_i) - \\sum\\sum P(A_i A_j) + \\cdots \\pm P(A_1\\cdots A_n)", note: "Inclusion-Exclusion (Prop 1.14)" },
        ],
      },
    ],
  },
  {
    id: "m2", label: "Module 2", title: "Combinatorial Probability", color: "sky",
    topics: [
      {
        name: "Counting & Permutations", summary: "BCR multiplies choices across stages. Permutations count ordered selections of r from m distinct objects.",
        formulas: [
          { tex: "m_1 \\cdot m_2 \\cdots m_r", note: "Basic Counting Rule (BCR)" },
          { tex: "(m)_r = \\frac{m!}{(m-r)!}", note: "Permutations of r from m (Prop 2.3)" },
        ],
      },
      {
        name: "Combinations", summary: "Unordered selection. C(m,r) = m!/[r!(m-r)!]. Used in Binomial, Hypergeometric, card problems.",
        formulas: [
          { tex: "\\binom{m}{r} = \\frac{m!}{r!(m-r)!}", note: "Combination (Prop 2.4)" },
          { tex: "\\sum_{k=0}^{n} \\binom{n}{k} = 2^n", note: "Sum of combinations = 2ⁿ" },
        ],
      },
    ],
  },
  {
    id: "m3", label: "Module 3", title: "Conditional Probability & Independence", color: "emerald",
    topics: [
      {
        name: "Conditional Probability", summary: "P(A|B) restricts sample space to B. Conditional prob satisfies all probability axioms.",
        formulas: [
          { tex: "P(A|B) = \\frac{P(AB)}{P(B)},\\quad P(B)>0", note: "Conditional Probability Rule (Prop 3.2)" },
          { tex: "P(AB) = P(B)\\,P(A|B)", note: "Multiplication Rule (Prop 3.3)" },
          { tex: "P(A) = \\sum_i P(A|B_i)P(B_i)", note: "Total Probability (if {Bᵢ} partition Ω)" },
        ],
      },
      {
        name: "Bayes' Theorem & Independence", summary: "Bayes' flips conditional. Independence: knowing B gives no info about A.",
        formulas: [
          { tex: "P(B_j|A) = \\frac{P(A|B_j)P(B_j)}{\\sum_i P(A|B_i)P(B_i)}", note: "Bayes' Theorem" },
          { tex: "P(A \\cap B) = P(A)P(B) \\Leftrightarrow A,B \\text{ independent}", note: "Independence (Def 3.6)" },
          { tex: "A \\perp B \\Rightarrow A^c \\perp B^c,\\; A\\perp B^c,\\; A^c\\perp B", note: "Independence preserved under complementation" },
        ],
      },
    ],
  },
  {
    id: "m4", label: "Module 4", title: "Discrete RV's & Distributions", color: "amber",
    topics: [
      {
        name: "PMF, CDF, E[X], Var(X)", summary: "PMF gives P(X=k). E[X] is the weighted mean. Var(X) = E[X²]−(E[X])².",
        formulas: [
          { tex: "E[X] = \\sum_{x \\in R_X} x\\,P_X(x)", note: "Expected Value" },
          { tex: "E[g(X)] = \\sum x g(x)\\,P_X(x)", note: "LOTUS (Law of the Unconscious Statistician)" },
          { tex: "\\text{Var}(X) = E[X^2] - (E[X])^2", note: "Variance shortcut" },
          { tex: "\\text{Var}(aX+b) = a^2\\text{Var}(X)", note: "Linear transform of variance" },
        ],
      },
      {
        name: "Key Discrete Distributions", summary: "Bernoulli, Binomial, Geometric, Negative Binomial, Hypergeometric, Poisson.",
        formulas: [
          { tex: "\\text{Bin}(n,p): P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k},\\; E=np,\\; V=np(1-p)", note: "Binomial" },
          { tex: "\\text{Geo}(p): P(X=k)=(1-p)^{k-1}p,\\; E=1/p,\\; V=(1-p)/p^2", note: "Geometric (# trials to 1st success)" },
          { tex: "\\text{NB}(r,p): P(X=k)=\\binom{k-1}{r-1}p^r(1-p)^{k-r},\\; E=r/p", note: "Negative Binomial (wait for rth)" },
          { tex: "\\text{HG}(N,n,p): P(X=k)=\\frac{\\binom{Np}{k}\\binom{N-Np}{n-k}}{\\binom{N}{n}},\\; E=np", note: "Hypergeometric (no replacement)" },
          { tex: "\\text{Poi}(\\lambda): P(X=k)=\\frac{e^{-\\lambda}\\lambda^k}{k!},\\; E=V=\\lambda", note: "Poisson" },
        ],
      },
    ],
  },
  {
    id: "m5", label: "Module 5", title: "Continuous RV's & Distributions", color: "violet",
    topics: [
      {
        name: "PDF, CDF, and Properties", summary: "f(x)≥0, integrates to 1. F(x)=P(X≤x). F'=f. P(a≤X≤b)=F(b)−F(a).",
        formulas: [
          { tex: "F_X(x) = \\int_{-\\infty}^{x} f(t)\\,dt,\\quad F'(x)=f(x)", note: "CDF–PDF relationship" },
          { tex: "P(a \\le X \\le b) = F(b)-F(a) = \\int_a^b f(x)\\,dx", note: "Area = probability" },
          { tex: "P(X = a) = 0 \\text{ for all } a", note: "Continuous: point probability is zero" },
        ],
      },
      {
        name: "Key Continuous Distributions", summary: "Uniform, Exponential (memoryless), Normal, Gamma, Beta.",
        formulas: [
          { tex: "\\text{Unif}(a,b): f(x)=\\frac{1}{b-a},\\; E=\\frac{a+b}{2},\\; V=\\frac{(b-a)^2}{12}", note: "Uniform" },
          { tex: "\\text{Exp}(\\lambda): f(x)=\\lambda e^{-\\lambda x},\\; F(x)=1-e^{-\\lambda x},\\; E=1/\\lambda", note: "Exponential (memoryless)" },
          { tex: "N(\\mu,\\sigma^2): \\text{standard} Z = (X-\\mu)/\\sigma,\\; E=\\mu,\\; V=\\sigma^2", note: "Normal" },
          { tex: "\\text{Gamma}(\\alpha,\\lambda): E=\\alpha/\\lambda,\\; V=\\alpha/\\lambda^2", note: "Sum of α Exponentials" },
          { tex: "\\text{Beta}(a,b): E=a/(a+b)", note: "Defined on (0,1)" },
        ],
      },
      {
        name: "Transformations (Change of Variables)", summary: "Find PDF of Y=g(X) via Jacobian. Non-monotone: sum contributions.",
        formulas: [
          { tex: "f_Y(y) = f_X(g^{-1}(y)) \\cdot \\left|\\frac{d}{dy}g^{-1}(y)\\right|", note: "Transformation theorem (monotone g)" },
          { tex: "f_Y(y) = \\sum_i f_X(x_i)\\left|J_i\\right|", note: "Non-monotone: sum over all pre-images xᵢ" },
        ],
      },
    ],
  },
  {
    id: "m6", label: "Module 6", title: "Expected Values & Variance", color: "rose",
    topics: [
      {
        name: "E[X], Var(X), Linearity", summary: "E[aX+b]=aE[X]+b. Var(aX+b)=a²Var(X). E[X+Y]=E[X]+E[Y] always.",
        formulas: [
          { tex: "E[aX+b] = aE[X]+b", note: "Linearity of expectation" },
          { tex: "\\text{Var}(X) = E[(X-\\mu)^2] = E[X^2]-(E[X])^2", note: "Variance" },
          { tex: "E\\left[\\sum_{i=1}^n X_i\\right] = \\sum_{i=1}^n E[X_i]", note: "Linearity (always, even if dependent)" },
          { tex: "\\text{Var}\\left(\\sum X_i\\right) = \\sum \\text{Var}(X_i) \\text{ if independent}", note: "Variance of sum (independent)" },
        ],
      },
      {
        name: "Moments, MGF", summary: "kth moment: E[Xᵏ]. MGF: M_X(t)=E[e^tX]. MGF uniquely determines distribution.",
        formulas: [
          { tex: "M_X(t) = E[e^{tX}]", note: "Moment Generating Function" },
          { tex: "E[X^k] = M_X^{(k)}(0)", note: "kth derivative of MGF at 0 = kth moment" },
          { tex: "M_{\\text{Bin}(n,p)}(t)=(1-p+pe^t)^n", note: "Binomial MGF" },
          { tex: "M_{\\text{Exp}(\\lambda)}(t)=\\frac{\\lambda}{\\lambda-t},\\; t<\\lambda", note: "Exponential MGF" },
        ],
      },
    ],
  },
]

/* ─── EXAM QUESTIONS (real exam-style, from the 3 sample finals + lecture notes) ─── */
interface ExamQ {
  id: string; module: ModuleId; difficulty: "hard" | "medium"; question: string
  options: string[]; answer: number; explanation: string; hint?: string
}
const EXAM_QUESTIONS: ExamQ[] = [
  /* M1 */
  { id:"m1q1",module:"m1",difficulty:"medium",
    question:"Of all CDs produced, 3% have surface defects (S), 8% have balance defects (B), and 91% are defect-free. What is P(S \u2229 B)?",
    options:["2%","1%","11%","3%"],answer:0,
    explanation:"P(S\u222aB)=0.09. P(S\u2229B)=0.03+0.08\u22120.09=0.02.",
  },
  { id:"m1q2",module:"m1",difficulty:"medium",
    question:"Two dice: A={sum\u22644}, D={sum=7}. Are A,D mutually exclusive and what is P(A\u222aD)?",
    options:["ME; P=12/36","Not ME; P=12/36","ME; P=10/36","Not ME; P=14/36"],answer:0,
    explanation:"Sum can't be \u22644 and =7 simultaneously \u2192 ME. P(A)=6/36, P(D)=6/36. P(A\u222aD)=12/36=1/3.",
    hint:"List ME condition first, then use finite additivity.",
  },
  { id:"m1q3",module:"m1",difficulty:"hard",
    question:"A coin is flipped 3 times. What is P(at least 2 consecutive identical results)?",
    options:["3/8","1/2","5/8","3/4"],answer:3,
    explanation:"8 total sequences. Only HTH and THT have no two consecutive identical results. P(none)=2/8=1/4. P(at least 2 consecutive)=1\u22121/4=3/4.",
    hint:"Complement: find the alternating sequences.",
  },
  { id:"m1q4",module:"m1",difficulty:"hard",
    question:"1000 subscribers: N(P)=312, N(M)=470, N(C)=525, N(MP)=86, N(MC)=147, N(PC)=42, N(MPC)=25. By 3-set inclusion-exclusion, N(M\u222aP\u222aC)=?",
    options:["1057 \u2014 exceeds 1000, data has an error","987 \u2014 no error","1031 \u2014 exceeds 1000, data error","999 \u2014 consistent"],answer:0,
    explanation:"N(M\u222aP\u222aC)=470+312+525\u221286\u2212147\u221242+25=1057>1000. Data is inconsistent.",
    hint:"Add all three, subtract pairwise, add triple intersection.",
  },
  { id:"m1q5",module:"m1",difficulty:"medium",
    question:"P(A)=0.4, P(B)=0.5, P(A\u2229B)=0.2. What is P(A\u1d9c \u2229 B)?",
    options:["0.1","0.2","0.3","0.5"],answer:2,
    explanation:"P(A\u1d9cB)=P(B)\u2212P(A\u2229B)=0.5\u22120.2=0.3.",
  },
  { id:"m1q6",module:"m1",difficulty:"medium",
    question:"P(A)=0.3, P(B)=0.4, P(A\u222aB)=0.6. What is P(A\u2229B)?",
    options:["0.1","0.5","0.3","0.7"],answer:0,
    explanation:"P(A\u2229B)=P(A)+P(B)\u2212P(A\u222aB)=0.3+0.4\u22120.6=0.1.",
  },
  { id:"m1q7",module:"m1",difficulty:"hard",
    question:"Two dice. E={at least one result of 3}. Using complement, P(E)=?",
    options:["11/36","10/36","25/36","1/3"],answer:0,
    explanation:"P(E\u1d9c)=(5/6)\u00b2=25/36. P(E)=1\u221225/36=11/36.",
    hint:"Each die has 5 non-3 faces. Independence gives (5/6)\u00b2.",
  },
  { id:"m1q8",module:"m1",difficulty:"medium",
    question:"Which is a correct De Morgan's Law?",
    options:["(A\u222aB)\u1d9c=A\u1d9c\u222aB\u1d9c","(A\u2229B)\u1d9c=A\u1d9c\u2229B\u1d9c","(A\u222aB)\u1d9c=A\u1d9c\u2229B\u1d9c","(A\u2229B)\u1d9c=A\u2229B\u1d9c"],answer:2,
    explanation:"Prop 1.4: (A\u222aB)\u1d9c=A\u1d9c\u2229B\u1d9c and (A\u2229B)\u1d9c=A\u1d9c\u222aB\u1d9c.",
  },
  { id:"m1q9",module:"m1",difficulty:"hard",
    question:"Two dice: A={sum\u22644}, D={sum=7}, E={at least one 3}. Find P(A\u222aD\u222aE).",
    options:["14/36","15/36","19/36","17/36"],answer:2,
    explanation:"P(A)=6/36, P(D)=6/36, P(E)=11/36. A\u2229D=\u2205. A\u2229E={(1,3),(3,1)}\u21922/36. D\u2229E={(3,4),(4,3)}\u21922/36. A\u2229D\u2229E=\u2205. P=6+6+11\u22120\u22122\u22122+0=19/36.",
    hint:"Find overlapping pairs systematically before applying inclusion-exclusion.",
  },
  { id:"m1q10",module:"m1",difficulty:"medium",
    question:"If P(A)=0.6 and A\u2282B, what does the Domination Principle give us?",
    options:["P(B)\u22640.6","P(B)\u22650.6","P(B)=0.6","P(B)=0.4"],answer:1,
    explanation:"Prop 1.12: A\u2286B \u21d2 P(A)\u2264P(B). Since P(A)=0.6, P(B)\u22650.6.",
  },
  /* M2 */
  { id:"m2q1",module:"m2",difficulty:"hard",
    question:"5-card hand from 52 cards. P(full house) = ?",
    options:["0.00144","0.00240","0.00072","0.00024"],answer:0,
    explanation:"# full houses: C(13,1)\u00d7C(4,3)\u00d7C(12,1)\u00d7C(4,2)=13\u00d74\u00d712\u00d76=3744. Total: C(52,5)=2,598,960. P=3744/2598960\u22480.00144.",
  },
  { id:"m2q2",module:"m2",difficulty:"medium",
    question:"5-digit PIN, no repeated digits. How many valid PINs?",
    options:["100,000","90,000","30,240","15,120"],answer:2,
    explanation:"(10)\u2085=10\u00d79\u00d78\u00d77\u00d76=30,240.",
  },
  { id:"m2q3",module:"m2",difficulty:"hard",
    question:"Die rolled 10 times. Given first 6 appears on roll 7, what is P(exactly 2 sixes total)?",
    options:["C(3,1)(1/6)(5/6)\u00b2","C(9,1)(1/6)(5/6)\u2078","(5/6)\u2076(1/6)(5/6)\u00b2(1/6)","C(6,1)(1/6)(5/6)\u2075"],answer:0,
    explanation:"Rolls 1\u20136 fixed (no 6), roll 7 fixed (is 6). Need exactly 1 six in rolls 8\u201310. P=C(3,1)(1/6)(5/6)\u00b2=75/216.",
    hint:"After conditioning, only 3 rolls remain free.",
  },
  { id:"m2q4",module:"m2",difficulty:"medium",
    question:"Manitoba license: 3 letters + 3 digits. How many distinct plates?",
    options:["26\u00b3\u00d710\u00b3=17,576,000","26\u00b3\u00d79\u00b3=12,812,904","26\u00d725\u00d724\u00d710\u00d79\u00d78","52\u00d710\u00b3"],answer:0,
    explanation:"BCR: 26\u00b3\u00d710\u00b3=17,576,000.",
  },
  { id:"m2q5",module:"m2",difficulty:"hard",
    question:"5-card hand. P(at least one ace) = ?",
    options:["1\u2212C(48,5)/C(52,5)","4/52","C(4,1)C(48,4)/C(52,5)","4\u00d748/(52\u00d751)"],answer:0,
    explanation:"Complement of no aces: P=1\u2212C(48,5)/C(52,5)\u22481\u22120.659=0.341.",
    hint:"Complement: no aces = all 5 from the 48 non-aces.",
  },
  { id:"m2q6",module:"m2",difficulty:"hard",
    question:"n people sampled WITH replacement from N. P(all distinct) = ?",
    options:["n!/N\u207f","N(N\u22121)\u22ef(N\u2212n+1)/N\u207f","C(N,n)/N\u207f","N!/(N\u2212n)!/N\u207f"],answer:1,
    explanation:"Favorable: first pick N ways, second N\u22121, ..., nth N\u2212n+1. P=(N)\u2099/N\u207f. As N\u2192\u221e, \u21921.",
  },
  { id:"m2q7",module:"m2",difficulty:"medium",
    question:"5-digit PIN, adjacent digits cannot be identical. How many valid PINs?",
    options:["10\u00d79\u2074=65,610","10\u2075=100,000","9\u2075=59,049","10\u00d79\u00d78\u00d77\u00d76"],answer:0,
    explanation:"First digit: 10. Each next: 9 choices (any except previous). 10\u00d79\u2074=65,610.",
  },
  /* M3 */
  { id:"m3q1",module:"m3",difficulty:"hard",
    question:"Family has 2 children. Given at least one is a boy, P(both boys) = ?",
    options:["1/2","1/3","1/4","2/3"],answer:1,
    explanation:"\u03a9={BB,BG,GB,GG}. 'At least one boy'={BB,BG,GB}, P=3/4. P(BB|\u22651 boy)=(1/4)/(3/4)=1/3.",
    hint:"The condition restricts to 3 equally likely outcomes, not 2.",
  },
  { id:"m3q2",module:"m3",difficulty:"hard",
    question:"A and B are independent with P(A)>0 and P(B)>0. Can they be mutually exclusive?",
    options:["Yes if P(A)+P(B)=1","No \u2014 impossible","Yes, always","Only if P(A)=P(B)"],answer:1,
    explanation:"If A\u2229B=\u2205 then P(A\u2229B)=0. But independence \u21d2 P(A\u2229B)=P(A)P(B)>0. Contradiction.",
  },
  { id:"m3q3",module:"m3",difficulty:"hard",
    question:"4 independent engines, each fails with prob p. Need \u22652 working. P(flight completes) = ?",
    options:["(1\u2212p)\u2074+4p(1\u2212p)\u00b3+6p\u00b2(1\u2212p)\u00b2","1\u2212(1\u2212p)\u2074","(1\u2212p)\u2074","4p(1\u2212p)\u00b3+6p\u00b2(1\u2212p)\u00b2"],answer:0,
    explanation:"At most 2 failing: P(0 fail)+P(1 fail)+P(2 fail)=(1\u2212p)\u2074+4p(1\u2212p)\u00b3+6p\u00b2(1\u2212p)\u00b2.",
  },
  { id:"m3q4",module:"m3",difficulty:"hard",
    question:"Same airplane. The plane just completed a flight. P(no engine failed | completed) = ?",
    options:["(1\u2212p)\u2074 / [(1\u2212p)\u2074+4p(1\u2212p)\u00b3+6p\u00b2(1\u2212p)\u00b2]","(1\u2212p)\u2074","1/3","4p(1\u2212p)\u00b3/P(complete)"],answer:0,
    explanation:"Bayes: P(0 fail|complete)=(1)(1\u2212p)\u2074/P(complete). P(complete|0 fail)=1.",
    hint:"Use Bayes theorem. The prior is (1\u2212p)\u2074, the likelihood given 0 faults is 1.",
  },
  { id:"m3q5",module:"m3",difficulty:"hard",
    question:"P\u00f3lya urn: 1R+1B. Draw, replace+add same. P(R\u2081 \u2229 R\u2082) = ?",
    options:["1/6","1/4","1/3","1/2"],answer:2,
    explanation:"P(R\u2081)=1/2. After R\u2081: 2R+1B. P(R\u2082|R\u2081)=2/3. P(R\u2081\u2229R\u2082)=(1/2)(2/3)=1/3.",
  },
  { id:"m3q6",module:"m3",difficulty:"hard",
    question:"P\u00f3lya urn. P(R\u2081 \u2229 R\u2082 \u2229 R\u2083) = ?",
    options:["1/6","1/4","1/3","1/8"],answer:1,
    explanation:"After R\u2081R\u2082: 3R+1B=4 balls. P(R\u2083|R\u2081R\u2082)=3/4. P=(1/2)(2/3)(3/4)=1/4.",
  },
  { id:"m3q7",module:"m3",difficulty:"hard",
    question:"P\u00f3lya urn. X=draws until first BLUE. P(X=k) = ?",
    options:["1/(k(k+1))","(1/2)^k","1/k","1/(k\u00b2)"],answer:0,
    explanation:"P(X=1)=1/2=1/(1\u00d72). P(X=2)=(1/2)(1/3)=1/6=1/(2\u00d73). General: 1/(k(k+1)). Check: \u03a3=\u03a3(1/k\u22121/(k+1))=1 \u2713.",
  },
  { id:"m3q8",module:"m3",difficulty:"medium",
    question:"P(A|B)=P(A). What does this mean?",
    options:["A and B mutually exclusive","A and B are independent","P(B)=0","A\u2282B"],answer:1,
    explanation:"P(A|B)=P(A) \u21d4 P(A\u2229B)=P(A)P(B) \u21d4 A and B are independent.",
  },
  { id:"m3q9",module:"m3",difficulty:"hard",
    question:"Die rolled, then N cards drawn from 52. P(no aces among drawn cards) = ?",
    options:["(1/6)\u03a3C(48,k)/C(52,k) for k=1..6","C(48,N)/C(52,N)","(48/52)^N","48/52"],answer:0,
    explanation:"Total probability: P(no aces)=\u03a3P(no aces|N=k)(1/6)=(1/6)\u03a3_{k=1}^{6}C(48,k)/C(52,k).",
    hint:"Condition on the die outcome first.",
  },
  { id:"m3q10",module:"m3",difficulty:"hard",
    question:"A die gives result B, then Bayes: given all 4 aces were drawn, P(die showed 6) = ?",
    options:["P(all 4 aces|N=6)\u00b7(1/6) / \u03a3P(all 4 aces|N=k)(1/6)","1/6 always","C(4,4)C(48,2)/C(52,6)","1"],answer:0,
    explanation:"Bayes: P(N=6|4 aces drawn)=P(4 aces|N=6)P(N=6)/\u03a3P(4 aces|N=k)P(N=k). Must have N\u22654 to draw 4 aces. P(4 aces|N=k)=C(4,4)C(48,k\u22124)/C(52,k).",
    hint:"4 aces can only be drawn if N\u22654, so sum only k=4,5,6.",
  },
  /* M4 */
  { id:"m4q1",module:"m4",difficulty:"hard",
    question:"X \u223c Poisson(\u03bb). Using E[X(X\u22121)]=\u03bb\u00b2, find Var(X).",
    options:["\u03bb\u00b2","\u03bb","2\u03bb","\u03bb+\u03bb\u00b2"],answer:1,
    explanation:"E[X\u00b2\u2212X]=\u03bb\u00b2 \u21d2 E[X\u00b2]=\u03bb\u00b2+\u03bb. Var(X)=E[X\u00b2]\u2212(E[X])\u00b2=\u03bb.",
  },
  { id:"m4q2",module:"m4",difficulty:"hard",
    question:"X\u223cPoisson(\u03bb). Find E[X(X\u22121)(X\u22122)] (third factorial moment).",
    options:["\u03bb\u00b3","3\u03bb\u00b2","\u03bb\u00b3+3\u03bb\u00b2+\u03bb","6\u03bb"],answer:0,
    explanation:"Substituting the PMF and shifting the index by 3 cancels k!, giving \u03bb\u00b3\u00b7e^{-\u03bb}\u00b7e^{\u03bb}=\u03bb\u00b3.",
  },
  { id:"m4q3",module:"m4",difficulty:"hard",
    question:"Printer ~ Exp(mean=2 yrs). Refund: $200(yr1), $100(yr2), $0 after. E[refund]=?",
    options:["200(1\u2212e^{\u22121/2})+100(e^{\u22121/2}\u2212e^{\u22121})","200e^{-1/2}+100e^{-1}","$150","200(1\u2212e^{-1})"],answer:0,
    explanation:"\u03bb=1/2. P(yr1)=1\u2212e^{-1/2}. P(yr2)=e^{-1/2}\u2212e^{-1}. E=200P(yr1)+100P(yr2).",
    hint:"Mean=2 \u21d2 \u03bb=1/2.",
  },
  { id:"m4q4",module:"m4",difficulty:"hard",
    question:"n keys, 1 correct. WITHOUT replacement. P(correct on exactly kth try) = ?",
    options:["(1\u22121/n)^{k\u22121}/n","1/n for ALL k=1,...,n","(n\u2212k+1)/n","k/n"],answer:1,
    explanation:"The telescoping product P(fail1)\u00d7P(fail2|fail1)\u00d7...\u00d7P(success|k\u22121 fails)=[(n\u22121)/n]\u00d7[(n\u22122)/(n\u22121)]\u00d7...\u00d7[1/(n\u2212k+1)]=1/n. Uniform over all k.",
    hint:"All fractions telescope beautifully to 1/n.",
  },
  { id:"m4q5",module:"m4",difficulty:"hard",
    question:"n keys WITH replacement. P(correct on exactly kth try) = ?",
    options:["1/n","(1/n)((n\u22121)/n)^{k\u22121}","k/n","(n\u22121)!/n^k"],answer:1,
    explanation:"Each try is independent. P(fail)=(n\u22121)/n, P(success)=1/n. P(X=k)=(1/n)((n\u22121)/n)^{k\u22121} \u2014 Geometric(1/n).",
  },
  { id:"m4q6",module:"m4",difficulty:"medium",
    question:"X ~ Binomial(n=10, p=1/6). What is E[X] and Var(X)?",
    options:["E=5/3, Var=25/36","E=5/3, Var=25/18","E=10/6, Var=50/36","E=5/6, Var=25/36"],answer:1,
    explanation:"E=np=5/3. Var=np(1\u2212p)=10(1/6)(5/6)=50/36=25/18.",
  },
  { id:"m4q7",module:"m4",difficulty:"medium",
    question:"P(at least one 6 in 10 rolls) = ?",
    options:["10/6","1\u2212(5/6)^{10}","(1/6)^{10}","1\u2212(1/6)^{10}"],answer:1,
    explanation:"P(\u22651 six)=1\u2212P(no sixes)=1\u2212(5/6)^{10}\u22480.838.",
  },
  { id:"m4q8",module:"m4",difficulty:"hard",
    question:"Shootout: round decisive with p=5/12. X=#rounds. E[X] and Var(X) = ?",
    options:["E=12/5, Var=84/25","E=5/12, Var=5/144","E=12/5, Var=12/25","E=12/7, Var=84/49"],answer:0,
    explanation:"X~Geo(5/12). E=1/p=12/5. Var=(1\u2212p)/p\u00b2=(7/12)/(25/144)=84/25.",
  },
  { id:"m4q9",module:"m4",difficulty:"hard",
    question:"P\u00f3lya urn: X=draws until first blue ball. What is P(X=k)?",
    options:["1/(k(k+1))","(1/2)^k","k/(k+1)!","1/k"],answer:0,
    explanation:"P(X=k)=1/(k(k+1)). Check \u03a3=\u03a3(1/k\u22121/(k+1))=1 (telescoping) \u2713.",
  },
  { id:"m4q10",module:"m4",difficulty:"hard",
    question:"X ~ Poisson(\u03bb). Using factorial moments, what is E[X\u00b3]?",
    options:["\u03bb\u00b3","\u03bb\u00b3+3\u03bb\u00b2+\u03bb","\u03bb\u00b3+3\u03bb\u00b2+2\u03bb","\u03bb(\u03bb+1)(\u03bb+2)"],answer:1,
    explanation:"E[X(X\u22121)(X\u22122)]=\u03bb\u00b3. E[X\u00b3]=\u03bb\u00b3+3E[X\u00b2]\u22122E[X]=\u03bb\u00b3+3(\u03bb\u00b2+\u03bb)\u22122\u03bb=\u03bb\u00b3+3\u03bb\u00b2+\u03bb.",
  },
  { id:"m4q11",module:"m4",difficulty:"medium",
    question:"Craps: win immediately if sum of 2 dice is 7 or 11. P(win first roll) = ?",
    options:["6/36","8/36","10/36","12/36"],answer:1,
    explanation:"Sum=7: 6 ways. Sum=11: (5,6),(6,5)=2 ways. P=8/36=2/9.",
  },
  { id:"m4q12",module:"m4",difficulty:"medium",
    question:"Hypergeometric: N=10, M=4 successes, draw n=3 without replacement. E[X]=?",
    options:["2/5","6/5","3/10","12/25"],answer:1,
    explanation:"E[X]=nM/N=3\u00d74/10=6/5=1.2.",
  },
  { id:"m4q13",module:"m4",difficulty:"hard",
    question:"Lotto 6/49: p\u22480.01864. Expected draws to WIN 5 PRIZES (Negative Binomial)?",
    options:["\u2248268","\u224853.7","\u22481340","\u22485"],answer:0,
    explanation:"X~NB(r=5, p). E[X]=r/p=5/0.01864\u2248268.",
  },
  /* M5 */
  { id:"m5q1",module:"m5",difficulty:"hard",
    question:"CDF: F(x)=ax(0\u2264x<1), bx+1/2(1\u2264x<2), 1(x\u22652). X continuous. Find a,b.",
    options:["a=1/2, b=1/4","a=3/4, b=1/4","a=1/2, b=\u22121/4","a=1, b=0"],answer:1,
    explanation:"F(2)=1: 2b+1/2=1 \u21d2 b=1/4. Continuity at x=1: a=b+1/2=3/4. Verify integral=1 \u2713.",
    hint:"Two equations: F(2\u207b)=1 and continuity at x=1.",
  },
  { id:"m5q2",module:"m5",difficulty:"hard",
    question:"Same CDF. If X is NOT assumed continuous, what are possible a,b?",
    options:["Only a=3/4, b=1/4","b=1/4, a\u2208(0, 3/4]","Any a>0, b>0","a\u2208(0,1/2], b=1/2"],answer:1,
    explanation:"F(2)=1 still forces b=1/4. Non-decreasing at x=1 requires a\u2264b+1/2=3/4. So b=1/4, a\u2208(0, 3/4].",
  },
  { id:"m5q3",module:"m5",difficulty:"hard",
    question:"X~Uniform(\u22122,2). Y=X\u00b2. Find f_Y(y) on its support.",
    options:["1/(4\u221ay) for 0<y<4","1/(2\u221ay) for 0<y<4","\u221ay/4 for 0<y<4","1/4 for 0<y<4"],answer:0,
    explanation:"f_X=1/4. Y=X\u00b2 non-monotone: pre-images \u00b1\u221ay. f_Y(y)=[1/4+1/4]\u00d71/(2\u221ay)=(1/2)/(2\u221ay)=1/(4\u221ay).",
    hint:"Non-monotone: sum contributions from both pre-images.",
  },
  { id:"m5q4",module:"m5",difficulty:"hard",
    question:"Demand X: f(x)=5(1\u2212x)\u2074 for 0<x<1. Find tank capacity c so P(X>c)=0.01.",
    options:["c=1\u2212(0.01)^{0.2}","c=(0.01)^{0.2}","c=1\u2212(0.01)^{0.25}","c=0.01^{0.5}"],answer:0,
    explanation:"P(X>c)=(1\u2212c)\u2075=0.01 \u21d2 c=1\u22120.01^{1/5}\u22480.60.",
  },
  { id:"m5q5",module:"m5",difficulty:"hard",
    question:"X~Exp(\u03bb). P(X>s+t | X>s) = ?",
    options:["P(X>s+t)","P(X>t)","e^{\u2212\u03bbs}","1\u2212e^{\u2212\u03bbt}"],answer:1,
    explanation:"Memoryless: e^{\u2212\u03bb(s+t)}/e^{\u2212\u03bbs}=e^{\u2212\u03bbt}=P(X>t). Past has no effect.",
  },
  { id:"m5q6",module:"m5",difficulty:"hard",
    question:"X~Unif(0,2), Y=(X/2)^{1/a}. Which distribution is Y?",
    options:["Unif(0,1)","Beta(1,a)","Beta(a,1)","Exp(a)"],answer:2,
    explanation:"F_Y(y)=P(X\u22642y^a)=y^a for 0<y<1. f_Y(y)=ay^{a\u22121}=Beta(a,1).",
  },
  { id:"m5q7",module:"m5",difficulty:"hard",
    question:"f(x)=60(x\u22121)\u00b2/x\u2077 for x>1. Y=1/X. What distribution is Y?",
    options:["Beta(3,2)","Beta(4,3)","Gamma(3,3)","Beta(2,3)"],answer:1,
    explanation:"f_Y(y)=f_X(1/y)\u00d71/y\u00b2=60(1\u2212y)\u00b2y\u00b3 for 0<y<1. Beta(4,3) since 1/B(4,3)=60.",
  },
  { id:"m5q8",module:"m5",difficulty:"medium",
    question:"f(x)=cx\u00b2 for 0<x<3. Find normalizing constant c.",
    options:["1/9","3","1/27","1/3"],answer:0,
    explanation:"\u222b\u2080\u00b3cx\u00b2dx=9c=1 \u21d2 c=1/9.",
  },
  { id:"m5q9",module:"m5",difficulty:"hard",
    question:"X~Exp(\u03bb=1/2). P(X>3 | X>1) = ?",
    options:["e^{\u22121}","e^{\u22123/2}","e^{\u22121/2}","1\u2212e^{\u22121}"],answer:0,
    explanation:"Memoryless: P(X>3|X>1)=P(X>2)=e^{\u2212(1/2)(2)}=e^{\u22121}.",
    hint:"Shift by conditioning value: t=3\u22121=2.",
  },
  { id:"m5q10",module:"m5",difficulty:"hard",
    question:"Insurance: f(x)=2/x\u00b3 (x>1). Policy pays min(X,10). E[min(X,10)]=?",
    options:["1.9","2.0","1.5","1.8"],answer:0,
    explanation:"\u222b\u2081^{10}x(2/x\u00b3)dx+10P(X>10)=9/5+10/100=1.8+0.1=1.9.",
  },
  { id:"m5q11",module:"m5",difficulty:"hard",
    question:"X~Unif(0,1). Y=\u2212ln(X). Distribution of Y?",
    options:["Exp(1)","Unif(0,\u221e)","N(0,1)","Gamma(2,1)"],answer:0,
    explanation:"f_Y(y)=f_X(e^{\u2212y})|de^{\u2212y}/dy|=1\u00d7e^{\u2212y}=e^{\u2212y} for y>0 \u21d2 Y~Exp(1).",
    hint:"Use change of variables. g^{-1}(y)=e^{-y}.",
  },
  { id:"m5q12",module:"m5",difficulty:"medium",
    question:"For a continuous RV, P(a\u2264X\u2264b) in terms of CDF?",
    options:["F(b)+F(a)","F(b)\u2212F(a)","F(a)\u2212F(b)","1\u2212F(a)\u2212F(b)"],answer:1,
    explanation:"P(a\u2264X\u2264b)=F(b)\u2212F(a). Endpoints don't matter for continuous RVs.",
  },
  { id:"m5q13",module:"m5",difficulty:"hard",
    question:"X~Exp(\u03bb). P(X \u2264 1/\u03bb) = ? (prob of being at or below the mean)",
    options:["1/e","1\u22121/e","1/2","ln(2)/\u03bb"],answer:1,
    explanation:"F(1/\u03bb)=1\u2212e^{\u2212\u03bb\u00d71/\u03bb}=1\u2212e^{\u22121}\u22480.632. The median is ln(2)/\u03bb<mean=1/\u03bb (right-skewed).",
  },
  /* M6 */
  { id:"m6q1",module:"m6",difficulty:"hard",
    question:"X: P(X=1/2)=1/2, P(X=1)=1/4, P(X=2)=1/4. Y=X+1/X. E[Y]=?",
    options:["19/8","3/2","11/4","23/8"],answer:0,
    explanation:"Y(1/2)=5/2, Y(1)=2, Y(2)=5/2. E[Y]=(5/2)(1/2)+2(1/4)+(5/2)(1/4)=5/4+1/2+5/8=19/8.",
    hint:"LOTUS: E[g(X)]=\u03a3g(x)P(x).",
  },
  { id:"m6q2",module:"m6",difficulty:"hard",
    question:"Same X as above. Find Var(Y=X+1/X).",
    options:["3/64","1/8","19/8","361/64"],answer:0,
    explanation:"E[Y\u00b2]=(5/2)\u00b2(1/2)+4(1/4)+(5/2)\u00b2(1/4)=25/8+1+25/16=91/16. Var=91/16\u2212(19/8)\u00b2=91/16\u2212361/64=364/64\u2212361/64=3/64.",
  },
  { id:"m6q3",module:"m6",difficulty:"hard",
    question:"f(x)=2x for 0<x<1. Find E[X] and Var(X).",
    options:["E=2/3, Var=1/18","E=1/3, Var=1/9","E=2/3, Var=2/9","E=1/2, Var=1/12"],answer:0,
    explanation:"E[X]=2/3. E[X\u00b2]=1/2. Var=1/2\u2212(2/3)\u00b2=1/2\u22124/9=1/18.",
  },
  { id:"m6q4",module:"m6",difficulty:"hard",
    question:"X~Exp(\u03bb). E[X\u207f]=?",
    options:["n\u03bb^{n\u22121}","n!/\u03bb\u207f","\u03bb\u207f/n!","n/\u03bb"],answer:1,
    explanation:"Sub u=\u03bbx: E[X\u207f]=(1/\u03bb\u207f)\u222b\u2080^{\u221e}u\u207fe^{\u2212u}du=\u0393(n+1)/\u03bb\u207f=n!/\u03bb\u207f.",
    hint:"\u222b\u2080^{\u221e}u\u207fe^{-u}du=\u0393(n+1)=n!",
  },
  { id:"m6q5",module:"m6",difficulty:"hard",
    question:"X~Exp(\u03bb). Find Var(X\u00b2).",
    options:["4/\u03bb\u00b2","20/\u03bb\u2074","24/\u03bb\u2074","2/\u03bb\u2074"],answer:1,
    explanation:"E[X\u00b2]=2/\u03bb\u00b2, E[X\u2074]=24/\u03bb\u2074. Var(X\u00b2)=24/\u03bb\u2074\u2212(2/\u03bb\u00b2)\u00b2=24/\u03bb\u2074\u22124/\u03bb\u2074=20/\u03bb\u2074.",
  },
  { id:"m6q6",module:"m6",difficulty:"hard",
    question:"Shootout X~Geo(5/12), played 7 days. T=total rounds in a week. Var(T)=?",
    options:["588/25","7\u00b2\u00d784/25","7\u00d712/5","49/25"],answer:0,
    explanation:"T=X\u2081+...+X\u2087 iid. Var(T)=7Var(X)=7\u00d784/25=588/25.",
  },
  { id:"m6q7",module:"m6",difficulty:"hard",
    question:"Archer hits 1m radius disk uniformly. X=distance from center. E[X]=?",
    options:["1/3","1/2","2/3","\u03c0/4"],answer:2,
    explanation:"f_X(x)=2x on [0,1] (ring area element). E[X]=\u222b\u2080\u00b9x(2x)dx=2/3.",
    hint:"The PDF of the distance for a uniform disk is f(x)=2x, not uniform.",
  },
  { id:"m6q8",module:"m6",difficulty:"hard",
    question:"X~P(\u03bb). Using factorial moments, find E[X\u00b3].",
    options:["\u03bb\u00b3+3\u03bb\u00b2+\u03bb","\u03bb\u00b3+\u03bb\u00b2+\u03bb","\u03bb\u00b3+3\u03bb","\u03bb(\u03bb+1)(\u03bb+2)"],answer:0,
    explanation:"E[X\u00b3\u22123X\u00b2+2X]=\u03bb\u00b3. E[X\u00b3]=\u03bb\u00b3+3(\u03bb\u00b2+\u03bb)\u22122\u03bb=\u03bb\u00b3+3\u03bb\u00b2+\u03bb.",
  },
  { id:"m6q9",module:"m6",difficulty:"hard",
    question:"Rayleigh: f(x)=xe^{\u2212x\u00b2/2}, x>0. E[X^t]=2^{t/2}\u0393(t/2+1). Find Var(X).",
    options:["2\u2212\u03c0/2","1\u2212\u03c0/4","\u03c0/2\u22121","\u03c0\u22122"],answer:0,
    explanation:"E[X]=\u221a(\u03c0/2). E[X\u00b2]=2. Var=2\u2212\u03c0/2.",
    hint:"\u0393(3/2)=\u221a\u03c0/2, \u0393(2)=1.",
  },
  { id:"m6q10",module:"m6",difficulty:"medium",
    question:"X~Exp(\u03bb), Y=aX+b. E[Y] and Var(Y)=?",
    options:["E=a/\u03bb+b, Var=a\u00b2/\u03bb\u00b2","E=a/\u03bb, Var=a/\u03bb\u00b2","E=a/\u03bb+b, Var=a/\u03bb\u00b2","E=(a+b)/\u03bb, Var=1/\u03bb\u00b2"],answer:0,
    explanation:"E[Y]=aE[X]+b=a/\u03bb+b. Var(Y)=a\u00b2Var(X)=a\u00b2/\u03bb\u00b2.",
  },
  { id:"m6q11",module:"m6",difficulty:"hard",
    question:"X~Unif(0,1). E[X^n] for positive integer n = ?",
    options:["1/(n+1)","n/(n+1)","1/n","n!"],answer:0,
    explanation:"E[X\u207f]=\u222b\u2080\u00b9x\u207fdx=1/(n+1).",
  },
  { id:"m6q12",module:"m6",difficulty:"hard",
    question:"X~Gamma(\u03b1,\u03bb). E[X] and Var(X) = ?",
    options:["E=\u03b1/\u03bb, Var=\u03b1/\u03bb\u00b2","E=\u03bb/\u03b1, Var=\u03bb/\u03b1\u00b2","E=\u03b1, Var=\u03bb","E=\u03b1\u03bb, Var=\u03b1\u03bb\u00b2"],answer:0,
    explanation:"Gamma(\u03b1,\u03bb): E=\u03b1/\u03bb, Var=\u03b1/\u03bb\u00b2. Special case \u03b1=1: Exp(\u03bb). For integer \u03b1=k: sum of k iid Exp(\u03bb) RVs.",
  },
]

/* ─── MAIN COMPONENT ─── */
export default function StatMasteryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("concepts")
  const [activeModule, setActiveModule] = useState<ModuleId>("m1")

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 selection:bg-indigo-500/30">
      <nav className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <GraduationCap className="w-3 h-3" /> STAT 2400 · Final Exam Prep
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-indigo-400 bg-clip-text text-transparent">STAT 2400 Mastery</h1>
          <p className="text-gray-500 text-sm max-w-2xl">All 6 modules covered. Concepts with formulas, exam-level scenario trainer, and timed mock test with real questions from the sample finals. Focus: Units 4, 5, 6.</p>
        </motion.div>

        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {([
            { id: "concepts", label: "📚 All Concepts" },
            { id: "trainer", label: "🧠 Scenario Trainer" },
            { id: "practice", label: "⚡ Practice Problems" },
            { id: "test", label: "🎯 Mock Exam" },
          ] as { id: Tab; label: string }[]).map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={cn("px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border", activeTab === t.id ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-200")}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.18 }}>
            {activeTab === "concepts" && <ConceptsTab activeModule={activeModule} setActiveModule={setActiveModule} />}
            {activeTab === "trainer" && <TrainerTab />}
            {activeTab === "practice" && <PracticeTab />}
            {activeTab === "test" && <MockExamTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/* ─── CONCEPTS TAB ─── */
function ConceptsTab({ activeModule, setActiveModule }: { activeModule: ModuleId; setActiveModule: (m: ModuleId) => void }) {
  const mod = MODULES.find(m => m.id === activeModule)!
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    sky: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  }
  const activeBtnClass: Record<string, string> = {
    indigo: "bg-indigo-600 border-indigo-400 text-white",
    sky: "bg-sky-600 border-sky-400 text-white",
    emerald: "bg-emerald-600 border-emerald-400 text-white",
    amber: "bg-amber-600 border-amber-400 text-white",
    violet: "bg-violet-600 border-violet-400 text-white",
    rose: "bg-rose-600 border-rose-400 text-white",
  }

  return (
    <div className="space-y-6">
      {/* Module selector */}
      <div className="flex gap-2 flex-wrap">
        {MODULES.map(m => (
          <button key={m.id} onClick={() => setActiveModule(m.id)} className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all", activeModule === m.id ? activeBtnClass[m.color] : "bg-white/5 border-white/10 text-gray-500 hover:text-white")}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="glass p-6 rounded-[32px] border-white/5 space-y-2">
        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border", colorMap[mod.color])}>
          <GraduationCap className="w-3 h-3" />{mod.label}
        </div>
        <h2 className="text-2xl font-black">{mod.title}</h2>
      </div>

      <div className="space-y-4">
        {mod.topics.map((topic, ti) => (
          <div key={ti} className="glass p-6 rounded-[28px] border-white/5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black">{topic.name}</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{topic.summary}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {topic.formulas.map((f, fi) => (
                <div key={fi} className={cn("p-4 rounded-2xl border space-y-2", colorMap[mod.color].replace("text-", "border-").split(" ")[0].replace("bg-", "bg-").replace("border-white/5", "border-") + " " + colorMap[mod.color].split(" ")[0] + " border " + colorMap[mod.color].split(" ")[1])}>
                  <div className="bg-black/40 p-3 rounded-xl">
                    <MathRenderer tex={f.tex} block className={cn("text-sm", colorMap[mod.color].split(" ")[2])} />
                  </div>
                  <p className="text-[9px] text-gray-600 uppercase font-black">{f.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-6 rounded-[28px] border-white/5">
        <div className="flex items-center gap-2 mb-4"><Info className="w-4 h-4 text-amber-400" /><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Exam Focus (from lecturer note)</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {["Modules 4, 5, 6 are the primary focus of the final exam.", "MGFs (Section 6.4) will NOT be tested.", "Sections 2.3, Prop 4.8, Def 4.14, Thm 5.18, Prop 6.8 excluded."].map((n, i) => (
            <div key={i} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-[10px] text-gray-500 leading-relaxed">{n}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── SCENARIO TRAINER ─── */
const SCENARIOS = [
  {
    prompt: `An urn has 1 red + 1 blue. Draw, replace + add same color (Pólya). What's P(red on draws 1, 2, and 3)?`,
    q1: "What rule applies for P(R₁ ∩ R₂ ∩ R₃)?", c1: ["Bayes' Theorem", "Multiplication Rule", "Inclusion-Exclusion", "Addition Rule"], a1: "Multiplication Rule",
    q2: "After R₁, the urn has [2R, 1B]. After R₂ (red), urn has [3R, 1B]. P(R₃ | R₁R₂) = ?", c2: ["3/4", "2/4", "1/4", "3/5"], a2: "3/4",
    result: "P(R₁R₂R₃) = (1/2)(2/3)(3/4) = 1/4", hint: "At each step: urn size increases by 1, red count increases if red drawn."
  },
  {
    prompt: `X ~ Exp(λ=1/2). Find P(X > 3 | X > 1) using the memoryless property.`,
    q1: "What does the memoryless property say about P(X > s+t | X > s)?", c1: ["= P(X > s+t)", "= P(X > t)", "= e^{-λs}", "= F(t)"], a1: "= P(X > t)",
    q2: "P(X > 3 | X > 1) = P(X > 2) = ?", c2: ["e^{-1}", "e^{-2/λ}", "e^{-1/2}×2", "1−e^{-1}"], a2: "e^{-1}",
    result: "P(X>3|X>1) = P(X>2) = e^{-λ·2} = e^{-(1/2)(2)} = e^{-1} ≈ 0.368", hint: "t = 3-1 = 2. Memoryless: P(X>3|X>1) = P(X>2)."
  },
  {
    prompt: `X has PDF f(x) = 3x² for 0 < x < 1. Y = X². Find f_Y(y).`,
    q1: "g(x) = x² has which property on (0,1)?", c1: ["Strictly decreasing", "Strictly increasing (monotone)", "Non-monotone", "Constant"], a1: "Strictly increasing (monotone)",
    q2: "g⁻¹(y) = y^{1/2}. What is |d/dy [y^{1/2}]|?", c2: ["2y^{1/2}", "1/(2y^{1/2})", "1/y^{1/2}", "y^{−1}"], a2: "1/(2y^{1/2})",
    result: "f_Y(y) = f_X(√y) × 1/(2√y) = 3y × 1/(2√y) = (3/2)y^{1/2} for 0<y<1.", hint: "Substitute into transformation formula: f_Y(y)=f_X(g⁻¹(y))×|Jacobian|."
  },
  {
    prompt: `A shootout ends each round with probability p=5/12 (only one player scores). X = # rounds. Find P(X=k), E[X], Var(X).`,
    q1: "X follows which distribution?", c1: ["Binomial(n, 5/12)", "Geometric(5/12)", "Negative Binomial(2, 5/12)", "Poisson(5/12)"], a1: "Geometric(5/12)",
    q2: "E[Geometric(p)] = ?", c2: ["p", "1/p", "p/(1-p)", "(1-p)/p"], a2: "1/p",
    result: "P(X=k)=(7/12)^{k-1}(5/12). E[X]=12/5=2.4 rounds. Var(X)=(1-p)/p²=(7/12)/(25/144)=7×144/(12×25)=84/25.", hint: "Geometric models wait until first success. p=5/12 is probability a round decides a winner."
  },
]

function TrainerTab() {
  const [idx, setIdx] = useState(0)
  const [step, setStep] = useState(1)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const s = SCENARIOS[idx]

  const check = (choice: string, correct: string) => {
    if (choice === correct) {
      setFeedback("✓ Correct")
      if (step === 1) setTimeout(() => { setStep(2); setFeedback(null) }, 700)
      else setTimeout(() => { setFeedback(null); setStep(1); setIdx(i => (i + 1) % SCENARIOS.length); setShowHint(false) }, 900)
    } else setFeedback(`✗ Incorrect. Try again.`)
  }

  const choices = step === 1 ? s.c1 : s.c2
  const question = step === 1 ? s.q1 : s.q2
  const correct = step === 1 ? s.a1 : s.a2

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0"><Brain className="w-5 h-5" /></div>
          <div>
            <p className="text-[9px] uppercase font-black text-gray-600 mb-2">Scenario {idx + 1}/{SCENARIOS.length}</p>
            <p className="text-base font-bold text-gray-200 leading-relaxed italic">&quot;{s.prompt}&quot;</p>
          </div>
        </div>
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className={cn("px-2.5 py-1 rounded-xl text-[9px] font-black uppercase border", step >= 1 ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "bg-white/3 border-white/5 text-gray-700")}>Step 1</span>
            <span className={cn("px-2.5 py-1 rounded-xl text-[9px] font-black uppercase border", step >= 2 ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "bg-white/3 border-white/5 text-gray-700")}>Step 2</span>
          </div>
          <h3 className="text-lg font-bold">{question}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {choices.map(ch => (
              <button key={ch} onClick={() => check(ch, correct)} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-sm font-bold text-left">
                {ch}
              </button>
            ))}
          </div>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("p-3 rounded-xl text-[11px] font-black uppercase tracking-widest", feedback.includes("✓") ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400")}>
              {feedback}
            </motion.div>
          )}
        </div>
        <div className="pt-4 border-t border-white/5 flex items-start justify-between gap-4">
          <button onClick={() => setShowHint(!showHint)} className="text-[9px] font-black uppercase tracking-widest text-gray-700 hover:text-amber-400 transition-colors flex items-center gap-1.5"><Lightbulb className="w-3 h-3" />{showHint ? "Hide" : "Show"} Hint</button>
          {showHint && <p className="text-[10px] text-amber-400 italic flex-1">{s.hint}</p>}
        </div>
      </div>
      <div className="glass p-5 rounded-2xl border-emerald-500/10 space-y-2">
        <p className="text-[9px] uppercase font-black text-gray-600">Final Answer</p>
        <p className="text-sm font-mono text-emerald-400">{s.result}</p>
      </div>
    </div>
  )
}

/* ─── PRACTICE (Stepwise problem generator) ─── */
function PracticeTab() {
  const [current, setCurrent] = useState<{ title: string; text: string; steps: { t: string; d: string }[] } | null>(null)
  const [revealed, setRevealed] = useState(0)
  const [filterModule, setFilterModule] = useState<ModuleId | "all">("all")

  const generate = (mod?: ModuleId) => {
    setRevealed(0)
    const questions = mod ? EXAM_QUESTIONS.filter(q => q.module === mod) : EXAM_QUESTIONS
    const q = questions[Math.floor(Math.random() * questions.length)]
    setCurrent({
      title: MODULES.find(m => m.id === q.module)?.title ?? "",
      text: q.question,
      steps: [
        { t: "Identify the Setup", d: `Module: ${q.module.toUpperCase()}. Identify what type of problem this is. ${q.hint ?? ""}` },
        { t: "Choose the Right Tool", d: `${q.explanation.split(".")[0]}.` },
        { t: "Execute the Calculation", d: q.explanation },
        { t: "Final Answer", d: `Correct option: "${q.options[q.answer]}"` },
      ],
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="glass p-5 rounded-[28px] border-white/5 space-y-4">
          <p className="text-[9px] uppercase font-black text-gray-600">Generate Practice Problem</p>
          <div className="space-y-2">
            {([["all", "Any Module"], ["m1", "Module 1 — Sets & Axioms"], ["m2", "Module 2 — Combinatorics"], ["m3", "Module 3 — Conditional P"], ["m4", "Module 4 — Discrete RV"], ["m5", "Module 5 — Continuous RV"], ["m6", "Module 6 — E[X] & Var"]] as [ModuleId | "all", string][]).map(([id, label]) => (
              <button key={id} onClick={() => { setFilterModule(id); generate(id === "all" ? undefined : id) }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-[10px] font-black text-left transition-all", filterModule === id ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "bg-white/3 border-white/5 text-gray-600 hover:text-white")}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => generate(filterModule === "all" ? undefined : filterModule)} className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> New Problem
          </button>
        </div>
      </div>

      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div key={current.text.slice(0, 20)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-[32px] border-white/5 space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2">{current.title}</p>
                <p className="text-base font-bold leading-relaxed text-gray-200">{current.text}</p>
              </div>
              <div className="space-y-3 pt-4 border-t border-white/5">
                {current.steps.slice(0, revealed).map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-white/3 border border-white/5">
                    <p className="text-[9px] font-black uppercase text-indigo-400 mb-1">{s.t}</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{s.d}</p>
                  </motion.div>
                ))}
                {revealed < current.steps.length && (
                  <button onClick={() => setRevealed(r => r + 1)} className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold flex items-center justify-center gap-2">
                    Reveal Step {revealed + 1}/{current.steps.length} <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="glass p-12 rounded-[32px] border-white/5 flex flex-col items-center justify-center text-center h-full gap-4">
              <BarChart3 className="w-12 h-12 text-indigo-400/30" />
              <p className="text-gray-700 font-bold">Click a module or &quot;New Problem&quot; to begin</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── MOCK EXAM ─── */
function MockExamTab() {
  const [state, setState] = useState<"idle" | "playing" | "review">("idle")
  const [questions, setQuestions] = useState<ExamQ[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [chosen, setChosen] = useState<number | null>(null)
  const [showExp, setShowExp] = useState(false)
  const [moduleFilter, setModuleFilter] = useState<ModuleId | "all">("all")

  const startExam = () => {
    const pool = moduleFilter === "all" ? [...EXAM_QUESTIONS] : EXAM_QUESTIONS.filter(q => q.module === moduleFilter)
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(8, pool.length))
    setQuestions(shuffled)
    setAnswers([])
    setCurrent(0)
    setChosen(null)
    setShowExp(false)
    setState("playing")
  }

  const submitAnswer = () => {
    if (chosen === null) return
    setAnswers(a => [...a, chosen])
    setShowExp(true)
  }

  const nextQ = () => {
    if (current < questions.length - 1) { setCurrent(c => c + 1); setChosen(null); setShowExp(false) }
    else setState("review")
  }

  const score = useMemo(() => answers.filter((a, i) => a === questions[i]?.answer).length, [answers, questions])

  if (state === "idle") return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 max-w-2xl mx-auto">
      <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"><ClipboardCheck className="w-12 h-12" /></div>
      <div className="space-y-3">
        <h2 className="text-4xl font-black tracking-tighter">Mock Final Exam</h2>
        <p className="text-gray-500 text-sm leading-relaxed">8 exam-level questions drawn from all modules — the same difficulty as the real sample finals. Full worked explanations after each question.</p>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {([["all", "All Modules"], ["m4", "Module 4"], ["m5", "Module 5"], ["m6", "Module 6"]] as [ModuleId | "all", string][]).map(([id, label]) => (
          <button key={id} onClick={() => setModuleFilter(id)} className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase border transition-all", moduleFilter === id ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "bg-white/5 border-white/10 text-gray-600 hover:text-white")}>
            {label}
          </button>
        ))}
      </div>
      <button onClick={startExam} className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black uppercase tracking-widest transition-all hover:scale-105 text-sm">
        Start Exam
      </button>
    </div>
  )

  if (state === "review") {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
        <div className="glass p-8 rounded-[40px] border-white/5 text-center space-y-6">
          <div className="w-28 h-28 rounded-full border-4 flex items-center justify-center mx-auto" style={{ borderColor: pct >= 80 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444" }}>
            <span className="text-3xl font-black">{pct}%</span>
          </div>
          <div>
            <h2 className="text-2xl font-black">{pct >= 80 ? "Excellent!" : pct >= 60 ? "Good effort" : "Keep studying"}</h2>
            <p className="text-gray-500 text-sm mt-1">{score}/{questions.length} correct</p>
          </div>
        </div>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className={cn("glass p-5 rounded-2xl border", answers[i] === q.answer ? "border-emerald-500/20" : "border-red-500/20")}>
              <div className="flex items-start gap-3">
                {answers[i] === q.answer ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-300 mb-1">{q.question}</p>
                  <p className={cn("text-[10px] font-black", answers[i] === q.answer ? "text-emerald-400" : "text-red-400")}>{answers[i] === q.answer ? "✓ " : "✗ You: " + q.options[answers[i]] + " | "} Correct: {q.options[q.answer]}</p>
                  <p className="text-[10px] text-gray-600 mt-1.5 leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setState("idle")} className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-black text-sm transition-all">
          Try Again
        </button>
      </motion.div>
    )
  }

  /* playing */
  const q = questions[current]
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {questions.map((_, i) => <div key={i} className={cn("w-2 h-2 rounded-full", i < current ? "bg-indigo-400" : i === current ? "bg-white" : "bg-white/10")} />)}
        </div>
        <span className="text-[10px] text-gray-600 font-mono uppercase font-black">Q{current + 1} / {questions.length}</span>
      </div>

      <div className="glass p-8 rounded-[40px] border-white/5 space-y-6">
        <div className="flex items-start gap-3">
          <span className={cn("px-2 py-1 rounded-lg text-[8px] font-black uppercase border shrink-0", q.difficulty === "hard" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400")}>{q.difficulty}</span>
          <span className="px-2 py-1 rounded-lg text-[8px] font-black uppercase border bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shrink-0">{q.module.toUpperCase()}</span>
        </div>
        <p className="text-lg font-bold leading-relaxed">{q.question}</p>
        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt, oi) => (
            <button key={oi} onClick={() => !showExp && setChosen(oi)} disabled={showExp} className={cn("p-4 rounded-2xl border text-sm font-bold text-left transition-all", showExp && oi === q.answer ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : showExp && oi === chosen && chosen !== q.answer ? "border-red-500 bg-red-500/10 text-red-400" : chosen === oi ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-white/5 bg-white/3 text-gray-400 hover:border-white/20")}>
              <span className="text-[10px] text-gray-600 font-mono mr-2">{String.fromCharCode(65 + oi)}.</span> {opt}
            </button>
          ))}
        </div>

        {showExp && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
            <p className="text-[9px] font-black uppercase text-indigo-400">Explanation</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">{q.explanation}</p>
            {q.hint && <p className="text-[10px] text-amber-400 italic">💡 {q.hint}</p>}
          </motion.div>
        )}

        <div className="flex gap-3">
          {!showExp ? (
            <button onClick={submitAnswer} disabled={chosen === null} className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-black text-xs transition-all">Submit Answer</button>
          ) : (
            <button onClick={nextQ} className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all">
              {current < questions.length - 1 ? "Next Question →" : "See Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
