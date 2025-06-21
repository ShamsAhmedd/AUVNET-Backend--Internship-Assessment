const Joi = require("joi");
const mongoose = require("mongoose")
const JWT = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',

    }


}, {
    timestamps: true
})

userSchema.methods.generateToken = function () {
    return JWT.sign(
        { _id: this._id, email: this.email, type: this.type },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    );
};
function validateRegisterUser(obj) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(20).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().min(3).max(20).required(),
    })
    return schema.validate(obj)
}

function validateLoginUser(obj) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(20).required(),
        password: Joi.string().min(3).max(20).required(),
    })
    return schema.validate(obj)
}

const User = mongoose.model("user", userSchema)

module.exports = { User, validateRegisterUser, validateLoginUser}