import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

//Mutaciones
const GET_TAREAS = gql`
  query {
    obtenerTareas {
      id
      titulo
      completada
      fechaCreacion
    }
  }
`;

const ADD_TAREA = gql`
  mutation($titulo: String!, $fechaCreacion: DateTime!) {
    crearTarea(titulo: $titulo, fechaCreacion: $fechaCreacion) {
      id
      titulo
      completada
      fechaCreacion
    }
  }
`;

const UPDATE_TAREA = gql`
  mutation($id: ID!, $titulo: String, $completada: Boolean, $fechaCreacion: DateTime) {
    actualizarTarea(id: $id, titulo: $titulo, completada: $completada, fechaCreacion: $fechaCreacion) {
      id
      titulo
      completada
      fechaCreacion
    }
  }
`;

const DELETE_TAREA = gql`
  mutation($id: ID!) {
    eliminarTarea(id: $id)
  }
`;


function App() {
  const { data, loading, error, refetch } = useQuery(GET_TAREAS);
  const [crearTarea] = useMutation(ADD_TAREA);
  const [actualizarTarea] = useMutation(UPDATE_TAREA);
  const [eliminarTarea] = useMutation(DELETE_TAREA);

  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [editando, setEditando] = useState(false);
  const [tareaEnEdicion, setTareaEnEdicion] = useState(null);
  const [mensajeError, setMensajeError] = useState('');

  const handleGuardar = async () => {
    if (!titulo.trim() || !fecha) {
      setMensajeError('Ambos campos son obligatorios.');
      return;
    }

    const fechaISO = new Date(fecha).toISOString();

    try {
      if (editando && tareaEnEdicion) {
        await actualizarTarea({
          variables: {
            id: tareaEnEdicion.id,
            titulo: titulo.trim(),
            fechaCreacion: fechaISO,
            completada: tareaEnEdicion.completada,
          },
        });
      } else {
        await crearTarea({ variables: { titulo: titulo.trim(), fechaCreacion: fechaISO } });
      }

      // Limpiar estado
      setTitulo('');
      setFecha('');
      setEditando(false);
      setTareaEnEdicion(null);
      setMensajeError('');
      refetch();
    } catch (err) {
      setMensajeError('Error al guardar tarea.');
    }
  };

  const iniciarEdicion = (tarea) => {
    setEditando(true);
    setTareaEnEdicion(tarea);
    setTitulo(tarea.titulo);
    setFecha(new Date(tarea.fechaCreacion).toISOString().slice(0, 16));
    setMensajeError('');
  };

  const handleToggle = async (tarea) => {
    try {
      await actualizarTarea({
        variables: {
          id: tarea.id,
          completada: !tarea.completada,
          titulo: tarea.titulo,
          fechaCreacion: tarea.fechaCreacion,
        },
      });
      refetch();
    } catch {
      setMensajeError('Error al cambiar estado.');
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarTarea({ variables: { id } });
      if (editando && tareaEnEdicion?.id === id) {
        setEditando(false);
        setTareaEnEdicion(null);
        setTitulo('');
        setFecha('');
      }
      refetch();
    } catch {
      setMensajeError('Error al eliminar.');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar tareas.</p>;


  //Pagina
  return (
    <div>
      <h1>Lista de Tareas</h1>

      <div className="form-group">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nueva tarea"
        />
        <input
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <button onClick={handleGuardar}>
          {editando ? 'Guardar' : 'Agregar'}
        </button>
      </div>

      {mensajeError && (
        <p style={{ color: 'red', marginTop: '-10px' }}>{mensajeError}</p>
      )}

      <ul>
        {data.obtenerTareas.map((tarea) => (
          <li key={tarea.id}>
            <input
              type="checkbox"
              checked={tarea.completada}
              onChange={() => handleToggle(tarea)}
            />
            <span style={{ textDecoration: tarea.completada ? 'line-through' : 'none' }}>
              {tarea.titulo}{' '}
              <small>({new Date(tarea.fechaCreacion).toLocaleString()})</small>
            </span>
            <button onClick={() => iniciarEdicion(tarea)}>Editar</button>
            <button onClick={() => handleEliminar(tarea.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
