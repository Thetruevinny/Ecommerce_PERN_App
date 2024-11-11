import React from 'react';
import { Outlet } from 'react-router';
import Navigation from '../Components/Navigation/Navigation.js';
import Name from '../Components/Name/Name.js';

// Creating root component has outlet component for the different child components to be rendered.
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