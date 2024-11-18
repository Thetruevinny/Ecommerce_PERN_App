import { configureStore } from "@reduxjs/toolkit";
import productsReducer from '../Components/Products/ProductsSlice';
import tokenReducer from '../Components/LoginForm/TokenSlice';
import cartReducer from '../Components/Cart/CartSlice';
import categoriesReducer from '../Components/Categories/CategoriesSlice';

// Configuring of redux store with various slice reducers
export default configureStore({
    reducer: {
        products: productsReducer,
        tokens: tokenReducer,
        cart: cartReducer,
        categories: categoriesReducer,
    }
});