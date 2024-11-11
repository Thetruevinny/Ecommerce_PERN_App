import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Create async thunk for calling back-end to retrieve CSRF token
export const loadToken = createAsyncThunk(
    'tokens/loadToken',
    async () => {
        try {
            const response = await fetch('http://localhost:50423/api/csrfToken', {
                credentials: 'include',
            });
            if (response.ok) {
                const json = await response.json();
                return json.csrfToken;
            }
        } catch (error) {
            throw new Error(error);
        }
    }
);

const tokenSlice = createSlice({
    name: "tokens",
    initialState: {
        token: "",
        isLoading: false,
        hasError: false
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(loadToken.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })

            .addCase(loadToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.token = action.payload;
            })

            .addCase(loadToken.rejected, (state) => {
                state.isLoading = false;
                state.hasError = true;
            })
    }
});

export const selectToken = (state) => state.tokens.token;

export default tokenSlice.reducer;