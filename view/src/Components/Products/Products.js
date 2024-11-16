import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectProducts } from './ProductsSlice';
import Styles from "./Products.module.css";
import { loadProducts } from './ProductsSlice';
import { addCart, getCart } from '../Cart/CartSlice';
import redTshirt from '../../Photos/RedTshirt.png';
import blueTshirt from '../../Photos/BlueTshirt.png';
import redChinos from '../../Photos/RedChinos.png';
import blueChinos from '../../Photos/BlueChinos.png';
import redCap from  '../../Photos/RedCap.png';
import blueCap from  '../../Photos/BlueCap.png';

// Creating Products component to render on homepage
function Products() {
    const products = useSelector(selectProducts);
    const cart = useSelector(getCart);
    const dispatch = useDispatch();
    
    // Handle adding products to cart
    const addToCart = (event) => {
        // Finding specific product that was clicked form product list
        const product = products.filter(product => String(product.id) === String(event.target.id));
        
        // Add product to cart
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
                    <div className={Styles.buttons}>
                        <button id={product.id} >More Info</button>
                        <button id={product.id} onClick={addToCart}>Add Cart</button>
                    </div>
                </div>
            ))}
        </div>
    );

}

export default Products;