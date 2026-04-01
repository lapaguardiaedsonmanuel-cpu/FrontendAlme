// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege rutas que requieren autenticación de administrador.
 * Si el usuario no está autenticado, redirige al login.
 * Si está autenticado, renderiza el contenido hijo (Outlet).
 */
const ProtectedRoute = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    // Muestra un indicador de carga mientras se verifica la autenticación
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
