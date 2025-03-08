import streamlit as st
import google.generativeai as genai
import pandas as pd

# Set up Gemini API Key
GENAI_API_KEY = "AIzaSyA7g5j4wM0M-_wiH0Eiz7SGeU4o33AiMJc"
genai.configure(api_key=GENAI_API_KEY)

def generate_roadmap(tech_stack, year, speed, goal):
    prompt = f"""
    Generate a structured roadmap for a college student in their {year} year who wants to learn {tech_stack}.
    The student is a {speed} learner aiming to achieve {goal}.
    Provide a day-wise learning plan with topics, LeetCode questions, and YouTube links.
    Format it as a table with columns: Day, Topic, LeetCode Question, YouTube Link.
    """
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    response = model.generate_content(prompt)
    return response.text

# Streamlit UI
st.set_page_config(page_title="Personalized Roadmap Generator", layout="wide")
st.title("📌 Get Your Personalized Learning Roadmap 🎯")

# User Inputs
tech_stack = st.selectbox("Select Your Tech Stack", ["Python", "Java", "C++", "JavaScript", "Data Science", "AI/ML"])
year = st.radio("Which year are you in?", ["1st year", "2nd year", "3rd year", "4th year"])
speed = st.radio("How would you describe your learning speed?", ["Fast", "Medium", "Slow"])
goal = st.selectbox("What is your End Goal?", ["Master coding interviews", "Build projects", "Competitive programming", "Become a full-stack developer", "Data Science/AI Research"])

date_range = st.date_input("Select a date range", [])
if st.button("Generate Roadmap"):
    with st.spinner("Generating your roadmap..."):
        roadmap_text = generate_roadmap(tech_stack, year, speed, goal)
        
        # Convert roadmap text into a DataFrame
        roadmap_lines = roadmap_text.strip().split("\n")

        # Extract relevant rows and ensure at least 4 columns
        roadmap_data = []
        for line in roadmap_lines:
            if "|" in line:
                columns = line.split("|")
                if len(columns) >= 4:
                    day = columns[0].strip()
                    topic = columns[1].strip()
                    leetcode_question = columns[2].strip()
                    youtube_link = columns[3].strip()
                    
                    # Ensure proper formatting of LeetCode question links
                    if "http" in leetcode_question:
                        leetcode_question = f"[{leetcode_question.split('/')[-1]}]({leetcode_question})"
                    
                    roadmap_data.append([day, topic, leetcode_question, youtube_link])

        # Convert to Pandas DataFrame
        df = pd.DataFrame(roadmap_data, columns=["Day", "Topic", "LeetCode Question(s)", "YouTube Link"])

        # Improve Display: Use Markdown for clickable links
        def make_clickable(val):
            if val.startswith("["):
                return val  # Already formatted
            elif "http" in val:
                return f"[Link]({val})"
            return val

        df = df.style.applymap(make_clickable)

        st.subheader(f"📚 Personalized Roadmap for {goal}")
        st.write(f"**Goal:** {goal}")
        st.write(f"**Learning Speed:** {speed}")
        st.write(f"**Duration:** {date_range}")

        # Display in Streamlit with formatting
        st.write(df)

