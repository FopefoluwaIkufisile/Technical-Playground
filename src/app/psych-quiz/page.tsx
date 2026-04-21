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

  /* ── BATCH 2 (IDs 101–200) ── */
  { id: 101, question: "When was the term \"emerging adulthood\" originally coined?", options: ["1980", "1990", "2000", "2010"], answer: 2, topic: "Emerging Adulthood" },
  { id: 102, question: "The \"established adulthood\" phase encompasses which age range?", options: ["18–25", "25–35", "30–45", "45–65"], answer: 2, topic: "Emerging Adulthood" },
  { id: 103, question: "Which of the following is NOT considered a modern marker of becoming an adult?", options: ["Education completion", "Independent residence from parents", "Purchasing a vehicle", "A year of full-time work experience"], answer: 2, topic: "Emerging Adulthood" },
  { id: 104, question: "Between the ages of 35 and 44, which causes of death become more prominent compared to younger adults?", options: ["Accidents and suicide", "Cancer and heart disease", "Homicide and overdose", "Influenza and pneumonia"], answer: 1, topic: "Health & Lifestyle" },
  { id: 105, question: "Sleep deprivation among university students can impair concentration and distort:", options: ["Vision", "Memory", "Hearing", "Motor skills"], answer: 1, topic: "Health & Lifestyle" },
  { id: 106, question: "According to recent data, what percentage of Canadian adults are considered obese?", options: ["10.3%", "15.5%", "28.1%", "40.0%"], answer: 2, topic: "Health & Lifestyle" },
  { id: 107, question: "On average, how many hours a day do adults aged 18 to 79 spend being sedentary?", options: ["4 hours", "6 hours", "8 hours", "About 10 hours"], answer: 3, topic: "Health & Lifestyle" },
  { id: 108, question: "To reduce health risks, what is the maximum recommended number of alcoholic drinks on a single occasion for women?", options: ["1", "3", "4", "5"], answer: 1, topic: "Health & Lifestyle" },
  { id: 109, question: "Since 2016, there have been more than how many opioid-related deaths in Canada?", options: ["1,000", "5,000", "9,000", "20,000"], answer: 2, topic: "Health & Lifestyle" },
  { id: 110, question: "According to the Sex in America Survey, most adults prefer which sexual activities?", options: ["Anal sex only", "Vaginal and oral sex", "Group sex", "Abstinence"], answer: 1, topic: "Relationships & Sexuality" },
  { id: 111, question: "Compared to men, women are more likely to identify their sexual orientation as:", options: ["Heterosexual", "Asexual", "Bisexual", "Gay"], answer: 2, topic: "Relationships & Sexuality" },
  { id: 112, question: "Non-heterosexual individuals tend to score higher on which Big Five personality trait?", options: ["Conscientiousness", "Extroversion", "Openness", "Agreeableness"], answer: 2, topic: "Personality" },
  { id: 113, question: "The fraternal birth order effect suggests that which individuals are more likely to be gay?", options: ["First-born sons", "Only children", "Later-born sons with older brothers", "Men with older sisters"], answer: 2, topic: "Relationships & Sexuality" },
  { id: 114, question: "Piaget believed that young adults possess more knowledge than adolescents but remain in which cognitive stage?", options: ["Sensorimotor", "Preoperational", "Concrete operational", "Formal operational"], answer: 3, topic: "Cognitive Development" },
  { id: 115, question: "What type of thought replaces youthful idealism with more realistic, relativistic, and pragmatic thinking?", options: ["Preoperational thought", "Postformal thought", "Concrete thought", "Amotivation"], answer: 1, topic: "Cognitive Development" },
  { id: 116, question: "Which of the following is a major criticism of Piaget's cognitive development theory?", options: ["He focused too much on older adults", "He ignored cognitive development during adulthood", "He relied entirely on formal operations", "He overestimated adolescent knowledge"], answer: 1, topic: "Cognitive Development" },
  { id: 117, question: "Between 2000-2001 and 2018-2019, university participation in Canada increased by:", options: ["10%", "29%", "56%", "75%"], answer: 2, topic: "Motivation & Achievement" },
  { id: 118, question: "In postsecondary education, working more than how many hours per week is strongly associated with a negative influence on grades?", options: ["1-10 hours", "10-15 hours", "16-20 hours", "35 or more hours"], answer: 3, topic: "Motivation & Achievement" },
  { id: 119, question: "Unemployment has been linked to increased rates of all of the following EXCEPT:", options: ["Higher mortality", "Marital difficulties", "Increased intrinsic motivation", "Substance abuse"], answer: 2, topic: "Motivation & Achievement" },
  { id: 120, question: "According to expectancy-value theory, \"utility value\" refers to:", options: ["Perceiving a task as interesting", "Perceiving a task as useful", "Perceiving a task as having personal importance", "The energy required to complete a task"], answer: 1, topic: "Motivation & Achievement" },
  { id: 121, question: "For adults, socioemotional development primarily revolves around:", options: ["Disengaging from others", "Adaptively integrating emotional experiences into enjoyable relationships", "Achieving formal operational thought", "Financial independence"], answer: 1, topic: "Theories of Development" },
  { id: 122, question: "In the Big Five personality model, being imaginative or practical relates to which trait?", options: ["Conscientiousness", "Openness", "Agreeableness", "Neuroticism"], answer: 1, topic: "Personality" },
  { id: 123, question: "Self-disclosure and the sharing of private thoughts are the defining characteristics of:", options: ["Commitment", "Passion", "Intimacy", "Generativity"], answer: 2, topic: "Attachment & Love" },
  { id: 124, question: "Which group often experiences an increased need for intimacy as they establish independence from parents?", options: ["Older adults", "Middle-aged adults", "Adolescents", "Children"], answer: 2, topic: "Attachment & Love" },
  { id: 125, question: "Romantic love has strong components of infatuation and:", options: ["Commitment", "Friendship", "Sexuality", "Logic"], answer: 2, topic: "Attachment & Love" },
  { id: 126, question: "Fatuous love is defined by the presence of passion and commitment, but a lack of:", options: ["Trust", "Communication", "Intimacy", "Sexuality"], answer: 2, topic: "Attachment & Love" },
  { id: 127, question: "What is a common challenge faced by single adults?", options: ["Having too many friends", "Finding a niche in a marriage-oriented society", "Dealing with an empty nest", "Early retirement"], answer: 1, topic: "Relationships & Sexuality" },
  { id: 128, question: "Personal fulfillment competing with marital stability has emerged as a goal for:", options: ["Adolescents", "Divorced adults", "Single adults", "Married adults"], answer: 3, topic: "Marriage & Divorce" },
  { id: 129, question: "Never-married men report that the most important factor for a potential spouse is:", options: ["A steady job", "Wealth", "Similar ideas about having/raising children", "Age"], answer: 2, topic: "Relationships & Sexuality" },
  { id: 130, question: "Never-married women place greater importance on a partner having:", options: ["A steady job", "Similar ideas about raising children", "High openness to experience", "Prior marriages"], answer: 0, topic: "Relationships & Sexuality" },
  { id: 131, question: "Decreased divorce rates in recent years may be due to the selectivity of marriage, meaning individuals are:", options: ["Marrying younger", "Choosing characteristics in partners more favorable to long-lasting marriages", "Cohabiting less", "Having more children"], answer: 1, topic: "Marriage & Divorce" },
  { id: 132, question: "Divorced adults often complain of loneliness, diminished self-esteem, and:", options: ["Increased wealth", "Difficulty in forming satisfactory new intimate relationships", "Better physical health", "Over-attachment to parents"], answer: 1, topic: "Marriage & Divorce" },
  { id: 133, question: "Remarriage often occurs sooner for which individuals?", options: ["Partners who initiated the divorce", "Partners who did not initiate the divorce", "Younger men", "Individuals with no children"], answer: 0, topic: "Marriage & Divorce" },
  { id: 134, question: "Why do many remarried adults find it difficult to stay remarried?", options: ["They have too much free time", "They remarry for financial reasons or to reduce loneliness rather than love", "They achieve consummate love too quickly", "They focus only on passion"], answer: 1, topic: "Marriage & Divorce" },
  { id: 135, question: "Which couples are found to be the most supportive in sharing childcare responsibilities?", options: ["Heterosexual couples", "Gay male couples", "Lesbian couples", "Common law couples"], answer: 2, topic: "Relationships & Sexuality" },
  { id: 136, question: "According to Gottman, successful marriages involve letting your partner:", options: ["Take control of finances", "Influence you", "Make all parenting decisions", "Argue constantly"], answer: 1, topic: "Marriage & Divorce" },
  { id: 137, question: "Older parents tend to benefit from life experiences, which often leads to:", options: ["Worse parenting", "Better parenting", "Stagnation", "Divorce"], answer: 1, topic: "Middle Adulthood" },
  { id: 138, question: "What is the most common form of Intimate Partner Violence (IPV)?", options: ["Physical abuse", "Financial abuse", "Sexual abuse", "Psychological abuse"], answer: 3, topic: "Relationships & Sexuality" },
  { id: 139, question: "In family court disputes over divorce, false allegations are sometimes used to:", options: ["Improve co-parenting", "Purposefully manipulate the legal system or seek revenge", "Speed up the divorce process", "Establish love maps"], answer: 1, topic: "Marriage & Divorce" },
  { id: 140, question: "Following a divorce, what percentage of parents have written agreements on their children's primary residency?", options: ["10%", "25%", "45%", "59%"], answer: 3, topic: "Marriage & Divorce" },
  { id: 141, question: "Age is considered multidimensional because it encompasses biological, psychological, social, and what other type of development?", options: ["Economic", "Chronological", "Spiritual", "Generational"], answer: 1, topic: "Theories of Development" },
  { id: 142, question: "The term \"afternoon of life\" typically refers to which period?", options: ["Emerging adulthood", "Early adulthood", "Middle adulthood", "Late adulthood"], answer: 2, topic: "Middle Adulthood" },
  { id: 143, question: "What is the median retirement age in Canada?", options: ["55.0", "60.5", "64.5", "70.0"], answer: 2, topic: "Middle Adulthood" },
  { id: 144, question: "Healthy life expectancy is positively correlated with:", options: ["Income and education level", "Gender only", "Marital status", "Number of children"], answer: 0, topic: "Health & Lifestyle" },
  { id: 145, question: "The Evolutionary Theory of Aging notes that in virtually all species:", options: ["Males outlive females", "Females outlive males", "Both sexes live equally long", "Reproduction stops early"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 146, question: "According to the Free-Radical Theory, what damages DNA and other cellular structures?", options: ["Shortening telomeres", "Unstable oxygen molecules produced during energy metabolism", "Loss of dopamine", "Estrogen drops"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 147, question: "Individuals generally reach their maximum bone density during their:", options: ["Teens", "Early 20s", "Mid-to-late 30s", "50s"], answer: 2, topic: "Physical Development" },
  { id: 148, question: "Which condition is defined as the inflammation of joints accompanied by pain, stiffness, and movement problems?", options: ["Sarcopenia", "Osteoporosis", "Arthritis", "Glaucoma"], answer: 2, topic: "Physical Development" },
  { id: 149, question: "The ability to focus and maintain an image on the retina, which declines sharply between 40 and 59, is called:", options: ["Accommodation", "Macular degeneration", "Cataracts", "Perception"], answer: 0, topic: "Physical Development" },
  { id: 150, question: "Glaucoma is caused by damage to the optic nerve due to:", options: ["Retinal detachment", "Fluid build-up", "Muscle loss", "Protein deposits"], answer: 1, topic: "Physical Development" },
  { id: 151, question: "Between 60-75% of older adults report experiencing some form of:", options: ["Total hearing loss", "Persistent pain", "Macular degeneration", "Complete memory loss"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 152, question: "Heart disease is the second leading cause of death in Canada, but it becomes particularly prominent during:", options: ["Adolescence", "Early adulthood", "Middle age", "Infancy"], answer: 2, topic: "Health & Lifestyle" },
  { id: 153, question: "Which condition occurs when the body does not produce enough testosterone in men?", options: ["Menopause", "Climacteric", "Male hypogonadism", "Sarcopenia"], answer: 2, topic: "Physical Development" },
  { id: 154, question: "In studies of cognitive aging, longitudinal studies may introduce non-random participant loss and what other effect?", options: ["Cohort effects", "Practice effects", "Generativity", "Crystallization"], answer: 1, topic: "Cognitive Development" },
  { id: 155, question: "The retention of information about life's happenings is known as:", options: ["Semantic memory", "Implicit memory", "Episodic memory", "Working memory"], answer: 2, topic: "Cognitive Development" },
  { id: 156, question: "The ability to switch attention as a function of task demand is known as:", options: ["Sustained attention", "Selective attention", "Attentional flexibility", "Implicit attention"], answer: 2, topic: "Cognitive Development" },
  { id: 157, question: "Which cognitive theory of aging describes the mechanisms of \"delete, access, restrain\"?", options: ["Free-radical theory", "Theories focusing on inhibition", "Cellular clock theory", "Evolutionary theory"], answer: 1, topic: "Cognitive Development" },
  { id: 158, question: "When older adults recruit different brain regions than young adults to perform a task, it is called:", options: ["Age-related neural compensation", "Neurogenesis", "Mild Cognitive Impairment", "Brain death"], answer: 0, topic: "Aging & Late Adulthood" },
  { id: 159, question: "What is a key preventative measure that has been shown to reduce the risk of dementia by maintaining cognitive reserve?", options: ["Isolation", "Stopping exercise", "Staying in or returning to school", "Smoking"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 160, question: "Developing constructive and fulfilling leisure-time activities in middle adulthood is an important part of preparing for:", options: ["Emerging adulthood", "The retirement transition", "Empty nest syndrome", "The novice phase"], answer: 1, topic: "Middle Adulthood" },
  { id: 161, question: "Levinson's \"Novice phase\" of adult development occurs at the end of the teen years and involves:", options: ["Retirement planning", "The formation of a dream or image of the kind of life the youth wants", "Mid-life crisis", "Caring for aging parents"], answer: 1, topic: "Theories of Development" },
  { id: 162, question: "According to Levinson, the BOOM phase (Becoming One's Own Man) typically occurs between what ages?", options: ["18 to 22", "28 to 33", "40 to 45", "50 to 55"], answer: 1, topic: "Theories of Development" },
  { id: 163, question: "Levinson suggests that by age 40, adult males must come to grips with four major conflicts, including being masculine versus being:", options: ["Young", "Destructive", "Attached", "Feminine"], answer: 3, topic: "Theories of Development" },
  { id: 164, question: "George Vaillant argued that the 40s are a decade of reassessing and recording the truth about adolescence and adulthood, rather than a:", options: ["Novice phase", "Period of stagnation", "Mid-life crisis", "Time of generativity"], answer: 2, topic: "Theories of Development" },
  { id: 165, question: "Middle-aged adults often face a challenged sense of control due to:", options: ["A lack of responsibilities", "Demands, responsibilities, and physical/cognitive aging", "Too much free time", "High fluid intelligence"], answer: 1, topic: "Middle Adulthood" },
  { id: 166, question: "A sense of control in middle age is considered one of the most important modifiable factors in delaying:", options: ["Retirement", "The onset of diseases", "Menopause", "The empty nest syndrome"], answer: 1, topic: "Middle Adulthood" },
  { id: 167, question: "Women are more likely than men to engage in what coping strategy when encountering stressful events?", options: ["Fight-or-flight", "Isolation", "Tend-and-befriend", "Denial"], answer: 2, topic: "Gender Differences" },
  { id: 168, question: "The SOC theory of successful aging emphasizes that life goals and personal life investments:", options: ["Remain exactly the same", "Disappear completely", "Likely vary across the life course for most people", "Are only important in youth"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 169, question: "Which personality trait is frequently associated with an increased risk of mortality?", options: ["Openness", "Negative affect", "Self-confidence", "Conscientiousness"], answer: 1, topic: "Personality" },
  { id: 170, question: "Over a nearly two-decade decline, what economic issue among seniors is now on the rise again?", options: ["Extreme wealth", "Poverty", "Full-time employment", "Stock market investments"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 171, question: "Middle-aged partners are more likely to view their marriage positively if they:", options: ["Work opposite shifts", "Engage in mutual activities", "Rarely speak", "Live in separate cities"], answer: 1, topic: "Marriage & Divorce" },
  { id: 172, question: "In midlife, a divorce is often perceived by individuals as a:", options: ["Minor inconvenience", "Relief only", "Failure", "Career opportunity"], answer: 2, topic: "Marriage & Divorce" },
  { id: 173, question: "When dealing with the death of a spouse, bereaved individuals often face the challenge of fulfilling the distribution of assets in accordance with:", options: ["Verbal promises", "A will", "Family court", "Government mandates"], answer: 1, topic: "Death & Dying" },
  { id: 174, question: "In late adulthood, close attachment to others is directly linked with hope, life satisfaction, and:", options: ["Decreased health", "High anxiety", "Religiosity", "Poverty"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 175, question: "Insecure attachment in older adults is linked to more perceived negative burden when caring for patients with:", options: ["Parkinson's disease", "Arthritis", "Alzheimer's disease", "Glaucoma"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 176, question: "The generation that alternates attention between grown children and aging parents is called the Sandwich Generation or the:", options: ["Lost Generation", "Pivot Generation", "Silent Generation", "Greatest Generation"], answer: 1, topic: "Middle Adulthood" },
  { id: 177, question: "When it comes to forging new friendships, older adults are:", options: ["Constantly seeking strangers", "Less likely to forge new friendships and more selective", "Highly active on dating apps", "Disengaged completely"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 178, question: "Grandparents who care for their grandchildren full-time often face risk factors such as low income, minority status, and:", options: ["Being overly wealthy", "High education", "Not being married", "Living abroad"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 179, question: "A valuable task that adult children can perform for an aging parent is to:", options: ["Ignore their physical needs", "Coordinate and monitor services if they become disabled", "Force them into retirement", "Take their finances secretly"], answer: 1, topic: "Aging & Late Adulthood" },
  { id: 180, question: "Successful aging relies heavily on perceived control over the environment, which is often described by the term:", options: ["Disengagement", "Maladaptation", "Self-efficacy", "Stagnation"], answer: 2, topic: "Aging & Late Adulthood" },
  { id: 181, question: "In times of war, famine, and plague, individuals tend to be:", options: ["Less fearful", "More conscious of death", "Completely unaware of death", "Focused on career growth"], answer: 1, topic: "Death & Dying" },
  { id: 182, question: "Which of the following is NOT one of the world's five major religions that postulate the continuation of life after death?", options: ["Buddhism", "Christianity", "Atheism", "Islam"], answer: 2, topic: "Death & Dying" },
  { id: 183, question: "According to Kübler-Ross, the stage of dying where a person experiences resentment, rage, and envy is:", options: ["Denial", "Bargaining", "Depression", "Anger"], answer: 3, topic: "Death & Dying" },
  { id: 184, question: "The fifth stage of Kübler-Ross's model, Acceptance, is characterized by:", options: ["A desire to fight the illness", "A sense of peace and acceptance of fate", "High anxiety", "Bargaining with God"], answer: 1, topic: "Death & Dying" },
  { id: 185, question: "For older adults facing death, believing they can influence and control events may work as:", options: ["A maladaptive mechanism", "An adaptive strategy", "A form of depression", "Complicated grief"], answer: 1, topic: "Death & Dying" },
  { id: 186, question: "Delaying the necessity of dealing with death to avoid the destructive impact of shock is a function of:", options: ["Acceptance", "Adaptive denial", "Bargaining", "Disenfranchised grief"], answer: 1, topic: "Death & Dying" },
  { id: 187, question: "Open awareness of dying provides the dying individual with the opportunity to:", options: ["Be kept in the dark", "Avoid making a will", "Complete plans, make arrangements, and participate in funeral decisions", "Experience sudden shock"], answer: 2, topic: "Death & Dying" },
  { id: 188, question: "Death can be powerfully intimate during prolonged illnesses, but it can also be a sudden shock, such as in cases of:", options: ["Fatal accidents, homicides, or overdoses", "Old age", "Natural causes", "Sleep"], answer: 0, topic: "Death & Dying" },
  { id: 189, question: "Posttraumatic Stress Disorder (PTSD) in survivors of sudden death often causes:", options: ["Immediate peace", "Vivid nightmares and flashbacks", "Generativity", "A sense of humor"], answer: 1, topic: "Death & Dying" },
  { id: 190, question: "Long-lasting PTSD following a sudden death may result in:", options: ["Better health", "Disruptive unhealthy behaviors", "A higher IQ", "Postformal thought"], answer: 1, topic: "Death & Dying" },
  { id: 191, question: "Disenfranchised grief typically occurs in situations where a loss cannot be openly supported or mourned, such as:", options: ["The death of a grandparent", "An abortion or the death of an ex-spouse", "The death of a sibling", "A friend moving away"], answer: 1, topic: "Death & Dying" },
  { id: 192, question: "Which meaning-making process involves looking for explanations or assigning blame?", options: ["Benefit finding", "Continuing bonds", "Sense making", "Identity reconstruction"], answer: 2, topic: "Death & Dying" },
  { id: 193, question: "Identity reconstruction is a process associated with:", options: ["The onset of puberty", "Meaning-making during grief", "Alzheimer's disease", "Retirement planning"], answer: 1, topic: "Death & Dying" },
  { id: 194, question: "The death of an intimate partner can lead to profound grief as well as:", options: ["Financial loss and loneliness", "Euphoria", "Immediate remarriage", "Increased bone density"], answer: 0, topic: "Death & Dying" },
  { id: 195, question: "Poorer and less educated people who lose spouses tend to experience higher levels of:", options: ["Relief", "Loneliness", "Employment", "Physical strength"], answer: 1, topic: "Death & Dying" },
  { id: 196, question: "One of the immediate decisions facing the bereaved regarding the deceased's body is whether to choose burial or:", options: ["Cryogenics", "Cremation", "Donation", "Preservation"], answer: 1, topic: "Death & Dying" },
  { id: 197, question: "What has been a significant historical change regarding when and how people die in Canada?", options: ["Death only happens at home", "The ability for an individual to obtain Medical Assistance in Dying (MAID)", "The complete eradication of heart disease", "People live forever"], answer: 1, topic: "Death & Dying" },
  { id: 198, question: "Hospice and palliative care providers aim to give patients a \"good death,\" which patients report most frequently means having a preference for:", options: ["The dying process itself", "High medical intervention", "Dying alone", "Being kept unaware"], answer: 0, topic: "Death & Dying" },
  { id: 199, question: "The feeling that the future has no meaning is a symptom characteristic of:", options: ["Normal aging", "Disenfranchised grief", "Complicated or prolonged grief", "Mild Cognitive Impairment"], answer: 2, topic: "Death & Dying" },
  { id: 200, question: "In addition to family, who plays an important role in mourning practices across cultures?", options: ["The government", "The community", "Only doctors", "Employers"], answer: 1, topic: "Death & Dying" },
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

/* ── CHAPTER MAP ── */
const CHAPTER_MAP: Record<number, number> = {
  // Chapter 9 – Physical + Cognitive Development in Early Adulthood
  1:9,2:9,3:9,4:9,5:9,6:9,7:9,8:9,9:9,10:9,11:9,14:9,15:9,16:9,18:9,19:9,20:9,
  101:9,102:9,103:9,104:9,105:9,106:9,107:9,108:9,109:9,110:9,
  111:9,112:9,113:9,114:9,115:9,116:9,117:9,118:9,119:9,120:9,
  // Chapter 10 – Socioemotional Development in Early Adulthood
  12:10,13:10,17:10,21:10,22:10,23:10,24:10,25:10,26:10,27:10,
  28:10,29:10,30:10,31:10,32:10,33:10,34:10,35:10,36:10,37:10,38:10,39:10,40:10,
  121:10,122:10,123:10,124:10,125:10,126:10,127:10,128:10,129:10,130:10,
  131:10,132:10,133:10,134:10,135:10,136:10,137:10,138:10,139:10,140:10,
  // Chapter 11 – Physical + Cognitive Development in Middle + Late Adulthood
  41:11,42:11,43:11,44:11,45:11,46:11,47:11,48:11,49:11,50:11,
  51:11,52:11,53:11,54:11,55:11,56:11,57:11,58:11,59:11,60:11,
  141:11,142:11,143:11,144:11,145:11,146:11,147:11,148:11,149:11,150:11,
  151:11,152:11,153:11,154:11,155:11,156:11,157:11,158:11,159:11,160:11,
  // Chapter 12 – Socioemotional Development in Middle + Late Adulthood
  61:12,62:12,63:12,64:12,65:12,66:12,67:12,68:12,69:12,70:12,
  71:12,72:12,73:12,74:12,75:12,76:12,77:12,78:12,79:12,80:12,
  161:12,162:12,163:12,164:12,165:12,166:12,167:12,168:12,169:12,170:12,
  171:12,172:12,174:12,175:12,176:12,177:12,178:12,179:12,180:12,
  // Chapter 13 – Death, Dying, and Grieving
  81:13,82:13,83:13,84:13,85:13,86:13,87:13,88:13,89:13,90:13,
  91:13,92:13,93:13,94:13,95:13,96:13,97:13,98:13,99:13,100:13,
  173:13,181:13,182:13,183:13,184:13,185:13,186:13,187:13,188:13,189:13,
  190:13,191:13,192:13,193:13,194:13,195:13,196:13,197:13,198:13,199:13,200:13,
}

const CHAPTERS = [
  { num: 9,  label: "Ch 9",  title: "Physical & Cognitive (Early Adulthood)",        color: "violet" },
  { num: 10, label: "Ch 10", title: "Socioemotional (Early Adulthood)",               color: "pink" },
  { num: 11, label: "Ch 11", title: "Physical & Cognitive (Middle/Late Adulthood)",   color: "sky" },
  { num: 12, label: "Ch 12", title: "Socioemotional (Middle/Late Adulthood)",         color: "amber" },
  { num: 13, label: "Ch 13", title: "Death, Dying & Grieving",                        color: "slate" },
]


const CHAPTER_ACTIVE: Record<string, string> = {
  violet: "bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-500/20",
  pink:   "bg-pink-600 border-pink-400 text-white shadow-lg shadow-pink-500/20",
  sky:    "bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-500/20",
  amber:  "bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-500/20",
  slate:  "bg-slate-600 border-slate-400 text-white shadow-lg shadow-slate-500/20",
}

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
  const [activeChapter, setActiveChapter] = useState<number | "All">("All")
  const [shuffled, setShuffled] = useState(false)
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState<{ correct: number; incorrect: number }>({ correct: 0, incorrect: 0 })
  const [answered, setAnswered] = useState<Set<number>>(new Set())

  const chapterBase = useMemo(() =>
    activeChapter === "All" ? QUESTIONS : QUESTIONS.filter(q => CHAPTER_MAP[q.id] === activeChapter)
  , [activeChapter])

  const availableTopics = useMemo(() =>
    Array.from(new Set(chapterBase.map(q => q.topic))).sort()
  , [chapterBase])

  const filteredQuestions = useMemo(() => {
    const base = activeTopic === "All" ? chapterBase : chapterBase.filter(q => q.topic === activeTopic)
    if (!shuffled) return base
    const arr = [...base]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [activeTopic, activeChapter, shuffled, chapterBase])

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

  const handleChapterChange = (c: number | "All") => {
    setActiveChapter(c)
    setActiveTopic("All")
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
            {QUESTIONS.length} questions · 5 chapters · {ALL_TOPICS.length} topics. Filter by chapter or topic. Tap to flip.
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

        {/* Chapter Tabs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
          className="space-y-2">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" /> Filter by Chapter
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleChapterChange("All")}
              className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all",
                activeChapter === "All"
                  ? "bg-white text-black border-white shadow-lg shadow-white/10"
                  : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20"
              )}
            >
              All Chapters ({QUESTIONS.length})
            </button>
            {CHAPTERS.map(ch => {
              const count = QUESTIONS.filter(q => CHAPTER_MAP[q.id] === ch.num).length
              return (
                <button key={ch.num}
                  onClick={() => handleChapterChange(ch.num)}
                  className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all",
                    activeChapter === ch.num ? CHAPTER_ACTIVE[ch.color] : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20"
                  )}
                >
                  {ch.label} · {count}q
                </button>
              )
            })}
          </div>
          {activeChapter !== "All" && (
            <p className="text-[10px] text-gray-600 italic">
              {CHAPTERS.find(c => c.num === activeChapter)?.title}
            </p>
          )}
        </motion.div>

        {/* Controls: Topic filter + Shuffle */}
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
              All Topics ({chapterBase.length})
            </button>
            {availableTopics.map(t => {
              const c = getColor(t)
              const count = chapterBase.filter(q => q.topic === t).length
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
                key={currentQ.id + activeTopic + activeChapter}
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
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
              {activeChapter === "All" ? "All Topics" : `Ch ${activeChapter} Topics`}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {availableTopics.map(t => {
              const c = getColor(t)
              const count = chapterBase.filter(q => q.topic === t).length
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
