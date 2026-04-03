import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orders';

const Checkout = () => {
  const { cart, totalPrice, clearCart, resolveItemUnitPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tipoEnvio, setTipoEnvio] = useState('domicilio');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    direccion: '',
    distrito: '',
    // para agencia
    dni: '',
    departamento: '',
    provincia: '',
    distritoDestino: '',
    punto: 'municipalidad'
  });

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let cliente = {};
      let envio = { tipo: tipoEnvio };

      if (tipoEnvio === 'domicilio') {
        cliente.nombre = formData.nombre;
        cliente.celular = formData.celular;
        envio.direccion = formData.direccion;
        envio.distrito = formData.distrito;
      } else if (tipoEnvio === 'agencia') {
        cliente.nombre = formData.nombre;
        cliente.celular = formData.celular;
        cliente.dni = formData.dni;
        envio.destino = {
          departamento: formData.departamento,
          provincia: formData.provincia,
          distrito: formData.distritoDestino
        };
      } else {
        cliente.nombre = formData.nombre;
        cliente.celular = formData.celular;
        envio.puntoRecojo = { lugar: formData.punto };
      }

      const items = cart.map(item => ({
        producto: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: resolveItemUnitPrice(item)
      }));

      const payload = { cliente, envio, items, total: totalPrice };
      const res = await createOrder(payload);
      if (res.data.success) {
        clearCart();
        navigate(`/thanks/${res.data.orderId}`);
      } else {
        alert('Error al procesar el pedido');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Datos de envío</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Tipo de envío *</label>
          <select
            value={tipoEnvio}
            onChange={(e) => setTipoEnvio(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="domicilio">Envío a domicilio (Lima)</option>
            <option value="agencia">Envío por agencia (provincias)</option>
            <option value="punto">Recojo en punto gratuito</option>
          </select>
        </div>

        {tipoEnvio === 'domicilio' && (
          <>
            <div className="mb-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="tel"
                name="celular"
                placeholder="Celular"
                value={formData.celular}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="distrito"
                placeholder="Distrito"
                value={formData.distrito}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </>
        )}

        {tipoEnvio === 'agencia' && (
          <>
            <div className="mb-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="dni"
                placeholder="DNI"
                value={formData.dni}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="tel"
                name="celular"
                placeholder="Celular"
                value={formData.celular}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="departamento"
                placeholder="Departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="provincia"
                placeholder="Provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="distritoDestino"
                placeholder="Distrito"
                value={formData.distritoDestino}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </>
        )}

        {tipoEnvio === 'punto' && (
          <>
            <div className="mb-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="tel"
                name="celular"
                placeholder="Celular"
                value={formData.celular}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Punto de recojo</label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="punto"
                  value="municipalidad"
                  checked={formData.punto === 'municipalidad'}
                  onChange={handleChange}
                />
                <span className="ml-2">Municipalidad de Independencia</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="punto"
                  value="metropolitano"
                  checked={formData.punto === 'metropolitano'}
                  onChange={handleChange}
                />
                <span className="ml-2">Estación del Metropolitano</span>
              </label>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Realizar pedido'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
