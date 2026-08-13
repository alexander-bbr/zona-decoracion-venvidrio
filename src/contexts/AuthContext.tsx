import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Definir tipos para permisos
interface Permiso {
  modulo: string;
  accion: string;
}

interface User {
  carnetUsuario: string;
  nombres: string;
  apellidos: string;
  rol: string;
  permisos: Permiso[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (carnetUsuario: string, contrasena: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (modulo: string, accion: string) => boolean;
  hasAnyPermission: (modulo: string, acciones: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://127.0.0.1:8000/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user_data");

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (carnetUsuario: string, contrasena: string) => {
    try {
      // IMPORTANTE: Usar formato x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append("username", carnetUsuario); // El backend espera "username"
      formData.append("password", contrasena); // El backend espera "password"

      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });

      console.log("Respuesta del servidor:", response.status);

      const { access_token, rol, nombres, apellidos, permisos } = response.data;

      // Guardar el token
      localStorage.setItem("access_token", access_token);

      // Configurar el header de Authorization
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // Guardar datos del usuario con permisos
      const userData: User = {
        carnetUsuario,
        nombres: nombres || "Usuario",
        apellidos: apellidos || "",
        rol: rol || "operador",
        permisos: permisos || [],
      };

      localStorage.setItem("user_data", JSON.stringify(userData));

      setToken(access_token);
      setUser(userData);
    } catch (error: any) {
      console.error("Error completo:", error);

      if (error.response) {
        console.log("Data del error:", error.response.data);
        console.log("Status del error:", error.response.status);

        // Manejar errores específicos
        if (error.response.status === 401) {
          throw new Error("Carnet o contraseña incorrectos");
        } else if (error.response.status === 400) {
          throw new Error("Solicitud inválida. Verifica los datos.");
        } else if (error.response.status === 422) {
          // Error de validación - mostrar detalles
          const errorData = error.response.data;
          if (errorData.detail && Array.isArray(errorData.detail)) {
            const messages = errorData.detail
              .map((err: any) => {
                const field = err.loc?.join(" > ") || "campo";
                return `${field}: ${err.msg}`;
              })
              .join(", ");
            throw new Error(`Error de validación: ${messages}`);
          }
          throw new Error("Error de validación. Verifica los campos.");
        }

        const detail = error.response.data?.detail;
        if (typeof detail === "string") {
          if (detail === "Usuario desactivado, contacte al administrador") {
            throw new Error("Usuario desactivado. Contacte al administrador.");
          }
          throw new Error(detail);
        }

        throw new Error("Error al iniciar sesión");
      } else if (error.request) {
        throw new Error(
          "No se recibió respuesta del servidor. Verifica que el backend esté corriendo.",
        );
      } else {
        throw new Error("Error al configurar la petición: " + error.message);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    if (typeof roles === "string") {
      return user.rol === roles;
    }
    return roles.includes(user.rol);
  };

  const hasPermission = (modulo: string, accion: string): boolean => {
    if (!user || !user.permisos) return false;
    return user.permisos.some(
      (p) => p.modulo === modulo && p.accion === accion,
    );
  };

  const hasAnyPermission = (modulo: string, acciones: string[]): boolean => {
    if (!user || !user.permisos) return false;
    return acciones.some((accion) => hasPermission(modulo, accion));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!user && !!token,
        hasRole,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// Interceptor para manejar errores 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      delete axios.defaults.headers.common["Authorization"];
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  },
);
