import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getMyOrders } from '../services/orders';
import { useAuth } from '../context/AuthContext';

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado'
};

const STATUS_STYLES = {
  pendiente: 'bg-amber-100 text-amber-800',
  pagado: 'bg-blue-100 text-blue-800',
  enviado: 'bg-indigo-100 text-indigo-800',
  entregado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800'
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const MyOrders = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudieron cargar tus pedidos.');
      } finally {
        setFetching(false);
      }
    };

    fetchOrders();
  }, [user]);

  const totalPedidos = orders.length;

  const resumen = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc.total += Number(order.total || 0);
        if (order.estado === 'entregado') acc.entregados += 1;
        if (order.estado === 'pendiente') acc.pendientes += 1;
        return acc;
      },
      { total: 0, entregados: 0, pendientes: 0 }
    );
  }, [orders]);

  if (loading) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">Mis pedidos</h1>
        <Link to="/products" className="text-fuchsia-600 hover:text-fuchsia-700 font-semibold">
          Seguir comprando
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Total pedidos</p>
          <p className="text-2xl font-bold text-slate-800">{totalPedidos}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Pendientes</p>
          <p className="text-2xl font-bold text-amber-700">{resumen.pendientes}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Entregados</p>
          <p className="text-2xl font-bold text-green-700">{resumen.entregados}</p>
        </div>
      </div>

      {fetching ? (
        <p className="text-slate-500">Cargando tus pedidos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-slate-700 mb-3">Aun no tienes pedidos registrados.</p>
          <Link
            to="/products"
            className="inline-block bg-pink-600 text-white px-5 py-2 rounded hover:bg-pink-700"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-slate-500">Pedido</p>
                  <p className="font-bold text-slate-800">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Fecha</p>
                  <p className="font-medium text-slate-700">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Entrega estimada</p>
                  <p className="font-medium text-slate-700">{formatDate(order.fechaEstimadaEntrega)}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    STATUS_STYLES[order.estado] || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {STATUS_LABELS[order.estado] || order.estado}
                </span>
              </div>

              <div className="space-y-2">
                {order.items?.map((item, index) => (
                  <div key={`${order._id}-${index}`} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <p className="text-slate-800">
                      {item.nombre} <span className="text-slate-500">(x{item.cantidad})</span>
                    </p>
                    <p className="text-slate-700">S/ {(Number(item.precioUnitario || 0) * Number(item.cantidad || 0)).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <p className="text-sm text-slate-500">Tipo de envio: {order.envio?.tipo || '-'}</p>
                <p className="font-bold text-fuchsia-700">Total: S/ {Number(order.total || 0).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <p className="mt-5 text-sm text-slate-500">Monto acumulado: S/ {resumen.total.toFixed(2)}</p>
      )}
    </div>
  );
};

export default MyOrders;
