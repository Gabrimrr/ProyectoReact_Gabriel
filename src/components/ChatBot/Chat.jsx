import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import './Chat.css';

const Chat = ({ isVisible, onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // API Key ( Reemplaza con variables de entorno en producción)
  const apiKey = "AIzaSyCMGIpVFr3F1kkna5PvI6p1e3Ybq197w4o";
  const genAI = new GoogleGenerativeAI("AIzaSyCMGIpVFr3F1kkna5PvI6p1e3Ybq197w4o");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  //Mensaje de bienvenida al abrir el chat
  useEffect(() => {
    if (isVisible && chatHistory.length === 0) {
      setChatHistory([
        { user: null, bot: "👋 ¡Hola! ¿Qué información sobre países necesitas?" }
      ]);
    }
  }, [isVisible]);

  const handleUserInput = (e) => setUserInput(e.target.value);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    const userMessage = userInput.trim();

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          { role: "user", parts: [{ text: "Hablar de países únicamente." }] },
          { role: "model", parts: [{ text: "¡Claro! Pregunta sobre cualquier país y te daré información detallada." }] },
          { role: "user", parts: [{ text: `Dame información sobre el país ${userMessage}.` }] }
        ],
      });

      const result = await chatSession.sendMessage(userMessage);
      const botResponse = result.response.text();

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { user: userMessage, bot: botResponse },
      ]);
      setUserInput("");
    } catch (error) {
      console.error("❌ Error en la API de Gemini:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { user: userMessage, bot: "⚠️ Hubo un error. Intenta de nuevo más tarde." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setChatHistory([]);
  };

  // Si el chat no está visible, no renderizamos nada.
  if (!isVisible) return null;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>ChatBot de Países</h2>
        <button className="close-button" onClick={onClose}>X</button>
      </div>

      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div 
            key={index} 
            className={`chat-message ${chat.user ? "user" : "bot"}`}
          >
            {chat.user && <p><strong>Tu:</strong> {chat.user}</p>}
            <p><strong>Bot:</strong> {chat.bot}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={userInput}
        onChange={handleUserInput}
        placeholder="Escribe el nombre de un país..."
        disabled={isLoading}
      />
      <button onClick={sendMessage} className="send-button" disabled={isLoading}>
        {isLoading ? "Cargando..." : "Enviar"}
      </button>
      <button onClick={resetChat} className="reset-button">
        Reiniciar Chat
      </button>
    </div>
  );
};

export default Chat;
