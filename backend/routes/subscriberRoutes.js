const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

//@route POST /api/subscribers
//@desc Handle newsletter subscription
//@access Public
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Please enter your email address" });
  }

  try {
    //Check if subscriber already exists
    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      return res
        .status(400)
        .json({ msg: "You are already subscribed to our newsletter" });
    }

    // Create a new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();
    res.json({
      msg: "You have been successfully subscribed to our newsletter",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error occurred while subscribing" });
  }
});

module.exports = router;