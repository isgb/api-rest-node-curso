const express = require('express');
const router = express.Router();

const ArticuloController = require('../controladores/Articulo');    

// Rutas de pruebas
router.get("/ruta-de-prueba", ArticuloController.prueba)
router.get("/curso", ArticuloController.curso)

router.post("/crear", ArticuloController.crear)
router.get("/articulos", ArticuloController.listar)

module.exports = router;