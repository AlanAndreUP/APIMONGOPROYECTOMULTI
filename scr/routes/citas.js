
const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const collectionName = 'Citas';


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

      if (result.insertedId) {
        res.status(201).json(result.insertedId);
      } else {
        res.status(500).json({ error: 'Error en la inserción de datos' });
      }
    } catch (err) {
      console.error(err);
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
      const item = await collection.findOne({ IDCliente: itemId });
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: 'Objeto no encontrado' });
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
      const result = await collection.replaceOne({ IDCliente: itemId }, updatedItem);
      if (result) {
        res.json(updatedItem);
      } else {
        res.status(404).json({ error: 'Objeto no encontrado' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  router.delete('/:id', async (req, res) => {
    const itemId = req.params.id;
    
    try {
      const collection = await getCollection();
      const result = await collection.deleteOne({ IDCliente: itemId });
      if (result) {
        res.json({ message: 'El objeto fue eliminado' });
      } else {
        res.status(404).json({ error: 'Objeto no encontrado' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
