// Configuración de Tailwind CSS para Intelite AI
tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    blue: '#006DE7',
                    darkBlue: '#005bb5',
                    bg: '#ECEDF1',
                    text: '#111827',
                }
            },
            fontFamily: {
                sans: ['"Poppins"', 'sans-serif'],
                mono: ['"Fira Code"', 'monospace'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 4px 20px -2px rgba(0, 109, 231, 0.3)',
                'widget': '0 20px 40px rgba(0, 0, 0, 0.08), 0 5px 15px rgba(0,0,0,0.05)',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        }
    }
}
