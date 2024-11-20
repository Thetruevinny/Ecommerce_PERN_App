import React, {useEffect} from 'react';
import Styles from "./Styles/ModifyProducts.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { loadToken, selectToken } from '../Components/LoginForm/TokenSlice';

function CreateProduct() {
    const csrfToken = useSelector(selectToken)
    const dispatch = useDispatch();
    
    const url = `http://localhost:50423/api/products/create`;

    // To Load CSRF token for use in hiden input
    useEffect(() => {
        dispatch(loadToken());
    }, []);

    return (
        <div className={Styles.modify}>
            <h2>Modify Product</h2>
            <form action={url} method='POST'>
                <section>
                    <label htmlFor="name">Name: </label>
                    <input id='name' name='name' type='text' required/>
                </section>
                <section>
                    <label htmlFor="price">Price: </label>
                    <input id='price' name='price' type='number' step="0.01" required/>
                </section>
                <section>
                    <label for="cateogry">Category: </label>
                    <input id='category' name='category' type='text' required />
                </section>
                <section>
                    <label for="quantity">Quantity: </label>
                    <input id='quantity' name='quantity' type='number' required />
                </section>
                <section>
                    <label for="description">Description: </label>
                    <input id='description' name='description' type='text' defaultValue='Coming Soon' />
                </section>
                <input type='hidden' name='_csrf' value={csrfToken} />
                <button type="submit">Create</button>
            </form>
        </div>
        
    );
};

export default CreateProduct;