import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/store';
import VideoReveal from '../components/fileActions';

import * as videosApi from '../../admin/videosApiSlice';
import * as commentsApi from 'features/comments/commentsApi';

// דמה קורס
const mockCourse = {
  id: '1',
  title: 'קורס לבדיקה',
  description: 'תיאור הקורס לבדיקה',
  imageUrl: '',
  subject: 'React',
  lecturer: 'ישראל ישראלי',
  uploadedAt: new Date(),
};

// דמה וידאו
const mockVideos = [
  {
    id: 'v1',
    video_url: 'https://example.com/video.mp4',
  },
];

// דמה תגובות
const mockComments = [
  {
    id: 'c1',
    course_id: '1',
    text: 'זו תגובה לבדיקה',
    user_name: 'טסטרית',
    created_at: new Date().toISOString(),
  },
];

// mock להוקים
jest.mock('../../admin/videosApiSlice', () => ({
  useGetVideosByCourseIdQuery: jest.fn(),
}));

jest.mock('features/comments/commentsApi', () => ({
  useGetCommentsByCourseIdQuery: jest.fn(),
  useCreateCommentMutation: jest.fn(),
  useDeleteCommentMutation: jest.fn(),
}));

// mock ל-useLocation ו-useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      course: mockCourse,
    },
  }),
  useNavigate: () => jest.fn(),
}));

describe('VideoReveal', () => {
  beforeEach(() => {
    // מגדיר את ה-localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      id: 'u1',
      first_name: 'טסטרית',
    }));

    // מקשר את המוקים לפונקציות
    (videosApi.useGetVideosByCourseIdQuery as jest.Mock).mockReturnValue({
      data: mockVideos,
      isLoading: false,
      isError: false,
      isSuccess: true,
      refetch: jest.fn(),
    });

    (commentsApi.useGetCommentsByCourseIdQuery as jest.Mock).mockReturnValue({
      data: mockComments,
      isLoading: false,
      isError: false,
      isSuccess: true,
      refetch: jest.fn(),
    });

    (commentsApi.useCreateCommentMutation as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue({}),
    ]);

    (commentsApi.useDeleteCommentMutation as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue({}),
    ]);
  });

  it('מציג את כותרת הקורס, תיאור ותגובה', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <VideoReveal />
        </MemoryRouter>
      </Provider>
    );

    // ווידוא שהתוכן מוצג
    expect(await screen.findByText('קורס לבדיקה')).toBeInTheDocument();
    expect(screen.getByText('תיאור הקורס לבדיקה')).toBeInTheDocument();
    expect(screen.getByText('זו תגובה לבדיקה')).toBeInTheDocument();
  });
});
