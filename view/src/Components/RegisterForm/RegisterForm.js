import React from 'react';
import Styles from "./RegisterForm.module.css";
import { useSelector } from 'react-redux';
import { selectToken } from '../LoginForm/TokenSlice';
import googleLogo from '../../Photos/Google.webp';

function RegisterForm() {
    const url = `http://localhost:50423/api/register`;
    const csrfToken = useSelector(selectToken);
    const GoogleHandler = async () => {
        window.location.href = 'http://localhost:50423/api/oauth/google';
    }

    return (
        <div className={Styles.register}>
            <h2>Register</h2>
            <form action={url} method='POST'>
                <seciton>
                    <label for="email">Email: </label>
                    <input id='email' name='email' type='email' autoComplete='email' required />
                </seciton>
                <seciton>
                    <label for="password">Password: </label>
                    <input id='password' name='password' type='password' autoComplete='password' required />
                </seciton>
                <input type='hidden' name='_csrf' value={csrfToken} />
                <button type="submit">Sign up</button>
            </form>
            <h2>Or Register via:</h2>
            <button onClick={GoogleHandler}><img src={googleLogo} alt='Google Logo' className={Styles.smallLogo}></img></button>
        </div>
        
    );
};

export default RegisterForm;