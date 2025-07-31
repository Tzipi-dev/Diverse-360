// import apiSlice from "../../app/apiSlice";
// import { ForumMessage } from "./forumMessageTypes";

// const forumMessageApi = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({

//     // Fetches all forum messages by forum ID.
//     getAllForumMessagesByForumId: builder.query<ForumMessage[], string>({
//       query: (forum_id) => `/api/messages/${forum_id}`,
//       providesTags: ["ForumMessage"],
//     }),

//     // Fetches a single forum message by its ID.
//     getForumMessageById: builder.query<ForumMessage, string>({
//       query: (id) => `/api/messages/message/${id}`,
//       providesTags: ["ForumMessage"],
//     }),

//     // Adds a new forum message.
//     addForumMessage: builder.mutation<ForumMessage,
//       Omit<ForumMessage, 'id' | 'sent_at' | 'updated_at'>>({
//         query: (newMessage) => ({
//           url: "/api/messages",
//           method: "POST",
//           body: newMessage,
//         }),
//         invalidatesTags: ["ForumMessage", "Forum"],
//       }),

//     // Updates an existing forum message by its ID.
//     updateForumMessage: builder.mutation<ForumMessage, Partial<Omit<ForumMessage, 'id'>> & { id: string }>({
//       query: ({ id, ...patch }) => ({
//         url: `/api/messages/update/${id}`,
//         method: "PUT",
//         body: patch,
//       }),
//       invalidatesTags: ["ForumMessage"],
//     }),

//     // Deletes a forum message by its ID.
//     deleteForumMessage: builder.mutation<void, string>({
//       query: (id) => ({
//         url: `/api/messages/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["ForumMessage"],
//     }),

//     uploadAudio: builder.mutation<{ file_url: string }, FormData>({
//       query: (formData) => ({
//         url: "/api/messages/upload-audio",
//         method: "POST",
//         body: formData,
//       }),
//     }),

//   }),
// });

// export const {
//   useGetAllForumMessagesByForumIdQuery,
//   useGetForumMessageByIdQuery,
//   useAddForumMessageMutation,
//   useUpdateForumMessageMutation,
//   useDeleteForumMessageMutation,
//   useUploadAudioMutation,
// } = forumMessageApi;

// export default forumMessageApi;
import apiSlice from "../../app/apiSlice";
import { ForumMessage } from "./forumMessageTypes";

const forumMessageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllForumMessagesByForumId: builder.query<ForumMessage[], string>({
      query: (forum_id) => `/api/messages/${forum_id}`,
      providesTags: ["ForumMessage"],
    }),

    getForumMessageById: builder.query<ForumMessage, string>({
      query: (id) => `/api/messages/message/${id}`,
      providesTags: ["ForumMessage"],
    }),

    addForumMessage: builder.mutation<
      ForumMessage,
      Omit<ForumMessage, 'id' | 'sent_at' | 'updated_at'>
      >({
      query: (newMessage) => ({
        url: "/api/messages",
        method: "POST",
        body: newMessage,
      }),
      invalidatesTags: ["ForumMessage", "Forum"],
    }),

    updateForumMessage: builder.mutation<
      ForumMessage,
      Partial<Omit<ForumMessage, 'id'>> & { id: string }
    >({
      query: ({ id, ...patch }) => ({
        url: `/api/messages/update/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["ForumMessage"],
    }),

    deleteForumMessage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ForumMessage"],
    }),

    uploadAudio: builder.mutation<{ file_url: string }, FormData>({
      query: (formData) => ({
        url: "/api/messages/upload-audio",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllForumMessagesByForumIdQuery,
  useGetForumMessageByIdQuery,
  useAddForumMessageMutation,
  useUpdateForumMessageMutation,
  useDeleteForumMessageMutation,
  useUploadAudioMutation,
} = forumMessageApi;

export default forumMessageApi;
