import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddVideoToCourseForm from "../AddVideoToCourseForm";
import * as videosApi from "../../../videosApiSlice";

// מוק של ה־API
jest.mock("../../../videosApiSlice");
const useCreateVideoMutationMock = videosApi.useCreateVideoMutation as jest.Mock;

describe("AddVideoToCourseForm", () => {
  const mockCreateVideo = jest.fn();

  beforeEach(() => {
    useCreateVideoMutationMock.mockReturnValue([mockCreateVideo, { isLoading: false }]);
    jest.clearAllMocks();
  });

  test("מציג את שם הקורס", () => {
    render(<AddVideoToCourseForm course_id="1" courseName="קורס לדוגמה" />);
    expect(screen.getByText("קורס לדוגמה")).toBeInTheDocument();
  });

  test("מציג שגיאה אם מנסים לשלוח בלי כותרת", async () => {
    render(<AddVideoToCourseForm course_id="1" courseName="קורס" />);
    const submitBtn = screen.getByRole("button", { name: /הוסף וידאו/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("נא להזין כותרת לוידאו")).toBeInTheDocument();
  });

  test("מציג שגיאה אם מנסים לשלוח בלי קובץ וידאו", async () => {
    render(<AddVideoToCourseForm course_id="1" courseName="קורס" />);
    const titleInput = screen.getByLabelText("כותרת הוידאו");
    userEvent.type(titleInput, "וידאו חדש");

    const submitBtn = screen.getByRole("button", { name: /הוסף וידאו/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("נא לבחור קובץ וידאו")).toBeInTheDocument();
  });

  test("מעלה וידאו ומציג הודעת הצלחה", async () => {
    mockCreateVideo.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    render(<AddVideoToCourseForm course_id="1" courseName="קורס" />);

    // מזין כותרת
    const titleInput = screen.getByLabelText("כותרת הוידאו");
    userEvent.type(titleInput, "וידאו חדש");

    // מעלה קובץ (מדומה)
    const file = new File(["dummy content"], "video.mp4", { type: "video/mp4" });
    const fileInput = screen.getByLabelText(/בחרי קובץ מהמחשב/i);
    // input[type="file"] מוסתר, לכן בודקים לפי id - אז נשתמש ב־getByTestId או נצלם את ה-input דרך label
    const hiddenFileInput = screen.getByLabelText("בחרי קובץ מהמחשב").previousSibling as HTMLInputElement;
    Object.defineProperty(hiddenFileInput, "files", {
      value: [file],
    });
    fireEvent.change(hiddenFileInput);

    // שולח טופס
    const submitBtn = screen.getByRole("button", { name: /הוסף וידאו/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateVideo).toHaveBeenCalled();
      expect(screen.getByText("וידאו נוסף בהצלחה לקורס!")).toBeInTheDocument();
    });
  });

  test("מציג שגיאה אם ה־API מחזיר שגיאה", async () => {
    mockCreateVideo.mockReturnValue({
      unwrap: () => Promise.reject({ data: { message: "שגיאה בשרת" } }),
    });

    render(<AddVideoToCourseForm course_id="1" courseName="קורס" />);

    const titleInput = screen.getByLabelText("כותרת הוידאו");
    userEvent.type(titleInput, "וידאו חדש");

    const file = new File(["dummy content"], "video.mp4", { type: "video/mp4" });
    const hiddenFileInput = screen.getByLabelText("בחרי קובץ מהמחשב").previousSibling as HTMLInputElement;
    Object.defineProperty(hiddenFileInput, "files", {
      value: [file],
    });
    fireEvent.change(hiddenFileInput);

    const submitBtn = screen.getByRole("button", { name: /הוסף וידאו/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("שגיאה בשרת")).toBeInTheDocument();
    });
  });

  test("מפעיל את הפונקציה onCancel בעת לחיצה על כפתור ביטול", () => {
    const onCancelMock = jest.fn();
    render(
      <AddVideoToCourseForm
        course_id="1"
        courseName="קורס"
        onCancel={onCancelMock}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /ביטול/i });
    fireEvent.click(cancelBtn);

    expect(onCancelMock).toHaveBeenCalled();
  });
});
