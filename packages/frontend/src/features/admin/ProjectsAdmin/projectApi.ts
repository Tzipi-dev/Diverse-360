import axios from 'axios';

import { Project } from './projectTypes';

// הגדרת כתובת הבסיס
const BASE_URL = '/api/projects';

// קבלת כל הפרויקטים
export const getAllProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`${BASE_URL}/getAll`);
  return response.data;
};

// יצירת פרויקט חדש
export const createProject = async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
  const response = await axios.post(BASE_URL, project);
  return response.data;
};

// עדכון פרויקט לפי מזהה
export const updateProject = async (id: string, updatedData: Partial<Project>): Promise<Project> => {
  const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
  return response.data;
};

// מחיקת פרויקט לפי מזהה
export const deleteProject = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
