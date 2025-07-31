import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Job } from '../../../../src/types/jobsTypes';

export const adminJobsApi = createApi({
  reducerPath: 'adminJobsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  tagTypes: ['AdminJob'],
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], void>({
      query: () => '/jobs',
      providesTags: ['AdminJob'],
    }),

    getMatchingCandidates: builder.query<
      {
        fullName: string; id: string; name?: string; resumeUrl: string; score: number 
}[],
      string
    >({
      query: (jobId) => `/jobs/${jobId}/matching-candidates`,
    }),

    deleteJob: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminJob'],
    }),

    updateJob: builder.mutation<Job, { id: string; updatedData: Partial<Job> }>({
      query: ({ id, updatedData }) => ({
        url: `/jobs/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['AdminJob'],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetMatchingCandidatesQuery,
  useDeleteJobMutation,
  useUpdateJobMutation,
} = adminJobsApi;
