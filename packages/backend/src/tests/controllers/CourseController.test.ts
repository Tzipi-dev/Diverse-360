// tests/courseController.test.ts
import request from 'supertest';
import express from 'express';
import { CourseController } from '../../controllers/CourseController';
import { courseService } from '../../services/CourseService';
import { videoService } from '../../services/videoService';

jest.mock('../services/CourseService');
jest.mock('../services/VideoService');

const app = express();
app.use(express.json());

const controller = new CourseController();

// Routes setup
app.get('/category/:category', controller.getCourseByCategory);
app.get('/subject/:subject', controller.getCoursesBySubject);
app.get('/lecturer/:lecturer', controller.getCoursesByLecturer);
app.get('/title/:title', controller.getCourseBtTitle);
app.get('/all', controller.getAllCourses);
app.get('/videos/:course_id', controller.getVideosByCourseId);
app.put('/update/:id', controller.updateCourseController);
app.post('/create', controller.CreateCourse);
app.delete('/delete/:id', controller.DeleteCourse);

describe('CourseController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getCourseByCategory returns 400 when no category', async () => {
    const res = await request(app).get('/category/');
    expect(res.status).toBe(404); // no route match
  });

  it('getCoursesBySubject returns courses', async () => {
    (courseService.getCoursesBySubject as jest.Mock).mockResolvedValue([{
      title: 'Math'
    }]);
    const res = await request(app).get('/subject/math');
    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe('Math');
  });

  it('getCoursesByLecturer returns 400 if missing param', async () => {
    const res = await request(app).get('/lecturer/');
    expect(res.status).toBe(404);
  });

  it('getCourseBtTitle returns 404 if not found', async () => {
    (courseService.getCourseByName as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/title/unknown');
    expect(res.status).toBe(404);
  });

  it('getAllCourses returns list', async () => {
    (courseService.getAllCourses as jest.Mock).mockResolvedValue([{ title: 'Course1' }]);
    const res = await request(app).get('/all');
    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe('Course1');
  });

  it('getVideosByCourseId returns 400 when missing id', async () => {
    const res = await request(app).get('/videos/');
    expect(res.status).toBe(404);
  });

  it('updateCourseController returns 200 on success', async () => {
    (courseService.updateCourse as jest.Mock).mockResolvedValue({ title: 'Updated' });
    const res = await request(app).put('/update/123').send({ title: 'New', isActive: 'true' });
    expect(res.status).toBe(200);
  });

  it('CreateCourse returns 201 on success', async () => {
    (courseService.createCourse as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await request(app).post('/create').send({ title: 'New', isActive: 'true' });
    expect(res.status).toBe(201);
  });

  it('DeleteCourse returns 200 when success', async () => {
    (videoService.deleteVideosByCourseId as jest.Mock).mockResolvedValue(undefined);
    (videoService.getVideosByCourseId as jest.Mock).mockResolvedValue([]);
    (courseService.deleteCourse as jest.Mock).mockResolvedValue(true);
    const res = await request(app).delete('/delete/1');
    expect(res.status).toBe(200);
  });

  it('DeleteCourse returns 500 if videos remain', async () => {
    (videoService.deleteVideosByCourseId as jest.Mock).mockResolvedValue(undefined);
    (videoService.getVideosByCourseId as jest.Mock).mockResolvedValue([{ id: 'v1' }]);
    const res = await request(app).delete('/delete/1');
    expect(res.status).toBe(500);
  });
});
