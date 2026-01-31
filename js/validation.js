/**
 * Validadores específicos por tipo de dato
 */
export const validators = {
    email: (email) => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email) && email.length <= 254;
    },

    name: (name) => {
        const trimmed = name.trim();
        return trimmed.length >= 2 && trimmed.length <= 100 &&
               /^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed);
    },

    company: (company) => {
        const trimmed = company.trim();
        return trimmed.length >= 2 && trimmed.length <= 200 &&
               /^[a-zA-Z0-9À-ÿ\s.,&'-]+$/.test(trimmed);
    },

    message: (message) => {
        const trimmed = message.trim();
        if (trimmed.length < 10 || trimmed.length > 2000) return false;
        // Rechazar si tiene demasiados caracteres especiales sospechosos
        const specialChars = (trimmed.match(/[<>{}[\]\\]/g) || []).length;
        return specialChars < 5;
    }
};

/**
 * Sanitiza input con validaciones avanzadas
 * @param {string} str - String a sanitizar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} - String sanitizado
 */
export function sanitizeInput(str, maxLength = 1000) {
    if (!str) return '';

    let cleaned = str.trim();
    cleaned = cleaned.replace(/\0/g, ''); // Null bytes
    cleaned = cleaned.normalize('NFC');   // Unicode normalizado
    cleaned = cleaned.replace(/<[^>]*>/g, ''); // Tags HTML

    // Patrones SQL injection comunes
    cleaned = cleaned.replace(/(['";]|--|\*\/|\/\*|xp_|exec|select|drop|insert|delete)/gi, '');

    return cleaned.substring(0, maxLength);
}

/**
 * Valida datos de formulario completo
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateForm(formData) {
    const errors = [];

    if (!validators.email(formData.email)) {
        errors.push('Email inválido');
    }
    if (!validators.name(formData.name)) {
        errors.push('Nombre debe tener 2-100 caracteres, solo letras');
    }
    if (formData.company && !validators.company(formData.company)) {
        errors.push('Nombre de empresa inválido');
    }
    if (!validators.message(formData.message)) {
        errors.push('Mensaje debe tener 10-2000 caracteres');
    }

    return { valid: errors.length === 0, errors };
}
