'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = Schema({
    nombre: String,
    descripcion: String,
    masa: String,
    porciones: { type:Number, default: 0},
    queso: { type: String, enum: ['extra', 'simple'] },
    
})

module.exports = mongoose.model('Product', ProductSchema)