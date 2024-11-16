import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { getCart } from '../Components/Cart/CartSlice';
import Styles from './Styles/CartPage.module.css';

// Creating Stripe Promise object for use in payments path
const stripePromise = loadStripe('pk_test_51QJhLcFSdvIgaIEWN9awNHE7eQM6OVV9CQBJWHLZ8Qe7z9cCdHuJfCiMkoQP9yWXM4VttPnqNedNPZrP2r70E4gu003n0mfzvl');

// Creating cart componenet
function CartPage() {
    const cart = useSelector(getCart);
    const navigate = useNavigate();
    const [price, setPrice] = useState([]);
    const [verified, setVerified] = useState(false);

    // Initialising quantities state with products as keys and quantities as values (initially set to 1).
    const [quantities, setQuantities] = useState(
        cart.reduce((acc, product) => {
            acc[product.name] = 1;
            return acc;
        }, {})
    );

    // Handles quantity change when user types in input field
    const handleQuantityChange = (event, productName) => {
        setQuantities({
            ...quantities,
            [productName]: event.target.value,
        });
    };

    // Check if the user is authenticated if not redirects to login
    const checkAuth = async () => {
        const response = await fetch('http://localhost:50423/api/check', {
            credentials: 'include',
        });
        const json = await response.json();
        setVerified(json.result);
        if (!json.result) {
            cart.forEach(product => {
                const productString = JSON.stringify(product); 
                localStorage.setItem(`Product_${product.id}`, productString);  
            });
            setTimeout(() => navigate('/login'), 6000);
        }
    };

    // Effect hook called when component renders to check authentication
    useEffect(() => {
        checkAuth();
    }, []);

    // Effect hook to calculate running total is called whenever quantities changes
    useEffect(() => {
        const total = cart.reduce((acc, product) => {
            return (acc += quantities[product.name] * product.price);
        }, 0);
        setPrice(total);
    }, [quantities]);

    // Handle the check out button click, causes user to be redirected to stripe for payment
    const handleCheckout = async () => {
        const stripe = await stripePromise;
        const response = await fetch('http://localhost:50423/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart, quantities }),
            credentials: 'include',
        });
        const session = await response.json();
        if (session.url) {
            window.location.href = session.url; // Redirect to Stripe checkout
        }
    };

    // Authentication check and renders different compoenents dependant on the result
    if (!verified) {
        return <p className={Styles.error}>To access this page, you must be logged in. Please wait to be redirected.</p>;
    }

    return (
        <div className={Styles.cartPage}>
            <h2>Cart</h2>
            <div className={Styles.form} >
                {cart.map((product) => (
                    <div key={product.name}>
                        <label htmlFor={product.name}>{product.name}:</label>
                        <input
                            id={product.name}
                            type='number'
                            value={quantities[product.name]}
                            onChange={(event) => handleQuantityChange(event, product.name)}
                            required
                        />
                        <p>Total for {product.name} is £{quantities[product.name] * product.price}</p>
                        <hr></hr>
                    </div>
                ))}
                <p>Total: £{price}</p>
                <hr></hr>
                <button type='button' onClick={handleCheckout}>Checkout with Stripe</button>
            </div>
        </div>
    );
}

export default CartPage;