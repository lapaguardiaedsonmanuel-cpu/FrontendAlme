import React from 'react';
import { useParams, Link } from 'react-router-dom';

const Thanks = () => {
  const { id } = useParams();

  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-green-600 mb-4">¡Pedido realizado!</h1>
      <p className="text-gray-700 mb-6">Tu pedido ha sido registrado. Pronto nos comunicaremos contigo.</p>
      <p className="text-gray-600 mb-8">Número de pedido: <span className="font-mono">{id}</span></p>
      <Link to="/products" className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">
        Seguir comprando
      </Link>
    </div>
  );
};

export default Thanks;
