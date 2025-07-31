import { generateCoverLetter } from '../../controllers/CoverLetterController';
import { jobService } from '../../services/JobService';
import { generateCoverLetterFromResume } from '../../services/coverLetterService';

jest.mock('../../services/JobService');
jest.mock('../../services/coverLetterService');

describe('generateCoverLetter controller', () => {
  const mockRequest: any = {
    body: { job_id: '123' },
    file: { buffer: Buffer.from('pdf') }
  };
  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('מחזיר 200 עם המכתב המקדים', async () => {
    (jobService.getJobById as jest.Mock).mockResolvedValue({ id: '123' });
    (generateCoverLetterFromResume as jest.Mock).mockResolvedValue('מכתב מוכן');

    await generateCoverLetter(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ content: 'מכתב מוכן' });
  });

  it('מחזיר 400 אם חסר קובץ או job_id', async () => {
    await generateCoverLetter({ body: {}, file: null } as any, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });

  it('מחזיר 404 אם משרה לא נמצאה', async () => {
    (jobService.getJobById as jest.Mock).mockResolvedValue(null);

    await generateCoverLetter(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it('מחזיר 500 במקרה של שגיאה', async () => {
    (jobService.getJobById as jest.Mock).mockRejectedValue(new Error('שגיאת בדיקה'));
    await generateCoverLetter(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'שגיאת בדיקה' });
  });
});
