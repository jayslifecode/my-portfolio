# Copy Refresh — Design Spec
**Date:** 2026-04-23
**Scope:** All user-facing copy across the portfolio site — Hero, Work, Contact, and 5-step Inquiry Questionnaire.

---

## Goal

Rewrite all copy using a "split-layer" voice:
- **Surface layer:** Warm, outcome-focused, zero-jargon — immediately clear to a business owner with no technical background.
- **Embedded layer:** Subtle technical signals (// comments, tech tags, skill chips) that give credibility to developers who land on the page.

The tone is: friendly agency + warm expert. Confident but not corporate. Like a skilled developer who's also genuinely easy to work with.

---

## Hero Section
**File:** `components/HeroSection.tsx`

| Field | New Value |
|---|---|
| Eyebrow | `// available for new projects · seoul, south korea` |
| Bio | `I turn ideas into real websites and apps. Whatever your business needs — I'll build it right.` |
| Button 1 | `Let's Work Together →` |
| Button 2 | `Start Your Project →` |

---

## Work Section
**File:** `components/WorkSection.tsx`

Heading stays: `Things I've shipped.`

| Project | New Description |
|---|---|
| One Day Mongolia | `Online store for a Mongolian brand — handles products, payments, and nationwide delivery. Built from zero.` |
| Digital Mind | `Website for my own agency — fast, smooth, and yes, I eat my own cooking.` |
| AI Automation Suite | `AI-powered automation that handles repetitive tasks automatically. Built so the team doesn't have to — and I can finally sleep.` |

---

## Contact Section
**File:** `components/ContactSection.tsx`

Heading stays: `LET'S BUILD SOMETHING.`
Line 1 stays: `// open to freelance · full-time · collaborations`

| Field | New Value |
|---|---|
| Line 2 | `// based in seoul — I reply within 24 hours. No ghosting, ever.` |

All buttons and links unchanged.

---

## Inquiry Questionnaire
**File:** `components/InquiryQuestionnaire.tsx`

### Step 1 — Tell me about your idea
- **Title:** `Tell me about your idea`
- **Description:** `Don't worry about the technical stuff — just tell me what you're trying to build and who it's for.`
- **Purpose question:** `What's this project about?`
- **Purpose hint:** `A shop? A portfolio? An app? Just describe it in plain words.`
- **Purpose placeholder:** `Tell me about it...`
- **Audience question:** `Who is it for?`
- **Audience hint:** `Your customers, your team, the general public — even a rough idea helps.`
- **Audience placeholder:** `Describe who'll be using it...`
- **Existing site question:** `Do you have a website already?`
- **Languages question:** `What language(s) should the site be in?`

### Step 2 — What should it do?
- **Title:** `What should it do?`
- **Description:** `Pick everything that sounds useful. Not sure about something? Pick it anyway — we can talk it through.`
- **Features question:** `What features do you want?`
- **Features hint:** `Select all that apply — don't overthink it`
- **`User authentication` chip:** `User logins`
- **`CMS / content editor` chip:** `Content editor (update your own text/images)`
- **Other chips:** unchanged
- **Other features question:** `Anything else?`
- **Other features hint:** `Something unique to your business that's not listed above`
- **Other features placeholder:** `e.g. a custom booking system, something specific to how your business works...`

### Step 3 — How should it look and feel?
- **Title:** `How should it look and feel?`
- **Description:** `No full vision yet? That's completely fine — even vague preferences help a lot.`
- **Content manager question:** `Who'll be updating the content day to day?`
- **Visual style question:** `What vibe are you going for?`
- **Reference question:** `Any websites you love or want to take inspiration from?`
- **Reference placeholder:** `Links, descriptions, screenshots — anything works.`
- **Branding question:** `Do you have a logo or brand colors?`

### Step 4 — When do you need it and what's the budget?
- **Title:** `When do you need it and what's the budget?`
- **Description:** `No pressure on the numbers — this just helps me recommend the right approach for you.`
- **Timeline question:** unchanged
- **Deadline event question:** `Is there a specific reason for that deadline?`
- **Deadline event placeholder:** `A product launch, an event, a campaign?`
- **Budget question:** `What budget are you working with?`

### Step 5 — Almost done — just a few quick details
- **Title:** `Almost done — just a few quick details`
- **Description:** `So I can reach out with a proper, personalised response.`
- **Ownership question:** `Who's this project for?`
- **Hosting question:** `Do you have a domain or hosting already?`
- **Email question:** `What's your email?`
- **Email hint:** `I'll get back to you within 24 hours.`
- **Notes question:** `Anything else you'd like me to know?`
- **Notes placeholder:** `Special requirements, concerns, or just say hi — I read everything.`
- **Submit button:** `Send to Jay →`
- **Copy button:** `Copy summary`

---

## What's Not Changing
- All visual design, layout, animations, and component structure — untouched.
- Tech tag chips on projects in WorkSection.
- `//` comment style in Hero and Contact eyebrow lines.
- `Things I've shipped.` heading in WorkSection.
- `LET'S BUILD SOMETHING.` heading in ContactSection.
- All button styling and navigation behavior.
