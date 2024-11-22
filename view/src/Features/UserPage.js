// import { useEffect, useState } from "react";
// import Styles from "./Styles/UserPage.module.css";
// import { useSelector, useDispatch } from "react-redux";
// import { loadToken, selectToken } from "../Components/LoginForm/TokenSlice";

// function UserPage() {
//     const [activeItem, setActiveItem] = useState(null);
//     const csrfToken = useSelector(selectToken);
//     const dispatch = useDispatch();
//     const [userId, setUserId] = useState(null);
//     const orders = [{total: 25, products: [{name: 'Blue T-shirt', price: 10, quantity: 2}, {name: 'Blue Cap', price: 7.50, quantity: 1}]}];

//     const handleToggle = (index) => {
//         setActiveItem((prev) => (prev === index ? null : index));
//     };

//     const getUserId = async () => {
//         const response = await fetch('http://localhost:50423/api/user/id', {
//             credentials: 'include',
//         });
//         const result = await response.json();
//         if (response.ok) {
//             setUserId(result.id);
//             alert(userId);
//         } else {
//             const error = result.error;
//             alert(error);
//         }
//     }

//     useEffect(() => {
//         dispatch(loadToken);
//         getUserId();
//     }, []);

//     return (
//         <div className={Styles.user}>
//             <h2>User Information</h2>
//             <ul className={Styles.list}>
//                 {["Order History", "Change Password"].map((item, index) => (
//                     <li
//                         key={index}
//                         className={`${Styles.listItem} ${
//                             activeItem === index ? Styles.active : ""
//                         }`}
//                     >
//                         <span className={Styles.triangle} onClick={() => handleToggle(index)}></span>
//                         {activeItem === index ? null : item}
//                         {(activeItem === index) && (index === 0) ? (
//                             <div className={Styles.orders}>
//                                 <h3>Order History</h3>
//                                 {/* Will fill out logic for this section later */}
//                                 {orders.map(order => {
//                                     return (
//                                         <ul>
//                                             {order.products.map(product => <li>{`You bought ${product.quantity} ${product.name}${product.quantity === 1 ? '' : 's'} which cost £${product.price} each.`}</li>)}
//                                             <li>Total: £{order.total}</li>
//                                         </ul>
//                                     );
//                                 })}
//                             </div>
//                         ): null}
//                         {(activeItem === index) && (index === 1) ? (
//                             // Will fill out api call later
//                             <form className={Styles.form} method="POST" action={`http://localhost:50423/api/user/changePassword/${userId}`}>
//                                 <h3>{item}</h3>
//                                 <label htmlFor="oldPassword">Current Password:</label>
//                                 <input id='oldPassword' name="oldPassword" type="password" placeholder="Current password" />
//                                 <label htmlFor="newPassword">New Password:</label>
//                                 <input id='newPassword' name="newPassword" type="password" placeholder="New password" />
//                                 <label htmlFor="newPasswordCheck">Re-enter New Password:</label>
//                                 <input id='newPasswordCheck' name="newPasswordCheck" type="password" placeholder="New password" />
//                                 <input type='hidden' name='_csrf' value={csrfToken} />
//                                 <button>Submit</button>
//                             </form>
//                         ): null}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default UserPage;

import { useEffect, useState, useRef } from "react";
import Styles from "./Styles/UserPage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { loadToken, selectToken } from "../Components/LoginForm/TokenSlice";
import { useNavigate } from "react-router";

