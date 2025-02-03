import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
const LogoutButton = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
      await signOut();  // This signs out the user
      navigate('/sign-in');  // Redirect user to the sign-in page after logging out
    } catch (error) {
        console.error('Error during sign out:', error);
    }
    };

    return (
        <button onClick={handleLogout}>
            Log Out
        </button>
    );
};

export default LogoutButton;
