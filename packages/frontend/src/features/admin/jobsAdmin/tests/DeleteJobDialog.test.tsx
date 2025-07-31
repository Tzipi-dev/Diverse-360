
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteJobDialog from '../DeleteJobDialog'; // תקן נתיב אם צריך
import { useDeleteJobMutation } from '../adminJobsApi';

jest.mock('../adminJobsApi');

describe('DeleteJobDialog', () => {
  const mockOnClose = jest.fn();
  const mockAfterDelete = jest.fn();
  const mockDeleteJob = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDeleteJobMutation as jest.Mock).mockReturnValue([mockDeleteJob]);
  });

  it('renders dialog with correct text and buttons', () => {
    render(
      <DeleteJobDialog
        open={true}
        jobId="123"
        onClose={mockOnClose}
        afterDelete={mockAfterDelete}
      />
    );

    expect(screen.getByText('אישור מחיקה')).toBeInTheDocument();
    expect(screen.getByText('האם את בטוחה שברצונך למחוק את המשרה?')).toBeInTheDocument();
    expect(screen.getByText('ביטול')).toBeInTheDocument();
    expect(screen.getByText('מחק')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <DeleteJobDialog
        open={true}
        jobId="123"
        onClose={mockOnClose}
        afterDelete={mockAfterDelete}
      />
    );

    fireEvent.click(screen.getByText('ביטול'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls deleteJob and callbacks when confirm delete button clicked', async () => {
    mockDeleteJob.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({}),
    });

    render(
      <DeleteJobDialog
        open={true}
        jobId="123"
        onClose={mockOnClose}
        afterDelete={mockAfterDelete}
      />
    );

    fireEvent.click(screen.getByText('מחק'));

    await waitFor(() => {
      expect(mockDeleteJob).toHaveBeenCalledWith('123');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockAfterDelete).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call deleteJob if jobId is null', () => {
    render(
      <DeleteJobDialog
        open={true}
        jobId={null}
        onClose={mockOnClose}
        afterDelete={mockAfterDelete}
      />
    );

    fireEvent.click(screen.getByText('מחק'));

    expect(mockDeleteJob).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockAfterDelete).toHaveBeenCalledTimes(1);
  });

  it('shows alert on delete error', async () => {
    window.alert = jest.fn();
    mockDeleteJob.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(new Error('Failed')),
    });

    render(
      <DeleteJobDialog
        open={true}
        jobId="123"
        onClose={mockOnClose}
        afterDelete={mockAfterDelete}
      />
    );

    fireEvent.click(screen.getByText('מחק'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('שגיאה במחיקת משרה');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockAfterDelete).toHaveBeenCalledTimes(1);
    });
  });
});
