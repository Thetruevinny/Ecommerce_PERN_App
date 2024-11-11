import React, {useState, useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Styles from './Navigation.module.css';

// Creating Navbar in Root component
function Navigation() {
    // Checking if user is logged in
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();

    // Function call to api to see if user is verfied 
    const checkAuth = async () => {
        const response = await fetch('http://localhost:50423/api/check', {
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
            navigate('/login');
        }
    }

    return (
        <div className={Styles.nav}>
            <ul>
                <NavLink to='/'><li>Products</li></NavLink>
                <NavLink to='/login'><li>Login</li></NavLink>
                <NavLink to='/cart'><li>Cart</li></NavLink>
                {verified ? <button onClick={onLogout}>Logout</button> : null}
            </ul>
        </div>
    );
}

export default Navigation;