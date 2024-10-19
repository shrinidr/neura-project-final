import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import MainPage from './pages/MainPage.tsx';
import DataPage from './pages/Data.tsx';
import TTys from './pages/ttys.tsx';
import PrevPage from './pages/prev.tsx';
import Layout from './layout.tsx';
import { SignedOut } from '@clerk/clerk-react';
import { RedirectToSignIn } from '@clerk/clerk-react';
const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


const router = createBrowserRouter([
  {
    path: "/",
    element: (<Layout>
                <App/>
              </Layout>)
  },
  {
    path: "/home",
    element: (
                <Layout>
                  <MainPage/>
                </Layout>
              )
  },
  {
    path: "/insights",
    element: (
                <Layout>
                  <DataPage/>
                </Layout>
              )
  },
  {
    path: "/chat",
    element: (
                <Layout>
                  <TTys/>
                </Layout>
              )
  },
  {
    path: "/prev",
    element: (
                <Layout>
                  <PrevPage/>
                </Layout>
              )
  },
  {
    path: '/sign-in',
    element: <SignInPage />
  },
  {
    path: '/sign-up',
    element: <SignUpPage />
  },
  {
    path: '*',
    element: (
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    ),
  }

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>,
);
