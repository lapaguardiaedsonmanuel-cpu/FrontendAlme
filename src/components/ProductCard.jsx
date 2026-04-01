import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { resolveMediaUrl } from '../utils/media';
import { getOfertaPrecioUnidad } from '../utils/pricing';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const precioOferta = getOfertaPrecioUnidad(product);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-all">
      <Link to={`/product/${product._id}`}>
        <img
          src={resolveMediaUrl(product.imagenes?.[0])}
          alt={product.nombre}
          className="w-full h-48 object-contain bg-slate-100"
        />
        <div className="p-4">
          <h2 className="font-bold text-lg">{product.nombre}</h2>
          <p className="text-gray-600 text-sm">Codigo: {product.codigo}</p>
          <div className="mt-2">
            {precioOferta !== null ? (
              <>
                <span className="text-pink-600 font-bold">S/ {precioOferta.toFixed(2)}</span>
                <span className="text-gray-500 line-through text-sm ml-2">
                  S/ {Number(product.precioMenor || 0).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-pink-600 font-bold">S/ {Number(product.precioMenor || 0).toFixed(2)}</span>
            )}

            {Number(product.precioMayor) > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                Mayor: S/ {Number(product.precioMayor).toFixed(2)} desde {product.cantidadMayorMinima || 6} und
              </p>
            )}
          </div>
        </div>
      </Link>
      {product.estado === 'agotado' ? (
        <div className="px-4 pb-4">
          <span className="block text-center bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Agotado</span>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-pink-600 text-white py-1 rounded hover:bg-pink-700 transition"
          >
            Agregar al carrito
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
