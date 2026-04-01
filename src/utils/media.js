const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API_ORIGIN = (() => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return 'http://localhost:5000';
  }
})();

export const resolveMediaUrl = (path) => {
  if (!path) return '/placeholder.jpg';

  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:')
  ) {
    return path;
  }

  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

