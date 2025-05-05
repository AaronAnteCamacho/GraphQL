// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState('');

  useEffect(() => {
    obtenerTareas();
  }, []);

  const obtenerTareas = async () => {
    const res = await axios.get('http://localhost:4000/tareas');
    setTareas(res.data);
  };

  const agregarTarea = async () => {
    if (titulo.trim() === '') return;
    await axios.post('http://localhost:4000/tareas', { titulo });
    setTitulo('');
    obtenerTareas();
  };

  const toggleTarea = async (tarea) => {
    await axios.put(`http://localhost:4000/tareas/${tarea.id}`, {
      completada: !tarea.completada,
    });
    obtenerTareas();
  };

  const eliminarTarea = async (id) => {
    await axios.delete(`http://localhost:4000/tareas/${id}`);
    obtenerTareas();
  };

  return (
    <div>
      <h1>Lista de Tareas</h1>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Nueva tarea"
      />
      <button onClick={agregarTarea}>Agregar</button>
      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            <span
              style={{
                textDecoration: tarea.completada ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
              onClick={() => toggleTarea(tarea)}
            >
              {tarea.titulo}
            </span>
            <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
