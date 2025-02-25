const validator = require('validator');

const validarArticulo = (parametros) => {

    let validate_titulo = !validator.isEmpty(parametros.titulo) &&
        validator.isLength(parametros.titulo, { min: 5, max: 50 });
    let validate_contenido = !validator.isEmpty(parametros.contenido);

    if (!validate_titulo || !validate_contenido) {
        throw new Error("No se ha validado la información revise que cumpla los terminos")
    }

}

module.exports = {
    validarArticulo
}