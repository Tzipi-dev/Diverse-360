import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Job",
    "Resume",
    "Course",
    "Forum",
    "User",
    "AdminJob",
    "ForumMessage",
    "ThreadMessages",
    "InfoCarousel",
    "ProjectCarousel",
    "LogoCarousel",
    "CourseVideo",
    "Comments",
    "forumView",
    "ScreenTime",
    "TipesCarousel",
  ],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getExample: builder.query<{ data: string }, void>({
      query: () => "/example",
    }),
  }),
});

export const { useGetExampleQuery } = apiSlice;
export default apiSlice;
