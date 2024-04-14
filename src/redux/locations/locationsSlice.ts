import { createSlice } from "@reduxjs/toolkit";
import { LocationState } from "../../interfaces/location";

const initialState: LocationState = {
  locations: [],
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {},
  //   extraReducers: (builder) => {},
});

// export const {  } = locationsSlice.actions;
const locationReducer = locationsSlice.reducer;
export default locationReducer;
