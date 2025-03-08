import streamlit as st
import PyPDF2
import google.generativeai as genai
from docx import Document
import spacy

# Configure Google Gemini API
genai.configure(api_key="YOUR_API_KEY")