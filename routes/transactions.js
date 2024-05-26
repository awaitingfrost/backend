import express from "express"
import Book from "../models/Book.js"
import BookTransaction from "../models/BookTransaction.js"
import User from "../models/User.js"
import moment from 'moment';


const router = express.Router()



// fetch transactions related to user by his/her id
router.get("/userid/all-transactions", async (req, res) => {
    const userId = req.query.userId;
    try {
        if (userId != 'none') {
            const userTransactions = await BookTransaction.find({ borrowerId: userId }).sort({ _id: -1 })
                .populate('bookId')
                .populate('borrowerId');
            return res.status(200).json(userTransactions)
        }
        const transactions = await BookTransaction.find({})
            .sort({ _id: -1 })
            .populate('bookId')
            .populate('borrowerId');

        res.status(200).json(transactions);
    }
    catch (err) {
        return res.status(500).json(err);
    }
})

// adding transaction

router.post("/add-transaction", async (req, res) => {
    try {
        const newtransaction = await new BookTransaction({
            bookId: req.body.bookId,
            borrowerId: req.body.borrowerId,
            transactionType: 'Reserved',
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
        })
        const transaction = await newtransaction.save();

        const book = Book.findById(req.body.bookId)
        await book.updateOne({
            $push: { transactions: transaction._id },
            $inc: { bookCountAvailable: -1 }
        });
        await User.findById(req.body.borrowerId).updateOne({
            $push: { transactions: transaction._id },
        })

        res.status(200).json(transaction)
    }
    catch (err) {
        res.status(504).json(err)
    }
})

router.get("/all-transactions", async (req, res) => {
    try {
        const transactions = await BookTransaction.find({})
            .sort({ _id: -1 })
            .populate('bookId')
            .populate('borrowerId');

        res.status(200).json(transactions);
    } catch (err) {
        res.status(504).json(err);
    }
});

router.post("/update-transaction/:id", async (req, res) => {
    try {

        await Book.findByIdAndUpdate(req.body.bookId, { $inc: { bookCountAvailable: +1 } });
        const transaction = await BookTransaction.findByIdAndUpdate(req.params.id, { $set: { transactionType: "Issued", returnDate: moment(new Date()).format("MM/DD/YYYY") } })
        let fine;

        if (moment(new Date(), "MM/DD/YYY").isAfter(moment(transaction.toDate, "MM/DD/YYYY"))) {
            fine = moment(new Date()).diff(transaction.toDate, 'days') * 10
            await BookTransaction.findByIdAndUpdate(req.params.id, { $set: { fine } })
        }
        await User.findById(req.body.borrowerId).updateOne({
            $push: { transactions: req.params.id },
        })
        res.status(200).json("Transaction details updated successfully");
    } catch (err) {
        res.send(404)
    }
})

router.delete("/remove-transaction/:id", async (req, res) => {
    try {
        const data = await BookTransaction.findByIdAndDelete(req.params.id);
        const book = Book.findById(data.bookId)

        await book.updateOne({ $pull: { transactions: req.params.id } })
        res.status(200).json("Transaction deleted successfully");
    } catch (err) {
        return res.status(504).json(err);
    }
})

// /* get all transaction related to userId */
// // router.get("/allTransactionByUserId/:id", async (req, res) => {
// //     try {
// //         const _id = req.params.id
// //         const allTransactions = await BookTransaction.find({ borrowerId: _id }).populate('bookId')
// //             .populate('borrowerId');
// //         res.status(200).json(allTransactions)
// //     } catch (err) {
// //         return res.status(404).json('User not found');
// //     }
// // })

export default router