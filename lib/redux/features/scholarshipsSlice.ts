import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { scholarshipsApi } from "@/lib/api";

interface Scholarship {
  id?: string;
  title: string;
  description: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  requirements: string[];
  applicationUrl: string;
  type: string;
  country: string;
  imageUrl?: string;
}

interface ScholarshipsState {
  scholarships: Scholarship[];
  loading: boolean;
  error: string | null;
}

const initialState: ScholarshipsState = {
  scholarships: [],
  loading: false,
  error: null,
};

export const fetchScholarships = createAsyncThunk<
  Scholarship[],
  void,
  { rejectValue: string }
>("scholarships/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await scholarshipsApi.getAll();
    if (response.error) {
      return rejectWithValue(response.error);
    }
    const list = Array.isArray((response.data as any)?.scholarships)
      ? (response.data as any).scholarships
      : (response.data as any);
    console.log("[SCHOLARSHIPS] list extracted", list);
    return list as Scholarship[];
  } catch (error) {
    return rejectWithValue("Failed to fetch scholarships");
  }
});

export const createScholarship = createAsyncThunk<
  Scholarship,
  Scholarship,
  { rejectValue: string }
>(
  "scholarships/create",
  async (scholarshipData: Scholarship, { rejectWithValue }) => {
    try {
      const response = await scholarshipsApi.create(scholarshipData);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data as Scholarship;
    } catch (error) {
      return rejectWithValue("Failed to create scholarship");
    }
  }
);

export const updateScholarship = createAsyncThunk<
  Scholarship,
  { id: string; scholarshipData: Scholarship },
  { rejectValue: string }
>(
  "scholarships/update",
  async ({ id, scholarshipData }, { rejectWithValue }) => {
    try {
      const response = await scholarshipsApi.update(id, scholarshipData);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data as Scholarship;
    } catch (error) {
      return rejectWithValue("Failed to update scholarship");
    }
  }
);

export const deleteScholarship = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("scholarships/delete", async (id: string, { rejectWithValue }) => {
  try {
    const response = await scholarshipsApi.delete(id);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return id;
  } catch (error) {
    return rejectWithValue("Failed to delete scholarship");
  }
});

const scholarshipsSlice = createSlice({
  name: "scholarships",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScholarships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScholarships.fulfilled, (state, action) => {
        state.loading = false;
        state.scholarships = action.payload;
      })
      .addCase(fetchScholarships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createScholarship.fulfilled, (state, action) => {
        state.scholarships.push(action.payload);
      })
      .addCase(updateScholarship.fulfilled, (state, action) => {
        const index = state.scholarships.findIndex(
          (scholarship) => scholarship.id === action.payload.id
        );
        if (index !== -1) {
          state.scholarships[index] = action.payload;
        }
      })
      .addCase(deleteScholarship.fulfilled, (state, action) => {
        state.scholarships = state.scholarships.filter(
          (scholarship) => scholarship.id !== action.payload
        );
      });
  },
});

export default scholarshipsSlice.reducer;
