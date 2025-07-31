// import { Request } from 'express';
// import { v4 as uuidv4 } from 'uuid';
// import { supabase } from '../config/supabaseConfig';
// import { uploadFile, deleteFile, downloadFile } from './supabaseUploadIntoStorageService';
// import { Resume } from '../models/ResumeModel';
// import { log } from 'node:console';
// import { generateEmbedding } from "../services/embeddingService";
// import { parseResumeText } from './resumeParserService';
// import { OpenAI } from "openai";
// const BUCKET_NAME = 'user-files-uploads';
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_KEY,
// });
// function isNumberArray(arr: any): arr is number[] {
//     return Array.isArray(arr) && arr.every(num => typeof num === 'number');
// }
// export const handleUpload = async (req: Request) => {
//     console.log("----------- Starting file upload -----------");
//     const file = req.file;
//     const jobId = req.body.job_id;
//     const userName = req.body.user_name || 'Anonymous'; // הוספנו לקבל שם משתמש
//     const userEmail = req.body.user_email || 'anonymous@example.com'; // הוספנו לקבל אימייל משתמש

//     if (!file || !jobId) {
//         throw new Error("חסר קובץ או מזהה משרה");
//     }

//     const fileId = uuidv4();
//     const extension = file.originalname.split('.').pop();
//     const filePath = `resumes/${jobId}/${fileId}.${extension}`;
//     try {
//         console.log("📥 Uploading file to Supabase:", filePath);
//         await uploadFile(BUCKET_NAME, filePath, file.buffer, file.mimetype);
//         console.log("----------- File uploaded successfully -----------");
//     } catch (e) {
//         console.error("❌ Error in uploadFile:", e);
//     }
//     // העלאה ל-storage
//     // ניתוח הטקסט מתוך הקובץ
//     if (!file.mimetype) {
//         throw new Error("File mimetype is missing");
//     }
//     const text = await parseResumeText(file.buffer, file.mimetype);
//     // יצירת embedding
//     const embeddingRaw = await generateEmbedding(text);
//     // לוג ראשון לפני המרה
//     log("Raw embedding from generateEmbedding:", embeddingRaw);
//     // המרה אם צריך (מחרוזת JSON => מערך)
//     const embedding = typeof embeddingRaw === 'string' ? JSON.parse(embeddingRaw) : embeddingRaw;
//     // בדיקת טיפוס מערך מספרים
//     if (!isNumberArray(embedding)) {
//         throw new Error('Embedding חייב להיות מערך של מספרים בלבד');
//     }
//     log("Validated embedding length:", embedding.length);
//     // יצירת רשומה בהתאם לטיפוס Resume, כולל שם ואימייל
//     const newResume: Resume = {
//         id: fileId,
//         job_id: jobId,
//         file_path: filePath,
//         uploaded_at: new Date().toISOString(),
//         embedding,
//         user_name: userName,
//         user_email: userEmail,
//     };
//     try {
//         const { error } = await supabase.from('resumes').insert([newResume]);
//         if (error) throw error;
//         console.log("✅ Resume inserted into DB");
//     } catch (e) {
//         console.error("❌ Error inserting resume:", e);
//     }
//     return { file_path: filePath };
// };
// export const handleDelete = async (filePath: string) => {
//     if (!filePath) throw new Error("לא נשלח path");
//     await deleteFile(BUCKET_NAME, filePath);
// };
// export const handleDownload = async (filePath: string) => {
//     if (!filePath) throw new Error("לא נשלח path");
//     return await downloadFile(BUCKET_NAME, filePath);
// };

// // --- פונקציה חדשה לשליפת קורות חיים לפי job_id ---
// export const getResumesByJobId = async (jobId: string): Promise<Resume[]> => {
//     console.log(`Fetching resumes for job ID: ${jobId}`);
//     const { data, error } = await supabase
//         .from('resumes')
//         .select('*')
//         .eq('job_id', jobId);

//     if (error) {
//         console.error(`Error fetching resumes for job ${jobId}:`, error);
//         throw new Error(`Error fetching resumes: ${error.message}`);
//     }
//     console.log(`Found ${data ? data.length : 0} resumes for job ID: ${jobId}`);
//     return data as Resume[];

// };

// backend/src/services/ResumeService.ts
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabaseConfig';
import { uploadFile, deleteFile, downloadFile, getFilePublicUrl } from './supabaseUploadIntoStorageService';
import { Resume } from '../models/ResumeModel';
import { log } from 'node:console';
import { generateEmbedding } from "../services/embeddingService";
import { parseResumeText } from './resumeParserService';
import { OpenAI } from "openai";
import { userService } from './UserService';

const BUCKET_NAME = 'user-files-uploads';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

function isNumberArray(arr: any): arr is number[] {
    return Array.isArray(arr) && arr.every(num => typeof num === 'number');
}

