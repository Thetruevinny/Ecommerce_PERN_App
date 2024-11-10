import React, {useEffect} from 'react';
import Styles from './Cart.module.css';
import { useSelector } from 'react-redux';
import { getCart } from './CartSlice';
import { useNavigate } from 'react-router';

function Cart() {

    const cartItems = useSelector(getCart);
    const navigate = useNavigate();

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