import React, { useState } from "react";
import { useDeleteCourseMutation } from "../../../courses/coursesApi";
import { IconButton, Button, SxProps,Theme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  id: string;
  icon?: boolean;
  sx?: SxProps<Theme>; // 👈 חובה להוסיף את זה
};


const DeleteCourseButton: React.FC<Props> = ({ id, sx, icon }) => {
  const [deleteCourse, { isLoading, error }] = useDeleteCourseMutation();
  const [deleted, setDeleted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleDelete = async () => {
    setApiError(null);
    if (!window.confirm("אתה בטוח שברצונך למחוק את הקורס?")) return;

    try {
      await deleteCourse(id).unwrap();
      setDeleted(true);
    } catch (err: any) {
      if (err?.data?.message) {
        setApiError(err.data.message);
      } else if (err.message) {
        setApiError(err.message);
      } else {
        setApiError("שגיאה לא ידועה במחיקת הקורס");
      }
    }
  };
  if (deleted) return <span>נמחק</span>;
  return (
    <>
      {icon ? (
        <IconButton onClick={handleDelete} sx={sx} disabled={isLoading}>
          <DeleteIcon />
        </IconButton>
      ) : (
        <Button onClick={handleDelete} sx={sx} disabled={isLoading}>
          {isLoading ? "מוחק..." : "מחק"}
        </Button>
      )}
      {(apiError || error) && (
        <p style={{ color: "red" }}>{apiError || "שגיאה במחיקה"}</p>
      )}
    </>
  );
};

export default DeleteCourseButton;
