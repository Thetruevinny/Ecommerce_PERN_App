import React, {useState, useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Styles from './Navigation.module.css';
import {useDispatch} from 'react-redux';
import { refreshCart } from '../Cart/CartSlice';
import userIcon from '../../Photos/UserIcon.png';

// Creating Navbar in Root component
function Navigation() {
    // Checking if user is logged in
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Function call to api to see if user is verfied 
    const checkAuth = async () => {
        const response = await fetch('http://localhost:50423/api/check/auth', {
            credentials: 'include',
        });
        const json = await response.json();
        setVerified(json.result);
    };

    // Call checkauth when component loads
    useEffect(() => {
        checkAuth();
    }, []);

    // Handling logouts
    const onLogout = async () => {
        const response = await fetch('http://localhost:50423/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        if (response.ok) {
            setVerified(false);
            localStorage.clear();
            dispatch(refreshCart());
            navigate('/login');
        }
    }
    const navigateUser = () => {
        navigate('/user');
    }

    return (
        <div className={Styles.nav}>
            <ul>
                <NavLink to='/'><li>Products</li></NavLink>
                <NavLink to='/login'><li>Login</li></NavLink>
                <NavLink to='/cart'><li>Cart</li></NavLink>
                {verified ? <button onClick={onLogout}>Logout</button> : null}
            </ul>
            {verified ? 
                <div onClick={navigateUser} className={Styles.user}>
                    <img src={userIcon} alt='User Image Icon' />
                </div> 
            : null}
        </div>
    );
}

export default Navigation;