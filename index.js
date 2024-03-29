const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5002;

app.get("/", cors(), (req, res, next) => {
  res.send(`server is running well on port: ${process.env.PORT}`);
});

// config mongodbS
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
    const userCollection = client.db("bookfee").collection("user");
    const userOrderCollection = client.db("bookfee").collection("userOrder");

    // CONFIFG jwt token
    app.get("/jwt", cors(), async (req, res, next) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const user = await userCollection.findOne(query);

      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1h",
        });
        res.send({ accessToken: token });
      } else {
        res.status(403).send({ accessToken: "" });
      }
    });

    function verifyJWT(req, res, next) {
      const token = req?.headers?.authorization?.split(" ")[1];

      if (token) {
        next();
      } else {
        return res.status(401).send("Unauthorized request");
      }
    }

    // api to get all books added earlier
    app.get("/ab", cors(), async (req, res, next) => {
      res.send("all books all books");
    });

    // api to get all books Books Categories
    app.get("/booksCat", cors(), async (req, res, next) => {
      const query = {};
      const cursor = BooksCategories.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/category/:id", cors(), verifyJWT, async (req, res, next) => {
      const params = req.params.id;

      const query = { cat_id: params };

      // finding all books belongs to a cat
      const cursor = BookCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });
    // api to delete previously added books
    app.delete("/deleteBook", cors(), (req, res, next) => {});
    // api to edit single books details
    app.patch("/editBooks/:id", cors(), async (req, res, next) => {});

    // api to add single user details
    app.post("/user", cors(), verifyJWT, async (req, res, next) => {
      const doc = req.body;

      const result = await userCollection.insertOne(doc);
      res.send(result);
    });

    // get all user data
    app.get("/alluser", cors(), async (req, res, next) => {
      const query = {};
      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // update user details and activity

    app.post("/userOrder", cors(), async (req, res, next) => {
      const doc = req.body;
      const newId = doc.bookId;
      // const id = ObjectId(newId);
      const query = {
        bookId: newId,
      };
      const result = await userOrderCollection.findOne(query);
      // console.log(cursor);

      if (!result) {
        console.log("book id is not found");
        await userOrderCollection.insertOne(doc);
      } else {
        console.log("book is already sold");
      }
    });

    // current user details
    app.get("/currentUser/:email", cors(), verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = {
        email: email,
      };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // making an admin
    app.put("/user/admin/:id", cors(), verifyJWT, async (req, res) => {
      const email = req.headers.email;

      const query = {
        email: email,
      };

      const isAdmin = await userCollection.findOne(query);
      console.log(isAdmin.role);

      if (isAdmin.role === "admin") {
        const id = req.params.id;

        const filter = {
          _id: ObjectId(id),
        };
        const options = { upsert: true };

        const updatedDoc = {
          $set: {
            role: "admin",
          },
        };

        const result = await userCollection.updateOne(
          filter,
          updatedDoc,
          options
        );

        res.send(result);
      }
    });

    // api to add  user book by add product page
    app.post("/addBook", cors(), verifyJWT, async (req, res, next) => {
      console.log("doc");
      const doc = req.body;

      const result = await BookCollection.insertOne(doc);
      res.send(result);
    });

    // get my products by email
    app.get("/myproducts/:email", cors(), async (req, res) => {
      const email = req.params.email;

      const query = {
        sellerEmail: email,
      };

      const cursor = BookCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // making an advertise
    app.put("/advertise/:id", cors(), verifyJWT, async (req, res) => {
      const id = req.params.id;
      // console.log(id);

      const filter = {
        _id: ObjectId(id),
      };
      const options = { upsert: true };

      const updatedDoc = {
        $set: {
          advertise: "true",
        },
      };

      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      console.log(result);
      res.send(result);
    });

    // api to delete single user
    app.delete("/deleteUser/:id", cors(), verifyJWT, async (req, res, next) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id),
      };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
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

run().catch(console.log);

app.listen(port, () => console.log(`bookfee server running on ${port}`));
