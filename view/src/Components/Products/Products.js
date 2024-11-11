import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectProducts } from './ProductsSlice';
import Styles from "./Products.module.css";
import { loadProducts } from './ProductsSlice';
import { addCart } from '../Cart/CartSlice';
import redTshirt from '../../Photos/RedTshirt.png';
import blueTshirt from '../../Photos/BlueTshirt.png';
import redChinos from '../../Photos/RedChinos.png';
import blueChinos from '../../Photos/BlueChinos.png';
import redCap from  '../../Photos/RedCap.png';
import blueCap from  '../../Photos/BlueCap.png';

// Creating Products component to render on homepage
function Products() {
    const products = useSelector(selectProducts);
    const dispatch = useDispatch();
    const onClickHandler = (event) => {
        const product = products.filter(product => String(product.id) === String(event.target.id));
        dispatch(addCart(product[0]));
    };

    const imgArray = [redTshirt, blueTshirt, redChinos, blueChinos, redCap, blueCap];

    useEffect(() => {
        dispatch(loadProducts());
    },[])

    return (
        <div className={Styles.products}>
            {products.map(product => (
                <div className={Styles.product} key={product.name}>
                    <img alt={product.name} src={imgArray[product.id - 1]}></img>
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