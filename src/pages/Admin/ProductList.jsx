import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/products';
import { getOfertaDescuento, getOfertaPrecioUnidad } from '../../utils/pricing';

const CATEGORY_OPTIONS = [
  { value: 'todos', label: 'Todas las categorias' },
  { value: 'carteras', label: 'Carteras' },
  { value: 'morrales', label: 'Morrales' },
  { value: 'mochilas', label: 'Mochilas' },
  { value: 'monederos', label: 'Monederos' },
  { value: 'canguros', label: 'Canguros' },
  { value: 'otros', label: 'Otros' }
];

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (categoria = 'todos') => {
    try {
      const params = categoria !== 'todos' ? { categoria } : {};
      const res = await getProducts(params);
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar producto?')) {
      try {
        await deleteProduct(id);
        fetchProducts(categoriaFiltro);
      } catch {
        alert('Error al eliminar');
      }
    }
  };

  const handleCategoriaChange = (event) => {
    const next = event.target.value;
    setCategoriaFiltro(next);
    setLoading(true);
    fetchProducts(next);
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Atras
          </button>
          <h1 className="text-2xl font-bold">Productos</h1>
        </div>
        <Link to="/admin/productos/nuevo" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
          Nuevo producto
        </Link>
      </div>

      <div className="mb-4 max-w-sm">
        <label className="block text-sm font-medium mb-1 text-gray-700">Filtrar por categoria</label>
        <select
          value={categoriaFiltro}
          onChange={handleCategoriaChange}
          className="w-full border rounded p-2 bg-white"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Codigo</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Categoria</th>
              <th className="p-3 text-left">Unidad</th>
              <th className="p-3 text-left">Mayor</th>
              <th className="p-3 text-left">Oferta temporada</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="p-3">{product.codigo}</td>
                <td className="p-3">{product.nombre}</td>
                <td className="p-3 capitalize">{product.categoria || 'otros'}</td>
                <td className="p-3">S/ {Number(product.precioMenor || 0).toFixed(2)}</td>
                <td className="p-3">
                  S/ {Number(product.precioMayor || 0).toFixed(2)}
                  <p className="text-xs text-gray-500">desde {product.cantidadMayorMinima || 6} und</p>
                </td>
                <td className="p-3">
                  {product.ofertaDestacada ? (
                    <div className="text-fuchsia-700 font-semibold">
                      <p>S/ {getOfertaPrecioUnidad(product)?.toFixed(2)}</p>
                      <p className="text-xs text-fuchsia-600">
                        Desc. S/ {getOfertaDescuento(product).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      product.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.estado === 'activo' ? 'Activo' : 'Agotado'}
                  </span>
                </td>
                <td className="p-3">
                  <Link to={`/admin/productos/editar/${product._id}`} className="text-blue-600 mr-3">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
