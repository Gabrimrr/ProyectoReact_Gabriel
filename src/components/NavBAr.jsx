import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { Switch } from './Switch';
import { useAuth } from './AuthContext';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src="https://images.emojiterra.com/google/android-11/512px/1f30e.png" className='logo' alt="logo" />
      </div>
      <nav className="navbar-top">
        <ol className="list-navbar">
          <li><NavLink to='/flagList'>Lista</NavLink></li>
          <li><NavLink to='/Lista'>Buscador</NavLink></li>
          <li><NavLink to='/tareas'>Tareas</NavLink></li>
          <li><NavLink to='/Componentes'>Componentes</NavLink></li>
          <li><NavLink to='/voz'>Voz</NavLink></li>
          <li><NavLink to='/informes'>Informes</NavLink></li>
        </ol>
      </nav>
      <div className="search-container">
      </div>
      <div className="login">
        <Switch />
        <button onClick={handleAuthAction} className="auth-button">
          {isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  );
}

export default NavBar;