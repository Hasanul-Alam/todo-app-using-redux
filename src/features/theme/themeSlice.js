import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    value: "light",
  },
  reducers: {
    switchTheme: (state) => {
      state.value === "light"
        ? (state.value = "dark")
        : (state.value = "light");
    },
  },
});

export const {switchTheme} = themeSlice.actions
export default themeSlice.reducer