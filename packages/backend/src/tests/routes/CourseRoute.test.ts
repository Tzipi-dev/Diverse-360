// tests/courseRouter.test.ts
import request from 'supertest';
import express from 'express';
import courseRouter from '../../routes/CourseRoute';
import { courseService } from '../../services/CourseService';
import { videoService } from '../../services/videoService';

jest.mock('../services/CourseService');
jest.mock('../services/VideoService');

const app = express();
app.use(express.json());
app.use('/', courseRouter);

describe('courseRouter integration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET / returns all courses', async () => {
    (courseService.getAllCourses as jest.Mock).mockResolvedValue([{ id: '1', title: 'Test Course' }]);
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe('Test Course');
  });

  it('GET /subject/:subject returns subject courses', async () => {
    (courseService.getCoursesBySubject as jest.Mock).mockResolvedValue([{ subject: 'Math' }]);
    const res = await request(app).get('/subject/math');
    expect(res.status).toBe(200);
    expect(res.body[0].subject).toBe('Math');
  });

  it('GET /lecturer/:lecturer returns lecturer courses', async () => {
    (courseService.getCoursesByLecturer as jest.Mock).mockResolvedValue([{ lecturer: 'Tzipi' }]);
    const res = await request(app).get('/lecturer/Tzipi');
    expect(res.status).toBe(200);
    expect(res.body[0].lecturer).toBe('Tzipi');
  });

  it('GET /:title returns course by title', async () => {
    (courseService.getCourseByName as jest.Mock).mockResolvedValue({ title: 'React' });
    const res = await request(app).get('/React');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('React');
  });

  it('PUT /:id updates course', async () => {
    (courseService.updateCourse as jest.Mock).mockResolvedValue({ id: '1', title: 'Updated' });
    const res = await request(app)
      .put('/1')
      .send({ title: 'Updated', isActive: 'true' });
    expect(res.status).toBe(200);
  });

  it('POST / creates a course', async () => {
    (courseService.createCourse as jest.Mock).mockResolvedValue({ id: '1', title: 'New' });
    const res = await request(app)
      .post('/')
      .send({ title: 'New', isActive: 'true' });
    expect(res.status).toBe(201);
  });

  it('DELETE /:id deletes a course and its videos', async () => {
    (videoService.deleteVideosByCourseId as jest.Mock).mockResolvedValue(undefined);
    (videoService.getVideosByCourseId as jest.Mock).mockResolvedValue([]);
    (courseService.deleteCourse as jest.Mock).mockResolvedValue(true);
    const res = await request(app).delete('/1');
    expect(res.status).toBe(200);
  });
});
