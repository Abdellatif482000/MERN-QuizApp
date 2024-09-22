import { Router } from "express";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import { verifyToken } from "../authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const adminRoutes = Router();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const client = new MongoClient(MONGO_URI);

adminRoutes.post(
  "/createQuiz",
  (req, res, next) => {
    req.query.role === "admin" ? next() : res.status(401).send("no access");
  },
  verifyToken,
  async (req, res) => {
    client.connect();
    let db = client.db(DB_NAME);
    const collection = db.collection("quizzess");
    let { quizTitle, questions } = req.body;
    try {
      const data = await collection.insertOne({
        quizTitle: quizTitle,
        questions: questions,
      });
      console.log(collection);

      res
        .status(201)
        .json({ massage: `content created!`, data: req.body, res: data });
    } catch (err) {
      console.error(err);
    }
  }
);

adminRoutes.put(
  "/editQuiz",
  (req, res, next) => {
    req.query.role === "admin" ? next() : res.status(401).send("no access");
  },
  verifyToken,
  async (req, res) => {
    client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("quizzess");

    try {
      const updataQuiz = await collection.updateOne(
        { quizTitle: req.body.quizTitle },
        { $set: { questions: req.body.newArray } }
      );
      // const agg = await collection.aggregate({projection})

      res.status(201).json([updataQuiz, req.body]);
      console.log(req.body);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await client.close();
    }
  }
);
adminRoutes.delete(
  "/deleteQuiz",
  (req, res, next) => {
    req.query.role === "admin"
      ? next()
      : res.status(401).send("no access u  r not admin");
  },
  verifyToken,
  async (req, res) => {
    client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("quizzess");
    try {
      const deletedQuiz = await collection.deleteOne({
        quizTitle: req.query.quizTitle,
      });

      res.json([deletedQuiz, req.query]);
      console.log(deletedQuiz);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await client.close();
    }
  }
);
export default adminRoutes;
