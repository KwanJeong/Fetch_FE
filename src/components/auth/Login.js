import { useContext, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import AuthContext from '../contexts/AuthContext';

export default function Login() {

    const navigate = useNavigate();
    const usernameRef = useRef(null);
    const emaildRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useContext(AuthContext);

    const userLogin = async () => {
        const loginName = usernameRef.current.value;
        const loginEmail = emaildRef.current.value;

        // If the user does not enter a username or password
        if (!loginName || !loginEmail) {
            alert("You must provide both a name and email!");
            return;
        }

        try {
            const response = await fetch(`https://frontend-take-home-service.fetch.com/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: loginName,
                    email: loginEmail
                })
            });

            // If the login was successful
            if (response.status === 200) {
                localStorage.setItem('isLoggedIn', true);
                setIsLoggedIn(true);
                alert("Login successful!");
                navigate("/")
                return;
            } else {
                alert("Login failed");
            }
        } catch(error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <h1>Login</h1>
            <form>
                <label>
                    Username <br />
                    <input id="login_name" ref={usernameRef} />
                </label>
                <br />
                <label>
                    Email <br />
                    <input id="login_email" ref={emaildRef} />
                </label>
            </form>
            <Button onClick={userLogin}> Login </Button>
        </>
    );
}
