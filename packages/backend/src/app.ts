import express, { Express } from "express";
import cors from "cors";

import dotenv from 'dotenv';

import authRoutes from "./routes/authRoutes";
import jobRouter from './routes/JobRoute';
import forumRoute from './routes/ForumRoute';
import userRouter from './routes/UserRoute';
import coursesRouter from './routes/CourseRoute';
import forumMessageRouter from './routes/ForumMessageRoute';
import informationCarouselRoute from './routes/InfoCarouselRoute';
import projectCarouselRoute from './routes/ProjectCarouselRoute';
import ResumeUploadRoute from './routes/ResumeUploadRoute';
import ResumeAnalysisRoute from './routes/ResumeAnalysisRoute';
import videoRouter from './routes/videoRoutes';
import logoCarouselRoute from "./routes/LogoCarouselRoute";
import commentsRoute from './routes/CommentRout'
import coverLetterRouter from './routes/coverLetterRoute';
import analyticsRoute from './routes/ScreenTimeRoute';
import savedJobsRoutes from "./routes/savedJobsRoutes";
import TipesCarouselRoute from "./routes/TipesCarouselRoute";
import ThreadMessagesRoutes from './routes/ThreadMessagesRoutes';
const app: Express = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/jobs", jobRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/forums", forumRoute);
app.use("/api/messages", forumMessageRouter);
app.use('/api/thread-messages', ThreadMessagesRoutes);
app.use("/api/users", userRouter);
app.use("/api/info-carousel", informationCarouselRoute);
app.use("/api/project-carousel", projectCarouselRoute);
app.use("/api/tipes-carousel", TipesCarouselRoute);
app.use("/api/resumes", ResumeUploadRoute);
app.use("/api/analyze-resume", ResumeAnalysisRoute);
app.use('/api/messages', forumMessageRouter);
app.use('/api/logo-carousel',logoCarouselRoute)
app.use('/api/videos', videoRouter);
app.use('/api/comments',commentsRoute)
app.use('/api/coverLetter', coverLetterRouter);
app.use('/api/analytics', analyticsRoute);
app.use('/api', savedJobsRoutes);
app.use('/api/tipes-carousel', TipesCarouselRoute);

export default app;
