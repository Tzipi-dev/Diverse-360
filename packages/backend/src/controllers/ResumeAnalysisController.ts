import { Request, Response } from 'express';
import { parseResumeText } from '../services/resumeParserService';
import { analyzeResume } from '../services/resumeAnalysisService';
import { jobService } from '../services/JobService';
import { supabase } from '../config/supabaseConfig';
import { Job } from '../models/JobModel'; // נדרש לטיפוס Job

// export const handleResumeAnalysis = async (req: Request, res: Response) => {
//   if (!req.file) return res.status(400).json({ message: "חסר קובץ" });

//   try {
//     console.log('----------- Starting resume analysis and job matching -----------');
    
//     const text = await parseResumeText(req.file.buffer, req.file.mimetype);
//     console.log('Parsed resume text (first 200 chars):', text.slice(0, 200));

//     const jsonStringFromAI = await analyzeResume(text); 
//     if (!jsonStringFromAI) {
//         throw new Error("ניתוח קורות חיים לא הצליח להחזיר נתונים מה-AI.");
//     }
//     const analysisResult = JSON.parse(jsonStringFromAI);

//     const allJobs = await jobService.getAllJobs();
//     console.log(`Fetched ${allJobs.length} available jobs.`);

//     const matchedJobs = performJobMatching(analysisResult, allJobs);
//     console.log(`Found ${matchedJobs.length} matching jobs.`);

//     const resumeId = req.body.resumeId;
//     const userId = req.body.userId; 

//     if (resumeId) {
//         const { data, error } = await supabase
//             .from('resumes')
//             .update({
//                 skills: analysisResult.skills?.technical || [], 
//                 experience_years: getExperienceYearsFromAnalysis(analysisResult), 
//                 suggested_jobs: matchedJobs 
//             })
//             .eq('id', resumeId);

//         if (error) {
//             console.error("שגיאה בעדכון Supabase:", error);
//             throw new Error(`שגיאה בעדכון מסד הנתונים: ${error.message}`);
//         }
//         console.log("✅ Resume record updated in Supabase.");
//     } else {
//         console.warn("No resumeId provided in request body. Skipping Supabase update for skills, experience, and suggested_jobs.");
//     }

//     res.json({ 
//         success: true, 
//         analysis: analysisResult, 
//         matchedJobs: matchedJobs 
//     });

//   } catch (err: any) {
//     console.error("שגיאה בניתוח קורות חיים או התאמת משרות:", err);
//     res.status(500).json({ success: false, message: err.message || 'שגיאת שרת פנימית בניתוח קורות חיים' });
//   }
// };


