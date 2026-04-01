import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/products';
import { useCart } from '../context/CartContext';
import { resolveMediaUrl } from '../utils/media';
import { getOfertaPrecioUnidad } from '../utils/pricing';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, cantidad);
  };

  if (loading) return <p>Cargando...</p>;
  if (!product) return <p>Producto no encontrado</p>;

  const precioOferta = getOfertaPrecioUnidad(product);

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={resolveMediaUrl(product.imagenes?.[0])}
            alt={product.nombre}
            className="w-full rounded-lg object-contain bg-slate-100 max-h-[520px]"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{product.nombre}</h1>
          <p className="text-gray-600 mb-4">Codigo: {product.codigo}</p>

          <div className="mb-4">
            {precioOferta !== null ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Precio original: <span className="line-through">S/ {Number(product.precioMenor || 0).toFixed(2)}</span>
                </p>
                <p className="text-3xl font-bold text-pink-600">Oferta unidad: S/ {precioOferta.toFixed(2)}</p>
                <p className="text-sm text-slate-700">
                  Precio por mayor: S/ {Number(product.precioMayor || 0).toFixed(2)} (desde {product.cantidadMayorMinima || 6} und)
                </p>
              </div>
            ) : (
              <>
                <span className="text-3xl font-bold text-pink-600">S/ {Number(product.precioMenor || 0).toFixed(2)}</span>
                <p className="text-sm text-slate-700 mt-1">
                  Mayor: S/ {Number(product.precioMayor || 0).toFixed(2)} (desde {product.cantidadMayorMinima || 6} und)
                </p>
              </>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.descripcion}</p>

          {product.variantes.colores?.length > 0 && (
            <div className="mb-4">
              <label className="block font-medium mb-1">Color</label>
              <select className="border rounded p-2 w-full">
                {product.variantes.colores.map((color) => (
                  <option key={color}>{color}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-6">
            <label className="block font-medium mb-1">Cantidad</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value, 10) || 1)}
              className="border rounded p-2 w-24"
            />
            <span className="ml-4 text-gray-600">Stock: {product.stock}</span>
          </div>

          {product.estado === 'agotado' ? (
            <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded">Producto agotado</span>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
