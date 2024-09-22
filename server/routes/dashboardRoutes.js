import { Router } from "express";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import { verifyToken } from "../authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const dashboardRoutes = Router();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const client = new MongoClient(MONGO_URI);

dashboardRoutes.get("/dashboard", verifyToken, async (req, res) => {
  client.connect();
  let db = client.db(DB_NAME);
  const { role } = req.query;
  if (role === "student" || role === "admin") {
    res.status(200).json({
      message: `You have accessed a protected route as a ${role}!`,
    });
  }
});
dashboardRoutes.get("/stats", verifyToken, async (req, res) => {
  client.connect();
  let db = client.db(DB_NAME);
  const { role, ID } = req.query;

  try {
    const collection = db.collection("studentsData");

    if (role === "student") {
      const getStats = await collection.findOne({ userID: ID });

      res.status(200).json(getStats.scores);
    }

    if (role === "admin") {
      const getStats = await collection.find().toArray();

      let allScores = [];
      for (let s in getStats) {
        allScores.push({ ID: getStats[s].userID, scores: getStats[s].scores });
      }
      res.status(200).json(allScores);
    }
  } catch (error) {
    res.status(401).send(error);
  }
});

export default dashboardRoutes;
