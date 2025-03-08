#gemini
import streamlit as st
import os
import tempfile
import uuid
from typing import List, Dict, Any
import google.generativeai as genai
from pathlib import Path
import mimetypes

# Function to determine file type based on extension
def get_file_type(file_path):
    mime_type, _ = mimetypes.guess_type(file_path)
    
    if mime_type:
        if mime_type.startswith('image/'):
            return 'image'
        elif mime_type == 'application/pdf':
            return 'pdf'
        elif mime_type.startswith('text/'):
            return 'text'
    
    # Default to text for unknown types
    return 'text'

def upload_files_to_assistant(files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Process uploaded files for use with Gemini API
    
    Args:
        files: List of file information dictionaries
        
    Returns:
        List of processed file information
    """
    if 'files_info' not in st.session_state:
        st.session_state.files_info = []
    
    processed_files = []
    
    for file_data in files:
        file_path = file_data['path']
        file_name = file_data['name']
        
        # Generate a unique ID for the file
        file_id = str(uuid.uuid4())
        
        # Determine file type
        file_type = get_file_type(file_path)
        
        # Create file info
        file_info = {
            'id': file_id,
            'name': file_name,
            'path': file_path,
            'type': file_type,
            'description': f"Course material: {file_name}"
        }
        
        processed_files.append(file_info)
        st.session_state.files_info.append(file_info)
    
    return processed_files

def attach_files_to_assistant(model_config: Dict[str, Any], file_ids: List[str]) -> bool:
    """
    This function is a placeholder as Gemini doesn't have the same file attachment concept as OpenAI assistants
    Instead, we'll manage files in our local storage and provide content to the model when needed
    
    Args:
        model_config: Model configuration dictionary
        file_ids: List of file IDs to attach
        
    Returns:
        Success status
    """
    # No direct file attachment in Gemini as in OpenAI assistants
    # Instead, we'll handle the files in our RAG implementation
    return True

def check_and_upload_files(model_config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Upload files through Streamlit interface and process them for RAG
    
    Args:
        model_config: Model configuration dictionary
        
    Returns:
        List of files information
    """
    # Initialize session state if needed
    if 'files_info' not in st.session_state:
        st.session_state.files_info = []
    
    # File upload section
    st.subheader("Upload Your Course Materials")
    uploaded_files = st.file_uploader("Upload PDF, TXT, or image files", 
                                    type=["pdf", "txt", "png", "jpg", "jpeg"],
                                    accept_multiple_files=True)
    
    if uploaded_files:
        # Process newly uploaded files
        new_files = []
        for uploaded_file in uploaded_files:
            # Check if file is already uploaded (by name)
            if not any(f['name'] == uploaded_file.name for f in st.session_state.files_info):
                # Save the file temporarily
                with tempfile.NamedTemporaryFile(delete=False, suffix=Path(uploaded_file.name).suffix) as tmp_file:
                    tmp_file.write(uploaded_file.getvalue())
                    temp_path = tmp_file.name
                
                # Add file information
                new_files.append({
                    'name': uploaded_file.name,
                    'path': temp_path
                })
        
        # Process the files
        if new_files:
            processed_files = upload_files_to_assistant(new_files)
            st.success(f"{len(processed_files)} new files uploaded successfully!")
    
    return st.session_state.files_info


# import openai
# import streamlit as st
# import os

# def upload_files_to_assistant(client, uploaded_files):
#     file_ids = []
#     file_paths=[]
#     for uploaded_file in uploaded_files:
#         if uploaded_file is not None:
#             file_path=os.path.join(os.getcwd(),uploaded_file.name)
#             response = client.files.create(
#                 file=uploaded_file,
#                 purpose='assistants'
#             )
#             file_ids.append(response.id)
#             file_paths.append(file_path)
#     print(file_paths)
#     return file_ids,file_paths

# def attach_files_to_assistant(client, file_ids, assistant_id):
#     attached_files = []
#     for file_id in file_ids:
#         assistant_file = client.beta.assistants.files.create(
#             assistant_id=assistant_id, 
#             file_id=file_id
#         )
#         attached_files.append(assistant_file)
#     return attached_files


# def check_and_upload_files(client, assistant_id):
    
#     assistant_files = client.beta.assistants.files.list(assistant_id=assistant_id)
#     files_info = [file.id for file in assistant_files.data]
#     if not files_info:
#         st.warning("No Files Included, Upload Educational Material")
#         uploaded_files = st.file_uploader("Choose PDF files", type="pdf", accept_multiple_files=True)

#         if st.button("Upload and Attach Files"):
#             if uploaded_files:
#                 try:
#                     file_ids ,file_paths= upload_files_to_assistant(client, uploaded_files)
                    
#                     attached_files_info = attach_files_to_assistant(client, file_ids, assistant_id)

#                     if not attached_files_info:
#                         st.warning("No files were attached. Loading default data...")
#                     else:
#                         st.success(f"{len(attached_files_info)} files successfully attached.")
#                 except Exception as e:
#                     st.error(f"An error occurred while attaching files: {e}")
#             else:
#                 st.warning("Please select at least one file to upload.")
    
#     return files_info