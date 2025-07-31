import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CoursesPage from "../CoursesPage";
import { Provider } from "react-redux";
// import { setupApiStore } from "../../utils/setupApiStore"; // תוודאי שזו הדרך שבה את מקנפגת store לבדיקה
import  courseApiSlice from "../coursesApi";
import { Course } from "types/coursesTypes";
import store from "app/store";


// צור חנות לבדיקה
// const { store } = setupApiStore(courseApiSlice);

// mock לקורסים לדוגמה
const mockCourses: Course[] = [
  {
      id: "1",
      title: "React Hooks",
      description: "Learn React hooks",
      subject: "React",
      lecturer: "Alice",
      uploadedAt: new Date(),
      isActive: false,
      imageUrl: ""
  },
  {
      id: "2",
      title: "Redux Toolkit",
      description: "Learn RTK",
      subject: "Redux",
      lecturer: "Bob",
      uploadedAt: new Date(),
      isActive: false,
      imageUrl: ""
  },
];

// מוקים ל־RTK Query
jest.mock("./coursesApi", () => ({
  useGetAllCoursesQuery: () => ({
    data: mockCourses,
    isLoading: false,
  }),
}));

describe("CoursesPage", () => {
  it("מציג את כל הקורסים כברירת מחדל", () => {
    render(
      <Provider store={store}>
        <CoursesPage />
      </Provider>
    );

    expect(screen.getByText("ספריית קורסים והדרכות")).toBeInTheDocument();
    expect(screen.getByText("React Hooks")).toBeInTheDocument();
    expect(screen.getByText("Redux Toolkit")).toBeInTheDocument();
  });

  it("מחפש קורס לפי מילה", async () => {
    render(
      <Provider store={store}>
        <CoursesPage />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText("חפש קורס לפי מילת מפתח...");
    const searchButton = screen.getByText("חיפוש");

    fireEvent.change(searchInput, { target: { value: "Redux" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Redux Toolkit")).toBeInTheDocument();
      expect(screen.queryByText("React Hooks")).not.toBeInTheDocument();
    });
  });

  it("מציג הודעה אם לא נמצאו תוצאות", async () => {
    render(
      <Provider store={store}>
        <CoursesPage />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText("חפש קורס לפי מילת מפתח...");
    fireEvent.change(searchInput, { target: { value: "לא קיים" } });

    fireEvent.click(screen.getByText("חיפוש"));

    await waitFor(() => {
      expect(screen.getByText("לא נמצאו קורסים התואמים לחיפוש.")).toBeInTheDocument();
    });
  });
});
