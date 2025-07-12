const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const {  protect } = require("../middlewere/authMiddlewere");

const router = express.Router();

//@route POST api/checkout
//@desc Create a new checkout
//@access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ msg: "Checkout items is required" });
  }

  try {
    //Create a new checkout Session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Panding",
      isPaid: false,
    });
    // console.log(`Checkout Session Created ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@route PUT api/checkout/:id/pay
//@desc Update checkout to mark as paid after successful payment
//@access Private

router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ msg: "Checkout not found" });
    }
    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ msg: "Invalid payment status" });
    }
  } catch (error) {
    console.error("Error updating checkout session", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@route POST api/checkout/:id/finalize
//@desc Finalize checkout convert to an order after payment confirmation
//@access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ msg: "Checkout not found" });
    }
    if (checkout.isPaid && !checkout.isFinalized) {
      // Create the Final order based on the checkout details
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });
      // Mark the checkout as finalized
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();
      //Delete the cart associted with the user
      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ msg: "Checkout already finalized" });
    } else {
      res.status(400).json({ msg: "Invalid payment status" });
    }
  } catch (error) {
    console.error("Error finalizing checkout", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router; // Renamed file to checkoutRoutes.js
