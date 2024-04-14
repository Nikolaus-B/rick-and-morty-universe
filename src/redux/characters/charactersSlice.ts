import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const charactersSlice = createSlice({
  name: "planets",
  initialState,
  reducers: {},
  //   extraReducers: (builder) => {},
});

// export const {  } = charactersSlice.actions;
const charactersReducer = charactersSlice.reducer;
export default charactersReducer;
