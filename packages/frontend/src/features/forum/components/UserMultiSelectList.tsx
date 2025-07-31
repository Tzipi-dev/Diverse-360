import React, { useMemo, useState } from "react";
import { useGetAllUsersQuery } from "../../users/usersApi";

interface Props {
  selectedUsers: string[];
  onChange: (newUserIds: string[]) => void;
}

const UserMultiSelectList: React.FC<Props> = ({ selectedUsers, onChange }) => {
  const { data: allUsers = [], isLoading, error } = useGetAllUsersQuery();
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allUsers]);

  const handleAdd = (userId: string) => {
    if (!selectedUsers.includes(userId)) {
      onChange([...selectedUsers, userId]);
      setSearch(""); // אפס חיפוש אחרי הוספה
    }
  };

  const handleRemove = (userId: string) => {
    onChange(selectedUsers.filter((id) => id !== userId));
  };

  const selectedUserObjects = allUsers.filter((u) => selectedUsers.includes(u.id));

  if (isLoading) return <p>טוען משתמשים...</p>;
  if (error) return <p>שגיאה בטעינת המשתמשים</p>;

  return (
    <div style={{ direction: "rtl", maxWidth: "600px", margin: "auto" }}>
      {/* טוקנים של משתמשים שנבחרו */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "1rem",
        minHeight: "50px"
      }}>
        {selectedUserObjects.map((user) => (
          <div key={user.id} style={{
            background: "#e0e0e0",
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
          }}>
            <span>{user.firstName} {user.lastName}</span>
            <button
              onClick={() => handleRemove(user.id)}
              style={{
                marginRight: "0.5rem",
                background: "transparent",
                border: "none",
                cursor: "pointer"
              }}
            >✕</button>
          </div>
        ))}
      </div>

      {/* שורת חיפוש */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="הקלד שם משתמש לחיפוש..."
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px"
        }}
      />

      {/* רשימת תוצאות */}
      <div style={{
        maxHeight: "300px",
        overflowY: "auto",
        borderTop: "1px solid #eee"
      }}>
        {filteredUsers.map((user) => {
          const isSelected = selectedUsers.includes(user.id);
          return (
            <div
              key={user.id}
              onClick={() => handleAdd(user.id)}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                backgroundColor: isSelected ? "#f0f0f0" : "#fff",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}
            >
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#999",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}>
                {user.firstName?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{user.firstName} {user.lastName}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>{user.email}</div>
              </div>
              {isSelected && <div style={{ color: "green" }}>✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserMultiSelectList;
