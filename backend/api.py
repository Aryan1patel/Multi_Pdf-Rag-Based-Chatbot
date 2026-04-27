import io
import uuid

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_classic.memory import ConversationBufferMemory
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_text_splitters import CharacterTextSplitter
from pydantic import BaseModel
from PyPDF2 import PdfReader
from typing import List

load_dotenv()

app = FastAPI(title="RAG Chatbot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lock this to your Vercel URL after deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "DocMind API is running 🚀", "docs": "/docs"}


# In-memory session store: { session_id: { chain, file_names, history } }
sessions: dict = {}


# ──────────────────────────── helpers ──────────────────────────────────────── #

def get_pdf_text(pdf_bytes_list: list[bytes]) -> str:
    text = ""
    for pdf_bytes in pdf_bytes_list:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text


def get_text_chunks(raw_text: str) -> list[str]:
    splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    return splitter.split_text(raw_text)


def create_vectorstore(text_chunks: list[str]):
    """Use HF Inference API — no local model, keeps RAM under 200MB."""
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=os.environ.get("HUGGINGFACE_API_TOKEN"),
        model_name="sentence-transformers/all-MiniLM-L6-v2",
    )
    return FAISS.from_texts(texts=text_chunks, embedding=embeddings)



def create_conversation_chain(vectorstore):
    llm = ChatGroq(model_name="qwen/qwen3.8-27b", temperature=0)
    memory = ConversationBufferMemory(
        memory_key="chat_history", return_messages=True
    )
    return ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory,
    )


# ──────────────────────────── models ───────────────────────────────────────── #

class ChatRequest(BaseModel):
    session_id: str
    question: str


class ChatResponse(BaseModel):
    answer: str
    session_id: str


# ──────────────────────────── routes ───────────────────────────────────────── #

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/upload")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    """Accept one or more PDF files, process them, and return a session_id."""
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")

    pdf_bytes_list = []
    file_names = []
    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"'{file.filename}' is not a PDF.",
            )
        contents = await file.read()
        pdf_bytes_list.append(contents)
        file_names.append(file.filename)

    raw_text = get_pdf_text(pdf_bytes_list)
    if not raw_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No text could be extracted from the uploaded PDFs.",
        )

    text_chunks = get_text_chunks(raw_text)
    vectorstore = create_vectorstore(text_chunks)
    chain = create_conversation_chain(vectorstore)

    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "chain": chain,
        "file_names": file_names,
    }

    return {
        "session_id": session_id,
        "chunks": len(text_chunks),
        "files": file_names,
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Ask a question against an existing session."""
    if request.session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found. Please upload PDFs first.",
        )

    chain = sessions[request.session_id]["chain"]
    result = chain({"question": request.question})

    return ChatResponse(answer=result["answer"], session_id=request.session_id)


@app.get("/api/session/{session_id}")
def session_info(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found.")
    return {
        "session_id": session_id,
        "files": sessions[session_id]["file_names"],
    }
