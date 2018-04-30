const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');


const app = express();

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    // Lo que esta despues de la ',' es lo que deseo ver en mi consulta, si no le pongo nada
    //Trae todo.
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        //Los parametros desde y limite permiten establecer un limite en la consulta
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });

        })
        // res.json('get Usuario LOCAL!!!')
})

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        google: body.google,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });



})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    //underscore permite generar un arreglo de los atributos que quiero cambiar.
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado', 'google']);



    //Esta es una forma de evitar que se modifiquen ciertos campos
    //Cuando no son muchos
    //
    // delete body.password;
    // delete body.google;
    //
    //De otra forma es mejor usar underscore

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

})

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });



    //Eliminación de forma fisica de un registro, no recomendada
    //a menos que sea estrictamente necesaria.
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };
    //     if (usuarioBorrado === null) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });
})


module.exports = app;