// --- 1. CONFIGURACIÓN ---
const WEBHOOK_URL = 'https://n8n-n8n.u5h0lw.easypanel.host/webhook/666b81dc-5b98-47bc-98ab-0799ee48cdb5/chat';
        
        // Configuración de botones: { label: "Lo que se ve", text: "Lo que se envía" }
        const PREDEFINED_CHIPS = [
            { label: "Servicios", text: "Hola, ¿qué tal? Me gustaría saber más sobre sus servicios." },
            { label: "Precios", text: "¿Qué precio tiene una automatización?" },
            { label: "Reunión", text: "Me gustaría agendar una reunión" },
            { label: "Horario", text: "¿Cuál es vuestro horario?" },
            { label: "Soporte", text: "Tengo un problema técnico" },
            { label: "Limpiar chat", isClear: true }
        ];

        // Evitar duplicados si Framer recarga
        if (document.getElementById('intelite-widget-root')) return;

        // --- 2. ESTILOS CSS (Inyectados dinámicamente) ---
        const style = document.createElement('style');
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            #intelite-widget-root { font-family: 'Inter', sans-serif; box-sizing: border-box; }
            #intelite-widget-root * { box-sizing: border-box; }

            /* Botón Flotante - Z-Index Altísimo para superar a Framer */
            .int-toggle-btn {
                position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background-color: #006de7;
                border-radius: 50%; box-shadow: 0 4px 12px rgba(0, 109, 231, 0.4); border: none; cursor: pointer;
                display: flex; align-items: center; justify-content: center; z-index: 2147483647; transition: transform 0.2s;
            }
            .int-toggle-btn:hover { transform: scale(1.05); }
            .int-toggle-btn svg { width: 30px; height: 30px; fill: white; }

            /* Contenedor Chat */
            .int-chat-container {
                position: fixed; bottom: 90px; right: 20px; width: 380px; height: 600px; background-color: #ffffff;
                border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); border: 1px solid #f1f5f9;
                display: flex; flex-direction: column; overflow: hidden; z-index: 2147483646; 
                opacity: 0; transform: translateY(20px); pointer-events: none; transition: all 0.3s ease-in-out;
                font-family: 'Inter', sans-serif;
            }
            .int-chat-container.open { opacity: 1; transform: translateY(0); pointer-events: all; }

            /* Responsive Móvil */
            @media (max-width: 480px) {
                .int-chat-container { width: 90%; right: 5%; bottom: 90px; height: 70vh; }
            }

            /* Header */
            .int-header { padding: 20px 24px 0px 24px; background: #fff; flex-shrink: 0; position: relative; }
            .int-header-top { display: flex; align-items: center; margin-bottom: 10px; }
            .int-logo { width: 24px; height: 24px; object-fit: contain; margin-right: 10px; }
            .int-brand-box { display: flex; flex-direction: column; }
            .int-brand { font-weight: 700; color: #006de7; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1; }
            .int-status-text { font-size: 10px; color: #64748b; margin-top: 4px; font-weight: 500;}

            /* Controles Ventana */
            .int-window-controls { margin-left: auto; display: flex; gap: 8px; align-items: center; }
            .int-ctrl-btn { width: 14px; height: 14px; border-radius: 50%; border: none; cursor: pointer; padding: 0; position: relative; transition: all 0.2s ease; }
            .int-ctrl-btn:active { transform: scale(0.9); }
            .int-close-win { background-color: #ff5f57; box-shadow: 0 0 6px rgba(255, 95, 87, 0.5); }
            .int-close-win:hover { box-shadow: 0 0 10px rgba(255, 95, 87, 0.9); }
            .int-min-win { background-color: #febc2e; box-shadow: 0 0 6px rgba(254, 188, 46, 0.5); }
            .int-min-win:hover { box-shadow: 0 0 10px rgba(254, 188, 46, 0.9); }
            .int-max-win { background-color: #28c840; box-shadow: 0 0 6px rgba(40, 200, 64, 0.5); cursor: default; }

            /* Barra Energía (Nueva Animación Lenta y Azul) */
            .int-energy-container { width: 100%; height: 4px; background-color: #f1f5f9; border-radius: 2px; margin-bottom: 0; overflow: hidden; position: relative; }
            .int-energy-bar { 
                width: 100%; height: 100%; 
                background: linear-gradient(90deg, #006de7, #60a5fa, #006de7); 
                background-size: 200% 100%; 
                border-radius: 2px; 
                animation: energyFlow 3s linear infinite; 
            }
            .int-energy-bar.thinking { 
                background: linear-gradient(90deg, #006de7, #00d4ff, #4f46e5, #38bdf8, #006de7); 
                background-size: 400% 100%; 
                animation: energyFlow 3s linear infinite; 
                filter: drop-shadow(0 0 6px rgba(0, 109, 231, 0.6)); 
            }
            @keyframes energyFlow { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

            /* Mensajes */
            #int-messages { flex: 1; padding: 12px 20px 20px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background-color: #fff; scrollbar-width: thin; transition: opacity 0.3s ease; }
            .int-msg { padding: 12px 16px; border-radius: 12px; font-size: 14px; line-height: 1.5; position: relative; animation: fadeIn 0.3s ease; width: fit-content; max-width: 85%; flex-shrink: 0; word-wrap: break-word; }
            .int-msg.user { align-self: flex-end; background-color: #f8fafc; color: #1e293b; border-bottom-right-radius: 2px; margin-left: auto; }
            .int-msg.bot { align-self: flex-start; background-color: #fff; color: #334155; border: 1px solid #f1f5f9; border-bottom-left-radius: 2px; margin-right: auto; }
            .int-msg-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; gap: 12px; white-space: nowrap; }
            .int-label { font-size: 11px; font-weight: 700; } .user .int-label { color: #64748b; } .bot .int-label { color: #006de7; }
            .int-time { font-size: 10px; color: #94a3b8; font-weight: 400; }
            
            /* Negritas Bot */
            .int-content strong { font-weight: 700; color: #1e293b; }

            /* Chips */
            .int-chips-wrapper { width: 100%; background: #fff; }
            .int-chips-container { display: flex; gap: 10px; overflow-x: auto; padding: 12px 20px 10px 20px; border-top: 1px solid #f8fafc; scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
            .int-chips-container::-webkit-scrollbar { height: 6px; }
            .int-chips-container::-webkit-scrollbar-track { background: transparent; }
            .int-chips-container::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; cursor: pointer; }
            .int-chip { flex-shrink: 0; white-space: nowrap; background-color: #fff; color: #334155; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
            .int-chip:hover { background-color: #f8fafc; border-color: #006de7; color: #006de7; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 109, 231, 0.1); }
            .int-chip.danger-chip:hover { border-color: #ff5f57; color: #ff5f57; background-color: #fff5f5; }

            /* Input */
            .int-input-area { padding: 12px 20px 16px 20px; display: flex; gap: 10px; background: #fff; flex-shrink: 0; }
            .int-input { flex: 1; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; font-family: 'Inter', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
            .int-input:focus { border-color: #006de7; }
            .int-send-btn { background-color: #006de7; color: white; border: none; border-radius: 12px; width: 44px; height: 44px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; flex-shrink: 0; }
            .int-send-btn:hover { background-color: #005bbd; }
            
            /* Animaciones */
            .loading-dots:after { content: '.'; animation: dots 1.5s steps(5, end) infinite; }
            @keyframes dots { 0%, 20% { content: '.'; } 40% { content: '..'; } 60% { content: '...'; } 80%, 100% { content: ''; } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);

        // --- 3. CREAR HTML (Inyectado al body) ---
        const rootDiv = document.createElement('div');
        rootDiv.id = 'intelite-widget-root';
        rootDiv.innerHTML = `
            <button class="int-toggle-btn" id="intToggleBtn">
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
            </button>

            <div class="int-chat-container" id="intChatContainer">
                <div class="int-header">
                    <div class="int-header-top">
                        <img src="https://i.ibb.co/n8Vtmcc5/diamante-intelite.png" alt="Logo" class="int-logo">
                        <div class="int-brand-box">
                            <span class="int-brand">INTELITEAI</span>
                            <span class="int-status-text" id="intStatusText">En línea</span>
                        </div>
                        <div class="int-window-controls">
                            <button class="int-ctrl-btn int-close-win" id="intCloseHeaderBtn" title="Cerrar chat"></button>
                            <button class="int-ctrl-btn int-min-win" id="intMinHeaderBtn" title="Minimizar ventana"></button>
                            <button class="int-ctrl-btn int-max-win" title="Zoom"></button>
                        </div>
                    </div>
                    <div class="int-energy-container">
                        <div class="int-energy-bar" id="intEnergyBar"></div>
                    </div>
                </div>

                <div id="int-messages"></div>

                <div class="int-chips-wrapper">
                    <div class="int-chips-container" id="intChipsContainer"></div>
                </div>

                <div class="int-input-area">
                    <input type="text" class="int-input" id="intUserInput" placeholder="Escribe aquí..." autocomplete="off">
                    <button class="int-send-btn" id="intSendBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(rootDiv);

        // --- 4. LÓGICA JAVASCRIPT ---
        // Usar generación segura de session ID (Web Crypto API)
        let sessionId = localStorage.getItem('chatSessionId');
        if (!sessionId) {
            sessionId = 'session-' + Math.random().toString(36).substr(2, 9) + Date.now();
            localStorage.setItem('chatSessionId', sessionId);
        }

        const toggleBtn = document.getElementById('intToggleBtn');
        const chatContainer = document.getElementById('intChatContainer');
        const messagesDiv = document.getElementById('int-messages');
        const userInput = document.getElementById('intUserInput');
        const sendBtn = document.getElementById('intSendBtn');
        
        const energyBar = document.getElementById('intEnergyBar');
        const statusText = document.getElementById('intStatusText');
        const chipsContainer = document.getElementById('intChipsContainer');
        const closeHeaderBtn = document.getElementById('intCloseHeaderBtn');
        const minHeaderBtn = document.getElementById('intMinHeaderBtn');

        // Inicializar
        if(messagesDiv.children.length === 0) {
            addWelcomeMessage();
        }
        renderChips();

        function renderChips() {
            chipsContainer.innerHTML = ''; 
            PREDEFINED_CHIPS.forEach(item => {
                const chip = document.createElement('button');
                chip.classList.add('int-chip');
                chip.innerText = item.label;
                if(item.isClear) {
                    chip.classList.add('danger-chip');
                    chip.onclick = () => clearChatOnly();
                } else {
                    chip.onclick = () => sendChipMessage(item.text);
                }
                chipsContainer.appendChild(chip);
            });
        }

        chipsContainer.addEventListener('wheel', (evt) => {
            evt.preventDefault();
            chipsContainer.scrollLeft += evt.deltaY;
        });

        function sendChipMessage(text) {
            userInput.value = text;
            sendMessage();
        }
        
        function addWelcomeMessage() {
             setTimeout(() => {
                addMessage('¡Hola! Soy InteliteAI. ¿En qué puedo ayudarte hoy?', 'bot');
            }, 500);
        }

        function toggleChat() {
            chatContainer.classList.toggle('open');
            if(chatContainer.classList.contains('open')) userInput.focus();
        }

        function clearChatOnly() {
            messagesDiv.style.opacity = '0';
            setTimeout(() => {
                messagesDiv.innerHTML = '';
                sessionId = 'session-' + Math.random().toString(36).substr(2, 9) + Date.now();
                localStorage.setItem('chatSessionId', sessionId);
                addWelcomeMessage();
                messagesDiv.style.opacity = '1';
            }, 300);
        }

        function closeHeaderAction() {
            chatContainer.classList.remove('open');
            setTimeout(() => {
                messagesDiv.innerHTML = '';
                sessionId = 'session-' + Math.random().toString(36).substr(2, 9) + Date.now();
                localStorage.setItem('chatSessionId', sessionId);
                addWelcomeMessage();
            }, 300);
        }

        toggleBtn.addEventListener('click', toggleChat);
        if(minHeaderBtn) minHeaderBtn.addEventListener('click', toggleChat);
        if(closeHeaderBtn) closeHeaderBtn.addEventListener('click', closeHeaderAction);

        // FUNCIÓN FORMATEADORA DE MARKDOWN
        function formatMessageText(text) {
            // 1. Negrita
            let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // 2. Saltos de línea
            formatted = formatted.replace(/\n/g, '<br>');
            return formatted;
        }

        function addMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('int-msg', sender);
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const label = sender === 'user' ? 'Cliente' : 'InteliteAI';

            // Aplicar formato si es bot (permite markdown), texto plano si es usuario
            const contentHtml = sender === 'bot' ? formatMessageText(text) : text;

            msgDiv.innerHTML = `
                <div class="int-msg-header">
                    <span class="int-label">${label}</span>
                    <span class="int-time">${timeString}</span>
                </div>
                <div class="int-content">${contentHtml}</div>
            `;
            messagesDiv.appendChild(msgDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function addLoading() {
            energyBar.classList.add('thinking');
            statusText.innerText = "Escribiendo...";
            statusText.style.color = "#006de7";
            const loadDiv = document.createElement('div');
            loadDiv.id = 'loading-msg';
            loadDiv.classList.add('int-msg', 'bot');
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            loadDiv.innerHTML = `
                <div class="int-msg-header">
                    <span class="int-label">InteliteAI</span>
                    <span class="int-time">${timeString}</span>
                </div>
                <div class="loading-dots">Escribiendo</div>
            `;
            messagesDiv.appendChild(loadDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function removeLoading() {
            energyBar.classList.remove('thinking');
            statusText.innerText = "En línea";
            statusText.style.color = "#64748b";
            const loadDiv = document.getElementById('loading-msg');
            if (loadDiv) loadDiv.remove();
        }

        async function sendMessage() {
            const text = userInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            userInput.value = '';
            addLoading();
            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'sendMessage', sessionId: sessionId, chatInput: text })
                });
                const data = await response.json();
                removeLoading();
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        if (item.output) addMessage(item.output, 'bot');
                        else if (typeof item === 'string') addMessage(item, 'bot');
                    });
                } else if (data.output) {
                    addMessage(data.output, 'bot');
                } else {
                    addMessage(JSON.stringify(data), 'bot'); 
                }
            } catch (error) {
                removeLoading();
                addMessage("Error de conexión.", 'bot');
                console.error(error);
            }
        }
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});