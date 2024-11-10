import React, {useEffect} from 'react';
import Styles from "./LoginForm.module.css";
import {useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadToken, selectToken } from './TokenSlice';
import googleLogo from '../../Photos/Google.webp';

function LoginForm() {
    const url = `http://localhost:50423/api/login`;
    const navigate = useNavigate();
    const csrfToken = useSelector(selectToken)
    const dispatch = useDispatch();

    // Handle Register button click
    const onClickHandler = (event) => {
        navigate('/register');
    }
    // To Load CSRF token for use in hiden input
    useEffect(() => {
        dispatch(loadToken());
    }, []);

    // Handle Oauth
    const GoogleHandler = async () => {
        window.location.href = 'http://localhost:50423/api/oauth/google';
    }

    return (
        <div className={Styles.login}>
            <h2>Login</h2>
            <form action={url} method='POST'>
                <section>
                    <label for="email">Email: </label>
                    <input id='email' name='email' type='email' autoComplete='email' required />
                </section>
                <section>
                    <label for="password">Password: </label>
                    <input id='password' name='password' type='password' autoComplete='password' required />
                </section>
                <input type='hidden' name='_csrf' value={csrfToken} />
                <button type="submit">Sign in</button>
            </form>
            <h2 className={Styles.alternatives}>Or Login Via:</h2>
            <button onClick={GoogleHandler} className={Styles.google}><img src={googleLogo} alt='Google Logo' className={Styles.smallLogo}></img></button>
            <button onClick={onClickHandler}>Register</button>
        </div>
        
    );
};

export default LoginForm;