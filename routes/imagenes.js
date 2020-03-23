var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

// ==============================================================================
// Obtener la imagen de una coleccion de acuerdo al tipo y el nombre de la imagen
// ==============================================================================
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var imagen = `../uploads/${tipo}/${img}`;
    // Formamos la ruta absoluta de la imagen
    var rutaImagen = path.join(__dirname, imagen);

    fs.exists(rutaImagen, existe => {
        if( !existe ){
            // Si no existe, retornamos una imagen por defecto
            imagen = '../assets/no-img.png';
            rutaImagen = path.join(__dirname, imagen);
        }

        // Retornamos la imagen
        res.sendFile(rutaImagen);
    });

});

module.exports = app;