function UserPage() {
    const [activeItem, setActiveItem] = useState(null);
    const csrfToken = useSelector(selectToken);
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [orders, setOrders] = useState([]);
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();

    const handleToggle = (index) => {
        setActiveItem((prev) => (prev === index ? null : index));
    };

    // Check if the user is authenticated if not redirects to login
    const checkAuth = async () => {
        const response = await fetch('http://localhost:50423/api/check/auth', {
            credentials: 'include',
        });
        const json = await response.json();
        setVerified(json.result);
        if (!json.result) {
            setTimeout(() => navigate('/login'), 2000);
        }
    };

    // Request to backend to retrieve user id
    const getUserId = async () => {
        const response = await fetch('http://localhost:50423/api/user/id', {
            credentials: 'include',
        });
        const result = await response.json();
        if (response.ok) {
            setUserId(result.id);
        } else {
            const error = result.error;
            alert(error);
        }
    };

    // Request to backend to retrieve all orders by the current user
    const getOrders = async () => {
        console.log(userId);
        const response = await fetch(`http://localhost:50423/api/user/orders/${userId}`);
        const result = await response.json();
        if (response.ok) {
            setOrders(result.data);
        } else {
            setErrorMessage(result.Error);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
        }
    }

    // Refs for input fields
    const oldPasswordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const newPasswordCheckRef = useRef(null);

    // Calls made on component render to retrieve csrfToken and get user id
    useEffect(() => {
        checkAuth();
        dispatch(loadToken);
        getUserId();
    }, []);

    // Get all orders for a specific user id
    useEffect(() => {
        if (userId) {
            getOrders(userId);
        }
    }, [userId]);

    // Handle the password change form submission
    const handlePasswordChange = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const oldPassword = event.target.oldPassword.value;
        const newPassword = event.target.newPassword.value;
        const newPasswordCheck = event.target.newPasswordCheck.value;

        try {
            const response = await fetch(`http://localhost:50423/api/user/changePassword/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken,
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    newPasswordCheck,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Redirect if the server responded with a redirect URL
                setSuccessMessage(result.success);
                setActiveItem(null);
                // Clear input fields on success
                oldPasswordRef.current.value = '';
                newPasswordRef.current.value = '';
                newPasswordCheckRef.current.value = '';
                
                // Clear success message after 2 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 2000);
            } else if (result.Error) {
                // Show error message
                setErrorMessage(result.Error);
                if (result.Error.includes('current')) {
                    oldPasswordRef.current.value = '';
                } else if (result.Error.includes('two')) {
                    newPasswordRef.current.value = '';
                    newPasswordCheckRef.current.value = ''; 
                } else {
                    oldPasswordRef.current.value = '';
                    newPasswordRef.current.value = '';
                    newPasswordCheckRef.current.value = ''; 
                }
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2000);
            }
        } catch (error) {
            // Error handling
            console.error('Error during password change:', error);
            oldPasswordRef.current.value = '';
            newPasswordRef.current.value = '';
            newPasswordCheckRef.current.value = '';
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    // Authentication check and renders different compoenents dependant on the result
    if (!verified) {
        return <p className={Styles.error}>To access this page, you must be logged in. Please wait to be redirected.</p>;
    }

    return (
        <div className={Styles.user}>
            <h2>User Information</h2>
            <ul className={Styles.list}>
                {["Order History", "Change Password"].map((item, index) => (
                    <li
                        key={index}
                        className={`${Styles.listItem} ${
                            activeItem === index ? Styles.active : ""
                        }`}
                    >
                        <span className={Styles.triangle} onClick={() => handleToggle(index)}></span>
                        {activeItem === index ? null : item}
                        {(activeItem === index) && (index === 0) ? (
                            <div className={Styles.orders}>
                                <h3>Order History</h3>
                                {orders ? Object.keys(orders).map((key, orderIndex) => (
                                    <>
                                        <h4>Order: {orderIndex + 1}</h4>
                                        <ul key={orderIndex}>
                                            {orders[key].products.map((product, productIndex) => (
                                                <li key={productIndex}>
                                                    {`You bought ${product.quantity} ${product.name}${product.quantity === 1 ? '' : 's'} which cost £${product.price} each.`}
                                                </li>
                                            ))}
                                            <li>Total: £{orders[key].total}</li>
                                        </ul>
                                    </>
                                )): <p>No orders placed currently.</p>}
                            </div>
                        ) : null}
                        {(activeItem === index) && (index === 1) ? (
                            <form className={Styles.form} onSubmit={handlePasswordChange}>
                                <h3>{item}</h3>
                                <label htmlFor="oldPassword">Current Password:</label>
                                <input id='oldPassword' name="oldPassword" type="password" placeholder="Current password" ref={oldPasswordRef} required />
                                <label htmlFor="newPassword">New Password:</label>
                                <input id='newPassword' name="newPassword" type="password" placeholder="New password"  ref={newPasswordRef} required />
                                <label htmlFor="newPasswordCheck">Re-enter New Password:</label>
                                <input id='newPasswordCheck' name="newPasswordCheck" type="password" placeholder="New password" ref={newPasswordCheckRef} required />
                                <input type='hidden' name='_csrf' value={csrfToken} />
                                <button type="submit">Submit</button>
                                {/* {errorMessage && <p className={Styles.error}>{errorMessage}</p>} */}
                            </form>
                        ) : null}
                    </li>
                ))}
                <li style={{color: "white"}} >{successMessage ? successMessage : errorMessage}</li>
            </ul>
        </div>
    );
}

export default UserPage;