import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardApi } from "@/lib/api";

interface Exam {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface Scholarship {
  id: string;
  title: string;
  deadline: string;
}

interface Guide {
  id: string;
  title: string;
  lastUpdated: string;
}

interface DashboardData {
  totalExams: number;
  totalScholarships: number;
  totalGuides: number;
  recentExams: Exam[];
  recentScholarships: Scholarship[];
  recentGuides: Guide[];
}

interface DashboardState {
  totalExams: number;
  totalScholarships: number;
  totalGuides: number;
  recentExams: Exam[];
  recentScholarships: Scholarship[];
  recentGuides: Guide[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  totalExams: 0,
  totalScholarships: 0,
  totalGuides: 0,
  recentExams: [],
  recentScholarships: [],
  recentGuides: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>("dashboard/fetchData", async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardApi.getOverview();
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data as DashboardData;
  } catch (error) {
    return rejectWithValue("Failed to load dashboard data");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.totalExams = action.payload.totalExams;
        state.totalScholarships = action.payload.totalScholarships;
        state.totalGuides = action.payload.totalGuides;
        state.recentExams = action.payload.recentExams;
        state.recentScholarships = action.payload.recentScholarships;
        state.recentGuides = action.payload.recentGuides;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
