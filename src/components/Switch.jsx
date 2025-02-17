import React from 'react';
import { useTheme } from './ThemeContext';
import './Switch.css'; // Importa el archivo CSS

export const Switch = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="container-switch">
      <span className="switch-label">TEMA</span>
      <label className="switch">
        <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};