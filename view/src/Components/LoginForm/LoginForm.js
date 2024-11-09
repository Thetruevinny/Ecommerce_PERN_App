import React from 'react';
import Styles from "./LoginForm.module.css";
import {useNavigate} from 'react-router-dom';

function LoginForm() {
    const url = `http://localhost:50423/api/login`;
    const navigate = useNavigate();

    const onClickHandler = (event) => {
        navigate('/register');
    }
    return (
        <div className={Styles.login}>
            <h2>Login</h2>
            <form action={url} method='POST'>
                <seciton>
                    <label for="email">Email: </label>
                    <input id='email' name='email' type='email' autoComplete='email' required />
                </seciton>
                <seciton>
                    <label for="password">Password: </label>
                    <input id='password' name='password' type='password' autoComplete='password' required />
                </seciton>
                <button type="submit">Sign in</button>
            </form>
            <button onClick={onClickHandler}>Register</button>
        </div>
        
    );
};

export default LoginForm;