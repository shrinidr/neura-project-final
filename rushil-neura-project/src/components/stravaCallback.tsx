import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StravaCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchToken = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log(`code recd from strava: ${code}`)
        if (code) {
        try {
          // Send the code to the backend to get the access token
            await axios.post('http://localhost:5000/api/auth/strava/callback', { code });
          // Redirect the user to the dashboard or home page
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