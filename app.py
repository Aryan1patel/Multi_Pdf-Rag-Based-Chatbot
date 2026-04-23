# # from langchain import FAISS
# # import streamlit as st
# # from dotenv import load_dotenv
# # from PyPDF2 import PdfReader

# # # LangChain imports
# # from langchain.text_splitter import CharacterTextSplitter
# # from langchain.embeddings import HuggingFaceInstructEmbeddings
# # from langchain.vectorstores import Chroma

# from langchain.chains import ConversationalRetrievalChain
# from langchain.memory import ConversationBufferMemory
# import streamlit as st
# from dotenv import load_dotenv
# from PyPDF2 import PdfReader
# from langchain.text_splitter import CharacterTextSplitter
# from langchain.embeddings import OpenAIEmbeddings, HuggingFaceEmbeddings
# from langchain.vectorstores import FAISS
# from langchain.chat_models import ChatOpenAI
# from htmlTemplates import css, bot_template, user_template
# # from langchain.llms import HuggingFaceHub
# # from InstructorEmbedding import INSTRUCTOR



# def get_pdf_text(pdf_docs):
#     text = ""
#     for pdf in pdf_docs:
#         pdf_reader = PdfReader(pdf)
#         for page in pdf_reader.pages:
#             text += page.extract_text()
#     return text

# def get_text_chunks(raw_text):
#     text_splitter = CharacterTextSplitter(
#         separator="\n", 
#         chunk_size=1000, 
#         chunk_overlap=200, 
#         length_function=len
#         )
#     chunks = text_splitter.split_text(raw_text)
#     return chunks

# def create_vectorstore(text_chunks):

#     # Create the Chroma vector store
#     embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

#     vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
#     return vectorstore

# def get_conversation_chain(vectorstore):
#     llm = ChatOpenAI()
#     memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
#     conversation_chain = ConversationalRetrievalChain.from_llm(
#         llm=llm,
#         retriever=vectorstore.as_retriever(),
#         memory=memory
#     )
#     return conversation_chain


# def handle_user_input(user_question):
#     response = st.session_state.conversation({"question": user_question})
#     st.write(response)



# def main():
#     load_dotenv()
#     st.set_page_config(page_title="Chat with multiple pdf", page_icon=":smiley:", layout="wide")
#     st.write(css, unsafe_allow_html=True) # Apply the CSS styles


#     if "conversation" not in st.session_state:
#         st.session_state.conversation = None

#     st.header("Chat with multiple PDF files")
#     # st.text_input("Enter your question here from documents...")

#     user_question = st.text_input("Enter your question here from documents...")
#     if user_question :
#         handle_user_input(user_question)

#     st.write(user_template.replace("{{MSG}}", "Hello, I am a user"), unsafe_allow_html=True) # Display the user message template
#     st.write(bot_template.replace("{{MSG}}", "Hello, I am a bot"), unsafe_allow_html=True) # Display the bot message template

    


  

#     with st.sidebar:
#         st.subheader("Your documents")
#         pdf_docs =st.file_uploader("Upload your PDF files here", type=["pdf"], accept_multiple_files=True)

#         if st.button("Process"):

#             with st.spinner("Processing..."):

#                 #get pdf text
#                 raw_text = get_pdf_text(pdf_docs)

#                 #get the text chunks
#                 text_chunks = get_text_chunks(raw_text)

#                 #create vector store
#                 if not text_chunks:
#                     st.warning("No text could be extracted from the uploaded PDFs.")
#                 else:
#                     vectorstore = create_vectorstore(text_chunks)
#                     st.success(f"Vector store created with {len(text_chunks)} chunks!")

#                 #create conversation chain
#                 st.session_state.conversation = get_conversation_chain(vectorstore)
    
    

                

# if __name__ == "__main__":
#     main()


import streamlit as st
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_classic.memory import ConversationBufferMemory
from htmlTemplates import css, bot_template, user_template

# ------------------ PDF Processing ------------------ #
def get_pdf_text(pdf_docs):
    """Extract text from a list of PDF files."""
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text

def get_text_chunks(raw_text, chunk_size=1000, chunk_overlap=200):
    """Split text into chunks for embeddings."""
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len
    )
    chunks = text_splitter.split_text(raw_text)
    return chunks

def create_vectorstore(text_chunks):
    """Create FAISS vectorstore from text chunks."""
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore

# ------------------ Conversation ------------------ #
def get_conversation_chain(vectorstore):
    """Create a ConversationalRetrievalChain with memory."""
    llm = ChatGroq(model_name="llama-3.1-8b-instant", temperature=0)
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    return conversation_chain

def display_messages():
    """Display conversation history using HTML templates."""
    if st.session_state.conversation:
        chat_history = st.session_state.conversation.memory.chat_memory.messages
        for message in chat_history:
            if message.type == "human":
                st.write(user_template.replace("{{MSG}}", message.content), unsafe_allow_html=True)
            else:
                st.write(bot_template.replace("{{MSG}}", message.content), unsafe_allow_html=True)

# ------------------ Main App ------------------ #
def main():
    load_dotenv()
    st.set_page_config(page_title="Chat with Multiple PDFs", page_icon=":books:", layout="wide")
    st.write(css, unsafe_allow_html=True)

    # Initialize conversation in session state
    if "conversation" not in st.session_state:
        st.session_state.conversation = None

    st.header("📄 Chat with Multiple PDF Files")

    # ------------------ Sidebar: PDF Upload ------------------ #
    with st.sidebar:
        st.subheader("Upload your PDF files")
        pdf_docs = st.file_uploader(
            "Upload PDF files here",
            type=["pdf"],
            accept_multiple_files=True
        )

        if st.button("Process PDFs"):
            if not pdf_docs:
                st.warning("Please upload at least one PDF file.")
            else:
                with st.spinner("Processing PDFs..."):
                    raw_text = get_pdf_text(pdf_docs)
                    text_chunks = get_text_chunks(raw_text)

                    if not text_chunks:
                        st.warning("No text could be extracted from the uploaded PDFs.")
                    else:
                        vectorstore = create_vectorstore(text_chunks)
                        st.success(f"Vector store created with {len(text_chunks)} chunks!")

                        # Create conversation chain and store in session
                        st.session_state.conversation = get_conversation_chain(vectorstore)
                        st.success("Conversation chain is ready! You can now ask questions below.")

    # ------------------ User Input ------------------ #
    user_question = st.text_input("Enter your question here...")

    if user_question:
        if st.session_state.conversation is None:
            st.warning("Please upload PDFs and click 'Process PDFs' first!")
        else:
            response = st.session_state.conversation({"question": user_question})
            display_messages()

if __name__ == "__main__":
    main()