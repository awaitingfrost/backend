import mongoose from "mongoose";

const BookTransactionSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Types.ObjectId,
        ref: "Book",
        require: true
    },
    borrowerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true
    },
    fromDate: {
        type: String,
        require: true,
    },
    toDate: {
        type: String,
        require: true,
    },
    returnDate: {
        type: String,
    },
    fine: {
        type: Number,
        default: 0
    },
    transactionStatus: {
        type: String,
        default: "Active"
    },
    transactionType: {
        type: String,
        require: true,
    },
},
    {
        timestamps: true
    }
);

export default mongoose.model("BookTransaction", BookTransactionSchema)