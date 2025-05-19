import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";
import { domain } from "./domain";

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [user_id, setUser_id] = useState()
    const [username, setUsername] = useState()
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    const login = async (user) => {
        try {
            const data = await axios.post(`${domain}login`, user, { withCredentials: true });
            setIsAuth(true);
            setMessage("Login successful");
            setIsError(false);  
            window.location.href = "/"
            return true
        } catch (error) {
            setIsAuth(false);
            setMessage(error.response?.data?.message || "Error during login.");
            setIsError(true);  
            return false
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${domain}logout`, {}, { withCredentials: true });
            setIsAuth(false);
            setMessage("Logged out successfully");
            setIsError(false);
            window.location.reload(); //  Recarga la página
        } catch (error) {
            setMessage("Error during logout");
            setIsError(true);
        }
    };


    useEffect(() => {
        axios.get(`${domain}check-auth`, { withCredentials: true })
            .then((response) => {
                setIsAuth(true)
                setUser_id(response.data.user.id)
                setUsername(response.data.user.username)
            })
            .catch(() => setIsAuth(false))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, isError, message, loading, user_id, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
