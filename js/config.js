/**
 * Configuración centralizada de la aplicación
 * Las URLs de webhooks se cargan desde variables de entorno
 * Esto ofusca las URLs en el build de producción
 */
export const config = {
  webhooks: {
    chatbot: import.meta.env.VITE_CHATBOT_WEBHOOK_URL,
    form: import.meta.env.VITE_FORM_WEBHOOK_URL
  }
};
