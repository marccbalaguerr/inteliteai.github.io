import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      // Inyectar variables de entorno en el código
      'import.meta.env.VITE_CHATBOT_WEBHOOK_URL': JSON.stringify(env.VITE_CHATBOT_WEBHOOK_URL),
      'import.meta.env.VITE_FORM_WEBHOOK_URL': JSON.stringify(env.VITE_FORM_WEBHOOK_URL)
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          'agentes-voz': resolve(__dirname, 'agentes-voz.html'),
          'chatbots': resolve(__dirname, 'chatbots.html'),
          'automatizacion': resolve(__dirname, 'automatizacion.html'),
          'integraciones': resolve(__dirname, 'integraciones.html'),
          'blog': resolve(__dirname, 'blog/index.html'),
          // Nuevas paginas
          'calculadora-roi': resolve(__dirname, 'calculadora-roi.html'),
          'configurador': resolve(__dirname, 'configurador.html'),
          'status': resolve(__dirname, 'status.html'),
          // Portal de clientes
          'portal-login': resolve(__dirname, 'portal/login.html'),
          'portal-dashboard': resolve(__dirname, 'portal/dashboard.html'),
        }
      }
    }
  }
})
