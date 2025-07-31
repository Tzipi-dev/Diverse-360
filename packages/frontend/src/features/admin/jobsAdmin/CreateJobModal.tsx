import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateJobMutation } from "../../../features/jobs/jobsApi";
import { Job } from "../../../types/jobsTypes";

const jobSchema = z.object({
  title: z.string().min(2, "חובה להזין שם משרה"),
  description: z.string().min(10, "נא להזין תיאור משמעותי"),
  location: z.string().min(2, "יש להזין מיקום"),
  requirements: z.string().min(5, "נא לפרט דרישות"),
  workMode: z.enum(["מרחוק", "היברידי", "משרד"]).optional(),
  isActive: z.boolean().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface CreateJobModalProps {
  onClose?: () => void;
  onJobCreated?: (newJob: Job) => void; 
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ onClose, onJobCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  const [createJob, { isLoading }] = useCreateJobMutation();

  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const onSubmit = async (data: JobFormData) => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const newJob = await createJob(data).unwrap(); // newJob הוא מסוג Job
      onJobCreated?.(newJob);
            setSuccessMessage("✅ המשרה נוספה בהצלחה!");
      reset();
      setTimeout(() => {
        onClose?.();
      }, 3000);      

    } catch (error) {
      console.error("שגיאה בהוספת משרה:", error);
      setErrorMessage("❌ אירעה שגיאה בעת שליחת הטופס");
    }
  };


  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "550px",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
          position: "relative",
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 15,
            left: 15,
            fontSize: "20px",
            background: "#f0f0f0",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            lineHeight: "32px",
          }}
          title="סגור"
        >
          ✖
        </button>
  
        <style>
          {`
            textarea::-webkit-scrollbar,
            input::-webkit-scrollbar,
            select::-webkit-scrollbar {
              width: 8px;
            }
  
            textarea::-webkit-scrollbar-thumb,
            input::-webkit-scrollbar-thumb,
            select::-webkit-scrollbar-thumb {
              background-color: #442063;
              border-radius: 4px;
            }
  
            textarea::-webkit-scrollbar-track,
            input::-webkit-scrollbar-track,
            select::-webkit-scrollbar-track {
              background: #eee;
            }
          `}
        </style>
  
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>הוספת משרה חדשה</h2>
  
          {/* שם משרה */}
          <div style={{ marginBottom: "15px", textAlign: "right" }}>
            <label>שם משרה:</label>
            <input
              {...register("title")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "5px",
              }}
            />
            <p style={{ color: "red", margin: "5px 0" }}>{errors.title?.message}</p>
          </div>
  
          {/* תיאור */}
          <div style={{ marginBottom: "15px", textAlign: "right" }}>
            <label>תיאור:</label>
            <textarea
              {...register("description")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                resize: "vertical",
                marginTop: "5px",
              }}
            />
            <p style={{ color: "red", margin: "5px 0" }}>{errors.description?.message}</p>
          </div>
  
          {/* מיקום */}
          <div style={{ marginBottom: "15px", textAlign: "right" }}>
            <label>מיקום:</label>
            <input
              {...register("location")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "5px",
              }}
            />
            <p style={{ color: "red", margin: "5px 0" }}>{errors.location?.message}</p>
          </div>
  
          {/* דרישות */}
          <div style={{ marginBottom: "15px", textAlign: "right" }}>
            <label>דרישות:</label>
            <textarea
              {...register("requirements")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                resize: "vertical",
                marginTop: "5px",
              }}
            />
            <p style={{ color: "red", margin: "5px 0" }}>{errors.requirements?.message}</p>
          </div>
  
          {/* מצב עבודה */}
          <div style={{ marginBottom: "15px", textAlign: "right" }}>
            <label>אופן העבודה:</label>
            <select
              {...register("workMode")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "5px",
              }}
            >
              <option value="">בחר מצב</option>
              <option value="מרחוק">מרחוק</option>
              <option value="היברידי">היברידי</option>
              <option value="משרד">משרד</option>
            </select>
          </div>
  
          {/* האם פעילה */}
          <div style={{ marginBottom: "20px", textAlign: "right" }}>
            <label>
              <input type="checkbox" {...register("isActive")} />
              &nbsp; משרה פעילה
            </label>
          </div>
  
          {/* כפתור שליחה */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "#442063",
                color: "#ffffff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "background-color 0.3s",
                minWidth: "150px",
              }}
            >
              {isLoading ? "שולח..." : (
                <>
                  ➕
                  <span>הוסף משרה</span>
                </>
              )}
            </button>
          </div>
  
          {/* הודעות הצלחה / שגיאה */}
          {successMessage && (
            <p style={{ color: "#2e7d32", marginTop: "15px", fontWeight: "bold" }}>
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p style={{ color: "#c62828", marginTop: "15px", fontWeight: "bold" }}>
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
  
};

export default CreateJobModal;