const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
app.use(cors());
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
    const BooksCategories = client.db("bookfee").collection("books-cat");
    // api to add books by user or admin
    app.post("/addBooks", async (req, res, next) => {
      const doc = req.body;
      console.log(doc);
    });

    // api to get all books added earlier
    app.get("/allBooks", async (req, res, next) => {});

    // api to get all books Books Categories
    app.get("/booksCat", async (req, res, next) => {
      const query = {};
      const cursor = BooksCategories.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // api to delete previously added books
    app.delete("/deleteBook", (req, res, next) => {});
    // api to edit single books details
    app.patch("/editBooks/:id", async (req, res, next) => {});
    // api to add single user details
    app.post("/user", async (req, res, next) => {});
    // api to delete single user
    app.delete("/deleteUser/:id", async (req, res, next) => {});
    // api to add single user single review
    app.post("/userReview/:email", async (req, res, next) => {});
    // api to delete single user single review
    app.delete("/deleteUserReview/:id", async (req, res, next) => {});
    // api to get all review based on email or emails
    app.get("/usersReview/:email", async (req, res, next) => {});
    // api to edit single user single Review
    app.patch("/usersReview/:email", async (req, res, next) => {});
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
