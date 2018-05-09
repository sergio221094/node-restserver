const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        //Excepción si existe un error interno del servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //Excepción si no coincide el correo
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(correo) o contraseña incorrectos'
                }
            });
        }

        //Excepción si no coincide la contraseña
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'correo o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, 'este-es-el-seed-desarrollo', { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token

        });

    })
});

module.exports = app;