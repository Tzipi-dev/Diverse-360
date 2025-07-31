import apiSlice from "../../app/apiSlice";
import { ProjectItem } from "./homeTypes"; // שים לב: צריך גם לשנות את שם הקובץ בעתיד

const projectCarouselApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAllProjectCarousel: builder.query<ProjectItem[], void>({
      query: () => "api/project-carousel",
      providesTags: ["ProjectCarousel"],
    }),

    getProjectCarouselById: builder.query<ProjectItem, string>({
      query: (id) => `api/project-carousel/${id}`,
      providesTags: ["ProjectCarousel"],
    }),

    getProjectCarouselByTitle: builder.query<ProjectItem, string>({
      query: (projectName) => `api/project-carousel/projectName/${projectName}`,
      providesTags: ["ProjectCarousel"],
    }),

createProjectCarousel: builder.mutation<ProjectItem, ProjectItem>({
  query: (newForum) => {
    const {id,created_at,updated_at,...ProjectCarouselToInser} = newForum;
    return {
      url: "api/project-carousel",
      method: "POST",
      body: ProjectCarouselToInser
    };
  },
  invalidatesTags: ["ProjectCarousel"],
}),

    updateProjectCarousel: builder.mutation<ProjectItem, ProjectItem>({
      query: (updateProjectCarousel) => ({
      url: `api/project-carousel/${updateProjectCarousel.id}`,
        method: "PUT",
        body: updateProjectCarousel,
      }),
      invalidatesTags: ["ProjectCarousel"],
    }),

    deleteProjectCarousel: builder.mutation<void, string>({
      query: (id) => ({
        url: `api/project-carousel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProjectCarousel"],
    }),
  }),
});

export const {
  useGetAllProjectCarouselQuery,
  useGetProjectCarouselByIdQuery,
  useGetProjectCarouselByTitleQuery,
  useCreateProjectCarouselMutation,
  useUpdateProjectCarouselMutation,
  useDeleteProjectCarouselMutation,
} = projectCarouselApiSlice;

export default projectCarouselApiSlice;
