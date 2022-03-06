const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zetdm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("bookStore");
    const bookCollection = database.collection("allBook");
    const orderCollection = database.collection("orderedBook");

    //   All Book Get API
    app.get("/", async (req, res) => {
      const data = bookCollection.find({});
      const result = await data.toArray();
      res.json(result);
    });

    // Order book POST API
    app.post("/order", async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.json(result);
    });
    // Order Book GET Api
    app.get("/order", async (req, res) => {
      const data = orderCollection.find({});
      const result = await data.toArray();
      res.json(result);
    });
    // Order Book DELETE Api
    app.delete("/order/:id", async (req, res) => {
      const id = req.params;
      const find = orderCollection.findOne({ _id: ObjectId(id) });
      const result = await orderCollection.deleteOne(find);
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
