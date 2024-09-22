import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcryptjs";
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    // const token = authHeader.split("")[1];
    if (!token) {
        res.status(401).json("notoken");
    }

    try {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            // if (err) return res.send(err);

            req.user = user;
            next();
        });
    } catch (err) {
        console.error(err);

        return res.status(401).send("notoken");
    }
};