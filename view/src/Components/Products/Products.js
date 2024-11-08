import React from 'react';
import { useSelector } from "react-redux";
import { selectProducts } from './ProductsSlice';
import Styles from "./Products.module.css";

function Products() {
    const products = useSelector(selectProducts);

    return (
        <div className={Styles.products}>
            {products.map(product => (
                <div className={Styles.product} key={product.name}>
                    <img alt={product.name}></img>
                    <p>{product.name}</p>
                    <p>Price: {product.price}</p>
                    <p>Product Type: {product.category}</p>
                </div>
            ))}
        </div>
    );

}

export default Products;