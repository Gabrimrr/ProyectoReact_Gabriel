// Importamos los estilos CSS y el ThemeProvider
import "../styles/componentes.css";
import { ThemeProvider } from "./ThemeContext";
import { useState } from "react";

export function Componentes() {
  // Definimos el estado local para controlar la visibilidad de los componentes
  const [hiddenComponents, setHiddenComponents] = useState([false, false, false]);

  // Función para alternar la visibilidad de un componente específico
  const toggleComponentVisibility = (index) => {
    // Creamos una copia del estado actual
    const newHiddenComponents = [...hiddenComponents];
    // Alternamos la visibilidad del componente en el índice especificado
    newHiddenComponents[index] = !newHiddenComponents[index];
    // Actualizamos el estado con la nueva visibilidad
    setHiddenComponents(newHiddenComponents);
  };

  // Función para alternar la visibilidad de todos los componentes
  const toggleAllComponents = () => {
    // Verificamos si todos los componentes están ocultos
    const allHidden = hiddenComponents.every(hidden => hidden);
    // Si todos están ocultos, los mostramos; de lo contrario, los ocultamos
    setHiddenComponents([!allHidden, !allHidden, !allHidden]);
  };

  return (
    // Envolvemos el contenido en el ThemeProvider para aplicar el tema
    <ThemeProvider>
      <section>
        <div className="componentes-container">
          {/* Iteramos sobre el estado para renderizar cada componente */}
          {hiddenComponents.map((hidden, index) => (
            <div key={index} className="group-componentes" style={{ display: hidden ? 'none' : 'flex' }}>
              <div className="componente">Componente {index + 1}</div>
              {/* Botón para alternar la visibilidad del componente */}
              <button className="botonCom" onClick={() => toggleComponentVisibility(index)}>
                {hidden ? 'Mostrar' : 'Ocultar'}
              </button>
            </div>
          ))}
        </div>
        {/* Botón para alternar la visibilidad de todos los componentes */}
        <button className="btn-componentes" onClick={toggleAllComponents}>
          {hiddenComponents.every(hidden => hidden) ? 'Mostrar todos los elementos' : 'Ocultar todos los elementos'}
        </button>
      </section>
    </ThemeProvider>
  );
}

export default Componentes;