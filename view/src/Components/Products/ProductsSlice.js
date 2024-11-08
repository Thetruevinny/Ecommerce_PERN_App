import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = [
    {
        name: "Blue T-shirt",
        price: 10,
        category: "shirt",
        quantity: 100
    },
    {
        name: "Red T-shirt",
        price: 10,
        category: "shirt",
        quantity: 100
    },
    {
        name: "Red Chinos",
        price: 25,
        category: "trousers",
        quantity: 50
    },
    {
        name: "Blue Chinos",
        price: 7.5,
        category: "hats",
        quantity: 25
    },
    {
        name: "Red Hat",
        price: 7.5,
        category: "hats",
        quantity: 50
    },
    {
        name: "Blue Hat",
        price: 7.5,
        category: "hats",
        quantity: 50
    },
];

export const loadProducts = createAsyncThunk(
    'products/loadProducts',
    async () => {
        try {
            const response = await fetch('api/products');
            const json = await response.json();
            return json;
        } catch (error) {
            throw new Error(error);
        }
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        data: initialState,
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