import streamlit as st
import os
import tempfile
import faiss
import numpy as np
import hashlib
import time
from typing import TypedDict, Dict, Any, List
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END


os.environ["GROQ_API_KEY"] = "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"

# Define a constant for the model to use consistently throughout the code
GROQ_MODEL = "llama3-70b-8192"  # Using one of Groq's current models

class AgentState(TypedDict):
    messages: List[BaseMessage]
    sentiment: str
    task_type: str
    pdf_store: object

def simple_text_to_vector(text: str, dimension: int = 100) -> np.ndarray:
    """
    Create a simple text embedding by converting text to a numeric vector.
    This is a naive approach and should be replaced with a proper embedding model in production.
    """
    # Use hash of text to create a consistent vector
    
    # Create a hash of the text
    hash_object = hashlib.md5(text.encode())
    hash_hex = hash_object.hexdigest()
    
    # Convert hex to numeric values
    vector = np.zeros(dimension)
    for i in range(min(dimension, len(hash_hex))):
        vector[i] = int(hash_hex[i], 16) / 16.0
    
    return vector

def initialize_pdf_vector_store():
    """Initialize Faiss vector store for PDF documents."""
    # Create Faiss index with a fixed dimension
    dimension = 100
    index = faiss.IndexFlatL2(dimension)
    
    return {
        "index": index,
        "documents": [],
        "embeddings": []
    }

def add_pdf_to_vector_store(pdf_path, pdf_store):
    """Add PDF content to Faiss vector store."""
    # Load PDF
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()
    
    # Simple text splitting
    for doc in docs:
        # Create a simple vector embedding
        embedding = simple_text_to_vector(doc.page_content)
        
        # Add to Faiss index
        pdf_store['index'].add(np.array([embedding]))
        pdf_store['documents'].append(doc)
        pdf_store['embeddings'].append(embedding)
    
    return pdf_store

def similarity_search_pdf(query, pdf_store, top_k=3):
    """Perform similarity search in PDF vector store."""
    # Create query embedding
    query_embedding = simple_text_to_vector(query)
    
    # Search in Faiss index
    D, I = pdf_store['index'].search(np.array([query_embedding]), top_k)
    
    # Retrieve most similar documents
    similar_docs = [pdf_store['documents'][i] for i in I[0]]
    
    return " ".join([doc.page_content for doc in similar_docs])

def create_memory_enhanced_prompt() -> ChatPromptTemplate:
    """Create a prompt template that includes conversation history."""
    return ChatPromptTemplate.from_messages([
        ("system", "You are a helpful healthcare assistant. Consider the entire conversation history when responding."),
        MessagesPlaceholder(variable_name="messages"),
        ("human", "{input}")
    ])

def sentiment_analyzer(state: AgentState) -> Dict[str, Any]:
    """Analyze the sentiment of the user's message."""
    try:
        llm = ChatGroq(model=GROQ_MODEL)
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Analyze the sentiment of the following message. Classify it as 'positive', 'negative', or 'neutral'."),
            ("human", "{input}")
        ])
        chain = prompt | llm | StrOutputParser()
        
        last_message = state['messages'][-1].content
        sentiment = chain.invoke({"input": last_message})
        
        return {
            "sentiment": sentiment,
            "task_type": None,
            "messages": state['messages']
        }
    except Exception as e:
        st.error(f"Sentiment Analysis Error: {e}")
        return {
            "sentiment": "neutral",
            "task_type": None,
            "messages": state['messages']
        }

def task_router(state: AgentState) -> Dict[str, Any]:
    """Route the task to the appropriate agent."""
    task_type = "general_agent"
    
    if st.session_state.get('uploaded_pdf'):
        task_type = "pdf_agent"
    elif any(word in state['messages'][-1].content.lower() for word in ["symptom", "disease", "condition", "medical"]):
        task_type = "medical_query_agent"
    
    return {
        "task_type": task_type,
        "sentiment": state['sentiment'],
        "messages": state['messages']
    }

