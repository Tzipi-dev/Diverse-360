import apiSlice from "../app/apiSlice";
import { configureStore } from '@reduxjs/toolkit';
import jobsSlice from "../features/jobs/jobsSlice";
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';
import coursesSlice from "../features/courses/coursesSlice";
import courseApiSlice from "../features/courses/coursesApi";
import projectsSlice from "../features/admin/ProjectsAdmin/projectsSlice";
import errorModalReducer from '../rateLimiter/errorModalSlice';
import { adminJobsApi } from '../features/admin/jobsAdmin/adminJobsApi';
import { errorMiddleware } from '../rateLimiter/errorMiddleware';
// import { api } from "rateLimiter/api";

const store = configureStore({
    reducer: {
        [jobsSlice.name]: jobsSlice.reducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [coursesSlice.name]: coursesSlice.reducer,
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        projects: projectsSlice,
        [adminJobsApi.reducerPath]: adminJobsApi.reducer,
        errorModal: errorModalReducer,
    },
    middleware: (getDefaultMiddleware) => {
        
        return getDefaultMiddleware().concat(apiSlice.middleware)
            .concat(authApi.middleware)
            .concat(adminJobsApi.middleware)
            // .concat(api.middleware, errorMiddleware)
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;