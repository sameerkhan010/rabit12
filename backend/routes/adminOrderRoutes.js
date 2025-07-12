const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middlewere/authMiddlewere");

const router = express.Router();

//@routr GET /api/admin/orders
//desc get all orders (admin only)
//access private/admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error getting orders" });
  }
});

//@route PUT /api/admin/orders/:id
//desc update order status (admin only)
//access private/admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered =
        req.body.status === " Delivered" ? true : order.isDelivered;
        order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }else{
        res.status(404).json({ msg: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating order" });
  }
});

//@router DELETE /api/admin/orders/:id
//desc delete order (admin only)
//access private/admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ msg: "Order deleted" });
        }else{
            res.status(404).json({ msg: "Order not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error deleting order" });
        
    }
})

module.exports = router;
