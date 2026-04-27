import './globals.css';

export const metadata = {
  title: 'DocMind — Chat with your PDFs using AI',
  description: 'Upload multiple PDFs and chat with them instantly using RAG-powered AI. Built with Next.js, LangChain, FAISS, and Groq.',
  keywords: ['RAG', 'AI', 'PDF', 'chatbot', 'LangChain', 'FAISS', 'Groq', 'LLM'],
  openGraph: {
    title: 'DocMind — Chat with your PDFs using AI',
    description: 'Upload multiple PDFs and chat with them instantly using RAG-powered AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="noise">{children}</body>
    </html>
  );
}
