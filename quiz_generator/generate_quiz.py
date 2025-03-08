import random
import nltk
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from dotenv import load_dotenv
import google.generativeai as genai
import os


nltk.download("punkt")

# Load API key from .env file
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set. Add it to your .env file.")

genai.configure(api_key=api_key)

# Rest of the generate_mcqs function remains unchanged


nltk.download('punkt')

def generate_mcqs(text, num_questions):
    sentences = sent_tokenize(text)
    vectorizer = TfidfVectorizer(stop_words="english")
    X = vectorizer.fit_transform(sentences)
    vocab = vectorizer.get_feature_names_out()
    
    questions = []
    
    for _ in range(num_questions):
        sentence = random.choice(sentences)
        words = sentence.split()
        if len(words) < 4:
            continue
        
        keyword = random.choice([word for word in words if word.lower() in vocab])
        question = sentence.replace(keyword, "______")
        options = [keyword] + random.sample(list(vocab), 3)
        random.shuffle(options)
        
        questions.append((question, options, keyword))
    
    return questions
