import React from 'react';
import './App.css';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Root from '../Features/Root';
import Home from '../Features/Home';
import Login from '../Features/Login';
import Register from '../Features/Register';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />}>
    <Route index element={<Home />} />
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />
  </Route>
));

function App() {
  return (
    <div className="App">
      <RouterProvider router = {router} />
    </div>
  );
}

export default App;
