require('./config/config');
const colors = require('colors/safe');
const express = require('express');


const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

//Configuración global de rutas
app.use(require('./routes/index'));




mongoose.connect(process.env.URLDB, (err, ress) => {

    if (err) throw err;

    console.log(colors.yellow('base de datos ONLINE'));
});

app.listen(process.env.PORT, () => {

    console.log(colors.yellow('Escuchando el puerto: ', process.env.PORT));
})