import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: [],
    reducers: {
        addCart: (state, action) => {
            const product = action.payload;
            // Check if item is in the cart
            const check = state.filter(item => String(product.id) === String(item.id));
            if (check.length === 0) {
                state.push(product);
            } 
        },
        refreshCart: (state) => {
            return state = [];
        }
    }
});

export const getCart = (state) => state.cart; 

export const {addCart, refreshCart} = cartSlice.actions;

export default cartSlice.reducer;