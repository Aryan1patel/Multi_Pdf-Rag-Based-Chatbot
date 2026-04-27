'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const SUGGESTIONS = [
  'What are the main topics covered in these documents?',
  'Summarise the key findings.',
  'What are the most important dates or deadlines mentioned?',
  'Who are the main people or organisations referenced?',
];

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 3v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function TryPage() {
  const [files, setFiles] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // 'success' | 'error' | ''
  const [uploadInfo, setUploadInfo] = useState(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleFiles = useCallback((incoming) => {
    const pdfs = Array.from(incoming).filter(f => f.type === 'application/pdf');
    if (pdfs.length === 0) {
      setError('Please select PDF files only.');
      return;
    }
    setError('');
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...pdfs.filter(f => !existing.has(f.name))];
    });
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  const removeFile = (name) => setFiles(prev => prev.filter(f => f.name !== name));

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadStatus('');
    setError('');

    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Upload failed');

      setSessionId(data.session_id);
      setUploadStatus('success');
      setUploadInfo(data);
      setMessages([{
        role: 'bot',
        content: `✅ **${data.files.length} PDF${data.files.length > 1 ? 's' : ''} processed** — ${data.chunks.toLocaleString()} chunks indexed into the vector store. Ask me anything about your documents!`,
        id: Date.now(),
      }]);
    } catch (e) {
      setError(e.message);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question || !sessionId || thinking) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question, id: Date.now() }]);
    setThinking(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Chat error');

      setMessages(prev => [...prev, { role: 'bot', content: data.answer, id: Date.now() }]);
    } catch (e) {
      setError(e.message);
      setMessages(prev => [...prev, { role: 'bot', content: `⚠️ ${e.message}`, id: Date.now(), isError: true }]);
    } finally {
      setThinking(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };



  return (
    <div className={styles.page}>
      {/* Background orbs */}
      <div className="orb orb-1" style={{opacity: 0.5}} />
      <div className="orb orb-2" style={{opacity: 0.4}} />

      {/* Top Bar */}
      <header className={`glass ${styles.topBar}`}>
        <Link href="/" className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5m7-7-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        <div className={styles.topBarLogo}>
          <div className={styles.topBarIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9l-6-6z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 3v6h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.topBarName}>DocMind</span>
        </div>

        <div className={styles.topBarStatus}>
          {sessionId ? (
            <div className={styles.statusActive}>
              <span className={styles.statusDot} />
              {uploadInfo?.files?.length} PDF{uploadInfo?.files?.length > 1 ? 's' : ''} active
            </div>
          ) : (
            <div className={styles.statusIdle}>Upload PDFs to begin</div>
          )}
        </div>
      </header>

      <div className={styles.layout}>
        {/* ── Sidebar ── */}
        <aside className={`glass ${styles.sidebar}`}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Your Documents</h2>
            <p className={styles.sidebarSub}>Upload PDFs to start chatting</p>
          </div>

          {/* Drop Zone */}
          <div
            className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''} ${uploadStatus === 'success' ? styles.dropSuccess : ''}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className={styles.dropIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className={styles.dropText}>
              <strong>Drag & drop PDFs</strong><br />
              <span>or click to browse</span>
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <ul className={styles.fileList}>
              {files.map((f) => (
                <li key={f.name} className={styles.fileItem}>
                  <div className={styles.fileItemIcon}><FileIcon /></div>
                  <div className={styles.fileItemInfo}>
                    <span className={styles.fileName}>{f.name}</span>
                    <span className={styles.fileSize}>{(f.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button
                    className={styles.fileRemove}
                    onClick={() => removeFile(f.name)}
                    title="Remove"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {error && <div className={styles.errorBanner}>{error}</div>}

          <button
            className={`btn btn-primary ${styles.processBtn}`}
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
          >
            {uploading ? (
              <>
                <div className={styles.spinner} />
                Processing…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Process PDFs
              </>
            )}
          </button>

          {uploadStatus === 'success' && uploadInfo && (
            <div className={styles.uploadSuccess}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <strong>{uploadInfo.chunks.toLocaleString()} chunks</strong> indexed
                <br />{uploadInfo.files.length} file{uploadInfo.files.length > 1 ? 's' : ''} ready
              </div>
            </div>
          )}

          {/* Info */}
          <div className={styles.sidebarInfo}>
            <div className={styles.infoItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Files are processed in-memory only
            </div>
            <div className={styles.infoItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Powered by Groq LPU
            </div>
          </div>
        </aside>

        {/* ── Chat Panel ── */}
        <main className={styles.chatPanel}>
          {/* Messages */}
          <div className={styles.messages}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>Ready to explore your documents</h3>
                <p className={styles.emptySub}>Upload PDFs using the panel on the left, then ask anything.</p>
                <div className={styles.suggestions}>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      className={`glass ${styles.suggestion}`}
                      onClick={() => sessionId && sendMessage(s)}
                      disabled={!sessionId}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`${styles.messageRow} ${m.role === 'user' ? styles.rowUser : styles.rowBot}`}>
                  <div className={`${styles.avatar} ${m.role === 'user' ? styles.avatarUser : styles.avatarBot}`}>
                    {m.role === 'user' ? <UserIcon /> : <BotIcon />}
                  </div>
                  <div className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleBot} ${m.isError ? styles.bubbleError : ''}`}>
                    <div className={styles.bubbleText}>
                      {m.role === 'bot' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {thinking && (
              <div className={`${styles.messageRow} ${styles.rowBot}`}>
                <div className={`${styles.avatar} ${styles.avatarBot}`}><BotIcon /></div>
                <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                  <div className={styles.thinkingDots}>
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className={`glass ${styles.inputBar}`}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder={sessionId ? 'Ask anything about your documents…' : 'Upload and process PDFs first…'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={!sessionId || thinking}
              rows={1}
            />
            <button
              className={`${styles.sendBtn} ${input.trim() && sessionId ? styles.sendActive : ''}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || !sessionId || thinking}
              title="Send (Enter)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className={styles.inputHint}>Press Enter to send · Shift+Enter for new line</p>
        </main>
      </div>
    </div>
  );
}
