import React from 'react';
import './App.css';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Root from '../Features/Root';
import Home from '../Features/Home';
import Login from '../Features/Login';
import Register from '../Features/Register';
import CartPage from '../Features/CartPage';
import Success from '../Features/Success';
import ModifyProduct from '../Features/ModifyProduct';
import CreateProduct from '../Features/CreateProduct';
import UserPage from '../Features/UserPage';

// Set-up router and various routes
const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />}>
    <Route index element={<Home />} />
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />
    <Route path='cart' element={<CartPage />} />
    <Route path='success' element={<Success />} />
    <Route path='modify/:id' element={<ModifyProduct />} />
    <Route path='create' element={<CreateProduct />} />
    <Route path='user' element={<UserPage />} />
  </Route>
));

// App component which mounts router
function App() {
  return (
    <div className="App">
      <RouterProvider router = {router} />
    </div>
  );
}

export default App;
