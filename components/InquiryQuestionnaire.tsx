'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import MagneticButton from '@/components/MagneticButton'
import { useIsMobile } from '@/hooks/useBreakpoint'

const STORAGE_KEY = 'inquiry_draft'

interface Question {
  id: string
  label: string
  hint?: string
  type: 'text' | 'textarea' | 'chips' | 'multi-chips'
  options?: string[]
  placeholder?: string
  required?: boolean
}

interface Section {
  label: string
  title: string
  description: string
  questions: Question[]
}

type AnswerValue = string | string[]

const sections: Section[] = [
  {
    label: 'Section 1 of 5',
    title: 'Tell me about your idea',
    description: "Don't worry about the technical stuff — just tell me what you're trying to build and who it's for.",
    questions: [
      {
        id: 'purpose',
        label: "What's this project about?",
        hint: 'A shop? A portfolio? An app? Just describe it in plain words.',
        type: 'textarea',
        placeholder: 'Tell me about it...',
        required: true,
      },
      {
        id: 'audience',
        label: 'Who is it for?',
        hint: 'Your customers, your team, the general public — even a rough idea helps.',
        type: 'textarea',
        placeholder: "Describe who'll be using it...",
        required: true,
      },
      {
        id: 'existing',
        label: 'Do you have a website already?',
        type: 'chips',
        options: ['Yes — redesign', 'No — brand new', 'No — but I have a logo/branding'],
      },
      {
        id: 'languages',
        label: 'What language(s) should the site be in?',
        type: 'multi-chips',
        options: ['English', 'Mongolian', 'Other'],
      },
    ],
  },
  {
    label: 'Section 2 of 5',
    title: 'What should it do?',
    description: "Pick everything that sounds useful. Not sure about something? Pick it anyway — we can talk it through.",
    questions: [
      {
        id: 'features',
        label: 'What features do you want?',
        hint: "Select all that apply — don't overthink it",
        type: 'multi-chips',
        options: [
          'User logins',
          'Content editor (update your own text/images)',
          'E-commerce / payments',
          'Blog / articles',
          'Admin dashboard',
          'Analytics',
          'Search functionality',
          'Email integration',
          'Social media integration',
          'Multi-language support',
          'Real-time features',
          'API integrations',
        ],
      },
      {
        id: 'features_custom',
        label: 'Anything else?',
        hint: "Something unique to your business that's not listed above",
        type: 'textarea',
        placeholder: 'e.g. a custom booking system, something specific to how your business works...',
      },
    ],
  },
  {
    label: 'Section 3 of 5',
    title: 'How should it look and feel?',
    description: "No full vision yet? That's completely fine — even vague preferences help a lot.",
    questions: [
      {
        id: 'content_manager',
        label: "Who'll be updating the content day to day?",
        type: 'chips',
        options: ['Me', 'A small team', 'A developer will handle it', 'Not sure yet'],
      },
      {
        id: 'visual_style',
        label: 'What vibe are you going for?',
        type: 'chips',
        options: [
          'Clean & minimal',
          'Bold & editorial',
          'Dark theme',
          'Colorful & modern',
          'No preference',
        ],
      },
      {
        id: 'reference',
        label: 'Any websites you love or want to take inspiration from?',
        type: 'textarea',
        placeholder: 'Links, descriptions, screenshots — anything works.',
      },
      {
        id: 'branding',
        label: 'Do you have a logo or brand colors?',
        type: 'chips',
        options: [
          'Yes — I will provide files',
          'Partial — just colors',
          'No — needs to be created',
        ],
      },
    ],
  },
  {
    label: 'Section 4 of 5',
    title: "When do you need it and what's the budget?",
    description: "No pressure on the numbers — this just helps me recommend the right approach for you.",
    questions: [
      {
        id: 'timeline',
        label: 'When do you need it live?',
        type: 'chips',
        required: true,
        options: [
          'ASAP (under 2 weeks)',
          '1 month',
          '2-3 months',
          'Flexible / no deadline',
        ],
      },
      {
        id: 'deadline_event',
        label: 'Is there a specific reason for that deadline?',
        hint: 'e.g. product launch, event, campaign',
        type: 'textarea',
        placeholder: 'A product launch, an event, a campaign?',
      },
      {
        id: 'budget',
        label: 'What budget are you working with?',
        type: 'chips',
        required: true,
        options: [
          'Under $500',
          '$500 – $2,000',
          '$2,000 – $5,000',
          '$5,000+',
          'Not sure / open to proposal',
        ],
      },
    ],
  },
  {
    label: 'Section 5 of 5',
    title: 'Almost done — just a few quick details',
    description: 'So I can reach out with a proper, personalised response.',
    questions: [
      {
        id: 'ownership',
        label: "Who's this project for?",
        type: 'chips',
        options: ['My company', 'Personal project', 'Joint / partnership'],
      },
      {
        id: 'hosting',
        label: 'Do you have a domain or hosting already?',
        type: 'chips',
        options: ['Yes, both', 'Domain only', 'Neither — need help', 'Not sure'],
      },
      {
        id: 'email',
        label: "What's your email?",
        hint: "I'll get back to you within 24 hours.",
        type: 'text',
        placeholder: 'your@email.com',
        required: true,
      },
      {
        id: 'notes',
        label: "Anything else you'd like me to know?",
        type: 'textarea',
        placeholder: 'Special requirements, concerns, or just say hi — I read everything.',
      },
    ],
  },
]

