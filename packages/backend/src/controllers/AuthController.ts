import { Request, Response } from "express";
import { userService } from "../services/UserService";
import { createJwtForUser } from '../services/jwtService';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { userName, password } = req.body;

      if (!userName || !password) {
        return res.status(400).json({
          success: false,
          message: "שם משתמש וסיסמה נדרשים",
        });
      }

      const result = await userService.login(userName, password);

      return res.json({
        success: true,
        message: "התחברת בהצלחה",
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "שגיאה בהתחברות",
      });
    }
  },

  async googleLogin(req: Request, res: Response) {
    try {
      const { idToken, user } = req.body;

      if (!user || !user.email) {
        throw new Error('No user data provided');
      }

      try {
        const existingUser = await userService.getUserByEmail(user.email);
        if (!existingUser) {
          throw new Error('User not found');
        }

        const token = createJwtForUser(existingUser);
        
        res.json({ 
          success: true, 
          data: { user: existingUser, token },
          isNewUser: false
        });
      } catch (dbError) {
        
        const userData = {
          id: user.uid || `google_${user.email}`,
          email: user.email,
          first_name: user.displayName?.split(' ')[0] || '',
          last_name: user.displayName?.split(' ').slice(1).join(' ') || '',
          role: 'student',
          is_active: true,
          group: '',
          phone: '',
        };

        res.json({ 
          success: true, 
          data: { user: userData },
          isNewUser: true,
          message: 'User needs to complete registration'
        });
      }
    } catch (error: any) {
      console.error('🔴 [Google Login] Error:', error);
      res.status(401).json({ 
        success: false, 
        message: 'Google login failed', 
        error: error.message 
      });
    }
  },

  async githubLogin(req: Request, res: Response) {
    try {
      const { idToken, user } = req.body;

      if (!user || !user.email) {
        throw new Error('No user data provided');
      }

      try {
        const existingUser = await userService.getUserByEmail(user.email);
        if (!existingUser) {
          throw new Error('User not found');
        }

        const token = createJwtForUser(existingUser);

        res.json({
          success: true,
          data: { user: existingUser, token },
          isNewUser: false
        });
      } catch (dbError) {

        const userData = {
          id: user.uid || `github_${user.email}`,
          email: user.email,
          first_name: user.displayName?.split(' ')[0] || '',
          last_name: user.displayName?.split(' ').slice(1).join(' ') || '',
          role: 'student',
          is_active: true,
          group: '',
          phone: '',
        };

        res.json({
          success: true,
          data: { user: userData },
          isNewUser: true,
          message: 'User needs to complete registration'
        });
      }
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: 'GitHub login failed',
        error: error.message
      });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'יש לספק כתובת מייל.' });
    }
    try {
      // שימוש ב-Supabase לשליחת מייל איפוס
      const { error } = await require('../config/supabaseConfig').supabase.auth.api.resetPasswordForEmail(email, {
        redirectTo: process.env.PASSWORD_RESET_REDIRECT_URL || undefined
      });
      if (error) {
        return res.status(400).json({ success: false, message: 'שגיאה בשליחת מייל איפוס.' });
      }
      return res.json({ success: true, message: 'אם כתובת המייל קיימת, נשלח קישור לאיפוס סיסמה.' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'שגיאה בשרת.' });
    }
  },
}; 