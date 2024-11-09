import React, {useEffect} from 'react';
import Styles from "./LoginForm.module.css";
import {useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadToken, selectToken } from './TokenSlice';

function LoginForm() {
    const url = `http://localhost:50423/api/login`;
    const navigate = useNavigate();
    const csrfToken = useSelector(selectToken)
    const dispatch = useDispatch();

    const onClickHandler = (event) => {
        navigate('/register');
    }

    useEffect(() => {
        dispatch(loadToken());
    }, []);

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
            <button onClick={onClickHandler}>Register</button>
        </div>
        
    );
};

export default LoginForm;