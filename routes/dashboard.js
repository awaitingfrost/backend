import Book from "../models/Book.js"
import User from "../models/User.js";
import BookTransaction from "../models/BookTransaction.js"
import express from "express"
import BookCategory from "../models/BookCategory.js";

const router = express.Router();

router.get("/dashboard-counts", async (req, res) => {
  try {
    const Books = await Book.countDocuments();
    const Users = await User.countDocuments();
    const Transactions = await BookTransaction.countDocuments();

    const result = await BookTransaction.aggregate([
      {
        $group: {
          _id: null,
          totalFine: { $sum: "$fine" }
        }
      }
    ]);

    const totalFine = result.length > 0 ? result[0].totalFine : 0;

    const totalCategories = await BookCategory.countDocuments();
    const totalAuther = await Book.distinct("author");
    const totalReserved = await BookTransaction.find({ transactionType: "Issued" });

    const data = {
      book: Books,
      user: Users,
      transaction: Transactions,
      fine: totalFine,
      categories: totalCategories,
      auther: totalAuther.length,
      issued: totalReserved.length
    }

    return res.status(200).json(data);

  } catch (err) {
    console.log(err)
    return res.status(504).json(err);
  }
});

router.get("/dashboard-counts/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Run count queries concurrently
    const [bookCount, reservedCount, issuedCount, fineResult] = await Promise.all([
      Book.countDocuments({ user_id: userId }),
      BookTransaction.countDocuments({ borrowerId: userId, transactionType: "Reserved" }),
      BookTransaction.countDocuments({ borrowerId: userId, transactionType: "Issued" }),
      BookTransaction.aggregate([
        { $match: { borrowerId: userId } },
        {
          $group: {
            _id: null,
            totalFine: { $sum: "$fine" }
          }
        }
      ])
    ]);

    // Extract total fine from the aggregation result
    const totalFine = fineResult.length > 0 ? fineResult[0].totalFine : 0;

    const data = {
      books: bookCount,
      transactions: reservedCount,
      fine: totalFine,
      issued: issuedCount
    };

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});


export default router;