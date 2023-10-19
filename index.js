const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://allendodul6:DA8T1L9HjlzFaLHG@cluster0.bfzpc41.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db('resturentDB');
    const adsCollection = database.collection('ads');
    const productsCollection = database.collection('products');


    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);

      res.send(result);
    })

    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();

      res.send(result)
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await productsCollection.findOne(query);

      res.send(product);
    })

    app.post('/myCart/:userID', async (req, res) => {
      const userID = req.params.userID;
      const data = req.body;
      const userCartCollection = database.collection(userID);
      const result = await userCartCollection.insertOne(data);

      res.send(result)
    })

    app.get('/myCart/:userID', async (req, res) => {
      const userID = req.params.userID;
      const userCartCollection = database.collection(userID);
      const cursor = userCartCollection.find();
      const result = await cursor.toArray();

      res.send(result)
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          name: product.name,
          brandName: product.brandName,
          imageURL: product.imageURL,
          price: product.price,
          ratings: product.ratings,
          types: product.types,
          description: product.description
        }
      }
      const result = await productsCollection.updateOne(query, updateProduct, options)
      res.send(result)
    })

    app.get('/ads', async (req, res) => {
      const cursor = adsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Welcome to the resturent server.')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})