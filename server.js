
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();


const mongoURI = process.env.mongo_uri;


mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => console.error("MongoDB connection error:", error));


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});


const Product = mongoose.model("Product", productSchema);


const server = express();


server.use(express.json());


const port = 5000;


const items = [
  { id: 1, name: "jeans" },
  { id: 2, name: "skirts" },
  { id: 3, name: "kurthis" },
];


server.get("/", (req, res) => {
  res.end("Ezhumathi's server is running");
});


server.get("/product", (req, res) => {
  res.json(items);
});


server.post("/product", (req, res) => {
  const newItem = { id: items.length + 1, name: req.body.name };
  items.push(newItem);
  res.status(201).json(newItem);
});


server.put("/product/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItemIndex = items.findIndex((item) => item.id === itemId);
  if (updatedItemIndex !== -1) {
    items[updatedItemIndex].name = req.body.name;
    res.json(items[updatedItemIndex]);
  } else {
    res.status(404).json("Item not found in database");
  }
});


server.delete("/product/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    const deletedItem = items.splice(itemIndex, 1);
    res.json({
      message: "Item deleted successfully",
      deletedItem: deletedItem[0],
    });
  } else {
    res.status(404).json({ error: "Item not found in the database" });
  }
});


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
