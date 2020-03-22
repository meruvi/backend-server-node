var express = require('express');
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();


app.post('/', (req, res, next) => {

    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: { message: 'No existe las credenciales enviadas.' }
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: { message: 'No existe las credenciales enviadas.' }
            });
        }

        // Limpiar contraseña
        usuarioDB.password = ':)';
        // Crear un token
        var token = jwt.sign(
            {usuario: usuarioDB}, 
            '@este-es@-un-seed-dificil', 
            {expiresIn: 14400});


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });
});





module.exports = app;