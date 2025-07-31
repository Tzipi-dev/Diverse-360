import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteCourseButton from "../DeleteCourseButton.tsx";
import * as coursesApi from "../../../../courses/coursesApi";

// מוקים
jest.mock("../../../courses/coursesApi");
const useDeleteCourseMutationMock = coursesApi.useDeleteCourseMutation as jest.Mock;

describe("DeleteCourseButton", () => {
  const courseId = "123";

  let mockDeleteCourse: jest.Mock;
  let mockUnwrap: jest.Mock;

  beforeEach(() => {
    mockUnwrap = jest.fn().mockResolvedValue({});
    mockDeleteCourse = jest.fn().mockReturnValue({ unwrap: mockUnwrap });

    useDeleteCourseMutationMock.mockReturnValue([mockDeleteCourse, { isLoading: false, error: null }]);

    // ברירת מחדל של confirm – תמיד מאשר
    jest.spyOn(window, "confirm").mockImplementation(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders button with icon when icon=true", () => {
    render(<DeleteCourseButton id={courseId} icon={true} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders button with text when icon=false", () => {
    render(<DeleteCourseButton id={courseId} />);
    expect(screen.getByText("מחק")).toBeInTheDocument();
  });

  test("shows 'נמחק' after successful delete", async () => {
    render(<DeleteCourseButton id={courseId} />);
    fireEvent.click(screen.getByText("מחק"));

    await waitFor(() => {
      expect(mockDeleteCourse).toHaveBeenCalledWith(courseId);
      expect(screen.getByText("נמחק")).toBeInTheDocument();
    });
  });

  test("does not delete if user cancels confirm", () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    render(<DeleteCourseButton id={courseId} />);
    fireEvent.click(screen.getByText("מחק"));
    expect(mockDeleteCourse).not.toHaveBeenCalled();
  });

  test("shows error message if API fails with message", async () => {
    mockUnwrap.mockRejectedValue({
      data: { message: "הקורס לא נמצא" },
    });

    render(<DeleteCourseButton id={courseId} />);
    fireEvent.click(screen.getByText("מחק"));

    await waitFor(() => {
      expect(screen.getByText("הקורס לא נמצא")).toBeInTheDocument();
    });
  });

  test("shows fallback error if no error message", async () => {
    mockUnwrap.mockRejectedValue({});
    render(<DeleteCourseButton id={courseId} />);
    fireEvent.click(screen.getByText("מחק"));

    await waitFor(() => {
      expect(screen.getByText("שגיאה לא ידועה במחיקת הקורס")).toBeInTheDocument();
    });
  });

  test("disables button while loading", () => {
    useDeleteCourseMutationMock.mockReturnValue([
      mockDeleteCourse,
      { isLoading: true, error: null },
    ]);
    render(<DeleteCourseButton id={courseId} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("shows 'מוחק...' while loading", () => {
    useDeleteCourseMutationMock.mockReturnValue([
      mockDeleteCourse,
      { isLoading: true, error: null },
    ]);
    render(<DeleteCourseButton id={courseId} />);
    expect(screen.getByText("מוחק...")).toBeInTheDocument();
  });
});
