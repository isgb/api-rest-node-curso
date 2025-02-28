const express = require('express');
const router = express.Router();
const multer = require('multer');
const ArticuloController = require('../controladores/Articulo');

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imagenes/articulos/')
    },
    filename: (req, file, cb) => {
        cb(null, "articulo"+Date.now()+file.originalname)
    }
})

const subidas = multer({storage: almacenamiento})

// Rutas de pruebas
router.get("/ruta-de-prueba", ArticuloController.prueba)
router.get("/curso", ArticuloController.curso)

router.post("/crear", ArticuloController.crear)
router.get("/articulos/:ultimos?", ArticuloController.listar)
router.get("/articulo/:id", ArticuloController.uno)
router.delete("/articulo/:id", ArticuloController.borrar)
router.put("/articulo/:id", ArticuloController.editar)
router.post("/subir-imagen/:id",[subidas.single('file0')], ArticuloController.subir)
router.get("/imagen/:imagen", ArticuloController.imagen)
router.get("/buscar/:buscar", ArticuloController.buscador)

module.exports = router;