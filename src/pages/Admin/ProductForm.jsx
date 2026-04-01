import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../../services/products';
import { resolveMediaUrl } from '../../utils/media';
import { getOfertaPrecioUnidad } from '../../utils/pricing';

const CATEGORY_OPTIONS = [
  { value: 'carteras', label: 'Carteras' },
  { value: 'morrales', label: 'Morrales' },
  { value: 'mochilas', label: 'Mochilas' },
  { value: 'monederos', label: 'Monederos' },
  { value: 'canguros', label: 'Canguros' },
  { value: 'otros', label: 'Otros' }
];

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precioMenor: '',
    precioMayor: '',
    cantidadMayorMinima: 6,
    stock: '',
    categoria: 'otros',
    ofertaDestacada: false,
    variantes: {
      colores: '',
      tamanos: '',
      modelos: '',
      marcas: ''
    },
    imagenes: []
  });
  const [imagenesExistentes, setImagenesExistentes] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await getProduct(id);
          const prod = res.data;
          setFormData({
            codigo: prod.codigo,
            nombre: prod.nombre,
            descripcion: prod.descripcion,
            precioMenor: prod.precioMenor,
            precioMayor: prod.precioMayor,
            cantidadMayorMinima: prod.cantidadMayorMinima || 6,
            stock: prod.stock,
            categoria: prod.categoria,
            ofertaDestacada: Boolean(prod.ofertaDestacada),
            variantes: {
              colores: prod.variantes?.colores?.join(', ') || '',
              tamanos: prod.variantes?.tamanos?.join(', ') || '',
              modelos: prod.variantes?.modelos?.join(', ') || '',
              marcas: prod.variantes?.marcas?.join(', ') || ''
            },
            imagenes: []
          });
          setImagenesExistentes(prod.imagenes || []);
        } catch (error) {
          console.error(error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('variantes.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        variantes: { ...prev.variantes, [field]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imagenes: e.target.files }));
  };

  const handleRemoveExistingImage = (imageToRemove) => {
    setImagenesExistentes((prev) => prev.filter((img) => img !== imageToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === 'variantes') {
        Object.keys(formData.variantes).forEach((v) => {
          form.append(`variantes[${v}]`, formData.variantes[v]);
        });
      } else if (key === 'imagenes') {
        for (let i = 0; i < formData.imagenes.length; i += 1) {
          form.append('imagenes', formData.imagenes[i]);
        }
      } else {
        form.append(key, formData[key]);
      }
    });

    if (id) {
      form.append('imagenesExistentes', JSON.stringify(imagenesExistentes));
    }

    try {
      if (id) {
        await updateProduct(id, form);
      } else {
        await createProduct(form);
      }
      navigate('/admin/productos');
    } catch (error) {
      console.error(error);
      alert('Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const precioOfertaPreview = getOfertaPrecioUnidad(formData);

  return (
    <div className="bg-white rounded shadow p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Atras
        </button>
        <h1 className="text-2xl font-bold">{id ? 'Editar producto' : 'Nuevo producto'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Codigo *</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4 rounded border border-pink-200 bg-pink-50/60 p-3">
          <label className="inline-flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              name="ofertaDestacada"
              checked={formData.ofertaDestacada}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Activar oferta destacada
          </label>
          <p className="text-xs text-pink-700 mt-1">
            Al activar oferta, el precio por unidad publicado se descuenta automaticamente en S/ 4.00.
          </p>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Descripcion *</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border rounded p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1">Precio por unidad (menor) *</label>
            <input
              type="number"
              step="0.01"
              name="precioMenor"
              value={formData.precioMenor}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Precio por mayor *</label>
            <input
              type="number"
              step="0.01"
              name="precioMayor"
              value={formData.precioMayor}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Cantidad minima para precio por mayor *</label>
          <input
            type="number"
            min="1"
            name="cantidadMayorMinima"
            value={formData.cantidadMayorMinima}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">Desde esta cantidad se aplicara el precio por mayor.</p>
        </div>

        {(formData.precioMenor || formData.precioMayor) && (
          <div className="mb-4 rounded border border-gray-200 bg-gray-50 p-3 text-sm">
            <p className="font-semibold text-gray-700 mb-1">Vista previa de precios</p>
            <p className="text-gray-700">Original: S/ {Number(formData.precioMenor || 0).toFixed(2)}</p>
            {precioOfertaPreview !== null && (
              <p className="text-fuchsia-700 font-semibold">Oferta unidad: S/ {precioOfertaPreview.toFixed(2)}</p>
            )}
            <p className="text-gray-700">
              Mayor (desde {formData.cantidadMayorMinima || 1} und): S/ {Number(formData.precioMayor || 0).toFixed(2)}
            </p>
          </div>
        )}

        <div className="mb-4">
          <label className="block font-medium mb-1">Stock *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Categoria</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Variantes (separadas por comas)</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="variantes.colores"
              placeholder="Colores"
              value={formData.variantes.colores}
              onChange={handleChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="variantes.tamanos"
              placeholder="Tamanos"
              value={formData.variantes.tamanos}
              onChange={handleChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="variantes.modelos"
              placeholder="Modelos"
              value={formData.variantes.modelos}
              onChange={handleChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="variantes.marcas"
              placeholder="Marcas"
              value={formData.variantes.marcas}
              onChange={handleChange}
              className="border rounded p-2"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Imagenes</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded p-2"
          />
          {imagenesExistentes.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Imagenes actuales (puedes eliminarlas):</p>
              <div className="flex flex-wrap gap-3">
                {imagenesExistentes.map((img) => (
                  <div key={img} className="relative">
                    <img src={resolveMediaUrl(img)} alt="preview" className="w-20 h-20 object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs hover:bg-red-700"
                      title="Eliminar imagen"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar producto'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
