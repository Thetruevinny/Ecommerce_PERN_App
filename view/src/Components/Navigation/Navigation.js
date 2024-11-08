import React from 'react';
import { NavLink } from 'react-router-dom';
import Styles from './Navigation.module.css';

function Navigation() {
    return (
        <div className={Styles.nav}>
            <ul>
                <NavLink to='/'><li>Products</li></NavLink>
                <NavLink to='/login'><li>Login</li></NavLink>
                <NavLink to='/cart'><li>Cart</li></NavLink>
            </ul>
        </div>
    );
}

export default Navigation;