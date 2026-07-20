# Resume Parser, Analyser, and Builder 🚀

A full-stack AI-powered application designed to streamline recruitment by automatically parsing resumes, analyzing content against job goals, and suggesting improvements using Google Gemini AI.

## 🏗️ Architecture Overview
* **Frontend:** React + Vite + Amplify UI (Dark Theme)
* **Storage:** AWS S3 (Secure document hosting)
* **Backend:** AWS Lambda (Python 3.12)
* **AI Engine:** Google Gemini Pro (Natural Language Processing)
# AI-Powered Multimodal Resume Parser & Analyser 🚀

An end-to-end, cloud-native solution designed to automate professional resume screening and provide intelligent "Gap Analysis." This system integrates a **React Web Dashboard**, a **Flutter Mobile Application**, and a **Serverless Python Backend** powered by **Google Gemini Pro AI**.

---

## 📑 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [System Architecture](#system-architecture)
4. [Prerequisites & Global Setup](#prerequisites--global-setup)
5. [Installation & Local Development](#installation--local-development)
6. [Core Workflow (Step-by-Step)](#core-workflow)
7. [AI Logic & Prompt Engineering](#ai-logic--prompt-engineering)
8. [Directory Structure](#directory-structure)

---

## 🌟 Project Overview
Traditional Resume Parsers often rely on simple keyword matching. This project leverages **Generative AI (LLMs)** to understand the semantic context of a user's experience. It doesn't just look for words; it analyzes how well a candidate's background aligns with their specific career goals.

---

## 🛠️ Key Features
* **Multimodal Access:** Fully functional Web and Mobile clients.
* **Intelligent Scoring:** Provides a 1-10 compatibility score using Google Gemini Pro.
* **Actionable Insights:** Generates 3-5 specific steps to improve resume impact.
* **Secure Cloud Storage:** Industry-standard file handling via AWS S3.
* **Privacy-First:** Serverless processing ensures data is only held in-memory during analysis.

---

## 🏗️ System Architecture
The system follows a decoupled, microservices-oriented architecture:
* **Frontend:** React (Vite) for Web and Flutter (Dart) for Mobile.
* **Infrastructure:** AWS Amplify for Auth, AWS S3 for storage.
* **Backend:** AWS Lambda (Python 3.12) acting as the middleware.
* **Intelligence:** Google Generative AI SDK (Gemini Pro).

---

## 📋 Prerequisites & Global Setup
### 1. Software Requirements
* **Node.js** (v18+) & **npm** (For Web)
* **Flutter SDK** & **Dart** (For Mobile)
* **Python 3.12** (For Backend development/testing)
* **AWS CLI** (Configured with IAM credentials)


---

## ⚙️ Setup Instructions

### 1. AWS S3 Configuration
* Create an S3 bucket named `isi-project`.
* Enable **CORS** in the Permissions tab to allow the React frontend to upload files:
    ```json
    [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
        }
    ]
    ```
### 2. AWS Lambda Setup
* Runtime: **Python 3.12**
* **Environment Variables:** Add `GEMINI_API_KEY` to the Lambda configuration.
* **Layers:** Ensure the `google-generativeai` library is included in a Lambda Layer.
* **Trigger:** Configure the Lambda to be invoked via an API Gateway or direct SDK call.


---

## 🛠️ Project Structure
* `src/App.jsx`: Main UI with Authenticator and Document Processor.
* `lambda_function.py`: The entry point for the AWS Lambda backend.
* `parser.py`: Logic for extracting text from uploaded documents.
* `prompt.py`: Specialized AI prompts for resume analysis

---

## Running the Web Interface
# Bash
cd WEB_INTERFACE
* Install dependencies: `npm install`
* Run locally: `npm run dev`
* Build for S3: `npm run build`

## Running the Flutter Mobile Application
# Bash
cd MOBILE_APP
flutter pub get
# To run on a connected device or emulator:
flutter run

### 🔄 Core Workflow (Step-by-Step)
1. Authentication: User logs in via AWS Amplify (Web) or Cognito (Mobile).
2. Secure Upload: The user selects a resume (PDF/TXT). The file is uploaded directly to AWS S3.
3. Goal Input: User defines their target career goal (e.g., "Data Scientist" or "Software Engineer").
4. Trigger: The client sends the S3 Object Key and User Goal to the AWS Lambda endpoint.
5. Processing: parser.py extracts text from the S3 object, and prompt.py guides Gemini Pro through the analysis.
6. Result: A structured report including a score and improvement roadmap is displayed on the UI.

### 🧠 AI Logic & Prompt Engineering
The core "Analyser" functionality utilizes System-Role Prompting. The AI is instructed to act as a Senior Technical Recruiter. It evaluates the document based on:
1. Keyword Density: Alignment with industry-specific terminology.
2. Quantifiable Impact: Checking for data-backed achievements.
3. Goal Mapping: Identifying the "Delta" (skills gap) between the resume and the target role.

### 🚀 Recent Updates
- [x] Swapped UI order: **Secure Upload** now happens before **Goal Input**.
- [x] Implemented High-Contrast Dark Theme for better visibility.
- [x] Fixed input field border visibility in Authenticator.
