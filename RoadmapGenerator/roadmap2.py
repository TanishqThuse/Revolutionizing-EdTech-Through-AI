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
    Provide a **day-wise learning plan** with:
    - Topics  
    - LeetCode questions  
    - YouTube links  

    **Format as a table**:  
    Day | Topic | LeetCode Question | YouTube Link  
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
        roadmap_data = []

        for line in roadmap_lines:
            if "|" in line:
                columns = [col.strip() for col in line.split("|")]
                
                # Ensure we have valid row data
                if len(columns) >= 4 and columns[0].lower() != "day":
                    day = columns[0]
                    topic = columns[1]
                    leetcode_question = columns[2]
                    youtube_link = columns[3]

                    # Format LeetCode links properly
                    if "http" in leetcode_question:
                        leetcode_question = f"[🔗 LeetCode]({leetcode_question})"
                    elif leetcode_question.lower() in ["n/a", "-", ""]:
                        leetcode_question = "❌"

                    # Format YouTube links properly
                    if "http" in youtube_link:
                        youtube_link = f"[▶️ Watch Video]({youtube_link})"
                    elif youtube_link.lower() in ["n/a", "-", ""]:
                        youtube_link = "❌"

                    roadmap_data.append([day, topic, leetcode_question, youtube_link])

        # Convert to Pandas DataFrame
        df = pd.DataFrame(roadmap_data, columns=["Day", "Topic", "LeetCode Question(s)", "YouTube Link"])

        # Display roadmap using Markdown for clickable links
        st.subheader(f"📚 Personalized Roadmap for {goal}")
        st.markdown(f"**🎯 Goal:** {goal}  \n**⚡ Learning Speed:** {speed}  \n**📅 Duration:** {date_range}")

        # Display as Markdown Table for properly formatted links
        table_md = "| Day | Topic | LeetCode Question | YouTube Link |\n|---|---|---|---|\n"
        for _, row in df.iterrows():
            table_md += f"| {row['Day']} | {row['Topic']} | {row['LeetCode Question(s)']} | {row['YouTube Link']} |\n"

        st.markdown(table_md, unsafe_allow_html=True)
