import { Request, Response } from "express";
import { userService } from "../services/UserService";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import csvParser from 'csv-parser';
import { supabase } from '../config/supabaseConfig';

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

export class UserController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ success: false, message: "חובה להזין אימייל וסיסמה" });

      const user = await userService.getUserByEmail(email);
      if (!user)
        return res.status(401).json({ success: false, message: "אימייל או סיסמה שגויים" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ success: false, message: "אימייל או סיסמה שגויים" });

      const token = jwt.sign(
        {  role: user.role, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        message: "התחברות הצליחה",
        data: {
        // id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }
      });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "שגיאה בשרת" });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? 
        error.message : "Unknown error" });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const user = await userService.getUserById(id);
      if (!user)
        return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, data: user });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    try {
      const email = req.params.email;
      const user = await userService.getUserByEmail(email);
      if (!user)
        return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, data: user });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Unknown error" });
    }
  }

async createUser(req: Request, res: Response) {
  console.log("📥 Received POST request:", req.body);
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      createdAt = new Date().toISOString(),
    } = req.body;

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "אימייל כבר קיים" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userService.createUser({
  firstName,
  lastName,
  email,
  password: hashedPassword,
  phone,
   role: 'student', // Default role, can be changed later
  createdAt: new Date()
});


    res.status(201).json({
      success: true,
      message: `המשתמש ${firstName} נוצר בהצלחה`,
    });

  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ success: false, message: "אירעה שגיאה ביצירת המשתמש" });
  }
}


  async updateUser(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const updatedUser = await userService.updateUser(id, req.body);
      if (!updatedUser)
        return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, data: updatedUser });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Unknown error" });
    }
  }
  async getAllEmails(req: Request, res: Response) {
  try {
    const { data, error } = await supabase.from("users").select("email");
    if (error) throw error;
    const emails = data?.map(user => user.email) || [];
    res.json({ success: true, emails });
  } catch (error: unknown) {
    console.log("שגיאת קונטרולר:", error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}
async importUsers(req: MulterRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "לא הועלה קובץ" });
      }

      const users: any[] = [];

      // קריאת הקובץ וניתוח תוכנו
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (row) => {
          users.push(row);
        })
        .on('end', async () => {
          let successCount = 0;
          let failureCount = 0;
          const errors = [];

          for (const user of users) {
            const { firstName, lastName, email, phone, password, role } = user;

            // בדיקות שדות חובה
            if (!email || !password || !firstName || !lastName) {
              failureCount++;
              errors.push(`שגיאה ב-${email || "קובץ חסר אימייל"}: שדות חובה חסרים`);
              continue;
            }

            // בדיקת תקינות אימייל
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              failureCount++;
              errors.push(`שגיאה ב-${email}: פורמט אימייל לא תקין`);
              continue;
            }

            // בדיקת תקינות סיסמה
            if (password.length < 8) {
              failureCount++;
              errors.push(`שגיאה ב-${email}: סיסמה קצרה מדי`);
              continue;
            }

            // בדיקת משתמש קיים
            const { data: existingUser } = await supabase
              .from('users')
              .select('email')
              .eq('email', email)
              .maybeSingle();

            if (existingUser) {
              failureCount++;
              errors.push(`שגיאה ב-${email}: משתמש כבר קיים`);
              continue;
            }

            // הצפנת סיסמה
            const hashedPassword = await bcrypt.hash(password, 12);

            // הוספת משתמש חדש
            const { error: insertError } = await supabase
              .from('users')
              .insert([{
                firstName,
                lastName,
                email,
                phone: phone || null,
                role: role || 'student',
                password: hashedPassword,
                createdAt: new Date()
              }]);

            if (insertError) {
              failureCount++;
              errors.push(`שגיאה ב-${email}: ${insertError.message}`);
              continue;
            }

            successCount++;
          }

          // מחיקת הקובץ לאחר סיום העיבוד
          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            message: `ייבוא הושלם: הצלחות: ${successCount}, כישלונות: ${failureCount}`,
            errors,
          });
        });

    } catch (error) {
      console.error("Import users error:", error);
      res.status(500).json({ success: false, message: "שגיאה בייבוא המשתמשים" });
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const success = await userService.deleteUser(id);
      if (!success)
        return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, message: "User deleted" });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error 
        ? error.message : "Unknown error" });
    }
  }
}

export const userController = new UserController();