import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, pendingOrders: 0, lowStock: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Atrás
        </button>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Productos totales</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
          <Link to="/admin/productos" className="text-pink-600 text-sm">Ver todos</Link>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Pedidos totales</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
          <Link to="/admin/pedidos" className="text-pink-600 text-sm">Ver pedidos</Link>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Pedidos pendientes</h3>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Stock bajo (&lt;5)</h3>
          <p className="text-3xl font-bold">{stats.lowStock}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
