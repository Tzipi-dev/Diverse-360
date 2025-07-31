import apiSlice from "../../app/apiSlice";
import { Forum, ForumView } from "./forumTypes";

interface ForumListResponse {
  data: Forum[];
  total: number;
}

const forumApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAllForums: builder.query<ForumListResponse, { limit: number; offset: number; userId: string, userRole: string }>({
      query: ({ limit, offset, userId,userRole }) => {
        return `api/forums?limit=${limit}&offset=${offset}&user_id=${userId}&userRole=${userRole}`;
      },
      providesTags: ["Forum"],
    }),

    getViewedForumViewsByUser: builder.query<ForumView[], string>({
      query: (userId) => `api/forums/viewed?user_id=${userId}`,
    }),


    markForumViewed: builder.mutation<void,
      { forum_id: string; user_id: string; viewed_at: string; was_opened: boolean }>({
        query: ({ forum_id, user_id, viewed_at, was_opened }) => ({
          url: "/api/forums/mark-viewed",
          method: "POST",
          body: { forum_id, user_id, viewed_at, was_opened },
        }),
        invalidatesTags: ["Forum"],
      }),

    getForumById: builder.query<Forum, string>({
      query: (id) => `api/forums/${id}`,
      providesTags: ["Forum"],
    }),

    getForumByTitle: builder.query<Forum, string>({
      query: (title) => `api/forums/title/${title}`,
      providesTags: ["Forum"],
    }),

    createForum: builder.mutation<Forum, Forum>({
      query: (newForum) => {
        const { id, created_at, updated_at, ...forumToInsert } = newForum;
        console.log("Trying to create forum with:", newForum);
        return {
          url: "api/forums",
          method: "POST",
          body: forumToInsert,
        };
      },
      invalidatesTags: ["Forum"],
    }),

    updateForum: builder.mutation<Forum, Forum>({
      query: (updatedForum) => ({
        url: `api/forums/${updatedForum.id}/permissions`,
        method: "PUT",
        body: updatedForum,
      }),
      invalidatesTags: ["Forum"],
    }),

    deleteForum: builder.mutation<void, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `api/forums/${id}`,
        method: "DELETE",
        body: { userId }, 
      }),
      invalidatesTags: ["Forum"],
    }),
  }),
});

export const {
  useGetAllForumsQuery,
  useGetViewedForumViewsByUserQuery,
  useLazyGetAllForumsQuery,
  useMarkForumViewedMutation,
  useGetForumByIdQuery,
  useGetForumByTitleQuery,
  useCreateForumMutation,
  useUpdateForumMutation,
  useDeleteForumMutation,
} = forumApiSlice;

export default forumApiSlice;
