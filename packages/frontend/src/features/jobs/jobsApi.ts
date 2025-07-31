
import apiSlice from "../../app/apiSlice";
import { Job } from "../../types/jobsTypes";
const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobs: builder.query<Job[], void>({
      query: () => "/jobs",
      providesTags: ["Job"],
    }),

    getJobById: builder.query<Job, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: ["Job"],
    }),
    createJob: builder.mutation<
      Job,
      Pick<Job, "title" | "description" | "location" | "requirements">
    >({
      query: (newJob) => ({
        url: "/jobs",
        method: "POST",
        body: newJob,
      }),
      invalidatesTags: ["Job"],
    }),
    updateJob: builder.mutation<Job, Job>({
      query: (updateJob) => ({
        url: `/jobs/${updateJob.id}`,
        method: "PUT",
        body: updateJob,
      }),
      invalidatesTags: ["Job"],
    }),
    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),

    getFilteredJobs: builder.query<
      Job[],
      {
        search?: string;
        field?: string;
        jobType?: string;
        location?: string;
        dateFrom?: string;
      }
    >({
      query: (params) => {
        const queryString = new URLSearchParams(
          params as Record<string, string>
        ).toString();
        return `/jobs/filter?${queryString}`;
      },
      providesTags: ["Job"],
    }),
    getJobsWithPagination: builder.query<Job[], number | void>({
      query: (page = 0) => `/jobs?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Job" as const, id })),
              { type: "Job", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Job", id: "PARTIAL-LIST" }],
    }),
    getMatchingCandidates: builder.query<
      { id: string; name: string; resumeUrl: string; score: number }[],
      string
    >({
      query: (jobId) => `/jobs/${jobId}/matching-candidates`,
    }),
  }),
});
export const {

  useGetJobsWithPaginationQuery,
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetFilteredJobsQuery,
  useLazyGetFilteredJobsQuery,
  useGetMatchingCandidatesQuery,
} = jobApiSlice;

export default jobApiSlice;