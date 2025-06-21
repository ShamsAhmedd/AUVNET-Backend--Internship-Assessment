const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
}, {
  timestamps: true,
});

function validateAddProduct(obj) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(1000).allow(''),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
  });
  return schema.validate(obj);
}

function validateUpdateProduct(obj) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(1000).allow(''),
    price: Joi.number().min(0),
    category: Joi.string(),
  });
  return schema.validate(obj);
}

const Product = mongoose.model("product", productSchema);

module.exports = { Product, validateAddProduct, validateUpdateProduct };
