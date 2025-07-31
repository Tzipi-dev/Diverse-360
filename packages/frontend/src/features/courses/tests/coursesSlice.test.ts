import { Course } from "types/coursesTypes";
import coursesSlice, {
  insertCourse,
  insertCourses,
  updateCourse,
  deleteCourse,
  CourseState,
} from "../coursesSlice";



const course1: Course = {
    id: "1",
    title: "React Hooks",
    description: "Learn React hooks",
    subject: "React",
    lecturer: "Alice",
    uploadedAt: new Date(),
    isActive: false,
    imageUrl: ""
};

const course2: Course = {
    id: "2",
    title: "Redux Toolkit",
    description: "Learn Redux Toolkit",
    subject: "Redux",
    lecturer: "Bob",
    uploadedAt: new Date(),
    isActive: false,
    imageUrl: ""
};

describe("coursesSlice", () => {
  it("should handle insertCourse", () => {
    const prevState: CourseState = { courses: [] };
    const nextState = coursesSlice.reducer(prevState, insertCourse(course1));
    expect(nextState.courses).toHaveLength(1);
    expect(nextState.courses[0]).toEqual(course1);
  });

  it("should handle insertCourses", () => {
    const prevState: CourseState = { courses: [] };
    const nextState = coursesSlice.reducer(prevState, insertCourses([course1, course2]));
    expect(nextState.courses).toHaveLength(2);
    expect(nextState.courses[1].title).toBe("Redux Toolkit");
  });

  it("should handle updateCourse", () => {
    const prevState: CourseState = { courses: [course1] };
    const updatedCourse: Course = { ...course1, title: "Updated Title" };
    const nextState = coursesSlice.reducer(prevState, updateCourse(updatedCourse));
    expect(nextState.courses[0].title).toBe("Updated Title");
  });

  it("should NOT update course if ID does not exist", () => {
    const prevState: CourseState = { courses: [course1] };
    const nonExistingCourse: Course = { ...course2, id: "999" };
    const nextState = coursesSlice.reducer(prevState, updateCourse(nonExistingCourse));
    expect(nextState.courses).toHaveLength(1);
    expect(nextState.courses[0].title).toBe("React Hooks");
  });

  it("should handle deleteCourse", () => {
    const prevState: CourseState = { courses: [course1, course2] };
    const nextState = coursesSlice.reducer(prevState, deleteCourse("1"));
    expect(nextState.courses).toHaveLength(1);
    expect(nextState.courses[0].id).toBe("2");
  });
});
