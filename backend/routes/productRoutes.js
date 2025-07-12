const express = require("express");
const { protect, admin } = require("../middlewere/authMiddlewere");

const router = express.Router();
const Product = require("../models/Product");

// @route Post /api/products
// @desc Create a new product
// @access Private

router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimension,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      dimension: {
        length: parseFloat(dimension.length), // Convert to number
        width: parseFloat(dimension.width), // Convert to number
        height: parseFloat(dimension.height), // Convert to number
      },
      weight: parseFloat(weight), // Convert to number
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimension,
      weight,
      sku,
      user: req.user.id, // add user id to product
    });
    const createdProduct = await product.save();
    res.status(201).json({ createdProduct });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//@route PUT api/products/:id
//@desc Update product by id
//@access Private
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimension,
      weight,
      sku,
    } = req.body;

    // Find product by id
    const product = await Product.findById(req.params.id);

    if (product) {
      // Update product
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimension = dimension || product.dimension;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      // Save product
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating product" });
  }
});

//@route DELETE api/products/:id
//@desc Delete product by id
//@access Private
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // Find product by id
    const product = await Product.findById(req.params.id);
    if (product) {
      // Delete product
      await product.deleteOne();
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

//@route GET api/products
//@desc Get all products with optional query filters
//@access Public
router.get("/", async (req, res) => {
  try {
    // Get query filters
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      brand,
      limit,
      material,
    } = req.query;

    let query = {};

    // Apply query filters logic
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }

    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query.colors = { $in: [color] };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Correctly assign a single regex object
      query.description = { $regex: search, $options: "i" }; // Add description filter separately
    }

    // Sort Logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    // Fetch products and apply sorting and limit
    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

//@route GET api/products/best-seller
//@desc Get best-selling products
//@access Public
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.json({ message: "No best seller found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching best seller" });
  }
});

//@route GET api/products/new-arrivals
//@desc Get new arrivals
//@access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    // fetch latest 8 products
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching new arrivals" });
  }
});

//@route GET api/products/:id
//@desc Get product by id
//@param id string required
//@access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product" });
  }
});

//@route GET api/products/similer/:id
//@desc Get similar products
//@param id string required
//@access Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const similarProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      gender: product.gender,
    }).limit(4);
    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching similar products" });
  }
});

module.exports = router;
