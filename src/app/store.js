import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../features/theme/themeSlice'
import modalReducer from '../features/modal/modalSlice'

export default configureStore({
  reducer: {
    theme: themeReducer,
    modal: modalReducer
  }
})