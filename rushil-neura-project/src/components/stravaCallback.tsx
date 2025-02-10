import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const StravaCallback: React.FC = () => {
    const navigate = useNavigate();
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchToken = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log(`code recd from strava: ${code}`)
        if (code) {
        try {
          // Send the code to the backend to get the access token
            const token = await getToken();
            
             //'http://localhost:5000/api/auth/strava/callback'
            await axios.post( `${import.meta.env.VITE_BACKEND_URL}/api/auth/strava/callback`,
              { code: code},
              {
              headers: {
              Authorization: `Bearer ${token}`,
              },
            });
            navigate('/home');
        } catch (error) {
            console.error('Error authenticating with Strava', error);
        }
        }
    };

    fetchToken();
    }, [navigate]);

    return <div>Authenticating with Strava...</div>;
};

export default StravaCallback;
