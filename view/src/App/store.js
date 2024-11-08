import { configureStore } from "@reduxjs/toolkit";
import productsReducer from '../Components/Products/ProductsSlice';

export default configureStore({
    reducer: {
        products: productsReducer
    }
});