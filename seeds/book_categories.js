import mongoose from "mongoose";
import BookCategory from "../models/BookCategory.js";
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

// Create an array of book categories
const categoriesData = [
  { categoryName: "Fiction" },
  { categoryName: "Non-fiction" },
  { categoryName: "Science Fiction" },
  { categoryName: "Fantasy" },
  { categoryName: "Mystery" },
  { categoryName: "Thriller" },
  { categoryName: "Romance" },
  { categoryName: "Historical Fiction" },
  { categoryName: "Biography" },
  { categoryName: "Self-help" },
];

// Function to seed the database with categories
async function seedDatabase() {
  try {
    // Clear existing categories
    await BookCategory.deleteMany({});
    console.log("Cleared existing categories.");

    // Insert new categories
    const createdCategories = await BookCategory.create(categoriesData);
    console.log("Categories seeded successfully:", createdCategories);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Seed the database
seedDatabase();
