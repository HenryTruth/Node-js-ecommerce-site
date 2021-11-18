const mongoose = require('mongoose')
const UserSchema = require('./User')


const productSchema = new mongoose.Schema({
    name:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    productName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    filePath:{
        type:String
    },
    description:{
        type:String,
        required:true
    },
    timestamps:{
        type:Boolean,
        default:true
    }
})


const Product = mongoose.model('Product', productSchema)
module.exports = Product