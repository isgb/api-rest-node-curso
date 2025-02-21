const {conexion} = require('./basedatos/conexion');
const express = require('express');
const cors = require('cors');

//Inicializar app
console.log('App de node arrancada');

//Conectar a la base de datos
conexion();

// Crear servidor Node
const app = express();
const port = 3000;

// Configurar cors
app.use(cors());

// Convertir body a JSON
app.use(express.json());
app.use(express.urlencoded({extended:true})); // Para poder recibir datos de formularios

// Rutas
const rutas_articulos = require('./rutas/Articulo');

// Cargar las rtuas
app.use('/apis',rutas_articulos)

// app.use('/probando', (req,res) => {
//     // res.status(200).send(`
//     //     <h1>Hola mundo desde mi servidor</h1>
//     // `);
//     res.status(200).send({
//         message: 'Hola mundo desde mi servidor'
//     });
// });

//Crear servidor y escuchar peticiones HTTP
app.listen(port, () => {
    console.log('Servidor arrancado en http://localhost:'+port);
});