export const handleResumeAnalysis = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "חסר קובץ" });

  try {
    console.log('file:', req.file);
    console.log('body:', req.body);
    console.log('----------- Starting resume analysis -----------');

    const text = await parseResumeText(req.file.buffer, req.file.mimetype);
    console.log('Parsed resume text:', text);

    const feedback = await analyzeResume(text);
    console.log('AI feedback:', feedback);
    
    res.json({ success: true, analysis: feedback });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

function getExperienceYearsFromAnalysis(analysis: any): number | null {
    const experienceLevel = analysis.experience_level_extracted?.toLowerCase();

    switch (experienceLevel) {
        case 'entry-level': return 0;
        case 'junior': return 1;
        case 'mid-level': return 3;
        case 'senior': return 5; 
        case 'no experience': return 0;
        default: return null; 
    }
}

function cleanAndSplitText(text: string): Set<string> {
    if (!text) return new Set();
    const cleanedText = String(text).replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase(); 
    const words = cleanedText.split(/\s+/).filter(word => word.length > 1); 
    return new Set(words);
}

// ** פונקציית checkExperienceMatchInText משופרת עוד יותר **
function checkExperienceMatchInText(userExpLevel: string, jobText: string): boolean {
    const lowerJobText = String(jobText).toLowerCase();

    const includesKeywords = (text: string, keywords: string[]): boolean => {
        return keywords.some(keyword => text.includes(keyword));
    };

    // פונקציית עזר לבדיקת טווחים מספריים
    const checkNumericalRange = (text: string, minUserExp: number, maxUserExp: number): boolean => {
        // Regex לזיהוי מספרים או טווחים כמו "1-3 שנים", "5+ שנים", "שנתיים", "שנה"
        const matches = text.match(/(\d+)(?:-(\d+))?\s*(?:שנים|שנה|years|year|\+)?/g);
        if (!matches) return false;

        for (const match of matches) {
            const numbers = match.match(/\d+/g)?.map(Number);
            if (!numbers || numbers.length === 0) continue;

            const num1 = numbers[0];
            const num2 = numbers.length > 1 ? numbers[1] : num1; // אם יש רק מספר אחד, טפל בו כטווח של עצמו

            // טווח המשרה: [minJobExp, maxJobExp]
            let minJobExp = num1;
            let maxJobExp = num2;

            if (match.includes('+')) { // כמו "5+ שנים"
                minJobExp = num1;
                maxJobExp = Infinity;
            } else if (match.includes('-')) { // כמו "1-3 שנים"
                minJobExp = Math.min(numbers[0], numbers[1]);
                maxJobExp = Math.max(numbers[0], numbers[1]);
            } else if (match.includes('שנתיים') || match.includes('two years')) {
                minJobExp = 2; maxJobExp = 2;
            } else if (match.includes('שנה') || match.includes('one year')) {
                minJobExp = 1; maxJobExp = 1;
            }
            
            // בדיקה אם טווח הניסיון של המשתמש (minUserExp, maxUserExp) חופף לטווח המשרה
            // חפיפה מתרחשת אם:
            // (minUserExp <= maxJobExp) AND (maxUserExp >= minJobExp)
            if (minUserExp <= maxJobExp && maxUserExp >= minJobExp) {
                return true;
            }
        }
        return false;
    };

    let minUserExp = 0, maxUserExp = 0;

    switch (userExpLevel) {
        case 'senior': minUserExp = 5; maxUserExp = Infinity; break;
        case 'mid-level': minUserExp = 2; maxUserExp = 4; break; // טווח מוגדר יותר למיד-לבל
        case 'junior': minUserExp = 0; maxUserExp = 1; break;
        case 'entry-level': minUserExp = 0; maxUserExp = 0; break;
        case 'no experience': minUserExp = 0; maxUserExp = 0; break;
        case 'not specified': return true; // אם לא צוין, נניח התאמה כללית
        default: return true; // ברירת מחדל: התאמה אם לא ידוע
    }

    // בדיקת מילות מפתח מפורשות
    if (userExpLevel === 'senior' && includesKeywords(lowerJobText, ['senior', 'בכיר', 'lead developer', 'architect'])) return true;
    if (userExpLevel === 'mid-level' && includesKeywords(lowerJobText, ['mid-level', 'בינוני', 'מנוסה', 'experienced developer'])) return true;
    if ((userExpLevel === 'junior' || userExpLevel === 'entry-level' || userExpLevel === 'no experience') && includesKeywords(lowerJobText, ['junior', 'entry-level', 'זוטר', 'התחלתי', 'בוגר', 'graduate', 'ללא ניסיון'])) return true;

    // בדיקת טווחים מספריים
    return checkNumericalRange(lowerJobText, minUserExp, maxUserExp);
}


function performJobMatching(analysis: any, allJobs: Job[]): Job[] { 
    const matched: Job[] = [];
    const userTechnicalSkills = new Set(
        (analysis.skills?.technical || [])
            .filter((s: any) => typeof s === 'string') 
            .map((s: string) => s.toLowerCase())
    );
    const userExperienceLevel = analysis.experience_level_extracted?.toLowerCase();

    console.log(`--- Starting Job Matching for User Experience: ${userExperienceLevel} ---`);
    console.log('User Technical Skills:', Array.from(userTechnicalSkills).join(', '));

    allJobs.forEach(job => {
        const jobCombinedText = `${job.title || ''} ${job.description || ''} ${job.location || ''} ${job.requirements || ''}`;
        const lowerJobCombinedText = String(jobCombinedText).toLowerCase(); 

        let skillMatchScore = 0;
        (userTechnicalSkills ?? []).forEach(userSkill => {
            if (typeof userSkill === 'string' && lowerJobCombinedText.includes(userSkill)) { 
                skillMatchScore++;
            }
        });

        const experienceMatch = checkExperienceMatchInText(userExperienceLevel, jobCombinedText);
        
        console.log(`Job: "${job.title}" (ID: ${job.id.substring(0, 8)}...)`);
        console.log(`  Skill Match Score: ${skillMatchScore}`);
        console.log(`  Experience Match: ${experienceMatch}`);
        
        if (skillMatchScore >= 2 && experienceMatch) { 
            matched.push(job);
            console.log(`  ✅ Job Matched!`);
        } else {
            console.log(`  ❌ Job NOT Matched (Skill Score: ${skillMatchScore}, Experience Match: ${experienceMatch})`);
        }
    });

    return matched;
}