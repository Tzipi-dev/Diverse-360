import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job } from "../../types/jobsTypes";
export interface JobState {
  jobs: Job[];
}

const initialState: JobState = {
  jobs: [],
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    insertJob: (state, action: PayloadAction<Job>) => {
      state.jobs.push(action.payload);
    },
    insertJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      const jobIndex = state.jobs.findIndex(
        (j: Job) => j.id === action.payload.id
      );
      if (jobIndex !== -1) {
        state.jobs[jobIndex] = action.payload;
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter((j: Job) => j.id !== action.payload);
    },
  },
});

export const {
  insertJob,
  insertJobs,
  updateJob,
  deleteJob
} = jobsSlice.actions;

export default jobsSlice;
