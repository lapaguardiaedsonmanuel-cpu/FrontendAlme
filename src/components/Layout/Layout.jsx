import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();
  const isHome = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!loading && isAdmin && !isAdminRoute) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [loading, isAdmin, isAdminRoute, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow container mx-auto px-4 ${isHome ? 'pt-0 pb-8' : 'py-8'}`}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
