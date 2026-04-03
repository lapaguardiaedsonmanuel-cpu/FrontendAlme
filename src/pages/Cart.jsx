import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { resolveMediaUrl } from '../utils/media';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice, resolveItemUnitPrice } = useCart();
  const { user } = useAuth();

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Tu carrito esta vacio</h2>
        <Link to="/products" className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mi Carrito</h1>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Cantidad</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-left">Subtotal</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => {
              const precioUnitario = resolveItemUnitPrice(item);
              return (
                <tr key={item.id} className="border-t">
                  <td className="p-3 flex items-center gap-3">
                    <img src={resolveMediaUrl(item.imagen)} alt={item.nombre} className="w-12 h-12 object-cover rounded" />
                    <span>{item.nombre}</span>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="w-16 border rounded p-1"
                    />
                  </td>
                  <td className="p-3">
                    S/ {precioUnitario.toFixed(2)}
                    {item.cantidadMayorMinima > 0 && item.cantidad >= item.cantidadMayorMinima && (
                      <p className="text-xs text-green-700">Precio por mayor aplicado</p>
                    )}
                  </td>
                  <td className="p-3">S/ {(item.cantidad * precioUnitario).toFixed(2)}</td>
                  <td className="p-3">
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 text-right">
          <p className="text-xl font-bold">Total: S/ {totalPrice.toFixed(2)}</p>
          {user ? (
            <Link
              to="/checkout"
              className="inline-block mt-4 bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
            >
              Proceder al pago
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-block mt-4 bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
            >
              Inicia sesion para comprar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
