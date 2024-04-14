import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "https://rickandmortyapi.com/api/";

export const fetchLocations = createAsyncThunk(
  "locations/fetchLocations",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`location`);
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  }
);
