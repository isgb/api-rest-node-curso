const validator = require('validator');
const Articulo = require('../modelos/Articulo');

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
    try {

        let validate_titulo = !validator.isEmpty(parametros.titulo) &&
            validator.isLength(parametros.titulo, { min: 5, max: 50 });
        let validate_contenido = !validator.isEmpty(parametros.contenido);

        if (!validate_titulo || !validate_contenido) {
            return res.status(400).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }

    } catch (error) {
        return res.status(400).send({
            status: 'error',
            message: 'Faltan datos por enviar'
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
        const articulos = await Articulo.find().exec();
        res.status(200).json({
            status: 'success',
            articulos: articulos
        });
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

module.exports = {
    prueba,
    curso,
    crear,
    listar
};