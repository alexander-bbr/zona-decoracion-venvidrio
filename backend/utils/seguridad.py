from argon2 import PasswordHasher

ph = PasswordHasher()

def hashear_contrasena(contrasena: str) -> str:
    return ph.hash(contrasena)

def verificar_contrasena(contrasena_plana: str, contrasena_hash: str) -> bool:
    try:
        return ph.verify(contrasena_hash, contrasena_plana)
    except Exception:
        return False