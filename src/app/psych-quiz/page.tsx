"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Brain, Shuffle, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Trophy, BookOpen, Layers3, Filter } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

/* ── QUESTION DATA ── */
interface Question {
  id: number
  question: string
  options: string[]
  answer: number // 0-indexed (A=0, B=1, C=2, D=3)
  topic: string
}

const QUESTIONS: Question[] = [
  { id: 1, question: "What age range defines the period of emerging adulthood?", options: ["18-25", "18-29", "20-30", "21-35"], answer: 1, topic: "Emerging Adulthood" },
  { id: 2, question: "Which of the following is considered a key feature of emerging adulthood according to Arnett?", options: ["Stability", "Identity exploration", "Other-focus", "Certainty"], answer: 1, topic: "Emerging Adulthood" },
  { id: 3, question: "At what age does peak physical performance typically occur?", options: ["16-18", "19-26", "27-30", "30-35"], answer: 1, topic: "Physical Development" },
  { id: 4, question: "Swimmers and gymnasts typically peak in their physical performance during which period?", options: ["Early teens", "Late teens", "Late 20s", "Early 30s"], answer: 1, topic: "Physical Development" },
  { id: 5, question: "Golfers and marathon runners tend to reach their peak physical performance in their:", options: ["Late teens", "Early 20s", "Late 20s", "30s"], answer: 2, topic: "Physical Development" },
  { id: 6, question: "How many hours of sleep are recommended for middle-aged and young adults?", options: ["5-7 hours", "6-8 hours", "7-9 hours", "8-10 hours"], answer: 2, topic: "Health & Lifestyle" },
  { id: 7, question: "What percentage of university students report that they do not get enough sleep?", options: ["10%", "25%", "50%", "70%"], answer: 3, topic: "Health & Lifestyle" },
  { id: 8, question: "Binge drinking is generally defined as consuming how many drinks on a single occasion?", options: ["2-3", "3-4", "5-10", "10+"], answer: 2, topic: "Health & Lifestyle" },
  { id: 9, question: "According to Piaget's extended theories, what cognitive stage emerges during early adulthood?", options: ["Preoperational", "Concrete operational", "Postformal thought", "Pragmatic thought"], answer: 2, topic: "Cognitive Development" },
  { id: 10, question: "Postformal thought is characterized as all of the following EXCEPT:", options: ["Reflective", "Abstract", "Realistic", "Provisional"], answer: 1, topic: "Cognitive Development" },
  { id: 11, question: "Which country boasts the lowest obesity rate among adults?", options: ["Canada", "Japan", "United States", "Norway"], answer: 1, topic: "Health & Lifestyle" },
  { id: 12, question: "In the Sex in America survey, which demographic reported having sex most often?", options: ["Single adults", "Married and cohabitating couples", "Emerging adults", "Older adults"], answer: 1, topic: "Relationships & Sexuality" },
  { id: 13, question: "The \"career-and-care crunch\" is a challenge heavily associated with which life phase?", options: ["Emerging adulthood", "Established adulthood", "Middle adulthood", "Late adulthood"], answer: 1, topic: "Middle Adulthood" },
  { id: 14, question: "Amotivation is defined as a state in which an individual:", options: ["Rejects growth and lacks inspiration", "Is intrinsically motivated", "Does something for a reward", "Sets challenging goals"], answer: 0, topic: "Motivation & Achievement" },
  { id: 15, question: "Grit is strongly linked to academic engagement and involves:", options: ["Setting easy goals", "Passion and persistence in achieving long-term goals", "Amotivation", "Expectancy value"], answer: 1, topic: "Motivation & Achievement" },
  { id: 16, question: "Most opioid overdose deaths (94%) are classified as:", options: ["Intentional", "Accidental", "Homicidal", "Suicidal"], answer: 1, topic: "Health & Lifestyle" },
  { id: 17, question: "The mean age of marriage for men has risen to:", options: ["28.5", "29.6", "31.6", "35.2"], answer: 2, topic: "Relationships & Sexuality" },
  { id: 18, question: "\"Hooking up\" in early adulthood is strongly linked to:", options: ["High grades", "Impulsivity, sensation seeking, and alcohol use", "Long-term commitment", "Reduced impulsivity"], answer: 1, topic: "Relationships & Sexuality" },
  { id: 19, question: "Creativity typically peaks during which period of life?", options: ["20s", "30s", "40s", "50s"], answer: 1, topic: "Cognitive Development" },
  { id: 20, question: "Which of the following serves as an antecedent of grit?", options: ["Apathy", "Goal commitment", "Amotivation", "Feeling in-between"], answer: 1, topic: "Motivation & Achievement" },
  { id: 21, question: "Which adult attachment style is characterized by hesitation about romantic relationships?", options: ["Secure", "Anxious", "Avoidant", "Disorganized"], answer: 2, topic: "Attachment & Love" },
  { id: 22, question: "Anxious attachment styles typically result in individuals who are:", options: ["Easy to get close to", "Demanding of closeness and possessive", "Distant", "Highly independent"], answer: 1, topic: "Attachment & Love" },
  { id: 23, question: "Sternberg's Triarchic Model of Love consists of intimacy, commitment, and what other element?", options: ["Friendship", "Passion", "Trust", "Communication"], answer: 1, topic: "Attachment & Love" },
  { id: 24, question: "Consummate love is characterized by the presence of:", options: ["Passion only", "Intimacy and passion", "Passion, intimacy, and commitment", "Commitment only"], answer: 2, topic: "Attachment & Love" },
  { id: 25, question: "Infatuated love is defined by:", options: ["High passion with low intimacy and commitment", "High intimacy with low passion", "High commitment with low intimacy", "All three love elements"], answer: 0, topic: "Attachment & Love" },
  { id: 26, question: "Which Big Five personality factor relates to being organized or disorganized?", options: ["Openness", "Conscientiousness", "Extroversion", "Agreeableness"], answer: 1, topic: "Personality" },
  { id: 27, question: "Emotional stability corresponds to which Big Five personality factor?", options: ["Openness", "Agreeableness", "Neuroticism", "Extroversion"], answer: 2, topic: "Personality" },
  { id: 28, question: "Affectionate love occurs when:", options: ["Sexual desire is the primary ingredient", "Someone desires to have the other person near and has deep caring affection", "There is only passion", "There is only commitment"], answer: 1, topic: "Attachment & Love" },
  { id: 29, question: "Approximately what percentage of divorced adults remarry within three years of their divorce?", options: ["10%", "25%", "50%", "75%"], answer: 2, topic: "Marriage & Divorce" },
  { id: 30, question: "Divorces are most likely to occur during which years of marriage?", options: ["1st to 3rd", "5th to 10th", "10th to 15th", "20th to 25th"], answer: 1, topic: "Marriage & Divorce" },
  { id: 31, question: "Compared to men, women are closer to their friends and engage in more:", options: ["Superficial conversations", "Self-disclosure and mutual support", "Financial investments", "Shared hobbies"], answer: 1, topic: "Relationships & Sexuality" },
  { id: 32, question: "Cohabitation refers to:", options: ["Living together in a sexual relationship without being married", "Living in different cities", "Being legally married", "Having multiple partners"], answer: 0, topic: "Relationships & Sexuality" },
  { id: 33, question: "Men are more likely than women to rate their marital satisfaction as:", options: ["Lower", "Higher", "Exactly the same", "Unpredictable"], answer: 1, topic: "Marriage & Divorce" },
  { id: 34, question: "Divorced fathers face a suicide risk that is how many times higher than that of divorced mothers?", options: ["Two times", "Four times", "Six times", "Almost eight times"], answer: 3, topic: "Marriage & Divorce" },
  { id: 35, question: "Happily married people generally:", options: ["Live shorter lives", "Live longer, healthier lives", "Experience more stress", "Struggle financially"], answer: 1, topic: "Marriage & Divorce" },
  { id: 36, question: "Which factor is NOT generally linked with levels of satisfaction in a marriage?", options: ["Religiosity", "Economic status", "The number of children", "Age"], answer: 2, topic: "Marriage & Divorce" },
  { id: 37, question: "One of Gottman's principles for making marriage work involves:", options: ["Establishing love maps", "Seeking immediate divorce", "Turning away from your partner", "Avoiding shared meaning"], answer: 0, topic: "Marriage & Divorce" },
  { id: 38, question: "Gay and lesbian adult relationships are:", options: ["Vastly different from heterosexual relationships", "Very similar to heterosexual relationships", "Typically lacking commitment", "Illegal in Canada"], answer: 1, topic: "Relationships & Sexuality" },
  { id: 39, question: "In Canada, marriages last an average of how many years?", options: ["5 years", "12 years", "20 years", "30 years"], answer: 1, topic: "Marriage & Divorce" },
  { id: 40, question: "Women are more likely than men to:", options: ["Ignore marital problems", "Seek a divorce", "Remarry quickly", "Be satisfied in marriage"], answer: 1, topic: "Marriage & Divorce" },
  { id: 41, question: "Middle adulthood spans approximately what ages?", options: ["30-45", "45-65", "55-75", "65 and older"], answer: 1, topic: "Middle Adulthood" },
  { id: 42, question: "Sarcopenia is defined as:", options: ["The loss of bone mass", "An age-related loss of muscle mass", "Hearing loss", "Vision loss"], answer: 1, topic: "Physical Development" },
  { id: 43, question: "The Evolutionary Theory of Aging suggests that:", options: ["Cells divide a maximum of 75-80 times", "Free radicals damage cellular structures", "Natural selection has not eliminated many harmful conditions in older adults", "Telomeres shorten with each division"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 44, question: "According to the Cellular Clock Theory, cells can divide a maximum of how many times?", options: ["20-30", "50-60", "75-80", "100-120"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 45, question: "As individuals age into middle adulthood, which type of intelligence begins to decline?", options: ["Crystallized intelligence", "Fluid intelligence", "Emotional intelligence", "Practical intelligence"], answer: 1, topic: "Cognitive Development" },
  { id: 46, question: "Which type of intelligence consists of an individual's accumulated information and verbal skills?", options: ["Fluid intelligence", "Spatial intelligence", "Crystallized intelligence", "Bodily-kinesthetic intelligence"], answer: 2, topic: "Cognitive Development" },
  { id: 47, question: "Menopause occurs when menstrual periods cease completely, leading to a decrease in which hormone?", options: ["Testosterone", "Dopamine", "Estrogen", "Melatonin"], answer: 2, topic: "Physical Development" },
  { id: 48, question: "Explicit (declarative) memory involves:", options: ["Memory without conscious recollection", "The memory of facts and experiences that individuals consciously know", "Remembering how to drive a car", "Memory that is less affected by aging"], answer: 1, topic: "Cognitive Development" },
  { id: 49, question: "Which sensory condition involves a thickening of the lens of the eye?", options: ["Glaucoma", "Macular degeneration", "Cataracts", "Myopia"], answer: 2, topic: "Physical Development" },
  { id: 50, question: "Macular degeneration involves the deterioration of the focal center of the:", options: ["Optic nerve", "Retina", "Cornea", "Lens"], answer: 1, topic: "Physical Development" },
  { id: 51, question: "Between the ages of 20 and 90, the human brain loses what percentage of its weight on average?", options: ["1-2%", "5-10%", "15-20%", "25-30%"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 52, question: "Mild Cognitive Impairment (MCI) represents a transitional state between normal aging and:", options: ["Depression", "Early Alzheimer's disease", "Parkinson's disease", "Schizophrenia"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 53, question: "Parkinson's disease results from the loss of cells in the brain that produce:", options: ["Serotonin", "Acetylcholine", "Dopamine", "Melatonin"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 54, question: "High levels of wisdom are rare and are better predicted by factors like:", options: ["Intelligence", "Openness to experience and generativity", "Age alone", "Processing speed"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 55, question: "What is the most common type of dementia?", options: ["Vascular dementia", "Parkinson's disease", "Alzheimer's disease", "Lewy body dementia"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 56, question: "Semantic memory refers to a person's:", options: ["Retention of life's happenings", "Memory of motor skills", "Knowledge about the world", "Working memory capacity"], answer: 2, topic: "Cognitive Development" },
  { id: 57, question: "Making meaning of one's life is especially helpful during times of:", options: ["Career growth", "Chronic stress and loss", "Early adulthood transitions", "Financial prosperity"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 58, question: "Approximately what percentage of older adults complain of having difficulty sleeping?", options: ["10%", "25%", "50%", "75%"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 59, question: "Osteoporosis is characterized by:", options: ["Muscle loss", "Joint inflammation", "Loss of bone mass and increased bone fragility", "High blood pressure"], answer: 2, topic: "Physical Development" },
  { id: 60, question: "Working memory, which acts as a mental \"workbench,\" tends to:", options: ["Increase in late adulthood", "Decline during late adulthood", "Remain perfectly stable", "Peak at age 65"], answer: 1, topic: "Cognitive Development" },
  { id: 61, question: "Erikson theorized that middle-aged adults face the developmental issue of:", options: ["Intimacy vs. Isolation", "Generativity vs. Stagnation", "Integrity vs. Despair", "Identity vs. Role Confusion"], answer: 1, topic: "Erikson's Stages" },
  { id: 62, question: "Erikson's 8th and final stage of development during late adulthood is:", options: ["Generativity vs. Stagnation", "Integrity vs. Despair", "Trust vs. Mistrust", "Autonomy vs. Shame"], answer: 1, topic: "Erikson's Stages" },
  { id: 63, question: "Stagnation in middle adulthood is also referred to as:", options: ["Wisdom", "Immortality", "Self-absorption", "Despair"], answer: 2, topic: "Erikson's Stages" },
  { id: 64, question: "The term \"Sandwich Generation\" describes middle-aged adults who are alternating attention between:", options: ["Work and leisure", "Grown children and aging parents", "Grandchildren and friends", "Physical health and mental health"], answer: 1, topic: "Middle Adulthood" },
  { id: 65, question: "The Contemporary Life-Events Approach emphasizes that adult developmental change depends on:", options: ["Only the life event itself", "The life event, mediating variables, and sociohistorical contexts", "Genetic factors only", "Gender only"], answer: 1, topic: "Theories of Development" },
  { id: 66, question: "Successful aging is linked with three main factors known as the SOC theory, which stands for:", options: ["Selection, Optimization, Compensation", "Socialization, Optimization, Caring", "Selection, Organization, Control", "Stress, Overcoming, Compensation"], answer: 0, topic: "Aging & Late Adulthood" },
  { id: 67, question: "Socioemotional Selectivity Theory suggests that older adults:", options: ["Isolate themselves", "Place high value on emotional satisfaction and spend more time with familiar individuals", "Seek as many new friends as possible", "Disengage completely from society"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 68, question: "Activity theory suggests that individuals will achieve greater life satisfaction if they:", options: ["Disengage from society", "Continue their middle-adulthood roles into late adulthood", "Stop working", "Isolate themselves"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 69, question: "The most stable personality characteristics as individuals age include:", options: ["Nurturance", "Hostility", "Being intellectually oriented, self-confident, and open to new experiences", "Self-control"], answer: 2, topic: "Personality" },
  { id: 70, question: "Empty Nest Syndrome describes the grief and great loss parents may feel when:", options: ["They retire from a job", "Their adult children move away", "A spouse dies", "Friends move away"], answer: 1, topic: "Middle Adulthood" },
  { id: 71, question: "Becoming widowed is associated with what percentage of increased risk of mortality?", options: ["10%", "25%", "48%", "75%"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 72, question: "Grandparents raising their grandchildren full-time are especially at risk for:", options: ["Euphoria", "Developing depression", "Increased wealth", "Re-entering the workforce easily"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 73, question: "Sibling relationships in adulthood are often:", options: ["Typically negative", "The longest-lasting relationships individuals will have", "Rarely altruistic", "Non-existent"], answer: 1, topic: "Relationships & Sexuality" },
  { id: 74, question: "Compared to younger adults, older adults typically have:", options: ["More attachment relationships", "Fewer attachment relationships", "Higher attachment anxiety", "More insecure attachments"], answer: 1, topic: "Attachment & Love" },
  { id: 75, question: "Older adults tend to be:", options: ["More lonely than younger adults", "Less lonely than younger adults", "Equally lonely compared to younger adults", "Completely isolated"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 76, question: "Which of the following is an essential component of \"Successful Aging\"?", options: ["Emotional selectivity, optimization, and perceived control", "Disengagement", "Giving up roles", "Dependency"], answer: 0, topic: "Aging & Late Adulthood" },
  { id: 77, question: "Ageism is defined as:", options: ["A fear of aging", "Social participation by older adults", "Prejudice or discrimination based on age", "Aging gracefully"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 78, question: "Women are more likely than men to respond to stress by:", options: ["Isolating themselves", "Engaging in a \"tend-and-befriend\" pattern", "Becoming aggressive", "Ignoring the problem"], answer: 1, topic: "Gender Differences" },
  { id: 79, question: "With increasing age in late adulthood, attachment anxiety generally:", options: ["Increases", "Decreases", "Stays the same", "Fluctuates wildly"], answer: 1, topic: "Attachment & Love" },
  { id: 80, question: "Internet access and usage among seniors is:", options: ["Decreasing", "Non-existent", "Closing the gap with middle-aged adults", "Only used for gaming"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 81, question: "The neurological definition of brain death states that a person is dead when:", options: ["Breathing completely stops", "All electrical activity of the brain has ceased for a specified period", "The heart stops", "A person falls into a coma"], answer: 1, topic: "Death & Dying" },
  { id: 82, question: "What does the acronym MAID stand for?", options: ["Medical Assistance in Dying", "Medical Association in Disease", "Medicine And Illness Department", "Medical Assessment of Illness and Disease"], answer: 0, topic: "Death & Dying" },
  { id: 83, question: "Elisabeth Kübler-Ross's first stage of dying is:", options: ["Anger", "Bargaining", "Depression", "Denial and isolation"], answer: 3, topic: "Death & Dying" },
  { id: 84, question: "Kübler-Ross's final stage of dying is:", options: ["Bargaining", "Depression", "Acceptance", "Anger"], answer: 2, topic: "Death & Dying" },
  { id: 85, question: "Disenfranchised grief is defined as:", options: ["A socially ambiguous loss that cannot be openly mourned", "Normal expected grief", "Sudden onset grief", "Intense anger"], answer: 0, topic: "Death & Dying" },
  { id: 86, question: "Complicated or Prolonged grief involves feeling:", options: ["Relief", "Numb, detached, and believing life is empty without the deceased", "Excited for the future", "Immediate acceptance"], answer: 1, topic: "Death & Dying" },
  { id: 87, question: "In cases of a fatal accident, homicide, or suicide, the resulting sudden grief can often lead to:", options: ["Euphoria", "Immediate acceptance", "Posttraumatic Stress Disorder (PTSD)", "Generativity"], answer: 2, topic: "Death & Dying" },
  { id: 88, question: "Indigenous youth suicide rates are how many times higher than those of non-Indigenous youth?", options: ["Two to three times", "Five to six times", "Ten times", "They are lower"], answer: 1, topic: "Death & Dying" },
  { id: 89, question: "Which of the following is NOT one of the four meaning-making processes in grieving?", options: ["Sense making", "Benefit finding", "Disenfranchisement", "Continuing bonds"], answer: 2, topic: "Death & Dying" },
  { id: 90, question: "Most major world religions and societies view death as:", options: ["The complete end of existence", "A continuation of life after death", "Unimportant", "A myth"], answer: 1, topic: "Death & Dying" },
  { id: 91, question: "Palliative care and hospice are increasingly focused on helping individuals experience a \"good death,\" which involves:", options: ["A cure for the disease", "Prolonged life at any cost", "Physical comfort, emotional well-being, and support from loved ones", "Isolation"], answer: 2, topic: "Death & Dying" },
  { id: 92, question: "Which two are among the top causes of death for individuals aged 15 to 44?", options: ["Heart disease and cancer", "Suicide and accidents", "Alzheimer's and diabetes", "Homicide and stroke"], answer: 1, topic: "Death & Dying" },
  { id: 93, question: "A \"good death\" often includes a high preference for:", options: ["Pain-free status", "High stress", "Dying alone", "Hospital settings only"], answer: 0, topic: "Death & Dying" },
  { id: 94, question: "When facing intolerable suffering and an incurable medical condition, an individual may legally end their life through:", options: ["Denial", "MAID", "Reminiscence therapy", "Generativity"], answer: 1, topic: "Death & Dying" },
  { id: 95, question: "Bargaining, the third stage of Kübler-Ross's model, involves:", options: ["Accepting death", "Developing hope that death can be postponed", "Resentment", "Denial"], answer: 1, topic: "Death & Dying" },
  { id: 96, question: "When denial avoids the destructive impact of shock, it is considered adaptive, but if it prevents life-saving measures, it is considered:", options: ["Adaptive", "Maladaptive", "Acceptance", "Bargaining"], answer: 1, topic: "Death & Dying" },
  { id: 97, question: "Open awareness for a dying individual provides the advantage of allowing them to:", options: ["Be kept completely in the dark", "Close their lives in accord with their own ideas about proper dying", "Avoid making a will", "Suffer more anxiety"], answer: 1, topic: "Death & Dying" },
  { id: 98, question: "The meaning-making process of \"continuing bonds\" might involve:", options: ["Blaming someone", "Reminiscing and looking at photographs", "Moving away", "Denying the death"], answer: 1, topic: "Death & Dying" },
  { id: 99, question: "Historical definitions of death primarily focused on the stopping of:", options: ["Brain waves", "Breathing and heartbeat", "Coma status", "Muscle mass"], answer: 1, topic: "Death & Dying" },
  { id: 100, question: "The lower portions of the brain are responsible for monitoring:", options: ["High-level thought", "Heartbeat and respiration", "Vision", "Working memory"], answer: 1, topic: "Death & Dying" },
]

const OPTION_LABELS = ["A", "B", "C", "D"]

const TOPIC_COLORS: Record<string, { bg: string; border: string; text: string; pill: string }> = {
  "Emerging Adulthood":    { bg: "from-violet-500/15 to-purple-500/10",   border: "border-violet-500/30",  text: "text-violet-300", pill: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
  "Physical Development":  { bg: "from-rose-500/15 to-pink-500/10",       border: "border-rose-500/30",    text: "text-rose-300",   pill: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  "Health & Lifestyle":    { bg: "from-emerald-500/15 to-teal-500/10",    border: "border-emerald-500/30", text: "text-emerald-300",pill: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  "Cognitive Development": { bg: "from-sky-500/15 to-blue-500/10",        border: "border-sky-500/30",     text: "text-sky-300",    pill: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
  "Relationships & Sexuality": { bg: "from-pink-500/15 to-rose-500/10",   border: "border-pink-500/30",   text: "text-pink-300",   pill: "bg-pink-500/20 text-pink-300 border-pink-500/30" },
  "Middle Adulthood":      { bg: "from-amber-500/15 to-orange-500/10",    border: "border-amber-500/30",  text: "text-amber-300",  pill: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  "Motivation & Achievement": { bg: "from-lime-500/15 to-green-500/10",   border: "border-lime-500/30",   text: "text-lime-300",   pill: "bg-lime-500/20 text-lime-300 border-lime-500/30" },
  "Attachment & Love":     { bg: "from-red-500/15 to-rose-500/10",        border: "border-red-500/30",    text: "text-red-300",    pill: "bg-red-500/20 text-red-300 border-red-500/30" },
  "Marriage & Divorce":    { bg: "from-fuchsia-500/15 to-pink-500/10",    border: "border-fuchsia-500/30",text: "text-fuchsia-300",pill: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30" },
  "Personality":           { bg: "from-cyan-500/15 to-sky-500/10",        border: "border-cyan-500/30",   text: "text-cyan-300",   pill: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  "Erikson's Stages":      { bg: "from-indigo-500/15 to-violet-500/10",   border: "border-indigo-500/30", text: "text-indigo-300", pill: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  "Theories of Development": { bg: "from-teal-500/15 to-cyan-500/10",     border: "border-teal-500/30",   text: "text-teal-300",   pill: "bg-teal-500/20 text-teal-300 border-teal-500/30" },
  "Aging & Late Adulthood":{ bg: "from-orange-500/15 to-amber-500/10",    border: "border-orange-500/30", text: "text-orange-300", pill: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  "Gender Differences":    { bg: "from-purple-500/15 to-violet-500/10",   border: "border-purple-500/30", text: "text-purple-300", pill: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  "Death & Dying":         { bg: "from-slate-500/15 to-gray-500/10",      border: "border-slate-500/30",  text: "text-slate-300",  pill: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
}

const DEFAULT_COLOR = { bg: "from-white/5 to-white/5", border: "border-white/10", text: "text-gray-300", pill: "bg-white/10 text-gray-300 border-white/20" }

function getColor(topic: string) {
  return TOPIC_COLORS[topic] ?? DEFAULT_COLOR
}

const ALL_TOPICS = Array.from(new Set(QUESTIONS.map(q => q.topic))).sort()

/* ── FLIP CARD ── */
function FlipCard({ question, index, total, onPrev, onNext, isRevealed, setRevealed }: {
  question: Question
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  isRevealed: boolean
  setRevealed: (v: boolean) => void
}) {
  const color = getColor(question.topic)

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="w-full flex items-center justify-between text-[10px] text-gray-600 font-black uppercase tracking-widest">
        <span>{index + 1} / {total}</span>
        <div className={cn("px-3 py-1 rounded-full border text-[9px]", color.pill)}>{question.topic}</div>
        <span>{Math.round(((index + 1) / total) * 100)}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full bg-gradient-to-r", color.bg.replace("from-", "from-").replace("/15", "").replace("/10", ""))}
          style={{ background: "linear-gradient(to right, #6366f1, #8b5cf6)" }}
          initial={{ width: 0 }}
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Card */}
      <div className="w-full" style={{ perspective: "1400px" }}>
        <motion.div
          className="relative w-full"
          style={{ transformStyle: "preserve-3d", minHeight: "340px" }}
          animate={{ rotateY: isRevealed ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* FRONT */}
          <div
            className={cn(
              "absolute inset-0 w-full rounded-[32px] border p-8 cursor-pointer select-none",
              "bg-gradient-to-br", color.bg, color.border,
              "backdrop-blur-xl flex flex-col gap-6"
            )}
            style={{ backfaceVisibility: "hidden" }}
            onClick={() => setRevealed(true)}
          >
            <div className="flex items-start justify-between">
              <span className={cn("text-[9px] font-black uppercase tracking-widest", color.text)}>Q{question.id}</span>
              <div className="flex items-center gap-2 text-gray-700 text-[9px] font-black uppercase tracking-widest">
                <span>Tap to reveal</span>
                <div className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center">
                  <span className="text-[8px]">↩</span>
                </div>
              </div>
            </div>

            <p className="text-white font-bold text-xl leading-relaxed flex-1">
              {question.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 border", color.pill)}>
                    {OPTION_LABELS[i]}
                  </span>
                  <span className="text-sm text-gray-300 leading-relaxed">{opt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BACK */}
          <div
            className={cn(
              "absolute inset-0 w-full rounded-[32px] border p-8 cursor-pointer select-none",
              "bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500/30",
              "backdrop-blur-xl flex flex-col gap-6"
            )}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            onClick={() => setRevealed(false)}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Correct Answer</span>
              <div className="flex items-center gap-2 text-gray-700 text-[9px] font-black uppercase tracking-widest">
                <span>Tap to flip back</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-6 justify-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-black text-emerald-400">{OPTION_LABELS[question.answer]}</span>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Answer</p>
                  <p className="text-white font-bold text-lg leading-relaxed">{question.options[question.answer]}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.options.map((opt, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-2.5 p-3 rounded-2xl border",
                      i === question.answer
                        ? "bg-emerald-500/15 border-emerald-500/40"
                        : "bg-white/3 border-white/5 opacity-40"
                    )}
                  >
                    {i === question.answer
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      : <XCircle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                    }
                    <span className={cn("text-sm leading-relaxed", i === question.answer ? "text-emerald-200 font-semibold" : "text-gray-600")}>
                      <span className="font-black mr-1">{OPTION_LABELS[i]}.</span>{opt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all text-sm font-bold"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <button
          onClick={() => setRevealed(!isRevealed)}
          className={cn(
            "px-6 py-2.5 rounded-full border font-bold text-sm transition-all",
            isRevealed
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30"
              : "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30"
          )}
        >
          {isRevealed ? "Hide Answer" : "Reveal Answer"}
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all text-sm font-bold"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ── MAIN PAGE ── */
export default function PsychQuizPage() {
  const [activeTopic, setActiveTopic] = useState<string>("All")
  const [shuffled, setShuffled] = useState(false)
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState<{ correct: number; incorrect: number }>({ correct: 0, incorrect: 0 })
  const [answered, setAnswered] = useState<Set<number>>(new Set())

  const filteredQuestions = useMemo(() => {
    const base = activeTopic === "All" ? QUESTIONS : QUESTIONS.filter(q => q.topic === activeTopic)
    if (!shuffled) return base
    const arr = [...base]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [activeTopic, shuffled])

  const currentQ = filteredQuestions[index]

  const goNext = useCallback(() => {
    setRevealed(false)
    setIndex(i => Math.min(i + 1, filteredQuestions.length - 1))
  }, [filteredQuestions.length])

  const goPrev = useCallback(() => {
    setRevealed(false)
    setIndex(i => Math.max(i - 1, 0))
  }, [])

  const handleShuffle = () => {
    setShuffled(s => !s)
    setIndex(0)
    setRevealed(false)
  }

  const handleTopicChange = (t: string) => {
    setActiveTopic(t)
    setIndex(0)
    setRevealed(false)
  }

  const handleMark = (correct: boolean) => {
    if (answered.has(currentQ.id)) return
    setAnswered(prev => new Set([...prev, currentQ.id]))
    setScore(s => correct
      ? { ...s, correct: s.correct + 1 }
      : { ...s, incorrect: s.incorrect + 1 }
    )
    goNext()
  }

  const resetSession = () => {
    setIndex(0)
    setRevealed(false)
    setScore({ correct: 0, incorrect: 0 })
    setAnswered(new Set())
  }

  const total = filteredQuestions.length
  const progress = answered.size

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8">
      {/* Nav */}
      <nav className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Brain className="w-3 h-3" /> PSYC · Lifespan Development
        </div>
      </nav>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-violet-400 bg-clip-text text-transparent">
            Psych Flashcards
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            {QUESTIONS.length} questions across {ALL_TOPICS.length} topics. Tap a card to flip and reveal the answer. Track your session score below.
          </p>
        </motion.div>

        {/* Score row */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {score.correct} Correct
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" /> {score.incorrect} Incorrect
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5" /> {progress}/{total} reviewed
          </div>
          <button onClick={resetSession} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-gray-500 hover:text-white text-xs font-bold transition-all">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b border-white/5">

          {/* Topic filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-gray-600 shrink-0" />
            <button
              onClick={() => handleTopicChange("All")}
              className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all",
                activeTopic === "All" ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20"
              )}
            >
              All ({QUESTIONS.length})
            </button>
            {ALL_TOPICS.map(t => {
              const c = getColor(t)
              const count = QUESTIONS.filter(q => q.topic === t).length
              return (
                <button key={t}
                  onClick={() => handleTopicChange(t)}
                  className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all",
                    activeTopic === t ? cn(c.pill) : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20"
                  )}
                >
                  {t} ({count})
                </button>
              )
            })}
          </div>

          {/* Shuffle */}
          <button
            onClick={handleShuffle}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all shrink-0",
              shuffled ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300" : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
            )}
          >
            <Shuffle className="w-3.5 h-3.5" /> {shuffled ? "Shuffled" : "Shuffle"}
          </button>
        </motion.div>

        {/* Flashcard */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <AnimatePresence mode="wait">
            {currentQ ? (
              <motion.div
                key={currentQ.id + activeTopic}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
              >
                <FlipCard
                  question={currentQ}
                  index={index}
                  total={total}
                  onPrev={goPrev}
                  onNext={goNext}
                  isRevealed={revealed}
                  setRevealed={setRevealed}
                />
              </motion.div>
            ) : (
              <div className="text-center py-20 text-gray-600">No questions found.</div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Self-mark row */}
        {revealed && currentQ && !answered.has(currentQ.id) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4"
          >
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Did you get it right?</p>
            <button
              onClick={() => handleMark(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold hover:bg-emerald-500/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Yes
            </button>
            <button
              onClick={() => handleMark(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-bold hover:bg-red-500/30 transition-all"
            >
              <XCircle className="w-4 h-4" /> No
            </button>
          </motion.div>
        )}

        {/* Topic overview grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Topics Overview</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {ALL_TOPICS.map(t => {
              const c = getColor(t)
              const count = QUESTIONS.filter(q => q.topic === t).length
              return (
                <button key={t} onClick={() => handleTopicChange(t)}
                  className={cn(
                    "p-3 rounded-2xl border text-left transition-all hover:scale-[1.02]",
                    "bg-gradient-to-br", c.bg, c.border,
                    activeTopic === t ? "ring-1 ring-white/20" : ""
                  )}
                >
                  <p className={cn("text-[9px] font-black uppercase tracking-widest mb-1", c.text)}>{t}</p>
                  <p className="text-lg font-black text-white">{count}</p>
                  <p className="text-[9px] text-gray-600">questions</p>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* All cards grid (mini overview) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers3 className="w-4 h-4 text-gray-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">All Cards — Jump to Any</p>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {filteredQuestions.map((q, i) => {
              const c = getColor(q.topic)
              const isAnswered = answered.has(q.id)
              return (
                <button
                  key={q.id}
                  onClick={() => { setIndex(i); setRevealed(false) }}
                  title={`Q${q.id}: ${q.topic}`}
                  className={cn(
                    "h-9 rounded-xl text-[10px] font-black border transition-all hover:scale-110",
                    i === index ? "ring-2 ring-white/40 " + c.pill :
                    isAnswered ? "bg-white/10 border-white/20 text-white" :
                    "bg-white/3 border-white/5 text-gray-700 hover:border-white/20 hover:text-white"
                  )}
                >
                  {q.id}
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
