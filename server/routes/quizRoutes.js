import { Router } from "express";
import { MongoClient } from "mongodb";
import { verifyToken } from "../authMiddleware.js";

import dotenv from "dotenv";

const quizRoutes = Router();
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

const client = new MongoClient(MONGO_URI);

quizRoutes.get("/availableQuizzes", async (req, res) => {
  client.connect();
  const db = client.db(DB_NAME);

  try {
    const collection = db.collection("quizzess");
    const data = await collection.find().toArray();

    let dataFound = [];

    for (let d in data) {
      dataFound.push(data[d].quizTitle);
    }

    res.send(dataFound);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

quizRoutes.get("/getQuizData/:quizTitle", verifyToken, async (req, res) => {
  client.connect();
  const db = client.db(DB_NAME);

  try {
    const collection = db.collection("quizzess");
    const data = await collection.find().toArray();

    let dataFound;
    for (let d in data) {
      if (req.params.quizTitle === data[d].quizTitle) {
        dataFound = data[d];
      }
    }

    res.send(dataFound);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

quizRoutes.put("/updateScore", async (req, res) => {
  client.connect();
  const db = client.db(DB_NAME);

  try {
    const collection = db.collection("studentsData");
    const student = await collection.findOne({ userID: req.body.userID });

    if (student && student.scores) {
      // Get the length of the 'scores' array
      const scoresLength = student.scores.length;

      // Now perform the $push operation with the new score and calculated id
      await collection.updateOne(
        { userID: req.body.userID },
        {
          $push: {
            scores: { id: scoresLength + 1, score: req.body.score },
          },
        }
      );
    }
    // const updataScore = await collection.updateOne(
    //   { userID: req.body.userID },
    //   { $push: { scores: { id: scores.length + 1, score: req.body.score } } }
    // );
    res.status(201).json([student, req.body]);
    console.log(req.body);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

export default quizRoutes;
