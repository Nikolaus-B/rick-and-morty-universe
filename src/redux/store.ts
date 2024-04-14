import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import charactersReducer from "./characters/charactersSlice";
import locationReducer from "./locations/locationsSlice";

export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: {
    locations: locationReducer,
    characters: charactersReducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const appSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
