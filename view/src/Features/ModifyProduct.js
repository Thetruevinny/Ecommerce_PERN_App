import React, {useEffect} from 'react';
import Styles from "./Styles/ModifyProducts.module.css";
import {useParams} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadToken, selectToken } from '../Components/LoginForm/TokenSlice';

function ModifyProduct() {
    const csrfToken = useSelector(selectToken)
    const dispatch = useDispatch();
    const {id} = useParams();
    
    const url = `http://localhost:50423/api/products/modify/${id}`;

    // To Load CSRF token for use in hiden input
    useEffect(() => {
        dispatch(loadToken());
    }, []);

    return (
        <div className={Styles.modify}>
            <h2>Modify Product</h2>
            <form action={url} method='POST'>
                <section>
                    <label htmlFor="price">Price: </label>
                    <input id='price' name='price' type='number' defaultValue={0}/>
                </section>
                <section>
                    <label for="quantity">Quantity: </label>
                    <input id='quantity' name='quantity' type='number' defaultValue={0} />
                </section>
                <section>
                    <label for="description">Description: </label>
                    <input id='description' name='description' type='text' defaultValue='Unchanged' />
                </section>
                <input type='hidden' name='_csrf' value={csrfToken} />
                <button type="submit">Modify</button>
            </form>
        </div>
        
    );
};

export default ModifyProduct;