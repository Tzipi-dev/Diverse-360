import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VideoListForCourse from "../VideoListForCourse";
import * as videosApi from "../../../videosApiSlice";

// Mock ה־API
jest.mock("../../videosApiSlice");

const useGetVideosByCourseIdQueryMock = videosApi.useGetVideosByCourseIdQuery as jest.Mock;
const useDeleteVideoMutationMock = videosApi.useDeleteVideoMutation as jest.Mock;

describe("VideoListForCourse", () => {
  const sampleVideos = [
    {
      id: "v1",
      course_id: "c1",
      title: "וידאו ראשון",
      description: "תיאור וידאו ראשון",
      video_url: "http://video1.mp4",
      duration: 120,
      order_in_course: 1,
    },
    {
      id: "v2",
      course_id: "c1",
      title: "וידאו שני",
      description: "תיאור וידאו שני",
      video_url: "http://video2.mp4",
      duration: 150,
      order_in_course: 2,
    },
  ];

  let deleteVideoMock: jest.Mock;

  beforeEach(() => {
    deleteVideoMock = jest.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
    useDeleteVideoMutationMock.mockReturnValue([deleteVideoMock, { isLoading: false }]);
    jest.clearAllMocks();
  });

  test("מציג ספינר טעינה בזמן טעינת הנתונים", () => {
    useGetVideosByCourseIdQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      refetch: jest.fn(),
    });

    render(<VideoListForCourse courseId="c1" />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("מציג הודעה כאשר אין סרטונים", () => {
    useGetVideosByCourseIdQueryMock.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<VideoListForCourse courseId="c1" />);

    expect(screen.getByText("אין סרטונים לקורס זה.")).toBeInTheDocument();
  });

  test("מציג את רשימת הסרטונים", () => {
    useGetVideosByCourseIdQueryMock.mockReturnValue({
      data: sampleVideos,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<VideoListForCourse courseId="c1" />);

    expect(screen.getByText("וידאו ראשון")).toBeInTheDocument();
    expect(screen.getByText("וידאו שני")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /מחק סרטון/i })).toHaveLength(2);
  });

  test("מחיקת סרטון מפעילה את הפונקציה הנכונה ומרעננת את הנתונים", async () => {
    const refetchMock = jest.fn();
    useGetVideosByCourseIdQueryMock.mockReturnValue({
      data: sampleVideos,
      isLoading: false,
      refetch: refetchMock,
    });

    render(<VideoListForCourse courseId="c1" />);

    const deleteButtons = screen.getAllByRole("button", { name: /מחק סרטון/i });
    fireEvent.click(deleteButtons[0]);

    expect(deleteVideoMock).toHaveBeenCalledWith("v1");

    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalled();
    });
  });

  test("כפתור מחיקה מנוטרל בזמן המחיקה", () => {
    let resolveDelete: () => void;
    const deletePromise = new Promise<void>((resolve) => {
      resolveDelete = resolve;
    });

    deleteVideoMock = jest.fn(() => ({ unwrap: () => deletePromise }));
    useDeleteVideoMutationMock.mockReturnValue([deleteVideoMock, { isLoading: true }]);

    useGetVideosByCourseIdQueryMock.mockReturnValue({
      data: sampleVideos,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<VideoListForCourse courseId="c1" />);

    const deleteButtons = screen.getAllByRole("button", { name: /מחק סרטון/i });
    expect(deleteButtons[0]).toBeDisabled();

    // משחררים את ההבטחה כדי לסיים את המחיקה
    resolveDelete!();
  });
});
