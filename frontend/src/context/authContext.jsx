import { Navigate, Outlet } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    return context
}

const AuthProvider = () => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    const login = async () => {
        try {
            const data = await axios.post("http://localhost:3000/login", user, {withCredentials: true})
            setIsAuth(true);
        } catch (error) {
            setIsAuth(false);
        }
        

    }

    useEffect(() => {
        axios.get("http://localhost:3000/check-auth", { withCredentials: true })
        .then(() => setAuth(true))
        .catch(() => setAuth(false))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    return auth ? <Outlet /> : <Navigate to="/login" />;  
};

export default AuthContext;
