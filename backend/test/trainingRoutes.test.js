import request from 'supertest';
import express from 'express';
import trainingRoutes from '../routes/trainingRoutes';

jest.mock('../database/trainingDatabase', () => ({
  getTrainings: jest.fn(),
  getTrainingByID: jest.fn(),
  createTraining: jest.fn(),
  deleteTraining: jest.fn(),
  updateTraining: jest.fn(),
}));

import {
  getTrainings,
  getTrainingByID,
  createTraining,
  deleteTraining,
  updateTraining,
} from '../database/trainingDatabase';

jest.mock('../middleware/middleware.js', () => ({
  protect: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/trainings', trainingRoutes);

describe('Integration Test: Training Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /trainings - should fetch all trainings', async () => {
    const mockTrainings = [{ id: 1, title: 'Safety Training' }];
    getTrainings.mockResolvedValue(mockTrainings);
    const res = await request(app).get('/trainings');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTrainings);
  });

  test('GET /trainings/:id - should fetch a training by ID', async () => {
    const mockTraining = { id: 1, title: 'Safety Training' };
    getTrainingByID.mockResolvedValue(mockTraining);
    const res = await request(app).get('/trainings/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTraining);
  });

  test('POST /trainings - should create a new training', async () => {
    const mockTraining = { id: 1, title: 'Safety Training' };
    createTraining.mockResolvedValue(mockTraining);
    const res = await request(app).post('/trainings').send({
      title: 'Safety Training',
      description: 'Safety procedures',
      validity_period: '365',
      training_provider: 'Provider A',
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockTraining);
  });

  test('DELETE /trainings/:id - should delete a training', async () => {
    deleteTraining.mockResolvedValue('Delete Successful');
    const res = await request(app).delete('/trainings/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Delete Successful' });
  });

  test('PUT /trainings/:id - should update a training', async () => {
    const mockTraining = { id: 1, title: 'Safety Training' };
    updateTraining.mockResolvedValue(mockTraining);
    const res = await request(app).put('/trainings/1').send({
      title: 'Safety Training',
      description: 'Safety procedures',
      validity_period: '365',
      training_provider: 'Provider A',
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTraining);
  });
});
