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
import PrevPage from './pages/prev.tsx';
import Layout from './layout.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: (<Layout>
                <App/>
              </Layout>)
  },
  {
    path: "/home",
    element: (<Layout>
                <MainPage/>
              </Layout>)
  },
  {
    path: "/insights",
    element: (<Layout>
                <DataPage/>
              </Layout>)
  },
  {
    path: "/chat",
    element: (<Layout>
                <TTys/>
              </Layout>)
  },
  {
    path: "/prev",
    element: (<Layout>
                <PrevPage/>
              </Layout>)
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)