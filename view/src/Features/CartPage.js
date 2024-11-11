// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router';
// import { getCart } from '../Components/Cart/CartSlice';
// import Styles from './Styles/CartPage.module.css';

// function CartPage() {
//     const cart = useSelector(getCart);
//     const navigate = useNavigate();
//     // Setting totals array
//     const [price, setPrice] = useState([]);
//     const [verified, setVerified] = useState(false);

//     // Initialize quantity state with each product's default quantity set to 1
//     const [quantities, setQuantities] = useState(
//         cart.reduce((acc, product) => {
//             acc[product.name] = 1;
//             return acc;
//         }, {})
//     );

//     // Handle quantity change
//     const handleQuantityChange = (event, productName) => {
//         setQuantities({
//             ...quantities,
//             [productName]: event.target.value,
//         });
//     };

//     const checkAuth = async () => {
//         const response = await fetch('http://localhost:50423/api/check', {
//             credentials: 'include',
//         });
//         const json = await response.json();
//         console.log(json);
//         const verified = json.result;
//         setVerified(verified)
//         if (!verified) {
//             setTimeout(() => navigate('/login'), 1000);
//         } 
//     }

//     useEffect(() => {
//         checkAuth();
//     }, [])

//     useEffect(() => {
//         const total = cart.reduce((acc, product) => {
//             return acc += quantities[product.name] * product.price;
//         }, 0);
//         setPrice(total);
//     }, [quantities])

//     if (!verified) {
//         return <p className={Styles.error}>To access this page, you must be logged in. Please wait to be redirected.</p>
//     }

//     return (
//         <div className={Styles.cartPage}>
//             <h2>Cart</h2>
//             <form action='http://localhost:50423/api/order' method='POST'>
//                 {cart.map(product => (
//                     <div key={product.name}>
//                         <label htmlFor={product.name}>{product.name}:</label>
//                         <input
//                             id={product.name}
//                             type='number'
//                             value={quantities[product.name]} // Controlled input
//                             onChange={(event) => handleQuantityChange(event, product.name)} // Update state on change
//                             required
//                         />
//                         <p>Total for {product.name} is £{quantities[product.name] * product.price}</p>
//                         <hr></hr>
//                     </div>
//                 ))}
//                 <p>Total: £{price}</p>
//                 <hr></hr>
//                 <button type='submit'>Order Now</button>
//             </form>
//         </div>
//     );
// }

// export default CartPage;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { getCart } from '../Components/Cart/CartSlice';
import Styles from './Styles/CartPage.module.css';

const stripePromise = loadStripe('pk_test_51QJhLcFSdvIgaIEWN9awNHE7eQM6OVV9CQBJWHLZ8Qe7z9cCdHuJfCiMkoQP9yWXM4VttPnqNedNPZrP2r70E4gu003n0mfzvl');

function CartPage() {
    const cart = useSelector(getCart);
    const navigate = useNavigate();
    const [price, setPrice] = useState([]);
    const [verified, setVerified] = useState(false);

    const [quantities, setQuantities] = useState(
        cart.reduce((acc, product) => {
            acc[product.name] = 1;
            return acc;
        }, {})
    );

    const handleQuantityChange = (event, productName) => {
        setQuantities({
            ...quantities,
            [productName]: event.target.value,
        });
    };

    const checkAuth = async () => {
        const response = await fetch('http://localhost:50423/api/check', {
            credentials: 'include',
        });
        const json = await response.json();
        setVerified(json.result);
        if (!json.result) {
            setTimeout(() => navigate('/login'), 1000);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const total = cart.reduce((acc, product) => {
            return (acc += quantities[product.name] * product.price);
        }, 0);
        setPrice(total);
    }, [quantities]);

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