import React from 'react';
import Products from '../Components/Products/Products';
import Cart from '../Components/Cart/Cart';
import Styles from './Styles/Home.module.css';

function Home() {
    return (
        <div className={Styles.home}>
            <Products />
            <Cart />
        </div>
    )
}

export default Home;