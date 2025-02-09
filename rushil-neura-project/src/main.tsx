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
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import StravaCallback from './components/stravaCallback.tsx';
import MoreInsights from './pages/moreInsights.tsx';
import { Analytics } from '@vercel/analytics/react';
import Contact from './pages/Contact.tsx';

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
    element: (  <ProtectedRoute>
                <Layout>
                  <MainPage/>
                </Layout>
                </ProtectedRoute>

              )
  },
  {
    path: "/insights",
    element: (  <ProtectedRoute>
                <Layout>
                  <DataPage/>
                </Layout>
                </ProtectedRoute>

              )
  },
  {
    path: "/chat",
    element: (  <ProtectedRoute>
                <Layout>
                  <TTys/>
                </Layout>
                </ProtectedRoute>

              )
  },
  {
    path: "/prev",
    element: (  <ProtectedRoute>
                <Layout>
                  <PrevPage/>
                </Layout>
                </ProtectedRoute>

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
  },

  {
    path: '/exchange_token',
    element: (
        <StravaCallback/>

    ),
  },
  {
    path: '/more_insights',
    element: (<ProtectedRoute>
              <Layout>
                <MoreInsights/>
              </Layout>
            </ProtectedRoute>)
  },
  {
    path: "/contact",  // Define the path you want for this page
    element: (
      <Layout>
        <Contact/>  {/* This will render the Contact page inside the Layout */}
      </Layout>
    ),
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <RouterProvider router={router} />
      <Analytics /> {/* Add Analytics component here */}
    </ClerkProvider>
  </React.StrictMode>,
);

