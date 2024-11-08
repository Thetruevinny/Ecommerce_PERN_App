import React from 'react';
import './App.css';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Root from '../Features/Root';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />}>

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
