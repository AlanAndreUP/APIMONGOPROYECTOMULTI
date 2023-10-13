const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

const uri = "mongodb+srv://223208:Jaguares34.1@cluster0.swir3km.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Se ha conectado exitosamente a la base de datos de Mongo");
  } catch (err) {
    console.error(err + "Error en la conexión con la base de datos");
  }
}

run().catch(console.dir);

app.use(express.json());
const apiRouter = require('./routes/citas')(client);
app.use('/citas', apiRouter);
const apiRouterClientes = require('./routes/clientes')(client);
app.use('/clientes', apiRouterClientes);
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
