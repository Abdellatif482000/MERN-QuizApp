import { Router, json } from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// import User from "../model/authModel";

const authRoutes = Router();
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const DB_NAME = process.env.DB_NAME;
const MONGO_URI = process.env.MONGO_URI;

authRoutes.use(cors());
authRoutes.use(json());

const client = new MongoClient(MONGO_URI);
const saltRounds = 10;

// mongoose.connect(MONGO_URI).then(() => console.log("mongoos Connected!"));

// console.log(User);

authRoutes.post("/signup", async (req, res) => {
  await client.connect();
  try {
    const { role, password, username, email } = req.body;
    let db = client.db(DB_NAME);
    let collection, IDPrefix;

    const hashedPass = await bcrypt.hash(password, saltRounds);

    if (role === "student" || role === "admin") {
      collection = db.collection(`${role}sData`);
      IDPrefix = role === "student" ? "std" : "admin";

      const collCount = await collection.countDocuments();
      const userID = `${IDPrefix}${2024}${collCount + 1}`;

      const newUser = {
        userID,
        username,
        email,
        password: hashedPass,
        role,
      };

      if (role === "student") {
        newUser.scores = [];
      }

      await collection.insertOne(newUser);
    }
    res.status(200).send("data inserted");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

authRoutes.post("/signin", async (req, res) => {
  try {
    await client.connect();

    const { role, password, userID } = req.body;
    let db = client.db(DB_NAME);
    let collection;

    if (role === "student" || role === "admin") {
      collection = db.collection(`${role}sData`);
    }
    const signinData = await collection.findOne({ userID: userID });
    console.log(signinData);
    const matchPass = await bcrypt.compare(password, signinData.password);
    if (signinData) {
      if (matchPass) {
        const token = jwt.sign({ ID: req.body.ID }, JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).send({ token, signinData });
      } else {
        res.send("not valid pass");
      }
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

export default authRoutes;
