import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, socialLogin } = useAuth();

  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const redirectByRole = (session) => {
    if (session?.isAdmin || session?.user?.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }
    navigate('/');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      let session;
      if (mode === 'register') {
        session = await register(formData.nombre, formData.email, formData.password);
      } else {
        session = await login(formData.email, formData.password);
      }
      redirectByRole(session);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo completar la autenticacion');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError('');

    try {
      // Demo de social-login sin OAuth real: se usan nombre y email ingresados.
      if (!formData.nombre || !formData.email) {
        setError('Para continuar con red social, completa nombre y email.');
        return;
      }

      const session = await socialLogin(provider, formData.email, formData.nombre);
      redirectByRole(session);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar con red social');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-slate-100">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-gray-800 mb-4"
        >
          ? Atras
        </button>

        <h1 className="text-2xl font-bold text-center text-slate-800">Inicio de sesion</h1>
        <p className="text-sm text-slate-500 text-center mt-1 mb-5">Cliente o administrador</p>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === 'login' ? 'bg-fuchsia-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === 'register' ? 'bg-fuchsia-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Crear perfil
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 disabled:opacity-60"
          >
            {loading ? 'Procesando...' : mode === 'register' ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px bg-slate-200 flex-1"></span>
          <span className="text-xs text-slate-500">o</span>
          <span className="h-px bg-slate-200 flex-1"></span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialLogin('google')}
            className="w-full border border-slate-300 py-2 rounded hover:bg-slate-50 disabled:opacity-60"
          >
            Continuar con Gmail
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialLogin('facebook')}
            className="w-full border border-slate-300 py-2 rounded hover:bg-slate-50 disabled:opacity-60"
          >
            Continuar con Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

