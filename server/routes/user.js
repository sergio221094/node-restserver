const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { checkToken } = require('../middlewares/autentication');


const app = express();

app.get('/user', checkToken, (req, res) => {
    let since = req.query.since || 0;
    since = Number(since);

    let limit = req.query.limit || 5;
    limit = Number(limit);
    // What is after the ',' is what I want to see in my practice, if I do not put anything
    // Bring everything.
    User.find({ state: true }, 'name email role state google img')
        //The parameters from and limit allow to establish a limit in the query
        .skip(since)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            User.count({ state: true }, (err, count) => {

                res.json({
                    ok: true,
                    users,
                    Users: count
                });
            });
        })
})

app.post('/user', function(req, res) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        google: body.google,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            user: userDB
        })
    });
})

app.put('/user/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state', 'google']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            user: userDB
        });
    })

})

app.delete('/user/:id', function(req, res) {
    let id = req.params.id;
    let changeState = {
        state: false
    }

    User.findByIdAndUpdate(id, changeState, { new: true }, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (deletedUser === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }
        res.json({
            ok: true,
            user: deletedUser
        });
    });


})


module.exports = app;