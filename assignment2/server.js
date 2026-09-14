const express = require("express");

const app = express();

const PORT = 3000;

// Middleware to read JSON data
app.use(express.json());

// 100 Products
let products = [];

for (let i = 1; i <= 100; i++) {
    products.push({
        id: i,
        name: `Product ${i}`,
        price: i * 100,
        category: "Electronics"
    });
}

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Products REST API");
});

// GET all products
app.get("/products", (req, res) => {
    res.json(products);
});

// GET single product
app.get("/products/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});

// POST - Add new product
app.post("/products", (req, res) => {

    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

// PUT - Update product
app.put("/products/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.category = req.body.category;

    res.json({
        message: "Product updated successfully",
        product: product
    });
});

// DELETE - Delete product
app.delete("/products/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const deletedProduct = products.splice(index, 1);

    res.json({
        message: "Product deleted successfully",
        product: deletedProduct[0]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});