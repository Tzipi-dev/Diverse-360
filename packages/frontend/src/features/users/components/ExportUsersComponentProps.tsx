import React from "react";
import { Button } from "@mui/material";
import { User } from "../usersTypes";

interface Props {
  users: User[];
}

export default function ExportCsvButton({ users }: Props) {
  const exportToCSV = () => {
    // כותרות הטבלה
    const headers = ["שם פרטי", "שם משפחה", "אימייל", "טלפון", "תפקיד"];
    
    // הכנת הנתונים
    const csvData = users.map(user => [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.role === "manager" ? "מנהל" : "סטודנט"
    ]);
    
    // יצירת תוכן CSV
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => 
        row.map(cell => `"${cell}"`).join(",")
      )
    ].join("\n");
    
    // יצירת קובץ עם BOM לתמיכה בעברית
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { 
      type: "text/csv;charset=utf-8;" 
    });
    
    // הורדת הקובץ
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "users-list.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <Button 
      variant="outlined" 
      onClick={exportToCSV}
      color="secondary"
    >
      ייצוא משתמשים
    </Button>
  );
}