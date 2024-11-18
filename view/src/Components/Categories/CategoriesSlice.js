import { createSlice } from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: 'none',
    reducers: {
        setCategory: (state, action) => {
            const category = action.payload;
            return state = category;
        }
    }
});

// Selector to retrieve current category
export const getCategory = (state) => state.categories;

export const {setCategory} = categoriesSlice.actions;

export default categoriesSlice.reducer;