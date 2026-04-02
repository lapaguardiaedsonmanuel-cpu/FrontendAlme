import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/products';
import ProductCard from '../components/ProductCard';
import { resolveMediaUrl } from '../utils/media';
import { getOfertaDescuento, getOfertaPrecioUnidad } from '../utils/pricing';

const CATEGORY_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'carteras', label: 'Carteras' },
  { value: 'morrales', label: 'Morrales' },
  { value: 'mochilas', label: 'Mochilas' },
  { value: 'monederos', label: 'Monederos' },
  { value: 'canguros', label: 'Canguros' },
  { value: 'otros', label: 'Otros' }
];

const SORT_OPTIONS = [
  { value: 'novedades', label: 'Novedades' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'descuento', label: 'Mayor descuento' },
  { value: 'nombre', label: 'Nombre A-Z' }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('novedades');
  const [offerIndex, setOfferIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts({ estado: 'activo' });
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const offers = useMemo(() => {
    const adminOffers = products
      .filter((product) => product.ofertaDestacada)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return adminOffers.slice(0, 5);
  }, [products]);

  useEffect(() => {
    if (offers.length <= 1) {
      setOfferIndex(0);
      return undefined;
    }

    const timer = setInterval(() => {
      setOfferIndex((prev) => (prev + 1) % offers.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [offers.length]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'todos' || product.categoria === selectedCategory;

      const matchesSearch =
        query.length === 0 ||
        product.nombre?.toLowerCase().includes(query) ||
        product.codigo?.toLowerCase().includes(query) ||
        product.descripcion?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'precio_asc') return Number(a.precioMenor) - Number(b.precioMenor);
      if (sortBy === 'precio_desc') return Number(b.precioMenor) - Number(a.precioMenor);
      if (sortBy === 'descuento') {
        const discountA = getOfertaDescuento(a);
        const discountB = getOfertaDescuento(b);
        return discountB - discountA;
      }
      if (sortBy === 'nombre') return a.nombre.localeCompare(b.nombre);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [products, searchTerm, selectedCategory, sortBy]);

  const productsLink = `/products?busqueda=${encodeURIComponent(searchTerm)}${
    selectedCategory !== 'todos' ? `&categoria=${selectedCategory}` : ''
  }`;

  const activeOffer = offers[offerIndex];
  const activeOfferPrice = activeOffer ? getOfertaPrecioUnidad(activeOffer) : null;
  const activeOfferDiscount = activeOffer ? getOfertaDescuento(activeOffer) : 0;
  const heroVisual = activeOffer || products[0];

  return (
    <div className="relative">
      <div className="alme-orb alme-orb-1" />
      <div className="alme-orb alme-orb-2" />

      <section
        className="relative overflow-hidden min-h-[calc(100svh-5.25rem)] border-y border-white/20 bg-slate-950 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.65)] alme-fade-up"
        style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
      >
        {heroVisual && (
          <div
            className="absolute inset-0 alme-hero-bg alme-hero-stage"
            style={{ backgroundImage: `url(${resolveMediaUrl(heroVisual.imagenes?.[0])})` }}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),rgba(15,23,42,0.82)_72%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/55" />

        <div className="relative z-10 flex h-full min-h-[72vh] items-center justify-end p-6 md:p-10">
          <div className="alme-hero-copy max-w-xl text-white text-right">
            <p className="text-xs md:text-sm uppercase tracking-[0.18em] text-white/85">AW 2026 Collection</p>
            <p className="mt-2 text-6xl md:text-8xl font-serif leading-none tracking-tight">
              Alme Shop
            </p>
            <p className="text-fuchsia-200 font-medium text-2xl md:text-3xl mt-2">Siempre contigo</p>
            <p className="mt-5 text-lg md:text-2xl text-white/90">
              Elegancia joven con actitud moderna
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-end">
              <Link
                to="/products"
                className="border border-white/70 px-6 py-3 text-white hover:bg-white hover:text-slate-900 transition"
              >
                Comprar ahora
              </Link>
              <a
                href="#catalogo"
                className="border border-white/40 px-6 py-3 text-white/90 hover:border-white/80 transition"
              >
                Ver catalogo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-10 relative overflow-hidden rounded-3xl border border-cyan-100 bg-transparent p-5 md:p-7 shadow-[0_20px_70px_-40px_rgba(37,99,235,0.25)] alme-fade-up">
        {activeOffer && (
          <>
            <div className="absolute inset-0 hidden lg:block">
              <div className="absolute inset-y-0 left-0 w-[58%] overflow-hidden">
                <div
                  className="absolute inset-0 scale-110 bg-cover bg-center opacity-65 blur-md"
                  style={{ backgroundImage: `url(${resolveMediaUrl(activeOffer.imagenes?.[0])})` }}
                />
                <div className="absolute inset-0 bg-white/35" />
              </div>
              <div className="absolute inset-y-0 right-0 w-[42%] bg-white/92" />
            </div>
            <div className="absolute inset-0 lg:hidden bg-white/86" />
          </>
        )}
        {!activeOffer && <div className="absolute inset-0 bg-white/85" />}
        <div className="relative">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">Vitrina de ofertas</h2>
          <Link to="/products" className="text-sm md:text-base text-fuchsia-600 hover:text-fuchsia-700 font-semibold">
            Ver todo
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Cargando ofertas...</p>
        ) : !activeOffer ? (
          <p className="text-slate-500">No hay ofertas disponibles por ahora.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-center">
            <div className="lg:col-span-3">
              <Link
                to={`/product/${activeOffer._id}`}
                className="rounded-2xl overflow-hidden alme-float flex items-center justify-center"
              >
                <img
                  src={resolveMediaUrl(activeOffer.imagenes?.[0])}
                  alt={activeOffer.nombre}
                  className="h-64 md:h-80 w-full object-contain rounded-xl"
                />
              </Link>

              {!loading && offers.length > 1 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOfferIndex((prev) => (prev - 1 + offers.length) % offers.length)}
                    className="rounded-lg border border-cyan-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-cyan-50"
                  >
                    Anterior
                  </button>
                  {offers.map((offer, index) => (
                    <button
                      type="button"
                      key={offer._id}
                      onClick={() => setOfferIndex(index)}
                      className={`h-2.5 w-6 rounded-full transition ${index === offerIndex ? 'bg-fuchsia-500' : 'bg-cyan-200'}`}
                      aria-label={`Oferta ${index + 1}`}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setOfferIndex((prev) => (prev + 1) % offers.length)}
                    className="rounded-lg border border-cyan-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-cyan-50"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <p className="inline-flex rounded-full bg-fuchsia-100 text-fuchsia-700 text-xs font-semibold px-3 py-1 mb-3">
                Oferta por temporada
              </p>
              <h3 className="text-2xl font-bold text-slate-900">{activeOffer.nombre}</h3>
              <p className="text-sm text-slate-700 mt-1 font-medium">Codigo: {activeOffer.codigo}</p>
              <p className="mt-4 text-slate-800">{activeOffer.descripcion}</p>

              <div className="mt-5 flex items-end gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-600">
                    Original: <span className="line-through">S/ {Number(activeOffer.precioMenor || 0).toFixed(2)}</span>
                  </span>
                  <span className="text-3xl font-black text-fuchsia-600">
                    Oferta unidad: S/ {Number(activeOfferPrice || 0).toFixed(2)}
                  </span>
                  <span className="text-sm text-slate-700">
                    Mayor: S/ {Number(activeOffer.precioMayor || 0).toFixed(2)} (desde {activeOffer.cantidadMayorMinima || 6} und)
                  </span>
                </div>
              </div>

              <p className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                Ahorra S/ {Number(activeOfferDiscount || 0).toFixed(2)}
              </p>

              <div className="mt-6">
                <Link
                  to={`/product/${activeOffer._id}`}
                  className="inline-flex rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-3 text-white font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        )}

        </div>
      </section>

      <section id="catalogo" className="mt-8 md:mt-10 rounded-3xl border border-cyan-100 bg-white/90 p-5 md:p-7 shadow-[0_20px_70px_-50px_rgba(34,197,94,0.25)] alme-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">Catalogo inteligente</h2>
          <p className="text-sm text-slate-500">Busca, filtra y ordena en tiempo real</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre, descripcion o codigo"
            className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-cyan-300"
          />
          <Link
            to={productsLink}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-fuchsia-500 text-white px-5 py-3 font-semibold hover:from-cyan-700 hover:to-fuchsia-600 transition"
          >
            Ver resultados completos
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-300/40'
                  : 'bg-cyan-50 text-slate-700 hover:bg-cyan-100'
              }`}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="max-w-xs">
          <label className="block text-sm text-slate-600 mb-1">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full rounded-xl border border-cyan-200 bg-white px-3 py-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mt-8 md:mt-10 alme-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">Productos para ti</h2>
          <p className="text-sm text-slate-600">
            {loading ? 'Cargando productos...' : `${filteredProducts.length} producto(s) encontrado(s)`}
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500">Cargando...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-slate-700 mb-3">No encontramos productos para tu busqueda.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('todos');
                setSortBy('novedades');
              }}
              className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-2 text-white font-semibold hover:from-fuchsia-600 hover:to-pink-600"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.slice(0, 9).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length > 9 && (
          <div className="text-center mt-7">
            <Link
              to={productsLink}
              className="inline-flex rounded-xl bg-gradient-to-r from-cyan-600 to-fuchsia-500 px-6 py-3 text-white font-semibold hover:from-cyan-700 hover:to-fuchsia-600 transition"
            >
              Ver todos los resultados
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
