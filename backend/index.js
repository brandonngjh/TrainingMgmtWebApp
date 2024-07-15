import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRoutes from "./routes/routes.js";
import loginRoutes from "./routes/loginRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Option 2: Allow Custom Origins
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })
// );

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("Welcome To Training Management App");
});

app.use("/api", mainRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/login", loginRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
