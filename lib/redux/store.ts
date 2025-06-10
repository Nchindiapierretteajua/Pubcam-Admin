import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/authSlice"
import examsReducer from "./features/examsSlice"
import scholarshipsReducer from "./features/scholarshipsSlice"
import guidesReducer from "./features/guidesSlice"
import dashboardReducer from "./features/dashboardSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exams: examsReducer,
    scholarships: scholarshipsReducer,
    guides: guidesReducer,
    dashboard: dashboardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
