import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateCourseForm from "../CreateCourseForm";
import * as coursesApi from "../../../../courses/coursesApi";

jest.mock("../../../../courses/coursesApi");
const useCreateCourseMutationMock = coursesApi.useCreateCourseMutation as jest.Mock;

jest.mock("react-hook-form", () => {
  const original = jest.requireActual("react-hook-form");
  return {
    ...original,
    useForm: jest.fn(),
  };
});

const mockUseForm = require("react-hook-form").useForm;

describe("CreateCourseForm", () => {
  let mockCreateCourse: jest.Mock;
  let mockOnSuccess: jest.Mock;

  beforeEach(() => {
    mockCreateCourse = jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) });
    mockOnSuccess = jest.fn();

    mockUseForm.mockReturnValue({
      control: {},
      handleSubmit: (fn: any) => (e?: any) => fn(e),
      reset: jest.fn(),
      formState: { errors: {} },
    });

    useCreateCourseMutationMock.mockReturnValue([
      mockCreateCourse,
      { isLoading: false },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders form fields correctly", () => {
    render(<CreateCourseForm onSuccess={mockOnSuccess} />);
    expect(screen.getByText("צור קורס חדש")).toBeInTheDocument();
    expect(screen.getByLabelText("שם הקורס")).toBeInTheDocument();
    expect(screen.getByLabelText("תיאור הקורס")).toBeInTheDocument();
    expect(screen.getByLabelText("תאריך")).toBeInTheDocument();
    expect(screen.getByLabelText("נושא הקורס")).toBeInTheDocument();
    expect(screen.getByLabelText("שם המרצה")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "צור קורס" })).toBeInTheDocument();
  });

  test("shows loading state when submitting", () => {
    useCreateCourseMutationMock.mockReturnValue([
      mockCreateCourse,
      { isLoading: true },
    ]);
    render(<CreateCourseForm onSuccess={mockOnSuccess} />);
    const button = screen.getByRole("button", { name: "שולח..." });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test("shows validation errors", () => {
    mockUseForm.mockReturnValue({
      control: {},
      handleSubmit: (fn: any) => fn,
      reset: jest.fn(),
      formState: {
        errors: {
          title: { message: "שם הקורס הוא שדה חובה" },
          subject: { message: "נושא הקורס הוא שדה חובה" },
          lecturer: { message: "שם המרצה הוא שדה חובה" },
        },
      },
    });

    render(<CreateCourseForm onSuccess={mockOnSuccess} />);
    expect(screen.getByText("שם הקורס הוא שדה חובה")).toBeInTheDocument();
    expect(screen.getByText("נושא הקורס הוא שדה חובה")).toBeInTheDocument();
    expect(screen.getByText("שם המרצה הוא שדה חובה")).toBeInTheDocument();
  });

  test("submits form successfully", async () => {
    const mockReset = jest.fn();
    const mockUnwrap = jest.fn().mockResolvedValue({});
    mockCreateCourse = jest.fn().mockReturnValue({ unwrap: mockUnwrap });

    mockUseForm.mockReturnValue({
      control: {},
      handleSubmit: (fn: any) => () => fn({}),
      reset: mockReset,
      formState: { errors: {} },
    });

    useCreateCourseMutationMock.mockReturnValue([
      mockCreateCourse,
      { isLoading: false },
    ]);

    render(<CreateCourseForm onSuccess={mockOnSuccess} />);
    fireEvent.click(screen.getByRole("button", { name: "צור קורס" }));

    await waitFor(() => {
      expect(mockCreateCourse).toHaveBeenCalled();
      expect(mockUnwrap).toHaveBeenCalled();
      expect(mockReset).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test("handles submission error", async () => {
    const mockUnwrap = jest.fn().mockRejectedValue(new Error("Network error"));
    mockCreateCourse = jest.fn().mockReturnValue({ unwrap: mockUnwrap });

    mockUseForm.mockReturnValue({
      control: {},
      handleSubmit: (fn: any) => () => fn({}),
      reset: jest.fn(),
      formState: { errors: {} },
    });

    useCreateCourseMutationMock.mockReturnValue([
      mockCreateCourse,
      { isLoading: false },
    ]);

    render(<CreateCourseForm onSuccess={mockOnSuccess} />);
    fireEvent.click(screen.getByRole("button", { name: "צור קורס" }));

    await waitFor(() => {
      expect(screen.getByText("שגיאה ביצירת קורס. אנא נסה שוב.")).toBeInTheDocument();
    });
  });

  test("works without onSuccess callback", async () => {
    const mockReset = jest.fn();
    const mockUnwrap = jest.fn().mockResolvedValue({});
    mockCreateCourse = jest.fn().mockReturnValue({ unwrap: mockUnwrap });

    mockUseForm.mockReturnValue({
      control: {},
      handleSubmit: (fn: any) => () => fn({}),
      reset: mockReset,
      formState: { errors: {} },
    });

    useCreateCourseMutationMock.mockReturnValue([
      mockCreateCourse,
      { isLoading: false },
    ]);

    render(<CreateCourseForm />);
    fireEvent.click(screen.getByRole("button", { name: "צור קורס" }));

    await waitFor(() => {
      expect(mockCreateCourse).toHaveBeenCalled();
      expect(mockUnwrap).toHaveBeenCalled();
      expect(mockReset).toHaveBeenCalled();
    });
  });

  test("checkbox is checked by default", () => {
    render(<CreateCourseForm onSuccess={mockOnSuccess} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  test("form has proper accessibility attributes", () => {
    render(<CreateCourseForm onSuccess={mockOnSuccess} />);
    expect(screen.getByLabelText("שם הקורס")).toHaveAttribute("required");
    expect(screen.getByLabelText("תאריך")).toHaveAttribute("required");
    expect(screen.getByLabelText("נושא הקורס")).toHaveAttribute("required");
    expect(screen.getByLabelText("שם המרצה")).toHaveAttribute("required");
  });
});
