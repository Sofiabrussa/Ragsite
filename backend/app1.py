#pip install "fastapi[standard]" para ejecutar el proyecto
#Comando para ejecutar el archivo --> fastapi dev nombreArchivo
from fastapi import FastAPI, HTTPException
from classes.Item import Item  
from classes.BOT1 import BOT1
from classes.Item import QueryRequest 
import uuid
from datetime import datetime
from fastapi import Request
from service1 import Service1 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI() #Creamos una instancia de fastAPI class
#Ejecuto funcion para crear mi tabla
Service1.table_sessions()
Service1.table_history() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test") #El camino es /test y la operacion es un get 
async def root(): #FastAPI lo llamará cada vez que reciba una solicitud a la URL /test
    bot= BOT1()
    rta = bot.test() 
    return {"message": rta} #Respuesta en formato json

#Metodo post
@app.post("/items")
async def double_item(request: Item):  #el parámetro request se utiliza para recibir los datos enviados en el cuerpo de la solicitud por el cliente.
    return request.numero * 2

#Metodo post Message
@app.post("/message")
async def message(query_request: QueryRequest, request: Request):
    # Obtener session_id desde los headers
    session_id = request.headers.get("session_id") #Pido el session_id al header de la solicitud
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID es requerido")
    
    # Validar la existencia de la sesión
    Service1.validate_sessions(session_id)

    # Obtener el historial de mensajes para esta sesión
    history = Service1.get_history(session_id)

    # Agregar la nueva consulta al contexto
    user_query = f"User: {query_request.query}"

    # Combinar el historial con la nueva pregunta
    context = history + user_query + "\nAssistant:"

    bot = BOT1()
    response_text = await bot.message(context) 
    
    # Registrar el mensaje de la nueva consulta en el historial
    Service1.insert_history(session_id, "user", query_request.query) 
    Service1.insert_history(session_id, "assistant", str(response_text))

    return {"response": response_text}

# Endpoint para crear una sesión
@app.post('/session')
#El objeto Request te permite interactuar con los detalles de la solicitud HTTP que el cliente está haciendo al servidor
async def create_session(request: Request):
    #Variables para mi session
    session_id = str(uuid.uuid4())  #creo un UUID. Identificador estándar que se usa para garantizar que los identificadores sean únicos a nivel global, sin necesidad de coordinar entre sistemas. 
    ip_address = request.client.host  #Obtengo ip real 
    created_at = datetime.now().isoformat()  

    Service1.insert_sessions(session_id, ip_address, created_at)
    return {"session_id": session_id}  