def create_memory_aware_agent(agent_type: str):
    """Create a memory-aware agent for different types of queries."""
    def agent_func(state: AgentState) -> Dict[str, Any]:
        try:
            llm = ChatGroq(model=GROQ_MODEL)
            
            # Create memory-enhanced prompt
            prompt = create_memory_enhanced_prompt()
            
            # Choose agent-specific context
            if agent_type == "medical":
                system_message = "You are a helpful medical information assistant. Provide clear, general medical information. IMPORTANT: Always advise consulting a doctor for specific medical concerns."
            elif agent_type == "pdf":
                # Perform similarity search in PDF
                pdf_context = similarity_search_pdf(
                    state['messages'][-1].content, 
                    st.session_state.pdf_store
                )
                system_message = f"You are an expert at analyzing medical PDFs. Use the following context to answer the query: {pdf_context}. If the information suggests a serious condition, strongly advise seeing a doctor."
            else:
                system_message = "You are a helpful assistant providing general health and wellness information."
            
            # Modify prompt to include system message
            modified_prompt = ChatPromptTemplate.from_messages([
                ("system", system_message),
                MessagesPlaceholder(variable_name="messages"),
                ("human", "{input}")
            ])
            
            # Create chain
            chain = modified_prompt | llm | StrOutputParser()
            
            # Invoke chain
            response = chain.invoke({
                "messages": state['messages'],
                "input": state['messages'][-1].content
            })
            
            # Add context-specific warnings
            if agent_type == "medical" and state.get('sentiment', '') == 'negative':
                response += "\n\nI sense you're worried. Please remember that while I can provide general information, it's crucial to consult a healthcare professional for personalized medical advice."
            
            if agent_type == "pdf" and any(word in response.lower() for word in ["serious", "critical", "urgent", "immediate attention"]):
                response += "\n\n⚠️ IMPORTANT: The information suggests a potentially serious medical condition. Please consult a healthcare professional immediately."
            
            # Prepare new messages
            new_messages = state['messages'] + [AIMessage(content=response)]
            
            return {
                "messages": new_messages,
                "sentiment": state['sentiment'],
                "task_type": None
            }
        
        except Exception as e:
            st.error(f"{agent_type.capitalize()} Agent Error: {e}")
            error_message = f"I'm sorry, but I encountered an error processing your {agent_type} query."
            new_messages = state['messages'] + [AIMessage(content=error_message)]
            
            return {
                "messages": new_messages,
                "sentiment": state['sentiment'],
                "task_type": None
            }
    
    return agent_func

