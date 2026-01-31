/**
 * Rate Limiter - Limita el número de acciones en una ventana de tiempo
 * NOTA: Es solo frontend, puede bypassearse, pero previene spam básico
 */
class RateLimiter {
    constructor(maxAttempts, windowMs) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
        this.attempts = new Map();
    }

    /**
     * Verifica si una acción está permitida
     * @param {string} key - Identificador único (email, sessionId, etc.)
     * @returns {Object} - { allowed: boolean, waitTime?: number, remaining?: number }
     */
    checkLimit(key) {
        const now = Date.now();
        const data = this.attempts.get(key) || { count: 0, resetTime: now + this.windowMs };

        // Reset si expiró la ventana
        if (now > data.resetTime) {
            data.count = 0;
            data.resetTime = now + this.windowMs;
        }

        // Verificar límite
        if (data.count >= this.maxAttempts) {
            const waitTime = Math.ceil((data.resetTime - now) / 1000);
            return { allowed: false, waitTime };
        }

        // Incrementar contador
        data.count++;
        this.attempts.set(key, data);
        return { allowed: true, remaining: this.maxAttempts - data.count };
    }

    /**
     * Resetea el límite para una key específica
     * @param {string} key - Identificador a resetear
     */
    reset(key) {
        this.attempts.delete(key);
    }
}

// Exportar instancias pre-configuradas
export const formLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 envíos por hora
export const chatLimiter = new RateLimiter(20, 60 * 1000);      // 20 mensajes por minuto
