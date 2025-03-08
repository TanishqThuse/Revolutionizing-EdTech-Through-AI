import streamlit as st
from extract_text import extract_text
from generate_quiz import generate_mcqs
from evaluate import evaluate_quiz

st.title("📄 AI-Based Quiz Generator")

# Upload File
uploaded_file = st.file_uploader("Upload a PDF or DOCX", type=["pdf", "docx"])
num_questions = st.number_input("Enter number of questions", min_value=1, max_value=20, step=1)

if uploaded_file and num_questions:
    text = extract_text(uploaded_file)
    
    if text:
        questions = generate_mcqs(text, num_questions)
        
        st.subheader("Quiz Time!")
        user_answers = []
        correct_answers = []
        weak_topics = []

        for i, (question, options, correct) in enumerate(questions):
            st.write(f"**Q{i+1}: {question}**")
            user_choice = st.radio("", options, key=f"q{i}")
            user_answers.append(user_choice)
            correct_answers.append(correct)

        if st.button("Submit"):
            score, weak_topics = evaluate_quiz(user_answers, correct_answers, text)
            st.success(f"Your Score: {score}/{num_questions}")
            
            if weak_topics:
                st.warning(f"Your weak topics: {', '.join(weak_topics)}")
            else:
                st.success("Great job! No weak areas detected.")
