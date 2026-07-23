# backend/modules/gestion_usuarios/services.py

from sqlalchemy.orm import Session
from typing import List

from .models import Usuario, PermisoModulo, PermisoUsuario
from .schemas import UsuarioCrear, UsuarioEditar
from backend.utils.db_funciones import obtener_inventario_generico
from backend.utils.seguridad import hashear_contrasena

# 1. Crear usuario completo (datos personales + permisos)
def crear_usuario_completo(db: Session, datos: UsuarioCrear):
    # Validaciones para evitar duplicados
    if db.query(Usuario).filter(Usuario.carnet_usuario == datos.carnet_usuario).first():
        return {"status": "error", "message": "El carnet ya está registrado"}

    if db.query(Usuario).filter(Usuario.cedula == datos.cedula).first():
        return {"status": "error", "message": "La cédula ya está registrada"}

    if db.query(Usuario).filter(Usuario.correo == datos.correo).first():
        return {"status": "error", "message": "El correo ya está registrado"}

    try:
        # Extraemos los datos excluyendo la lista de permisos para el modelo Usuario
        datos_dict = datos.model_dump(by_alias=False, exclude={"ids_permisos"})
        datos_dict["contrasena"] = hashear_contrasena(datos_dict["contrasena"])

        # Insertamos al usuario
        nuevo_usuario = Usuario(**datos_dict)
        db.add(nuevo_usuario)
        db.flush() # Obtenemos el id_usuario generado sin cerrar la transacción

        # Le asignamos los permisos recibidos
        for id_permiso in datos.ids_permisos:
            db.add(PermisoUsuario(id_usuario=nuevo_usuario.id_usuario, id_permisom=id_permiso))

        db.commit()
        return {"status": "success", "id": nuevo_usuario.id_usuario}
    
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}


# 2. Editar usuario completo (datos personales + estado + permisos)
def editar_usuario_completo(db: Session, id_usuario: int, datos: UsuarioEditar):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        return {"status": "error", "message": "Usuario no encontrado"}

    try:
        # Actualizamos la información personal (incluye el estado activo/inactivo)
        datos_dict = datos.model_dump(by_alias=False, exclude={"ids_permisos"})
        for campo, valor in datos_dict.items():
            setattr(usuario, campo, valor)

        # Eliminamos los permisos anteriores del usuario
        db.query(PermisoUsuario).filter(PermisoUsuario.id_usuario == id_usuario).delete()
        
        # Insertamos la nueva lista de permisos
        for id_permiso in datos.ids_permisos:
            db.add(PermisoUsuario(id_usuario=id_usuario, id_permisom=id_permiso))

        db.commit()
        return {"status": "success", "id": usuario.id_usuario}
    
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}


# 3. Obtener usuario para editar (trae sus datos + sus permisos actuales)
def obtener_usuario_completo(db: Session, id_usuario: int):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        return {"status": "error", "message": "Usuario no encontrado"}
    
    # Hacemos la consulta para traer el detalle de los permisos que tiene asignados
    permisos = (
        db.query(PermisoModulo)
        .join(PermisoUsuario, PermisoUsuario.id_permisom == PermisoModulo.id_permisom)
        .filter(PermisoUsuario.id_usuario == id_usuario)
        .all()
    )

    return {
        "status": "success",
        "usuario": usuario,
        "permisos": permisos
    }


# 4. Listar todos los usuarios
def listar_usuarios(db: Session):
    return obtener_inventario_generico(db, Usuario)


# 5. Listar catálogo de permisos disponibles
def listar_permisos_modulos(db: Session):
    return obtener_inventario_generico(db, PermisoModulo)
