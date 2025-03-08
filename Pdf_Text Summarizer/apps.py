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

def generate_summary(text, summary_length, summary_format, language):
    """Generates an extractive summary using Google Gemini API."""
    prompt = (f"Extract key sentences from the given text and summarize it in {summary_length} length. "
              f"Format the summary as {summary_format}. Provide output in {language}.\n\n" + text)
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Generate content using the model
        response = model.generate_content(prompt)
        
        # Extract the text from the response
        return response.text
    except Exception as e:
        return f"An error occurred: {e}"
    
def highlight_key_sentences(summary, keywords):
    """Highlights key sentences in the summary containing important keywords."""
    for keyword in keywords:
        summary = summary.replace(keyword, f"**{keyword}**")
    return summary

def save_summary(summary, file_format):
    """Saves the summary as a .txt or .docx file."""
    if file_format == "txt":
        with open("summary.txt", "w", encoding="utf-8") as file:
            file.write(summary)
        return "summary.txt"
    elif file_format == "docx":
        doc = Document()
        doc.add_paragraph(summary)
        file_path = "summary.docx"
        doc.save(file_path)
        return file_path