# RAG-Based PDF Chatbot

This project is a Retrieval-Augmented Generation (RAG) based chatbot built with Streamlit and LangChain. It allows users to upload multiple PDF documents and ask questions naturally based on the content of those documents. The system uses open-source embedding models and Groq's fast inference engine with Llama 3.1 to generate responses.

## Features
- **Multiple PDF Support:** Upload and process multiple PDFs simultaneously.
- **RAG Architecture:** Leverages LangChain to extract, chunk, and embed text for efficient semantic retrieval.
- **Vector Search:** Uses FAISS (Facebook AI Similarity Search) to securely store and retrieve document chunks locally in memory.
- **Advanced LLM:** Powered by Groq's `llama-3.1-8b-instant` model for exceptionally fast and accurate answers.
- **Conversation Memory:** Retains the context of the chat history for a continuous and natural conversational experience.
- **Custom UI:** Interactive Web app built with Streamlit featuring custom HTML/CSS templates for distinctly styled chat messages.

## Tech Stack
- **Frontend / App Framework:** [Streamlit](https://streamlit.io/)
- **Orchestration:** [LangChain](https://www.langchain.com/)
- **LLM Provider:** [Groq](https://groq.com/) (using Llama-3.1-8b-instant)
- **Embeddings:** HuggingFace `sentence-transformers/all-MiniLM-L6-v2`
- **Vector Store:** FAISS (`faiss-cpu`)
- **PDF Parsing:** PyPDF2

## Installation

1. **Clone the repository** (if applicable) and navigate to the project directory:
   ```bash
   cd RAG_based_chatbot
   ```

2. **Set up a Python virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory and add your API credentials:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   HUGGINGFACEHUB_API_TOKEN=your_huggingface_token_here
   ```

## Application Workflow & Under the Hood

Here is how the application processes your data and answers questions:

1. **Document Loading & Extraction:** The user uploads one or more PDF files via the Streamlit sidebar. The `PyPDF2` library iterates through all pages of the uploaded documents and extracts the raw text.
2. **Text Chunking:** Because Language Models have token-limits, the extracted, massive raw text is divided into smaller, manageable chunks (1000 characters by default, with a 200-character overlap) using LangChain's `CharacterTextSplitter`. The overlap ensures that sentences or context aren't severely cut off between chunk boundaries.
3. **Vector Embeddings (Feature Extraction):** These text chunks are seamlessly converted into rich numerical representations (embeddings) using the `sentence-transformers/all-MiniLM-L6-v2` HuggingFace model. 
4. **Vector Store Formation:** The embeddings are mapped and stored in a highly-optimized indexing structure called `FAISS`. This step prepares a fast, searchable memory-space of the documents' contents.
5. **Conversational Chain Initialization:** A `ConversationalRetrievalChain` is set up binding the `ChatGroq` LLM, the FAISS retriever, and a `ConversationBufferMemory`. The memory component empowers the bot to remember prior prompts and responses for follow-up context.
6. **Query Retrieval & Response:** When you submit a question, the vector store swiftly retrieves the text-chunks most semantically relevant to your query. Those chunks, bundled dynamically with your question and chat history, are fed into the Groq LLM, which ultimately synthesizes a contextual answer using the provided document context.

## Usage

1. Start the Streamlit server:
   ```bash
   streamlit run app.py
   ```
2. Open the local link provided in your terminal in a browser (usually `http://localhost:8501`).
3. Under the sidebar **"Upload your PDF files"**, upload your documents.
4. Click **"Process PDFs"** and wait for the success message.
5. Begin chatting with your documents using the main text input field!
