import apiSlice from "../../app/apiSlice"
import { User } from "../users/usersTypes"

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // שליפת כל המשתמשים עם המרה ל־camelCase
    getAllUsers: builder.query<User[], void>({
      query: () => "/api/users",
      transformResponse: (response: { success: boolean; data: any[] }) => {
        return response.data.map((u) => ({
          id: u.id,
          firstName: u.first_name,
          lastName: u.last_name,
          email: u.email,
          password: u.password,
          phone: u.phone,
          role: u.role,
          group: u.group,
          createdAt: u.created_at,
        }));
      },
      providesTags: ["User"],
    }),

    // שליפת משתמש לפי ID
    getUserById: builder.query<User, string>({
      query: (id) => `/api/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // יצירת משתמש חדש
    createUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: "/api/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),

    // עדכון משתמש קיים
updateUser: builder.mutation<User, Partial<User>>({
  query: (user) => {
    const body: any = {};
    
    // המר רק את השדות שקיימים
    if (user.firstName) body.first_name = user.firstName;
    if (user.lastName) body.last_name = user.lastName;
    if (user.email) body.email = user.email;
    if (user.password) body.password = user.password;
    if (user.phone !== undefined) body.phone = user.phone;
    if (user.role) body.role = user.role;
    if (user.group) body.group = user.group;
    
    return {
      url: `/api/users/${user.id}`,
      method: 'PUT',
      body,
    };
  },
  transformResponse: (response: { success: boolean; data: any }) => {
    // המר את התשובה חזרה ל-camelCase
    const u = response.data;
    return {
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      password: u.password,
      phone: u.phone,
      role: u.role,
      group: u.group,
      createdAt: u.created_at,
    };
  },
  invalidatesTags: ['User'],
})
,
    // מחיקת משתמש לפי ID
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    
  }),
})

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice

export default userApiSlice