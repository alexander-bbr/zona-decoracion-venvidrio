from passlib.context import CryptContext

# Configuramos passlib para usar argon2 en lugar de bcrypt
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hashear_contrasena(contrasena: str) -> str:
    return pwd_context.hash(contrasena)

def verificar_contrasena(contrasena_plana: str, contrasena_hash: str) -> bool:
    return pwd_context.verify(contrasena_plana, contrasena_hash)