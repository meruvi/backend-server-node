var express = require('express');
var fileUpload = require('express-fileupload');
var Usuario = require('../models/usuario');
var Medico = require('../models/Medico');
var Hospital = require('../models/Hospital');
var fs = require('fs');

var app = express();

// default options (middleware)
app.use(fileUpload());

// ==============================================================================
// Upload imagenes al servidor
// ==============================================================================
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos validos de colecciones
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no es valida' }
        })
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        })
    }


    // Obtenemos el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[ nombreCortado.length - 1];

    // Aceptamos solo estas extensiones de archivos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension de archivo no valida',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        })
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover archivo del temporal a una ruta especifica del servidor
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv( path, err => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            })
        }

        subirPorTipo( tipo, id, nombreArchivo, res);
        
    });

});

function subirPorTipo( tipo, id, nombreArchivo, res){

    if(tipo === 'usuarios'){
        Usuario.findById(id, (err, usuario) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al encontrar usuario con id: ' + id,
                    errors: err
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario.',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado.',
                    usuario: usuarioActualizado
            
                });
            });

        });
    }

    if(tipo === 'medicos'){

    }

    if(tipo === 'hospitales'){

    }
}

module.exports = app;