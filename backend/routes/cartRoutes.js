const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middlewere/authMiddlewere");

const router = express.Router();

// Helper function to get cart by user id or guestId
const getCart = async (userId, guestId) => {
  let cart = null;
  if (userId) {
    cart = await Cart.findOne({ userId });
  }
  if (!cart && guestId) {
    cart = await Cart.findOne({ guestId });
  }
  return cart;
};

//@route POST api/cart
//@desc Add item to cart
//@access Public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      cart.userId = userId || cart.userId;
      cart.guestId = guestId || cart.guestId;

      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        userId: userId || null,
        guestId: guestId || "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });

      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// @route PUT /api/cart/
// @desc Update cart
// @access Public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    let cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      if (quantity === 0) {
        // Remove the product if quantity is 0
        cart.products.splice(productIndex, 1);
      } else {
        // Update the quantity if it's greater than 0
        cart.products[productIndex].quantity = quantity;
      }
    } else {
      if (quantity > 0) {
        // Add product only if quantity is greater than 0
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }
    }

    // Update total price
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // If cart is empty, set totalPrice to 0
    if (cart.products.length === 0) {
      cart.totalPrice = 0;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

//@route DELETE api/cart
//@dese Remove product from cart
//@access Public
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      cart.userId = userId || cart.userId;
      cart.guestId = guestId || cart.guestId;

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ msg: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

//@route GET api/cart
//@dese Get Logged-in user or guest  user cart
//@access Public
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ msg: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

//@route POST api/cart/merge
//@dese Merge guest cart into user cart om login
//@access Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body; // Use req.body instead of req.query

  if (!guestId) {
    return res.status(400).json({ msg: "Guest ID is required" });
  }

  try {
    // Find guest cart and user cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ userId: req.user._id });

    console.log("Guest Cart Found:", guestCart);
    console.log("User Cart Found:", userCart);

    if (!guestCart) {
      return res.status(404).json({ msg: "Guest cart not found" });
    }

    if (guestCart.products.length === 0) {
      return res.status(400).json({ msg: "Guest cart is empty" });
    }

    if (userCart) {
      // Merge guest cart into user cart
      guestCart.products.forEach((guestItem) => {
        const productIndex = userCart.products.findIndex(
          (item) =>
            item.productId.toString() === guestItem.productId.toString() &&
            item.size === guestItem.size &&
            item.color === guestItem.color
        );

        if (productIndex > -1) {
          // If product exists in user cart, update quantity
          userCart.products[productIndex].quantity += guestItem.quantity;
        } else {
          // Otherwise, add guest item to the cart
          userCart.products.push(guestItem);
        }
      });

      // Update total price
      userCart.totalPrice = userCart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Save the updated user cart
      await userCart.save();

      // Delete guest cart after merging
      await Cart.findOneAndDelete({ guestId });

      return res.status(200).json(userCart);
    } else {
      // If no existing user cart, assign the guest cart to the user
      guestCart.userId = req.user._id;
      guestCart.guestId = undefined; // Remove guest ID
      await guestCart.save();

      return res.status(200).json(guestCart);
    }
  } catch (error) {
    console.error("Error merging carts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
