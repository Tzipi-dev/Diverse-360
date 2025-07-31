import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
// :white_check_mark: משתנה גלובלי שמתעדכן בכל קריאת שרת
declare global {
  var didReceiveRequest: boolean;
}
globalThis.didReceiveRequest = false;
import app from './app';
import authRoutes from "./routes/authRoutes";
import jobRouter from './routes/JobRoute';
import informationCarouselRoute from './routes/InfoCarouselRoute';
import projectCarouselRoute from './routes/ProjectCarouselRoute';
import ResumeUploadRoute from './routes/ResumeUploadRoute';
import ResumeAnalysisRoute from './routes/ResumeAnalysisRoute';
import logoCarouselRoute from "./routes/LogoCarouselRoute";
import coverLetterRouter from './routes/coverLetterRoute';
import forumRoute from './routes/ForumRoute';
import CourseRoute from '../src/routes/CourseRoute';
import userRouter from './routes/UserRoute';
import coursesRouter from './routes/CourseRoute';
import projectRoutes from './routes/ProjectItemRoute';
import forumMessageRouter from './routes/ForumMessageRoute';
import videoRouter from './routes/videoRoutes';
import commentsRoute from './routes/CommentRout';
import { rateLimiter } from "./rateLimiter/rateLimiterMiddleware";
import AuthEventRoute from './routes/AuthEventRoute';
import ThreadMessagesRoutes from './routes/ThreadMessagesRoutes';
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
});
io.on("connection", (socket: Socket) => {
  console.log(":white_check_mark: Client connected:", socket.id);
  socket.on("joinForum", (forumId: string) => {
    socket.join(forumId);
    console.log(`:inbox_tray: Socket ${socket.id} joined forum ${forumId}`);
  });
  socket.on("leaveForum", (forumId: string) => {
    socket.leave(forumId);
    console.log(`:outbox_tray: Socket ${socket.id} left forum ${forumId}`);
  });
  socket.on("disconnect", () => {
    console.log(":x: Client disconnected:", socket.id);
  });
});
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
// :white_check_mark: Middleware כללי – מתעדכן על כל קריאת API
app.use((req, res, next) => {
  globalThis.didReceiveRequest = true;
  next();
});
// :white_check_mark: טעינת רואטרים
app.use(rateLimiter)
app.use("/api/auth", authRoutes);
app.use("/jobs", jobRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/forums", forumRoute);
app.use("/api/messages", forumMessageRouter);
app.use("/api/users", userRouter);
app.use("/api/info-carousel", informationCarouselRoute);
app.use("/api/project-carousel", projectCarouselRoute);
app.use("/api/resumes", ResumeUploadRoute);
app.use("/api/analyze-resume", ResumeAnalysisRoute);
app.use('/api/logo-carousel', logoCarouselRoute);
app.use('/api/courses', coursesRouter);
app.use('/courses', coursesRouter);
app.use('/api/forums', forumRoute);
app.use('/api/messages', forumMessageRouter);
app.use('/api/thread-messages', ThreadMessagesRoutes);
app.use('/api/users', userRouter);
app.use('/courses', coursesRouter);
app.use('/api/projects', projectRoutes);
// app.use('/resumes', ResumeRoute);
app.use('/api/videos', videoRouter);
app.use('/api/comments', commentsRoute);
app.use('/api/auth-events', AuthEventRoute);
app.use('/api/coverLetter', coverLetterRouter);
app.get('/', (req, res) => {
  res.send(':tada: השרת שלך פועל! ברוכה הבאה ל־backend של Diverse360');
});
server.listen(PORT, () => {
  console.log(`:rocket: Server running on port ${PORT}`);
});