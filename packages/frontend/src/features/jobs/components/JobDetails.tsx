// import { useParams } from "react-router-dom";
// import { useGetJobByIdQuery } from "../jobsApi";
// import { useState } from "react";
// import {
//   useUploadResumeMutation,
//   useGetResumesByJobQuery,
//   useAnalyzeResumeMutation,
// } from "../resumeApi";
// import Layout from "../../../globalComponents/ui/Layout";
// import Input from "../../../globalComponents/ui/Input";
// import PrimaryButton from "../../../globalComponents/ui/PrimaryButton";
// import Card from "../../../globalComponents/ui/Card";

// const JobDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const { data: job, error, isLoading } = useGetJobByIdQuery(id ?? "");
//   const [file, setFile] = useState<File | null>(null);
//   const [applicationError, setApplicationError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState<string | null>(null);

//   const [uploadResume] = useUploadResumeMutation();
//   const [analyzeResume, { isLoading: isAnalyzing }] = useAnalyzeResumeMutation();
//   const { data: resumes = [], refetch } = useGetResumesByJobQuery(id ?? "", { skip: !id });

//   const handleApply = async () => {
//     setIsSubmitting(true);
//     setApplicationError(null);

//     if (!file || !id) {
//       setApplicationError("יש להזין מזהה משרה ולבחור קובץ.");
//       setIsSubmitting(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("jobId", id);

//     try {
//       await uploadResume(formData).unwrap();
//       refetch();
//     } catch (err) {
//       setApplicationError("שגיאה בהגשת המועמדות");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!file) {
//       setApplicationError("בחר קובץ לפני הניתוח");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const result = await analyzeResume(formData).unwrap();
//       setAnalysisResult(result.analysis);
//     } catch (err) {
//       setApplicationError("שגיאה בניתוח הקובץ");
//     }
//   };

//   if (isLoading) return <div>טוען...</div>;
//   if (error) return <div>שגיאה בשליפת משרה</div>;
//   if (!job) return <div>לא נמצאה משרה</div>;

//   return (
//     <Layout title="פרטי משרה">
//       <Card title={job.title} description={job.description}>
//         <p>{job.requirements}</p>

//         <div style={{ marginTop: '1rem' }}>
//           <Input
//             label="העלה קובץ קורות חיים"
//             value={file?.name || ""}
//             onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//             placeholder="בחר קובץ"
//           />
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//             style={{ display: 'none' }}
//             id="resumeFile"
//           />
//         </div>

//         {applicationError && <div style={{ color: 'red' }}>{applicationError}</div>}

//         <div style={{ marginTop: '1rem' }}>
//           <PrimaryButton onClick={handleApply}>
//             {isSubmitting ? "מגיש..." : "הגש מועמדות"}
//           </PrimaryButton>

//           <div style={{ marginTop: '1rem' }}>
//             <PrimaryButton onClick={handleAnalyze}>
//               {isAnalyzing ? "מנתח..." : "נתח קורות חיים עם AI"}
//             </PrimaryButton>
//           </div>
//         </div>

//         {analysisResult && (
//           <div style={{ marginTop: '2rem', textAlign: 'right' }}>
//             <h3>תוצאות ניתוח:</h3>
//             <pre style={{ whiteSpace: "pre-wrap", textAlign: "right", direction: "rtl" }}>
//               {analysisResult}
//             </pre>
//           </div>
//         )}
//       </Card>
//     </Layout>
//   );
// };

// export default JobDetails;
export{};