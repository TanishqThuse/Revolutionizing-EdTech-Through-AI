import streamlit as st

# Function to display the home page
def show_home():
    st.title('Welcome to the AI-Powered EdTech Platform')
    
    # Add an image to the homepage
    st.image("https://img.freepik.com/free-vector/futuristic-classroom-little-children-study-with-high-tech-equipment_335657-3308.jpg?semt=ais_hybrid", caption="AI-Powered Education at Your Fingertips", use_column_width=True)
    
    st.write("""
    ### Revolutionizing Learning with AI
    This platform harnesses the power of AI to provide personalized learning experiences, helping you study smarter, not harder. Whether you're preparing for an exam, learning a new skill, or simply curious, our tools adapt to your needs and preferences.

    ## Key Features
    Explore the following AI-driven tools designed to enhance your learning journey:

    1. **AI Personalized Learning Tutor**  
       Get customized study suggestions based on your learning preferences and subject matter.

    2. **AI Adaptive Quiz Generator**  
       Create quizzes tailored to your study material and difficulty level.

    3. **AI PDF Document Summarizer**  
       Upload PDFs and get concise summaries to save time and focus on key points.

    4. **AI Video Summarizer**  
       Upload videos and receive summaries of important moments to aid your understanding.

    ### How It Works:
    - Simply select the feature you'd like to use from the sidebar.
    - Upload your study materials or input the subject you're learning.
    - Let the AI provide tailored learning experiences to suit your needs.

    ## Get Started
    Select one of the options in the sidebar to begin using these innovative features!
    """)

# Main function to control the navigation
def main():
    st.sidebar.title('Navigation')
    page = st.sidebar.radio("Choose a feature", ["Home", "AI Personalized Learning Tutor", 
                                                 "AI Adaptive Quiz Generator", 
                                                 "AI PDF Document Summarizer", 
                                                 "AI Video Summarizer"])

    if page == "Home":
        show_home()
    elif page == "AI Personalized Learning Tutor":
        show_learning_tutor()
    elif page == "AI Adaptive Quiz Generator":
        show_quiz_generator()
    elif page == "AI PDF Document Summarizer":
        show_pdf_summarizer()
    elif page == "AI Video Summarizer":
        show_video_summarizer()

if __name__ == "__main__":
    main()
