// ForumPermissionsSelector.tsx – כולל פתיחה של הרשאות ככפתור עם שלוש אפשרויות ופתיחה של רשימת משתמשים כמודאל
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Modal from "./Modal";
import UserMultiSelectList from "./UserMultiSelectList";

const ForumPermissionsSelector: React.FC = () => {
  const { register, setValue, watch } = useFormContext();
  const accessType = watch("accessType");
  const allowedUserIds = watch("allowedUserIds") || [];

  const [showUserSelect, setShowUserSelect] = useState(false);

  return (
    <div style={{ direction: "rtl" }}>
      <label style={{ fontWeight: "600", fontSize: "1.1rem" }}>
        הרשאות גישה:
        <br/>
        <select {...register("accessType")}
          style={{ marginTop: "0.5rem", padding: "0.5rem", borderRadius: "8px" }}
        >
          <option value="public">פתוח לכולם</option>
          <option value="specificUsers">משתמשים ספציפיים</option>
          <option value="academicCycle">מחזור לימודים</option>
        </select>
      </label>

      {accessType === "specificUsers" && (
        <>
          <button
            type="button"
            onClick={() => setShowUserSelect(true)}
            style={{
              marginTop: "0.75rem",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
               backgroundColor: "#DE1380",
              cursor: "pointer"
            }}
          >
            בחר משתמשים
          </button>

          <Modal isOpen={showUserSelect} onClose={() => setShowUserSelect(false)}>
            <h3 style={{ marginBottom: "1rem" }}>בחירת משתמשים</h3>
            <UserMultiSelectList
              selectedUsers={allowedUserIds}
              onChange={(newIds) => setValue("allowedUserIds", newIds)}
            />
            <div style={{ marginTop: "1rem", textAlign: "left" }}>
              <button
                onClick={() => setShowUserSelect(false)}
                style={{ padding: "0.5rem 1rem", borderRadius: "6px",   backgroundColor: "#DE1380", color: "white", border: "none" }}
              >
                סיום
              </button>
            </div>
          </Modal>
        </>
      )}

      {accessType === "academicCycle" && (
        <p>מחזור הלימודים שלך ייקבע אוטומטית.</p>
      )}
    </div>
  );
};

export default ForumPermissionsSelector;