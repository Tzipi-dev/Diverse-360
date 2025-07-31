import apiSlice from '../../app/apiSlice';
import { ScreenTime } from '../../types/analytucsTypes';

const screenAnalyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // הוספת אנליטיקה
    addScreenAnalytics: builder.mutation<void, Omit<ScreenTime, 'id' | 'created_at'>>({
      query: (body) => ({
        url: `/api/analytics`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ScreenTime'],
    }),

    // שליפת אנליטיקה מרוכזת לפי path
    getGroupedScreenAnalytics: builder.query<Record<string, number>, void>({
      query: () => `/api/analytics/by-screen`,
      providesTags: ['ScreenTime'],
    }),

    // ✅ חדש – שליפה לפי משתמשים
    getScreenAnalyticsByUser: builder.query<Record<string, number>, void>({
      query: () => `/api/analytics/by-user`,
      providesTags: ['ScreenTime'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddScreenAnalyticsMutation,
  useGetGroupedScreenAnalyticsQuery,
  useGetScreenAnalyticsByUserQuery, // ✅ אל תשכחי לייבא ולהשתמש בו
} = screenAnalyticsApiSlice;

export default screenAnalyticsApiSlice;