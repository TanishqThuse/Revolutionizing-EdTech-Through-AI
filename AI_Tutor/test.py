import google.generativeai as genai

# Replace with your actual Gemini API key
API_KEY = 'AIzaSyDA48OefhrnO7IXeIe51c5Kx19GPSdbZdk'

# Configure the API key
genai.configure(api_key=API_KEY)

# Create a model instance
model = genai.GenerativeModel("gemini-pro")

# Test prompt
response = model.generate_content("Hello, Gemini! Can you confirm that my API key works?")

# Print response
print(response.text)

