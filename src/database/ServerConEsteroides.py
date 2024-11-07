from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from databases import Database
import asyncio
from datetime import datetime

DB_USER = "root"
DB_PASSWORD = ""
DB_HOST = "localhost"
DB_NAME = "sistemas_emergencias"

# Crear conexión con parámetros individuales
database = Database(
    f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
)


app = FastAPI()

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

# Ruta para contar catástrofes
@app.get("/api/catastrofes/count")
async def count_catastrofes():
    query = "SELECT COUNT(*) as count FROM historial"
    result = await database.fetch_one(query)
    return {"success": True, "count": result["count"]}

# Ruta para contar puntos de encuentro
@app.get("/api/puntos_encuentro/count")
async def count_puntos_encuentro():
    query = "SELECT COUNT(*) as count FROM puntos_encuentro"
    result = await database.fetch_one(query)
    return {"success": True, "count": result["count"]}

# Ruta para contar personas
@app.get("/api/personas/count")
async def count_personas():
    query = "SELECT COUNT(*) as count FROM personas"
    result = await database.fetch_one(query)
    return {"success": True, "count": result["count"]}

# Ruta para obtener el detalle de todas las personas y sus empresas asociadas
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
