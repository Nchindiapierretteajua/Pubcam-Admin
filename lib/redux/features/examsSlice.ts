import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { examsApi } from "@/lib/api";

interface Exam {
  id?: string;
  name: string;
  fullName: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  fees: string;
  eligibility: string[];
  subjects: string[];
  venues: string[];
  documentUrl?: string;
  resultDate?: string;
  organizingBody: string;
  imageUrl?: string;
  level: "PRIMARY" | "SECONDARY" | "TERTIARY";
}

interface ExamsState {
  exams: Exam[];
  loading: boolean;
  error: string | null;
}

const initialState: ExamsState = {
  exams: [],
  loading: false,
  error: null,
};

export const fetchExams = createAsyncThunk<
  Exam[],
  void,
  { rejectValue: string }
>("exams/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await examsApi.getAll();
    if (response.error) {
      return rejectWithValue(response.error);
    }
    const list = Array.isArray((response.data as any)?.exams)
      ? (response.data as any).exams
      : (response.data as any);
    const normalized = list.map((e: any) => ({
      ...e,
      level: (e.level || "").toUpperCase(),
      resultDate: e.resultDate
        ? new Date(e.resultDate).toISOString().split("T")[0]
        : undefined,
    }));
    console.log("[EXAMS] list extracted", normalized);
    return normalized as Exam[];
  } catch (error) {
    return rejectWithValue("Failed to fetch exams");
  }
});

export const createExam = createAsyncThunk<Exam, Exam, { rejectValue: string }>(
  "exams/create",
  async (examData: Exam, { rejectWithValue }) => {
    try {
      const formattedData = {
        ...examData,
        level: examData.level.toUpperCase(),
        resultDate: examData.resultDate
          ? new Date(examData.resultDate).toISOString().split("T")[0]
          : undefined,
      };
      const response = await examsApi.create(formattedData);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response.data as Exam;
    } catch (error) {
      return rejectWithValue("Failed to create exam");
    }
  }
);

export const updateExam = createAsyncThunk<
  Exam,
  { id: string; examData: Exam },
  { rejectValue: string }
>("exams/update", async ({ id, examData }, { rejectWithValue }) => {
  try {
    const formattedData = {
      ...examData,
      level: examData.level.toUpperCase(),
      resultDate: examData.resultDate
        ? new Date(examData.resultDate).toISOString().split("T")[0]
        : undefined,
    };
    const response = await examsApi.update(id, formattedData);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data as Exam;
  } catch (error) {
    return rejectWithValue("Failed to update exam");
  }
});

export const deleteExam = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("exams/delete", async (id: string, { rejectWithValue }) => {
  try {
    const response = await examsApi.delete(id);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return id;
  } catch (error) {
    return rejectWithValue("Failed to delete exam");
  }
});

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.push(action.payload);
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        const index = state.exams.findIndex(
          (exam) => exam.id === action.payload.id
        );
        if (index !== -1) {
          state.exams[index] = action.payload;
        }
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter((exam) => exam.id !== action.payload);
      });
  },
});

export default examsSlice.reducer;
