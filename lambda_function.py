import json
import os
from prompt import run_gemini_extraction

def lambda_handler(event, context):
    # 1. Handle CORS Preflight requests (Optional but helpful)
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": ""
        }

    try:
        # 2. Extract text from the incoming request body
        body = json.loads(event.get('body', '{}'))
        resume_text = body.get('text', '')
        
        if not resume_text:
            return {
                "statusCode": 400, 
                "body": json.dumps({"error": "No resume text was provided."})
            }

        # 3. Get API Key from Environment Variable
        # Make sure to add GEMINI_API_KEY in Lambda Configuration -> Environment variables
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return {
                "statusCode": 500, 
                "body": json.dumps({"error": "Gemini API Key is missing in Lambda settings."})
            }

        # 4. Call the extraction logic from prompt.py
        # This returns a ResumeSchema (Pydantic) object
        extracted_obj = run_gemini_extraction(resume_text, api_key)

        # 5. Format the result for the React UI
        # This matches the specific format you requested
        formatted_result = f"""## Contact Information

* **Name:** {extracted_obj.contact_info.name}
* **Email:** {extracted_obj.contact_info.email}
* **Phone:** {extracted_obj.contact_info.phone}

## Skills

* **Programming:** {', '.join(extracted_obj.skills.programming) if extracted_obj.skills.programming else 'Not found'}
* **Web:** {', '.join(extracted_obj.skills.web) if extracted_obj.skills.web else 'Not found'}
* **Cloud:** {', '.join(extracted_obj.skills.cloud) if extracted_obj.skills.cloud else 'Not found'}
* **Database:** {', '.join(extracted_obj.skills.database) if extracted_obj.skills.database else 'Not found'}
* **Tools:** {', '.join(extracted_obj.skills.tools) if extracted_obj.skills.tools else 'Not found'}
* **Concepts:** {', '.join(extracted_obj.skills.concepts) if extracted_obj.skills.concepts else 'Not found'}

## Summary

{extracted_obj.summary}"""

        # 6. Return successful response
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" # Crucial for your React frontend
            },
            "body": json.dumps({"result": formatted_result})
        }

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": f"Internal Server Error: {str(e)}"})
        }