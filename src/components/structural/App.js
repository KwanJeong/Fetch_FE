import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import Login from '../auth/Login';
import Logout from '../auth/Logout';
import {AuthContext}  from "../contexts/AuthContext";
import DogsList from '../content/DogList';
import DogsMatch from '../content/DogsMatch';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedState = localStorage.getItem('isLoggedIn');
    if (savedState !== null) {
      return JSON.parse(savedState);
    } else {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);


  return (
    <AuthContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DogsList />} />
            <Route path="/match" element={<DogsMatch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
