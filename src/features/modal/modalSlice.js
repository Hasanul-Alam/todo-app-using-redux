import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    value: false,
  },
  reducers: {
    toggleModal: (state) => {
      state.value = !state.value
    },
  },
});

export const {toggleModal} = modalSlice.actions
export default modalSlice.reducer