var express = require('express');
var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/usuario');

var app = express();

// ==============================================================================
// Busqueda de una coleccion especifica (usuarios/medicos/hospitales)
// ==============================================================================
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i');
    var tabla = req.params.tabla;
    var promesa;

    switch(tabla){
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son : usuarios, medicos y hospitales',
                errors: { message: 'Tipo de tabla/coleccion no valido' }
            });
    }

    promesa.then( data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });


});


// ==============================================================================
// Busqueda en todas las colecciones (usuarios, medicos y hospitales)
// ==============================================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i');

    Promise.all([ 
        buscarHospitales(busqueda, regex), 
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
        ])
        .then( respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

// Funcion para la busqueda de hospitales con el uso de PROMESAS
function buscarHospitales(busqueda, regex){
    return new Promise((resolve, reject) => {
        Hospital.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if(err){
                    reject('Error al cargar hospitales', err);
                }else{
                    resolve(hospitales);
                }
            });
    });
}

// Funcion para la busqueda de medicos con el uso de PROMESAS
function buscarMedicos(busqueda, regex){
    return new Promise((resolve, reject) => {
        Medico.find({nombre: regex})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if(err){
                reject('Error al cargar medicos', err);
            }else{
                resolve(medicos);
            }
        } );
    });
}

// Funcion para la busqueda de usuarios con el uso de PROMESAS
function buscarUsuarios(busqueda, regex){
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role').or({'nombre': regex}, {'email': regex})
        .exec( (err, usuarios) => {
            if(err){
                reject('Error al cargar usuarios', err);
            }else{
                resolve(usuarios);
            }
        });
    });
}

module.exports = app;