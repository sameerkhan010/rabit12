const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middlewere/authMiddlewere");

const router = express.Router();

//@router GET /api/admin/users
//@desc Get all users (Admin only request)
//@access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@route POST /api/admin/users
//@desc Create a new user (Admin only )
//@access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });
    await user.save();
    res.status(201).json({ msg: "User created successfully" , user});

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});
//@route PUT /api/admin/users/:id
//@desc Update a user information (Admin only)- Name Email Role
//@access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        }
        const updatedUser = await user.save();
        res.json({ msg: "User updated successfully", updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
        
    }
})

//@route DELETE /api/admin/users/:id
//@desc Delete a user 
//@access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ msg: "User deleted successfully" });
        }else{
            res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
        
    }
})


module.exports = router;
