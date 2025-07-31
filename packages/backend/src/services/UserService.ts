import { createClient } from "@supabase/supabase-js";
import { User } from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return (data as User[]) || [];
  },

  // async getUserById(id: string): Promise<User | null> {
  //   const { data, error } = await supabase
  //     .from("users")
  //     .select("*")
  //     .eq("id", id)
  //     .maybeSingle();
  //   if (error) throw error;
  //   return data as User | null;
  // },
      getUserById: async (userId: string) => {
        console.log(`[UserService] Attempting to fetch user with ID: ${userId}`);
        const { data, error } = await supabase
            .from('users') // ודא שזה שם טבלת המשתמשים הנכון שלך
            .select('id, firstName, lastName, email')
            .eq('id', userId)
            .single();

        if (error) {
            console.error(`[UserService] Error fetching user ${userId}:`, error.message);
            return null;
        }
        if (!data) {
            console.warn(`[UserService] No user found for ID: ${userId}`);
            return null;
        }
        console.log(`[UserService] User found:`, data);
        return data;
    },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;
    return data as User | null;
  },

  async getAllEmails(): Promise<string[]> {
    const { data, error } = await supabase.from("users").select("email");
    if (error) {
      console.error("❌ Error fetching emails:", error);
      throw error;
    }
    return data?.map((user) => user.email) || [];
  },

  async createUser(newUser: Omit<User, "id">): Promise<void> {
    const userToInsert = {
      first_name: newUser.firstName,
      last_name: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
      phone: newUser.phone,
      role: newUser.role,
      created_at: newUser.createdAt.toISOString(),
    };

    const { error } = await supabase.from("users").insert([userToInsert]);
    if (error) {
      console.error("❌ Error in createUser:", error);
      throw error;
    }

    console.log("✅ User inserted successfully");
  },

  async updateUser(id: string, updates: Partial<Omit<User, "id">>): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      if (error.message.includes("No rows found")) return null;
      throw error;
    }
    return data as User;
  },

  async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      if (error.message.includes("No rows found")) return false;
      throw error;
    }
    return true;
  },

  async login(userName: string, password: string): Promise<{ user: User; token: string }> {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", userName)
      .maybeSingle();

    if (error) throw new Error("שגיאה בחיפוש המשתמש");
    if (!user) throw new Error("משתמש לא נמצא");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error("סיסמה שגויה");

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  },
};
