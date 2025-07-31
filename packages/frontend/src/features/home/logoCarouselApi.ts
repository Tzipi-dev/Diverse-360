import apiSlice from "../../app/apiSlice";
import { LogoItem } from "./homeTypes"; // שים לב: צריך גם לשנות את שם הקובץ בעתיד

const logoCarouselApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAllLogoCarousel: builder.query<LogoItem[], void>({
      query: () => "api/logo-carousel",
      providesTags: ["LogoCarousel"],
    }),

    getLogoCarouselById: builder.query<LogoItem, string>({
      query: (id) => `api/logo-carousel/id/${id}`,
      providesTags: ["LogoCarousel"],
    }),
    getLogoCarouselByName: builder.query<LogoItem, string>({
        query: (name) => `api/logo-carousel/name/${name}`,
        providesTags: ["LogoCarousel"],
      }),

    createLogoCarousel: builder.mutation<LogoItem, LogoItem>({
     query: (newForum) => {
        const {id,created_at,...LogoCarouselToInser} = newForum;
        return {
        url: "api/logo-carousel",
        method: "POST",
        body: LogoCarouselToInser
        };
    },
  invalidatesTags: ["LogoCarousel"],
}),

    deleteLogoCarousel: builder.mutation<void, string>({
      query: (id) => ({
        url: `api/logo-carousel/id/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LogoCarousel"],
    }),

    updateLogoCarousel: builder.mutation<LogoItem, LogoItem>({
        query: (logoCarousel) => {
          if (!logoCarousel.id) throw new Error("Missing _id in logoCarousel");
          return {
            url: `api/logo-carousel/id/${logoCarousel.id}`,
            method: "PUT",
            body: logoCarousel,
          };
        },
        invalidatesTags: ["LogoCarousel"],
    }),
  }),
});

export const {
  useGetAllLogoCarouselQuery,
  useGetLogoCarouselByIdQuery,
  useGetLogoCarouselByNameQuery,
  useCreateLogoCarouselMutation,
  useDeleteLogoCarouselMutation,
  useUpdateLogoCarouselMutation,
} = logoCarouselApiSlice;

export default logoCarouselApiSlice;
