import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import Login from '../auth/Login';
import Logout from '../auth/Logout';
import { AuthContext } from "../contexts/AuthContext";
import DogsList from '../content/DogList';
import DogsMatch from '../content/DogsMatch';
import ErrorPage from '../content/ErrorPage';


function App() {

    // State to track the user's authentication status
    // const [isLoggedIn, setIsLoggedIn] = useState(() => {
    //     const savedState = localStorage.getItem('isLoggedIn');
    //     if (savedState !== null) {
    //         return JSON.parse(savedState);
    //     } else {
    //         return false;
    //     }
    // });

    // useEffect(() => {
    //     // Save the authentication status to localStorage whenever it changes
    //     localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    // }, [isLoggedIn]);

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const savedState = localStorage.getItem('isLoggedIn');
        if (savedState !== null) {
            return JSON.parse(savedState);
        } else {
            return false;
        }
    });

    useEffect(() => {
        const savedState = localStorage.getItem('isLoggedIn');
        if (savedState !== null) {
            setIsLoggedIn(JSON.parse(savedState));
        }
    }, []);

    return (
        // Provide the authentication state and setter function via context
        <AuthContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<DogsList />} />
                        <Route path="/match" element={<DogsMatch />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/error" element={<ErrorPage />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
