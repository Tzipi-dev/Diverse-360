import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  search: string;
  category: string;
  type: string;
  location: string;
  date: string;
}

const initialState: FiltersState = {
  search: "",
  category: "",
  type: "",
  location: "",
  date: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearch,
  setCategory,
  setType,
  setLocation,
  setDate,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice;
