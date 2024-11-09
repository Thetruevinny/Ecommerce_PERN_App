import React from 'react';
import Styles from "./RegisterForm.module.css";

function RegisterForm() {
    const url = `http://localhost:50423/api/register`;
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
                <button type="submit">Sign up</button>
            </form>
        </div>
        
    );
};

export default RegisterForm;