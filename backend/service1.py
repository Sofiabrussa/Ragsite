import sqlite3
import os
from datetime import datetime, timedelta
from fastapi import HTTPException

class Service1:
    # Creación y conexión de base de datos SQLITE
    db_path = os.path.join(os.getcwd(), "conection_.db")  # La base de datos se crea en el directorio actual donde se ejecuta el script.

    @staticmethod
    def conection_db():
        # Usamos "with" para que la conexión se cierre automáticamente
        connection = sqlite3.connect(Service1.db_path)
        connection.row_factory = sqlite3.Row  # Devuelve las filas como diccionarios para poder acceder a los datos
        return connection

    # Crear la tabla de sesiones
    @staticmethod    
    def table_sessions():
        with Service1.conection_db() as connection:  
            connection.execute('''
                CREATE TABLE IF NOT EXISTS sesiones (
                    session_id TEXT PRIMARY KEY,
                    ip_address TEXT
                )
            ''')

    # Insertar una nueva sesión
    @staticmethod 
    def insert_sessions(session_id: str, ip_address: str, created_at: str):
        with Service1.conection_db() as connection:  # Usamos "with" para manejar la conexión
            connection.execute('''
                INSERT INTO sesiones (session_id, ip_address, created_at)
                VALUES (?, ?, ?)
            ''', (session_id, ip_address, created_at))  # Inserto mis valores     
            connection.commit() 

    # Validar la existencia de la sesión
    @staticmethod     
    def validate_sessions(session_id: str):
        with Service1.conection_db() as connection: 
            # Ejecuta una consulta SQL para buscar una fila en la tabla sesiones donde session_id sea igual al valor proporcionado.
            session = connection.execute('''
                SELECT * FROM sesiones WHERE session_id = ?  
            ''', (session_id,)).fetchone()  # fetchone() recupera solo una fila (si existe) del resultado.
            
            if not session:
                raise HTTPException(status_code=400, detail="Session no encontrada")
            
            # Verificar si la sesión tiene más de 15 minutos
            created_at = datetime.fromisoformat(session["created_at"])  # Convierte a datetime
            if datetime.now() - created_at > timedelta(minutes=15):  # Verifica si ha expirado
                raise HTTPException(status_code=400, detail="Session expirada")

    # Crear la tabla de historial
    @staticmethod 
    def table_history():
        with Service1.conection_db() as connection:  
            connection.execute('''
                CREATE TABLE IF NOT EXISTS history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    role TEXT CHECK( role IN ('user', 'assistant')) NOT NULL,
                    mensaje TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (session_id) REFERENCES sesiones(session_id) ON DELETE CASCADE
                )
            ''')
            connection.commit()
            
    @staticmethod
    def get_history(session_id: str):
        with Service1.conection_db() as connection:
            # Consulta para obtener los mensajes ordenados por fecha
            messages = connection.execute('''
                SELECT role, mensaje FROM history
                WHERE session_id = ?
                ORDER BY created_at
            ''', (session_id,)).fetchall()  # Recupera todas las filas del historial

        
        history = ""
        for message in messages:
            role = message["role"]
            msg = message["mensaje"]
            history += f"{role.capitalize()}: {msg}\n"

        return history

    @staticmethod
    def insert_history(session_id: str, role: str, mensaje: str):
        with Service1.conection_db() as connection:
            connection.execute('''
                INSERT INTO history (session_id, role, mensaje, created_at)
                VALUES (?, ?, ?, ?)
            ''', (session_id, role, mensaje, datetime.now().isoformat()))  # Inserta el mensaje con la hora actual
            connection.commit()