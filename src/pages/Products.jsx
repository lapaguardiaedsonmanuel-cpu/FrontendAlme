import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/products';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoria: searchParams.get('categoria') || 'todos',
    estado: searchParams.get('estado') || 'todos',
    busqueda: searchParams.get('busqueda') || ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.categoria !== 'todos') params.categoria = filters.categoria;
        if (filters.estado !== 'todos') params.estado = filters.estado;
        if (filters.busqueda) params.busqueda = filters.busqueda;
        const res = await getProducts(params);
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // Actualizar URL
    const newParams = new URLSearchParams();
    if (value !== 'todos') newParams.set(name, value);
    if (name === 'busqueda') newParams.set(name, value);
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda ya está en filters, el useEffect se ejecutará
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filtros laterales */}
      <aside className="w-full md:w-64 bg-white p-4 rounded shadow">
        <h3 className="font-bold text-lg mb-4">Filtrar por</h3>
        <form onSubmit={handleSearch}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Categoría</label>
            <select
              name="categoria"
              value={filters.categoria}
              onChange={handleFilterChange}
              className="w-full border rounded p-2"
            >
              <option value="todos">Todos</option>
              <option value="carteras">Carteras</option>
              <option value="morrales">Morrales</option>
              <option value="mochilas">Mochilas</option>
              <option value="monederos">Monederos</option>
              <option value="canguros">Canguros</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Estado</label>
            <select
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="w-full border rounded p-2"
            >
              <option value="todos">Todos</option>
              <option value="activo">Disponibles</option>
              <option value="agotado">Agotados</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Buscar</label>
            <input
              type="text"
              name="busqueda"
              value={filters.busqueda}
              onChange={handleFilterChange}
              placeholder="Nombre, código..."
              className="w-full border rounded p-2"
            />
          </div>
          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700">
            Filtrar
          </button>
        </form>
      </aside>

      {/* Lista de productos */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Nuestros Productos</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : products.length === 0 ? (
          <p>No se encontraron productos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;