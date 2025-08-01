const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const UserRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const checkoutRoutes = require("./routes/cheackoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
//  const cartRoutes = require("./routes/cartRoutes")

const app = express();
app.use(express.json()); // Ensure this line is included
app.use(express.urlencoded({ extended: true }));
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

// connect to database
connectDB();

app.get("/", (req, res) => {
  res.send("Hello from Express");
});

// API Routes
app.use("/api/users", UserRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscriberRoutes);

//Admin
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
