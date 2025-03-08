from collections import Counter
import nltk
from nltk.tokenize import word_tokenize

nltk.download('punkt')

def evaluate_quiz(user_answers, correct_answers, text):
    score = sum([1 if user_answers[i] == correct_answers[i] else 0 for i in range(len(user_answers))])
    
    # Find incorrect answers
    wrong_keywords = [correct_answers[i] for i in range(len(user_answers)) if user_answers[i] != correct_answers[i]]
    
    # Keyword Filtration: Count occurrences in text
    words = word_tokenize(text.lower())
    word_freq = Counter(words)
    
    weak_topics = [word for word in wrong_keywords if word_freq[word.lower()] > 2]
    
    return score, weak_topics
