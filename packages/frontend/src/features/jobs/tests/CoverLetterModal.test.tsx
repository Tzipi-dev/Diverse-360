import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CoverLetterModal from '../../jobs/components/CoverLetterModal';

jest.mock('../../../utils/printCoverLetter', () => ({
  printCoverLetter: jest.fn(),
}));

describe('CoverLetterModal', () => {
  const mockOnClose = jest.fn();
  const mockOnChange = jest.fn();
  const mockContent = 'תוכן טסט';
  const mockJobTitle = 'מפתח פרונט';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('מציג את הטקסט והכותרת', () => {
    render(
      <CoverLetterModal
        content={mockContent}
        onClose={mockOnClose}
        onChange={mockOnChange}
        jobTitle={mockJobTitle}
        jobId="123"
        userId="456"
      />
    );

    // בודק שהכותרת מופיעה
    expect(screen.getByText('טיוטת מכתב מקדים')).toBeInTheDocument();

    // בודק שהטקסט מוצג בטקסטאריה
    expect(screen.getByDisplayValue(mockContent)).toBeInTheDocument();
  });

  it('מעדכן תוכן כאשר כותבים בטקסטאריה', () => {
    render(
      <CoverLetterModal
        content={mockContent}
        onClose={mockOnClose}
        onChange={mockOnChange}
        jobTitle={mockJobTitle}
        jobId="123"
        userId="456"
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'טקסט חדש' } });

    expect(mockOnChange).toHaveBeenCalledWith('טקסט חדש');
  });

  it('קורא לפונקציה printCoverLetter בלחיצה על הכפתור', () => {
    const { printCoverLetter } = require('../../../utils/printCoverLetter');

    render(
      <CoverLetterModal
        content={mockContent}
        onClose={mockOnClose}
        onChange={mockOnChange}
        jobTitle={mockJobTitle}
        jobId="123"
        userId="456"
      />
    );

    fireEvent.click(screen.getByText('הדפס / תצוגה'));

    expect(printCoverLetter).toHaveBeenCalledWith(mockContent, mockJobTitle);
  });

  it('סוגר את המודאל בלחיצה על כפתור סגור', () => {
    render(
      <CoverLetterModal
        content={mockContent}
        onClose={mockOnClose}
        onChange={mockOnChange}
        jobTitle={mockJobTitle}
        jobId="123"
        userId="456"
      />
    );

    fireEvent.click(screen.getByText('סגור'));

    expect(mockOnClose).toHaveBeenCalled();
  });
});