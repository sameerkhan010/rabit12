const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middlewere/authMiddlewere");

const router = express.Router();

//@route GET /api/orders/my-orders
//@desc Get logged-in user orders
//@access Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    // find orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); //Short by the most recent order
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error " });
  }
});

//@route GET /api/orders/:id
//@desc Get order deteails by id
//@access Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );//populate the user field with name and email
    if (!order) {
        return res.status(404).json({ msg: "Order not found" });
    }
    //Return the full order details
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error " });
  }
});

module.exports = router; //export the router
