const express = require('express');
const Product = require("../models/Product")
const {protect, admin} =require("../middlewere/authMiddlewere")

const router = express.Router();

//@route GET /api/admin/products
//@desc get all products (Admin only)
//@access Private
router.get('/', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({})
        res.json(products)
    } catch (error) {
        res.status(500).json({msg: error.message})
        
    }
})

module.exports = router; 