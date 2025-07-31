// tests/courseService.test.ts
import { courseService } from '../../services/CourseService';
import { supabase } from '../../config/supabaseConfig';
import { videoService } from '../../services/videoService';

jest.mock('../config/supabaseConfig', () => ({
  supabase: {
    from: jest.fn(() => supabaseMock)
  }
}));

jest.mock('../services/videoService', () => ({
  videoService: {
    deleteVideosByCourseId: jest.fn()
  }
}));

const selectMock = jest.fn();
const insertMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();

const supabaseMock = {
  select: selectMock,
  ilike: selectMock,
  eq: selectMock,
  insert: insertMock,
  update: updateMock,
  delete: deleteMock,
};

describe('courseService', () => {
  afterEach(() => jest.clearAllMocks());

  it('getAllCourses returns course list', async () => {
    selectMock.mockResolvedValue({ data: [{ title: 'Test' }], error: null });
    const result = await courseService.getAllCourses();
    expect(result[0].title).toBe('Test');
  });

  it('getCourseByName returns course', async () => {
    selectMock.mockResolvedValue({ data: [{ title: 'Math' }], error: null });
    const result = await courseService.getCourseByName('Math');
    expect(result?.title).toBe('Math');
  });

  it('getCoursesBySubject returns list', async () => {
    selectMock.mockResolvedValue({ data: [{ subject: 'Physics' }], error: null });
    const result = await courseService.getCoursesBySubject('Physics');
    expect(result[0].subject).toBe('Physics');
  });

  it('getCoursesByCategory returns list', async () => {
    selectMock.mockResolvedValue({ data: [{ category: 'Math' }], error: null });
    const result = await courseService.getCoursesByCategory('Math');
    expect(result[0].subject).toBe('Math');
  });

  it('getCoursesByLecturer returns list', async () => {
    selectMock.mockResolvedValue({ data: [{ lecturer: 'John' }], error: null });
    const result = await courseService.getCoursesByLecturer('John');
    expect(result[0].lecturer).toBe('John');
  });

  it('createCourse inserts course', async () => {
    insertMock.mockResolvedValue({ data: [{ id: '1' }], error: null });
    const result = await courseService.createCourse({ id: '1', title: 'Test' } as any);
    expect(result[0].id).toBe('1');
  });

  it('updateCourse updates and returns course', async () => {
    updateMock.mockResolvedValue({ data: [{ id: '1', title: 'Updated' }], error: null });
    const result = await courseService.updateCourse('1', { title: 'Updated' });
    expect(result.title).toBe('Updated');
  });

  it('deleteCourse deletes videos and course', async () => {
    deleteMock.mockResolvedValue({ error: null });
    const result = await courseService.deleteCourse('1');
    expect(result).toBe(true);
    expect(videoService.deleteVideosByCourseId).toHaveBeenCalledWith('1');
  });
});
