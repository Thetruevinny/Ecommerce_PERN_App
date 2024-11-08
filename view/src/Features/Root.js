import React from 'react';
import { Outlet } from 'react-router';
import Navigation from '../Components/Navigation/Navigation.js';
import Name from '../Components/Name/Name.js';


function Root() {
    return (
        <>
            <Navigation />
            <Name />
            <Outlet />
        </>
    );
}

export default Root;