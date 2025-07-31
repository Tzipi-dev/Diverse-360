import apiSlice from "../../app/apiSlice";
import { InfoItem } from "./homeTypes"; // שים לב: צריך גם לשנות את שם הקובץ בעתיד

const infoCarouselApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAllInfoCarousel: builder.query<InfoItem[], void>({
      query: () => "api/info-carousel",
      providesTags: ["InfoCarousel"],
    }),

    getIinfoCarouselById: builder.query<InfoItem, string>({
      query: (id) => `api/info-carousel/${id}`,
      providesTags: ["InfoCarousel"],
    }),

    getInfoCarouselByTitle: builder.query<InfoItem, string>({
      query: (title) => `api/info-carousel/title/${title}`,
      providesTags: ["InfoCarousel"],
    }),

createInfoCarousel: builder.mutation<InfoItem, InfoItem>({
  query: (newForum) => {
    const {id,created_at,updated_at,...InfoCarouselToInser} = newForum;
    return {
      url: "api/info-carousel",
      method: "POST",
      body: InfoCarouselToInser
    };
  },
  invalidatesTags: ["InfoCarousel"],
}),

    updateInfoCarousel: builder.mutation<InfoItem, InfoItem>({
      query: (infoCarousel) => {
        if (!infoCarousel.id) throw new Error("Missing _id in infoCarousel");
        return {
          url: `api/info-carousel/${infoCarousel.id}`,
          method: "PUT",
          body: infoCarousel,
        };
      },
      invalidatesTags: ["InfoCarousel"],
    }),

    deleteInfoCarousel: builder.mutation<void, string>({
      query: (id) => ({
        url: `api/info-carousel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InfoCarousel"],
    }),
  }),
});

export const {
  useGetAllInfoCarouselQuery,
  useGetIinfoCarouselByIdQuery,
  useGetInfoCarouselByTitleQuery,
  useCreateInfoCarouselMutation,
  useUpdateInfoCarouselMutation,
  useDeleteInfoCarouselMutation,
} = infoCarouselApiSlice;

export default infoCarouselApiSlice;
