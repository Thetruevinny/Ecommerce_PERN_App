import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: [],
    reducers: {
        addCart: (state, action) => {
            const product = action.payload;
            state.push(product);
            
        }
    }
});

export const getCart = (state) => state.cart; 

export const {addCart} = cartSlice.actions;

export default cartSlice.reducer;