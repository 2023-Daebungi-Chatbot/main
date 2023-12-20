import os
import json
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough
import constants  # Assuming constants.py is in the same directory

def generate_rag_response(query):
    os.environ["OPENAI_API_KEY"] = constants.OPENAI_API_KEY
    openai = ChatOpenAI(model="gpt-4")

    embedding_model = OpenAIEmbeddings()
    loaded_vectors = FAISS.load_local("embeddings_qna", embedding_model)
    retriever = loaded_vectors.as_retriever()

    RAG_PROMPT = """
    CONTEXT: {context}
    QUERY: {question}
    Use the provided context to answer the provided user query. If you don't find the relevant answer in context, then find the answer from LLM. You are a friendly chatbot that answers to Korean students, so you should answer in Korean. Please do not tell the students to ask questions to the professor. If there is a python code or shell command in the answer, please provide it as a code block using ```.
    """

    rag_prompt = ChatPromptTemplate.from_template(RAG_PROMPT)

    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | rag_prompt
        | openai
        | StrOutputParser()
    )
    response = rag_chain.invoke(query)
    data = {}
    data['answer'] = response

    with open('data.json', 'w', encoding='utf-8-sig') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    return data

