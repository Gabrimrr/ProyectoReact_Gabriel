import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './components/AuthContext';
import NavBar from './components/NavBAr';
import Lista from './components/Lista';
import { Routes, Route } from 'react-router-dom';
import FlagList from './components/flagList';
import Profile from './components/Profile';
import Login from './components/Login';
import TareasReducer from './components/Reducer/TareasReducer';
import './styles/reset.css'; //Con este CSS hacemos el responsive
import Componentes from './components/Components'; 
import Informes from './components/Informes'; // Importamos el componente Informes
import Voz from './components/Voz/Speech_recongnition';
import ChatBot from './components/ChatBot/Chat'; // Importamos el componente ChatBot
import 'regenerator-runtime/runtime';




function App() {

  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app-container">
          <NavBar />
          <main className="principal">
            <Routes>
                <Route path="/flagList" element={<FlagList />} />
                <Route path="/Lista" element={<Lista />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tareas" element={<TareasReducer />} />
                <Route path="/componentes" element={<Componentes />} />
                <Route path="/voz" element={<Voz />} />
                <Route path="/informes" element={<Informes />} /> {/* Nueva ruta */}
            </Routes>
            </main>
            <button onClick={toggleChatVisibility} className="chat-toggle-button">
              {isChatVisible ? "Cerrar Chat" : "Abrir Chat"}
            </button>
          <ChatBot isVisible={isChatVisible} onClose={toggleChatVisibility} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;