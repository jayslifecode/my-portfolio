'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Magnetic from '@/components/Magnetic'

const STORAGE_KEY = 'inquiry_draft'

interface Question {
  id: string
  label: string
  hint?: string
  type: 'text' | 'textarea' | 'chips' | 'multi-chips'
  options?: string[]
  placeholder?: string
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
    title: 'About the project',
    description: "Let's start with the big picture.",
    questions: [
      {
        id: 'purpose',
        label: 'What is the main purpose of this project?',
        hint: 'e.g. portfolio, e-commerce, SaaS, blog, dashboard',
        type: 'textarea',
        placeholder: 'Describe the project main goal...',
      },
      {
        id: 'audience',
        label: 'Who is the target audience?',
        hint: 'e.g. general public, businesses, developers, specific industry',
        type: 'textarea',
        placeholder: 'Describe the intended users...',
      },
      {
        id: 'existing',
        label: 'Do you have an existing website or brand?',
        type: 'chips',
        options: ['Yes — redesign', 'No — brand new', 'No — but I have a logo/branding'],
      },
      {
        id: 'languages',
        label: 'What language(s) should the site support?',
        type: 'multi-chips',
        options: ['English', 'Mongolian', 'Other'],
      },
    ],
  },
  {
    label: 'Section 2 of 5',
    title: 'Features & functionality',
    description: 'What features do you need?',
    questions: [
      {
        id: 'features',
        label: 'What features are essential?',
        hint: 'Select all that apply',
        type: 'multi-chips',
        options: [
          'User authentication',
          'CMS / content editor',
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
    ],
  },
  {
    label: 'Section 3 of 5',
    title: 'Design & content',
    description: 'Help understand the look and feel.',
    questions: [
      {
        id: 'content_manager',
        label: 'Who will be updating the content?',
        type: 'chips',
        options: ['Me', 'A small team', 'A developer will handle it', 'Not sure yet'],
      },
      {
        id: 'visual_style',
        label: 'Preferred visual style?',
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
        label: 'Any websites you admire or want to reference?',
        type: 'textarea',
        placeholder: 'e.g. website URLs...',
      },
      {
        id: 'branding',
        label: 'Do you have brand colors or a logo already?',
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
    title: 'Timeline & budget',
    description: 'This helps scope the right solution.',
    questions: [
      {
        id: 'timeline',
        label: 'When do you need it live?',
        type: 'chips',
        options: [
          'ASAP (under 2 weeks)',
          '1 month',
          '2-3 months',
          'Flexible / no deadline',
        ],
      },
      {
        id: 'deadline_event',
        label: 'Is there a specific event driving the deadline?',
        hint: 'e.g. product launch, event, campaign',
        type: 'textarea',
        placeholder: 'Describe any deadline drivers...',
      },
      {
        id: 'budget',
        label: 'Approximate budget range (USD)?',
        type: 'chips',
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
    title: 'Logistics & contact',
    description: 'Final details to get started.',
    questions: [
      {
        id: 'ownership',
        label: 'Who owns this project?',
        type: 'chips',
        options: ['My company', 'Personal project', 'Joint / partnership'],
      },
      {
        id: 'hosting',
        label: 'Do you have hosting or a domain?',
        type: 'chips',
        options: ['Yes, both', 'Domain only', 'Neither — need help', 'Not sure'],
      },
      {
        id: 'email',
        label: 'Your email address',
        hint: 'So I can reach you',
        type: 'text',
        placeholder: 'your@email.com',
      },
      {
        id: 'notes',
        label: 'Anything else for the developer to know?',
        type: 'textarea',
        placeholder: 'Extra context, concerns, special requirements...',
      },
    ],
  },
]

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

export default function InquiryQuestionnaire({ onComplete }: InquiryQuestionnaireProps) {
  const [currentSection, setCurrentSection] = useState(initialDraft.section)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(initialDraft.answers)

  // Persist draft only when user has actually written something
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, section: currentSection }))
      } catch {}
    }
  }, [answers, currentSection])

  const handleChipToggle = (questionId: string, option: string, isMulti: boolean) => {
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
  }

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1)
    } else {
      try { localStorage.removeItem(STORAGE_KEY) } catch {}
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentSection > 0) {
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
  }

  const renderQuestion = (q: Question) => {
    const value = answers[q.id] || []

    if (q.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleTextChange(q.id, e.target.value)}
          placeholder={q.placeholder}
          rows={3}
          style={{
            width: '100%',
            fontSize: '0.82rem',
            padding: '8px 12px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            background: 'var(--surface)',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'var(--font-space-mono), monospace',
            resize: 'vertical',
            outline: 'none',
          }}
        />
      )
    }

    if (q.type === 'text') {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleTextChange(q.id, e.target.value)}
          placeholder={q.placeholder}
          style={{
            width: '100%',
            fontSize: '0.82rem',
            padding: '8px 12px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            background: 'var(--surface)',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'var(--font-space-mono), monospace',
            outline: 'none',
          }}
        />
      )
    }

    if (q.type === 'chips' || q.type === 'multi-chips') {
      const isMulti = q.type === 'multi-chips'
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {q.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleChipToggle(q.id, option, isMulti)}
              style={{
                cursor: 'pointer',
                fontSize: '0.75rem',
                padding: '6px 14px',
                borderRadius: '99px',
                border: value.includes(option)
                  ? '1px solid var(--ember)'
                  : '1px solid var(--border)',
                background: value.includes(option)
                  ? 'rgba(200, 75, 12, 0.15)'
                  : 'var(--surface)',
                color: value.includes(option)
                  ? 'var(--ember)'
                  : 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-space-mono), monospace',
                letterSpacing: '0.05em',
                transition: 'all 0.15s',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )
    }

    return null
  }

  const progress = ((currentSection + 1) / sections.length) * 100

  return (
    <div
      style={{
        maxWidth: '660px',
        margin: '0 auto',
        padding: '100px 1rem 3rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              background: 'var(--ash)',
              borderRadius: '99px',
              height: '6px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              style={{
                height: '6px',
                background: 'var(--ember)',
                borderRadius: '99px',
              }}
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
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-space-mono), monospace',
              }}
            >
              {sections[currentSection].label}
            </div>
            <div
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-oxanium), sans-serif',
              }}
            >
              {sections[currentSection].title}
            </div>
            <div
              style={{
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.55)',
                marginBottom: '2rem',
                fontFamily: 'var(--font-space-mono), monospace',
              }}
            >
              {sections[currentSection].description}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {sections[currentSection].questions.map((q) => (
                <div key={q.id}>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '0.5rem',
                      fontFamily: 'var(--font-space-mono), monospace',
                    }}
                  >
                    {q.label}
                  </div>
                  {q.hint && (
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: 'rgba(255,255,255,0.4)',
                        marginBottom: '0.5rem',
                        fontFamily: 'var(--font-space-mono), monospace',
                      }}
                    >
                      {q.hint}
                    </div>
                  )}
                  {renderQuestion(q)}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2.5rem',
            gap: '1rem',
          }}
        >
          <Magnetic>
            <button
              onClick={handleBack}
              disabled={currentSection === 0}
              style={{
                fontSize: '0.82rem',
                padding: '10px 24px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: currentSection === 0
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(255,255,255,0.9)',
                cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-space-mono), monospace',
                transition: 'all 0.15s',
                opacity: currentSection === 0 ? 0.35 : 1,
              }}
            >
              Back
            </button>
          </Magnetic>

          <div
            style={{
              fontSize: '0.80rem',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'var(--font-space-mono), monospace',
            }}
          >
            Step {currentSection + 1} of {sections.length}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {currentSection === sections.length - 1 && (
              <Magnetic>
                <button
                  onClick={handleCopy}
                  style={{
                    fontSize: '0.82rem',
                    padding: '10px 24px',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.9)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-space-mono), monospace',
                    transition: 'all 0.15s',
                  }}
                >
                  Copy
                </button>
              </Magnetic>
            )}
            <Magnetic>
            <button
              onClick={handleNext}
              style={{
                fontSize: '0.82rem',
                padding: '10px 24px',
                borderRadius: '4px',
                border: '1px solid var(--ember)',
                background: 'var(--ember)',
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: 'var(--font-space-mono), monospace',
                transition: 'all 0.15s',
                fontWeight: 500,
              }}
            >
              {currentSection === sections.length - 1 ? 'Submit' : 'Next'}
            </button>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
