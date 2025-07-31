import apiSlice from "../../app/apiSlice";
import { TipesItem } from "./homeTypes";

const TipesCarouselApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTipesCarousel: builder.query<TipesItem[], void>({
      query: () => "api/tipes-carousel",
      providesTags: ["TipesCarousel"],
    }),

    getTipesCarousel: builder.query<TipesItem, string>({
      query: (id) => `api/tipes-carousel/${id}`,
      providesTags: ["TipesCarousel"],
    }),

    getTipesCarouselByTitle: builder.query<TipesItem, string>({
      query: (title) => `api/tipes-carousel/title/${title}`,
      providesTags: ["TipesCarousel"],
    }),

    createTipesCarousel: builder.mutation<TipesItem, TipesItem>({
      query: (newForum) => {
        const { id, created_at, updated_at, ...TipesCarouselToInser } = newForum;
        return {
          url: "api/tipes-carousel",
          method: "POST",
          body: TipesCarouselToInser,
        };
      },
      invalidatesTags: ["TipesCarousel"],
    }),

    updateTipesCarousel: builder.mutation<TipesItem, TipesItem>({
      query: (TipesCarousel) => {
        if (!TipesCarousel.id) throw new Error("Missing _id in infoCarousel");
        return {
          url: `api/tipes-carousel/${TipesCarousel.id}`,
          method: "PUT",
          body: TipesCarousel,
        };
      },
      invalidatesTags: ["TipesCarousel"],
    }),

    deleteTipesCarousel: builder.mutation<void, string>({
      query: (id) => ({
        url: `api/tipes-carousel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TipesCarousel"],
    }),
  }),
});

export const {
  useGetAllTipesCarouselQuery,
  useGetTipesCarouselQuery,
  useGetTipesCarouselByTitleQuery,
  useCreateTipesCarouselMutation,
  useUpdateTipesCarouselMutation,
  useDeleteTipesCarouselMutation,
} = TipesCarouselApiSlice;

export default TipesCarouselApiSlice;
