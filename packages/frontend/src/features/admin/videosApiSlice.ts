import apiSlice from "../../app/apiSlice";
import { CourseVideo } from "../../types/coursesTypes"; // הגדר טיפוס מתאים לוידאו
const videosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideosByCourseId: builder.query<CourseVideo[], string>({
      query: (course_id) => `/api/videos/by-course/${course_id}`,
      providesTags: (result, error, course_id) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "CourseVideo" as const, id })),
              { type: "CourseVideo", id: `COURSE_${course_id}` },
            ]
          : [{ type: "CourseVideo", id: `COURSE_${course_id}` }],
    }),

    getVideoById: builder.query<CourseVideo, string>({
      query: (id) => `/api/videos/${id}`,
      providesTags: (result, error, id) => [{ type: "CourseVideo", id }],
    }),

    createVideo: builder.mutation<CourseVideo, FormData>({
      query: (formData) => ({
        url: "/api/videos",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CourseVideo"],
    }),

  updateVideo: builder.mutation<CourseVideo, { id: string; formData: FormData }>({
  query: ({ id, formData }) => ({
    url: `/api/videos/${id}`,
    method: "PUT",
    body: formData,
  }),
  invalidatesTags:  ["CourseVideo"],
}),

    deleteVideo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/videos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "CourseVideo", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVideosByCourseIdQuery,
  useGetVideoByIdQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} = videosApiSlice;

export default videosApiSlice;
