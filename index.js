const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
app.use(express.json());
const port = process.env.PORT;

app.get("/", (req, res, next) => {
  res.send("server is running well");
});

// config mongodb
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.yfdgs6q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const BookCollection = client.db("bookfee").collection("books");

    app.post("/addBooks", async (req, res, next) => {
      const doc = req.body;
      console.log(doc);

      //   const result = await BookCollection.insertOne(doc);
      //   console.log(`A document was inserted with _id: ${result.insertedId}`);
    });

    app.get("/allBooks", async (req, res, next) => {});

    app.delete("/deleteBook", (req, res, next) => {});
    app.patch("/editBooks/:id", async (req, res, next) => {});
    app.post("/user", async (req, res, next) => {});
    app.delete("/deleteUser/:id", async (req, res, next) => {});
    app.post("/userReview/:email", async (req, res, next) => {});
    app.delete("/deleteUserReview/:id", async (req, res, next) => {});
    app.get("/usersReview/:email", async (req, res, next) => {});
    app.patch("/usersReview/:email", async (req, res, next) => {});
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
