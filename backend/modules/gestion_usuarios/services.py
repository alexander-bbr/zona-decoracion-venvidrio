# backend/modules/gestion_usuarios/services.py

from sqlalchemy.orm import Session
from typing import List

from .models import Usuario, PermisoModulo, PermisoUsuario
from .schemas import UsuarioCrear, UsuarioEditar
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
        datos_dict = datos.dict(by_alias=False, exclude={"ids_permisos"})
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
        # Excluimos ids_permisos Y contrasena del dict general
        datos_dict = datos.dict(by_alias=False, exclude={"ids_permisos", "contrasena"})
        for campo, valor in datos_dict.items():
            setattr(usuario, campo, valor)

        # Solo actualizamos la contraseña si vino en el request
        if datos.contrasena is not None:
            usuario.contrasena = hashear_contrasena(datos.contrasena)

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
# 3. Obtener usuario para editar (trae sus datos + sus permisos actuales)
def obtener_usuario_completo(db: Session, id_usuario: int):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        return {"status": "error", "message": "Usuario no encontrado"}
    
    permisos = (
        db.query(PermisoModulo)
        .join(PermisoUsuario, PermisoUsuario.id_permisom == PermisoModulo.id_permisom)
        .filter(PermisoUsuario.id_usuario == id_usuario)
        .all()
    )

    return {
        "status": "success",
        "usuario": {
            "id_usuario":     usuario.id_usuario,
            "cedula":         usuario.cedula,
            "carnet_usuario": usuario.carnet_usuario,
            "nombres":        usuario.nombres,
            "apellidos":      usuario.apellidos,
            "telefono":       usuario.telefono,
            "correo":         usuario.correo,
            "rol":            usuario.rol,
            "activo_usuario": usuario.activo_usuario
        },
        "permisos": permisos
    }

# 4. Listar todos los usuarios
def listar_usuarios(db: Session):
    usuarios = db.query(Usuario).all()
    return {
        "status": "success",
        "data": [
            {
                "id_usuario":     u.id_usuario,
                "cedula":         u.cedula,
                "carnet_usuario": u.carnet_usuario,
                "nombres":        u.nombres,
                "apellidos":      u.apellidos,
                "telefono":       u.telefono,
                "correo":         u.correo,
                "rol":            u.rol,
                "activo_usuario": u.activo_usuario
            }
            for u in usuarios
        ]
    }


# 5. Listar catálogo de permisos disponibles
NOMBRES_MODULOS = {
    "inventario_insumos":   "Inventario de Insumos",
    "rendimiento":          "Rendimiento",
    "gestion_usuarios":     "Gestión de Usuarios",
    "gestion_productiva":   "Gestión Productiva",
    "inventario_pantallas":   "Inventario de Pantallas"
}

NOMBRES_ACCIONES = {
    "ver_inventario":           "Ver Inventario",
    "entrada_insumos":          "Entrada de Insumos",
    "salida_insumos":           "Salida de Insumos",
    "historial_movimientos":    "Historial de Movimientos",
    "gestion_insumos":          "Gestión de Insumos",
    "ver":                      "Ver",
    "ver_usuarios":             "Ver Usuarios",
    "crear_editar":             "Crear / Editar",
    "registrar_produccion":     "Registrar Producción",
    "ver_produccion":           "Ver Producción",
    "editar":                   "Editar",
    "gestion_moldes":           "Gestión de Moldes",
    "gestion_justificantes":    "Gestión de Justificantes",
    "entrada_pantallas":        "Entrada de Pantallas",
    "salida_pantallas":         "Salida de Pantallas",
    "gestion_pantallas":        "Gestión de Pantallas"
}

# 5. Listar catálogo de permisos disponibles
def listar_permisos_modulos(db: Session):
    permisos = db.query(PermisoModulo).all()
    resultado = []
    for permiso in permisos:
        resultado.append({
            "id_permisom": permiso.id_permisom,
            "modulo": NOMBRES_MODULOS.get(permiso.modulo, permiso.modulo),
            "accion": NOMBRES_ACCIONES.get(permiso.accion, permiso.accion)
        })
    return {"status": "success", "data": resultado}