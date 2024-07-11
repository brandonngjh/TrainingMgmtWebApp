import express from "express";

const router = express.Router();

router.post("/login", async (req, res) => {
  res.send("Login route");
});

export default router;
