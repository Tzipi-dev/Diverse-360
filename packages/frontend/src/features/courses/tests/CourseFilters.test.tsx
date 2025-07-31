import React from 'react';
import { render, screen } from '@testing-library/react';
import CourseFilters from '../components/CourseFilters';

describe('CourseFilters component', () => {
  it('renders without crashing', () => {
    render(<CourseFilters />);
    const container = screen.getByRole('region', { name: /filters/i });
    expect(container).toBeInTheDocument();
  });
});