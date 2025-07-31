// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import EditJobModal from "../EditJobModal";

// // יצירת mock ל־useUpdateJobMutation
// const mockUpdateJob = jest.fn();
// let mockError: any = null;
// let mockIsLoading = false;

// jest.mock("../adminJobsApi", () => ({
//   useUpdateJobMutation: () => [mockUpdateJob, { isLoading: mockIsLoading, error: mockError }],
// }));

// const mockJob = {
//   id: "1", // id צריך להיות string
//   title: "משרה לדוג'",
//   description: "תיאור",
//   location: "מיקום",
//   requirements: "דרישות",
//   isActive: true,
//   // createdAt: new Date(), // createdAt צריך להיות Date
  
// };

// describe("EditJobModal", () => {
//   beforeEach(() => {
//     mockUpdateJob.mockReset();
//     mockError = null;
//     mockIsLoading = false;
//   });

//   it("מציג את ערכי המשרה בטופס", () => {
//     render(
//       <EditJobModal job={mockJob} open={true} onCancel={() => {}} onSave={() => {}} />
//     );
//     expect(screen.getByDisplayValue("משרה לדוג'")).toBeInTheDocument();
//     expect(screen.getByDisplayValue("תיאור")).toBeInTheDocument();
//     expect(screen.getByDisplayValue("מיקום")).toBeInTheDocument();
//     expect(screen.getByDisplayValue("דרישות")).toBeInTheDocument();
//   });

//   it("שולח עדכון משרה בלחיצה על שמור", async () => {
//     mockUpdateJob.mockReturnValue({ unwrap: () => Promise.resolve() });
//     const onSave = jest.fn();

//     render(
//       <EditJobModal job={mockJob} open={true} onCancel={() => {}} onSave={onSave} />
//     );

//     fireEvent.change(screen.getByLabelText("כותרת"), { target: { value: "כותרת חדשה" } });
//     fireEvent.click(screen.getByRole("button", { name: "שמור" }));

//     await waitFor(() => {
//       expect(mockUpdateJob).toHaveBeenCalled();
//       expect(onSave).toHaveBeenCalled();
//     });
//   });

//   it("מציג הודעת שגיאה במקרה של שגיאת שרת", async () => {
//     mockUpdateJob.mockReturnValue({ unwrap: () => Promise.reject(new Error("שגיאה")) });
//     mockError = true;

//     render(
//       <EditJobModal job={mockJob} open={true} onCancel={() => {}} onSave={() => {}} />
//     );

//     fireEvent.click(screen.getByRole("button", { name: "שמור" }));

//     await waitFor(() => {
//       expect(screen.getByText(/שגיאה בעדכון המשרה/i)).toBeInTheDocument();
//     });
//   });
// });

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditJobModal from "../EditJobModal";

// יצירת mock ל־useUpdateJobMutation
const mockUpdateJob = jest.fn();
let mockError: any = null;
let mockIsLoading = false;

jest.mock("../adminJobsApi", () => ({
  useUpdateJobMutation: () => [mockUpdateJob, { isLoading: mockIsLoading, error: mockError }],
}));

const mockJob = {
  id: "1",
  title: "משרה לדוג'",
  description: "תיאור",
  location: "מיקום",
  requirements: "דרישות",
  isActive: true,
  workMode: "משרד",
  createdAt: new Date(), // הוספה של השדה החסר
};


describe("EditJobModal", () => {
  beforeEach(() => {
    mockUpdateJob.mockReset();
    mockError = null;
    mockIsLoading = false;
  });

  it("מציג את ערכי המשרה בטופס כולל אופן העבודה", () => {
    render(
      <EditJobModal job={mockJob} open={true} onCancel={() => {}} onSave={() => {}} />
    );
    expect(screen.getByDisplayValue("משרה לדוג'")).toBeInTheDocument();
    expect(screen.getByDisplayValue("תיאור")).toBeInTheDocument();
    expect(screen.getByDisplayValue("מיקום")).toBeInTheDocument();
    expect(screen.getByDisplayValue("דרישות")).toBeInTheDocument();
    expect(screen.getByDisplayValue("משרד")).toBeInTheDocument(); // workMode
  });

  it("שולח עדכון משרה בלחיצה על שמור כולל workMode", async () => {
    const mockUnwrap = jest.fn().mockResolvedValue({});
    mockUpdateJob.mockReturnValue({ unwrap: mockUnwrap });

    const onSave = jest.fn();

    render(
      <EditJobModal job={mockJob} open={true} onCancel={() => {}} onSave={onSave} />
    );

    fireEvent.change(screen.getByLabelText("כותרת"), { target: { value: "כותרת חדשה" } });

    // שינוי workMode (שדה select)
    fireEvent.mouseDown(screen.getByLabelText("אופן העבודה")); // פותח את התפריט
    const option = await screen.findByText("מהבית");
    fireEvent.click(option);

    fireEvent.click(screen.getByRole("button", { name: "שמור" }));

    await waitFor(() => {
      expect(mockUpdateJob).toHaveBeenCalledWith({
        id: mockJob.id,
        updatedData: expect.objectContaining({
          title: "כותרת חדשה",
          workMode: "מהבית",
        }),
      });
      expect(onSave).toHaveBeenCalled();
    });
  });

  it("מציג הודעת שגיאה במקרה של שגיאת שרת", async () => {
    mockUpdateJob.mockReturnValue({ unwrap: () => Promise.reject(new Error("שגיאה")) });
    mockError = true;

    render(
      <EditJobModal job={mockJob} open={true} onCancel={() => {}} onSave={() => {}} />
    );

    fireEvent.click(screen.getByRole("button", { name: "שמור" }));

    await waitFor(() => {
      expect(screen.getByText(/שגיאה בעדכון המשרה/i)).toBeInTheDocument();
    });
  });
});
