import express from 'express';
import request from 'supertest';
import coverLetterRouter from '../../routes/coverLetterRoute';
import * as controller from '../../controllers/CoverLetterController';

jest.mock('../../controllers/CoverLetterController', () => ({
  generateCoverLetter: jest.fn((req, res) => res.status(200).json({ ok: true }))
}));


const app = express();
app.use(express.json());
app.use('/', coverLetterRouter);

describe('coverLetterRoutes', () => {
  it('POST / קורא לפונקציה generateCoverLetter', async () => {
    const response = await request(app)
      .post('/')
      .field('job_id', '123')
      .attach('file', Buffer.from('pdf'), 'cv.pdf');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});
