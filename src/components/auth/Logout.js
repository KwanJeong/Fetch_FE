import React, { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../contexts/AuthContext';

export default function Logout() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useContext(AuthContext);

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
                    method: 'POST',
                    credentials: "include",
                });
                
                if(response.status === 401) {
                    // If the user is not authenticated, navigate to the login page
                    navigate("/login");
                } else if(response.ok) {
                    // If the logout was successful, update the authentication state
                    setIsLoggedIn(false);
                } 
            } catch (err) {
                // handle network error
                console.error(err);
            }
        }
        // Call the logout function when the component mounts
        logout();
    }, [navigate, setIsLoggedIn]);

    return (
        <>
            <h1>Logout</h1>
            <p>You have been successfully logged out.</p>
        </>
    );
}
