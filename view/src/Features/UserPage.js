import { useState } from "react";
import Styles from "./Styles/UserPage.module.css";

function UserPage() {
    const [activeItem, setActiveItem] = useState(null);
    const orders = [{total: 25, products: [{name: 'Blue T-shirt', price: 10, quantity: 2}, {name: 'Blue Cap', price: 7.50, quantity: 1}]}];

    const handleToggle = (index) => {
        setActiveItem((prev) => (prev === index ? null : index));
    };

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
                        onClick={() => handleToggle(index)}
                    >
                        <span className={Styles.triangle}></span>
                        {activeItem === index ? null : item}
                        {(activeItem === index) && (index === 0) ? (
                            <div className={Styles.orders}>
                                <h3>Order History</h3>
                                {/* Will fill out logic for this section later */}
                                {orders.map(order => {
                                    return (
                                        <ul>
                                            {order.products.map(product => <li>{`You bought ${product.quantity} ${product.name}${product.quantity === 1 ? '' : 's'} which cost £${product.price} each.`}</li>)}
                                            <li>Total: £{order.total}</li>
                                        </ul>
                                    );
                                })}
                            </div>
                        ): null}
                        {(activeItem === index) && (index === 1) ? (
                            // Will fill out api call later
                            <div className={Styles.form}>
                                <h3>{item}</h3>
                                <label htmlFor="oldPassword">Current Password:</label>
                                <input id='oldPassword' name="oldPassword" type="password" placeholder="Current password" />
                                <label htmlFor="newPassword">New Password:</label>
                                <input id='newPassword' name="newPassword" type="password" placeholder="New password" />
                                <label htmlFor="newPasswordCheck">Re-enter New Password:</label>
                                <input id='newPasswordCheck' name="newPasswordCheck" type="password" placeholder="New password" />
                                <button>Submit</button>
                            </div>
                        ): null}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserPage;