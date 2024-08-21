import { useEffect, useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Home from '../../CommonPages/Home';
import axios from 'axios';
import { AuthContext } from "../../ReactContext/UserData";

const PrivateRoute = () => {
    const [auth, setAuth] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setActiveUser, setConfig } = useContext(AuthContext);
    let isMounted = true;

    useEffect(() => {
        const controlAuth = async () => {
            const token = localStorage.getItem("authToken");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            };

            try {
                const { data } = await axios.get("/auth/private", config);

                if (isMounted) {
                    setAuth(true);
                    setActiveUser(data.user);
                    setConfig(config);
                }
            } catch (error) {
                if (isMounted) {
                    localStorage.removeItem("authToken");
                    setAuth(false);
                    setActiveUser({});
                    navigate("/");
                    setError("You are not authorized, please login.");
                }
            }
        };

        controlAuth();

        return () => {
            isMounted = false;
        };
    }, [navigate, setActiveUser, setConfig]);

    return auth ? <Outlet /> : <Home error={error} />;
};

export default PrivateRoute;
