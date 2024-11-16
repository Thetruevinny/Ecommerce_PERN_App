import React, {useEffect} from 'react';
import { useNavigate } from 'react-router';
import celebration from '../Photos/Celebration.png';
import Styles from './Styles/Success.module.css';

// Component for the success page after successful payments
function Success() {
    const navigate = useNavigate();

    // Redirect to home page after a certain amount of time elapsed
    useEffect(() => {
        setTimeout(() => {
            navigate('/');
        }, 5000)
    }, []);

    return (
        <div className={Styles.success}>
            <h1>Success</h1>
            <p>Thank you for completeing an order with us!</p>
            <img src={celebration} alt='celebration emoji'/>
        </div>
    );
}

export default Success;