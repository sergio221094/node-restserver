const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        //Exception if there is an internal error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //Exception if the mail does not match
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Incorrect (email) or password'
                }
            });
        }

        //Exception if the password does not match
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Incorrect email or (password)'
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            user: userDB,
            token

        });

    })
});

module.exports = app;