import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import AuthContext from '../contexts/AuthContext';
import DogsMatchContext from "../contexts/DogsMatchContext";

function Layout({ children }) { // Add children as a prop here
    const [isLoggedIn, setIsLoggedIn] = useContext(AuthContext);
    // const [matchedDogs, setMatchedDogs] = useState([]);

    const [matchedDogs, setMatchedDogs] = useState(() => {
        const savedDogs = localStorage.getItem('matchedDogs');
        if (savedDogs !== null) {
            return JSON.parse(savedDogs);
        } else {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('matchedDogs', JSON.stringify(matchedDogs));
    }, [matchedDogs]);

    return (
        <div>
            
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>Fetch</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Search</Nav.Link>
                        {
                            isLoggedIn ? (
                                <>
                                <Nav.Link as={Link} to="logout">Logout</Nav.Link>
                                <Nav.Link as={Link} to="match">Match</Nav.Link>
                                </>
                            ):(
                                <Nav.Link as={Link} to="login">Login</Nav.Link>
                            )
                        }         
                        

                    </Nav>
                </Container>
            </Navbar>
            
            <div className="body-spacer">
                <DogsMatchContext.Provider value={[matchedDogs, setMatchedDogs]}>
                    {children}
                </DogsMatchContext.Provider>
            </div>
            
        </div>
    );
}



export default Layout;

