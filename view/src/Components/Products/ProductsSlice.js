import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Create async thunk to retrieve all products from db
export const loadProducts = createAsyncThunk(
    'products/loadProducts',
    async () => {
        try {
            const response = await fetch('http://localhost:50423/api/products');
            if (response.ok) {
                const json = await response.json();
                return json;
            }
        } catch (error) {
            throw new Error(error);
        }
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        data: [],
        isLoading: false,
        hasError: false
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProducts.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })

            .addCase(loadProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.data = action.payload;
            })

            .addCase(loadProducts.rejected, (state) => {
                state.isLoading = false;
                state.hasError = true;
            })
    }
});

export const selectProducts = (state) => state.products.data;

export default productsSlice.reducer;