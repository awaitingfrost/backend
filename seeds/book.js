import mongoose from "mongoose";
import Book from "../models/Book.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_URL,
  {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },

).then(() => {
  console.log("MONGODB CONNECTED");
}).catch(err => console.log("COULDNT CONNECT MONGODB"))

// Sample book data
const booksData = [
  {
    bookName: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    bookCountAvailable: 5,
    categories: ["6640614ddf325c545c025d80"], // Fiction
  },
  {
    bookName: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    bookCountAvailable: 8,
    categories: ["6640614ddf325c545c025d81"], // Non-fiction
  },
  {
    bookName: "Dune",
    author: "Frank Herbert",
    bookCountAvailable: 7,
    categories: ["6640614ddf325c545c025d82"], // Science Fiction
  },
  {
    bookName: "The Hobbit",
    author: "J.R.R. Tolkien",
    bookCountAvailable: 6,
    categories: ["6640614ddf325c545c025d83"], // Fantasy
  },
  {
    bookName: "The Da Vinci Code",
    author: "Dan Brown",
    bookCountAvailable: 9,
    categories: ["6640614ddf325c545c025d84"], // Mystery
  },
  {
    bookName: "Gone Girl",
    author: "Gillian Flynn",
    bookCountAvailable: 10,
    categories: ["6640614ddf325c545c025d85"], // Thriller
  },
  {
    bookName: "Pride and Prejudice",
    author: "Jane Austen",
    bookCountAvailable: 4,
    categories: ["6640614ddf325c545c025d86"], // Romance
  },
  {
    bookName: "The Nightingale",
    author: "Kristin Hannah",
    bookCountAvailable: 5,
    categories: ["6640614ddf325c545c025d87"], // Historical Fiction
  },
  {
    bookName: "Steve Jobs",
    author: "Walter Isaacson",
    bookCountAvailable: 3,
    categories: ["6640614ddf325c545c025d88"], // Biography
  },
  {
    bookName: "The Power of Now",
    author: "Eckhart Tolle",
    bookCountAvailable: 6,
    categories: ["6640614ddf325c545c025d89"], // Self-help
  },
  // Add more books with category IDs as needed
];


// Function to seed the database with books
async function seedBooks() {
  try {
    // Clear existing books
    await Book.deleteMany({});
    console.log("Cleared existing books.");

    // Insert new books
    const createdBooks = await Book.create(booksData);
    console.log("Books seeded successfully:", createdBooks);
  } catch (error) {
    console.error("Error seeding books:", error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Seed the database with books
seedBooks();