// Zod schema for required fields
const formSchema = z.object({
  purpose: z.string().min(1, "Tell me what this project is about"),
  audience: z.string().min(1, "Tell me who this is for"),
  timeline: z.string().min(1, "Pick a timeline"),
  budget: z.string().min(1, "Pick a budget range"),
  email: z.string().email("Enter a valid email address"),
})

const sectionRequiredIds: Record<number, string[]> = {
  0: ['purpose', 'audience'],
  3: ['timeline', 'budget'],
  4: ['email'],
}

interface InquiryQuestionnaireProps {
  onComplete: () => void
}

const loadDraft = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const { answers: savedAnswers, section } = JSON.parse(saved)
      return {
        answers: savedAnswers || {},
        section: typeof section === 'number' ? section : 0
      }
    }
  } catch {}
  return { answers: {}, section: 0 }
}

const initialDraft = typeof window !== 'undefined' ? loadDraft() : { answers: {}, section: 0 }

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbw_yVyYu1D6q9ZSnPmeyIMMH0xTXiu47pONQicCaeZ3Z2ARrQv6oW74D0DdQJ6DpqMo/exec'

const EMPTY_ARRAY: string[] = []

const QuestionField = memo(function QuestionField({
  q,
  value,
  error,
  onAnswer,
  onChipToggle,
}: {
  q: Question
  value: AnswerValue
  error?: string
  onAnswer: (id: string, val: string) => void
  onChipToggle: (id: string, option: string, isMulti: boolean) => void
}) {
  const borderColor = error ? 'var(--ember)' : 'rgba(255,255,255,0.1)'

  return (
    <div>
      <div style={{
        fontSize: '0.82rem',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '0.5rem',
        fontFamily: 'var(--font-space-mono), monospace',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}>
        {q.label}
        {q.required && (
          <span style={{ color: 'var(--ember)', fontSize: '0.7rem', lineHeight: 1 }}>*</span>
        )}
      </div>

      {q.hint && (
        <div style={{
          fontSize: '0.68rem',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-space-mono), monospace',
        }}>
          {q.hint}
        </div>
      )}

      {q.type === 'textarea' && (
        <textarea
          value={typeof value === 'string' ? value : ''}
          onChange={e => onAnswer(q.id, e.target.value)}
          placeholder={q.placeholder}
          rows={4}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${borderColor}`,
            borderRadius: '2px',
            color: '#fff',
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.82rem',
            padding: '0.75rem 1rem',
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'vertical',
            transition: 'border-color 0.2s',
          }}
        />
      )}

      {q.type === 'text' && (
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={e => onAnswer(q.id, e.target.value)}
          placeholder={q.placeholder}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${borderColor}`,
            borderRadius: '2px',
            color: '#fff',
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.82rem',
            padding: '0.75rem 1rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
        />
      )}

      {(q.type === 'chips' || q.type === 'multi-chips') && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {q.options?.map(option => {
            const isSelected = q.type === 'multi-chips'
              ? Array.isArray(value) && (value as string[]).includes(option)
              : value === option
            return (
              <button
                key={option}
                onClick={() => onChipToggle(q.id, option, q.type === 'multi-chips')}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                  padding: '0.45rem 0.9rem',
                  border: `1px solid ${isSelected ? 'var(--ember)' : 'rgba(255,255,255,0.15)'}`,
                  background: isSelected ? 'rgba(200,75,12,0.15)' : 'rgba(255,255,255,0.03)',
                  color: isSelected ? 'var(--ember)' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.15s',
                }}
              >
                {option}
              </button>
            )
          })}
        </div>
      )}

      <ErrorMessage message={error} />
    </div>
  )
})

