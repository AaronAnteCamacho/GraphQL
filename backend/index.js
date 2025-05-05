// backend/index.js
const express = require('express');
const cors = require('cors');
const { tareasRef } = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

// Obtener todas las tareas
app.get('/tareas', async (req, res) => {
  try {
    const snapshot = await tareasRef.get();
    const tareas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tareas);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Crear una nueva tarea
app.post('/tareas', async (req, res) => {
  try {
    const { titulo } = req.body;
    const nuevaTarea = { titulo, completada: false, fechaCreacion: new Date() };
    const docRef = await tareasRef.add(nuevaTarea);
    res.status(201).json({ id: docRef.id, ...nuevaTarea });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Actualizar una tarea
app.put('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, completada } = req.body;
    const updateData = {};
    if (titulo !== undefined) updateData.titulo = titulo;
    if (completada !== undefined) updateData.completada = completada;
    await tareasRef.doc(id).update(updateData);
    const updatedDoc = await tareasRef.doc(id).get();
    res.json({ id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Eliminar una tarea
app.delete('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await tareasRef.doc(id).delete();
    res.send('Tarea eliminada correctamente');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
