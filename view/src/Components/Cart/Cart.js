import React, {useEffect} from 'react';
import Styles from './Cart.module.css';
import { useSelector } from 'react-redux';
import { getCart } from './CartSlice';
import { useNavigate } from 'react-router';

function Cart() {
    // Set-up states and navigate hook
    const cartItems = useSelector(getCart);
    const navigate = useNavigate();

    // When cart button clicked at bottom of products page navigates to cart page
    const onClickHandler = () => {
        navigate('/cart');
    }

    return (
        <div className={Styles.cart}>
            <button onClick={onClickHandler} >Cart ({cartItems.length})</button>
        </div>
    )
}

export default Cart;