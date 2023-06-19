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
                    // navigate to login page, show an error message, etc.
                    navigate("/login");
                } else if(response.ok) {
                    setIsLoggedIn(false);
                } 
            } catch (err) {
                // handle network error
                console.error(err);
            }
        }

        logout();
    }, [navigate, setIsLoggedIn]);

    return (
        <>
            <h1>Logout</h1>
            <p>You have been successfully logged out.</p>
        </>
    );
}
