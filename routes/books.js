import express from "express"
import Book from "../models/Book.js"
import BookCategory from "../models/BookCategory.js"
import multer from 'multer'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// fetch books related to user by his/her id
router.get("/userid", async (req, res) => {
    const userId = req.query.userId
    try {
        if (userId != 'none') {
            const booksOfUser = await Book.find({ user_id: userId }).exec();
            return res.status(200).json(booksOfUser)
        }
        const books = await Book.find().sort({ _id: -1 });
        res.status(200).json(books);
    }
    catch (err) {
        return res.status(500).json(err);
    }
})


/* Get all books in the db */
router.get("/allbooks", async (req, res) => {
    const { startDate, endDate } = req.query;
    let query = {}

    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }
    try {
        const books = await Book.find(query).sort({ _id: -1 });
        res.status(200).json(books);
    } catch (err) {
        return res.status(504).json(err);
    }
});

/* Get avaliable books for reserve in the db */
router.get("/avaliableBooks", async (req, res) => {
    let query = {
        bookCountAvailable: { $gte: 1 }
    };

    try {
        const books = await Book.find(query).sort({ _id: -1 });
        res.status(200).json(books);
    } catch (err) {
        return res.status(504).json(err);
    }
});

/* Get Book by book Id */
router.get("/getbook/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("transactions")
        res.status(200).json(book)
    }
    catch {
        return res.status(500).json(err)
    }
})

/* Get books by category name*/
router.get("/", async (req, res) => {
    const category = req.query.category
    try {
        const books = await BookCategory.findOne({ categoryName: category }).populate("books")
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

/* Adding book */
router.post("/addbook", upload.single('bookImage'), async (req, res) => {

    const imageUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req?.file?.filename}`;
    if (req.body.isAdmin) {
        console.log(req.body.bookSummary, 'test')
        try {
            const newbook = await new Book({
                bookName: req.body.bookName,
                alternateTitle: req.body.alternateTitle,
                author: req.body.author,
                bookCountAvailable: req.body.bookCountAvailable,
                language: req.body.language,
                publisher: req.body.publisher,
                bookSummary: req.body.bookSummary,
                user_id: req.body.userId,
                bookStatus: req.body.bookSatus,
                categories: req.body.categories,
                book_image: imageUrl,
                totalCopies: req.body.bookCountAvailable,
            })
            const book = await newbook.save()
            await BookCategory.updateMany({ '_id': book.categories }, { $push: { books: book._id } });
            res.status(200).json(book)
        }
        catch (err) {
            res.status(504).json(err)
        }
    }
    else {
        return res.status(403).json("You dont have permission to add a book!");
    }
})

/* Addding book */
router.put("/updatebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            await Book.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Book details updated successfully");
        }
        catch (err) {
            res.status(504).json(err);
        }
    }
    else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

/* Remove book  */
router.delete("/removebook/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const book = await Book.findOne({ _id })
        await book.remove()
        await BookCategory.updateMany({ '_id': book.categories }, { $pull: { books: book._id } });
        res.status(200).json("Book has been deleted");
    } catch (err) {
        return res.status(504).json(err);
    }
})


export default router