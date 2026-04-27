'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 3v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Multi-PDF Upload',
    desc: 'Upload one or many PDF documents at once. DocMind processes them all together into a unified knowledge base.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Semantic Search (RAG)',
    desc: 'Powered by FAISS vector embeddings. Every answer is grounded in your actual documents — no hallucinations.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Conversational Memory',
    desc: 'Ask follow-up questions naturally. DocMind remembers your conversation history to give contextually aware answers.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Blazing Fast via Groq',
    desc: 'Groq\'s LPU inference hardware delivers responses in milliseconds. No GPU wait times, just instant answers.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 17.5h4m-2-2v4M3 10.5v3h7v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Smart Chunking',
    desc: 'Text is intelligently split into overlapping chunks, preserving context across page boundaries for accurate retrieval.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Private & Secure',
    desc: 'Your documents are processed in-memory per session and never stored permanently. Your data stays yours.',
  },
];

const STEPS = [
  { num: '01', title: 'Upload your PDFs', desc: 'Drag and drop one or multiple PDF files into the upload zone.' },
  { num: '02', title: 'AI processes them', desc: 'Text is extracted, chunked, and embedded into a FAISS vector store.' },
  { num: '03', title: 'Start chatting', desc: 'Ask any question in natural language and get precise, sourced answers instantly.' },
];

const TECH = [
  { label: 'Next.js 14', color: '#fff' },
  { label: 'FastAPI', color: '#06b6d4' },
  { label: 'LangChain', color: '#84cc16' },
  { label: 'FAISS', color: '#f59e0b' },
  { label: 'Groq LPU', color: '#f97316' },
  { label: 'Qwen 3.8B', color: '#a78bfa' },
  { label: 'HuggingFace', color: '#fbbf24' },
  { label: 'Python 3.13', color: '#38bdf8' },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Decorative grid */}
        <div className={styles.grid} aria-hidden="true" />

        <div className={`container ${styles.heroContent}`}>
          <div className={`badge badge-indigo ${styles.heroTag}`}>
            <span className={styles.dot} />
            AI-Powered Document Intelligence
          </div>

          <h1 className={`display ${styles.heroTitle}`}>
            Chat with your<br />
            <span className="grad-text">PDFs</span>
          </h1>

          <p className={styles.heroSub}>
            Upload any number of PDFs and ask questions in plain English.
            DocMind uses RAG — Retrieval-Augmented Generation — to find and synthesise
            answers directly from your documents.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/try" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
              </svg>
              Try it free
            </Link>
            <a href="#how-it-works" className="btn btn-ghost btn-lg">
              See how it works
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 17l10-10M17 7H7m10 0v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Mock chat preview */}
          <div className={`glass ${styles.heroPreview}`}>
            <div className={styles.previewBar}>
              <div className={styles.dots}>
                <span style={{background:'#ff5f57'}} />
                <span style={{background:'#febc2e'}} />
                <span style={{background:'#28c840'}} />
              </div>
              <span className={styles.previewTitle}>DocMind — Chat</span>
              <div />
            </div>
            <div className={styles.previewMessages}>
              <div className={`${styles.msg} ${styles.msgBot}`}>
                <div className={styles.msgAvatar}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.msgBubble}>
                  3 PDFs processed — <strong>2,847 chunks</strong> indexed. Ready to answer questions!
                </div>
              </div>
              <div className={`${styles.msg} ${styles.msgUser}`}>
                <div className={styles.msgBubble}>
                  What are the key findings from the Q3 earnings report?
                </div>
              </div>
              <div className={`${styles.msg} ${styles.msgBot}`}>
                <div className={styles.msgAvatar}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.msgBubble}>
                  Based on the Q3 report, revenue grew <strong>23% YoY</strong> to $4.2B, driven primarily by cloud services (+41%). Operating margins expanded to <strong>28.3%</strong>...
                </div>
              </div>
              <div className={styles.typingIndicator}>
                <div className={styles.msgAvatar} style={{opacity: 0.5}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.typingDots}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.section} id="features">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={`badge badge-indigo`}>Features</div>
            <h2 className={`display ${styles.sectionTitle}`}>
              Everything you need to<br /><span className="grad-text">understand your documents</span>
            </h2>
            <p className={styles.sectionSub}>
              Built on state-of-the-art AI infrastructure to give you accurate, fast, and private document intelligence.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={`glass ${styles.featureCard}`}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.section} id="how-it-works">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={`badge badge-indigo`}>Process</div>
            <h2 className={`display ${styles.sectionTitle}`}>
              Up and running in<br /><span className="grad-text">three simple steps</span>
            </h2>
          </div>

          <div className={styles.stepsRow}>
            {STEPS.map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <div className={styles.stepLine} aria-hidden="true" />
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className={styles.section} id="tech">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={`badge badge-indigo`}>Tech Stack</div>
            <h2 className={`display ${styles.sectionTitle}`}>
              Built with the<br /><span className="grad-text">best in class</span>
            </h2>
          </div>

          <div className={styles.techPills}>
            {TECH.map((t, i) => (
              <div key={i} className={`glass-strong ${styles.techPill}`} style={{'--pill-color': t.color}}>
                <span className={styles.techDot} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className="orb" style={{width:'500px',height:'500px',background:'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',position:'absolute'}} />
        <div className="container" style={{position:'relative', zIndex:1}}>
          <div className={`glass ${styles.ctaCard}`}>
            <div className={styles.ctaGlow} />
            <h2 className={`display ${styles.ctaTitle}`}>
              Ready to talk to<br /><span className="grad-text">your documents?</span>
            </h2>
            <p className={styles.ctaSub}>
              No sign-up. No credit card. Just upload and chat.
            </p>
            <Link href="/try" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
              </svg>
              Launch DocMind
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className="divider" />
        <div className={`container ${styles.footerInner}`}>
          <div className={styles.footerLogo}>
            <div className={styles.footerIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9l-6-6z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 3v6h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>DocMind</span>
          </div>
          <p className={styles.footerNote}>
            Built with ❤️ using Next.js, FastAPI & LangChain
          </p>
        </div>
      </footer>
    </main>
  );
}
