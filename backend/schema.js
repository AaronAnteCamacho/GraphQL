const { gql } = require('apollo-server-express');
const { GraphQLDateTime } = require('graphql-scalars');
const { tareasRef } = require('./firebase');

const typeDefs = gql`
  scalar DateTime

  type Tarea {
    id: ID!
    titulo: String!
    completada: Boolean!
    fechaCreacion: DateTime
  }

  type Query {
    obtenerTareas: [Tarea]
    obtenerTarea(id: ID!): Tarea
  }

  type Mutation {
    crearTarea(titulo: String!, fechaCreacion: DateTime!): Tarea
    actualizarTarea(
      id: ID!
      titulo: String
      completada: Boolean
      fechaCreacion: DateTime
    ): Tarea
    eliminarTarea(id: ID!): String
  }
`;

const resolvers = {
  DateTime: GraphQLDateTime,

  Query: {
    obtenerTareas: async () => {
      const snapshot = await tareasRef.get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fechaCreacion: data.fechaCreacion?.toDate?.() || null,
        };
      });
    },
    obtenerTarea: async (_, { id }) => {
      const doc = await tareasRef.doc(id).get();
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        fechaCreacion: data.fechaCreacion?.toDate?.() || null,
      };
    },
  },

  Mutation: {
    crearTarea: async (_, { titulo, fechaCreacion }) => {
      const nueva = {
        titulo,
        completada: false,
        fechaCreacion: new Date(fechaCreacion),
      };
      const docRef = await tareasRef.add(nueva);
      return { id: docRef.id, ...nueva };
    },

    actualizarTarea: async (_, { id, titulo, completada, fechaCreacion }) => {
      const update = {};
      if (titulo !== undefined) update.titulo = titulo;
      if (completada !== undefined) update.completada = completada;
      if (fechaCreacion !== undefined) update.fechaCreacion = new Date(fechaCreacion);

      await tareasRef.doc(id).update(update);
      const updatedDoc = await tareasRef.doc(id).get();
      const data = updatedDoc.data();

      return {
        id,
        ...data,
        fechaCreacion: data.fechaCreacion?.toDate?.() || null,
      };
    },

    eliminarTarea: async (_, { id }) => {
      await tareasRef.doc(id).delete();
      return "Tarea eliminada correctamente";
    },
  },
};

module.exports = { typeDefs, resolvers };
