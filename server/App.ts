import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import multer from "multer";
import mysql from "mysql";
import AuthRoutes from "./src/routes/Auth";
import VacationRoutes from "./src/routes/Vacation";
import followerRoutes from "./src/routes/Follow";
import logic from "./src/logic/MysqlTableLogic";
import {
  createVacation,
  updateVacationController,
} from "./src/controllers/Vacation";
import { verifyToken } from "./src/middlewares/Auth";

dotenv.config();

if (!process.env.DB_PORT) {
  console.error("Missing DB_PORT!!!");
  process.exit(1);
}

const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

app.post("/vacations/", verifyToken, upload.single("image"), createVacation);
app.put(
  "/vacations/:id",
  verifyToken,
  upload.single("image"),
  updateVacationController
);

app.use("/auth", AuthRoutes);
app.use("/vacations", VacationRoutes);
app.use("/follows", followerRoutes);

logic.createFollowsTable();
logic.createVacationsTable();
logic.createUsersTable();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to Db", err);
    return;
  }
  console.log("Connection established");

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
});
