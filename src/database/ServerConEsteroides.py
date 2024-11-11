from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from databases import Database
from datetime import datetime
from twilio.rest import Client
import os
from dotenv import load_dotenv

# Carga las variables del archivo .env
load_dotenv()

# Configuración de Twilio
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

# Crear cliente de Twilio
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Configuración de la base de datos
DB_USER = "root"
DB_PASSWORD = ""
DB_HOST = "localhost"
DB_NAME = "sistemas_emergencias"

# Crear conexión con parámetros individuales
database = Database(
    f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
)

app = FastAPI()

# Middleware CORS
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes, ajusta según sea necesario
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    email: str

class ProfileUpdateRequest(BaseModel):
    username: str
    email: str
    currentPassword: str
    newPassword: str

class HistorialResponse(BaseModel):
    id: int
    fecha: datetime
    catastrofe_tipo: str
    catastrofe_mensaje: str
    persona_nombre: str
    persona_telefono: str
    persona_direccion: str
    empresa_nombre: str  # Nombre de la empresa asociada, si existe

class PersonaDetail(BaseModel):
    id: int
    nombre: str
    telefono: str
    direccion: str
    empresa: str  # Nombre de la empresa asociada, si existe
    punto_encuentro_direccion: str  # Dirección del punto de encuentro
    punto_encuentro_nombre: str  # Nombre del punto de encuentro

class SendMessageRequest(BaseModel):
    message: str = Field(..., example="Este es un mensaje de prueba para emergencia.")
    phone_number: str = Field(..., example="+1234567890")

class SendMessageResponse(BaseModel):
    success: bool
    sid: str
    timestamp: datetime

# Eventos de inicio y cierre de conexión de la base de datos
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Ruta de inicio de sesión (simula un token)
@app.post("/api/login")
async def login(request: LoginRequest):
    query = "SELECT * FROM usuarios WHERE nombre = :username AND password = :password"
    result = await database.fetch_one(query, values={"username": request.username, "password": request.password})
    if result:
        # Simulación de token de autenticación
        return {"success": True, "message": "Inicio de sesión exitoso", "token": "token_simulado"}
    else:
        return {"success": False, "message": "Credenciales incorrectas"}

# Ruta para registro de nuevos usuarios
@app.post("/api/register")
async def register(request: RegisterRequest):
    # Verificar si el nombre de usuario o el correo ya existen
    query_check = "SELECT * FROM usuarios WHERE nombre = :username OR email = :email"
    result = await database.fetch_one(query_check, values={"username": request.username, "email": request.email})
    
    if result:
        return {"success": False, "message": "El usuario o el correo ya existen"}

    # Insertar el nuevo usuario en la base de datos
    query_insert = "INSERT INTO usuarios (nombre, password, email) VALUES (:username, :password, :email)"
    await database.execute(query_insert, values={
        "username": request.username,
        "password": request.password,  # Aquí debes usar hashing para las contraseñas en producción
        "email": request.email
    })
    
    # Simulación de token de autenticación
    return {"success": True, "message": "Registro exitoso", "token": "token_simulado"}

# Ruta para actualizar el perfil
@app.post("/api/profile")
async def update_profile(request: ProfileUpdateRequest):
    verify_query = "SELECT * FROM usuarios WHERE nombre = :username AND password = :current_password"
    verify_result = await database.fetch_one(verify_query, values={"username": request.username, "current_password": request.currentPassword})

    if not verify_result:
        raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")

    update_query = "UPDATE usuarios SET email = :email, password = :new_password WHERE nombre = :username"
    await database.execute(update_query, values={"email": request.email, "new_password": request.newPassword, "username": request.username})
    return {"success": True, "message": "Perfil actualizado exitosamente"}

# Ruta para obtener todas las catástrofes con detalles
@app.get("/api/historial", response_model=list[HistorialResponse])
async def get_historial():
    query = """
        SELECT 
            historial.id, 
            historial.fecha, 
            catastrofes.tipo AS catastrofe_tipo, 
            catastrofes.mensaje AS catastrofe_mensaje, 
            personas.nombre AS persona_nombre, 
            personas.telefono AS persona_telefono, 
            personas.direccion AS persona_direccion, 
            empresas.nombre AS empresa_nombre
        FROM historial
        INNER JOIN catastrofes ON historial.catastrofe_id = catastrofes.id
        INNER JOIN personas ON historial.persona_id = personas.id
        LEFT JOIN empresas ON personas.empresa_id = empresas.id
    """
    results = await database.fetch_all(query)
    return results

# Otras rutas para contar catástrofes, personas y puntos de encuentro
@app.get("/api/catastrofes/count")
async def count_catastrofes():
    query = "SELECT COUNT(*) as count FROM historial"
    result = await database.fetch_one(query)
    return {"success": True, "count": result["count"]}

@app.get("/api/puntos_encuentro/count")
async def count_puntos_encuentro():
    query = "SELECT COUNT(*) as count FROM puntos_encuentro"
    result = await database.fetch_one(query)
    return {"success": True, "count": result["count"]}

@app.get("/api/personas/count")
async def count_personas():
    query = "SELECT COUNT(*) as count FROM personas"
    result = await database.fetch_one(query)
    return {"success": True, "count": result["count"]}

@app.get("/api/personas", response_model=list[PersonaDetail])
async def get_personas():
    query = """
        SELECT 
            personas.id,
            personas.nombre,
            personas.telefono,
            personas.direccion,
            empresas.nombre AS empresa
        FROM personas
        LEFT JOIN empresas ON personas.empresa_id = empresas.id
    """
    results = await database.fetch_all(query)
    return results
