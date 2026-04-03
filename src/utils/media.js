const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API_ORIGIN = (() => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return 'http://localhost:5000';
  }
})();

export const resolveMediaUrl = (path) => {
  if (!path) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-family='Arial%2Csans-serif' font-size='28'%3ESin%20imagen%3C/text%3E%3C/svg%3E";
  }

  const rawPath = String(path).trim();
  const normalizedPath = rawPath.replace(/\\/g, '/');

  if (
    normalizedPath.startsWith('http://') ||
    normalizedPath.startsWith('https://') ||
    normalizedPath.startsWith('data:')
  ) {
    return normalizedPath;
  }

  const fixedPath = normalizedPath.startsWith('/api/uploads/')
    ? normalizedPath.replace('/api/uploads/', '/uploads/')
    : normalizedPath;

  return `${API_ORIGIN}${fixedPath.startsWith('/') ? fixedPath : `/${fixedPath}`}`;
};