export default function InquiryQuestionnaire({ onComplete }: InquiryQuestionnaireProps) {
  const [currentSection, setCurrentSection] = useState(initialDraft.section)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(initialDraft.answers)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [shakeKey, setShakeKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const submitAttempted = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (Object.keys(answers).length === 0) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, section: currentSection }))
      } catch {}
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [answers, currentSection])

  const validateSection = (sectionIndex: number): Record<string, string> => {
    const requiredIds = sectionRequiredIds[sectionIndex] || []
    if (requiredIds.length === 0) return {}

    const subset = Object.fromEntries(
      requiredIds.map(id => [id, answers[id] ?? ''])
    )

    const result = formSchema.partial().safeParse(subset)
    if (result.success) {
      // check required fields manually since partial() makes all optional
      const newErrors: Record<string, string> = {}
      for (const id of requiredIds) {
        const val = subset[id]
        if (!val || (typeof val === 'string' && val.trim() === '')) {
          if (id === 'email') {
            newErrors[id] = 'Enter a valid email address'
          } else if (id === 'purpose') {
            newErrors[id] = 'Tell me what this project is about'
          } else if (id === 'audience') {
            newErrors[id] = 'Tell me who this is for'
          } else if (id === 'timeline') {
            newErrors[id] = 'Pick a timeline'
          } else if (id === 'budget') {
            newErrors[id] = 'Pick a budget range'
          }
        }
      }
      // validate email format if provided
      if (requiredIds.includes('email') && subset['email']) {
        const emailResult = z.string().email('Enter a valid email address').safeParse(subset['email'])
        if (!emailResult.success) newErrors['email'] = 'Enter a valid email address'
      }
      return newErrors
    }

    const newErrors: Record<string, string> = {}
    result.error.issues.forEach((err: z.ZodIssue) => {
      if (err.path[0]) newErrors[err.path[0] as string] = err.message
    })
    return newErrors
  }

  const handleChipToggle = useCallback((questionId: string, option: string, isMulti: boolean) => {
    setErrors(prev => {
      if (!prev[questionId]) return prev
      const next = { ...prev }
      delete next[questionId]
      return next
    })
    setAnswers(prev => {
      const current = prev[questionId]
      if (isMulti) {
        const currentArray = Array.isArray(current) ? current : []
        if (currentArray.includes(option)) {
          return { ...prev, [questionId]: currentArray.filter((v: string) => v !== option) }
        }
        return { ...prev, [questionId]: [...currentArray, option] }
      } else {
        return { ...prev, [questionId]: option }
      }
    })
  }, [])

  const handleTextChange = useCallback((questionId: string, value: string) => {
    setErrors(prev => {
      if (!prev[questionId]) return prev
      const next = { ...prev }
      delete next[questionId]
      return next
    })
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }, [])

  const handleNext = async () => {
    const validationErrors = validateSection(currentSection)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setShakeKey(k => k + 1)
      return
    }

    setErrors({})

    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1)
      return
    }

    if (submitAttempted.current) return
    submitAttempted.current = true
    setSubmitting(true)

    try { localStorage.removeItem(STORAGE_KEY) } catch {}

    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(answers),
      })
    } catch {
      // no-cors — can't read response, proceed regardless
    }

    onComplete()
  }

  const handleBack = () => {
    if (currentSection > 0) {
      setErrors({})
      setCurrentSection(prev => prev - 1)
    }
  }

  const handleCopy = () => {
    const text = sections
      .map(section => {
        const sectionText = section.questions
          .map(q => {
            const answer = answers[q.id]
            const formattedAnswer = Array.isArray(answer) ? answer.join(', ') : answer || '—'
            return `${q.label}\n${formattedAnswer}`
          })
          .join('\n\n')
        return `${section.title}\n${'-'.repeat(40)}\n${sectionText}`
      })
      .join('\n\n')

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const progress = ((currentSection + 1) / sections.length) * 100

  return (
    <div style={{ maxWidth: '660px', margin: '0 auto', padding: '100px 1rem 3rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ background: 'var(--ash)', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '6px', background: 'var(--ember)', borderRadius: '99px' }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              {sections[currentSection].label}
            </div>
            <div style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-oxanium), sans-serif',
            }}>
              {sections[currentSection].title}
            </div>
            <div style={{
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '2rem',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              {sections[currentSection].description}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {sections[currentSection].questions.map((q) => (
                <QuestionField
                  key={q.id}
                  q={q}
                  value={answers[q.id] ?? (q.type === 'multi-chips' ? EMPTY_ARRAY : '')}
                  error={errors[q.id]}
                  onAnswer={handleTextChange}
                  onChipToggle={handleChipToggle}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile last-section: focused CTA layout */}
        {isMobile && currentSection === sections.length - 1 ? (
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.25)',
            }}>
              STEP {currentSection + 1} / {sections.length}
            </span>

            <motion.div
              key={shakeKey}
              animate={shakeKey > 0 ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ width: '100%', maxWidth: '280px' }}
            >
              <button
                onClick={handleNext}
                disabled={submitting}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  color: submitting ? 'rgba(255,255,255,0.4)' : '#000',
                  background: submitting ? 'rgba(200,75,12,0.3)' : 'var(--ember)',
                  border: 'none',
                  padding: '0.9rem 2.5rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  width: '100%',
                  transition: 'opacity 0.2s',
                }}
              >
                {submitting ? 'Sending…' : 'Send to Jay →'}
              </button>
            </motion.div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={handleBack}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                ← back
              </button>
              <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '0.55rem' }}>·</span>
              <button
                onClick={handleCopy}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  color: copied ? 'var(--ember)' : 'rgba(255,255,255,0.3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0',
                  transition: 'color 0.2s',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? 'copied' : 'copy'}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    style={{ display: 'block' }}
                  >
                    {copied ? '✓ copied' : '⎘ copy summary'}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        ) : (
          /* Desktop / non-last-section layout */
          <motion.div
            key={shakeKey}
            animate={shakeKey > 0 ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '2.5rem',
              gap: '0.75rem',
            }}
          >
            <MagneticButton onClick={handleBack} disabled={currentSection === 0}>
              ← Back
            </MagneticButton>
            <div style={{
              fontSize: '0.80rem',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              Step {currentSection + 1} of {sections.length}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {currentSection === sections.length - 1 && (
                <MagneticButton onClick={handleCopy}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? 'copied' : 'copy'}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.14 }}
                      style={{ display: 'block' }}
                    >
                      {copied ? '✓ Copied' : 'Copy summary'}
                    </motion.span>
                  </AnimatePresence>
                </MagneticButton>
              )}
              <MagneticButton onClick={handleNext} filled disabled={submitting}>
                {currentSection === sections.length - 1
                  ? (submitting ? 'Sending…' : 'Send to Jay →')
                  : 'Next →'}
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function ErrorMessage({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.65rem',
            color: 'var(--ember)',
            letterSpacing: '0.05em',
          }}
        >
          <span style={{ opacity: 0.7 }}>//</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
