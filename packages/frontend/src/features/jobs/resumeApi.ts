import apiSlice from "../../app/apiSlice";
import { Resume } from '../../../../backend/src/models/ResumeModel'; // ייבוא ה-interface החדש של Resume
import { Job } from "../../types/jobsTypes"; // ודאי שהנתיב נכון
export interface ResumeAnalysisResult {
    personal_info: {
        name?: string;
        email?: string;
        phone?: string;
    };
    summary?: string;
    skills: {
        technical?: string[];
        soft?: string[];
    };
    // שדה זה מגיע מהשיפורים האחרונים שלנו
    experience_level_extracted?: 'Junior' | 'Mid-level' | 'Senior' | 'Entry-level' | 'No experience' | 'Not specified';
    experience_summary?: {
        title?: string;
        company?: string;
        duration?: string;
        description_summary?: string;
    }[];
    education?: {
        degree?: string;
        institution?: string;
        year?: string;
    }[];
    languages?: string[];
    projects?: {
        name?: string;
        description?: string;
    }[];
    overall_feedback: {
        strengths?: string[];
        missing_critical_elements?: string[];
        unnecessary_content?: string[];
        structure_clarity?: string;
        suitability_for_software_dev?: string;
        suggestions_for_improvement?: string[];
    };
}
const resumeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadResume: builder.mutation<{ success?: boolean; file_path: string }, FormData>({
            query: (formData) => ({
                url: "/api/resumes/upload",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Resume"],
        }),
        getResumesByJobId: builder.query<Resume[], string>({
            query: (jobId) => `/api/resumes/job/${jobId}`, // הנתיב החדש שהגדרנו ב-backend
            providesTags: (result, error, jobId) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Resume' as const, id })),
                        { type: 'Resume', id: 'LIST' },
                    ]
                    : [{ type: 'Resume', id: 'LIST' }],
        }),
        getResumesByJob: builder.query<{ url: string }[], string>({
            query: (jobId) => `/resumes/${jobId}`,
            providesTags: ["Resume"],
        }),

        analyzeResume: builder.mutation<{ analysis: string, matchedJobs: Job[] }, FormData>({
            query: (formData) => ({
                url: "/api/analyze-resume",
                method: "POST",
                body: formData,
            }),
        }),

        generateCoverLetter: builder.mutation<{ content: string }, FormData>({
            query: (formData) => ({
                url: '/api/coverLetter',
                method: 'POST',
                body: formData,
            }),
        }),
        uploadCoverLetter: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/api/coverLetter/upload-cover-letter",
                method: "POST",
                body: formData,
            }),
        })
    }),
});

export const {
    useUploadResumeMutation,
    useGetResumesByJobIdQuery,
    useGetResumesByJobQuery,
    useAnalyzeResumeMutation,
    useGenerateCoverLetterMutation,
    useUploadCoverLetterMutation,
} = resumeApi;

export default resumeApi;
