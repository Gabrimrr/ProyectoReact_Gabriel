import React, { useReducer, useState } from 'react';
import './Reducer.css';

interface Tarea {
  id: number;
  texto: string;
  completada: boolean;
}

type Accion =
  | { type: 'AGREGAR_TAREA'; texto: string }
  | { type: 'TOGGLE_TAREA'; id: number }
  | { type: 'ELIMINAR_TAREA'; id: number };

const reducer = (state: Tarea[], action: Accion): Tarea[] => {
  switch (action.type) {
    case 'AGREGAR_TAREA':
      return [
        ...state,
        { id: Date.now(), texto: action.texto, completada: false },
      ];
    case 'TOGGLE_TAREA':
      return state.map((tarea) =>
        tarea.id === action.id
          ? { ...tarea, completada: !tarea.completada }
          : tarea
      );
    case 'ELIMINAR_TAREA':
      return state.filter((tarea) => tarea.id !== action.id);
    default:
      return state;
  }
};

const TareasReducer: React.FC = () => {
  const [tareas, dispatch] = useReducer(reducer, []);
  const [texto, setTexto] = useState('');

  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault();
    if (texto.trim()) {
      dispatch({ type: 'AGREGAR_TAREA', texto });
      setTexto('');
    }
  };

  return (
    <div className="tareas-container">
      <h2>Lista de Tareas</h2>
      <form onSubmit={agregarTarea} className="tarea-form">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Nueva tarea"
          className="tarea-input"
        />
        <button type="submit" className="btn-agregar">Agregar</button>
      </form>
      <ul className="tareas-lista">
        {tareas.map((tarea) => (
          <li key={tarea.id} className={`tarea-item ${tarea.completada ? 'completada' : ''}`}>
            <span
              onClick={() => dispatch({ type: 'TOGGLE_TAREA', id: tarea.id })}
              className="tarea-texto"
            >
              {tarea.texto}
            </span>
            <button
              onClick={() => dispatch({ type: 'ELIMINAR_TAREA', id: tarea.id })}
              className="btn-eliminar"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TareasReducer;