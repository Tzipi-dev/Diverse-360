// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import EditCourseForm from "../EditCourseForm";
// import * as coursesApi from "../../../../courses/coursesApi";
// import * as videosApi from "../../../videosApiSlice";
// import { Course, CourseVideo } from "../../../../../types/coursesTypes";

// // Mock APIs
// jest.mock("../../../courses/coursesApi");
// jest.mock("../../videosApiSlice");

// const useUpdateCourseMutationMock = coursesApi.useUpdateCourseMutation as jest.Mock;
// const useUpdateVideoMutationMock = videosApi.useUpdateVideoMutation as jest.Mock;

// describe("EditCourseForm", () => {
//   const mockSetEditCourse = jest.fn();
//   const mockOnSuccess = jest.fn();

//   const course: Course = {
//     id: "1",
//     title: "קורס בדיקה",
//     description: "תיאור",
//     uploadedAt: new Date("2023-01-01T00:00:00Z"),
//     subject: "תכנות",
//     lecturer: "מרצה א",
//     isActive: true,
//   };

//   const videos: CourseVideo[] = [
//     {
//       id: "v1",
//       title: "וידאו 1",
//       description: "תיאור 1",
//       video_url: "http://video.com/1.mp4",
//       course_id: "1", // או איזה מזהה שקשור לקורס
//       duration: 120,  // אורך בשניות (בד"כ מספר שלם)
//       order_in_course: 1, // הסדר שבו הסרטון מופיע בקורס
//     },
//   ];
  

//   let mockUpdateCourse: jest.Mock;
//   let mockUpdateVideo: jest.Mock;

//   beforeEach(() => {
//     mockUpdateCourse = jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue(course) });
//     mockUpdateVideo = jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) });

//     useUpdateCourseMutationMock.mockReturnValue([mockUpdateCourse, { isLoading: false }]);
//     useUpdateVideoMutationMock.mockReturnValue([mockUpdateVideo]);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test("renders form with course data", () => {
//     render(
//       <EditCourseForm
//         editCourse={course}
//         videos={videos}
//         setEditCourse={mockSetEditCourse}
//       />
//     );

//     expect(screen.getByDisplayValue("קורס בדיקה")).toBeInTheDocument();
//     expect(screen.getByDisplayValue("תיאור")).toBeInTheDocument();
//     expect(screen.getByDisplayValue("2023-01-01")).toBeInTheDocument();
//     expect(screen.getByDisplayValue("תכנות")).toBeInTheDocument();
//     expect(screen.getByDisplayValue("מרצה א")).toBeInTheDocument();
//     expect(screen.getByText("סרטונים קיימים:")).toBeInTheDocument();
//     expect(screen.getByText("כותרת: וידאו 1")).toBeInTheDocument();
//   });

//   test("submits updated course data", async () => {
//     render(
//       <EditCourseForm
//         editCourse={course}
//         videos={videos}
//         setEditCourse={mockSetEditCourse}
//         onSuccess={mockOnSuccess}
//       />
//     );

//     fireEvent.click(screen.getByRole("button", { name: "שמור שינויים" }));

//     await waitFor(() => {
//       expect(mockUpdateCourse).toHaveBeenCalled();
//       expect(mockSetEditCourse).toHaveBeenCalledWith(course);
//       expect(mockOnSuccess).toHaveBeenCalled();
//     });
//   });

//   test("shows error message on course update failure", async () => {
//     const mockUnwrap = jest.fn().mockRejectedValue({ message: "שגיאה מהשרת" });
//     mockUpdateCourse.mockReturnValue({ unwrap: mockUnwrap });

//     render(
//       <EditCourseForm
//         editCourse={course}
//         videos={videos}
//         setEditCourse={mockSetEditCourse}
//       />
//     );

//     fireEvent.click(screen.getByRole("button", { name: "שמור שינויים" }));

//     await waitFor(() => {
//       expect(screen.getByText("שגיאה מהשרת")).toBeInTheDocument();
//     });
//   });

//   test("uploads video when file is selected", async () => {
//     render(
//       <EditCourseForm
//         editCourse={course}
//         videos={videos}
//         setEditCourse={mockSetEditCourse}
//       />
//     );

//     const file = new File(["video content"], "video.mp4", { type: "video/mp4" });
//     const fileInput = screen.getByLabelText("החלף סרטון זה:");

//     fireEvent.change(fileInput, {
//       target: { files: [file] },
//     });

//     fireEvent.click(screen.getByRole("button", { name: "שמור שינויים" }));

//     await waitFor(() => {
//       expect(mockUpdateVideo).toHaveBeenCalled();
//     });
//   });

//   test("calls setEditCourse(null) when clicking cancel", () => {
//     render(
//       <EditCourseForm
//         editCourse={course}
//         videos={videos}
//         setEditCourse={mockSetEditCourse}
//       />
//     );

//     fireEvent.click(screen.getByRole("button", { name: "ביטול" }));
//     expect(mockSetEditCourse).toHaveBeenCalledWith(null);
//   });
// });
export{}