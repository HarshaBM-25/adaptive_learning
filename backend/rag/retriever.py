from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import TextLoader
import os
from typing import List, Dict
import json

class ContentRetriever:
    def __init__(self, openai_api_key: str):
        self.embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        self.vector_store = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

    def load_content(self, content_data: Dict):
        """Load and process educational content"""
        # Convert content to text format
        text_content = self._format_content(content_data)
        
        # Split text into chunks
        chunks = self.text_splitter.split_text(text_content)
        
        # Create or update vector store
        if self.vector_store is None:
            self.vector_store = FAISS.from_texts(chunks, self.embeddings)
        else:
            self.vector_store.add_texts(chunks)

    def _format_content(self, content_data: Dict) -> str:
        """Format content data into text format"""
        formatted_text = f"Title: {content_data['title']}\n"
        formatted_text += f"Subject: {content_data['subject']}\n"
        formatted_text += f"Difficulty: {content_data['difficulty_level']}\n"
        formatted_text += f"Content: {content_data['content_data']}\n"
        return formatted_text

    def retrieve_relevant_content(self, query: str, k: int = 3) -> List[Dict]:
        """Retrieve relevant content based on student's query and context"""
        if not self.vector_store:
            return []

        # Search for relevant documents
        docs = self.vector_store.similarity_search(query, k=k)
        
        # Format results
        results = []
        for doc in docs:
            results.append({
                "content": doc.page_content,
                "metadata": doc.metadata
            })
        
        return results

    def update_content(self, content_id: str, new_content: Dict):
        """Update existing content in the vector store"""
        # Remove old content
        if self.vector_store:
            # Implementation depends on vector store's update capabilities
            pass
        
        # Add new content
        self.load_content(new_content) 