import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Thanks from './pages/Thanks';

import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ProductList from './pages/Admin/ProductList';
import ProductForm from './pages/Admin/ProductForm';
import OrdersList from './pages/Admin/OrdersList';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thanks/:id" element={<Thanks />} />

              <Route path="/login" element={<AdminLogin />} />
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="productos" element={<ProductList />} />
                <Route path="productos/nuevo" element={<ProductForm />} />
                <Route path="productos/editar/:id" element={<ProductForm />} />
                <Route path="pedidos" element={<OrdersList />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
