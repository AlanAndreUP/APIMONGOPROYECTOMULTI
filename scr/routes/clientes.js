
const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const collectionName = 'Clientes';


module.exports = (client) => {

  const getCollection = async () => {
    const db = client.db('Prueba');
    return db.collection(collectionName);
  };


  router.post('/', async (req, res) => {
    const newItemData = req.body;
    
    try {
      const collection = await getCollection();
      const result = await collection.insertOne(newItemData);
      res.status(201).json(result.ops[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  router.get('/', async (req, res) => {
    try {
      const collection = await getCollection();
      const items = await collection.find().toArray();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    const itemId = req.params.id;
    
    try {
      const collection = await getCollection();
      const item = await collection.findOne({ _id: new ObjectID(itemId) });
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: 'El objeto no fue encontrado' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  router.put('/:id', async (req, res) => {
    const itemId = req.params.id;
    const updatedItem = req.body;
    
    try {
      const collection = await getCollection();
      const result = await collection.replaceOne({ _id: new ObjectID(itemId) }, updatedItem);
      if (result.modifiedCount === 1) {
        res.json(updatedItem);
      } else {
        res.status(404).json({ error: 'El objeto no fue encontrado' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  router.delete('/:id', async (req, res) => {
    const itemId = req.params.id;
    
    try {
      const collection = await getCollection();
      const result = await collection.deleteOne({ _id: new ObjectID(itemId) });
      if (result.deletedCount === 1) {
        res.json({ message: 'El objeto se ha eliminado' });
      } else {
        res.status(404).json({ error: 'El objeto no fue encontrado' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
