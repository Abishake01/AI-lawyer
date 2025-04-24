# AI Legal Assistant (India)

![AI Lawyer Demo](demo-screenshot.png) *Screenshot placeholder*

An AI-powered legal assistant specializing in Indian law, built with:
- **Backend**: Python Flask with Groq API
- **Frontend**: React TypeScript
- **AI Model**: Groq's llama3-8b-8192

## Features

✅ Legal queries about Indian law  
✅ Voice input/output support  
✅ Legal reference citations  
✅ Responsive design  

## Prerequisites

- Python 3.9+
- Node.js 16+
- Groq API key ([Get one here](https://console.groq.com/))
- Basic understanding of Indian legal system

## Setup Guide

### 1. Backend Setup

```bash
# Clone repository
git clone https://github.com/Abishake01/AI-lawyer.git
cd AI-lawyer/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your Groq API key