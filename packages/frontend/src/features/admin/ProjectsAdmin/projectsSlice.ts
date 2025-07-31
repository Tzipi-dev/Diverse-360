// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Project } from './projectTypes';
// import * as api from './projectApi';

// interface ProjectsState {
//   projects: Project[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ProjectsState = {
//   projects: [],
//   loading: false,
//   error: null,
// };

// // שליפות ועדכונים אסינכרוניים

// export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
//   return await api.getAllProjects();
// });

// export const addProject = createAsyncThunk(
//   'projects/add',
//   async (project: Omit<Project, 'id' | 'createdAt'>) => {
//     return await api.createProject(project);
//   }
// );

// export const updateProject = createAsyncThunk(
//   'projects/update',
//   async ({ id, updatedData }: { id: string; updatedData: Partial<Project> }) => {
//     return await api.updateProject(id, updatedData);
//   }
// );

// export const removeProject = createAsyncThunk(
//   'projects/delete',
//   async (id: string) => {
//     await api.deleteProject(id);
//     return id;
//   }
// );

// // Slice
// const projectSlice = createSlice({
//   name: 'projects',
//   initialState,
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       // fetchProjects
//       .addCase(fetchProjects.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
//         state.loading = false;
//         state.projects = action.payload;
//       })
//       .addCase(fetchProjects.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'שגיאה בשליפת פרויקטים';
//       })

//       // addProject
//       .addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
//         state.projects.push(action.payload);
//       })

//       // updateProject
//       .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
//         const index = state.projects.findIndex(p => p.id === action.payload.id);
//         if (index !== -1) {
//           state.projects[index] = action.payload;
//         }
//       })

//       // removeProject
//       .addCase(removeProject.fulfilled, (state, action: PayloadAction<string>) => {
//         state.projects = state.projects.filter(p => p.id !== action.payload);
//       });
//   }
// });

// export default projectSlice.reducer;




import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from './projectTypes';
import * as api from './projectApi';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
  return await api.getAllProjects();
});

export const addProject = createAsyncThunk(
  'projects/add',
  async (project: Omit<Project, 'id' | 'createdAt'>) => {
    return await api.createProject(project);
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, updatedData }: { id: string; updatedData: Partial<Project> }) => {
    return await api.updateProject(id, updatedData);
  }
);

export const removeProject = createAsyncThunk(
  'projects/delete',
  async (id: string) => {
    await api.deleteProject(id);
    return id;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'שגיאה בשליפת פרויקטים';
      })
      .addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(removeProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      });
  }
});

export default projectsSlice.reducer;
