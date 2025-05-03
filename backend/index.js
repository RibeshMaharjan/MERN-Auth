import express from "express";
import {configDotenv} from "dotenv";
import {connectDB} from "./db/connetDB.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";

configDotenv();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // allows us to parse the req as json
app.use(cookieParser()); // allows us to parse the cookies

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is listening to PORT:", PORT);
});