import { OpenAI } from 'openai';
import { Job } from '../models/JobModel';
import { parseResumeText } from './pdfUtils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const generateCoverLetterFromResume = async (
  buffer: Buffer,
  job: Job
): Promise<string> => {
  const resumeText = await parseResumeText(buffer);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [

     
      {
    role: "system",
      content: `

אתה כותב מכתב מקדים בעברית, קצר (4-6 שורות), מקצועי וכנה, המבוסס רק על הנתונים המופיעים בקורות החיים.
אסור להמציא ניסיון, כישורים או פרטים שלא מופיעים בקורות החיים.
אין לכתוב מספר שנות ניסיון אלא אם הן מצוינות בקורות החיים.
הסגנון צריך להיות ענייני, רגוע ובלי הגזמות.
אין לכלול שם משפחה, רק שם פרטי.
המכתב צריך להדגיש מוטיבציה, למידה ורצון להתפתח בהתאמה למשרה.
בלי גוף ראשון
רישמי,ויצוגי
בלי פירוט מוגזם של הידע
ובלי גאווה
`

    },
      {
        role: "user",
        content: `הנה פרטי המשרה:\n${job.title}\n${job.description}\n${job.requirements}\n\nוהנה קורות החיים של המועמדת:\n${resumeText}\n\nכתוב מכתב מקדים להגשת מועמדות.`,
      },
    ],
    temperature: 0.9,
  });

  const choice = response.choices?.[0]?.message?.content;

  if (!choice) {
    console.error("לא התקבלה תשובה תקינה מ־OpenAI:", response);
    throw new Error("לא התקבלה תגובה תקינה מ־GPT");
  }

  return choice;
};


// import { OpenAI } from 'openai';
// import { Job } from '../models/JobModel';
// import { parseResumeText } from './pdfUtils';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_KEY,
// });

// export const generateCoverLetterFromResume = async (
//   buffer: Buffer,
//   job: Job
// ): Promise<string> => {
//   const resumeText = await parseResumeText(buffer);

// return `
// בהתאם לדרישות המשרה ולניסיון המקצועי, המועמדת מביעה עניין רב בהצטרפות לחברה.
// מגלה מחויבות ללמידה והתפתחות אישית, עם גישה מקצועית ואחריות גבוהה.
// הכישורים שצוינו בקורות החיים תואמים את צורכי התפקיד.
// מתרגשת מהאפשרות לתרום ולהשתלב בצוות העשייה.
//   `.trim();
// };
