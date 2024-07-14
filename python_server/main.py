from fastapi import FastAPI, HTTPException, Request, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
import os
from datetime import datetime
from rag_module import generate_rag_response

from langchain_community.chat_models import ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import FAISS

from langchain_community.embeddings import OpenAIEmbeddings
import tiktoken
import numpy as np
from numpy.linalg import norm
import locale
import constants

app = FastAPI()

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

class TextData(BaseModel):
    text_data: str

@app.get("/")
def read_root():
    return {"message": "Server is running"}

@app.post("/save-log")

async def save_log(request: Request, data: dict):
    print("save-log")
    try:
        client_ip = request.client.host  # 클라이언트 IP 주소 가져오기
        print("IP:", client_ip)
        messages = data.get("messages", [])
        log_dir = "logs"
        os.makedirs(log_dir, exist_ok=True)
        file_path = os.path.join(log_dir, f"{client_ip}.txt")
        for message in messages:
            log_entry = f"Time: {datetime.utcnow().isoformat()}, Message: {message['text']}\n"     
            with open(file_path, "a") as log_file:
                log_file.write(log_entry)

        return {"message": "Log saved successfully"}

    except Exception as e:
        print(f"Error writing log file: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/chat2")
async def chat2_endpoint(text_data: TextData):
    try:
        print(f"Received text data:\n{text_data.text_data}")
        user_query = text_data.text_data
        response = generate_rag_response(user_query)
        print(f"Response data:\n{response}")
        return {"answer": response['answer']}

    except Exception as e:
        print(f"Error processing text data: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
