var express = require('express');
var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');

var app = express();

// Rutas
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i');

    buscarHospitales(busqueda, regex)
        .then(hospitales => {
            res.status(200).json({
                ok: true,
                hospitales: hospitales
            });
        });
});

// Funcion para la busqueda de hospitales con el uso de PROMESAS
function buscarHospitales(busqueda, regex){
    return new Promise((resolve, reject) => {
        Hospital.find({nombre: regex}, (err, hospitales) => {
            if(err){
                reject('Error al cargar hospitales', err);
            }else{
                resolve(hospitales);
            }
        } );
    });
}

module.exports = app;