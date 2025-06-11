const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pid_crud'
});

// Conectar a MySQL
db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Rutas CRUD

// Crear nueva estrategia
app.post('/api/estrategias', (req, res) => {
  const { denominacion, fecha_inicio, fecha_fin, responsable } = req.body;
  const query = 'INSERT INTO estrategias (denominacion, fecha_inicio, fecha_fin, responsable) VALUES (?, ?, ?, ?)';
  
  db.query(query, [denominacion, fecha_inicio, fecha_fin, responsable], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.status(201).send({ id: result.insertId, ...req.body });
  });
});

// Obtener todas las estrategias
app.get('/api/estrategias', (req, res) => {
  const query = 'SELECT * FROM estrategias WHERE estado = "activo"';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

// Obtener una estrategia por ID
app.get('/api/estrategias/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM estrategias WHERE id = ? AND estado = "activo"';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send('Estrategia no encontrada');
    }
    res.status(200).json(results[0]);
  });
});

// Actualizar estrategia
app.put('/api/estrategias/:id', (req, res) => {
  const { id } = req.params;
  const { denominacion, fecha_inicio, fecha_fin, responsable } = req.body;
  const query = 'UPDATE estrategias SET denominacion = ?, fecha_inicio = ?, fecha_fin = ?, responsable = ? WHERE id = ?';
  
  db.query(query, [denominacion, fecha_inicio, fecha_fin, responsable, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Estrategia no encontrada');
    }
    res.status(200).send({ id, ...req.body });
  });
});

// Eliminar estrategia (borrado lógico)
app.delete('/api/estrategias/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE estrategias SET estado = "inactivo" WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Estrategia no encontrada');
    }
    res.status(200).send({ message: 'Estrategia eliminada correctamente' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});