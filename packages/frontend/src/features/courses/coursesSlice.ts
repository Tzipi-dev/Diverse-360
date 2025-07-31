import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Course } from "../../types/coursesTypes";
export interface CourseState {
  courses: Course[];
}
const initialState: CourseState = {
  courses: [],
};
const coursesSlice = createSlice({
  name: "courseSlice",
  initialState,
  reducers: {
    insertCourse: (state, action: PayloadAction<Course>) => {
      state.courses?.push(action.payload);
    },
    insertCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const courseIndex = state.courses?.findIndex(
        (c: Course) => c.id === action.payload.id
      );
      if (courseIndex !== -1) {
        state.courses[courseIndex] = action.payload;
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter((c: Course) => c.id !== action.payload);
    },
  },
});

export const {
  insertCourse,
  insertCourses,
  updateCourse,
  deleteCourse
} = coursesSlice.actions;

export default coursesSlice;
