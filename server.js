
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 


const server = express();
server.use(cors());
server.use(express.json()); 


const mongoURI = process.env.mongo_uri;


if (!mongoURI) {
  console.error('MongoDB URI is not defined in the .env file.');
  process.exit(1); 
}


mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => console.error('MongoDB connection error:', error));


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

const Item = mongoose.model('Item', productSchema);


const port = 5000;


server.get('/', (req, res) => {
  res.send('Server is running on port 5000');
});


server.get('/product', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});


server.post('/product', async (req, res) => {
  try {
    const newItem = new Item({
      name: req.body.name,
      price: req.body.price,
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: 'Error saving product', error });
  }
});


server.delete('/product/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (deletedItem) {
      res.json({ message: 'Item deleted successfully', deletedItem });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});


server.put('/product/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, price: req.body.price },
      { new: true } 
    );
    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
