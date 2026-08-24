export type SkillLevel = 1 | 2 | 3 | 4 | 5

export type Portfolio = {
  person: {
    name: string
    handle: string
    role: string
    location: string
    availability: string
    email: string
    links: { github: string; web: string; linkedin?: string }
  }
  about: {
    blurb: string
    currently: string
    education: { school: string; program: string; dates: string; detail?: string }[]
  }
  projects: {
    slug: string
    name: string
    status: "ACTIVE" | "ARCHIVED"
    dates: string
    oneLiner: string
    bullets: string[]
    stack: string[]
    repo: string
    demo?: string
  }[]
  skills: { group: string; items: { name: string; level: SkillLevel }[] }[]
  experience: { org: string; title: string; dates: string; bullets: string[] }[]
  certs: { name: string; issuer: string }[]
  languages: { name: string; pct: number }[]
  resume: { markdown: string; url?: string }
}

export const portfolio: Portfolio = {
  person: {
    name: "Narayan Joshi",
    handle: "ndjoshi",
    role: "Backend Developer & AI/ML Engineer — RAG, LLM orchestration, scalable APIs",
    location: "Pune, India",
    availability: "available for work",
    email: "joshi.narayan2004@gmail.com",
    links: {
      github: "https://github.com/Narayan201120",
      web: "https://narayan-joshi.netlify.app",
    },
  },
  about: {
    blurb:
      "Final-year B.E. student at Sinhgad Institute of Technology & Science, Pune. Bridges complex AI logic with backend infrastructure — Django, Python, vector databases.",
    currently: "Building Meridian and DocuMind.",
    education: [
      {
        school: "Sinhgad Institute of Technology & Science, Narhe",
        program: "B.E. Electronics & Telecommunication",
        dates: "2022 – 2026",
        detail: "T.E. CGPA 8.55",
      },
      {
        school: "S B Junior College, Jalna",
        program: "HSC",
        dates: "2020 – 2022",
        detail: "58.83%",
      },
    ],
  },
  projects: [
    {
      slug: "meridian",
      name: "Meridian",
      status: "ACTIVE",
      dates: "Jan 2026 – Present",
      oneLiner: "Full-stack productivity platform.",
      bullets: [
        "Offline-first mobile + server stack built on Expo and FastAPI",
        "Supabase Realtime sync with two-way Google Calendar and Outlook integration",
        "Whisper-powered voice transcription with FCM push notifications",
      ],
      stack: ["React Native", "Expo", "FastAPI", "Supabase", "PostgreSQL", "Redis", "Whisper API", "FCM"],
      repo: "Narayan201120/meridian",
    },
    {
      slug: "documind",
      name: "DocuMind",
      status: "ACTIVE",
      dates: "Nov 2025 – Present",
      oneLiner: "Production RAG / MLOps platform.",
      bullets: [
        "Multi-tenant React/Django platform with JWT authentication",
        "FAISS retrieval with cross-encoder reranking for answer quality",
        "BYOK LLM routing across OpenAI, Gemini and Llama providers",
        "Answer evaluation wired into CI through DeepEval",
      ],
      stack: ["Django", "React", "FAISS", "PostgreSQL", "DeepEval", "RAG", "JWT"],
      repo: "Narayan201120/rag_web_app",
    },
    {
      slug: "argus",
      name: "ARGUS",
      status: "ACTIVE",
      dates: "Sept 2025 – Present",
      oneLiner: "AI orchestration framework.",
      bullets: [
        "Routes requests across LLM models by complexity, cost and quality targets",
        "Python-first agent toolkit for composing model pipelines",
      ],
      stack: ["Python", "AI Agents", "LLM Routing"],
      repo: "Narayan201120/argus",
    },
  ],
  skills: [
    {
      group: "Backend",
      items: [
        { name: "Python", level: 5 },
        { name: "Django", level: 5 },
        { name: "DRF", level: 4 },
        { name: "FastAPI", level: 4 },
        { name: "Node.js", level: 3 },
        { name: "JWT", level: 4 },
        { name: "Celery + Redis", level: 3 },
        { name: "PostgreSQL", level: 4 },
        { name: "Supabase", level: 4 },
        { name: "WebSockets", level: 3 },
      ],
    },
    {
      group: "AI / ML",
      items: [
        { name: "RAG", level: 5 },
        { name: "LLMs (OpenAI, Gemini, Llama)", level: 4 },
        { name: "Whisper", level: 4 },
        { name: "Semantic Search", level: 4 },
        { name: "pgvector", level: 3 },
        { name: "FAISS", level: 4 },
        { name: "AI Agents", level: 4 },
        { name: "DeepEval", level: 3 },
      ],
    },
    {
      group: "Frontend / Mobile",
      items: [
        { name: "React", level: 4 },
        { name: "React Native", level: 4 },
        { name: "Expo", level: 4 },
      ],
    },
    {
      group: "Tools",
      items: [
        { name: "Docker", level: 3 },
        { name: "Git", level: 5 },
        { name: "Linux", level: 4 },
        { name: "Postman", level: 4 },
        { name: "Power BI", level: 3 },
        { name: "FCM", level: 3 },
      ],
    },
  ],
  experience: [
    {
      org: "KasNet Technologies, Pune",
      title: "Power BI Intern",
      dates: "Jan – Mar 2025",
      bullets: ["Built Power BI dashboards for operational reporting across business units."],
    },
    {
      org: "Zidio Development, Remote",
      title: "Data Science & Analytics Intern",
      dates: "May – Aug 2024",
      bullets: ["Automated data preparation pipelines, cutting manual prep effort by ~40%."],
    },
  ],
  certs: [
    { name: "Enterprise Grade AI", issuer: "IBM" },
    { name: "Data Analytics Job Simulation", issuer: "Deloitte Australia" },
    { name: "C / C++", issuer: "Spoken Tutorial" },
  ],
  languages: [
    { name: "python", pct: 90 },
    { name: "typescript", pct: 60 },
    { name: "c/c++", pct: 50 },
  ],
  resume: {
    markdown: `# Narayan Joshi

Backend Developer & AI/ML Engineer — RAG, LLM orchestration, scalable APIs

Pune, India · joshi.narayan2004@gmail.com
github.com/Narayan201120 · narayan-joshi.netlify.app

## Education

- B.E. Electronics & Telecommunication, Sinhgad Institute of Technology & Science, Narhe — 2026 (T.E. CGPA 8.55)
- HSC, S B Junior College, Jalna — 2022

## Experience

### Power BI Intern — KasNet Technologies, Pune (Jan–Mar 2025)
- Built Power BI dashboards for operational reporting across business units.

### Data Science & Analytics Intern — Zidio Development, Remote (May–Aug 2024)
- Automated data preparation pipelines, cutting manual prep effort by ~40%.

## Projects

### Meridian — Full-stack productivity platform (Jan 2026 – Present, ACTIVE)
Offline-first Expo/FastAPI stack, Supabase Realtime, Whisper transcription, two-way Google Calendar + Outlook sync.
React Native · Expo · FastAPI · Supabase · PostgreSQL · Redis · Whisper API · FCM
github.com/Narayan201120/meridian

### DocuMind — Production RAG / MLOps (Nov 2025 – Present, ACTIVE)
Multi-tenant React/Django, FAISS + cross-encoder rerank, BYOK LLM routing, DeepEval.
Django · React · FAISS · PostgreSQL · DeepEval · RAG · JWT
github.com/Narayan201120/rag_web_app

### ARGUS — AI orchestration framework (Sept 2025 – Present, ACTIVE)
Routes across models by complexity, cost and quality.
Python · AI Agents · LLM routing
github.com/Narayan201120/argus

## Skills

- Backend: Python, Django, DRF, FastAPI, Node.js, JWT, Celery + Redis, PostgreSQL, Supabase, WebSockets
- AI/ML: RAG, LLMs (OpenAI, Gemini, Llama), Whisper, Semantic Search, pgvector, FAISS, AI Agents, DeepEval
- Frontend / mobile: React, React Native, Expo
- Tools: Docker, Git, Linux, Postman, Power BI, FCM

## Certifications

- IBM — Enterprise Grade AI
- Deloitte Australia — Data Analytics Job Simulation
- Spoken Tutorial — C / C++
`,
  },
}

export default portfolio
