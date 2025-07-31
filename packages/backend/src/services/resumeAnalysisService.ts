// import { OpenAI } from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_KEY,
// });

// export const analyzeResume = async (text: string): Promise<string | undefined> => {
//   try {

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // או "gpt-4" אם יש לך גישה ורוצה תוצאות טובות יותר
//       messages: [
//         {
//           role: "system",
//           content: `אתה מומחה קורות חיים שמבצע ניתוח עומק על מסמך המועמד. עליך לנתח את קורות החיים ולחלץ מידע מפתח בפורמט JSON בלבד. אל תציע שיפורים גנריים אלא קרא היטב את המסמך ונתח את התוכן הנתון. אם נתון מסוים חסר או לא רלוונטי, ציין זאת.
//           הכישורים צריכים להיות מפורטים כרשימת מילים/ביטויים נפוצים בתעשייה (לדוגמה: React, Node.js, Python, SQL, AWS, Docker, Kubernetes).
//           רמת הניסיון צריכה להיות אחת מהבאות: "Junior", "Mid-level", "Senior", "Entry-level", "No experience", "Not specified".`
//         },
//         {
//           role: "user",
//           content: `
// קובץ קורות החיים:
// ---
// ${text}
// ---

// על בסיס קורות החיים הנ"ל, אנא ספק ניתוח מפורט בפורמט JSON הבא:
// {
//   "personal_info": {
//     "name": "שם פרטי של המועמד",
//     "email": "כתובת מייל (אם נמצאה)",
//     "phone": "מספר טלפון (אם נמצא)"
//   },
//   "summary": "סיכום אישי/פרופיל מקצועי מקורות החיים (אם קיים)",
//   "skills": {
//     "technical": ["כישרון טכני 1", "כישרון טכני 2", "כישרון טכני 3"],
//     "soft": ["כישרון רך 1", "כישרון רך 2"]
//   },
//   "experience_level_extracted": "רמת ניסיון כללית שזוהתה מקורות החיים (לדוגמה: Junior, Mid-level, Senior, Entry-level, No experience, Not specified)",
//   "experience_summary": [
//     {
//       "title": "תפקיד",
//       "company": "חברה",
//       "duration": "משך תפקיד (לדוגמה: 2023-2025)",
//       "description_summary": "סיכום קצר של האחריות וההישגים"
//     }
//   ],
//   "education": [
//     {
//       "degree": "תואר/תעודה",
//       "institution": "מוסד לימודים",
//       "year": "שנת סיום/שנים"
//     }
//   ],
//   "languages": ["שפה 1", "שפה 2"],
//   "projects": [
//     {
//       "name": "שם הפרויקט",
//       "description": "תיאור קצר"
//     }
//   ],
//   "overall_feedback": {
//     "strengths": ["נקודת חוזקה 1", "נקודת חוזקה 2"],
//     "missing_critical_elements": ["האם חסר משהו קריטי, כגון כותרת או ניסיון?"],
//     "unnecessary_content": ["האם יש תוכן מיותר?"],
//     "structure_clarity": "הערה על בהירות המבנה והכותרות",
//     "suitability_for_software_dev": "האם ניכרת התאמה כללית לתחום פיתוח תוכנה (High/Medium/Low/Not specified)?",
//     "suggestions_for_improvement": ["הצעת שיפור 1", "הצעת שיפור 2"]
//   }
// }
// חשוב מאוד: התשובה חייבת להיות אובייקט JSON תקני בלבד, ללא טקסט נוסף לפני או אחרי.
// `
//         }
//       ],
//       temperature: 0.4,
//       response_format: { type: "json_object" }
//     });

//     const choice = response.choices?.[0]?.message?.content;

//     if (!choice) {
//       console.error("No valid response from OpenAI:", response);
//       throw new Error("לא התקבלה תגובה תקינה מ־OpenAI");
//     }

//     return choice; 

//   } catch (err: any) {
//     if (err.response) {
//       console.error("❌ OpenAI API error:", {
//         status: err.response.status,
//         data: err.response.data
//       });
//     } else {
//       console.error("❌ General error:", err.message || err);
//     }
//     throw err;
//   }
// };



import { OpenAI } from 'openai';
import dedent from 'ts-dedent';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const analyzeResume = async (text: string): Promise<string | undefined> => {
  try {
    console.log('📥 Received text for analysis:', text.slice(0, 300));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // אפשר גם "gpt-4" אם יש לך גישה
      messages: [
        {
          role: "system",
          content: `אתה מומחה קורות חיים שמבצע ניתוח עומק על מסמך המועמד. אל תציע שיפורים גנריים אלא קרא היטב את המסמך ותן הערות מבוססות תוכן בלבד.`
        },
        {
          role: "user",
         content: dedent(`
  הנה קובץ קורות החיים. נתח אותו לפי הסעיפים הבאים:

  1. מהם החלקים החזקים במסמך?
  2. האם חסר משהו קריטי – לדוגמה: כותרת, סיכום אישי, ניסיון או השכלה?
  3. האם יש תוכן מיותר או לא רלוונטי?
  4. האם הכותרות והמבנה ברורים?
  5. האם ניכרת התאמה למשרה בתחום פיתוח תוכנה?
  6. אילו שיפורים יכולים להפוך את הקובץ למרשים יותר עבור מגייסים?

  שמור על ניסוח מקצועי, והימנע מהמלצות כלליות אם התוכן כבר קיים.

  קובץ קורות החיים:
  ---
  ${text}
`)
        }
      ],
      temperature: 0.4
    });
    const choice = response.choices?.[0]?.message?.content;
    console.log('📤 AI response:', choice);
    if (!choice) {
      console.error("No valid response from OpenAI:", response);
      throw new Error("לא התקבלה תגובה תקינה מ־OpenAI");
    }

    return choice;
    } catch (err: any) {
    if (err.response) {
      console.error("❌ OpenAI API error:", {
        status: err.response.status,
        data: err.response.data
      });
    } else {
      console.error("❌ General error:", err.message || err);
    }
    throw err;
  }
  };
