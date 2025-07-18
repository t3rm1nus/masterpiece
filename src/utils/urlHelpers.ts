// utils/urlHelpers.ts

export function getLocalizedPath(path: string, lang: string) {
  if (lang === 'en') {
    if (path.startsWith('/en/')) return path;
    return '/en' + (path.startsWith('/') ? path : '/' + path);
  }
  // Español o default
  if (path.startsWith('/en/')) return path.replace(/^\/en/, '') || '/';
  return path;
} 