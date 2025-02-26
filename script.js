    // Importa las clases necesarias de la biblioteca de Google Generative AI
    import {
        GoogleGenerativeAI,
        HarmCategory,
        HarmBlockThreshold,
      } from "@google/generative-ai";
  
      // Accede a la API key desde las variables de entorno.
      //Aquí simulamos la variable de entorno que estará disponible en el servidor, pero localmente se debe colocar aquí
      const apiKey = "TU_API_KEY_AQUI"; //REEMPLAZA ESTO CON TU API KEY
  
      // Inicializa la instancia de Google Generative AI
      const genAI = new GoogleGenerativeAI(apiKey);
  
      // Obtiene el modelo generativo
      const model = genAI.getGenerativeModel({
          model: "gemini-2.0-pro-exp-02-05",
      });
  
      // Configuración de generación
      const generationConfig = {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
        //  responseMimeType: "text/plain",  //Esto no es necesario, la respuesta siempre será texto.
      };
  
      // Función para crear un nuevo elemento de mensaje en el chat
      function createMessageElement(text, role) {
          const messageDiv = document.createElement('div');
          messageDiv.classList.add(role === 'user' ? 'user-message' : 'bot-message');
          messageDiv.textContent = text;
          return messageDiv;
      }
  
  
      // Función principal para ejecutar la conversación
      async function runChat() {
  
          const chatMessages = document.getElementById('chat-messages');
          const userInput = document.getElementById('user-input');
          const sendButton = document.getElementById('send-button');
          const history = []; //Historial vacio al inicio
  
          // Inicializa la sesión de chat
          const chatSession = model.startChat({
              generationConfig,
              history: history, // Pasa el historial
          });
  
  
          const sendMessage = async () => {
            const messageText = userInput.value.trim();
            if (!messageText) return;
  
            //Añade mensaje del usuario
            chatMessages.appendChild(createMessageElement(messageText, 'user'));
            userInput.value = ''; //Limpia input
              userInput.disabled = true;
              sendButton.disabled = true;
  
              try {
                  // Envía el mensaje al chatbot y espera la respuesta
                  const result = await chatSession.sendMessage(messageText);
                  const response = result.response;
  
                  // Muestra la respuesta del bot
                chatMessages.appendChild(createMessageElement(response.text(), 'bot'));
  
              } catch (error) {
                  console.error("Error al obtener la respuesta:", error);
                   // Muestra mensaje de error
                  chatMessages.appendChild(createMessageElement('Error al obtener la respuesta. Intenta de nuevo.', 'bot'));
  
              } finally {
                // Habilita el input y el botón
                  userInput.disabled = false;
                  sendButton.disabled = false;
                  userInput.focus(); //Pone el cursor en el input.
                  chatMessages.scrollTop = chatMessages.scrollHeight; //Scroll hasta el final.
              }
          }
  
            // Evento click del botón de enviar
            sendButton.addEventListener('click', sendMessage);
  
            // Evento para enviar al presionar Enter
            userInput.addEventListener('keypress', (e) => {
              if (e.key === 'Enter') {
                  sendMessage();
              }
            });
      }
  
      // Ejecuta la función principal
      runChat();