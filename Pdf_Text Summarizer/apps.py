import streamlit as st
import PyPDF2
import google.generativeai as genai
from docx import Document
import spacy

# Configure Google Gemini API
genai.configure(api_key="YOUR_API_KEY")

# Load English NLP model for keyword extraction
nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF file."""
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = "\n".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
    return text

def extract_keywords(text, num_keywords=5):
    """Extracts key terms from the given text using spaCy."""
    doc = nlp(text)
    keywords = [token.text for token in doc if token.is_alpha and not token.is_stop]
    return list(set(keywords[:num_keywords]))