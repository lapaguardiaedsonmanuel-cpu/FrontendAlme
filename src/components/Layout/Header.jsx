import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { totalItems } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="leading-tight">
          <div className="text-3xl font-extrabold tracking-tight">
            <span className="text-cyan-500">A</span>
            <span className="text-fuchsia-500">l</span>
            <span className="text-lime-500">m</span>
            <span className="text-yellow-400">e</span>
            <span className="text-slate-700 ml-1">Shop</span>
          </div>
          <p className="text-xs text-fuchsia-500 font-semibold">Siempre contigo</p>
        </Link>

        <nav className="hidden md:flex space-x-6 items-center">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-pink-600">
                Dashboard
              </Link>
              <Link to="/admin/productos" className="text-gray-700 hover:text-pink-600">
                Productos
              </Link>
              <Link to="/admin/pedidos" className="text-gray-700 hover:text-pink-600">
                Pedidos
              </Link>
              <span className="text-sm text-slate-600">Hola, {user.nombre || user.email}</span>
              <button onClick={logout} className="text-red-500 hover:text-red-700">
                Cerrar sesion
              </button>
            </>
          ) : (
            <>
              <Link to="/products" className="text-gray-700 hover:text-pink-600">
                Productos
              </Link>
              <Link to="/cart" className="text-gray-700 hover:text-pink-600 relative">
                <i className="fas fa-shopping-cart"></i> Carrito
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs rounded-full px-1">{totalItems}</span>
                )}
              </Link>
              {user ? (
                <>
                  <span className="text-sm text-slate-600">Hola, {user.nombre || user.email}</span>
                  <button onClick={logout} className="text-red-500 hover:text-red-700">
                    Cerrar sesion
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-gray-700 hover:text-pink-600">
                  Inicio de sesion
                </Link>
              )}
            </>
          )}
        </nav>

        <button className="md:hidden text-gray-700" onClick={() => setMobileMenu(!mobileMenu)}>
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>

      {mobileMenu && (
        <div className="md:hidden bg-white border-t">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Dashboard
              </Link>
              <Link to="/admin/productos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Productos
              </Link>
              <Link to="/admin/pedidos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Pedidos
              </Link>
              <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                Cerrar sesion
              </button>
            </>
          ) : (
            <>
              <Link to="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Productos
              </Link>
              <Link to="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Carrito
              </Link>
              {user ? (
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                  Cerrar sesion
                </button>
              ) : (
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Inicio de sesion
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

