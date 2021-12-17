const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: 'Enter a Title',
        unique: true,
    },

    excerpt: {
        type: String,
        required: 'Enter excerpt',
    },
    
    userId: {
        type: ObjectId,
        ref: 'myUser',
        required: 'Enter userId',
    },

    isbn: {
        type: String,
        required: 'Enter isbn',
        unique: true
    },

    category: {
        type: String,
        required: 'Enter category'
    },

    subcategory: {
        type: String,
        required: 'Enter subcategory'
    },

    reviews: {
        type: Number,
        default: 0
    },
    
    isDeleted:{
        type: Boolean,
        default: false
    },

    deletedAt: {
        type:Date,

    },

    releasedAt: {
        type: Date,
        required: 'Enter Release date'
    },
    



},{timestamps:true})

module.exports = mongoose.model('myBook',bookSchema)























