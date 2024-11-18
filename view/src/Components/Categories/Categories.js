import React from "react";
import {useDispatch} from 'react-redux';
import { setCategory } from "./CategoriesSlice";
import Styles from './Categories.module.css';

function Categories() {
    const dispatch = useDispatch();

    const changeCategory = (event) => {
        const category = event.target.value;
        dispatch(setCategory(category));
    };

    return (
        <div className={Styles.categoryContainer}>
            <ul>
            <li><button onClick={changeCategory} value='none'>All</button></li>
            <li><button onClick={changeCategory} value='Shirts'>Shirts</button></li>
            <li><button onClick={changeCategory} value='Trousers'>Trousers</button></li>
            <li><button onClick={changeCategory} value='Hats'>Hats</button></li>
        </ul>
        </div>
    );
}

export default Categories;