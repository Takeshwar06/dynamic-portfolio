import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchTheme = createAsyncThunk('theme/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/theme');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch theme');
  }
});

export const updateTheme = createAsyncThunk('theme/update', async (settings, { rejectWithValue }) => {
  try {
    const { data } = await API.put('/theme', settings);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update theme');
  }
});

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    activeTheme: 'light',
    activeLayout: 'modern',
    primaryColor: '#1a365d',
    accentColor: '#d69e2e',
    loading: false,
    error: null,
  },
  reducers: {
    setLocalTheme: (state, action) => {
      state.activeTheme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheme.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeTheme = action.payload.activeTheme || 'light';
          state.activeLayout = action.payload.activeLayout || 'modern';
          state.primaryColor = action.payload.primaryColor || '#1a365d';
          state.accentColor = action.payload.accentColor || '#d69e2e';
        }
      })
      .addCase(updateTheme.pending, (state) => { state.loading = true; })
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLocalTheme } = themeSlice.actions;
export default themeSlice.reducer;
