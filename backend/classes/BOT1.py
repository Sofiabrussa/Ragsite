import os
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
load_dotenv() 

current_dir = os.getcwd()
CHROMA_PATH = os.path.join(current_dir,"db")
embeddings = OpenAIEmbeddings()
db_chroma = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)
model = ChatOpenAI(model="gpt-4o")

class BOT1:
    def test(self):
        return "OK"
    
    async def message(self, query: str) -> str:

        docs_chroma = db_chroma.similarity_search_with_score(query, k=5)
        print(f"Documentos encontrados: {len(docs_chroma)}")

        # Obtiene el texto de contexto
        context_text = "\n\n".join([doc.page_content for doc, _score in docs_chroma])

        # Define el prompt para el modelo
        PROMPT_TEMPLATE = """
        Answer the question based only on the following context:
        {context}
        Answer the question based on the above context: {question}.
        Provide a detailed answer.
        Answers using the language in which the question was asked.
        Don't justify your answers.
        Don't give information not mentioned in the CONTEXT INFORMATION.
        Do not say "according to the context" or "mentioned in the context" or similar.
        """

        # Formatea el prompt con el contexto y la consulta
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=context_text, question=query)
        print(f"📝 Prompt enviado al modelo:\n{prompt}") 

        response = model.invoke(prompt)
        
        if hasattr(response, 'content'):  # Si el objeto tiene el campo 'content'
            return {"response": response.content.strip()}  # Devuelve solo el texto limpio
        else:
            return {"response": str(response)}
         





