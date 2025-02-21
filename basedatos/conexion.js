const mongoose = require('mongoose');

const conexion = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/mi_blog', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión a la base de datos establecida');
    } catch (error) {
        console.log('Error al conectar a la base de datos', error);
    }
}

module.exports = {conexion};