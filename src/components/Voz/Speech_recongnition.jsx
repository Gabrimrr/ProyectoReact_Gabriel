import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import './SpeechRecognition.css'; // Importa el archivo CSS
import 'regenerator-runtime/runtime';


const SpeechInputComponent = () => {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  // Actualiza el texto con el valor del transcript
  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const handleSubmit = () => {
    setSubmittedText(text);
    setText("");
    resetTranscript();
  };

  const handleStartListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening();
  };

  const handleStopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  return (
    <div className="speech-container">
      <h2 className="Voz">Reconocimiento de voz</h2>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe o usa el micrófono..."
        className="speech-input"
      />
      <div className="speech-buttons">
        <button onClick={handleSubmit} className="speech-button send">
          Enviar
        </button>
        <button
          onClick={handleStartListening}
          className={`speech-button ${isListening ? "listening" : "listen"}`}
        >
          {isListening ? "Escuchando..." : "Hablar"}
        </button>

        <button
          onClick={handleStopListening}
          className="speech-button stop"
        >
          Detener
        </button>
      </div>
      {submittedText && (
        <div className="submitted-text">
          <strong>Texto enviado:</strong> {submittedText}
        </div>
      )}
    </div>
  );
};

export default SpeechInputComponent;