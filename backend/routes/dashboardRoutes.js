import express from 'express';

const router = express.Router();

router.get('/home', async (req, res) => {
  res.send('Dashboard route');
});

export default router;
