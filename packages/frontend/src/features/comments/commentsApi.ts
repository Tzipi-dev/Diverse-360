import apiSlice from "../../app/apiSlice";
import { Comments } from "./commentsTypes";

const commentApiSlice = apiSlice.injectEndpoints({


    endpoints: (builder) => ({
        getAllComments: builder.query<Comments[], void>({
            query: () => "/api/comments",
            providesTags: ["Comments"],
        }),
        getCommentsByCourseId: builder.query<Comments[], string>({
            query: (courseId) => `/api/comments/by-course/${courseId}`,
            providesTags: ["Comments"],
        }),
        createComment: builder.mutation({
            query: (formData: Comments) => ({
                url: '/api/comments',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Comments'],
        }),
        updateComment: builder.mutation<Comments, Comments>({
            query: (formData: Comments) => ({
                url: `/api/comments/${formData.id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Comments"],
        }),

        deleteComment: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/comments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Comments"],
        }),

    }),
});

export const {
    useGetAllCommentsQuery,
    useGetCommentsByCourseIdQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentApiSlice;

export default commentApiSlice;
