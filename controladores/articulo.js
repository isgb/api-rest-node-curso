const validator = require('validator');
const path = require('path');
const Articulo = require('../modelos/Articulo');
const { validarArticulo } = require('../helper/validar');
const fs = require('fs');

const prueba = (req, res) => {
    return res.status(200).send({
        message: 'Soy una accion de prueba'
    });
}

const curso = (req, res) => {
    // res.status(200).send(`
    //     <h1>Hola mundo desde mi servidor</h1>
    // `);
    res.status(200).send({
        message: 'Hola mundo desde mi servidor'
    });
}

const crear = async (req, res) => {

    // Recoger parametros por post a guardar
    let parametros = req.body;

    // Validar datos
    // Validar datos
    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    // Crear el objeto a guardar
    const articulo = new Articulo(parametros);

    // Asignar valores a objeto basado en el modelo (manual o automatico)
    // articulo.titulo = parametros.titulo;

    // Guardar el articulo en la base de datos
    try {
        const articulo = new Articulo(parametros)
        let articuloGuardado = await articulo.save(); //when fail its goes to catch
        res.status(200).json({
            status: 'success',
            articulo: articuloGuardado,
            mensaje: 'Articulo creado con exito'
        });
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

const listar = async (req, res) => {
    try {
        let consulta = await Articulo.find({});
        let consultaLimit = await Articulo.find({}).limit(req.params.ultimos);

        if (!consulta || consulta.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "No se han encontrado articulos",
            });
        }

        if (req.params.ultimos && !isNaN(req.params.ultimos)) {
            return res.status(200).json({
                status: "Success",
                total: consultaLimit.length,
                articulo: consultaLimit,
            });
        }

        return res.status(200).json({
            status: "Success",
            total: consulta.length,
            articulo: consulta,
        });

    } catch (error) {
        return res.status(404).json({
            status: "Error",
            message: "No se han encontrado articulos",
        });
    }
};

const uno = async (req, res) => {
    try {
        // Recoger id por la url
        let id = req.params.id;
        // Buscar articulo
        let articulo = await Articulo.findById(id)

        if (!articulo) {
            return res.status(404).json({
                status: "error",
                message: "No se ha encontrado el articulo",
            });
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo
        })

    } catch (error) {
        // Si no existe articulo devuelve esto 
        return res.status(400).json({
            status: "error",
            message: "Un error ha ocurrido mientras se obtenia el articulo",
        });
    }

}

const borrar = (req, res) => {

    // Recoger el id de la url
    let id = req.params.id;

    // Find and delete
    Articulo.findByIdAndDelete(id)
        .then(articuloBorrado => {
            if (!articuloBorrado) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista'
                });
            }

            return res.status(200).send({
                status: 'success',
                articulo: articuloBorrado
            });
        })
        .catch(err => {
            return res.status(500).send({
                status: 'error',
                message: 'Error al borrar el articulo'
            });
        });
}

const editar = async (req, res) => {
    try {
        //  Recoger id articulo a editar
        let articuloId = req.params.id;
        // Recoger datos del body
        let parametros = req.body;

        // Validar datos
        try {
            validarArticulo(parametros);
        } catch (error) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar",
            });
        }

        // Buscar y actualizar articulo
        let articuloActualizado = await Articulo.findOneAndUpdate({ _id: articuloId }, parametros, { new: true })
        if (!articuloActualizado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al actualizar",
            })
        }
        // Devolver respuesta
        return res.status(200).json({
            status: "success updated",
            mensaje: "Se ha actualizado correctamente",
            articulo: articuloActualizado
        })
        // Devolver respuesta
    } catch (error) {
        return res.status(400).json({
            status: "error",
            error,
            message: "Un error ha ocurrido mientras se editaba el articulo",
        });
    }
}

const subir = async (req, res) => {

    //( Recoger el fichero de la imagen
    if (!req.file && !req.files) {
        return res.status(400).json({
            status: "error",
            message: "No se ha subido ninguna imagen",
        });
    }

    // Nombre del archivo
    let archivo = req.file.originalname;

    // Extension del archivo
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];

    if (extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif') {

        fs.unlink(req.file.path, (err) => {
            return res.status(400).json({
                status: "error",
                message: "La extension del archivo no es valida"
            });
        });

    } else {

        let articuloId = req.params.id;

        // Buscar y actualizar articulo
        let articuloActualizado = await Articulo.findOneAndUpdate({ _id: articuloId }, {imagen: req.file.filename}, { new: true })
        if (!articuloActualizado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al actualizar",
            })
        }
        // Devolver respuesta
        return res.status(200).json({
            status: "success updated",
            mensaje: "Se ha actualizado correctamente",
            articulo: articuloActualizado,
            fichero: req.file
        })

    }
}

const imagen = (req, res) => {
    let archivo = req.params.imagen;
    let ruta_archivo = './imagenes/articulos/'+archivo;

    // access
    fs.stat(ruta_archivo, (error, existe) => {
        if (existe) {
            return res.sendFile(path.resolve(ruta_archivo));
        } else {
            return res.status(404).json({
                status: "error",
                message: "La imagen no existe",
                existe,
                fichero,
                ruta_archivo
            });
        }
    });
}

const buscador = async (req, res) => {
    // Sacar string a buscar
    let buscar = req.params.buscar;

    // Find or
    try {
        let articulos = await Articulo.find({
            "$or": [
                { "titulo": { "$regex": buscar, "$options": "i" } },
                { "contenido": { "$regex": buscar, "$options": "i" } }
            ]
        }).sort([['fecha', 'descending']]);

        if (!articulos || articulos.length <= 0) {
            return res.status(404).json({
                status: "error",
                message: "No se han encontrado articulos",
            });
        }

        return res.status(200).json({
            status: "success",
            articulos
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Error en la peticion",
        });
    }
}

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
};