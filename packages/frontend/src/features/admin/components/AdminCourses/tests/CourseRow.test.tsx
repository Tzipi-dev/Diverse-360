// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import CourseRow from "../CourseRow";
// import { Course } from "../../../../../types/coursesTypes";

// // מוקים את DeleteCourseButton כדי לא להיכנס ללוגיקה שלו
// jest.mock("../DeleteCourseButton", () => (props: any) => (
//   <button data-testid="delete-course-button" onClick={() => {}}>
//     מחק קורס
//   </button>
// ));

// describe("CourseRow", () => {
//   const sampleCourse: Course = {
//     id: "1",
//     title: "קורס לדוגמא",
//     description: "תיאור קצר",
//     uploadedAt: new Date("2023-01-01T00:00:00Z"),
//     isActive: true,
//     subject: "פיתוח",
//     lecturer: "מרצה א",
//   };

//   const onEditMock = jest.fn();
//   const onAddVideoMock = jest.fn();
//   const onManageVideosMock = jest.fn();

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test("מציג את פרטי הקורס", () => {
//     render(
//       <CourseRow
//         course={sampleCourse}
//         onEdit={onEditMock}
//         onAddVideo={onAddVideoMock}
//         onManageVideos={onManageVideosMock}
//       />
//     );

//     expect(screen.getByText("קורס לדוגמא")).toBeInTheDocument();
//     expect(screen.getByText("תיאור קצר")).toBeInTheDocument();
//     expect(screen.getByText("נושא: פיתוח")).toBeInTheDocument();
//     expect(screen.getByText("מרצה: מרצה א")).toBeInTheDocument();
//     expect(screen.getByText("פעיל")).toBeInTheDocument();

//     // תאריך מוצג (פורמט מקומי)
//     expect(screen.getByText("1/1/2023")).toBeInTheDocument();
//   });

//   test("כפתור עריכה מפעיל את הפונקציה עם הקורס הנכון", () => {
//     render(
//       <CourseRow
//         course={sampleCourse}
//         onEdit={onEditMock}
//         onAddVideo={onAddVideoMock}
//         onManageVideos={onManageVideosMock}
//       />
//     );

//     const editButton = screen.getByRole("button", { name: /ערוך קורס/i });
//     fireEvent.click(editButton);

//     expect(onEditMock).toHaveBeenCalledTimes(1);
//     expect(onEditMock).toHaveBeenCalledWith(sampleCourse);
//   });

//   test("כפתור ניהול סרטונים מפעיל את הפונקציה עם הקורס הנכון", () => {
//     render(
//       <CourseRow
//         course={sampleCourse}
//         onEdit={onEditMock}
//         onAddVideo={onAddVideoMock}
//         onManageVideos={onManageVideosMock}
//       />
//     );

//     const manageVideosButton = screen.getByRole("button", { name: /ניהול סרטונים/i });
//     fireEvent.click(manageVideosButton);

//     expect(onManageVideosMock).toHaveBeenCalledTimes(1);
//     expect(onManageVideosMock).toHaveBeenCalledWith(sampleCourse);
//   });

//   test("מציג את כפתור מחיקת הקורס (מוקה)", () => {
//     render(
//       <CourseRow
//         course={sampleCourse}
//         onEdit={onEditMock}
//         onAddVideo={onAddVideoMock}
//         onManageVideos={onManageVideosMock}
//       />
//     );

//     expect(screen.getByTestId("delete-course-button")).toBeInTheDocument();
//   });
// });
export{}