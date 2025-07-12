const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Fuction to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Create a default admin user
    const createdUser = await User.create({
      name: "Admin User",
      email: "Sameer0786@gmail.com",
      password: "098765",
      role: "admin",
    });

    // Assign the default user id to each product
    const userID = createdUser._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });
    //Insert the products into the database
    await Product.insertMany(sampleProducts);

    console.log("Product data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding database: ", error);
    process.exit(1);
  }
};

seedDatabase(); // Call the function to seed the database
