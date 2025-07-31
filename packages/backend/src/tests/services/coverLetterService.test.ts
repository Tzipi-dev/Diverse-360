import { generateCoverLetterFromResume } from '../../services/coverLetterService';
import { parseResumeText } from '../../services/pdfUtils';
import { Job } from '../../models/JobModel';

// ניצור משתנה ל־mock של create
let mockCreate: jest.Mock;

jest.mock('openai', () => {
  mockCreate = jest.fn();
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate
        }
      }
    }))
  };
});

jest.mock('../../services/pdfUtils');

describe('generateCoverLetterFromResume', () => {
  const mockParsedText = 'ניסיון בעיצוב אתרים ופיתוח תוכנה';
  const mockJob: Job = {
    id: '1',
    title: 'Frontend Developer',
    description: 'פיתוח React',
    requirements: 'שנתיים ניסיון',
    location: 'Tel Aviv',
    createdAt: new Date(),
    isActive: true,
    workMode: 'Hybrid'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (parseResumeText as jest.Mock).mockResolvedValue(mockParsedText);
  });

  it('מחזיר את המכתב המקדים שנוצר', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'מכתב מקדים מוכן' } }]
    });

    const buffer = Buffer.from('pdf content');
    const result = await generateCoverLetterFromResume(buffer, mockJob);
    expect(result).toBe('מכתב מקדים מוכן');
    expect(parseResumeText).toHaveBeenCalledWith(buffer);
    expect(mockCreate).toHaveBeenCalled();
  });

  it('זורק שגיאה אם אין תשובה תקינה', async () => {
    mockCreate.mockResolvedValue({ choices: [] });

    await expect(generateCoverLetterFromResume(Buffer.from(''), mockJob))
      .rejects
      .toThrow('לא התקבלה תגובה תקינה מ־GPT');
  });
});
