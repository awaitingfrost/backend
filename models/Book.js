import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        require: true
    },
    alternateTitle: {
        type: String,
        default: ""
    },
    author: {
        type: String,
        require: true
    },
    language: {
        type: String,
        default: ""
    },
    publisher: {
        type: String,
        default: ""
    },
    book_image: {
        type: String,
        default: ""
    },
    bookCountAvailable: {
        type: Number,
        require: true
    },
    totalCopies: {
        type: Number,
        require: true
    },
    bookSummary: {
        type: String,
        require: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    bookStatus: {
        type: String,
        default: "Available"
    },
    categories: [{
        type: mongoose.Types.ObjectId,
        ref: "BookCategory"
    }],
    transactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }]
},
    {
        timestamps: true
    })

export default mongoose.model("Book", BookSchema)