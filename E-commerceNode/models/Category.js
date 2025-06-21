const Joi = require("joi");
const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        default: null
    }

}, {
    timestamps: true
})


function validateCreateCategory(obj) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        parent: Joi.string().allow(null, '')
        })
    return schema.validate(obj)
}

function validateUpdateCategory(obj) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        parent: Joi.string().allow(null, '')    
        })
    return schema.validate(obj)
}

const Category = mongoose.model("category", categorySchema)

module.exports = { Category, validateCreateCategory, validateUpdateCategory}