def generate_diagnostic_summary(conversation_history):
    """Generate a potential diagnostic summary based on the entire conversation."""
    try:
        # Extract all user messages from conversation for analysis
        user_inputs = [msg["content"] for msg in conversation_history if msg["role"] == "user"]
        all_content = "\n".join(user_inputs)
        
        # Create prompt for diagnostic summary
        llm = ChatGroq(model=GROQ_MODEL)
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a healthcare assistant tasked with providing a potential diagnostic summary.
            Based on the conversation history, identify potential conditions that might match the symptoms described.
            Format your response as:
            
            ### Potential Diagnostic Assessment
            
            **Possible conditions**: [List 2-3 potential conditions that match the symptoms]
            
            **Recommendation**: [Brief recommendation]
            
            **IMPORTANT DISCLAIMER**: This is not a medical diagnosis. The information provided is for educational purposes only 
            and should not replace consultation with a qualified healthcare professional.
            """),
            ("human", "{conversation}")
        ])
        
        chain = prompt | llm | StrOutputParser()
        diagnostic_summary = chain.invoke({"conversation": all_content})
        
        return diagnostic_summary
    
    except Exception as e:
        st.error(f"Error generating diagnostic summary: {e}")
        return "I couldn't generate a diagnostic assessment at this time. Please consult a healthcare professional."

# Build the graph
workflow = StateGraph(AgentState)

# Add nodes with memory-aware agents
workflow.add_node("sentiment_analyzer", sentiment_analyzer)
workflow.add_node("task_router", task_router)
workflow.add_node("medical_query_agent", create_memory_aware_agent("medical"))
workflow.add_node("pdf_agent", create_memory_aware_agent("pdf"))
workflow.add_node("general_agent", create_memory_aware_agent("general"))

# Add edges
workflow.set_entry_point("sentiment_analyzer")
workflow.add_edge("sentiment_analyzer", "task_router")
workflow.add_conditional_edges(
    "task_router",
    lambda state: state["task_type"],
    {
        "medical_query_agent": "medical_query_agent",
        "pdf_agent": "pdf_agent",
        "general_agent": "general_agent"
    }
)
workflow.add_edge("medical_query_agent", END)
workflow.add_edge("pdf_agent", END)
workflow.add_edge("general_agent", END)

# Compile the workflow
app = workflow.compile()

# Streamlit App
def main():
    st.title("🩺 Healthcare Chatbot with Memory")
    
    # Initialize conversation history if not exists
    if "conversation_history" not in st.session_state:
        st.session_state.conversation_history = []
    
    # Initialize chat conclusion state
    if "conclude_chat" not in st.session_state:
        st.session_state.conclude_chat = False
    
    # PDF Upload
    uploaded_file = st.file_uploader("Upload a Medical PDF", type=['pdf'])
    if uploaded_file is not None:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_file.write(uploaded_file.getvalue())
            tmp_file_path = tmp_file.name
        
        # Initialize PDF vector store if not exists
        if 'pdf_store' not in st.session_state:
            st.session_state.pdf_store = initialize_pdf_vector_store()
        
        # Add PDF to vector store
        st.session_state.pdf_store = add_pdf_to_vector_store(tmp_file_path, st.session_state.pdf_store)
        st.session_state.uploaded_pdf = True
        st.success("PDF uploaded and indexed successfully!")

    # Display chat messages
    for message in st.session_state.conversation_history:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Display diagnostic summary if chat is concluded
    if st.session_state.conclude_chat and len(st.session_state.conversation_history) > 0:
        with st.expander("📋 Diagnostic Assessment", expanded=True):
            with st.spinner("Generating assessment..."):
                diagnostic_summary = generate_diagnostic_summary(st.session_state.conversation_history)
                st.markdown(diagnostic_summary)

    # User input
    if prompt := st.chat_input("What can I help you with today?"):
        # Check for chat conclusion command
        if prompt.lower() in ["conclude chat", "finish consultation", "end chat", "assessment", "diagnose"]:
            st.session_state.conclude_chat = True
            st.rerun()
        
        # Add user message to conversation history
        st.session_state.conversation_history.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user"):
            st.markdown(prompt)

        try:
            # Prepare messages for LangGraph
            messages = [
                HumanMessage(content=msg["content"]) 
                if msg["role"] == "user" 
                else AIMessage(content=msg["content"]) 
                for msg in st.session_state.conversation_history
            ]
            
            # Process through LangGraph
            inputs = {
                "messages": messages, 
                "sentiment": None, 
                "task_type": None,
                "pdf_store": st.session_state.get('pdf_store', None)
            }
            
            # Invoke the workflow
            final_response = app.invoke(inputs)
            bot_response = final_response['messages'][-1].content

            # Display assistant response
            with st.chat_message("assistant"):
                st.markdown(bot_response)

            # Add assistant response to conversation history
            st.session_state.conversation_history.append({"role": "assistant", "content": bot_response})
            
            # Add button to conclude chat and get diagnostic summary
            col1, col2 = st.columns([4, 1])
            with col2:
                if st.button("Get Assessment"):
                    st.session_state.conclude_chat = True
                    st.rerun()
            
        except Exception as e:
            st.error(f"Error processing your query: {e}")

if __name__ == "__main__":
    main()