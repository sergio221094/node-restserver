const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};

let Schema = mongoose.Schema;


let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name it is necessary.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email it is necessary.']
    },
    password: {
        type: String,
        required: [true, 'Password it is necessary.']
    },
    img: {
        type: String,
        required: false
    },
    google: {
        type: Boolean,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


userSchema.plugin(uniqueValidator, { message: ' {PATH} must be unique.' });


module.exports = mongoose.model('User', userSchema);