require('dotenv').config({ path: __dirname + '/.env' });
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Obtener la ruta al archivo de credenciales desde la variable de entorno
const keyPath = process.env.FIREBASE_KEY_PATH || path.join(__dirname, 'serviceAccountKey.json');

// Validar que el archivo exista
if (!fs.existsSync(keyPath)) {
  throw new Error(`❌ No se encontró la clave de Firebase en: ${keyPath}`);
}

const serviceAccount = require(keyPath);

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Conexión a Firestore
const db = admin.firestore();
const tareasRef = db.collection('tareas');

// Exportar la referencia
module.exports = { db, tareasRef };
