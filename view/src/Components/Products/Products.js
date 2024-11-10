import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectProducts } from './ProductsSlice';
import Styles from "./Products.module.css";
import { loadProducts } from './ProductsSlice';
import { addCart } from '../Cart/CartSlice';

function Products() {
    const products = useSelector(selectProducts);
    const dispatch = useDispatch();
    const onClickHandler = (event) => {
        const product = products.filter(product => String(product.id) === String(event.target.id));
        console.log(product[0]);
        dispatch(addCart(product[0]));
    };

    useEffect(() => {
        dispatch(loadProducts());
    },[])

    return (
        <div className={Styles.products}>
            {products.map(product => (
                <div className={Styles.product} key={product.name}>
                    <img alt={product.name}></img>
                    <p>{product.name}</p>
                    <p>Price: £{product.price}</p>
                    <p>Product Type: {product.category}</p>
                    <button id={product.id} onClick={onClickHandler}>+</button>
                </div>
            ))}
        </div>
    );

}

export default Products;