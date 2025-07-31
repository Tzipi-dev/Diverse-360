// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import CoursesTable from "../CoursesTable";
// import * as coursesApi from "../../../../courses/coursesApi";
// import { Course } from "../../../../../types/coursesTypes";

// // Mock הקומפוננטה הפנימית
// jest.mock("../CourseRow", () => (props: any) => (
//   <div data-testid="course-row">{props.course.title}</div>
// ));

// // Mock Redux Toolkit Query
// jest.mock("../../../courses/coursesApi");
// const useGetAllCoursesQueryMock = coursesApi.useGetAllCoursesQuery as jest.Mock;

// describe("CoursesTable", () => {
//   const sampleCourses: Course[] = [
//     {
//       id: "1",
//       title: "React למתחילים",
//       description: "",
//       uploadedAt: new Date(),
//       subject: "פיתוח",
//       lecturer: "מרצה א",
//       isActive: true,
//     },
//     {
//       id: "2",
//       title: "Node.js מתקדם",
//       description: "",
//       uploadedAt: new Date(),
//       subject: "פיתוח",
//       lecturer: "מרצה ב",
//       isActive: true,
//     },
//   ];

//   const mockOnEdit = jest.fn();
//   const mockOnAddVideo = jest.fn();
//   const mockOnManageVideos = jest.fn();

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test("מציג הודעת טעינה כשהנתונים בטעינה", () => {
//     useGetAllCoursesQueryMock.mockReturnValue({
//       data: undefined,
//       isLoading: true,
//       error: null,
//     });

//     render(
//       <CoursesTable
//         onEdit={mockOnEdit}
//         onAddVideo={mockOnAddVideo}
//         onManageVideos={mockOnManageVideos}
//       />
//     );

//     expect(screen.getByText("טוען נתונים...")).toBeInTheDocument();
//   });

//   test("מציג הודעת שגיאה אם השליפה נכשלה", () => {
//     useGetAllCoursesQueryMock.mockReturnValue({
//       data: undefined,
//       isLoading: false,
//       error: true,
//     });

//     render(
//       <CoursesTable
//         onEdit={mockOnEdit}
//         onAddVideo={mockOnAddVideo}
//         onManageVideos={mockOnManageVideos}
//       />
//     );

//     expect(screen.getByText("אירעה שגיאה בטעינת הקורסים.")).toBeInTheDocument();
//   });

//   test("מציג קורסים מהרשימה", () => {
//     useGetAllCoursesQueryMock.mockReturnValue({
//       data: sampleCourses,
//       isLoading: false,
//       error: null,
//     });

//     render(
//       <CoursesTable
//         onEdit={mockOnEdit}
//         onAddVideo={mockOnAddVideo}
//         onManageVideos={mockOnManageVideos}
//       />
//     );

//     expect(screen.getByText("React למתחילים")).toBeInTheDocument();
//     expect(screen.getByText("Node.js מתקדם")).toBeInTheDocument();
//   });

//   test("מסנן קורסים לפי טקסט החיפוש", () => {
//     useGetAllCoursesQueryMock.mockReturnValue({
//       data: sampleCourses,
//       isLoading: false,
//       error: null,
//     });

//     render(
//       <CoursesTable
//         onEdit={mockOnEdit}
//         onAddVideo={mockOnAddVideo}
//         search="react"
//         onManageVideos={mockOnManageVideos}
//       />
//     );

//     expect(screen.getByText("React למתחילים")).toBeInTheDocument();
//     expect(screen.queryByText("Node.js מתקדם")).not.toBeInTheDocument();
//   });

//   test("לא נופל גם אם search לא מוגדר", () => {
//     useGetAllCoursesQueryMock.mockReturnValue({
//       data: sampleCourses,
//       isLoading: false,
//       error: null,
//     });

//     render(
//       <CoursesTable
//         onEdit={mockOnEdit}
//         onAddVideo={mockOnAddVideo}
//         onManageVideos={mockOnManageVideos}
//       />
//     );

//     expect(screen.getAllByTestId("course-row").length).toBe(2);
//   });
// });
export{}