import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectProducts } from './ProductsSlice';
import Styles from "./Products.module.css";
import { loadProducts } from './ProductsSlice';
import { addCart, getCart } from '../Cart/CartSlice';
import { getCategory } from '../Categories/CategoriesSlice';
import redTshirt from '../../Photos/RedTshirt.png';
import blueTshirt from '../../Photos/BlueTshirt.png';
import redChinos from '../../Photos/RedChinos.png';
import blueChinos from '../../Photos/BlueChinos.png';
import redCap from  '../../Photos/RedCap.png';
import blueCap from  '../../Photos/BlueCap.png';

// Creating Products component to render on homepage
function Products() {
    let products = useSelector(selectProducts);
    // const cart = useSelector(getCart);
    let category = useSelector(getCategory);
    const dispatch = useDispatch();
    const [detailView, setDetailView] = useState(false);
    const [productId, setProductId] = useState(null);
    const [admin, setAdmin] = useState(false);
    
    // Handle adding products to cart
    const addToCart = (event) => {
        // Finding specific product that was clicked form product list
        const product = products.filter(product => String(product.id) === String(event.target.id));
        
        // Add product to cart
        dispatch(addCart(product[0]));
    };

    // Handle Changing width when more info button clicked
    const changeWidth = (event) => {
        const productDiv = document.getElementById(event.target.id);
        const productRect = productDiv.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        
        // Determine if the product is close to the screen edges
        const isCloseToLeftEdge = productRect.left < screenWidth / 4;
        const isCloseToRightEdge = productRect.right > (screenWidth * 3) / 4;
        
        // Remove previous expansion if any
        if (productDiv.style.width === '150%') {
            productDiv.style.width = null;
            productDiv.style.zIndex = null;
            productDiv.style.transform = null;
            setDetailView(false);
            
        } else {
            // Expand product and adjust direction
            productDiv.style.zIndex = 1;
            
            if (isCloseToLeftEdge) {
                // Expand to the right
                // productDiv.style.transform = 'translateX(0%)';
            } else if (isCloseToRightEdge) {
                // Expand to the left
                productDiv.style.transform = 'translateX(-50%)';
            }
            productDiv.style.width = '150%';
            
            setTimeout(() => {setDetailView(true);}, 200);
            setProductId(event.target.id);
        }
    };

    // Img array for products
    const imgArray = [redTshirt, blueTshirt, redChinos, blueChinos, redCap, blueCap];

    // Checking if user is an admin
    const checkAdmin = async () => {
        try {

            const response = await fetch('http://localhost:50423/api/check/admin', {
                credentials: 'include',
            });
    
            if (response.ok) {
                const json = await response.json();
                console.log(json.result);
                setAdmin(json.result);
            }
        } catch (err) {
            console.log(err);

        }
        
        
    }

    // Handles deletion of a product when admin requests it.
    const deleteProduct = async (event) => {
        try {
            const response = await fetch(`http://localhost:50423/api/products/${event.target.id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error with the request.');
            }
        } catch (err) {
            console.log(err);
            alert(err);
        }
    }

    useEffect(() => {
        // Load products to display
        dispatch(loadProducts());

        // Check if user is admin
        checkAdmin();
    },[])

    if (category !== 'none') {
        products = products.filter(product => product.category === category);
    }

    return (
        <div className={Styles.products}>
            {products.map(product => (
                <div className={Styles.product} key={product.name} id = {product.id}>
                    <img alt={product.name} src={imgArray[product.id - 1]}></img>
                    <p>{product.name}</p>
                    <p>Price: £{product.price}</p>
                    <p>Product Type: {product.category}</p>
                    {(detailView && (String(productId) === String(product.id))) ? <p>{product.description}</p> : null}
                    <div className={Styles.buttons}>
                        <button id={product.id} onClick={changeWidth}>{detailView && ((String(productId) === String(product.id)))? 'Less Info' : 'More Info'}</button>
                        <button id={product.id} onClick={addToCart}>Add Cart</button>
                    </div>
                    {admin ? (
                        <div className={Styles.buttons}>
                            <button id={product.id} >Modify Item</button>
                            <button id={product.id} onClick={deleteProduct}>Delete Item</button>
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );

}

export default Products;