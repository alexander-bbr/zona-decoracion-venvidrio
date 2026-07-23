# backend/modules/gestion_usuarios/models.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.database.conexion import Base


# TABLA: USUARIOS

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, autoincrement=True)
    cedula = Column(String(20), nullable=False, unique=True)
    carnet_usuario = Column(String(20), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    telefono = Column(String(20), nullable=True)
    correo = Column(String(150), nullable=False, unique=True)
    rol = Column(Enum("administrador", "operador", name="rol_enum"), nullable=False)
    activo_usuario = Column(Boolean, nullable=False, default=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    permisos = relationship("PermisoUsuario", back_populates="usuario")



# TABLA: PERMISOS_MODULOS (catálogo)

class PermisoModulo(Base):
    __tablename__ = "permisos_modulos"

    id_permisom = Column(Integer, primary_key=True, autoincrement=True)
    modulo = Column(String(100), nullable=False)
    accion = Column(String(100), nullable=False)

    usuarios_con_permiso = relationship("PermisoUsuario", back_populates="permiso")



# TABLA: PERMISOS_USUARIOS (relacional)

class PermisoUsuario(Base):
    __tablename__ = "permisos_usuarios"

    id_permisou = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    id_permisom = Column(Integer, ForeignKey("permisos_modulos.id_permisom", ondelete="CASCADE"), nullable=False)

    usuario = relationship("Usuario", back_populates="permisos")
    permiso = relationship("PermisoModulo", back_populates="usuarios_con_permiso")