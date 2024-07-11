import express from 'express';

const router = express.Router();

router.get('/trainings', async (req, res) => {
  res.send('Training route');
});

export default router;