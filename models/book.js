const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const bookSchema = new Schema ({
    title:{
        type: String,
        required: true
    },
    comments:[{
        type: String
    }],
    commentcount:{
        type: Number,
        default:0
    }
})


const Book = mongoose.model('book',bookSchema);



module.exports = {Book};