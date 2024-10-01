import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import MainPage from './pages/MainPage.tsx';
import DataPage from './pages/Data.tsx';
import TTys from './pages/ttys.tsx';
import PrevPage from './pages/prev.tsx';
import Layout from './layout.tsx';


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
    element: (<SignedIn>
                <Layout>
                  <MainPage/>
                </Layout>
              </SignedIn>)
  },
  {
    path: "/insights",
    element: (<SignedIn>
                <Layout>
                  <DataPage/>
                </Layout>
              </SignedIn>)
  },
  {
    path: "/chat",
    element: (<SignedIn>
                <Layout>
                  <TTys/>
                </Layout>
              </SignedIn>)
  },
  {
    path: "/prev",
    element: (<SignedIn>
                <Layout>
                  <PrevPage/>
                </Layout>
              </SignedIn>)
  },
  {
    path: '/sign-in',
    element: <SignInPage /> /* Sign In page */
  },
  {
    path: '/sign-up',
    element: <SignUpPage /> /* Sign Up page */
  },
  {
    path: '*',
    element: (
      <SignedOut>
        <RedirectToSignIn /> {/* Redirect non-signed-in users to the sign-in page */}
      </SignedOut>
    ),
  },
]);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>,
);