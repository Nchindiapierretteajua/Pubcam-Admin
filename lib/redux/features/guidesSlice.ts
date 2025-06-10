import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { guidesApi } from "@/lib/api";

interface GuideStep {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface Guide {
  id?: string;
  title: string;
  description: string;
  category: string;
  audience: "student" | "parent" | "graduate" | "all";
  steps: GuideStep[];
  imageUrl?: string;
}

interface GuidesState {
  guides: Guide[];
  loading: boolean;
  error: string | null;
}

const initialState: GuidesState = {
  guides: [],
  loading: false,
  error: null,
};

export const fetchGuides = createAsyncThunk<
  Guide[],
  void,
  { rejectValue: string }
>("guides/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await guidesApi.getAll();
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data as Guide[];
  } catch (error) {
    return rejectWithValue("Failed to fetch guides");
  }
});

export const createGuide = createAsyncThunk<
  Guide,
  Guide,
  { rejectValue: string }
>("guides/create", async (guideData: Guide, { rejectWithValue }) => {
  try {
    const response = await guidesApi.create(guideData);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data as Guide;
  } catch (error) {
    return rejectWithValue("Failed to create guide");
  }
});

export const updateGuide = createAsyncThunk<
  Guide,
  { id: string; guideData: Guide },
  { rejectValue: string }
>("guides/update", async ({ id, guideData }, { rejectWithValue }) => {
  try {
    const response = await guidesApi.update(id, guideData);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data as Guide;
  } catch (error) {
    return rejectWithValue("Failed to update guide");
  }
});

export const deleteGuide = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("guides/delete", async (id: string, { rejectWithValue }) => {
  try {
    const response = await guidesApi.delete(id);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return id;
  } catch (error) {
    return rejectWithValue("Failed to delete guide");
  }
});

const guidesSlice = createSlice({
  name: "guides",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuides.fulfilled, (state, action) => {
        state.loading = false;
        state.guides = action.payload;
      })
      .addCase(fetchGuides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGuide.fulfilled, (state, action) => {
        state.guides.push(action.payload);
      })
      .addCase(updateGuide.fulfilled, (state, action) => {
        const index = state.guides.findIndex(
          (guide) => guide.id === action.payload.id
        );
        if (index !== -1) {
          state.guides[index] = action.payload;
        }
      })
      .addCase(deleteGuide.fulfilled, (state, action) => {
        state.guides = state.guides.filter(
          (guide) => guide.id !== action.payload
        );
      });
  },
});

export default guidesSlice.reducer;
