import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainPage from './pages/MainPage.tsx';
import DataPage from './pages/Data.tsx';
import TTys from './pages/ttys.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/home",
    element: <MainPage/>
  },
  {
    path: "/insights",
    element: <DataPage/>
  },
  {
    path: "/chat",
    element: <TTys/>
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)