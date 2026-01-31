/* ============================================
   WIDGETS JS - Intelite AI
   Animaciones y lógica de widgets interactivos
   ============================================ */

// Widget Final Demo - Animación de flujo de automatización
function runFinalDemo() {
    const btn = document.querySelector('.btn-f');
    btn.disabled = true;

    // Reset
    document.querySelectorAll('.card-f').forEach(c => c.classList.remove('active'));
    ['l1','l2','l4a','l4b'].forEach(id => document.getElementById(id).style.width = '0%');
    ['l3a','l3b'].forEach(id => document.getElementById(id).style.height = '0%');

    // Secuencia
    setTimeout(() => {
        document.getElementById('card1').classList.add('active');
        setTimeout(() => {
            document.getElementById('l1').style.width = '100%';
            setTimeout(() => {
                document.getElementById('card2').classList.add('active');
                setTimeout(() => {
                    document.getElementById('l2').style.width = '100%';
                    setTimeout(() => {
                        // Verticales exactamente al 50%
                        document.getElementById('l3a').style.height = '50%';
                        document.getElementById('l3b').style.height = '50%';

                        setTimeout(() => {
                            // Patas horizontales
                            document.getElementById('l4a').style.width = '100%';
                            document.getElementById('l4b').style.width = '100%';

                            setTimeout(() => {
                                document.getElementById('card3a').classList.add('active');
                                document.getElementById('card3b').classList.add('active');
                                setTimeout(() => { btn.disabled = false; }, 1000);
                            }, 200);
                        }, 200);
                    }, 200);
                }, 300);
            }, 300);
        }, 200);
    }, 100);
}

// Widget Ana - Conversación automática simulada
(function() {
    const feed = document.getElementById('auto-feed');
    const typing = document.getElementById('auto-typing');

    // Si no existen los elementos, no ejecutar
    if (!feed || !typing) return;

    // Secuencia de la conversación
    const conversation = [
        { type: 'bot', text: 'Hola, soy Ana, ¿en qué puedo ayudarte hoy?', delay: 800 },
        { type: 'user', text: 'Hola! Quiero saber más información sobre vuestros servicios.', delay: 2000 },
        { type: 'bot', text: '¡Claro! Creamos agentes de IA para automatizar tu negocio.', delay: 1500 },
        { type: 'bot', text: '¿Te gustaría agendar una demo breve?', delay: 2500 }
    ];

    let step = 0;

    function addMessage(text, type) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type === 'bot' ? 'msg-bot' : 'msg-user'}`;
        msgDiv.textContent = text;

        // Insertar ANTES del indicador de typing
        feed.insertBefore(msgDiv, typing);

        // Scroll suave hacia abajo
        feed.scrollTop = feed.scrollHeight;
    }

    function runScript() {
        if (step >= conversation.length) return;

        const currentStep = conversation[step];

        if (currentStep.type === 'bot') {
            // Mostrar typing antes de mensaje del bot
            typing.style.display = 'flex';
            feed.scrollTop = feed.scrollHeight;

            setTimeout(() => {
                typing.style.display = 'none';
                addMessage(currentStep.text, 'bot');
                step++;
                // Llamar al siguiente paso
                if(step < conversation.length) {
                     setTimeout(runScript, 500);
                }
            }, 1500); // Tiempo que tarda el bot en "escribir"

        } else {
            // Mensaje de usuario (aparece directo tras el delay)
            setTimeout(() => {
                addMessage(currentStep.text, 'user');
                step++;
                setTimeout(runScript, 500);
            }, currentStep.delay);
        }
    }

    // Iniciar secuencia al cargar
    setTimeout(runScript, 500);
})();

