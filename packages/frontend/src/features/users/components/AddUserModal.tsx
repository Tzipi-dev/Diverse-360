import React, { useState, useEffect } from "react";
import { Box, Button, TextField, MenuItem, Typography } from "@mui/material";
import { User } from "../usersTypes";
import { validateUser } from "./validateUser";

interface Props {
  initialData?: User | null;
  onSave: (data: Partial<User>) => void;
  onCancel: () => void;
}
const roles = [
  { value: "student", label: "סטודנט" },
  { value: "manager", label: "מנהל" },
];

export default function AddUserModal({ initialData, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "student",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const validate = () => {
    const errs = validateUser({ user: form, isNewUser: !initialData });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onChange = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
  };

  const onSubmit = () => {
    if (!validate()) return;
    onSave(form);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6">{initialData ? "ערוך משתמש" : "הוסף משתמש חדש"}</Typography>
      <TextField
        label="שם פרטי"
        value={form.firstName || ""}
        onChange={onChange("firstName")}
        error={!!errors.first_name}
        helperText={errors.first_name}
        fullWidth
      />
      <TextField
        label="שם משפחה"
        value={form.lastName || ""}
        onChange={onChange("lastName")}
        error={!!errors.last_name}
        helperText={errors.last_name}
        fullWidth
      />
      <TextField
        label="אימייל"
        value={form.email || ""}
        onChange={onChange("email")}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        type="email"
      />
      <TextField
        label="טלפון"
        value={form.phone || ""}
        onChange={onChange("phone")}
        error={!!errors.phone}
        helperText={errors.phone}
        fullWidth
      />
      <TextField
        select
        label="תפקיד"
        value={form.role || ""}
        onChange={onChange("role")}
        error={!!errors.role}
        helperText={errors.role}
        fullWidth
      >
        {roles.map(r => (
          <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
        ))}
      </TextField>
      {!initialData && (
        <TextField
          label="סיסמה"
          value={form.password || ""}
          onChange={onChange("password")}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          type="password"
        />
      )}
      <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
        <Button variant="outlined" onClick={onCancel}>בטל</Button>
        <Button variant="contained" onClick={onSubmit}>{initialData ? "עדכן" : "הוסף"}</Button>
      </Box>
    </Box>
  );
}