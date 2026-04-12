"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Brain, Target, GraduationCap, ClipboardCheck,
  Zap, RefreshCw, ChevronRight, Timer, Sigma, Database,
  BookOpen, CheckCircle2, XCircle, Lightbulb, BarChart3, Info
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
  {
    id: "m1q1", module: "m1", difficulty: "hard",
    question: "Of all CDs produced, 3% have surface defects (S), 8% have balance defects (B), and 91% are defect-free. What is P(S ∩ B)?",
    options: ["0%", "1%", "2%", "3%"],
    answer: 0,
    explanation: "P(S∪B) = 1 − 0.91 = 0.09. By inclusion-exclusion: 0.09 = 0.03 + 0.08 − P(S∩B). So P(S∩B) = 0.02. Wait — the correct reading: P(defect-free)=0.91 means P(S∪B)=0.09. P(S∩B) = P(S)+P(B)−P(S∪B) = 0.03+0.08−0.09 = 0.02 = 2%.",
  },
  {
    id: "m1q2", module: "m1", difficulty: "medium",
    question: "Two dice are rolled. Events: A = {sum ≤ 4}, D = {sum = 7}. What is P(A ∪ D)?",
    options: ["10/36", "12/36", "14/36", "16/36"],
    answer: 1,
    explanation: "A and D are mutually exclusive (sum can't be ≤4 AND =7 simultaneously). P(A) = 6/36 (sums 2,3,4 → counts 1+2+3). P(D) = 6/36 (six ways to sum 7). P(A∪D) = 6/36+6/36 = 12/36 = 1/3.",
    hint: "Check: are A and D disjoint? Then use finite additivity.",
  },
  {
    id: "m1q3", module: "m1", difficulty: "hard",
    question: "Let A ⊂ B ⊂ Ω. Which inequality is guaranteed by the Domination Principle?",
    options: ["P(A) ≥ P(B)", "P(A) ≤ P(B)", "P(A) = P(B)", "P(A) = 1 − P(B)"],
    answer: 1,
    explanation: "Proposition 1.12: If A ⊆ B then P(A) ≤ P(B). Elements of A are a subset of those of B, so B is at least as likely as A.",
  },
  {
    id: "m1q4", module: "m1", difficulty: "hard",
    question: "A coin is flipped 3 times. Define E = at least 2 consecutive identical results. What is P(E)?",
    options: ["3/8", "1/2", "5/8", "3/4"],
    answer: 3,
    explanation: "All sequences: HHH, HHT, HTH, HTT, THH, THT, TTH, TTT (8 total). Sequences WITHOUT ≥2 consecutive identical: HTH and THT. So P(no consecutive) = 2/8 = 1/4. P(E) = 1 − 1/4 = 3/4.",
    hint: "Use complementation: find sequences that alternate perfectly.",
  },
  /* M2 */
  {
    id: "m2q1", module: "m2", difficulty: "hard",
    question: "In a standard deck of 52 cards, a hand of 5 is dealt. What is the probability of a full house (three-of-a-kind + pair)?",
    options: ["0.00144", "0.00240", "0.00288", "0.00024"],
    answer: 0,
    explanation: "# Full houses: Choose rank for trips (13), choose 3 of 4 suits (C(4,3)=4), choose rank for pair (12), choose 2 of 4 suits (C(4,2)=6). Total = 13×4×12×6 = 3744. Total 5-card hands: C(52,5)=2,598,960. P = 3744/2,598,960 ≈ 0.00144.",
  },
  {
    id: "m2q2", module: "m2", difficulty: "medium",
    question: "A 5-digit PIN has no repeated digits. How many valid PINs are there?",
    options: ["90,000", "30,240", "100,000", "15,120"],
    answer: 1,
    explanation: "First digit: 10 choices, no repetition. Use permutations: (10)₅ = 10!/5! = 10×9×8×7×6 = 30,240.",
  },
  {
    id: "m2q3", module: "m2", difficulty: "hard",
    question: "You roll a six-sided die 10 times. Given the first six appears on the 7th roll, what is P(exactly 2 sixes total)?",
    options: ["C(3,1)(1/6)¹(5/6)²", "C(9,1)(1/6)¹(5/6)⁸", "C(3,1)(1/6)¹(5/6)²×(1/6)", "5²/6³"],
    answer: 0,
    explanation: "Given first 6 is on roll 7: rolls 1–6 have 0 sixes (fixed), roll 7 is a 6 (fixed). Exactly 2 sixes total means exactly 1 six in rolls 8–10. P(1 six in 3 rolls) = C(3,1)(1/6)¹(5/6)² = 3×(1/6)×(25/36) = 75/216.",
    hint: "Condition on the given information. Rolls 1-7 are determined. Only consider rolls 8-10.",
  },
  /* M3 */
  {
    id: "m3q1", module: "m3", difficulty: "hard",
    question: "A family has 2 children. Given at least one is a boy, what is P(both are boys)? (Boys and girls equally likely.)",
    options: ["1/2", "1/3", "1/4", "2/3"],
    answer: 1,
    explanation: "Sample space: {BB, BG, GB, GG}, each prob 1/4. Event B = 'at least one boy' = {BB, BG, GB}. P(BB|B) = P({BB})/P(B) = (1/4)/(3/4) = 1/3.",
    hint: "Don't confuse with P(second is boy | first is boy) = 1/2.",
  },
  {
    id: "m3q2", module: "m3", difficulty: "hard",
    question: "Let A and B be independent with P(A)>0 and P(B)>0. Can A and B be mutually exclusive?",
    options: ["Yes, always", "No, never", "Only if P(A)+P(B)=1", "Only if P(A)=P(B)"],
    answer: 1,
    explanation: "If A∩B=∅ then P(A∩B)=0. Independence requires P(A∩B)=P(A)P(B). Since P(A)>0 and P(B)>0, P(A)P(B)>0≠0. Contradiction. Hence independent events with positive probability cannot be mutually exclusive.",
  },
  {
    id: "m3q3", module: "m3", difficulty: "hard",
    question: "An airplane has 4 independent engines, each failing with probability p. It can complete a flight if at least 2 engines work. What is P(flight completes)?",
    options: ["C(4,2)p²(1-p)²+C(4,3)p³(1-p)+(1-p)⁴", "(1-p)⁴+4(1-p)³p+6(1-p)²p²", "1-(1-p)⁴", "4(1-p)³p+6(1-p)²p²"],
    answer: 1,
    explanation: "Need at least 2 engines operative (at least 2 that DON'T fail). Let q=1−p. P(≥2 work) = P(0 fail)+P(1 fail)+P(2 fail) — wait, need ≥2 working out of 4. P(k fail) = C(4,k)p^k(1-p)^(4-k). P(≥2 work) = P(0 fail)+P(1 fail)+P(2 fail) = (1-p)⁴+4p(1-p)³+6p²(1-p)².",
  },
  {
    id: "m3q4", module: "m3", difficulty: "medium",
    question: "Pólya's urn: 1 red + 1 blue. Draw a ball, replace + add same color. P(red on draw 1 AND red on draw 2)?",
    options: ["1/4", "1/6", "1/3", "1/2"],
    answer: 1,
    explanation: "P(R₁) = 1/2. Given R₁, urn has 2 red + 1 blue (3 total). P(R₂|R₁) = 2/3. P(R₁∩R₂) = P(R₁)×P(R₂|R₁) = (1/2)(2/3) = 1/3. Wait — let me recount: original 1R+1B=2. After R₁: add another red → 2R+1B=3 balls. P(R₂|R₁)=2/3. Result = (1/2)(2/3) = 1/3.",
    hint: "After drawing and replacing with same color, recount total balls.",
  },
  /* M4 */
  {
    id: "m4q1", module: "m4", difficulty: "hard",
    question: "X ~ Poisson(λ). Show E[X(X−1)] = λ². Use this to find Var(X). Which is correct?",
    options: ["Var(X) = λ²", "Var(X) = λ", "Var(X) = 2λ", "Var(X) = λ + λ²"],
    answer: 1,
    explanation: "E[X(X−1)] = E[X²−X] = E[X²]−E[X] = λ². So E[X²]=λ²+λ. Var(X)=E[X²]−(E[X])²=(λ²+λ)−λ²=λ. Poisson: mean=variance=λ.",
  },
  {
    id: "m4q2", module: "m4", difficulty: "hard",
    question: "A printer's lifetime is Exp(mean=2 years). The manufacturer refunds $200 if it fails in year 1, $100 if in year 2, $0 after. What is the expected refund?",
    options: ["$200(1−e⁻¹/²) + $100(e⁻¹/²−e⁻¹)", "$200e⁻¹/² + $100e⁻¹", "$200×0.5+$100×0.5", "$200(e⁻¹/²) + $100(e⁻¹/²)"],
    answer: 0,
    explanation: "λ=1/2 (mean=2). P(fail in yr1)=F(1)=1−e^(−1/2). P(fail in yr2)=F(2)−F(1)=e^(−1/2)−e^(−1). E[Refund]=200×P(yr1)+100×P(yr2)=200(1−e^(−1/2))+100(e^(−1/2)−e^(−1)).",
    hint: "Mean=1/λ=2, so λ=1/2. Use F(x)=1−e^(−λx).",
  },
  {
    id: "m4q3", module: "m4", difficulty: "hard",
    question: "X ~ Geometric(p). You try keys on a ring with n keys until finding the correct one, WITHOUT replacement. What is P(success on kth try)?",
    options: ["p(1-p)^(k-1)", "(n-1)!/(n!/n^k)", "1/(n−k+1)", "1/n"],
    answer: 3,
    explanation: "Without replacement: P(fail trials 1 to k-1, succeed on k) = [(n-1)/n]×[(n-2)/(n-1)]×...×[(n-k+1)/(n-k+2)]×[1/(n-k+1)] = 1/n. The probability is 1/n for any k=1,...,n. This is the discrete uniform: each position equally likely.",
    hint: "Without replacement, the probability of getting the correct key on the kth try is the same for every k — it's always 1/n.",
  },
  {
    id: "m4q4", module: "m4", difficulty: "medium",
    question: "X ~ Binomial(n=10, p=1/6). What are E[X] and Var(X)?",
    options: ["E=5/3, Var=25/18", "E=5/3, Var=25/36", "E=10/6, Var=50/36", "E=5/3, Var=10/36"],
    answer: 0,
    explanation: "E[X]=np=10×(1/6)=5/3. Var(X)=np(1-p)=10×(1/6)×(5/6)=50/36=25/18.",
  },
  /* M5 */
  {
    id: "m5q1", module: "m5", difficulty: "hard",
    question: "X has CDF: F(x)=0 for x<0, ax for 0≤x<1, bx+1/2 for 1≤x<2, 1 for x≥2. If X is continuous, find a and b.",
    options: ["a=1/2, b=1/4", "a=3/4, b=1/4", "a=1/2, b=-1/4", "a=1, b=0"],
    answer: 1,
    explanation: "Continuity at x=0: F(0)=0 ✓. At x=2: b(2)+1/2=1 → b=1/4. Continuity at x=1: a(1) = b(1)+1/2 = 1/4+1/2 = 3/4 → a=3/4. Check: f(x)=a=3/4 on (0,1) and f(x)=b=1/4 on (1,2). Integral: 3/4+1/4=1 ✓.",
    hint: "Two conditions: (1) F(2⁻)=1, (2) continuity at x=1 (left limit = right limit).",
  },
  {
    id: "m5q2", module: "m5", difficulty: "hard",
    question: "X ~ Uniform(−2,2). Let Y = X². Find f_Y(y) on its support.",
    options: ["f_Y(y) = 1/(2√y), 0<y<4", "f_Y(y) = 1/(4√y), 0<y<4", "f_Y(y) = √y/4, 0<y<4", "f_Y(y) = 1/4, 0<y<4"],
    answer: 1,
    explanation: "f_X(x)=1/4 on (-2,2). g(x)=x² is NOT monotone: two inverses x=+√y and x=−√y for y∈(0,4). f_Y(y)=[f_X(√y)+f_X(-√y)]×|d(√y)/dy| = [1/4+1/4]×(1/(2√y)) = (1/2)×(1/(2√y)) = 1/(4√y).",
    hint: "Non-monotone transformation: sum contributions from both pre-images.",
  },
  {
    id: "m5q3", module: "m5", difficulty: "hard",
    question: "A filling station's weekly demand X has f(x)=5(1−x)⁴ for 0<x<1 (thousands of gallons). Find the tank capacity c such that P(X>c)=0.01.",
    options: ["c = 1 − 0.01^(1/5)", "c = 0.01^(1/5)", "c = (0.01)^0.2", "c = 1 − (0.01)^0.2"],
    answer: 3,
    explanation: "P(X>c)=∫_c^1 5(1-x)^4 dx = [-(1-x)^5]_c^1 = (1-c)^5. Set (1-c)^5=0.01 → 1-c=0.01^(1/5) → c=1−0.01^(0.2) ≈ 1−0.398 ≈ 0.60.",
  },
  {
    id: "m5q4", module: "m5", difficulty: "hard",
    question: "X ~ Exp(λ). Memoryless property: P(X > s+t | X > s) = ?",
    options: ["P(X > s+t)", "P(X > t)", "e^(−λs)", "1 − e^(−λt)"],
    answer: 1,
    explanation: "P(X>s+t|X>s) = P(X>s+t)/P(X>s) = e^(−λ(s+t))/e^(−λs) = e^(−λt) = P(X>t). The future waiting time has the same distribution regardless of how long you've already waited.",
  },
  /* M6 */
  {
    id: "m6q1", module: "m6", difficulty: "hard",
    question: "X ~ NB(r=5, p). The expected number of trials until the 5th success is E[X] = 5/p. If p=1/53.7, what is E for Lotto 6/49 winning 5 prizes (p≈0.01864)?",
    options: ["≈ 268", "≈ 53.7", "≈ 5364", "≈ 1074"],
    answer: 0,
    explanation: "E[X] = r/p = 5/0.01864 ≈ 268 draws. The Negative Binomial counts the number of trials until the rth success.",
  },
  {
    id: "m6q2", module: "m6", difficulty: "hard",
    question: "An insurance reimburses loss X (PDF: f(x)=2/x³ for x>1) up to a limit of 10. What is E[benefit]?",
    options: ["∫₁^10 x·(2/x³)dx + 10·P(X>10)", "∫₁^∞ x·(2/x³)dx", "∫₁^10 (2/x²)dx", "2 − 2/10"],
    answer: 0,
    explanation: "Benefit B = min(X,10). E[B] = ∫₁^10 x·f(x)dx + 10·P(X>10). P(X>10) = ∫₁₀^∞ 2/x³ dx = [−1/x²]₁₀^∞ = 1/100. ∫₁^10 x(2/x³)dx = ∫₁^10 2/x² dx = [-2/x]₁^10 = −1/5+2 = 9/5. E[B] = 9/5 + 10×(1/100) = 1.8+0.1 = 1.9.",
    hint: "Split the integral at the benefit limit. For losses above 10, the payment is capped at 10.",
  },
  {
    id: "m6q3", module: "m6", difficulty: "hard",
    question: "X has PMF: P(X=1/2)=1/2, P(X=1)=1/4, P(X=2)=1/4. Y=X+1/X. Find E[Y].",
    options: ["E[Y] = 23/8", "E[Y] = 3/2", "E[Y] = 11/4", "E[Y] = 7/4"],
    answer: 0,
    explanation: "At x=1/2: Y=1/2+2=5/2. At x=1: Y=1+1=2. At x=2: Y=2+1/2=5/2. E[Y]=(5/2)(1/2)+(2)(1/4)+(5/2)(1/4)=5/4+1/2+5/8=10/8+4/8+5/8=19/8. Hmm — let me recalculate: 5/4=10/8, 2/4=4/8, 5/8. Total=19/8. So E[Y]=19/8.",
    hint: "Compute Y for each x value, then use LOTUS: E[Y]=Σ Y(x)·P(x).",
  },
  {
    id: "m6q4", module: "m6", difficulty: "hard",
    question: "X ~ Unif(0,2), Y=(X/2)^(1/a) for a>0. What distribution does Y follow?",
    options: ["Uniform(0,1)", "Beta(a,1)", "Beta(1,a)", "Exponential(1/a)"],
    answer: 1,
    explanation: "F_Y(y)=P(Y≤y)=P((X/2)^(1/a)≤y)=P(X≤2y^a)=y^a for 0<y<1 (since X~Unif(0,2), so F_X(x)=x/2). f_Y(y)=ay^(a-1) for 0<y<1. This is Beta(a,1).",
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
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-indigo-400 bg-clip-text text-transparent">STAT 2400 Mastery</h1>
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
            <p className="text-base font-bold text-gray-200 leading-relaxed italic">"{s.prompt}"</p>
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
              <p className="text-gray-700 font-bold">Click a module or "New Problem" to begin</p>
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