export const handleUpload = async (req: Request, file: Express.Multer.File, userId?: string) => {
    // console.log('📥 Uploaded by user:', req.user);
    console.log("----------- Starting file upload -----------");
    console.log("🔐 userId received in handleUpload:", userId);
    const jobId = req.body.job_id;
    const wantsEmail = req.body.wantsEmail === 'true';

    let userName = 'מועמד/ת אנונימי/ת';
    let userEmail = 'anonymous@example.com';

    // אם קיבלנו מזהה משתמש מהטוקן
    if (userId) {
        const userProfile = await userService.getUserById(userId); // שימוש ב-Service הקיים
        if (userProfile) {
            userName = `${userProfile.firstName} ${userProfile.lastName}`;
            userEmail = userProfile.email;
            console.log(`✅ User ${userId} details found: Name=${userName}, Email=${userEmail}`);
        } else {
            console.warn(`⚠️ User profile not found for ID: ${userId}. Using default values.`);
        }
    } else {
        console.warn("⚠️ No user ID provided. Using default values for name and email.");
    }

    if (!file || !jobId) {
        throw new Error("חסר קובץ או מזהה משרה");
    }
    const fileId = uuidv4();
    const extension = file.originalname.split('.').pop();
    const filePath = `resumes/${jobId}/${fileId}.${extension}`;

    try {
        console.log("📥 Uploading file to Supabase:", filePath);
        await uploadFile(BUCKET_NAME, filePath, file.buffer, file.mimetype);
        console.log("----------- File uploaded successfully -----------");
    } catch (e) {
        console.error("❌ Error in uploadFile:", e);
        throw new Error("שגיאה בהעלאת קובץ לשרת אחסון.");
    }

    if (!file.mimetype) {
        throw new Error("File mimetype is missing");
    }

    const text = await parseResumeText(file.buffer, file.mimetype);
    const embeddingRaw = await generateEmbedding(text);
    log("Raw embedding from generateEmbedding:", embeddingRaw);

    const embedding = typeof embeddingRaw === 'string' ? JSON.parse(embeddingRaw) : embeddingRaw;

    if (!isNumberArray(embedding)) {
        throw new Error('Embedding חייב להיות מערך של מספרים בלבד');
    }

    log("Validated embedding length:", embedding.length);

    const newResume: Resume = {
        id: fileId,
        job_id: jobId,
        file_path: filePath,
        uploaded_at: new Date().toISOString(),
        embedding,
        user_id: userId, // <-- שמירת ה-userId
        file_name: file.originalname,
        wants_email: wantsEmail,
    };

    // try {
    //     console.log("📄 Attempting to insert resume into DB. Payload:");
    //     console.log(JSON.stringify(newResume, null, 2));
    //     const { error } = await supabase.from('resumes').insert([newResume]);
    //     if (error) throw error;
    //     console.log("✅ Resume inserted into DB");
    // } catch (e) {
    //     console.error("❌ Error inserting resume:", e);
    //     throw new Error("שגיאה בשמירת פרטי קורות החיים במסד הנתונים.");
    //     console.log(JSON.stringify(e, null, 2));
    // }
    try {
        console.log("📄 Attempting to insert resume into DB. Payload:");
        console.log(JSON.stringify(newResume, null, 2));

        const { error } = await supabase.from('resumes').insert([newResume]);

        if (error) {
            console.error("❌ Supabase insert error:", JSON.stringify(error, null, 2));
            throw error;
        }

        console.log("✅ Resume inserted into DB");
    } catch (e) {
        console.error("❌ Error inserting resume:", e);
        throw new Error("שגיאה בשמירת פרטי קורות החיים במסד הנתונים.");
    }
    return { file_path: filePath };
};

export const handleDelete = async (filePath: string) => {
    if (!filePath) throw new Error("לא נשלח path");
    await deleteFile(BUCKET_NAME, filePath);
};

export const handleDownload = async (filePath: string) => {
    if (!filePath) throw new Error("לא נשלח path");
    return await downloadFile(BUCKET_NAME, filePath);
};

// --- פונקציה חדשה לשליפת קורות חיים לפי job_id עם צירוף נתונים של משתמש ---
export const getResumesByJobId = async (jobId: string): Promise<Resume[]> => {
    console.log(`[ResumeService] Fetching resumes for job ID: ${jobId}`); //
    try {
        const { data, error } = await supabase
            .from('resumes')
            .select(`
                *,
                user:users!user_id (id, first_name, last_name, email)
            `)
            .eq('job_id', jobId);

        if (error) {
            console.error(`[ResumeService] Error fetching resumes for job ${jobId}:`, error); //
            // חשוב: זרוק שגיאה עם הודעה שתעזור באיתור הבעיה ב-frontend.
            throw new Error(`Failed to fetch resumes: ${error.message}`);
        }

        console.log(`[ResumeService] Raw data from Supabase:`, data); //

        const formattedResumes: Resume[] = data.map((item: any) => {
            const user = item.user;
            return {
                ...item,
                user_id: user?.id || null,
                user_name: user ? `${user.first_name} ${user.last_name}` : item.user_name || 'מועמד/ת אנונימי/ת',
                user_email: user?.email || item.user_email || 'anonymous@example.com'
            };
        });

        console.log(`[ResumeService] Found ${formattedResumes ? formattedResumes.length : 0} resumes for job ID: ${jobId}`); //
        return formattedResumes;
    } catch (err: any) {
        console.error(`[ResumeService] Caught error in getResumesByJobId:`, err.message); //
        throw err; // זרוק את השגיאה הלאה כדי שהקונטרולר יתפוס אותה
    }
};

// --- פונקציה חדשה ב-service להשגת URL ציבורי של קובץ ---
export const getPublicUrl = async (filePath: string): Promise<string | null> => {
    try {
        const { data } = await supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        if (data && data.publicUrl) {
            return data.publicUrl;
        }
        return null;
    } catch (e) {
        console.error("Error getting public URL:", e);
        return null;
    }
};