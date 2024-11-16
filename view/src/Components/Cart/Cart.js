import React, {useEffect} from 'react';
import Styles from './Cart.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { getCart, addCart } from './CartSlice';
import { useNavigate } from 'react-router';

function Cart() {
    // Set-up states and navigate hook
    const cartItems = useSelector(getCart);
    const navigate = useNavigate();
    const dispatch  = useDispatch();

    useEffect(()=> {
        const productKeys = Object.keys(localStorage).filter(key => /Product_[0-9]+/.test(key));
        if (productKeys) {
            
            productKeys.forEach(key => {
                const product = localStorage.getItem(key);
                dispatch(addCart(JSON.parse(product)));
            });
        }
    }, []);

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