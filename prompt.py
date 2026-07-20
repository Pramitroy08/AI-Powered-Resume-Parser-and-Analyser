import google.generativeai as genai
from parser import ResumeSchema
import json

def run_gemini_extraction(text, api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"Extract resume data into JSON format: {text}"
    
    response = model.generate_content(
        prompt,
        generation_config={
            "response_mime_type": "application/json",
            "response_schema": ResumeSchema 
        }
    )
    
    data = json.loads(response.text)
    return ResumeSchema(**data)
