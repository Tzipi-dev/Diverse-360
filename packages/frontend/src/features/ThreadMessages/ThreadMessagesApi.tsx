import apiSlice from "../../app/apiSlice";
import {  ThreadMessagesTypes } from "./ThreadMessagesTypes";


const threadMessagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Fetches all thread messages by forum message ID.
    getAllThreadMessagesByForumMessageId: builder.query<ThreadMessagesTypes[], string>({
      query: (forumMessageId) => `/api/thread-messages/forumMessage/${forumMessageId}`,
      providesTags: ["ThreadMessages"],
    }),

    // Fetches a single thread message by its ID.
    getThreadMessageById: builder.query<ThreadMessagesTypes, string>({
      query: (id) => `/api/thread-messages/${id}`,
      providesTags: ["ThreadMessages"],
    }),

    // Adds a new thread message.
    addThreadMessage: builder.mutation<any, FormData>({
  query: (formData) => {
    console.log("FormData בתוך RTK Query addThreadMessage:", formData);
    
    return {
      url: "/api/thread-messages",
      method: "POST",
      body: formData,
    };
  },
  invalidatesTags: ["ThreadMessages", "ForumMessage"],
}),


    // Updates an existing thread message by its ID.
    updateThreadMessage: builder.mutation<
      ThreadMessagesTypes,
      Partial<Omit<ThreadMessagesTypes, 'id'>> & { id: string }
    >({
      query: ({ id, ...patch }) => ({
        url: `/api/thread-messages/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["ThreadMessages"],
    }),

    // Deletes a thread message by its ID.
    deleteThreadMessage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/thread-messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ThreadMessages"],
    }),

  }),
});

export const {
  useGetAllThreadMessagesByForumMessageIdQuery,
  useGetThreadMessageByIdQuery,
  useAddThreadMessageMutation,
  useUpdateThreadMessageMutation,
  useDeleteThreadMessageMutation,
} = threadMessagesApi;

export default threadMessagesApi;
