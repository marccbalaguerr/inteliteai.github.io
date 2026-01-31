import DOMPurify from 'dompurify';

/**
 * Sanitiza HTML permitiendo solo tags seguros
 * @param {string} html - HTML a sanitizar
 * @returns {string} - HTML sanitizado
 */
export function sanitizeHTML(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'br', 'a', 'ul', 'ol', 'li', 'p'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  });
}

/**
 * Escapa completamente HTML (convierte a texto plano)
 * @param {string} text - Texto a escapar
 * @returns {string} - HTML escapado
 */
export function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Genera un session ID criptográficamente seguro
 * @returns {string} - Session ID único y seguro
 */
export function generateSecureSessionId() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return 'session-' + Array.from(array, byte =>
        byte.toString(16).padStart(2, '0')).join('');
}
