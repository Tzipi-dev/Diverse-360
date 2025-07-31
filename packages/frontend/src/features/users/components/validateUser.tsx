
import { User } from "../usersTypes";

interface ValidationErrors {
  [key: string]: string;
}

interface ValidateUserParams {
  user: Partial<User>;
  isNewUser?: boolean; // כדי לבדוק סיסמה רק בהוספה
  existingEmails?: Set<string>; // כדי לבדוק מיילים כפולים
}

export function validateUser({ user, isNewUser = true, existingEmails }: ValidateUserParams): ValidationErrors {
  const errs: ValidationErrors = {};

  // first_name
  if (!user.firstName) {
    errs.first_name = "שם פרטי חובה";
  } else if (user.firstName.length < 2) {
    errs.first_name = "שם פרטי חייב להכיל לפחות 2 תווים";
  } else if (!/^[A-Za-zא-ת\s]+$/.test(user.firstName)) {
    errs.first_name = "שם פרטי חייב להכיל אותיות ורווחים בלבד";
  }

  // last_name
  if (!user.lastName) {
    errs.last_name = "שם משפחה חובה";
  } else if (user.lastName.length < 2) {
    errs.last_name = "שם משפחה בם";
  } else if (!/^[A-Za-zא-ת\s]+$/.test(user.lastName)) {
    errs.last_name = "שם משפחה חייב להכיל אותיות ורווחים בלבד";
  }

  // email
  if (!user.email) {
    errs.email = "אימייל חובה";
  } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
    errs.email = "פורמט אימייל לא תקין";
  } else if (existingEmails?.has(user.email.toLowerCase())) {
    errs.email = "אימייל כבר קיים במערכת";
  }

  // password (רק בהוספה)
  if (isNewUser) {
    if (!user.password) {
      errs.password = "סיסמה חובה";
    } else {
      if (user.password.length < 8) {
        errs.password = "הסיסמה חייבת להיות לפחות 8 תווים";
      } else {
        if (!/[A-Z]/.test(user.password)) errs.password = "הסיסמה חייבת לכלול לפחות אות גדולה אחת";
        if (!/[a-z]/.test(user.password)) errs.password = "הסיסמה חייבת לכלול לפחות אות קטנה אחת";
        if (!/[0-9]/.test(user.password)) errs.password = "הסיסמה חייבת לכלול לפחות ספרה אחת";
        if (!/[\W_]/.test(user.password)) errs.password = "הסיסמה חייבת לכלול לפחות תו מיוחד אחד";
      }
    }
  }

  // phone
  if (!user.phone) {
    errs.phone = "טלפון חובה";
  } else if (!/^\d{10}$/.test(user.phone)) {
    errs.phone = "מספר טלפון חייב להכיל 10 ספרות בדיוק";
  }

  // role
  if (!user.role) {
    errs.role = "תפקיד חובה";
  }

  return errs;
}