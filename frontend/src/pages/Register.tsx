import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";


function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    async function handleRegister() {
        try {
            const data = await authService.register({
                username, email, password
            });

            localStorage.setItem("token", data.token);

            navigate("/");

        } catch (err) {
            console.error(err);

            setError("Registrazione fallita");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>

                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {
                    error && (
                        <p>{error}</p>
                    )
                }

                <button onClick={handleRegister}>Register</button>

                <button onClick={() => navigate("/login")}>Already have an account?</button>
            </div>
        </div>
    );
}

export default Register;