import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CourseCard from '../components/CourseCard';
import { BrowserRouter } from 'react-router-dom';
import { Course } from '../../../types/coursesTypes';

const mockCourse: Course = {
    title: 'React 101',
    description: 'Learn the basics of React',
    imageUrl: 'https://example.com/image.jpg',
    subject: 'Frontend',
    lecturer: 'John Doe',
    id: '',
    uploadedAt: new Date(),
    isActive: false
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CourseCard', () => {
  it('renders course title, description, subject and lecturer', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    
    expect(screen.getByText('React 101')).toBeInTheDocument();
    expect(screen.getByText('Learn the basics of React')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders image with correct src and alt', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('src', mockCourse.imageUrl);
    expect(img).toHaveAttribute('alt', mockCourse.title);
  });

  it('wraps the card in a link with correct path', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/courses/${encodeURIComponent(mockCourse.title)}`);
  });

  it('adds box shadow on image hover', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    const img = screen.getByRole('img');

    expect(img).toHaveStyle('box-shadow: none');

    fireEvent.mouseEnter(img);
    expect(img).toHaveStyle('box-shadow: 0 4px 10px rgba(0,0,0,0.3)');

    fireEvent.mouseLeave(img);
    expect(img).toHaveStyle('box-shadow: none');
  });
});
